// Hook optimizado para cache de datos del usuario
import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';

interface CardData {
  id: string;
  title: string;
  name: string;
  profession: string;
  views: number;
  clicks: number;
  isActive: boolean;
  createdAt: string;
}

interface PlanLimits {
  maxCards: number;
  [key: string]: unknown;
}

interface UserData {
  cards: CardData[];
  planLimits: PlanLimits | null;
  isLoading: boolean;
  refetch: () => void;
}

// Cache global para evitar múltiples fetches
let globalCache: {
  cards: CardData[];
  planLimits: PlanLimits | null;
  lastFetch: number;
} | null = null;

const CACHE_DURATION = 30000; // 30 segundos

export function useUserData(): UserData {
  const { data: session } = useSession();
  const [cards, setCards] = useState<CardData[]>([]);
  const [planLimits, setPlanLimits] = useState<PlanLimits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }

    // Check cache first
    const now = Date.now();
    if (!forceRefresh && globalCache && (now - globalCache.lastFetch) < CACHE_DURATION) {
      setCards(globalCache.cards);
      setPlanLimits(globalCache.planLimits);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Fetch both APIs in parallel
      const [cardsResponse, limitsResponse] = await Promise.all([
        fetch('/api/cards', { credentials: 'same-origin' }),
        fetch('/api/user/plan-limits', { credentials: 'same-origin' })
      ]);

      const cardsData = cardsResponse.ok ? await cardsResponse.json() : [];
      const limitsData = limitsResponse.ok ? await limitsResponse.json() : null;

      const finalCards = Array.isArray(cardsData) ? cardsData : [];

      // Update cache
      globalCache = {
        cards: finalCards,
        planLimits: limitsData,
        lastFetch: now
      };

      setCards(finalCards);
      setPlanLimits(limitsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    cards,
    planLimits,
    isLoading,
    refetch
  };
}
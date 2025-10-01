'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface AppInitializerProps {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { data: session, status } = useSession();

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    // Only run on client side after mount
    if (!isMounted) return;
    
    // Verificar si ya se inicializó en esta sesión
    const hasInitialized = sessionStorage.getItem('appInitialized');
    
    if (hasInitialized === 'true') {
      // Ya se inicializó, mostrar contenido inmediatamente
      setIsInitialized(true);
      setShowContent(true);
      return;
    }

    // Esperar a que NextAuth esté listo
    if (status !== 'loading') {
      // Si hay usuario logueado, asegurar que tenga trial iniciado
      if (session?.user?.id) {
        ensureUserTrialSetup(session.user.id);
      }
      
      // NextAuth está listo, inicializar la app
      setIsInitialized(true);
    }
  }, [status, isMounted]);

  // Función para asegurar que el usuario tenga trial configurado
  const ensureUserTrialSetup = async (userId: string) => {
    try {
      const response = await fetch('/api/user/ensure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Usuario inicializado:', userData);
      }
    } catch (error) {
      console.error('Error inicializando usuario:', error);
    }
  };

  const handleLoadingComplete = () => {
    // Marcar como inicializado para futuras cargas
    sessionStorage.setItem('appInitialized', 'true');
    setShowContent(true);
  };

  // Show loading during SSR and until mounted
  if (!isMounted || status === 'loading' || !isInitialized) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e)',
        backgroundSize: '400% 400%',
        animation: 'gradientAnimation 15s ease infinite',
        zIndex: 9999
      }}>
        {isMounted && (
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        )}
      </div>
    );
  }

  // Si ya se mostró el loading, mostrar contenido inmediatamente
  if (showContent) {
    return <>{children}</>;
  }

  // Primera vez, mostrar loading completo
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(-45deg, #00c6ff, #0072ff, #8e2de2, #4a00e0)',
      zIndex: 9999
    }}>
      <LoadingScreen onLoadingComplete={handleLoadingComplete} />
    </div>
  );
}
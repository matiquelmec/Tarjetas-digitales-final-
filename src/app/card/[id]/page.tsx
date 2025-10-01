'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import BusinessCard from '@/features/digital-card/components/BusinessCard';

interface CardData {
  id: string;
  title: string;
  name: string;
  profession: string;
  about?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  photoUrl?: string;
  location?: string;
  appointmentLink?: string;
  professionalDetails?: string;
  cardBackgroundColor: string;
  cardTextColor: string;
  buttonSecondaryColor: string;
  buttonNormalBackgroundColor: string;
  buttonSecondaryHoverColor: string;
  pageBackgroundColor: string;
  enableHoverEffect: boolean;
  enableGlassmorphism: boolean;
  enableSubtleAnimations: boolean;
  enableBackgroundPatterns: boolean;
  enableAIPalette: boolean;
  // Nuevos campos para efectos visuales (Agosto 2025)
  fontFamily?: string;
  enableParticles?: boolean;
  particleType?: string;
  particleDensity?: number;
  particleCount?: number;
  template?: string;
  // Campos para efectos de ambiente (Agosto 2025)
  enableAnimatedGradient?: boolean;
  animatedGradientType?: string;
  animatedGradientSpeed?: number;
  animatedGradientIntensity?: number;
  animatedGradientOpacity?: number;
  enableFloatingShapes?: boolean;
  floatingShapesType?: string;
  floatingShapesCount?: number;
  floatingShapesSpeed?: number;
  ambientIntensity?: number;
  ambientOpacity?: number;
  views: number;
  clicks: number;
}

export default function PublicCardPage() {
  const params = useParams();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCard = async (cardId: string) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`);
      if (response.ok) {
        const data = await response.json();
        setCard(data);
      } else if (response.status === 404) {
        setError('Card not found');
      } else {
        setError('Error loading card');
      }
    } catch (error) {
      console.error('Error fetching card:', error);
      setError('Error loading card');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchCard(params.id as string);
    }
  }, [params.id]);

  // Update page title and meta tags
  useEffect(() => {
    if (card) {
      document.title = `${card.name} - ${card.profession} | Tarjeta Digital`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Conoce a ${card.name}, ${card.profession}. ${card.about || 'Tarjeta digital profesional.'}`
        );
      }
    }
  }, [card]);


  // Card not found error state

  if (error || !card) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: '#121212' }}>
        <div className="text-white text-center">
          <div style={{ fontSize: '4rem' }} className="mb-3">💼</div>
          <h2>{error || 'Tarjeta no encontrada'}</h2>
          <p className="text-white-50">La tarjeta que buscas no existe o ha sido eliminada.</p>
          <Link href="/" className="btn btn-primary mt-3">
            Volver al inicio
          </Link>
        </div>
      </Container>
    );
  }

  const pageBackgroundColor = card.pageBackgroundColor || '#121212';

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        body {
          margin: 0;
          padding: 0;
          background: ${pageBackgroundColor} !important;
        }
        html {
          background: ${pageBackgroundColor} !important;
        }
        #__next {
          background: ${pageBackgroundColor} !important;
        }
        
        /* 🎨 RESPIRACIÓN VISUAL CRÍTICA - Espaciado viewport optimizado */
        .indi-viewport-container {
          padding: 4rem 6rem !important;
        }
        
        @media (max-width: 768px) {
          .indi-viewport-container {
            padding: 2rem 1.5rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .indi-viewport-container {
            padding: 1.5rem 1rem !important;
          }
        }
      `}} />
      <div style={{ 
        backgroundColor: pageBackgroundColor,
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1
      }} />
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 indi-viewport-container" style={{ 
        background: pageBackgroundColor,
        position: 'relative',
        zIndex: 1
      }}>
      <BusinessCard
        name={card.name}
        title={card.title}
        about={card.about || ''}
        location={card.location || ''}
        whatsapp={card.phone || ''}
        email={card.email || ''}
        photoUrl={card.photoUrl || ''}
        cardBackgroundColor={card.cardBackgroundColor || '#1F1F1F'}
        cardTextColor={card.cardTextColor || '#EAEAEA'}
        pageBackgroundColor={card.pageBackgroundColor || '#121212'}
        enableHoverEffect={card.enableHoverEffect || false}
        enableGlassmorphism={card.enableGlassmorphism || false}
        enableSubtleAnimations={card.enableSubtleAnimations || false}
        enableBackgroundPatterns={card.enableBackgroundPatterns || false}
        whatsappShareUrl=""
        appointmentLink={card.appointmentLink || card.website || ''}
        professionalDetails={card.professionalDetails || ''}
        linkedin={card.linkedin || ''}
        instagram={card.instagram || ''}
        twitter={card.twitter || ''}
        facebook={card.facebook || ''}
        website={card.website || ''}
        buttonSecondaryColor={card.buttonSecondaryColor || '#00F6FF'}
        buttonNormalBackgroundColor={card.buttonNormalBackgroundColor || '#1F1F1F'}
        buttonSecondaryHoverColor={card.buttonSecondaryHoverColor || '#00D1DB'}
        // Nuevos campos para efectos visuales (Agosto 2025)
        fontFamily={card.fontFamily || 'Inter'}
        enableParticles={card.enableParticles || false}
        particleType={card.particleType || 'floating'}
        particleDensity={card.particleDensity || 3}
        particleCount={card.particleCount || 50}
        template={card.template || 'modern'}
        // Campos para efectos de ambiente (Agosto 2025)
        enableAnimatedGradient={card.enableAnimatedGradient || false}
        animatedGradientType={card.animatedGradientType || 'aurora'}
        animatedGradientSpeed={card.animatedGradientSpeed || 3}
        animatedGradientIntensity={card.animatedGradientIntensity || 3}
        animatedGradientOpacity={card.animatedGradientOpacity || 0.5}
        enableFloatingShapes={card.enableFloatingShapes || false}
        floatingShapesType={card.floatingShapesType || 'geometric'}
        floatingShapesCount={card.floatingShapesCount || 3}
        floatingShapesSpeed={card.floatingShapesSpeed || 3}
        ambientIntensity={card.ambientIntensity || 3}
        ambientOpacity={card.ambientOpacity || 0.5}
      />
      </Container>
    </>
  );
}
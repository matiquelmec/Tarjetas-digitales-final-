'use client';

import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

interface PageTransitionProps {
  children: React.ReactNode;
  showLoadingOnMount?: boolean;
}

export default function PageTransition({ 
  children, 
  showLoadingOnMount = true 
}: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(showLoadingOnMount);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Si no debe mostrar loading, mostrar contenido inmediatamente
    if (!showLoadingOnMount) {
      setShowContent(true);
      return;
    }

    // Verificar si ya se mostró el loading en esta sesión
    const hasShownLoading = sessionStorage.getItem('hasShownLoading');
    if (hasShownLoading === 'true') {
      setIsLoading(false);
      setShowContent(true);
      return;
    }
  }, [showLoadingOnMount]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Marcar que ya se mostró el loading en esta sesión
    sessionStorage.setItem('hasShownLoading', 'true');
    
    // Pequeña pausa para transición suave
    setTimeout(() => {
      setShowContent(true);
    }, 200);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div 
      className={`page-content ${showContent ? 'page-visible' : 'page-hidden'}`}
      style={{
        opacity: showContent ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        minHeight: '100vh'
      }}
    >
      {children}
    </div>
  );
}
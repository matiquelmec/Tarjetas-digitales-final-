/**
 * AuthorityParticles Component
 * Sistema de partículas que transmite presencia ejecutiva y liderazgo
 */

'use client';

import React from 'react';
import { useAuthorityParticles } from '@/hooks/useAuthorityParticles';

interface AuthorityParticlesProps {
  // Configuración básica
  enabled: boolean;
  theme: string;
  
  // Configuración de autoridad
  intensity?: 'minimal' | 'balanced' | 'prominent';
  interactionMode?: 'hover' | 'always' | 'strategic';
  
  // Dimensiones del contenedor
  containerWidth?: number;
  containerHeight?: number;
  
  // Eventos de interacción
  onHover?: boolean;
  onFocus?: boolean;
  
  // Override para testing
  particleCount?: number;
  
  // Props adicionales
  className?: string;
  style?: React.CSSProperties;
}

export function AuthorityParticles({
  enabled,
  theme,
  intensity = 'balanced',
  interactionMode = 'always',
  containerWidth = 400,
  containerHeight = 600,
  onHover = false,
  onFocus = false,
  particleCount,
  className = '',
  style = {}
}: AuthorityParticlesProps) {
  
  // Calcular count basado en intensidad
  const getParticleCount = () => {
    if (particleCount !== undefined) return particleCount; // Override para testing
    
    const intensityMapping = {
      minimal: 3,    // Sofisticación máxima
      balanced: 4,   // Balance perfecto
      prominent: 5   // Presencia notable
    };
    
    return intensityMapping[intensity];
  };

  // Hook de partículas de autoridad
  const {
    canvasRef,
    activateStrategicMode,
    deactivateStrategicMode,
    isActive,
    debugInfo
  } = useAuthorityParticles({
    enabled,
    count: getParticleCount(),
    theme,
    containerWidth,
    containerHeight,
    intensity,
    interactionMode
  });

  // Manejar eventos de interacción
  const handleMouseEnter = () => {
    if (interactionMode === 'hover' || interactionMode === 'strategic') {
      activateStrategicMode();
    }
  };

  const handleMouseLeave = () => {
    if (interactionMode === 'hover' || interactionMode === 'strategic') {
      deactivateStrategicMode();
    }
  };

  const handleFocus = () => {
    if (onFocus) {
      activateStrategicMode();
    }
  };

  const handleBlur = () => {
    if (onFocus) {
      deactivateStrategicMode();
    }
  };

  // Si no está activo, no renderizar nada
  if (!isActive) {
    return null;
  }

  return (
    <div 
      className={`authority-particles-container ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 10, // Mayor z-index para aparecer encima del contenido
        overflow: 'hidden',
        borderRadius: 'inherit',
        ...style
      }}
      onMouseEnter={onHover ? handleMouseEnter : undefined}
      onMouseLeave={onHover ? handleMouseLeave : undefined}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <canvas
        ref={canvasRef}
        width={containerWidth}
        height={containerHeight}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        aria-hidden="true"
        role="presentation"
      />
      
      {/* Debug info solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div 
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px',
            fontSize: '12px',
            borderRadius: '4px',
            pointerEvents: 'auto',
            zIndex: 1000
          }}
        >
          <div>Particles: {debugInfo.particleCount}</div>
          <div>Mobile: {debugInfo.performance.mobile ? 'Yes' : 'No'}</div>
          <div>Low Power: {debugInfo.performance.lowPower ? 'Yes' : 'No'}</div>
          <div>Reduced Motion: {debugInfo.performance.reducedMotion ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
}

export default AuthorityParticles;
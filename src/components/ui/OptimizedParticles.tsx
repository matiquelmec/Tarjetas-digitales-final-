'use client';

import React from 'react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface OptimizedParticlesProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function OptimizedParticles({ children, fallback }: OptimizedParticlesProps) {
  const { enableParticles, reducedMotion } = usePerformanceOptimization();

  // Si las partículas están deshabilitadas o hay preferencia de movimiento reducido
  if (!enableParticles || reducedMotion) {
    return (
      <>
        {fallback || (
          <div style={{
            opacity: 0.3,
            pointerEvents: 'none',
            position: 'absolute',
            top: '20%',
            left: '20%',
            fontSize: '1.5rem'
          }}>
            ✨
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
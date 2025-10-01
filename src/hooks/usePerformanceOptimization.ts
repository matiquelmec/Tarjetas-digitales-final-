'use client';

import { useState, useEffect } from 'react';

interface PerformanceSettings {
  enableAnimations: boolean;
  enableParticles: boolean;
  enableComplexEffects: boolean;
  reducedMotion: boolean;
}

export function usePerformanceOptimization(): PerformanceSettings {
  const [settings, setSettings] = useState<PerformanceSettings>({
    enableAnimations: true,
    enableParticles: true,
    enableComplexEffects: true,
    reducedMotion: false,
  });

  useEffect(() => {
    // Detectar preferencia de movimiento reducido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detectar tipo de dispositivo y performance
    const isLowEndDevice = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
      
      // Detectar dispositivos con menos memoria/CPU
      const deviceMemory = (navigator as any).deviceMemory;
      const lowMemory = deviceMemory && deviceMemory < 4;
      
      // Detectar si es dispositivo móvil de gama baja
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isOldDevice = navigator.userAgent.includes('Android 4') || navigator.userAgent.includes('iPhone OS 10');
      
      return slowConnection || lowMemory || (isMobile && isOldDevice);
    };

    // Configurar ajustes basados en performance
    if (prefersReducedMotion || isLowEndDevice()) {
      setSettings({
        enableAnimations: false,
        enableParticles: false,
        enableComplexEffects: false,
        reducedMotion: true,
      });
    } else {
      // Detectar si el navegador soporta animaciones modernas
      const supportsAdvancedAnimations = CSS.supports('backdrop-filter', 'blur(10px)') && 
                                        CSS.supports('animation', 'float 1s ease');
      
      setSettings({
        enableAnimations: true,
        enableParticles: supportsAdvancedAnimations,
        enableComplexEffects: supportsAdvancedAnimations,
        reducedMotion: false,
      });
    }

    // Monitorear performance en tiempo real
    let frameCount = 0;
    let lastTime = performance.now();
    
    const checkFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        // Si el FPS es muy bajo, reducir efectos
        if (fps < 30) {
          setSettings(prev => ({
            ...prev,
            enableParticles: false,
            enableComplexEffects: false,
          }));
        }
      }
      
      if (frameCount < 60) { // Solo monitorear por 60 frames
        requestAnimationFrame(checkFPS);
      }
    };
    
    // Iniciar monitoreo después de que la página cargue
    const startMonitoring = () => {
      requestAnimationFrame(checkFPS);
    };
    
    setTimeout(startMonitoring, 2000); // Esperar 2 segundos después de la carga

  }, []);

  return settings;
}
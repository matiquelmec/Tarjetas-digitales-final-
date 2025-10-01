/**
 * Hook para gestionar efectos visuales en Orbital Studio
 * Migrado y optimizado desde el sistema exitoso de tarjetas digitales
 */

import { useMemo, useCallback, useEffect, useState } from 'react';
import EffectsManager, { VisualEffectsState } from '@/lib/effects/EffectsManager';

interface UseOrbitalEffectsProps {
  // Efectos visuales
  enableHoverEffect?: boolean;
  enableGlassmorphism?: boolean;
  enableSubtleAnimations?: boolean;
  enableBackgroundPatterns?: boolean;
  enableParticles?: boolean;
  particleType?: 'floating' | 'constellation' | 'professional' | 'creative';
  particleCount?: number;
  
  // Colores del slide
  slideBackgroundColor: string;
  slideTextColor: string;
  buttonColor?: string;
  buttonHoverColor?: string;
}

export function useOrbitalEffects({
  enableHoverEffect,
  enableGlassmorphism,
  enableSubtleAnimations,
  enableBackgroundPatterns,
  enableParticles,
  particleType,
  particleCount,
  slideBackgroundColor,
  slideTextColor,
  buttonColor,
  buttonHoverColor
}: UseOrbitalEffectsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const effectsManager = EffectsManager.getInstance();

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Estado de efectos compatible con EffectsManager
  const effectsState = useMemo((): VisualEffectsState => ({
    hoverEffect: {
      enabled: enableHoverEffect || false,
      intensity: 1
    },
    glassmorphism: {
      enabled: enableGlassmorphism && !isMobile,
      intensity: 0.8
    },
    subtleAnimations: {
      enabled: enableSubtleAnimations || false,
      intensity: 0.8
    },
    backgroundPatterns: {
      enabled: enableBackgroundPatterns || false,
      intensity: 0.3
    },
    particles: {
      enabled: enableParticles && !isMobile,
      type: particleType || 'professional',
      count: Math.min(particleCount || 30, isMobile ? 15 : 50),
      intensity: 1,
      speed: 0.8
    }
  }), [
    enableGlassmorphism,
    enableSubtleAnimations, 
    enableParticles,
    enableBackgroundPatterns,
    enableHoverEffect,
    particleType,
    particleCount,
    isMobile
  ]);

  // Generar estilos CSS para el slide
  const dynamicStyles = useMemo(() => {
    return effectsManager.generateEffectStyles(effectsState, {
      background: slideBackgroundColor,
      text: slideTextColor
    });
  }, [effectsState, slideBackgroundColor, slideTextColor]);

  // Clases CSS para aplicar al componente
  const cssClasses = useMemo(() => {
    const classes = ['orbital-slide'];
    
    if (effectsState.glassmorphism.enabled) {
      classes.push('orbital-glassmorphism');
    }
    
    if (effectsState.subtleAnimations.enabled) {
      classes.push('orbital-animated');
    }
    
    if (effectsState.hoverEffect.enabled) {
      classes.push('orbital-hoverable');
    }
    
    return classes.join(' ');
  }, [effectsState]);

  // Configuración de partículas
  const particleConfig = useMemo(() => {
    if (!effectsState.particles.enabled) return null;

    return {
      particles: {
        number: {
          value: effectsState.particles.count,
          density: { enable: true, value_area: 800 }
        },
        color: { value: slideTextColor },
        opacity: { value: 0.4, random: true },
        size: { value: 2, random: true },
        move: {
          enable: true,
          speed: effectsState.particles.speed,
          direction: 'none',
          random: true,
          out_mode: 'out'
        }
      }
    };
  }, [effectsState.particles, slideTextColor]);

  // Validación de rendimiento
  const validation = useMemo(() => ({
    performance: isMobile ? 'mobile-optimized' : 'desktop-full',
    effectsCount: Object.values(effectsState).filter(effect => 
      typeof effect === 'object' && effect.enabled
    ).length,
    recommended: true
  }), [effectsState, isMobile]);

  return {
    effectsState,
    dynamicStyles,
    cssClasses,
    particleConfig,
    validation,
    isMobile
  };
}
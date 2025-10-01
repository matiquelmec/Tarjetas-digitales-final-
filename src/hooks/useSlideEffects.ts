/**
 * Hook para gestionar efectos visuales en slides
 * MIGRACIÓN COMPLETA desde useVisualEffects de tarjetas digitales
 * Mantiene la misma arquitectura que FUNCIONA en BusinessCard
 */

import { useMemo, useCallback, useEffect, useState } from 'react';
import SlideEffectsManager, { SlideVisualEffectsState } from '@/lib/effects/SlideEffectsManager';

interface UseSlideEffectsProps {
  // Props para compatibilidad con sistema de tarjetas
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
}

export function useSlideEffects({
  enableHoverEffect,
  enableGlassmorphism,
  enableSubtleAnimations,
  enableBackgroundPatterns,
  enableParticles,
  particleType,
  particleCount,
  slideBackgroundColor,
  slideTextColor
}: UseSlideEffectsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const effectsManager = SlideEffectsManager.getInstance();

  // Detectar dispositivo móvil (IGUAL que tarjetas)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Convertir props al nuevo formato (IGUAL que tarjetas)
  const effectsState = useMemo((): SlideVisualEffectsState => {
    try {
      const baseState = effectsManager.convertLegacyProps({
        enableHoverEffect,
        enableGlassmorphism,
        enableSubtleAnimations,
        enableBackgroundPatterns,
        enableParticles,
        particleType,
        particleCount
      });

      // Optimizar para móvil si es necesario
      const optimizedState = effectsManager.optimizeForDevice(baseState, isMobile);
      
      // Validar que el estado tenga la estructura completa
      return {
        hoverEffect: optimizedState.hoverEffect || { enabled: false, intensity: 1 },
        glassmorphism: optimizedState.glassmorphism || { enabled: false, intensity: 0.8 },
        subtleAnimations: optimizedState.subtleAnimations || { enabled: false, intensity: 0.8 },
        backgroundPatterns: optimizedState.backgroundPatterns || { enabled: false, intensity: 0.4 },
        particles: optimizedState.particles || { enabled: false, type: 'floating', count: 30, intensity: 1, speed: 1 }
      };
    } catch (error) {
      console.warn('Error in useSlideEffects:', error);
      // Fallback seguro
      return {
        hoverEffect: { enabled: false, intensity: 1 },
        glassmorphism: { enabled: false, intensity: 0.8 },
        subtleAnimations: { enabled: false, intensity: 0.8 },
        backgroundPatterns: { enabled: false, intensity: 0.4 },
        particles: { enabled: false, type: 'floating', count: 30, intensity: 1, speed: 1 }
      };
    }
  }, [
    enableHoverEffect,
    enableGlassmorphism,
    enableSubtleAnimations,
    enableBackgroundPatterns,
    enableParticles,
    particleType,
    particleCount,
    isMobile,
    effectsManager
  ]);

  // Generar CSS dinámico (IGUAL que tarjetas)
  const dynamicStyles = useMemo(() => {
    return effectsManager.generateEffectStyles(effectsState, {
      background: slideBackgroundColor,
      text: slideTextColor
    });
  }, [effectsState, slideBackgroundColor, slideTextColor, effectsManager]);

  // Configuración de partículas (IGUAL que tarjetas)
  const particleConfig = useMemo(() => {
    return effectsManager.generateParticleConfig(effectsState.particles);
  }, [effectsState.particles, effectsManager]);

  // Validación de efectos (IGUAL que tarjetas)
  const validation = useMemo(() => {
    return effectsManager.validateEffectCombination(effectsState);
  }, [effectsState, effectsManager]);

  // CSS classes dinámicas (ADAPTADO para slides)
  const cssClasses = useMemo(() => {
    const classes: string[] = [];
    
    if (effectsState?.hoverEffect?.enabled) classes.push('effect-hover');
    if (effectsState?.glassmorphism?.enabled) classes.push('effect-glass');
    if (effectsState?.subtleAnimations?.enabled) classes.push('effect-animate');
    if (effectsState?.backgroundPatterns?.enabled) classes.push('effect-patterns');
    if (effectsState?.particles?.enabled) classes.push('effect-particles');
    
    return classes.join(' ');
  }, [effectsState]);

  // Función helper para aplicar efectos
  const applyEffectsToElement = useCallback((element: HTMLElement) => {
    element.className = `${element.className} ${cssClasses}`.trim();
  }, [cssClasses]);

  // Debug info
  const debugInfo = useMemo(() => {
    const activeEffects = Object.entries(effectsState)
      .filter(([, config]) => config.enabled)
      .map(([name, config]) => ({
        name,
        intensity: config.intensity || 1,
        type: name === 'particles' ? (config as { type?: string }).type : undefined
      }));

    if (process.env.NODE_ENV === 'development') {
      console.log('🎬 Slide Effects State:', {
        activeEffects,
        validation,
        isMobile,
        dynamicStylesLength: dynamicStyles.length,
        cssClasses
      });
      
      if (validation.warnings.length > 0) {
        console.warn('⚠️ Slide Effects Warnings:', validation.warnings);
      }
      if (validation.recommendations.length > 0) {
        console.info('💡 Slide Effects Recommendations:', validation.recommendations);
      }
    }

    return {
      activeEffects,
      isMobile,
      validation,
      totalEffects: Object.values(effectsState).filter(effect => effect.enabled).length,
      generatedStyles: dynamicStyles.split('\n').length,
      cssClassesArray: cssClasses.split(' ')
    };
  }, [effectsState, isMobile, validation, dynamicStyles, cssClasses]);

  return {
    // Estado de efectos (IGUAL que tarjetas)
    effectsState,
    
    // Configuraciones (IGUAL que tarjetas)
    particleConfig,
    dynamicStyles,
    cssClasses,
    
    // Validación
    validation,
    
    // Utilidades
    applyEffectsToElement,
    
    // Info de debug (solo en desarrollo)
    ...(process.env.NODE_ENV === 'development' && { debugInfo })
  };
}

export default useSlideEffects;
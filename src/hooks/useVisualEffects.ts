/**
 * Hook para gestionar efectos visuales con arquitectura limpia
 * Reemplaza la lógica dispersa con un sistema unificado
 */

import { useMemo, useCallback, useEffect, useState } from 'react';
import EffectsManager, { VisualEffectsState } from '@/lib/effects/EffectsManager';

interface UseVisualEffectsProps {
  // Props legacy para compatibilidad
  enableHoverEffect?: boolean;
  enableGlassmorphism?: boolean;
  enableSubtleAnimations?: boolean;
  enableBackgroundPatterns?: boolean;
  enableParticles?: boolean;
  particleType?: 'floating' | 'constellation' | 'professional' | 'creative';
  particleCount?: number;
  
  // Nuevos efectos de ambiente (matching schema.prisma)
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
  
  // Colores de la tarjeta
  cardBackgroundColor: string;
  cardTextColor: string;
}

export function useVisualEffects({
  enableHoverEffect,
  enableGlassmorphism,
  enableSubtleAnimations,
  enableBackgroundPatterns,
  enableParticles,
  particleType,
  particleCount,
  // Nuevos efectos de ambiente
  enableAnimatedGradient,
  animatedGradientType,
  animatedGradientSpeed,
  animatedGradientIntensity,
  animatedGradientOpacity,
  enableFloatingShapes,
  floatingShapesType,
  floatingShapesCount,
  floatingShapesSpeed,
  ambientIntensity,
  ambientOpacity,
  cardBackgroundColor,
  cardTextColor
}: UseVisualEffectsProps) {
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

  // Convertir props legacy al nuevo formato
  const effectsState = useMemo((): VisualEffectsState => {
    const baseState = effectsManager.convertLegacyProps({
      enableHoverEffect,
      enableGlassmorphism,
      enableSubtleAnimations,
      enableBackgroundPatterns,
      enableParticles,
      particleType,
      particleCount,
      // Nuevos efectos de ambiente
      enableAnimatedGradient,
      animatedGradientType,
      animatedGradientSpeed,
      animatedGradientIntensity,
      animatedGradientOpacity,
      enableFloatingShapes,
      floatingShapesType,
      floatingShapesCount,
      floatingShapesSpeed,
      ambientIntensity,
      ambientOpacity
    });

    // Aplicar efectos inteligentes según el tema, luego optimizar para dispositivo
    const intelligentEffects = effectsManager.applyIntelligentEffects(baseState, { 
      background: cardBackgroundColor, 
      text: cardTextColor 
    });
    
    // Optimizar para móvil si es necesario
    return effectsManager.optimizeForDevice(intelligentEffects, isMobile);
  }, [
    enableHoverEffect,
    enableGlassmorphism,
    enableSubtleAnimations,
    enableBackgroundPatterns,
    enableParticles,
    particleType,
    particleCount,
    // Nuevos efectos de ambiente
    enableAnimatedGradient,
    animatedGradientType,
    animatedGradientSpeed,
    animatedGradientIntensity,
    animatedGradientOpacity,
    enableFloatingShapes,
    floatingShapesType,
    floatingShapesCount,
    floatingShapesSpeed,
    ambientIntensity,
    ambientOpacity,
    isMobile,
    effectsManager
  ]);

  // Generar CSS dinámico
  const dynamicStyles = useMemo(() => {
    return effectsManager.generateEffectStyles(effectsState, {
      background: cardBackgroundColor,
      text: cardTextColor
    });
  }, [effectsState, cardBackgroundColor, cardTextColor, effectsManager]);

  // Configuración de partículas
  const particleConfig = useMemo(() => {
    return effectsManager.generateParticleConfig(effectsState.particles);
  }, [effectsState.particles, effectsManager]);

  // Validación de efectos
  const validation = useMemo(() => {
    return effectsManager.validateEffectCombination(effectsState);
  }, [effectsState, effectsManager]);

  // CSS classes dinámicas (sin incluir business-card ya que el elemento usa business-card-custom)
  const cssClasses = useMemo(() => {
    const classes: string[] = [];
    
    if (effectsState.hoverEffect.enabled) classes.push('effect-hover');
    if (effectsState.glassmorphism.enabled) classes.push('effect-glass');
    if (effectsState.subtleAnimations.enabled) classes.push('effect-animate');
    if (effectsState.backgroundPatterns.enabled) classes.push('effect-patterns');
    if (effectsState.particles.enabled) classes.push('effect-particles');
    // Nuevos efectos de ambiente
    if (effectsState.animatedGradients.enabled) classes.push('effect-animated-gradient');
    if (effectsState.floatingShapes.enabled) classes.push('effect-floating-shapes');
    // Mouse tracking
    if (effectsState.mouseTracking.enabled) classes.push('effect-mouse-tracking');
    
    return classes.join(' ');
  }, [effectsState]);

  // Función helper para aplicar efectos (opcional - principalmente para testing)
  const applyEffectsToElement = useCallback((element: HTMLElement) => {
    // Aplicar solo classes CSS (los estilos se manejan via JSX)
    element.className = `${element.className} ${cssClasses}`.trim();
  }, [cssClasses]);

  // Información de debug mejorada
  const debugInfo = useMemo(() => {
    const activeEffects = Object.entries(effectsState)
      .filter(([, config]) => config.enabled)
      .map(([name, config]) => ({
        name,
        intensity: config.intensity || 1,
        type: name === 'particles' ? (config as { type?: string }).type : undefined
      }));

    // Log en desarrollo para detectar problemas
    if (process.env.NODE_ENV === 'development') {
      console.log('🎨 Visual Effects State:', {
        activeEffects,
        validation,
        isMobile,
        dynamicStylesLength: dynamicStyles.length,
        cssClasses
      });
      
      if (validation.warnings.length > 0) {
        console.warn('⚠️ Effects Warnings:', validation.warnings);
      }
      if (validation.recommendations.length > 0) {
        console.info('💡 Effects Recommendations:', validation.recommendations);
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
    // Estado de efectos
    effectsState,
    
    // Configuraciones
    particleConfig,
    dynamicStyles,
    cssClasses,
    
    // Validación
    validation,
    
    // Utilidades
    applyEffectsToElement,
    
    // Info de debug (solo en desarrollo)
    ...(process.env.NODE_ENV === 'development' && { debugInfo }),
    
    // Mouse tracking configuration
    mouseTrackingConfig: effectsState.mouseTracking
  };
}

export default useVisualEffects;
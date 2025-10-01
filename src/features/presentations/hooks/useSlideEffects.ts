/**
 * Hook para gestionar efectos visuales en slides de presentaciones
 * Basado en useVisualEffects.ts pero adaptado para slides
 */

import { useMemo, useCallback, useEffect, useState } from 'react';
import SlideEffectsManager, { SlideVisualEffectsState } from '@/lib/effects/SlideEffectsManager';

interface UseSlideEffectsProps {
  // Configuración del slide
  theme: 'stellar' | 'ocean' | 'corporate' | 'creative' | 'modern';
  slideType: 'title' | 'content' | 'image' | 'chart' | 'quote' | 'conclusion';
  
  // Efectos específicos para slides
  enableSlideTransitions?: boolean;
  enableHoverEffect?: boolean;
  enableGlassmorphism?: boolean;
  enableSubtleAnimations?: boolean;
  enableBackgroundPatterns?: boolean;
  enableParticles?: boolean;
  particleType?: 'floating' | 'constellation' | 'professional' | 'creative';
  particleCount?: number;
  
  // Colores del tema
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  
  // Configuración específica de presentaciones
  isActive?: boolean;  // Si el slide está actualmente visible
  isInView?: boolean;  // Si el slide está en el viewport
  presentationMode?: 'edit' | 'preview' | 'fullscreen';
}

export function useSlideEffects({
  theme,
  slideType,
  enableSlideTransitions = true,
  enableHoverEffect = true,
  enableGlassmorphism = true,
  enableSubtleAnimations = true,
  enableBackgroundPatterns = true,
  enableParticles = true,
  particleType = 'professional',
  particleCount = 30,
  backgroundColor,
  textColor,
  accentColor,
  isActive = false,
  isInView = true,
  presentationMode = 'edit'
}: UseSlideEffectsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const effectsManager = SlideEffectsManager.getInstance();

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Configuración de temas predefinidos
  const themeConfig = useMemo(() => {
    const themes = {
      stellar: {
        background: backgroundColor || 'linear-gradient(135deg, #0f0c29, #24243e, #302b63)',
        text: textColor || '#ffffff',
        accent: accentColor || '#00f6ff',
        particleType: 'floating' as const,
        glassIntensity: 0.8
      },
      ocean: {
        background: backgroundColor || 'linear-gradient(135deg, #006994, #004d6b, #003947)',
        text: textColor || '#ffffff', 
        accent: accentColor || '#00D4FF',
        particleType: 'constellation' as const,
        glassIntensity: 0.7
      },
      corporate: {
        background: backgroundColor || 'linear-gradient(135deg, #2c3e50, #34495e, #3e5978)',
        text: textColor || '#ffffff',
        accent: accentColor || '#3498db',
        particleType: 'professional' as const,
        glassIntensity: 0.6
      },
      creative: {
        background: backgroundColor || 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
        text: textColor || '#ffffff',
        accent: accentColor || '#ff6b6b',
        particleType: 'creative' as const,
        glassIntensity: 0.9
      },
      modern: {
        background: backgroundColor || 'linear-gradient(135deg, #1e3c72, #2a5298, #6dd5fa)',
        text: textColor || '#ffffff',
        accent: accentColor || '#4ecdc4',
        particleType: 'floating' as const,
        glassIntensity: 0.75
      }
    };
    
    return themes[theme] || themes.stellar;
  }, [theme, backgroundColor, textColor, accentColor]);

  // Ajustar efectos según el modo de presentación
  const adjustedEffects = useMemo(() => {
    let adjustments = {
      enableHoverEffect,
      enableGlassmorphism,
      enableSubtleAnimations,
      enableBackgroundPatterns,
      enableParticles
    };

    // En modo fullscreen, optimizar rendimiento
    if (presentationMode === 'fullscreen') {
      adjustments = {
        ...adjustments,
        enableParticles: enableParticles && !isMobile, // Reducir partículas en móvil
        particleCount: Math.min(particleCount, isMobile ? 15 : 25)
      };
    }

    // En modo edición, todos los efectos
    if (presentationMode === 'edit') {
      adjustments = {
        ...adjustments,
        enableHoverEffect: true // Siempre habilitar hover en edición
      };
    }

    return adjustments;
  }, [
    enableHoverEffect,
    enableGlassmorphism, 
    enableSubtleAnimations,
    enableBackgroundPatterns,
    enableParticles,
    particleCount,
    presentationMode,
    isMobile
  ]);

  // Convertir configuración a estado de efectos
  const effectsState = useMemo((): SlideVisualEffectsState => {
    const baseState = effectsManager.convertLegacyProps({
      enableHoverEffect: adjustedEffects.enableHoverEffect,
      enableGlassmorphism: adjustedEffects.enableGlassmorphism,
      enableSubtleAnimations: adjustedEffects.enableSubtleAnimations,
      enableBackgroundPatterns: adjustedEffects.enableBackgroundPatterns,
      enableParticles: adjustedEffects.enableParticles,
      particleType: themeConfig.particleType,
      particleCount: adjustedEffects.particleCount || particleCount
    });

    // Ajustar intensidad del glassmorphism según el tema
    if (baseState.glassmorphism.enabled) {
      baseState.glassmorphism.intensity = themeConfig.glassIntensity;
    }

    // Optimizar para móvil si es necesario
    return effectsManager.optimizeForDevice(baseState, isMobile);
  }, [
    adjustedEffects,
    themeConfig,
    particleCount,
    isMobile,
    effectsManager
  ]);

  // Generar CSS dinámico para slides
  const dynamicStyles = useMemo(() => {
    const baseStyles = effectsManager.generateEffectStyles(effectsState, {
      background: themeConfig.background,
      text: themeConfig.text,
      accent: themeConfig.accent
    });

    // Estilos específicos para slides
    const slideSpecificStyles = `
      /* Estilos específicos para slides */
      .slide-container {
        background: ${themeConfig.background};
        color: ${themeConfig.text};
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .slide-container.active {
        transform: scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }
      
      .slide-content {
        position: relative;
        z-index: 2;
        padding: 2rem;
      }
      
      /* Transiciones entre slides */
      ${enableSlideTransitions ? `
        .slide-transition-enter {
          opacity: 0;
          transform: translateX(100%);
        }
        
        .slide-transition-enter-active {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 300ms, transform 300ms;
        }
        
        .slide-transition-exit {
          opacity: 1;
          transform: translateX(0);
        }
        
        .slide-transition-exit-active {
          opacity: 0;
          transform: translateX(-100%);
          transition: opacity 300ms, transform 300ms;
        }
      ` : ''}
      
      /* Efectos específicos por tipo de slide */
      .slide-type-title {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 400px;
      }
      
      .slide-type-content {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        align-items: start;
      }
      
      .slide-type-image {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .slide-content {
          padding: 1rem;
        }
        
        .slide-container.active {
          transform: scale(1.01);
        }
      }
    `;

    return baseStyles + slideSpecificStyles;
  }, [
    effectsState, 
    themeConfig, 
    enableSlideTransitions,
    effectsManager
  ]);

  // Configuración de partículas adaptada para slides
  const particleConfig = useMemo(() => {
    const baseConfig = effectsManager.generateParticleConfig(effectsState.particles);
    
    // Ajustes específicos para slides
    return {
      ...baseConfig,
      background: {
        color: 'transparent', // Los slides manejan su propio background
      },
      particles: {
        ...baseConfig.particles,
        number: {
          value: isActive ? baseConfig.particles.number.value : Math.floor(baseConfig.particles.number.value * 0.5)
        },
        opacity: {
          ...baseConfig.particles.opacity,
          value: isInView ? baseConfig.particles.opacity.value : 0.3
        }
      }
    };
  }, [effectsState.particles, isActive, isInView, effectsManager]);

  // CSS classes específicas para slides
  const cssClasses = useMemo(() => {
    const classes: string[] = ['slide-container'];
    
    if (effectsState?.hoverEffect?.enabled) classes.push('effect-hover');
    if (effectsState?.glassmorphism?.enabled) classes.push('effect-glass');
    if (effectsState?.subtleAnimations?.enabled) classes.push('effect-animate');
    if (effectsState?.backgroundPatterns?.enabled) classes.push('effect-patterns');
    if (effectsState?.particles?.enabled) classes.push('effect-particles');
    
    // Classes específicas
    classes.push(`slide-theme-${theme}`);
    classes.push(`slide-type-${slideType}`);
    classes.push(`slide-mode-${presentationMode}`);
    
    if (isActive) classes.push('active');
    if (isInView) classes.push('in-view');
    
    return classes.join(' ');
  }, [effectsState, theme, slideType, presentationMode, isActive, isInView]);

  // Funciones helper para slides
  const slideHelpers = useMemo(() => ({
    // Generar estilos inline para el slide
    getSlideStyles: () => ({
      background: themeConfig.background,
      color: themeConfig.text,
      position: 'relative' as const,
      minHeight: '400px',
      borderRadius: '16px',
      overflow: 'hidden'
    }),
    
    // Generar estilos para texto de acento
    getAccentTextStyles: () => ({
      color: themeConfig.accent,
      textShadow: `0 0 10px ${themeConfig.accent}40`
    }),
    
    // Verificar si el tema es oscuro
    isDarkTheme: () => {
      const themes = ['stellar', 'ocean', 'corporate'];
      return themes.includes(theme);
    }
  }), [themeConfig, theme]);

  // Debug info para desarrollo
  const debugInfo = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      return {
        theme,
        slideType,
        presentationMode,
        isActive,
        isInView,
        isMobile,
        effectsState,
        themeConfig,
        cssClassesArray: cssClasses.split(' ')
      };
    }
    return null;
  }, [theme, slideType, presentationMode, isActive, isInView, isMobile, effectsState, themeConfig, cssClasses]);

  return {
    // Configuraciones principales
    effectsState,
    themeConfig,
    
    // Estilos y configuraciones
    dynamicStyles,
    particleConfig,
    cssClasses,
    
    // Helpers específicos para slides
    slideHelpers,
    
    // Info de debug (solo en desarrollo)
    ...(process.env.NODE_ENV === 'development' && { debugInfo })
  };
}

export default useSlideEffects;
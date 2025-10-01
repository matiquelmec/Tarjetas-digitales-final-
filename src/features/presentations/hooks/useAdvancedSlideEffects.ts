/**
 * Hook avanzado para efectos de slides que aprovecha el sistema completo de tarjetas digitales
 * Migra TODOS los efectos premium de BusinessCard a las presentaciones
 */

import { useMemo, useCallback, useEffect, useState } from 'react';
import { useVisualEffects } from '@/hooks/useVisualEffects';
import EffectsManager, { VisualEffectsState } from '@/lib/effects/EffectsManager';

// Tipos específicos para slides
export type SlideType = 'title' | 'content' | 'image' | 'chart' | 'quote' | 'conclusion' | 'bullets';
export type SlideTheme = 'stellar' | 'ocean' | 'corporate' | 'creative' | 'modern' | 'elegant' | 'professional';

interface SlideThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: {
      primary: string;
      secondary: string;
    };
  };
  effects: {
    particles: boolean;
    glassmorphism: boolean;
    gradients: boolean;
    cinematicTransitions: boolean;
  };
  template: 'modern' | 'elegant' | 'creative' | 'professional' | 'cosmic';
}

interface UseAdvancedSlideEffectsProps {
  theme: SlideTheme;
  slideType: SlideType;
  isActive?: boolean;
  enablePremiumEffects?: boolean;
  enableCinematicTransitions?: boolean;
  enableHoverEffects?: boolean;
  customColors?: {
    primary?: string;
    background?: string;
    accent?: string;
  };
}

// Configuraciones de temas premium heredadas de BusinessCard
const SLIDE_THEME_CONFIGS: Record<SlideTheme, SlideThemeConfig> = {
  stellar: {
    colors: {
      primary: '#00f6ff',
      secondary: '#0072ff', 
      accent: '#8e2de2',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d1a69 100%)',
      text: { primary: '#ffffff', secondary: '#b0b0b0' }
    },
    effects: { particles: true, glassmorphism: true, gradients: true, cinematicTransitions: true },
    template: 'cosmic'
  },
  ocean: {
    colors: {
      primary: '#00d4ff',
      secondary: '#0099cc',
      accent: '#66e0ff', 
      background: 'linear-gradient(135deg, #006994 0%, #004d6b 50%, #003947 100%)',
      text: { primary: '#ffffff', secondary: '#ccf2ff' }
    },
    effects: { particles: true, glassmorphism: true, gradients: true, cinematicTransitions: true },
    template: 'modern'
  },
  corporate: {
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#60a5fa',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
      text: { primary: '#ffffff', secondary: '#cbd5e1' }
    },
    effects: { particles: false, glassmorphism: true, gradients: true, cinematicTransitions: false },
    template: 'professional'
  },
  creative: {
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      background: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #ea580c 100%)',
      text: { primary: '#ffffff', secondary: '#fed7aa' }
    },
    effects: { particles: true, glassmorphism: true, gradients: true, cinematicTransitions: true },
    template: 'creative'
  },
  modern: {
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
      text: { primary: '#ffffff', secondary: '#e0e7ff' }
    },
    effects: { particles: true, glassmorphism: true, gradients: true, cinematicTransitions: true },
    template: 'modern'
  },
  elegant: {
    colors: {
      primary: '#ec4899',
      secondary: '#db2777',
      accent: '#f472b6',
      background: 'linear-gradient(135deg, #4c1d95 0%, #6b21a8 50%, #a21caf 100%)',
      text: { primary: '#ffffff', secondary: '#fce7f3' }
    },
    effects: { particles: false, glassmorphism: true, gradients: true, cinematicTransitions: true },
    template: 'elegant'
  },
  professional: {
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
      text: { primary: '#ffffff', secondary: '#d1fae5' }
    },
    effects: { particles: false, glassmorphism: true, gradients: false, cinematicTransitions: false },
    template: 'professional'
  }
};

// Efectos específicos por tipo de slide
const SLIDE_TYPE_EFFECTS: Record<SlideType, {
  particleType: 'floating' | 'constellation' | 'professional' | 'creative';
  particleCount: number;
  animationIntensity: number;
  hoverEffectLevel: number;
}> = {
  title: { 
    particleType: 'constellation', 
    particleCount: 80, 
    animationIntensity: 1.0, 
    hoverEffectLevel: 0.9 
  },
  content: { 
    particleType: 'floating', 
    particleCount: 40, 
    animationIntensity: 0.7, 
    hoverEffectLevel: 0.6 
  },
  image: { 
    particleType: 'creative', 
    particleCount: 30, 
    animationIntensity: 0.5, 
    hoverEffectLevel: 0.8 
  },
  chart: { 
    particleType: 'professional', 
    particleCount: 20, 
    animationIntensity: 0.4, 
    hoverEffectLevel: 0.5 
  },
  quote: { 
    particleType: 'floating', 
    particleCount: 60, 
    animationIntensity: 0.8, 
    hoverEffectLevel: 0.7 
  },
  conclusion: { 
    particleType: 'constellation', 
    particleCount: 70, 
    animationIntensity: 0.9, 
    hoverEffectLevel: 0.8 
  },
  bullets: { 
    particleType: 'professional', 
    particleCount: 25, 
    animationIntensity: 0.5, 
    hoverEffectLevel: 0.4 
  }
};

export function useAdvancedSlideEffects({
  theme,
  slideType,
  isActive = false,
  enablePremiumEffects = true,
  enableCinematicTransitions = true,
  enableHoverEffects = true,
  customColors
}: UseAdvancedSlideEffectsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const themeConfig = SLIDE_THEME_CONFIGS[theme];
  const slideEffects = SLIDE_TYPE_EFFECTS[slideType];

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Combinar colores personalizados con tema
  const finalColors = useMemo(() => ({
    ...themeConfig.colors,
    ...(customColors?.primary && { primary: customColors.primary }),
    ...(customColors?.background && { background: customColors.background }),
    ...(customColors?.accent && { accent: customColors.accent })
  }), [themeConfig.colors, customColors]);

  // Usar el hook de efectos de tarjetas con configuración específica para slides
  const {
    effectsState,
    dynamicStyles: baseStyles,
    validation,
    particleElements,
    glassClasses
  } = useVisualEffects({
    enableHoverEffect: enableHoverEffects && enablePremiumEffects && !isMobile,
    enableGlassmorphism: themeConfig.effects.glassmorphism && enablePremiumEffects,
    enableSubtleAnimations: enablePremiumEffects,
    enableBackgroundPatterns: themeConfig.effects.gradients,
    enableParticles: themeConfig.effects.particles && enablePremiumEffects && !isMobile,
    particleType: slideEffects.particleType,
    particleCount: isMobile ? 0 : slideEffects.particleCount,
    cardBackgroundColor: finalColors.background,
    cardTextColor: finalColors.text.primary
  });

  // Estilos específicos para slides que extienden los de tarjetas
  const slideSpecificStyles = useMemo(() => {
    if (!enablePremiumEffects) return '';

    return `
      /* Slide Premium Effects - Heredados de BusinessCard */
      .slide-premium-${theme}-${slideType} {
        background: ${finalColors.background};
        border: 2px solid rgba(${hexToRgb(finalColors.primary)}, 0.3);
        border-radius: 20px;
        position: relative;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        ${themeConfig.effects.glassmorphism ? `
          backdrop-filter: blur(15px);
          box-shadow: 
            0 8px 32px rgba(${hexToRgb(finalColors.primary)}, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        ` : ''}
      }

      ${enableHoverEffects && !isMobile ? `
        .slide-premium-${theme}-${slideType}:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(${hexToRgb(finalColors.primary)}, 0.8);
          box-shadow: 
            0 20px 60px rgba(${hexToRgb(finalColors.primary)}, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .slide-premium-${theme}-${slideType}:hover .slide-title {
          color: ${finalColors.primary} !important;
          text-shadow: 0 0 10px rgba(${hexToRgb(finalColors.primary)}, 0.8);
        }
      ` : ''}

      ${enableCinematicTransitions && themeConfig.effects.cinematicTransitions ? `
        .slide-transition-enter {
          opacity: 0;
          transform: translateY(60px) rotateX(15deg);
          filter: blur(10px);
        }
        
        .slide-transition-enter-active {
          opacity: 1;
          transform: translateY(0) rotateX(0deg);
          filter: blur(0);
          transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      ` : ''}

      /* Template-specific effects */
      ${themeConfig.template === 'cosmic' ? `
        .slide-premium-${theme}-${slideType}::before {
          content: '';
          position: absolute;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          background: linear-gradient(45deg, ${finalColors.primary}, ${finalColors.secondary}, ${finalColors.accent});
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        
        .slide-premium-${theme}-${slideType}:hover::before {
          opacity: 0.6;
        }
      ` : ''}

      /* Responsive adjustments */
      @media (max-width: 768px) {
        .slide-premium-${theme}-${slideType} {
          transform: none !important;
          border-width: 1px;
        }
        
        .slide-premium-${theme}-${slideType}:hover {
          transform: none !important;
          box-shadow: 0 4px 16px rgba(${hexToRgb(finalColors.primary)}, 0.15);
        }
      }
    `;
  }, [theme, slideType, finalColors, enablePremiumEffects, enableHoverEffects, enableCinematicTransitions, themeConfig, isMobile]);

  // Combinar estilos base + específicos
  const combinedStyles = baseStyles + slideSpecificStyles;

  // Clases CSS específicas para el slide
  const slideClasses = useMemo(() => {
    const classes = [`slide-premium-${theme}-${slideType}`];
    
    if (glassClasses) classes.push(glassClasses);
    if (isActive) classes.push('slide-active');
    if (enableCinematicTransitions) classes.push('slide-cinematic');
    
    return classes.join(' ');
  }, [theme, slideType, glassClasses, isActive, enableCinematicTransitions]);

  // CSS Custom Properties para fácil personalización
  const cssCustomProperties = useMemo(() => ({
    '--slide-primary': finalColors.primary,
    '--slide-secondary': finalColors.secondary,
    '--slide-accent': finalColors.accent,
    '--slide-bg': finalColors.background,
    '--slide-text-primary': finalColors.text.primary,
    '--slide-text-secondary': finalColors.text.secondary,
    '--slide-animation-intensity': slideEffects.animationIntensity,
    '--slide-hover-level': slideEffects.hoverEffectLevel
  }), [finalColors, slideEffects]);

  return {
    // Estados y validación heredados de tarjetas
    effectsState,
    validation,
    isOptimized: validation.isValid,
    
    // Estilos combinados
    dynamicStyles: combinedStyles,
    slideClasses,
    cssCustomProperties,
    
    // Configuración del tema
    themeConfig: {
      ...themeConfig,
      colors: finalColors
    },
    
    // Elementos renderizables
    particleElements,
    
    // Información del dispositivo
    isMobile,
    
    // Métodos de control
    getSlideStyles: useCallback(() => ({
      background: finalColors.background,
      ...cssCustomProperties
    }), [finalColors, cssCustomProperties]),
    
    toggleEffect: useCallback((effectName: keyof VisualEffectsState) => {
      // Implementar toggle dinámico de efectos si es necesario
      console.log(`Toggling effect: ${effectName}`);
    }, [])
  };
}

// Utility function
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `${r}, ${g}, ${b}`;
}
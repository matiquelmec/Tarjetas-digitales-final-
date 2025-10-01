/**
 * Sistema de Efectos Visuales para Slides
 * MIGRACIÓN COMPLETA desde BusinessCard EffectsManager
 * Mantiene la misma arquitectura exitosa de las tarjetas digitales
 */

export interface SlideEffectConfig {
  enabled: boolean;
  intensity?: number;
  customProperties?: Record<string, unknown>;
}

export interface SlideParticleConfig extends SlideEffectConfig {
  type: 'floating' | 'constellation' | 'professional' | 'creative';
  count: number;
  color?: string;
  speed?: number;
}

export interface SlideVisualEffectsState {
  hoverEffect: SlideEffectConfig;
  glassmorphism: SlideEffectConfig;
  subtleAnimations: SlideEffectConfig;
  backgroundPatterns: SlideEffectConfig;
  particles: SlideParticleConfig;
}

export class SlideEffectsManager {
  private static instance: SlideEffectsManager;
  
  public static getInstance(): SlideEffectsManager {
    if (!SlideEffectsManager.instance) {
      SlideEffectsManager.instance = new SlideEffectsManager();
    }
    return SlideEffectsManager.instance;
  }

  /**
   * Convierte las props legacy al nuevo formato modular
   */
  public convertLegacyProps(props: {
    enableHoverEffect?: boolean;
    enableGlassmorphism?: boolean;
    enableSubtleAnimations?: boolean;
    enableBackgroundPatterns?: boolean;
    enableParticles?: boolean;
    particleType?: string;
    particleCount?: number;
  }): SlideVisualEffectsState {
    return {
      hoverEffect: {
        enabled: props.enableHoverEffect || false,
        intensity: 1
      },
      glassmorphism: {
        enabled: props.enableGlassmorphism || false,
        intensity: 0.8
      },
      subtleAnimations: {
        enabled: props.enableSubtleAnimations || false,
        intensity: 0.8
      },
      backgroundPatterns: {
        enabled: props.enableBackgroundPatterns || false,
        intensity: 0.4
      },
      particles: {
        enabled: props.enableParticles || false,
        type: (props.particleType as SlideParticleConfig['type']) || 'floating',
        count: props.particleCount || 30,
        intensity: 1,
        speed: 1
      }
    };
  }

  /**
   * Genera CSS dinámico para efectos activos (COPIADO de tarjetas)
   */
  public generateEffectStyles(effects: SlideVisualEffectsState, slideColors: {
    background: string;
    text: string;
  }): string {
    const styles: string[] = [];

    // Hover Effects
    if (effects.hoverEffect.enabled) {
      const intensity = effects.hoverEffect.intensity || 1;
      const liftAmount = 8 * intensity;
      const scaleAmount = 1 + (0.05 * intensity);
      const shadowIntensity = 0.4 * intensity;
      
      styles.push(`
        .slide-custom.effect-hover {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        .slide-custom.effect-hover:hover {
          transform: translateY(-${liftAmount}px) scale(${scaleAmount}) !important;
          box-shadow: 0 ${liftAmount * 4}px ${liftAmount * 8}px rgba(0, 0, 0, ${shadowIntensity}) !important;
        }
      `);
    }

    // Glassmorphism (EXACTAMENTE como en tarjetas)
    if (effects.glassmorphism.enabled) {
      const intensity = effects.glassmorphism.intensity || 0.8;
      
      const baseColor = this.extractBaseColor(slideColors.background);
      const isLightBackground = this.isLightColor(baseColor);
      
      const borderOpacity = 0.3 * intensity;
      const shadowStrength = 0.25 * intensity;
      
      const { r, g, b } = this.hexToRgb(baseColor);
      
      const baseTransparent = `rgba(${r}, ${g}, ${b}, ${0.85 * intensity})`;
      
      const glassOverlay = isLightBackground 
        ? `rgba(255, 255, 255, ${0.25 * intensity})`
        : `rgba(255, 255, 255, ${0.12 * intensity})`;
      
      const glassTint = isLightBackground
        ? `rgba(240, 248, 255, ${0.2 * intensity})`
        : `rgba(200, 220, 255, ${0.08 * intensity})`;

      styles.push(`
        .slide-custom.effect-glass {
          background: 
            linear-gradient(135deg, ${glassOverlay} 0%, transparent 50%, ${glassTint} 100%),
            ${baseTransparent};
          border: 1px solid rgba(255, 255, 255, ${borderOpacity});
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, ${shadowStrength}),
            inset 0 1px 0 rgba(255, 255, 255, ${borderOpacity}),
            inset 0 -1px 0 rgba(255, 255, 255, ${borderOpacity * 0.5}) !important;
          position: relative;
          overflow: hidden;
        }
        
        .slide-custom.effect-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(
            160deg,
            rgba(255, 255, 255, ${isLightBackground ? 0.3 * intensity : 0.2 * intensity}) 0%,
            rgba(255, 255, 255, ${isLightBackground ? 0.1 * intensity : 0.05 * intensity}) 40%,
            transparent 70%
          );
          border-radius: inherit;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          pointer-events: none;
          z-index: 1;
        }
        
        .slide-custom.effect-glass::after {
          content: '';
          position: absolute;
          top: 10%;
          left: 15%;
          width: 60px;
          height: 60px;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, ${isLightBackground ? 0.4 * intensity : 0.25 * intensity}) 0%,
            rgba(255, 255, 255, ${isLightBackground ? 0.15 * intensity : 0.1 * intensity}) 40%,
            transparent 70%
          );
          border-radius: 50%;
          filter: blur(15px);
          pointer-events: none;
          z-index: 1;
          transform: rotate(-20deg);
        }
        
        .slide-custom.effect-glass .slide-body,
        .slide-custom.effect-glass .slide-body > *,
        .slide-custom.effect-glass > * {
          position: relative;
          z-index: 2;
        }
      `);
    }

    // Subtle Animations
    if (effects.subtleAnimations.enabled) {
      const intensity = effects.subtleAnimations.intensity || 0.6;
      const scaleAmount = 1 + (0.03 * intensity);
      const brightnessAmount = 1 + (0.05 * intensity);
      const duration = 3 + (3 * (1 - intensity));
      
      styles.push(`
        .slide-custom.effect-animate {
          animation: subtleBreathe ${duration}s ease-in-out infinite !important;
          transform-origin: center center !important;
          will-change: transform, filter !important;
        }
        
        .slide-custom.effect-animate.effect-hover:hover {
          animation-play-state: paused !important;
        }
        
        @keyframes subtleBreathe {
          0%, 100% { 
            transform: scale(1) !important;
            filter: brightness(1) !important;
          }
          50% { 
            transform: scale(${scaleAmount}) !important;
            filter: brightness(${brightnessAmount}) !important;
          }
        }
      `);
    }

    // Background Patterns
    if (effects.backgroundPatterns.enabled) {
      const intensity = effects.backgroundPatterns.intensity || 0.4;
      const patternOpacity = 0.25 * intensity;
      
      const baseColor = this.extractBaseColor(slideColors.background);
      const isLight = this.isLightColor(baseColor);
      
      const pattern1Color = isLight 
        ? `rgba(120, 120, 220, ${patternOpacity})` 
        : `rgba(200, 200, 255, ${patternOpacity})`;
      const pattern2Color = isLight 
        ? `rgba(220, 120, 180, ${patternOpacity})` 
        : `rgba(255, 180, 255, ${patternOpacity})`;
      const pattern3Color = isLight
        ? `rgba(180, 220, 120, ${patternOpacity * 0.7})`
        : `rgba(200, 255, 200, ${patternOpacity * 0.7})`;
      
      styles.push(`
        .slide-custom.effect-patterns {
          position: relative;
          background-image: 
            radial-gradient(circle at 20% 80%, ${pattern1Color} 0%, transparent 45%),
            radial-gradient(circle at 80% 20%, ${pattern2Color} 0%, transparent 45%),
            radial-gradient(circle at 40% 40%, ${pattern3Color} 0%, transparent 35%),
            radial-gradient(circle at 60% 70%, rgba(255, 255, 255, ${patternOpacity * 0.3}) 0%, transparent 25%);
          background-size: 400px 400px, 350px 350px, 300px 300px, 200px 200px;
          background-position: 0% 100%, 100% 0%, 40% 40%, 60% 70%;
          background-repeat: no-repeat;
          animation: patternsMove 12s ease-in-out infinite;
        }
        
        .slide-custom.effect-patterns.effect-glass {
          background-blend-mode: ${isLight ? 'multiply' : 'screen'};
        }
        
        @keyframes patternsMove {
          0%, 100% { 
            background-position: 0% 100%, 100% 0%, 40% 40%, 60% 70%;
            opacity: 0.8;
          }
          25% { 
            background-position: 10% 90%, 90% 10%, 45% 35%, 65% 75%;
            opacity: 1;
          }
          50% { 
            background-position: 20% 80%, 80% 20%, 50% 30%, 70% 80%;
            opacity: 0.9;
          }
          75% { 
            background-position: 15% 85%, 85% 15%, 35% 45%, 55% 65%;
            opacity: 1;
          }
        }
      `);
    }

    return styles.join('\n');
  }

  /**
   * Genera configuración de partículas basada en tipo
   */
  public generateParticleConfig(particles: SlideParticleConfig): Record<string, unknown> | null {
    if (!particles.enabled) return null;

    const baseConfig = {
      particles: {
        number: {
          value: particles.count,
          density: { enable: true, value_area: 800 }
        },
        color: { value: particles.color || "#ffffff" },
        opacity: {
          value: 0.6,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1 }
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: true, speed: 2, size_min: 0.5 }
        },
        move: {
          enable: true,
          speed: particles.speed || 1,
          direction: "none" as const,
          random: true,
          straight: false,
          out_mode: "out" as const,
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas" as const,
        events: {
          onhover: { enable: true, mode: "repulse" as const },
          onclick: { enable: true, mode: "push" as const }
        }
      }
    };

    // Configuraciones específicas por tipo
    switch (particles.type) {
      case 'constellation':
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            line_linked: {
              enable: true,
              distance: 150,
              color: particles.color || "#ffffff",
              opacity: 0.4,
              width: 1
            }
          }
        };

      case 'professional':
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            shape: { type: "circle" as const },
            size: { value: 2, random: false },
            move: {
              ...baseConfig.particles.move,
              speed: 0.5,
              direction: "top" as const
            }
          }
        };

      case 'creative':
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            shape: { 
              type: "polygon" as const,
              polygon: { nb_sides: 6 }
            },
            size: { value: 4, random: true },
            move: {
              ...baseConfig.particles.move,
              speed: 2,
              direction: "none" as const
            }
          }
        };

      default:
        return baseConfig;
    }
  }

  /**
   * Optimizar efectos para dispositivo móvil
   */
  public optimizeForDevice(effects: SlideVisualEffectsState, isMobile: boolean): SlideVisualEffectsState {
    if (!isMobile) return effects;

    return {
      ...effects,
      particles: { ...effects.particles, enabled: false },
      subtleAnimations: { 
        ...effects.subtleAnimations, 
        intensity: Math.min(effects.subtleAnimations.intensity || 0.6, 0.5)
      }
    };
  }

  /**
   * Valida compatibilidad de efectos
   */
  public validateEffectCombination(effects: SlideVisualEffectsState): {
    isValid: boolean;
    warnings: string[];
    recommendations: string[];
  } {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (effects.glassmorphism.enabled && effects.backgroundPatterns.enabled) {
      warnings.push("Glassmorphism y patrones de fondo activos - usando sistema de capas optimizado");
    }

    const activeEffects = Object.values(effects).filter(effect => effect.enabled).length;
    if (activeEffects > 3) {
      recommendations.push("Considera reducir el número de efectos activos para mejor performance");
    }

    return {
      isValid: true,
      warnings,
      recommendations
    };
  }

  /**
   * MÉTODOS PRIVADOS - Copiados exactamente de EffectsManager
   */
  private extractBaseColor(background: string): string {
    if (background.includes('linear-gradient')) {
      const colorMatch = background.match(/#[0-9a-fA-F]{6}/);
      return colorMatch ? colorMatch[0] : '#000000';
    }
    return background;
  }

  private isLightColor(color: string): boolean {
    if (!color.startsWith('#')) return false;
    
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
}

export default SlideEffectsManager;
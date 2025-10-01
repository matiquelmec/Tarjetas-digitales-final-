/**
 * Sistema Modular de Efectos Visuales
 * Arquitectura limpia para gestionar todos los efectos de las tarjetas digitales
 */

export interface EffectConfig {
  enabled: boolean;
  intensity?: number;
  customProperties?: Record<string, unknown>;
}

export interface ParticleConfig extends EffectConfig {
  type: 'floating' | 'constellation' | 'professional' | 'creative';
  count: number;
  color?: string;
  speed?: number;
}

export interface AnimatedGradientConfig extends EffectConfig {
  type: 'aurora' | 'cosmic' | 'ocean' | 'sunset' | 'forest' | 'professional';
  speed: number; // 1-5
}

export interface FloatingShapesConfig extends EffectConfig {
  type: 'geometric' | 'organic' | 'stars' | 'particles' | 'professional';
  count: number; // 1-5
  speed: number; // 1-5
}

export interface AmbientEffectsConfig {
  intensity: number; // 1-5
  opacity: number; // 10-100
}

export interface MouseTrackingConfig extends EffectConfig {
  smoothing: number; // 0.1-1.0
  sensitivity: number; // 0.1-2.0
  enableGlow: boolean;
  enableTilt: boolean;
  enableParticleFollow: boolean;
}

export interface VisualEffectsState {
  hoverEffect: EffectConfig;
  glassmorphism: EffectConfig;
  subtleAnimations: EffectConfig;
  backgroundPatterns: EffectConfig;
  particles: ParticleConfig;
  // Nuevos efectos de ambiente
  animatedGradients: AnimatedGradientConfig;
  floatingShapes: FloatingShapesConfig;
  ambient: AmbientEffectsConfig;
  // Mouse tracking interactivo
  mouseTracking: MouseTrackingConfig;
}

export class EffectsManager {
  private static instance: EffectsManager;
  
  public static getInstance(): EffectsManager {
    if (!EffectsManager.instance) {
      EffectsManager.instance = new EffectsManager();
    }
    return EffectsManager.instance;
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
    // Nuevos campos de ambiente (matching schema.prisma)
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
    // Mouse tracking
    enableMouseTracking?: boolean;
    mouseTrackingSensitivity?: number;
    enableMouseGlow?: boolean;
    enableMouseTilt?: boolean;
    enableMouseParticles?: boolean;
  }): VisualEffectsState {
    return {
      hoverEffect: {
        enabled: props.enableHoverEffect || false,
        intensity: 1
      },
      glassmorphism: {
        enabled: props.enableGlassmorphism || false,
        intensity: 1.0 // Aumentar intensidad para que sea más visible
      },
      subtleAnimations: {
        enabled: props.enableSubtleAnimations || false,
        intensity: 0.8 // Más intensidad por defecto para que sea más visible
      },
      backgroundPatterns: {
        enabled: props.enableBackgroundPatterns || false,
        intensity: 0.6 // Aumentar intensidad para que sea más visible
      },
      particles: {
        enabled: props.enableParticles || false,
        type: (props.particleType as ParticleConfig['type']) || 'floating',
        count: props.particleCount || 30,
        intensity: 1,
        speed: 1
      },
      // Nuevos efectos de ambiente
      animatedGradients: {
        enabled: props.enableAnimatedGradient || false,
        type: props.animatedGradientType || 'aurora',
        speed: props.animatedGradientSpeed || 3,
        intensity: props.animatedGradientIntensity || 3,
        customProperties: {
          opacity: (props.animatedGradientOpacity || 50) / 100 // Opacidad específica para gradientes
        }
      },
      floatingShapes: {
        enabled: props.enableFloatingShapes || false,
        type: props.floatingShapesType || 'geometric',
        count: props.floatingShapesCount || 3,
        speed: props.floatingShapesSpeed || 3,
        intensity: props.ambientIntensity || 3
      },
      ambient: {
        intensity: props.ambientIntensity || 3,
        opacity: (props.ambientOpacity || 50) / 100
      },
      mouseTracking: {
        enabled: props.enableMouseTracking || false,
        intensity: 1,
        smoothing: 0.15,
        sensitivity: props.mouseTrackingSensitivity || 1.0,
        enableGlow: props.enableMouseGlow || true,
        enableTilt: props.enableMouseTilt || true,
        enableParticleFollow: props.enableMouseParticles || false
      }
    };
  }

  /**
   * Genera CSS dinámico para efectos activos
   */
  public generateEffectStyles(effects: VisualEffectsState, cardColors: {
    background: string;
    text: string;
  }): string {
    const styles: string[] = [];

    // Hover Effects
    if (effects.hoverEffect.enabled) {
      const intensity = effects.hoverEffect.intensity || 1;
      const liftAmount = 8 * intensity; // Más elevación para que sea más visible
      const scaleAmount = 1 + (0.05 * intensity); // Más escala para efecto más notorio
      const shadowIntensity = 0.4 * intensity; // Sombra más intensa
      
      styles.push(`
        .business-card-custom.effect-hover {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        .business-card-custom.effect-hover:hover {
          transform: translateY(-${liftAmount}px) scale(${scaleAmount}) !important;
          box-shadow: 0 ${liftAmount * 4}px ${liftAmount * 8}px rgba(0, 0, 0, ${shadowIntensity}) !important;
        }
      `);
    }

    // Glassmorphism
    if (effects.glassmorphism.enabled) {
      const intensity = effects.glassmorphism.intensity || 0.8;
      
      // Extraer el color base del fondo del usuario
      const baseColor = this.extractBaseColor(cardColors.background);
      const isLightBackground = this.isLightColor(baseColor);
      
      // Crear un efecto glass que no depende de backdrop-filter
      const borderOpacity = 0.3 * intensity;
      const shadowStrength = 0.25 * intensity;
      
      // Crear un fondo glass convincente que se superpone al color original
      const { r, g, b } = this.hexToRgb(baseColor);
      
      // Base transparente del color original
      const baseTransparent = `rgba(${r}, ${g}, ${b}, ${0.85 * intensity})`;
      
      // Overlay vidrio
      const glassOverlay = isLightBackground 
        ? `rgba(255, 255, 255, ${0.25 * intensity})`
        : `rgba(255, 255, 255, ${0.12 * intensity})`;
      
      // Tinte sutil
      const glassTint = isLightBackground
        ? `rgba(240, 248, 255, ${0.2 * intensity})`
        : `rgba(200, 220, 255, ${0.08 * intensity})`;

      styles.push(`
        .business-card-custom.effect-glass {
          background: 
            linear-gradient(135deg, ${glassOverlay} 0%, transparent 50%, ${glassTint} 100%),
            ${baseTransparent} !important;
          border: 1px solid rgba(255, 255, 255, ${borderOpacity}) !important;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, ${shadowStrength}),
            inset 0 1px 0 rgba(255, 255, 255, ${borderOpacity}),
            inset 0 -1px 0 rgba(255, 255, 255, ${borderOpacity * 0.5}) !important;
          position: relative;
          overflow: hidden;
        }
        
        /* Efecto de brillo superior para simular reflexión de vidrio */
        .business-card-custom.effect-glass::before {
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
        
        /* Punto de luz brillante para simular reflexión */
        .business-card-custom.effect-glass::after {
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
        
        /* Asegurar que el contenido esté por encima */
        .business-card-custom.effect-glass .card-body,
        .business-card-custom.effect-glass .card-body > *,
        .business-card-custom.effect-glass > * {
          position: relative;
          z-index: 2;
        }
      `);
    }

    // Subtle Animations
    if (effects.subtleAnimations.enabled) {
      const intensity = effects.subtleAnimations.intensity || 0.6;
      const scaleAmount = 1 + (0.03 * intensity); // Más visible: 1.018 en lugar de 1.006
      const brightnessAmount = 1 + (0.05 * intensity); // Más brillo: 1.03 en lugar de 1.02
      const duration = 3 + (3 * (1 - intensity)); // Rango 3-6 segundos
      
      styles.push(`
        .business-card-custom.effect-animate {
          animation: subtleBreathe ${duration}s ease-in-out infinite !important;
          transform-origin: center center !important;
          will-change: transform, filter !important;
        }
        
        /* Si hay hover, pausar la animación durante hover */
        .business-card-custom.effect-animate.effect-hover:hover {
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
      const patternOpacity = 0.25 * intensity; // Ligeramente más visible
      
      // Adaptar colores según el fondo del usuario
      const baseColor = this.extractBaseColor(cardColors.background);
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
      
      // Crear un sistema que funcione con o sin glassmorphism
      // Los patrones van en un elemento pseudo separado que no interfiere
      styles.push(`
        .business-card-custom.effect-patterns {
          position: relative;
        }
        
        /* Sistema de patrones que evita conflictos con glassmorphism */
        .business-card-custom.effect-patterns {
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
        
        /* Cuando glassmorphism está activo, los patrones van como fondo base */
        .business-card-custom.effect-patterns.effect-glass {
          background-blend-mode: ${isLight ? 'multiply' : 'screen'};
        }
      `)
      
      // Animaciones para los patrones
      styles.push(`
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

    // Gradientes Animados para el fondo de página
    if (effects.animatedGradients.enabled) {
      console.log('🌈 Generando CSS para gradientes animados:', effects.animatedGradients);
      const intensity = effects.animatedGradients.intensity / 5; // 0.2 - 1.0  
      const opacity = (effects.animatedGradients.customProperties?.opacity as number) || 0.5; // Usar opacidad específica para gradientes
      const speed = effects.animatedGradients.speed;
      const duration = 15 - (speed * 2); // 5-13 segundos

      // Definir gradientes por tipo
      const gradientDefinitions = {
        aurora: {
          colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
          description: 'Luces boreales mágicas'
        },
        cosmic: {
          colors: ['#2b1055', '#7597de', '#c9d6ff', '#667db6', '#0082c8', '#41b883'],
          description: 'Espacio profundo cósmico'
        },
        ocean: {
          colors: ['#667db6', '#0082c8', '#41b883', '#11998e', '#38ef7d', '#667eea'],
          description: 'Ondas oceánicas profundas'
        },
        sunset: {
          colors: ['#f093fb', '#f5576c', '#4facfe', '#fc466b', '#3f5efb', '#f12711'],
          description: 'Atardecer cálido radiante'
        },
        forest: {
          colors: ['#11998e', '#38ef7d', '#2d5016', '#1b4332', '#081c15', '#2e7d32'],
          description: 'Bosque verde profundo'
        },
        professional: {
          colors: ['#4a4a4a', '#5a5a5a', '#2a2a2a', '#1a1a2e', '#16213e', '#0f3460'],
          description: 'Elegancia profesional sutil'
        }
      };

      const selectedGradient = gradientDefinitions[effects.animatedGradients.type] || gradientDefinitions.aurora;
      const [color1, color2, color3, color4, color5, color6] = selectedGradient.colors;

      styles.push(`
        /* Gradientes Animados de Fondo */
        .page-background-container.effect-animated-gradient,
        .preview-background-container.effect-animated-gradient {
          background: linear-gradient(-45deg, ${color1}, ${color2}, ${color3}, ${color4}, ${color5}, ${color6}) !important;
          background-size: 400% 400% !important;
          animation: gradientFlow${effects.animatedGradients.type} ${duration}s ease infinite !important;
        }
        
        /* Opacity ajustada para preview vs página completa */
        .page-background-container.effect-animated-gradient {
          opacity: ${opacity};
        }
        
        .preview-background-container.effect-animated-gradient {
          opacity: ${Math.min(opacity * 1.2, 1.0)}; /* Más visible en preview */
        }
        
        /* Keyframes específicos para ${effects.animatedGradients.type} */
        @keyframes gradientFlow${effects.animatedGradients.type} {
          0% { 
            background-position: 0% 50%;
            filter: brightness(${0.8 + (intensity * 0.4)});
          }
          25% { 
            background-position: 100% 0%;
            filter: brightness(${1.0 + (intensity * 0.3)});
          }
          50% { 
            background-position: 100% 100%;
            filter: brightness(${0.9 + (intensity * 0.2)});
          }
          75% { 
            background-position: 0% 100%;
            filter: brightness(${1.1 + (intensity * 0.4)});
          }
          100% { 
            background-position: 0% 50%;
            filter: brightness(${0.8 + (intensity * 0.4)});
          }
        }
        
        /* Overlay sutil para mejor integración */
        .page-background-container.effect-animated-gradient::before,
        .preview-background-container.effect-animated-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at center,
            transparent 0%,
            rgba(0, 0, 0, ${0.1 * intensity}) 100%
          );
          pointer-events: none;
          z-index: 1;
        }
      `);
    }

    // Mouse Tracking Effects
    if (effects.mouseTracking.enabled) {
      const sensitivity = effects.mouseTracking.sensitivity;
      const intensity = effects.mouseTracking.intensity || 1;

      styles.push(`
        /* Mouse Tracking Base Styles */
        .business-card-custom.effect-mouse-tracking {
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out;
          will-change: transform;
        }
        
        /* Mouse Glow Effect */
        ${effects.mouseTracking.enableGlow ? `
        .business-card-custom.effect-mouse-tracking {
          overflow: visible;
        }
        
        .business-card-custom.effect-mouse-tracking::before {
          content: '';
          position: absolute;
          width: 120px;
          height: 120px;
          background: radial-gradient(
            circle at center,
            rgba(0, 246, 255, ${0.4 * intensity}) 0%,
            rgba(0, 246, 255, ${0.2 * intensity}) 30%,
            rgba(138, 43, 226, ${0.1 * intensity}) 60%,
            transparent 80%
          );
          border-radius: 50%;
          filter: blur(25px);
          opacity: 0;
          pointer-events: none;
          z-index: 1;
          transition: opacity 0.3s ease, transform 0.1s ease-out;
          left: var(--glow-x, 50%);
          top: var(--glow-y, 50%);
          transform: translate(-50%, -50%);
        }
        
        .business-card-custom.effect-mouse-tracking.tracking-active::before {
          opacity: 1;
        }
        ` : ''}
        
        /* Mouse Tilt Effect */
        ${effects.mouseTracking.enableTilt ? `
        .business-card-custom.effect-mouse-tracking.tracking-active {
          perspective: 1000px;
        }
        ` : ''}
        
        /* Mouse Particle Follow */
        ${effects.mouseTracking.enableParticleFollow ? `
        .business-card-custom.effect-mouse-tracking .particles-container .particle {
          transition: transform 0.2s ease-out;
        }
        
        .business-card-custom.effect-mouse-tracking.tracking-active .particles-container .particle {
          transform: translate(
            calc(var(--mouse-x, 0.5) * 20px - 10px),
            calc(var(--mouse-y, 0.5) * 20px - 10px)
          );
        }
        ` : ''}
        
        /* Enhanced hover compatibility */
        .business-card-custom.effect-mouse-tracking.effect-hover:hover {
          animation-play-state: paused;
        }
        
        /* Performance optimizations */
        .business-card-custom.effect-mouse-tracking * {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `);
    }

    return styles.join('\n');
  }

  /**
   * Genera configuración de partículas basada en tipo
   */
  public generateParticleConfig(particles: ParticleConfig): Record<string, unknown> | null {
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

      default: // floating
        return baseConfig;
    }
  }

  /**
   * Extrae el color base de un fondo (puede ser color sólido o gradiente)
   */
  private extractBaseColor(background: string): string {
    if (background.includes('linear-gradient')) {
      // Extraer el primer color del gradiente
      const colorMatch = background.match(/#[0-9a-fA-F]{6}/);
      return colorMatch ? colorMatch[0] : '#000000';
    }
    return background;
  }

  /**
   * Determina si un color es claro u oscuro
   */
  private isLightColor(color: string): boolean {
    if (!color.startsWith('#')) return false;
    
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Fórmula de luminancia
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }

  /**
   * Convierte color hexadecimal a RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }

  /**
   * Valida compatibilidad de efectos
   */
  public validateEffectCombination(effects: VisualEffectsState): {
    isValid: boolean;
    warnings: string[];
    recommendations: string[];
  } {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Glassmorphism + Background Patterns puede causar conflictos visuales
    if (effects.glassmorphism.enabled && effects.backgroundPatterns.enabled) {
      warnings.push("Glassmorphism y patrones de fondo activos - usando ::after para patrones");
      recommendations.push("Efectos compatibles - sin problemas detectados");
    }

    // Hover + Subtle Animations pueden colisionar
    if (effects.hoverEffect.enabled && effects.subtleAnimations.enabled) {
      recommendations.push("Hover pausará animaciones automáticamente durante interacción");
    }

    // Partículas + muchos efectos
    if (effects.particles.enabled) {
      const otherEffects = Object.entries(effects)
        .filter(([key, effect]) => key !== 'particles' && effect.enabled).length;
      
      if (otherEffects > 2) {
        warnings.push(`Partículas + ${otherEffects} efectos adicionales pueden afectar performance`);
        recommendations.push("En móviles se reducirá automáticamente el número de partículas");
      }

      // Validar tipo de partícula
      const validTypes = ['floating', 'constellation', 'professional', 'creative'];
      if (!validTypes.includes(effects.particles.type)) {
        warnings.push(`Tipo de partícula "${effects.particles.type}" no reconocido`);
        recommendations.push("Usar: floating, constellation, professional, o creative");
      }
    }

    // Muchos efectos activos pueden afectar performance
    const activeEffects = Object.values(effects).filter(effect => effect.enabled).length;
    if (activeEffects > 4) {
      warnings.push(`${activeEffects} efectos activos - performance puede verse afectada`);
      recommendations.push("Considera reducir efectos o usar configuración automática para móvil");
    }

    return {
      isValid: warnings.length === 0,
      warnings,
      recommendations
    };
  }

  /**
   * Aplica efectos inteligentemente según el tema de la tarjeta
   */
  public applyIntelligentEffects(effects: VisualEffectsState, cardColors: { background: string; text: string }): VisualEffectsState {
    const optimized = { ...effects };
    
    // Detectar si es un tema oscuro o claro
    const baseColor = this.extractBaseColor(cardColors.background);
    const isLightTheme = this.isLightColor(baseColor);
    
    // Ajustar intensidades según el tema
    if (optimized.glassmorphism.enabled) {
      // Glassmorphism funciona mejor en temas oscuros
      optimized.glassmorphism.intensity = isLightTheme ? 0.7 : 1.0;
    }
    
    if (optimized.backgroundPatterns.enabled) {
      // Patrones más sutiles en temas claros
      optimized.backgroundPatterns.intensity = isLightTheme ? 0.4 : 0.7;
    }
    
    if (optimized.animatedGradients.enabled) {
      // Gradientes más visibles según el contraste
      const currentOpacity = (optimized.animatedGradients.customProperties?.opacity as number) || 0.5;
      optimized.animatedGradients.customProperties = {
        ...optimized.animatedGradients.customProperties,
        opacity: isLightTheme ? Math.min(currentOpacity * 1.2, 1.0) : currentOpacity
      };
    }
    
    return optimized;
  }

  /**
   * Optimiza efectos según el dispositivo
   */
  public optimizeForDevice(effects: VisualEffectsState, isMobile: boolean): VisualEffectsState {
    if (!isMobile) return effects;

    // En móvil, reducir intensidad de efectos
    return {
      ...effects,
      hoverEffect: { ...effects.hoverEffect, enabled: false }, // Sin hover en móvil
      glassmorphism: { 
        ...effects.glassmorphism, 
        intensity: (effects.glassmorphism.intensity || 1) * 0.7 
      },
      particles: {
        ...effects.particles,
        count: Math.min(effects.particles.count, 15), // Menos partículas
        speed: (effects.particles.speed || 1) * 0.5
      }
    };
  }
}

export default EffectsManager;
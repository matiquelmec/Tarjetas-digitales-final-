/**
 * Sistema Avanzado de Efectos Visuales para Presentaciones
 * Basado en el éxito del EffectsManager de tarjetas digitales
 * Elevado a nivel cinematográfico para presentaciones profesionales
 */

export interface SlideEffectConfig {
  enabled: boolean;
  intensity?: number;
  duration?: number;
  customProperties?: Record<string, unknown>;
}

export interface SlideParticleConfig extends SlideEffectConfig {
  type: 'floating' | 'constellation' | 'professional' | 'creative' | 'stars' | 'confetti' | 'matrix' | 'bubbles';
  count: number;
  color?: string;
  speed?: number;
  size?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'random';
}

export interface SlideTransitionConfig {
  type: 'fade' | 'slide' | 'zoom' | 'flip' | 'glass-shatter' | 'particle-dissolve' | 
        'wave-morph' | 'constellation-connect' | 'holographic' | 'cube' | 'coverflow';
  duration: number;
  easing: string;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export interface PresentationEffectsState {
  // Efectos base heredados de tarjetas
  glassmorphism: SlideEffectConfig;
  particles: SlideParticleConfig;
  animations: SlideEffectConfig;
  patterns: SlideEffectConfig;
  shadows: SlideEffectConfig;
  
  // Efectos exclusivos para presentaciones
  transitions: SlideTransitionConfig;
  parallax: SlideEffectConfig;
  glow: SlideEffectConfig;
  noise: SlideEffectConfig;
  gradientAnimations: SlideEffectConfig;
  
  // Efectos premium
  holographic: SlideEffectConfig;
  auroras: SlideEffectConfig;
  crystalline: SlideEffectConfig;
}

export interface SlideColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export class PresentationEffectsManager {
  private static instance: PresentationEffectsManager;
  
  public static getInstance(): PresentationEffectsManager {
    if (!PresentationEffectsManager.instance) {
      PresentationEffectsManager.instance = new PresentationEffectsManager();
    }
    return PresentationEffectsManager.instance;
  }

  /**
   * Genera estado de efectos por defecto basado en el tema
   */
  public getDefaultEffectsForTheme(themeId: string): PresentationEffectsState {
    const premiumThemes = ['diamond', 'executive-platinum', 'startup-unicorn'];
    const creativeThemes = ['artist-canvas', 'creative-gradient', 'neon-cyber'];
    const techThemes = ['tech-innovation', 'matrix-code', 'cyber-punk'];
    
    const isPremium = premiumThemes.includes(themeId);
    const isCreative = creativeThemes.includes(themeId);
    const isTech = techThemes.includes(themeId);
    
    return {
      glassmorphism: {
        enabled: isPremium || isTech,
        intensity: isPremium ? 0.9 : 0.7
      },
      particles: {
        enabled: isCreative || isTech,
        type: isTech ? 'matrix' : isCreative ? 'confetti' : 'constellation',
        count: isPremium ? 50 : 30,
        speed: 1,
        size: 4,
        direction: 'random'
      },
      animations: {
        enabled: true,
        intensity: isCreative ? 0.9 : 0.6,
        duration: 3000
      },
      patterns: {
        enabled: isCreative,
        intensity: 0.4
      },
      shadows: {
        enabled: true,
        intensity: isPremium ? 0.8 : 0.5
      },
      transitions: {
        type: isPremium ? 'holographic' : isTech ? 'matrix' : 'slide',
        duration: isPremium ? 1200 : 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        direction: 'right'
      },
      parallax: {
        enabled: isPremium || isCreative,
        intensity: 0.6
      },
      glow: {
        enabled: isTech || isPremium,
        intensity: 0.7
      },
      noise: {
        enabled: isTech,
        intensity: 0.1
      },
      gradientAnimations: {
        enabled: isCreative || isPremium,
        intensity: 0.5,
        duration: 10000
      },
      holographic: {
        enabled: isPremium,
        intensity: 0.8
      },
      auroras: {
        enabled: isPremium && themeId === 'diamond',
        intensity: 0.6
      },
      crystalline: {
        enabled: isPremium,
        intensity: 0.7
      }
    };
  }

  /**
   * Genera CSS dinámico para efectos de slides
   */
  public generateSlideEffectStyles(
    effects: PresentationEffectsState, 
    colors: SlideColorPalette
  ): string {
    const styles: string[] = [];

    // Glassmorphism avanzado para slides
    if (effects.glassmorphism.enabled) {
      const intensity = effects.glassmorphism.intensity || 0.8;
      const { r, g, b } = this.hexToRgb(colors.background);
      
      styles.push(`
        .slide-container.effect-glass {
          background: linear-gradient(
            135deg,
            rgba(${r}, ${g}, ${b}, ${0.9 * intensity}),
            rgba(${r}, ${g}, ${b}, ${0.7 * intensity})
          ) !important;
          backdrop-filter: blur(${20 * intensity}px) saturate(${1.5 + intensity * 0.5});
          -webkit-backdrop-filter: blur(${20 * intensity}px) saturate(${1.5 + intensity * 0.5});
          border: 1px solid rgba(255, 255, 255, ${0.18 * intensity});
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, ${0.2 * intensity}),
            inset 0 1px 0 rgba(255, 255, 255, ${0.2 * intensity}),
            inset 0 -1px 0 rgba(255, 255, 255, ${0.1 * intensity});
          position: relative;
          overflow: hidden;
        }
        
        .slide-container.effect-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, ${0.1 * intensity}),
            transparent
          );
          animation: glassShimmer 3s ease-in-out infinite;
        }
        
        @keyframes glassShimmer {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `);
    }

    // Sistema de sombras cinematográficas
    if (effects.shadows.enabled) {
      const intensity = effects.shadows.intensity || 0.6;
      
      styles.push(`
        .slide-container.effect-shadows {
          box-shadow: 
            0 ${10 * intensity}px ${30 * intensity}px rgba(0, 0, 0, ${0.1 * intensity}),
            0 ${20 * intensity}px ${60 * intensity}px rgba(0, 0, 0, ${0.15 * intensity}),
            0 ${30 * intensity}px ${90 * intensity}px rgba(0, 0, 0, ${0.2 * intensity});
          transition: box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .slide-container.effect-shadows:hover {
          box-shadow: 
            0 ${15 * intensity}px ${40 * intensity}px rgba(0, 0, 0, ${0.15 * intensity}),
            0 ${25 * intensity}px ${70 * intensity}px rgba(0, 0, 0, ${0.2 * intensity}),
            0 ${35 * intensity}px ${100 * intensity}px rgba(0, 0, 0, ${0.25 * intensity});
        }
      `);
    }

    // Animaciones de respiración para slides
    if (effects.animations.enabled) {
      const intensity = effects.animations.intensity || 0.6;
      const duration = effects.animations.duration || 4000;
      
      styles.push(`
        .slide-container.effect-animate {
          animation: slideBreath ${duration}ms ease-in-out infinite;
          transform-origin: center center;
        }
        
        @keyframes slideBreath {
          0%, 100% { 
            transform: scale(1) translateY(0);
            filter: brightness(1);
          }
          50% { 
            transform: scale(${1 + 0.02 * intensity}) translateY(-${2 * intensity}px);
            filter: brightness(${1 + 0.05 * intensity});
          }
        }
        
        .slide-content.effect-animate-content > * {
          animation: contentFadeIn 0.8s ease-out backwards;
        }
        
        .slide-content.effect-animate-content > *:nth-child(1) { animation-delay: 0.1s; }
        .slide-content.effect-animate-content > *:nth-child(2) { animation-delay: 0.2s; }
        .slide-content.effect-animate-content > *:nth-child(3) { animation-delay: 0.3s; }
        .slide-content.effect-animate-content > *:nth-child(4) { animation-delay: 0.4s; }
        .slide-content.effect-animate-content > *:nth-child(5) { animation-delay: 0.5s; }
        
        @keyframes contentFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `);
    }

    // Efecto Parallax para profundidad
    if (effects.parallax.enabled) {
      const intensity = effects.parallax.intensity || 0.6;
      
      styles.push(`
        .slide-container.effect-parallax {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        
        .slide-parallax-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .slide-parallax-back {
          transform: translateZ(-${100 * intensity}px) scale(${1 + 0.1 * intensity});
        }
        
        .slide-parallax-mid {
          transform: translateZ(-${50 * intensity}px) scale(${1 + 0.05 * intensity});
        }
        
        .slide-parallax-front {
          transform: translateZ(0);
        }
        
        .slide-container.effect-parallax:hover .slide-parallax-back {
          transform: translateZ(-${120 * intensity}px) scale(${1 + 0.12 * intensity});
        }
        
        .slide-container.effect-parallax:hover .slide-parallax-mid {
          transform: translateZ(-${60 * intensity}px) scale(${1 + 0.06 * intensity});
        }
      `);
    }

    // Efecto Glow para elementos destacados
    if (effects.glow.enabled) {
      const intensity = effects.glow.intensity || 0.7;
      const glowColor = this.adjustColorBrightness(colors.accent, 1.2);
      
      styles.push(`
        .slide-container.effect-glow .glow-element {
          position: relative;
          z-index: 1;
        }
        
        .slide-container.effect-glow .glow-element::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            ${glowColor}${Math.floor(40 * intensity)},
            transparent 70%
          );
          filter: blur(${20 * intensity}px);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: -1;
        }
        
        .slide-container.effect-glow .glow-element:hover::after {
          opacity: 1;
        }
        
        .slide-title.glow-text {
          text-shadow: 
            0 0 ${10 * intensity}px ${colors.accent}40,
            0 0 ${20 * intensity}px ${colors.accent}30,
            0 0 ${30 * intensity}px ${colors.accent}20;
        }
      `);
    }

    // Gradientes animados
    if (effects.gradientAnimations.enabled) {
      const intensity = effects.gradientAnimations.intensity || 0.5;
      const duration = effects.gradientAnimations.duration || 10000;
      
      styles.push(`
        .slide-container.effect-gradient-animate {
          background-size: 200% 200% !important;
          animation: gradientShift ${duration}ms ease infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .slide-gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            transparent,
            ${colors.primary}${Math.floor(20 * intensity)},
            transparent,
            ${colors.secondary}${Math.floor(20 * intensity)},
            transparent
          );
          background-size: 300% 300%;
          animation: gradientWave ${duration * 1.5}ms linear infinite;
          pointer-events: none;
          mix-blend-mode: overlay;
        }
        
        @keyframes gradientWave {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
      `);
    }

    // Efecto Holográfico Premium
    if (effects.holographic.enabled) {
      const intensity = effects.holographic.intensity || 0.8;
      
      styles.push(`
        .slide-container.effect-holographic {
          position: relative;
          background: linear-gradient(
            45deg,
            ${colors.primary},
            ${colors.secondary},
            ${colors.accent},
            ${colors.primary}
          );
          background-size: 300% 300%;
          animation: holographicShift ${6000 / intensity}ms ease infinite;
        }
        
        .slide-container.effect-holographic::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(
            45deg,
            #ff0080, #ff8c00, #40e0d0, #ff0080
          );
          opacity: ${0.4 * intensity};
          z-index: -1;
          border-radius: inherit;
          filter: blur(8px);
          background-size: 300% 300%;
          animation: holographicShift ${6000 / intensity}ms ease infinite reverse;
        }
        
        @keyframes holographicShift {
          0% { background-position: 0% 0%; }
          33% { background-position: 100% 0%; }
          66% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        
        .slide-container.effect-holographic .holographic-text {
          background: linear-gradient(
            90deg,
            #ff0080, #ff8c00, #40e0d0, #ff0080
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: holographicText 3s linear infinite;
        }
        
        @keyframes holographicText {
          to { background-position: 200% center; }
        }
      `);
    }

    // Efecto Aurora Boreal
    if (effects.auroras.enabled) {
      const intensity = effects.auroras.intensity || 0.6;
      
      styles.push(`
        .slide-container.effect-aurora {
          position: relative;
          overflow: hidden;
        }
        
        .slide-container.effect-aurora::before,
        .slide-container.effect-aurora::after {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          opacity: ${0.3 * intensity};
          mix-blend-mode: screen;
        }
        
        .slide-container.effect-aurora::before {
          background: radial-gradient(
            ellipse at center,
            rgba(120, 255, 214, 0.3) 0%,
            rgba(120, 200, 255, 0.2) 40%,
            transparent 70%
          );
          animation: auroraRotate ${20000 / intensity}ms linear infinite;
        }
        
        .slide-container.effect-aurora::after {
          background: radial-gradient(
            ellipse at center,
            rgba(255, 120, 203, 0.3) 0%,
            rgba(189, 120, 255, 0.2) 40%,
            transparent 70%
          );
          animation: auroraRotate ${25000 / intensity}ms linear infinite reverse;
        }
        
        @keyframes auroraRotate {
          from { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          to { transform: rotate(360deg) scale(1); }
        }
      `);
    }

    // Efecto Cristalino
    if (effects.crystalline.enabled) {
      const intensity = effects.crystalline.intensity || 0.7;
      
      styles.push(`
        .slide-container.effect-crystalline {
          position: relative;
          background: linear-gradient(
            135deg,
            ${colors.background}ee,
            ${colors.primary}dd
          );
        }
        
        .crystalline-facet {
          position: absolute;
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, ${0.1 * intensity}),
            rgba(255, 255, 255, ${0.05 * intensity})
          );
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          animation: crystallineGlint ${4000 / intensity}ms ease-in-out infinite;
        }
        
        .crystalline-facet:nth-child(1) {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 15%;
          animation-delay: 0s;
        }
        
        .crystalline-facet:nth-child(2) {
          width: 80px;
          height: 80px;
          top: 60%;
          right: 20%;
          animation-delay: 1s;
        }
        
        .crystalline-facet:nth-child(3) {
          width: 120px;
          height: 120px;
          bottom: 15%;
          left: 40%;
          animation-delay: 2s;
        }
        
        @keyframes crystallineGlint {
          0%, 100% { 
            transform: rotate(0deg) scale(1);
            opacity: ${0.3 * intensity};
          }
          50% { 
            transform: rotate(180deg) scale(1.1);
            opacity: ${0.6 * intensity};
          }
        }
      `);
    }

    // Noise texture para efecto vintage/film
    if (effects.noise.enabled) {
      const intensity = effects.noise.intensity || 0.1;
      
      styles.push(`
        .slide-container.effect-noise::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: ${intensity};
          z-index: 1;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }
      `);
    }

    return styles.join('\n');
  }

  /**
   * Genera configuración de partículas específica para presentaciones
   */
  public generatePresentationParticles(config: SlideParticleConfig): string {
    if (!config.enabled) return '';

    const styles: string[] = [];
    const particleClass = `particle-${config.type}`;
    
    styles.push(`
      .slide-particles-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
      }
      
      .slide-particle {
        position: absolute;
        pointer-events: none;
      }
    `);

    // Configuraciones específicas por tipo
    switch (config.type) {
      case 'stars':
        styles.push(`
          .${particleClass} {
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            animation: twinkle 3s ease-in-out infinite;
          }
          
          @keyframes twinkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1); }
          }
        `);
        break;

      case 'confetti':
        styles.push(`
          .${particleClass} {
            width: 10px;
            height: 10px;
            background: linear-gradient(45deg, 
              #ff0080, #ff8c00, #40e0d0, #ff0080);
            animation: confettiFall 3s linear infinite;
          }
          
          @keyframes confettiFall {
            0% { 
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% { 
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `);
        break;

      case 'matrix':
        styles.push(`
          .${particleClass} {
            color: #0f0;
            font-family: monospace;
            font-size: 14px;
            animation: matrixFall 5s linear infinite;
            text-shadow: 0 0 5px #0f0;
          }
          
          @keyframes matrixFall {
            0% { 
              transform: translateY(-100%);
              opacity: 1;
            }
            90% { 
              opacity: 1;
            }
            100% { 
              transform: translateY(100vh);
              opacity: 0;
            }
          }
        `);
        break;

      case 'bubbles':
        styles.push(`
          .${particleClass} {
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            animation: bubbleFloat 6s ease-in-out infinite;
          }
          
          @keyframes bubbleFloat {
            0% { 
              transform: translateY(100vh) scale(0);
              opacity: 0;
            }
            10% { 
              opacity: 0.6;
            }
            90% { 
              opacity: 0.6;
            }
            100% { 
              transform: translateY(-100vh) scale(1);
              opacity: 0;
            }
          }
        `);
        break;

      default:
        // Floating particles por defecto
        styles.push(`
          .${particleClass} {
            width: ${config.size || 4}px;
            height: ${config.size || 4}px;
            background: ${config.color || 'rgba(255, 255, 255, 0.8)'};
            border-radius: 50%;
            animation: floatParticle 6s ease-in-out infinite;
          }
          
          @keyframes floatParticle {
            0%, 100% { 
              transform: translateY(0px) translateX(0px);
              opacity: 0.7;
            }
            33% { 
              transform: translateY(-30px) translateX(10px);
              opacity: 1;
            }
            66% { 
              transform: translateY(-10px) translateX(-5px);
              opacity: 0.8;
            }
          }
        `);
    }

    return styles.join('\n');
  }

  /**
   * Genera estilos para transiciones cinematográficas
   */
  public generateTransitionStyles(config: SlideTransitionConfig): string {
    const styles: string[] = [];
    const { type, duration, easing, direction = 'right' } = config;

    styles.push(`
      .slide-transition-${type} {
        animation-duration: ${duration}ms;
        animation-timing-function: ${easing};
        animation-fill-mode: both;
      }
    `);

    switch (type) {
      case 'glass-shatter':
        styles.push(`
          @keyframes glassShatter {
            0% { 
              opacity: 1;
              transform: scale(1) rotate(0deg);
              filter: blur(0);
            }
            50% { 
              opacity: 0.8;
              transform: scale(1.05) rotate(2deg);
              filter: blur(2px);
            }
            100% { 
              opacity: 0;
              transform: scale(0.9) rotate(-5deg) translateY(100px);
              filter: blur(10px);
            }
          }
          
          .slide-transition-glass-shatter-enter {
            animation-name: glassShatterReverse;
          }
          
          .slide-transition-glass-shatter-exit {
            animation-name: glassShatter;
          }
          
          @keyframes glassShatterReverse {
            from { 
              opacity: 0;
              transform: scale(0.9) rotate(-5deg) translateY(100px);
              filter: blur(10px);
            }
            to { 
              opacity: 1;
              transform: scale(1) rotate(0deg);
              filter: blur(0);
            }
          }
        `);
        break;

      case 'particle-dissolve':
        styles.push(`
          @keyframes particleDissolve {
            0% { 
              opacity: 1;
              transform: scale(1);
              filter: contrast(1);
            }
            50% { 
              opacity: 0.5;
              transform: scale(1.1);
              filter: contrast(2) brightness(1.2);
            }
            100% { 
              opacity: 0;
              transform: scale(1.5);
              filter: contrast(10) brightness(2) blur(20px);
            }
          }
          
          .slide-transition-particle-dissolve-enter {
            animation-name: particleDissolveReverse;
          }
          
          .slide-transition-particle-dissolve-exit {
            animation-name: particleDissolve;
          }
          
          @keyframes particleDissolveReverse {
            from { 
              opacity: 0;
              transform: scale(1.5);
              filter: contrast(10) brightness(2) blur(20px);
            }
            to { 
              opacity: 1;
              transform: scale(1);
              filter: contrast(1);
            }
          }
        `);
        break;

      case 'wave-morph':
        styles.push(`
          @keyframes waveMorph {
            0% { 
              opacity: 1;
              transform: translateX(0) scaleY(1);
              clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            }
            50% { 
              opacity: 0.7;
              transform: translateX(${direction === 'right' ? '50px' : '-50px'}) scaleY(0.8);
              clip-path: polygon(0 20%, 100% 0, 100% 80%, 0 100%);
            }
            100% { 
              opacity: 0;
              transform: translateX(${direction === 'right' ? '100%' : '-100%'}) scaleY(0.6);
              clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%);
            }
          }
          
          .slide-transition-wave-morph-enter {
            animation-name: waveMorphReverse;
          }
          
          .slide-transition-wave-morph-exit {
            animation-name: waveMorph;
          }
          
          @keyframes waveMorphReverse {
            from { 
              opacity: 0;
              transform: translateX(${direction === 'right' ? '-100%' : '100%'}) scaleY(0.6);
              clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%);
            }
            to { 
              opacity: 1;
              transform: translateX(0) scaleY(1);
              clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            }
          }
        `);
        break;

      case 'holographic':
        styles.push(`
          @keyframes holographicTransition {
            0% { 
              opacity: 1;
              transform: perspective(1000px) rotateY(0deg) translateZ(0);
              filter: hue-rotate(0deg);
            }
            50% { 
              opacity: 0.5;
              transform: perspective(1000px) rotateY(${direction === 'right' ? '90deg' : '-90deg'}) translateZ(200px);
              filter: hue-rotate(180deg) brightness(1.5);
            }
            100% { 
              opacity: 0;
              transform: perspective(1000px) rotateY(${direction === 'right' ? '180deg' : '-180deg'}) translateZ(0);
              filter: hue-rotate(360deg);
            }
          }
          
          .slide-transition-holographic-enter {
            animation-name: holographicTransitionReverse;
          }
          
          .slide-transition-holographic-exit {
            animation-name: holographicTransition;
          }
          
          @keyframes holographicTransitionReverse {
            from { 
              opacity: 0;
              transform: perspective(1000px) rotateY(${direction === 'right' ? '-180deg' : '180deg'}) translateZ(0);
              filter: hue-rotate(360deg);
            }
            to { 
              opacity: 1;
              transform: perspective(1000px) rotateY(0deg) translateZ(0);
              filter: hue-rotate(0deg);
            }
          }
        `);
        break;

      case 'cube':
        styles.push(`
          @keyframes cubeRotate {
            0% { 
              opacity: 1;
              transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
            }
            100% { 
              opacity: 0;
              transform: perspective(1000px) rotateX(${direction === 'up' ? '-90deg' : '90deg'}) rotateY(${direction === 'right' ? '90deg' : '-90deg'});
            }
          }
          
          .slide-transition-cube-enter {
            animation-name: cubeRotateReverse;
          }
          
          .slide-transition-cube-exit {
            animation-name: cubeRotate;
          }
          
          @keyframes cubeRotateReverse {
            from { 
              opacity: 0;
              transform: perspective(1000px) rotateX(${direction === 'up' ? '90deg' : '-90deg'}) rotateY(${direction === 'right' ? '-90deg' : '90deg'});
            }
            to { 
              opacity: 1;
              transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
            }
          }
        `);
        break;

      default:
        // Fade por defecto
        styles.push(`
          @keyframes fadeTransition {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .slide-transition-fade-enter {
            animation-name: fadeTransition;
          }
          
          .slide-transition-fade-exit {
            animation-name: fadeTransition;
            animation-direction: reverse;
          }
        `);
    }

    return styles.join('\n');
  }

  /**
   * Valida compatibilidad de efectos para presentaciones
   */
  public validateEffectsCombination(effects: PresentationEffectsState): {
    isValid: boolean;
    warnings: string[];
    recommendations: string[];
  } {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Verificar combinaciones que pueden afectar performance
    const heavyEffects = [
      effects.particles.enabled && effects.particles.count > 50,
      effects.holographic.enabled,
      effects.auroras.enabled,
      effects.crystalline.enabled,
      effects.parallax.enabled
    ].filter(Boolean).length;

    if (heavyEffects > 3) {
      warnings.push(`${heavyEffects} efectos pesados activos - puede afectar el rendimiento`);
      recommendations.push('Considera reducir la intensidad o cantidad de efectos para mejor performance');
    }

    // Verificar compatibilidad de glassmorphism con otros efectos
    if (effects.glassmorphism.enabled && effects.noise.enabled) {
      recommendations.push('Glassmorphism + Noise puede reducir la claridad visual');
    }

    // Verificar transiciones con parallax
    if (effects.parallax.enabled && ['cube', 'holographic'].includes(effects.transitions.type)) {
      warnings.push('Parallax con transiciones 3D puede causar mareos en algunos usuarios');
      recommendations.push('Considera usar transiciones más suaves con parallax');
    }

    // Verificar partículas con transiciones complejas
    if (effects.particles.enabled && effects.particles.count > 30) {
      if (['particle-dissolve', 'glass-shatter'].includes(effects.transitions.type)) {
        recommendations.push('Muchas partículas + transiciones complejas pueden ser visualmentedistractoras');
      }
    }

    return {
      isValid: warnings.length === 0,
      warnings,
      recommendations
    };
  }

  /**
   * Optimiza efectos para diferentes dispositivos y contextos
   */
  public optimizeForContext(
    effects: PresentationEffectsState,
    context: {
      isMobile: boolean;
      isPresenting: boolean;
      reducedMotion: boolean;
      batteryLevel?: number;
    }
  ): PresentationEffectsState {
    let optimized = { ...effects };

    // Optimización para móviles
    if (context.isMobile) {
      optimized.particles.count = Math.min(optimized.particles.count, 20);
      optimized.glassmorphism.intensity = (optimized.glassmorphism.intensity || 1) * 0.7;
      optimized.parallax.enabled = false;
      optimized.holographic.enabled = false;
      optimized.auroras.enabled = false;
    }

    // Modo presentación - reducir distracciones
    if (context.isPresenting) {
      optimized.particles.count = Math.min(optimized.particles.count, 15);
      optimized.animations.intensity = (optimized.animations.intensity || 1) * 0.5;
      optimized.noise.enabled = false;
    }

    // Respetar preferencias de accesibilidad
    if (context.reducedMotion) {
      optimized.animations.enabled = false;
      optimized.particles.enabled = false;
      optimized.transitions.type = 'fade';
      optimized.transitions.duration = Math.min(optimized.transitions.duration, 300);
      optimized.gradientAnimations.enabled = false;
      optimized.parallax.enabled = false;
    }

    // Modo ahorro de batería
    if (context.batteryLevel && context.batteryLevel < 20) {
      optimized.particles.enabled = false;
      optimized.gradientAnimations.enabled = false;
      optimized.auroras.enabled = false;
      optimized.holographic.enabled = false;
    }

    return optimized;
  }

  /**
   * Helpers privados
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }

  private adjustColorBrightness(hex: string, factor: number): string {
    const { r, g, b } = this.hexToRgb(hex);
    const newR = Math.min(255, Math.floor(r * factor));
    const newG = Math.min(255, Math.floor(g * factor));
    const newB = Math.min(255, Math.floor(b * factor));
    return `rgb(${newR}, ${newG}, ${newB})`;
  }

  /**
   * Genera presets de efectos por categoría
   */
  public getEffectPresets(): Record<string, Partial<PresentationEffectsState>> {
    return {
      minimal: {
        glassmorphism: { enabled: false },
        particles: { enabled: false, count: 0, type: 'floating' },
        animations: { enabled: true, intensity: 0.3 },
        patterns: { enabled: false },
        shadows: { enabled: true, intensity: 0.3 },
        transitions: { type: 'fade', duration: 500, easing: 'ease' }
      },
      professional: {
        glassmorphism: { enabled: true, intensity: 0.6 },
        particles: { enabled: false, count: 0, type: 'floating' },
        animations: { enabled: true, intensity: 0.5 },
        patterns: { enabled: false },
        shadows: { enabled: true, intensity: 0.6 },
        transitions: { type: 'slide', duration: 700, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
      },
      creative: {
        glassmorphism: { enabled: true, intensity: 0.8 },
        particles: { enabled: true, count: 30, type: 'confetti' },
        animations: { enabled: true, intensity: 0.8 },
        patterns: { enabled: true, intensity: 0.5 },
        shadows: { enabled: true, intensity: 0.7 },
        transitions: { type: 'wave-morph', duration: 900, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
        gradientAnimations: { enabled: true, intensity: 0.6 }
      },
      premium: {
        glassmorphism: { enabled: true, intensity: 0.9 },
        particles: { enabled: true, count: 40, type: 'constellation' },
        animations: { enabled: true, intensity: 0.7 },
        patterns: { enabled: true, intensity: 0.4 },
        shadows: { enabled: true, intensity: 0.8 },
        transitions: { type: 'holographic', duration: 1000, easing: 'cubic-bezier(0.19, 1, 0.22, 1)' },
        holographic: { enabled: true, intensity: 0.7 },
        auroras: { enabled: true, intensity: 0.5 },
        crystalline: { enabled: true, intensity: 0.6 },
        parallax: { enabled: true, intensity: 0.6 },
        glow: { enabled: true, intensity: 0.7 }
      },
      cinematic: {
        glassmorphism: { enabled: true, intensity: 1 },
        particles: { enabled: true, count: 50, type: 'stars' },
        animations: { enabled: true, intensity: 0.9 },
        patterns: { enabled: false },
        shadows: { enabled: true, intensity: 0.9 },
        transitions: { type: 'glass-shatter', duration: 1200, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
        parallax: { enabled: true, intensity: 0.8 },
        glow: { enabled: true, intensity: 0.8 },
        noise: { enabled: true, intensity: 0.05 }
      }
    };
  }
}

export default PresentationEffectsManager;
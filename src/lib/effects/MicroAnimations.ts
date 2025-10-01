/**
 * Micro-animations and Feedback System
 * Subtle, delightful animations that provide user feedback and enhance UX
 */

export interface MicroAnimationConfig {
  enabled: boolean;
  duration: number; // milliseconds
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier';
  delay: number;
  intensity: number; // 0-2
  repeatCount: number; // 0 = infinite, >0 = specific count
  direction: 'normal' | 'reverse' | 'alternate';
}

export interface FeedbackAnimation {
  id: string;
  name: string;
  trigger: 'hover' | 'click' | 'focus' | 'success' | 'error' | 'loading' | 'idle';
  animation: MicroAnimationConfig;
  cssKeyframes: string;
  description: string;
}

export class MicroAnimationManager {
  private animations: Map<string, FeedbackAnimation> = new Map();
  private activeAnimations: Set<string> = new Set();
  private animationQueue: Array<{ element: HTMLElement; animationId: string }> = [];

  constructor() {
    this.initializeDefaultAnimations();
  }

  // Initialize default micro-animations
  private initializeDefaultAnimations(): void {
    const defaultAnimations: FeedbackAnimation[] = [
      // Button Interactions
      {
        id: 'button-hover-lift',
        name: 'Button Hover Lift',
        trigger: 'hover',
        animation: {
          enabled: true,
          duration: 200,
          easing: 'ease-out',
          delay: 0,
          intensity: 1,
          repeatCount: 0,
          direction: 'normal'
        },
        cssKeyframes: `
          @keyframes buttonHoverLift {
            0% { transform: translateY(0px) scale(1); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            100% { transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
          }
        `,
        description: 'Subtle lift and scale on button hover'
      },
      
      {
        id: 'button-click-bounce',
        name: 'Button Click Bounce',
        trigger: 'click',
        animation: {
          enabled: true,
          duration: 400,
          easing: 'cubic-bezier',
          delay: 0,
          intensity: 1,
          repeatCount: 1,
          direction: 'normal'
        },
        cssKeyframes: `
          @keyframes buttonClickBounce {
            0% { transform: translateY(0px) scale(1); }
            30% { transform: translateY(2px) scale(0.95); }
            60% { transform: translateY(-1px) scale(1.05); }
            100% { transform: translateY(0px) scale(1); }
          }
        `,
        description: 'Satisfying bounce feedback on click'
      },

      // Input Field Interactions  
      {
        id: 'input-focus-glow',
        name: 'Input Focus Glow',
        trigger: 'focus',
        animation: {
          enabled: true,
          duration: 300,
          easing: 'ease-out',
          delay: 0,
          intensity: 1,
          repeatCount: 0,
          direction: 'normal'
        },
        cssKeyframes: `
          @keyframes inputFocusGlow {
            0% { 
              box-shadow: 0 0 0 0 rgba(0, 246, 255, 0);
              border-color: rgba(255, 255, 255, 0.3);
            }
            100% { 
              box-shadow: 0 0 0 3px rgba(0, 246, 255, 0.3), 0 0 20px rgba(0, 246, 255, 0.1);
              border-color: #00f6ff;
            }
          }
        `,
        description: 'Glowing border on input focus'
      },

      // Success Feedback
      {
        id: 'success-checkmark',
        name: 'Success Checkmark',
        trigger: 'success',
        animation: {
          enabled: true,
          duration: 600,
          easing: 'ease-out',
          delay: 0,
          intensity: 1,
          repeatCount: 1,
          direction: 'normal'
        },
        cssKeyframes: `
          @keyframes successCheckmark {
            0% { 
              transform: scale(0) rotate(0deg);
              opacity: 0;
            }
            50% { 
              transform: scale(1.3) rotate(10deg);
              opacity: 1;
            }
            100% { 
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }
          }
        `,
        description: 'Animated checkmark for success states'
      },

      // Error Feedback
      {
        id: 'error-shake',
        name: 'Error Shake',
        trigger: 'error',
        animation: {
          enabled: true,
          duration: 500,
          easing: 'ease-in-out',
          delay: 0,
          intensity: 1,
          repeatCount: 1,
          direction: 'normal'
        },
        cssKeyframes: `
          @keyframes errorShake {
            0%, 100% { transform: translateX(0px); }
            20% { transform: translateX(-5px); }
            40% { transform: translateX(5px); }
            60% { transform: translateX(-3px); }
            80% { transform: translateX(3px); }
          }
        `,
        description: 'Subtle shake for error feedback'
      },

      // Loading Animations
      {
        id: 'loading-pulse',
        name: 'Loading Pulse',
        trigger: 'loading',
        animation: {
          enabled: true,
          duration: 1500,
          easing: 'ease-in-out',
          delay: 0,
          intensity: 1,
          repeatCount: 0,
          direction: 'alternate'
        },
        cssKeyframes: `
          @keyframes loadingPulse {
            0% { opacity: 0.6; transform: scale(1); }
            100% { opacity: 1; transform: scale(1.05); }
          }
        `,
        description: 'Breathing effect for loading states'
      },

      // Card Interactions
      {
        id: 'card-hover-float',
        name: 'Card Hover Float',
        trigger: 'hover',
        animation: {
          enabled: true,
          duration: 300,
          easing: 'ease-out',
          delay: 0,
          intensity: 1,
          repeatCount: 0,
          direction: 'normal'
        },
        cssKeyframes: `
          @keyframes cardHoverFloat {
            0% { 
              transform: translateY(0px) rotateX(0deg);
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            100% { 
              transform: translateY(-8px) rotateX(2deg);
              box-shadow: 0 12px 24px rgba(0,0,0,0.15);
            }
          }
        `,
        description: 'Floating effect with perspective on card hover'
      },

      // Idle Breathing Animation
      {
        id: 'idle-breathe',
        name: 'Idle Breathing',
        trigger: 'idle',
        animation: {
          enabled: true,
          duration: 4000,
          easing: 'ease-in-out',
          delay: 0,
          intensity: 0.5,
          repeatCount: 0,
          direction: 'alternate'
        },
        cssKeyframes: `
          @keyframes idleBreathe {
            0% { 
              transform: scale(1) translateY(0px);
              filter: brightness(1);
            }
            100% { 
              transform: scale(1.02) translateY(-2px);
              filter: brightness(1.05);
            }
          }
        `,
        description: 'Subtle breathing animation for idle elements'
      },

      // Text Appear Animation
      {
        id: 'text-appear',
        name: 'Text Appear',
        trigger: 'success',
        animation: {
          enabled: true,
          duration: 800,
          easing: 'ease-out',
          delay: 100,
          intensity: 1,
          repeatCount: 1,
          direction: 'normal'
        },
        cssKeyframes: `
          @keyframes textAppear {
            0% { 
              opacity: 0;
              transform: translateY(20px) scale(0.9);
              filter: blur(2px);
            }
            60% { 
              opacity: 0.8;
              transform: translateY(-2px) scale(1.05);
              filter: blur(0px);
            }
            100% { 
              opacity: 1;
              transform: translateY(0px) scale(1);
              filter: blur(0px);
            }
          }
        `,
        description: 'Smooth text appearance with blur effect'
      },

      // Icon Spin
      {
        id: 'icon-spin',
        name: 'Icon Spin',
        trigger: 'loading',
        animation: {
          enabled: true,
          duration: 1000,
          easing: 'ease-in-out',
          delay: 0,
          intensity: 1,
          repeatCount: 0,
          direction: 'normal'
        },
        cssKeyframes: `
          @keyframes iconSpin {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
            100% { transform: rotate(360deg) scale(1); }
          }
        `,
        description: 'Smooth icon rotation for loading'
      },

      // Progress Bar Fill
      {
        id: 'progress-fill',
        name: 'Progress Fill',
        trigger: 'success',
        animation: {
          enabled: true,
          duration: 1200,
          easing: 'ease-out',
          delay: 0,
          intensity: 1,
          repeatCount: 1,
          direction: 'normal'
        },
        cssKeyframes: `
          @keyframes progressFill {
            0% { 
              width: 0%;
              background-position: 0% 50%;
            }
            100% { 
              width: 100%;
              background-position: 100% 50%;
            }
          }
        `,
        description: 'Smooth progress bar filling animation'
      }
    ];

    defaultAnimations.forEach(animation => {
      this.animations.set(animation.id, animation);
    });
  }

  // Generate CSS for all animations
  generateAnimationCSS(): string {
    const css: string[] = [];
    
    // Add all keyframes
    this.animations.forEach(animation => {
      if (animation.animation.enabled) {
        css.push(animation.cssKeyframes);
      }
    });

    // Add utility classes
    css.push(`
      /* Micro-animation utility classes */
      .micro-animate {
        transition: all 0.2s ease-out;
      }
      
      .micro-animate-fast {
        transition: all 0.1s ease-out;
      }
      
      .micro-animate-slow {
        transition: all 0.4s ease-out;
      }
      
      /* Animation states */
      .animate-hover-lift:hover {
        animation: buttonHoverLift 0.2s ease-out forwards;
      }
      
      .animate-click-bounce:active {
        animation: buttonClickBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      }
      
      .animate-focus-glow:focus {
        animation: inputFocusGlow 0.3s ease-out forwards;
      }
      
      .animate-success {
        animation: successCheckmark 0.6s ease-out forwards;
      }
      
      .animate-error {
        animation: errorShake 0.5s ease-in-out forwards;
      }
      
      .animate-loading {
        animation: loadingPulse 1.5s ease-in-out infinite alternate;
      }
      
      .animate-card-hover:hover {
        animation: cardHoverFloat 0.3s ease-out forwards;
      }
      
      .animate-idle {
        animation: idleBreathe 4s ease-in-out infinite alternate;
      }
      
      .animate-text-appear {
        animation: textAppear 0.8s ease-out forwards;
      }
      
      .animate-icon-spin {
        animation: iconSpin 1s ease-in-out infinite;
      }
      
      .animate-progress-fill {
        animation: progressFill 1.2s ease-out forwards;
      }
      
      /* Hover enhancements */
      .enhance-hover {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .enhance-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      }
      
      /* Click feedback */
      .enhance-click {
        transition: transform 0.1s ease;
      }
      
      .enhance-click:active {
        transform: scale(0.98);
      }
      
      /* Focus enhancements */
      .enhance-focus:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 246, 255, 0.3);
        border-color: #00f6ff;
      }
      
      /* Disabled state */
      .micro-animate:disabled,
      .micro-animate.disabled {
        opacity: 0.6;
        pointer-events: none;
        animation: none;
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .micro-animate,
        .micro-animate-fast,
        .micro-animate-slow {
          transition: none;
          animation: none;
        }
        
        .animate-hover-lift:hover,
        .animate-click-bounce:active,
        .animate-focus-glow:focus,
        .animate-card-hover:hover {
          animation: none;
          transform: none;
        }
        
        .animate-loading {
          animation: none;
        }
        
        .animate-idle {
          animation: none;
        }
      }
    `);

    return css.join('\n');
  }

  // Apply animation to element
  applyAnimation(element: HTMLElement, animationId: string, options?: Partial<MicroAnimationConfig>): void {
    const animation = this.animations.get(animationId);
    if (!animation || !animation.animation.enabled) return;

    // Merge options
    const config = { ...animation.animation, ...options };
    
    // Apply animation
    element.style.animationName = animationId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    element.style.animationDuration = `${config.duration}ms`;
    element.style.animationTimingFunction = config.easing;
    element.style.animationDelay = `${config.delay}ms`;
    element.style.animationIterationCount = config.repeatCount === 0 ? 'infinite' : config.repeatCount.toString();
    element.style.animationDirection = config.direction;
    element.style.animationFillMode = 'forwards';

    // Track active animation
    this.activeAnimations.add(animationId);

    // Clean up after animation
    const cleanup = () => {
      this.activeAnimations.delete(animationId);
      element.removeEventListener('animationend', cleanup);
    };
    element.addEventListener('animationend', cleanup);
  }

  // Trigger feedback animation
  triggerFeedback(element: HTMLElement, type: 'success' | 'error' | 'loading' | 'complete'): void {
    const animationMap = {
      success: 'success-checkmark',
      error: 'error-shake',
      loading: 'loading-pulse',
      complete: 'text-appear'
    };

    const animationId = animationMap[type];
    if (animationId) {
      this.applyAnimation(element, animationId);
    }
  }

  // Add custom animation
  addAnimation(animation: FeedbackAnimation): void {
    this.animations.set(animation.id, animation);
  }

  // Remove animation
  removeAnimation(id: string): void {
    this.animations.delete(id);
  }

  // Get animation by ID
  getAnimation(id: string): FeedbackAnimation | undefined {
    return this.animations.get(id);
  }

  // Get all animations by trigger
  getAnimationsByTrigger(trigger: FeedbackAnimation['trigger']): FeedbackAnimation[] {
    return Array.from(this.animations.values()).filter(anim => anim.trigger === trigger);
  }

  // Stop all animations on element
  stopAnimations(element: HTMLElement): void {
    element.style.animation = 'none';
    // Force reflow
    element.offsetHeight;
  }

  // Update animation config
  updateAnimation(id: string, updates: Partial<FeedbackAnimation>): void {
    const animation = this.animations.get(id);
    if (animation) {
      this.animations.set(id, { ...animation, ...updates });
    }
  }

  // Get active animations count
  getActiveAnimationsCount(): number {
    return this.activeAnimations.size;
  }

  // Clear all animations
  clearAll(): void {
    this.animations.clear();
    this.activeAnimations.clear();
    this.animationQueue = [];
  }

  // Get performance stats
  getStats(): {
    totalAnimations: number;
    activeAnimations: number;
    queuedAnimations: number;
    enabledAnimations: number;
  } {
    const enabledCount = Array.from(this.animations.values())
      .filter(anim => anim.animation.enabled).length;

    return {
      totalAnimations: this.animations.size,
      activeAnimations: this.activeAnimations.size,
      queuedAnimations: this.animationQueue.length,
      enabledAnimations: enabledCount
    };
  }
}

export default MicroAnimationManager;
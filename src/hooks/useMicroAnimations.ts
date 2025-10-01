'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import MicroAnimationManager, { FeedbackAnimation } from '@/lib/effects/MicroAnimations';

interface UseMicroAnimationsConfig {
  enabled: boolean;
  respectReducedMotion: boolean;
  globalIntensity: number; // 0-2
  enabledTriggers: Array<'hover' | 'click' | 'focus' | 'success' | 'error' | 'loading' | 'idle'>;
  customAnimations?: FeedbackAnimation[];
}

interface UseMicroAnimationsReturn {
  animationCSS: string;
  isEnabled: boolean;
  stats: {
    totalAnimations: number;
    activeAnimations: number;
    enabledAnimations: number;
  };
  controls: {
    triggerSuccess: (element: HTMLElement) => void;
    triggerError: (element: HTMLElement) => void;
    triggerLoading: (element: HTMLElement) => void;
    triggerComplete: (element: HTMLElement) => void;
    stopAnimations: (element: HTMLElement) => void;
    applyHoverEffect: (element: HTMLElement) => void;
    applyClickEffect: (element: HTMLElement) => void;
    applyFocusEffect: (element: HTMLElement) => void;
    updateIntensity: (intensity: number) => void;
  };
  classes: {
    hoverLift: string;
    clickBounce: string;
    focusGlow: string;
    cardHover: string;
    idleBreathe: string;
    enhanceHover: string;
    enhanceClick: string;
    enhanceFocus: string;
    microAnimate: string;
    microAnimateFast: string;
    microAnimateSlow: string;
  };
}

const defaultConfig: UseMicroAnimationsConfig = {
  enabled: true,
  respectReducedMotion: true,
  globalIntensity: 1,
  enabledTriggers: ['hover', 'click', 'focus', 'success', 'error'],
  customAnimations: []
};

export function useMicroAnimations(config: Partial<UseMicroAnimationsConfig> = {}): UseMicroAnimationsReturn {
  const [currentConfig, setCurrentConfig] = useState<UseMicroAnimationsConfig>({
    ...defaultConfig,
    ...config
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [manager] = useState(() => new MicroAnimationManager());

  // Detect reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // Add custom animations to manager
  useEffect(() => {
    if (currentConfig.customAnimations) {
      currentConfig.customAnimations.forEach(animation => {
        manager.addAnimation(animation);
      });
    }
  }, [currentConfig.customAnimations, manager]);

  // Check if animations should be enabled
  const isEnabled = useMemo(() => {
    if (!currentConfig.enabled) return false;
    if (currentConfig.respectReducedMotion && prefersReducedMotion) return false;
    return true;
  }, [currentConfig.enabled, currentConfig.respectReducedMotion, prefersReducedMotion]);

  // Generate CSS with current config
  const animationCSS = useMemo(() => {
    if (!isEnabled) {
      return `
        /* Animations disabled - reduced motion or user preference */
        .micro-animate,
        .micro-animate-fast,
        .micro-animate-slow {
          transition: none !important;
          animation: none !important;
        }
      `;
    }

    const baseCSS = manager.generateAnimationCSS();
    
    // Apply global intensity scaling
    if (currentConfig.globalIntensity !== 1) {
      const intensityCSS = `
        /* Global intensity scaling */
        .micro-animate {
          animation-duration: ${1 / currentConfig.globalIntensity}s !important;
        }
        
        .animate-hover-lift:hover {
          transform: translateY(-${3 * currentConfig.globalIntensity}px) scale(${1 + 0.02 * currentConfig.globalIntensity}) !important;
        }
        
        .animate-card-hover:hover {
          transform: translateY(-${8 * currentConfig.globalIntensity}px) rotateX(${2 * currentConfig.globalIntensity}deg) !important;
        }
      `;
      return baseCSS + intensityCSS;
    }

    return baseCSS;
  }, [isEnabled, manager, currentConfig.globalIntensity]);

  // Get current stats
  const stats = useMemo(() => {
    return manager.getStats();
  }, [manager]);

  // Control functions
  const triggerSuccess = useCallback((element: HTMLElement) => {
    if (isEnabled && currentConfig.enabledTriggers.includes('success')) {
      manager.triggerFeedback(element, 'success');
    }
  }, [isEnabled, currentConfig.enabledTriggers, manager]);

  const triggerError = useCallback((element: HTMLElement) => {
    if (isEnabled && currentConfig.enabledTriggers.includes('error')) {
      manager.triggerFeedback(element, 'error');
    }
  }, [isEnabled, currentConfig.enabledTriggers, manager]);

  const triggerLoading = useCallback((element: HTMLElement) => {
    if (isEnabled && currentConfig.enabledTriggers.includes('loading')) {
      manager.triggerFeedback(element, 'loading');
    }
  }, [isEnabled, currentConfig.enabledTriggers, manager]);

  const triggerComplete = useCallback((element: HTMLElement) => {
    if (isEnabled) {
      manager.triggerFeedback(element, 'complete');
    }
  }, [isEnabled, manager]);

  const stopAnimations = useCallback((element: HTMLElement) => {
    manager.stopAnimations(element);
  }, [manager]);

  const applyHoverEffect = useCallback((element: HTMLElement) => {
    if (isEnabled && currentConfig.enabledTriggers.includes('hover')) {
      manager.applyAnimation(element, 'button-hover-lift');
    }
  }, [isEnabled, currentConfig.enabledTriggers, manager]);

  const applyClickEffect = useCallback((element: HTMLElement) => {
    if (isEnabled && currentConfig.enabledTriggers.includes('click')) {
      manager.applyAnimation(element, 'button-click-bounce');
    }
  }, [isEnabled, currentConfig.enabledTriggers, manager]);

  const applyFocusEffect = useCallback((element: HTMLElement) => {
    if (isEnabled && currentConfig.enabledTriggers.includes('focus')) {
      manager.applyAnimation(element, 'input-focus-glow');
    }
  }, [isEnabled, currentConfig.enabledTriggers, manager]);

  const updateIntensity = useCallback((intensity: number) => {
    setCurrentConfig(prev => ({
      ...prev,
      globalIntensity: Math.max(0, Math.min(2, intensity))
    }));
  }, []);

  // CSS classes object
  const classes = useMemo(() => ({
    hoverLift: isEnabled ? 'animate-hover-lift' : '',
    clickBounce: isEnabled ? 'animate-click-bounce' : '',
    focusGlow: isEnabled ? 'animate-focus-glow' : '',
    cardHover: isEnabled ? 'animate-card-hover' : '',
    idleBreathe: isEnabled ? 'animate-idle' : '',
    enhanceHover: isEnabled ? 'enhance-hover' : '',
    enhanceClick: isEnabled ? 'enhance-click' : '',
    enhanceFocus: isEnabled ? 'enhance-focus' : '',
    microAnimate: isEnabled ? 'micro-animate' : '',
    microAnimateFast: isEnabled ? 'micro-animate-fast' : '',
    microAnimateSlow: isEnabled ? 'micro-animate-slow' : ''
  }), [isEnabled]);

  return {
    animationCSS,
    isEnabled,
    stats,
    controls: {
      triggerSuccess,
      triggerError,
      triggerLoading,
      triggerComplete,
      stopAnimations,
      applyHoverEffect,
      applyClickEffect,
      applyFocusEffect,
      updateIntensity
    },
    classes
  };
}

export default useMicroAnimations;
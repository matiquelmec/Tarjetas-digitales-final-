/**
 * Hook para gestionar efectos visuales de presentaciones
 * Sistema profesional y cinematográfico para slides
 */

import { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import PresentationEffectsManager, { 
  PresentationEffectsState, 
  SlideColorPalette,
  SlideTransitionConfig
} from '@/lib/effects/PresentationEffectsManager';
import { PresentationTheme } from '../types/themes';

interface UsePresentationEffectsProps {
  theme: PresentationTheme;
  customEffects?: Partial<PresentationEffectsState>;
  isPresenting?: boolean;
  slideIndex?: number;
  enableAutoOptimization?: boolean;
}

interface UsePresentationEffectsReturn {
  // Estados
  effectsState: PresentationEffectsState;
  isOptimized: boolean;
  deviceInfo: {
    isMobile: boolean;
    isTablet: boolean;
    hasReducedMotion: boolean;
    batteryLevel: number | null;
  };
  
  // Estilos
  effectStyles: string;
  particleStyles: string;
  transitionStyles: string;
  
  // Clases CSS
  slideClasses: string;
  containerClasses: string;
  
  // Controles
  toggleEffect: (effectName: keyof PresentationEffectsState) => void;
  setEffectIntensity: (effectName: keyof PresentationEffectsState, intensity: number) => void;
  applyPreset: (presetName: string) => void;
  
  // Transiciones
  currentTransition: SlideTransitionConfig;
  triggerTransition: (direction?: 'next' | 'prev') => void;
  
  // Validación
  validation: {
    isValid: boolean;
    warnings: string[];
    recommendations: string[];
  };
  
  // Performance
  performanceMetrics: {
    fps: number;
    renderTime: number;
    effectsCount: number;
  };
}

export function usePresentationEffects({
  theme,
  customEffects,
  isPresenting = false,
  slideIndex = 0,
  enableAutoOptimization = true
}: UsePresentationEffectsProps): UsePresentationEffectsReturn {
  const effectsManager = PresentationEffectsManager.getInstance();
  
  // Estados del dispositivo
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [hasReducedMotion, setHasReducedMotion] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isOptimized, setIsOptimized] = useState(false);
  
  // Performance tracking
  const [fps, setFps] = useState(60);
  const [renderTime, setRenderTime] = useState(0);
  const frameCount = useRef(0);
  const lastFrameTime = useRef(performance.now());
  
  // Estado de efectos
  const [localEffectsOverride, setLocalEffectsOverride] = useState<Partial<PresentationEffectsState>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');

  // Detectar capacidades del dispositivo
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Detectar preferencia de movimiento reducido
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setHasReducedMotion(mediaQuery.matches);
      
      // Detectar nivel de batería (si está disponible)
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          setBatteryLevel(battery.level * 100);
          battery.addEventListener('levelchange', () => {
            setBatteryLevel(battery.level * 100);
          });
        });
      }
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Tracking de FPS para optimización automática
  useEffect(() => {
    if (!enableAutoOptimization) return;
    
    const measureFPS = () => {
      const now = performance.now();
      const delta = now - lastFrameTime.current;
      
      if (delta >= 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / delta);
        setFps(currentFps);
        
        // Auto-optimizar si FPS cae por debajo de 30
        if (currentFps < 30 && !isOptimized) {
          setIsOptimized(true);
          console.warn('🎬 Performance baja detectada, optimizando efectos...');
        } else if (currentFps > 50 && isOptimized) {
          setIsOptimized(false);
          console.info('✨ Performance restaurada, efectos completos activados');
        }
        
        frameCount.current = 0;
        lastFrameTime.current = now;
      }
      
      frameCount.current++;
      requestAnimationFrame(measureFPS);
    };
    
    const animationId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(animationId);
  }, [enableAutoOptimization, isOptimized]);

  // Generar estado de efectos combinado
  const effectsState = useMemo((): PresentationEffectsState => {
    // Comenzar con efectos por defecto del tema
    let baseEffects = effectsManager.getDefaultEffectsForTheme(theme.id);
    
    // Aplicar efectos custom del usuario
    if (customEffects) {
      baseEffects = {
        ...baseEffects,
        ...customEffects
      };
    }
    
    // Aplicar overrides locales
    baseEffects = {
      ...baseEffects,
      ...localEffectsOverride
    };
    
    // Optimizar según contexto si está habilitado
    if (enableAutoOptimization || isOptimized) {
      baseEffects = effectsManager.optimizeForContext(baseEffects, {
        isMobile,
        isPresenting,
        reducedMotion: hasReducedMotion,
        batteryLevel: batteryLevel || undefined
      });
    }
    
    return baseEffects;
  }, [
    theme.id,
    customEffects,
    localEffectsOverride,
    enableAutoOptimization,
    isOptimized,
    isMobile,
    isPresenting,
    hasReducedMotion,
    batteryLevel,
    effectsManager
  ]);

  // Generar paleta de colores desde el tema
  const colorPalette = useMemo((): SlideColorPalette => {
    return {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      accent: theme.colors.accent,
      background: theme.colors.background,
      surface: theme.colors.surface,
      text: theme.colors.text.primary,
      textSecondary: theme.colors.text.secondary
    };
  }, [theme]);

  // Generar estilos CSS dinámicos
  const effectStyles = useMemo(() => {
    const startTime = performance.now();
    const styles = effectsManager.generateSlideEffectStyles(effectsState, colorPalette);
    setRenderTime(performance.now() - startTime);
    return styles;
  }, [effectsState, colorPalette, effectsManager]);

  // Generar estilos de partículas
  const particleStyles = useMemo(() => {
    return effectsManager.generatePresentationParticles(effectsState.particles);
  }, [effectsState.particles, effectsManager]);

  // Generar estilos de transiciones
  const transitionStyles = useMemo(() => {
    return effectsManager.generateTransitionStyles(effectsState.transitions);
  }, [effectsState.transitions, effectsManager]);

  // Generar clases CSS para slides
  const slideClasses = useMemo(() => {
    const classes: string[] = ['slide-container'];
    
    if (effectsState.glassmorphism.enabled) classes.push('effect-glass');
    if (effectsState.shadows.enabled) classes.push('effect-shadows');
    if (effectsState.animations.enabled) classes.push('effect-animate');
    if (effectsState.parallax.enabled) classes.push('effect-parallax');
    if (effectsState.glow.enabled) classes.push('effect-glow');
    if (effectsState.gradientAnimations.enabled) classes.push('effect-gradient-animate');
    if (effectsState.holographic.enabled) classes.push('effect-holographic');
    if (effectsState.auroras.enabled) classes.push('effect-aurora');
    if (effectsState.crystalline.enabled) classes.push('effect-crystalline');
    if (effectsState.noise.enabled) classes.push('effect-noise');
    
    // Clases de transición
    if (isTransitioning) {
      classes.push(`slide-transition-${effectsState.transitions.type}`);
      classes.push(`slide-transition-${effectsState.transitions.type}-${transitionDirection === 'next' ? 'exit' : 'enter'}`);
    }
    
    // Clases específicas del slide
    classes.push(`slide-${slideIndex}`);
    
    // Clases de contexto
    if (isPresenting) classes.push('presenting-mode');
    if (isMobile) classes.push('mobile-view');
    if (isTablet) classes.push('tablet-view');
    if (isOptimized) classes.push('optimized-mode');
    
    return classes.join(' ');
  }, [
    effectsState,
    isTransitioning,
    transitionDirection,
    slideIndex,
    isPresenting,
    isMobile,
    isTablet,
    isOptimized
  ]);

  // Generar clases para el contenedor
  const containerClasses = useMemo(() => {
    const classes: string[] = ['presentation-container'];
    
    if (effectsState.particles.enabled) classes.push('has-particles');
    if (effectsState.patterns.enabled) classes.push('has-patterns');
    
    return classes.join(' ');
  }, [effectsState]);

  // Validar combinación de efectos
  const validation = useMemo(() => {
    return effectsManager.validateEffectsCombination(effectsState);
  }, [effectsState, effectsManager]);

  // Control: Toggle efecto on/off
  const toggleEffect = useCallback((effectName: keyof PresentationEffectsState) => {
    setLocalEffectsOverride(prev => ({
      ...prev,
      [effectName]: {
        ...effectsState[effectName],
        enabled: !effectsState[effectName].enabled
      }
    }));
  }, [effectsState]);

  // Control: Ajustar intensidad de efecto
  const setEffectIntensity = useCallback((
    effectName: keyof PresentationEffectsState, 
    intensity: number
  ) => {
    setLocalEffectsOverride(prev => ({
      ...prev,
      [effectName]: {
        ...effectsState[effectName],
        intensity: Math.max(0, Math.min(1, intensity))
      }
    }));
  }, [effectsState]);

  // Control: Aplicar preset
  const applyPreset = useCallback((presetName: string) => {
    const presets = effectsManager.getEffectPresets();
    const preset = presets[presetName];
    
    if (preset) {
      setLocalEffectsOverride(preset);
      console.info(`🎨 Preset "${presetName}" aplicado`);
    } else {
      console.warn(`⚠️ Preset "${presetName}" no encontrado`);
    }
  }, [effectsManager]);

  // Control: Trigger transición
  const triggerTransition = useCallback((direction: 'next' | 'prev' = 'next') => {
    if (isTransitioning) return;
    
    setTransitionDirection(direction);
    setIsTransitioning(true);
    
    // Reset después de la duración de la transición
    setTimeout(() => {
      setIsTransitioning(false);
    }, effectsState.transitions.duration);
  }, [isTransitioning, effectsState.transitions.duration]);

  // Métricas de performance
  const performanceMetrics = useMemo(() => {
    const activeEffects = Object.values(effectsState).filter(
      effect => typeof effect === 'object' && 'enabled' in effect && effect.enabled
    ).length;
    
    return {
      fps,
      renderTime,
      effectsCount: activeEffects
    };
  }, [fps, renderTime, effectsState]);

  // Debug en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎬 Presentation Effects State:', {
        theme: theme.id,
        effectsState,
        validation,
        performanceMetrics,
        deviceInfo: {
          isMobile,
          isTablet,
          hasReducedMotion,
          batteryLevel
        },
        isOptimized
      });
      
      if (validation.warnings.length > 0) {
        console.warn('⚠️ Effects Warnings:', validation.warnings);
      }
      
      if (validation.recommendations.length > 0) {
        console.info('💡 Effects Recommendations:', validation.recommendations);
      }
    }
  }, [
    theme.id,
    effectsState,
    validation,
    performanceMetrics,
    isMobile,
    isTablet,
    hasReducedMotion,
    batteryLevel,
    isOptimized
  ]);

  return {
    // Estados
    effectsState,
    isOptimized,
    deviceInfo: {
      isMobile,
      isTablet,
      hasReducedMotion,
      batteryLevel
    },
    
    // Estilos
    effectStyles,
    particleStyles,
    transitionStyles,
    
    // Clases CSS
    slideClasses,
    containerClasses,
    
    // Controles
    toggleEffect,
    setEffectIntensity,
    applyPreset,
    
    // Transiciones
    currentTransition: effectsState.transitions,
    triggerTransition,
    
    // Validación
    validation,
    
    // Performance
    performanceMetrics
  };
}

export default usePresentationEffects;
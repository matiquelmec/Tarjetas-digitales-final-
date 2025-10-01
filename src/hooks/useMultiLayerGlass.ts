'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import MultiLayerGlassmorphism, { GlassmorphismConfig, GlassLayer } from '@/lib/effects/GlassmorphismLayers';

interface UseMultiLayerGlassConfig {
  enabled: boolean;
  preset: 'minimal' | 'standard' | 'premium' | 'extreme';
  baseColor: string;
  intensity: number; // 0-2
  enableReflections: boolean;
  enableDistortion: boolean;
  enableCaustics: boolean;
  ambientLighting: number;
  qualityLevel: 'low' | 'medium' | 'high' | 'ultra';
  responsiveOptimization: boolean;
}

interface UseMultiLayerGlassReturn {
  glassCSS: string;
  glassClasses: string;
  isActive: boolean;
  stats: {
    layerCount: number;
    activeEffects: string[];
    qualityLevel: string;
    isMobileOptimized: boolean;
  };
  controls: {
    updatePreset: (preset: 'minimal' | 'standard' | 'premium' | 'extreme') => void;
    updateIntensity: (intensity: number) => void;
    toggleEffect: (effect: 'reflections' | 'distortion' | 'caustics') => void;
    updateLayer: (id: string, updates: Partial<GlassLayer>) => void;
    addCustomLayer: (layer: GlassLayer) => void;
    removeLayer: (id: string) => void;
    resetToDefaults: () => void;
  };
}

const defaultConfig: UseMultiLayerGlassConfig = {
  enabled: true,
  preset: 'standard',
  baseColor: '#ffffff',
  intensity: 1,
  enableReflections: true,
  enableDistortion: false,
  enableCaustics: false,
  ambientLighting: 0.5,
  qualityLevel: 'high',
  responsiveOptimization: true
};

export function useMultiLayerGlass(config: Partial<UseMultiLayerGlassConfig> = {}): UseMultiLayerGlassReturn {
  const [currentConfig, setCurrentConfig] = useState<UseMultiLayerGlassConfig>({
    ...defaultConfig,
    ...config
  });

  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create glassmorphism instance
  const glassInstance = useMemo(() => {
    if (!currentConfig.enabled) return null;

    const layers = MultiLayerGlassmorphism.createPreset(currentConfig.preset);
    
    const glassConfig: GlassmorphismConfig = {
      layers,
      enableReflections: currentConfig.enableReflections,
      enableDistortion: currentConfig.enableDistortion,
      enableCaustics: currentConfig.enableCaustics,
      ambientLighting: currentConfig.ambientLighting,
      lightPosition: { x: 0.3, y: 0.2 },
      qualityLevel: currentConfig.qualityLevel
    };

    return new MultiLayerGlassmorphism(glassConfig);
  }, [currentConfig]);

  // Generate CSS styles
  const glassCSS = useMemo(() => {
    if (!glassInstance || !currentConfig.enabled) return '';

    const shouldOptimize = currentConfig.responsiveOptimization && isMobile;
    
    if (shouldOptimize) {
      return glassInstance.generateQualityCSS(currentConfig.baseColor, currentConfig.intensity);
    } else {
      return glassInstance.generateLayeredCSS(currentConfig.baseColor, currentConfig.intensity);
    }
  }, [glassInstance, currentConfig, isMobile]);

  // Generate CSS classes
  const glassClasses = useMemo(() => {
    if (!currentConfig.enabled) return '';

    const classes = ['multi-layer-glass'];
    
    classes.push(`glass-${currentConfig.preset}`);
    classes.push(`glass-quality-${currentConfig.qualityLevel}`);
    
    if (currentConfig.enableReflections) classes.push('glass-reflections');
    if (currentConfig.enableDistortion) classes.push('glass-distortion');
    if (currentConfig.enableCaustics) classes.push('glass-caustics');
    if (isMobile && currentConfig.responsiveOptimization) classes.push('glass-mobile-optimized');
    
    return classes.join(' ');
  }, [currentConfig, isMobile]);

  // Statistics
  const stats = useMemo(() => {
    const activeEffects = [];
    if (currentConfig.enableReflections) activeEffects.push('Reflections');
    if (currentConfig.enableDistortion) activeEffects.push('Distortion');
    if (currentConfig.enableCaustics) activeEffects.push('Caustics');
    
    const layerCount = glassInstance ? 
      MultiLayerGlassmorphism.createPreset(currentConfig.preset).length : 0;

    return {
      layerCount,
      activeEffects,
      qualityLevel: currentConfig.qualityLevel,
      isMobileOptimized: isMobile && currentConfig.responsiveOptimization
    };
  }, [glassInstance, currentConfig, isMobile]);

  // Control functions
  const updatePreset = useCallback((preset: 'minimal' | 'standard' | 'premium' | 'extreme') => {
    setCurrentConfig(prev => ({ ...prev, preset }));
  }, []);

  const updateIntensity = useCallback((intensity: number) => {
    setCurrentConfig(prev => ({ ...prev, intensity: Math.max(0, Math.min(2, intensity)) }));
  }, []);

  const toggleEffect = useCallback((effect: 'reflections' | 'distortion' | 'caustics') => {
    setCurrentConfig(prev => {
      switch (effect) {
        case 'reflections':
          return { ...prev, enableReflections: !prev.enableReflections };
        case 'distortion':
          return { ...prev, enableDistortion: !prev.enableDistortion };
        case 'caustics':
          return { ...prev, enableCaustics: !prev.enableCaustics };
        default:
          return prev;
      }
    });
  }, []);

  const updateLayer = useCallback((id: string, updates: Partial<GlassLayer>) => {
    if (glassInstance) {
      glassInstance.updateLayer(id, updates);
      // Force re-render
      setCurrentConfig(prev => ({ ...prev }));
    }
  }, [glassInstance]);

  const addCustomLayer = useCallback((layer: GlassLayer) => {
    if (glassInstance) {
      glassInstance.addLayer(layer);
      // Force re-render
      setCurrentConfig(prev => ({ ...prev }));
    }
  }, [glassInstance]);

  const removeLayer = useCallback((id: string) => {
    if (glassInstance) {
      glassInstance.removeLayer(id);
      // Force re-render
      setCurrentConfig(prev => ({ ...prev }));
    }
  }, [glassInstance]);

  const resetToDefaults = useCallback(() => {
    setCurrentConfig({ ...defaultConfig, ...config });
  }, [config]);

  return {
    glassCSS,
    glassClasses,
    isActive: currentConfig.enabled,
    stats,
    controls: {
      updatePreset,
      updateIntensity,
      toggleEffect,
      updateLayer,
      addCustomLayer,
      removeLayer,
      resetToDefaults
    }
  };
}

export default useMultiLayerGlass;
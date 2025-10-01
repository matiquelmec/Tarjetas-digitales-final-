/**
 * Hook personalizado para manejo de contraste y accesibilidad
 * Proporciona funciones y utilidades para garantizar buen contraste en toda la aplicación
 */

import { useMemo, useCallback, useEffect } from 'react';
import { getBestTextColor, getContrastRatio, isAccessible, CONTRAST_PRESETS } from '@/lib/contrast';

interface UseContrastOptions {
  /** Validar contraste automáticamente y mostrar warnings en consola */
  validateOnMount?: boolean;
  /** Nivel mínimo de contraste WCAG */
  minContrastLevel?: 'AA' | 'AAA';
  /** Tamaño de texto para validación */
  textSize?: 'normal' | 'large';
}

interface ContrastResult {
  /** Mejor color de texto para el fondo dado */
  getBestText: (backgroundColor: string) => string;
  /** Calcula ratio de contraste entre dos colores */
  getContrastRatio: (color1: string, color2: string) => number;
  /** Verifica si la combinación es accesible */
  isAccessible: (textColor: string, backgroundColor: string) => boolean;
  /** Valida contraste y muestra warnings si es necesario */
  validateContrast: (textColor: string, backgroundColor: string) => { ratio: number; accessible: boolean };
  /** Presets de contraste predefinidos */
  presets: typeof CONTRAST_PRESETS;
  /** Clases CSS sugeridas para el fondo dado */
  getSuggestedClasses: (backgroundColor: string) => string;
  /** Estilos CSS sugeridos para el fondo dado */
  getSuggestedStyles: (backgroundColor: string) => {
    primary: string;
    secondary: string;
    muted: string;
    hint: string;
  };
}

export function useContrast(options: UseContrastOptions = {}): ContrastResult {
  const {
    validateOnMount = false,
    minContrastLevel = 'AA',
    textSize = 'normal'
  } = options;

  const getBestText = useCallback((backgroundColor: string) => {
    return getBestTextColor(backgroundColor);
  }, []);

  const validateContrast = useCallback((textColor: string, backgroundColor: string) => {
    const ratio = getContrastRatio(textColor, backgroundColor);
    const accessible = isAccessible(textColor, backgroundColor, minContrastLevel, textSize);
    
    if (validateOnMount && !accessible) {
      console.warn(
        `❌ Contraste insuficiente: ${ratio.toFixed(2)}:1 entre ${textColor} y ${backgroundColor}`,
        `\n📏 Mínimo requerido (${minContrastLevel}, ${textSize}): ${minContrastLevel === 'AA' ? (textSize === 'large' ? '3.0' : '4.5') : (textSize === 'large' ? '4.5' : '7.0')}:1`,
        `\n💡 Sugerencia: usar ${getBestText(backgroundColor)} como color de texto`
      );
    }
    
    return { ratio, accessible };
  }, [validateOnMount, minContrastLevel, textSize, getBestText]);

  const getSuggestedClasses = useCallback((backgroundColor: string) => {
    const textColor = getBestText(backgroundColor);
    const isLight = textColor === '#000000';
    
    return isLight 
      ? 'text-solid-light-primary' 
      : 'text-gradient-primary';
  }, [getBestText]);

  const getSuggestedStyles = useCallback((backgroundColor: string) => {
    const textColor = getBestText(backgroundColor);
    const isLight = textColor === '#000000';
    
    if (isLight) {
      return {
        primary: '#1a1a1a',
        secondary: '#2d2d2d',
        muted: '#6c757d',
        hint: '#9ca3af'
      };
    } else {
      return {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.9)',
        muted: 'rgba(255, 255, 255, 0.75)',
        hint: 'rgba(255, 255, 255, 0.65)'
      };
    }
  }, [getBestText]);

  return useMemo(() => ({
    getBestText,
    getContrastRatio,
    isAccessible: (textColor: string, backgroundColor: string) => 
      isAccessible(textColor, backgroundColor, minContrastLevel, textSize),
    validateContrast,
    presets: CONTRAST_PRESETS,
    getSuggestedClasses,
    getSuggestedStyles
  }), [
    getBestText,
    minContrastLevel,
    textSize,
    validateContrast,
    getSuggestedClasses,
    getSuggestedStyles
  ]);
}

/**
 * Hook especializado para validación automática de contraste
 * Útil para componentes que necesitan validar múltiples combinaciones
 */
export function useContrastValidator(
  combinations: Array<{ text: string; background: string; name?: string }>,
  options: UseContrastOptions = {}
) {
  const contrast = useContrast({ ...options, validateOnMount: true });

  useEffect(() => {
    combinations.forEach(({ text, background, name }) => {
      if (text && background) {
        const result = contrast.validateContrast(text, background);
        if (!result.accessible && name) {
          console.warn(`🎨 ${name}: Contraste ${result.ratio.toFixed(2)}:1 - considera usar ${contrast.getBestText(background)}`);
        }
      }
    });
  }, [combinations, contrast]);

  return contrast;
}

/**
 * Hook para generar esquemas de color accesibles
 */
export function useColorScheme(baseColor: string) {
  const contrast = useContrast();

  return useMemo(() => {
    const textColor = contrast.getBestText(baseColor);
    const styles = contrast.getSuggestedStyles(baseColor);
    
    return {
      background: baseColor,
      text: {
        primary: styles.primary,
        secondary: styles.secondary,
        muted: styles.muted,
        hint: styles.hint
      },
      isLightScheme: textColor === '#000000',
      bestTextColor: textColor,
      classes: contrast.getSuggestedClasses(baseColor)
    };
  }, [baseColor, contrast]);
}
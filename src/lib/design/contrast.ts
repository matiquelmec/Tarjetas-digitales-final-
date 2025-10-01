/**
 * 🎨 INDI Smart Contrast System - Accesibilidad Automática
 * Sistema inteligente que garantiza contraste perfecto en cualquier combinación
 */

import { DesignTokens } from './tokens';

// Tipos para el sistema de contraste
export interface ContrastResult {
  ratio: number;
  isAccessible: boolean;
  level: 'AAA' | 'AA' | 'A' | 'FAIL';
  suggestedColor?: string;
}

export interface ColorAdjustment {
  original: string;
  adjusted: string;
  ratio: number;
  improvement: number;
}

// 🔢 CÁLCULOS DE LUMINANCIA AVANZADOS

/**
 * Convierte color hex a valores RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Convierte RGB a valores hex
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Calcula luminancia relativa (WCAG formula)
 */
export const getLuminance = (color: string): number => {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  
  // Convertir a valores sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  // Aplicar gamma correction
  const rLin = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLin = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLin = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calcular luminancia
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
};

/**
 * Calcula ratio de contraste entre dos colores
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// 🎯 SISTEMA INTELIGENTE DE EVALUACIÓN

/**
 * Evalúa accesibilidad de contraste según WCAG
 */
export const evaluateContrast = (
  textColor: string, 
  backgroundColor: string,
  fontSize: 'normal' | 'large' = 'normal'
): ContrastResult => {
  const ratio = getContrastRatio(textColor, backgroundColor);
  
  // Umbrales según WCAG 2.1
  const thresholds = {
    AAA: fontSize === 'large' ? 4.5 : 7.0,
    AA: fontSize === 'large' ? 3.0 : 4.5,
    A: 3.0
  };

  let level: ContrastResult['level'] = 'FAIL';
  if (ratio >= thresholds.AAA) level = 'AAA';
  else if (ratio >= thresholds.AA) level = 'AA';
  else if (ratio >= thresholds.A) level = 'A';

  return {
    ratio: Math.round(ratio * 100) / 100,
    isAccessible: ratio >= thresholds.AA,
    level
  };
};

// 🔧 AJUSTE AUTOMÁTICO DE COLORES

/**
 * Ajusta brillo de un color para mejorar contraste
 */
export const adjustColorBrightness = (color: string, adjustment: number): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const { r, g, b } = rgb;
  
  // Ajustar brillo manteniendo saturación
  const newR = Math.max(0, Math.min(255, r + adjustment));
  const newG = Math.max(0, Math.min(255, g + adjustment));
  const newB = Math.max(0, Math.min(255, b + adjustment));

  return rgbToHex(newR, newG, newB);
};

/**
 * Encuentra mejor color de texto para un fondo dado
 */
export const getBestTextColor = (backgroundColor: string, targetRatio: number = 7.0): ColorAdjustment => {
  // Probar primero blanco y negro puros
  const whiteRatio = getContrastRatio('#FFFFFF', backgroundColor);
  const blackRatio = getContrastRatio('#000000', backgroundColor);
  
  if (whiteRatio >= targetRatio) {
    return {
      original: backgroundColor,
      adjusted: '#FFFFFF',
      ratio: whiteRatio,
      improvement: whiteRatio
    };
  }
  
  if (blackRatio >= targetRatio) {
    return {
      original: backgroundColor,
      adjusted: '#000000', 
      ratio: blackRatio,
      improvement: blackRatio
    };
  }

  // Si ninguno funciona, ajustar gradualmente
  const baseColor = whiteRatio > blackRatio ? '#FFFFFF' : '#000000';
  let bestColor = baseColor;
  let bestRatio = Math.max(whiteRatio, blackRatio);
  
  // Probar ajustes graduales
  for (let i = -200; i <= 200; i += 10) {
    const testColor = adjustColorBrightness(baseColor, i);
    const testRatio = getContrastRatio(testColor, backgroundColor);
    
    if (testRatio > bestRatio) {
      bestColor = testColor;
      bestRatio = testRatio;
    }
    
    if (bestRatio >= targetRatio) break;
  }

  return {
    original: backgroundColor,
    adjusted: bestColor,
    ratio: bestRatio,
    improvement: bestRatio / Math.max(whiteRatio, blackRatio)
  };
};

/**
 * Sistema automático que ajusta colores para máximo contraste
 */
export const autoFixContrast = (
  textColor: string,
  backgroundColor: string,
  targetLevel: 'AA' | 'AAA' = 'AAA'
): {
  text: ColorAdjustment;
  background: ColorAdjustment;
  finalRatio: number;
} => {
  const targetRatio = targetLevel === 'AAA' ? 7.0 : 4.5;
  
  // Intentar ajustar solo el texto primero
  const textAdjustment = getBestTextColor(backgroundColor, targetRatio);
  
  if (textAdjustment.ratio >= targetRatio) {
    return {
      text: textAdjustment,
      background: {
        original: backgroundColor,
        adjusted: backgroundColor,
        ratio: textAdjustment.ratio,
        improvement: 1
      },
      finalRatio: textAdjustment.ratio
    };
  }

  // Si ajustar texto no es suficiente, ajustar fondo también
  const backgroundLuminance = getLuminance(backgroundColor);
  const adjustment = backgroundLuminance > 0.5 ? -50 : 50;
  const adjustedBackground = adjustColorBrightness(backgroundColor, adjustment);
  
  const finalTextAdjustment = getBestTextColor(adjustedBackground, targetRatio);
  
  return {
    text: finalTextAdjustment,
    background: {
      original: backgroundColor,
      adjusted: adjustedBackground,
      ratio: finalTextAdjustment.ratio,
      improvement: finalTextAdjustment.ratio / getContrastRatio(textColor, backgroundColor)
    },
    finalRatio: finalTextAdjustment.ratio
  };
};

// 🎨 UTILIDADES PARA COMPONENTES

/**
 * Hook para obtener colores optimizados automáticamente
 */
export const useOptimizedColors = (
  textColor: string,
  backgroundColor: string,
  autoOptimize: boolean = true
) => {
  if (!autoOptimize) {
    return { textColor, backgroundColor };
  }

  const optimization = autoFixContrast(textColor, backgroundColor, 'AAA');
  
  return {
    textColor: optimization.text.adjusted,
    backgroundColor: optimization.background.adjusted,
    ratio: optimization.finalRatio,
    isOptimized: optimization.text.adjusted !== textColor || optimization.background.adjusted !== backgroundColor
  };
};

/**
 * Genera colores de botón con contraste perfecto
 */
export const generateButtonColors = (brandColor: string) => {
  const textOnBrand = getBestTextColor(brandColor, 7.0);
  const hoverColor = adjustColorBrightness(brandColor, -20);
  const textOnHover = getBestTextColor(hoverColor, 7.0);
  
  return {
    primary: {
      background: brandColor,
      text: textOnBrand.adjusted,
      ratio: textOnBrand.ratio
    },
    hover: {
      background: hoverColor,
      text: textOnHover.adjusted,
      ratio: textOnHover.ratio
    }
  };
};

export default {
  evaluateContrast,
  getBestTextColor,
  autoFixContrast,
  useOptimizedColors,
  generateButtonColors,
  getContrastRatio,
  DesignTokens
};
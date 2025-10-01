/**
 * Hook personalizado para aplicar reglas universales de contraste
 * Garantiza WCAG AA compliance automáticamente en todos los temas
 */

import { useCallback } from 'react';
import { applyUniversalContrastRules, getContrastRatio, isAccessible } from '@/lib/contrast';

interface ThemeColors {
  cardBackgroundColor: string;
  cardTextColor: string;
  pageBackgroundColor: string;
  buttonSecondaryColor: string;
  buttonSecondaryHoverColor: string;
  buttonNormalBackgroundColor: string;
}

interface ContrastValidation {
  isValid: boolean;
  warnings: string[];
  fixes: ThemeColors;
}

export function useUniversalContrast() {
  /**
   * Aplica reglas universales a un tema y devuelve versión optimizada
   */
  const applyContrastRules = useCallback((theme: ThemeColors): ThemeColors => {
    return applyUniversalContrastRules(theme);
  }, []);

  /**
   * Valida el contraste de un tema y sugiere mejoras
   */
  const validateThemeContrast = useCallback((theme: ThemeColors): ContrastValidation => {
    const warnings: string[] = [];
    
    // Validar contraste texto principal
    const textContrast = getContrastRatio(theme.cardTextColor, theme.cardBackgroundColor);
    const textAccessible = isAccessible(theme.cardTextColor, theme.cardBackgroundColor, 'AA', 'normal');
    
    if (!textAccessible) {
      warnings.push(`Texto principal: ${textContrast.toFixed(2)}:1 (mínimo requerido: 4.5:1)`);
    }
    
    // Validar contraste botones
    const buttonContrast = getContrastRatio(theme.buttonSecondaryColor, theme.buttonNormalBackgroundColor);
    const buttonAccessible = isAccessible(theme.buttonSecondaryColor, theme.buttonNormalBackgroundColor, 'AA', 'normal');
    
    if (!buttonAccessible) {
      warnings.push(`Botones: ${buttonContrast.toFixed(2)}:1 (mínimo requerido: 4.5:1)`);
    }
    
    // Generar versión corregida
    const fixes = applyContrastRules(theme);
    
    return {
      isValid: warnings.length === 0,
      warnings,
      fixes
    };
  }, [applyContrastRules]);

  /**
   * Aplica reglas y actualiza estado del componente automáticamente
   */
  const applyAndUpdate = useCallback((
    theme: ThemeColors, 
    updateFunction: (field: keyof ThemeColors, value: string) => void
  ): void => {
    const optimizedTheme = applyContrastRules(theme);
    
    // Debug específico para pageBackgroundColor
    console.log('🎨 Aplicando tema completo:', {
      original: theme,
      optimized: optimizedTheme,
      pageBackgroundColor: {
        original: theme.pageBackgroundColor,
        optimized: optimizedTheme.pageBackgroundColor
      }
    });
    
    // Aplicar cada color optimizado
    Object.entries(optimizedTheme).forEach(([key, value]) => {
      console.log(`🔧 Actualizando ${key}:`, value);
      updateFunction(key as keyof ThemeColors, value);
    });
    
    console.log('🔍 Contraste universal aplicado completamente');
  }, [applyContrastRules]);

  /**
   * Valida en tiempo real mientras el usuario edita
   */
  const validateRealTime = useCallback((theme: ThemeColors): string[] => {
    const validation = validateThemeContrast(theme);
    
    if (!validation.isValid) {
      console.warn('⚠️ Problemas de contraste detectados:', validation.warnings);
    }
    
    return validation.warnings;
  }, [validateThemeContrast]);

  return {
    applyContrastRules,
    validateThemeContrast,
    applyAndUpdate,
    validateRealTime
  };
}
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { 
  PresentationTheme, 
  SlideLayout 
} from '../types/themes';
import { 
  PRESENTATION_THEMES, 
  getThemeById,
  getFreeThemes,
  getPremiumThemes 
} from '../types/themes';

export interface ThemeState {
  selectedTheme: PresentationTheme | null;
  selectedLayout: SlideLayout | null;
  customizations: {
    colors?: Partial<PresentationTheme['colors']>;
    fonts?: Partial<PresentationTheme['fonts']>;
    effects?: Partial<PresentationTheme['effects']>;
  };
  isCustomized: boolean;
}

export const usePresentationThemes = () => {
  const { data: session } = useSession();
  const [themeState, setThemeState] = useState<ThemeState>({
    selectedTheme: null,
    selectedLayout: null,
    customizations: {},
    isCustomized: false
  });

  const [availableThemes, setAvailableThemes] = useState<PresentationTheme[]>([]);

  // Initialize available themes based on user plan
  useEffect(() => {
    const userPlan = session?.user?.plan || 'FREE';
    let themes: PresentationTheme[] = [];

    switch (userPlan) {
      case 'FREE':
        themes = getFreeThemes();
        break;
      case 'PROFESSIONAL':
      case 'BUSINESS':
      case 'ENTERPRISE':
        themes = PRESENTATION_THEMES;
        break;
      default:
        themes = getFreeThemes();
    }

    setAvailableThemes(themes);

    // Set default theme if none selected
    if (!themeState.selectedTheme && themes.length > 0) {
      const defaultTheme = themes.find(t => t.id === 'tech-innovation') || themes[0];
      setThemeState(prev => ({
        ...prev,
        selectedTheme: defaultTheme,
        selectedLayout: defaultTheme.layouts.titleSlide
      }));
    }
  }, [session?.user?.plan, themeState.selectedTheme]);

  // Select a theme
  const selectTheme = useCallback((themeId: string) => {
    const theme = getThemeById(themeId);
    if (!theme) return;

    // Todos los temas están disponibles

    setThemeState(prev => ({
      ...prev,
      selectedTheme: theme,
      selectedLayout: theme.layouts.titleSlide,
      customizations: {},
      isCustomized: false
    }));

    return true;
  }, [session?.user?.plan]);

  // Select a layout for current theme
  const selectLayout = useCallback((layoutKey: keyof PresentationTheme['layouts']) => {
    if (!themeState.selectedTheme) return;

    const layout = themeState.selectedTheme.layouts[layoutKey];
    setThemeState(prev => ({
      ...prev,
      selectedLayout: layout
    }));
  }, [themeState.selectedTheme]);

  // Customize theme colors
  const customizeColors = useCallback((colorUpdates: Partial<PresentationTheme['colors']>) => {
    setThemeState(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        colors: {
          ...prev.customizations.colors,
          ...colorUpdates
        }
      },
      isCustomized: true
    }));
  }, []);

  // Customize theme fonts
  const customizeFonts = useCallback((fontUpdates: Partial<PresentationTheme['fonts']>) => {
    setThemeState(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        fonts: {
          ...prev.customizations.fonts,
          ...fontUpdates
        }
      },
      isCustomized: true
    }));
  }, []);

  // Customize theme effects
  const customizeEffects = useCallback((effectUpdates: Partial<PresentationTheme['effects']>) => {
    setThemeState(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        effects: {
          ...prev.customizations.effects,
          ...effectUpdates
        }
      },
      isCustomized: true
    }));
  }, []);

  // Get final theme with customizations applied
  const getFinalTheme = useCallback((): PresentationTheme | null => {
    if (!themeState.selectedTheme) return null;

    if (!themeState.isCustomized) {
      return themeState.selectedTheme;
    }

    // Merge customizations with base theme
    const finalTheme: PresentationTheme = {
      ...themeState.selectedTheme,
      colors: {
        ...themeState.selectedTheme.colors,
        ...themeState.customizations.colors,
        text: {
          ...themeState.selectedTheme.colors.text,
          ...(themeState.customizations.colors?.text || {})
        }
      },
      fonts: {
        ...themeState.selectedTheme.fonts,
        ...themeState.customizations.fonts,
        heading: {
          ...themeState.selectedTheme.fonts.heading,
          ...(themeState.customizations.fonts?.heading || {})
        },
        body: {
          ...themeState.selectedTheme.fonts.body,
          ...(themeState.customizations.fonts?.body || {})
        }
      },
      effects: {
        ...themeState.selectedTheme.effects,
        ...themeState.customizations.effects,
        animations: {
          ...themeState.selectedTheme.effects.animations,
          ...(themeState.customizations.effects?.animations || {})
        }
      }
    };

    return finalTheme;
  }, [themeState]);

  // Reset customizations
  const resetCustomizations = useCallback(() => {
    setThemeState(prev => ({
      ...prev,
      customizations: {},
      isCustomized: false
    }));
  }, []);

  // Get themes by category
  const getThemesByCategory = useCallback((category: string) => {
    return availableThemes.filter(theme => theme.category === category);
  }, [availableThemes]);

  // Check if user can access theme
  const canAccessTheme = useCallback((theme: PresentationTheme): boolean => {
    return true; // Todos los temas disponibles
    return session?.user?.plan !== 'FREE';
  }, [session?.user?.plan]);

  // Generate CSS variables for current theme
  const getThemeCSSVariables = useCallback((): Record<string, string> => {
    const theme = getFinalTheme();
    if (!theme) return {};

    return {
      '--theme-primary': theme.colors.primary,
      '--theme-secondary': theme.colors.secondary,
      '--theme-accent': theme.colors.accent,
      '--theme-background': theme.colors.background,
      '--theme-surface': theme.colors.surface,
      '--theme-text-primary': theme.colors.text.primary,
      '--theme-text-secondary': theme.colors.text.secondary,
      '--theme-text-accent': theme.colors.text.accent,
      '--theme-font-heading': theme.fonts.heading.family,
      '--theme-font-body': theme.fonts.body.family,
      '--theme-border-radius': theme.slide.borderRadius,
      '--theme-shadow': theme.slide.shadow,
      '--theme-padding': theme.slide.padding,
      '--theme-transition': theme.effects.animations.transition
    };
  }, [getFinalTheme]);

  // Export theme as JSON for saving
  const exportThemeConfig = useCallback(() => {
    return {
      themeId: themeState.selectedTheme?.id,
      customizations: themeState.customizations,
      layoutKey: Object.keys(themeState.selectedTheme?.layouts || {})
        .find(key => themeState.selectedTheme?.layouts[key as keyof typeof themeState.selectedTheme.layouts] === themeState.selectedLayout)
    };
  }, [themeState]);

  // Import theme configuration
  const importThemeConfig = useCallback((config: Record<string, unknown>) => {
    if (config.themeId && typeof config.themeId === 'string') {
      selectTheme(config.themeId);
    }
    if (config.customizations && typeof config.customizations === 'object') {
      setThemeState(prev => ({
        ...prev,
        customizations: config.customizations as ThemeState['customizations'],
        isCustomized: Object.keys(config.customizations as object).length > 0
      }));
    }
    if (config.layoutKey && themeState.selectedTheme) {
      const layout = themeState.selectedTheme.layouts[config.layoutKey as keyof typeof themeState.selectedTheme.layouts];
      if (layout) {
        setThemeState(prev => ({ ...prev, selectedLayout: layout }));
      }
    }
  }, [selectTheme, themeState]);

  return {
    // State
    selectedTheme: themeState.selectedTheme,
    selectedLayout: themeState.selectedLayout,
    customizations: themeState.customizations,
    isCustomized: themeState.isCustomized,
    availableThemes,
    
    // Theme selection
    selectTheme,
    selectLayout,
    
    // Customization
    customizeColors,
    customizeFonts,
    customizeEffects,
    resetCustomizations,
    
    // Computed
    finalTheme: getFinalTheme(),
    themeCSSVariables: getThemeCSSVariables(),
    
    // Utilities
    getThemesByCategory,
    canAccessTheme,
    exportThemeConfig,
    importThemeConfig,
    
    // Categories
    professionalThemes: getThemesByCategory('professional'),
    creativeThemes: getThemesByCategory('creative'),
    executiveThemes: getThemesByCategory('executive'),
    techThemes: getThemesByCategory('tech'),
    freeThemes: getFreeThemes().filter(theme => availableThemes.includes(theme)),
    premiumThemes: getPremiumThemes().filter(theme => availableThemes.includes(theme))
  };
};

export default usePresentationThemes;
/**
 * 🎨 INDI Design System - Visual Excellence Foundation
 * Tokens de diseño para experiencia visual de otro nivel
 */

export const DesignTokens = {
  // 📏 SPACING SYSTEM - Respiratory Visual Perfecto (OPTIMIZADO)
  spacing: {
    // Espaciado de tarjeta optimizado para respiración visual
    card: {
      padding: {
        desktop: '2.5rem 2rem',     // Reducido para mejor proporción
        tablet: '2rem 1.5rem', 
        mobile: '1.5rem 1.25rem'    // Más compacto en móvil
      },
      sections: {
        gap: '2rem',                // Reducido de 40px a 32px
        gapMobile: '1.5rem'         // Mejor ritmo en móvil
      },
      elements: {
        titleToSubtitle: '8px',     // Más compacto
        sectionToContent: '16px',   // Menos separación
        buttonGap: '12px',          // Stack más cohesivo
        buttonGapMobile: '10px'
      }
    },
    
    // Márgenes y paddings internos optimizados
    internal: {
      photoMargin: '20px',          // Menos dominante
      photoMarginMobile: '12px',
      dividerMargin: '24px',        // Más sutil
      dividerMarginMobile: '18px'
    },

    // Viewport breathing - CRÍTICO para experiencia premium
    viewport: {
      desktop: {
        padding: '4rem 6rem',       // MUCHO más espacio lateral
        maxCardWidth: '480px'       // Optimizado para button breathing y content comfort
      },
      tablet: {
        padding: '3rem 4rem',
        maxCardWidth: '420px'       // Proporcionado para tablet
      },
      mobile: {
        padding: '2rem 1.5rem',     // Respiración en móvil
        maxCardWidth: '100%'
      }
    }
  },

  // 🔤 TYPOGRAPHY SYSTEM - Jerarquía Visual Impecable
  typography: {
    // Escala tipográfica golden ratio basada
    scale: {
      hero: {
        size: '2.4rem',        // 38.4px - Impacto máximo
        weight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em'
      },
      title: {
        size: '2rem',          // 32px - Prominencia clara
        weight: 600,
        lineHeight: 1.25,
        letterSpacing: '-0.01em'
      },
      subtitle: {
        size: '1.2rem',        // 19.2px - Subtítulos destacados
        weight: 500,
        lineHeight: 1.4,
        letterSpacing: '0'
      },
      body: {
        size: '1.1rem',        // 17.6px - Lectura óptima
        weight: 400,
        lineHeight: 1.6,
        letterSpacing: '0.01em'
      },
      caption: {
        size: '1rem',          // 16px - Elementos secundarios
        weight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const
      },
      button: {
        size: '1.05rem',       // 16.8px - Botones legibles
        weight: 600,
        lineHeight: 1.4,
        letterSpacing: '0.02em'
      }
    },

    // Responsive scaling
    mobile: {
      hero: { size: '2rem', lineHeight: 1.3 },
      title: { size: '1.7rem', lineHeight: 1.3 },
      subtitle: { size: '1.1rem', lineHeight: 1.4 },
      body: { size: '1.05rem', lineHeight: 1.65 },
      caption: { size: '0.95rem', lineHeight: 1.5 },
      button: { size: '1rem', lineHeight: 1.4 }
    }
  },

  // 🎨 COLOR SYSTEM - Contraste y Accesibilidad Perfectos
  colors: {
    // Niveles de contraste WCAG AAA
    contrast: {
      minRatio: 7.0,          // AAA para texto normal
      minRatioLarge: 4.5,     // AA para texto grande
      autoAdjust: true
    },

    // Paleta de grises optimizada
    neutral: {
      white: '#FFFFFF',
      gray50: '#FAFAFA',
      gray100: '#F5F5F5',
      gray200: '#EEEEEE', 
      gray300: '#E0E0E0',
      gray400: '#BDBDBD',
      gray500: '#9E9E9E',
      gray600: '#757575',
      gray700: '#616161',
      gray800: '#424242',
      gray900: '#212121',
      black: '#000000'
    },

    // Overlays y transparencias
    overlay: {
      light: 'rgba(255, 255, 255, 0.95)',
      medium: 'rgba(255, 255, 255, 0.85)',
      dark: 'rgba(0, 0, 0, 0.85)',
      darker: 'rgba(0, 0, 0, 0.95)'
    }
  },

  // 🔘 BUTTON SYSTEM - Jerarquía de Acciones Clara
  buttons: {
    // Tipos de botones con propósito específico
    primary: {
      height: '52px',
      heightMobile: '48px',
      padding: '16px 32px',
      paddingMobile: '14px 24px',
      borderRadius: '12px',
      fontSize: '1.05rem',
      fontWeight: 600,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
      hoverTransform: 'translateY(-2px)',
      hoverShadow: '0 8px 25px rgba(0, 0, 0, 0.25)'
    },
    
    secondary: {
      height: '48px',
      heightMobile: '44px', 
      padding: '14px 28px',
      paddingMobile: '12px 20px',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: 500,
      borderWidth: '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },

    // Área táctil mínima (accesibilidad)
    minTouchArea: '44px'
  },

  // 🎭 EFFECTS & ANIMATIONS - Micro-interacciones Elegantes
  effects: {
    // Transiciones suaves profesionales
    transitions: {
      fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
      normal: '0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
      slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: '0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },

    // Sombras sutiles pero impactantes
    shadows: {
      card: '0 8px 32px rgba(0, 0, 0, 0.12)',
      cardHover: '0 16px 48px rgba(0, 0, 0, 0.18)',
      button: '0 4px 14px rgba(0, 0, 0, 0.15)',
      buttonHover: '0 8px 25px rgba(0, 0, 0, 0.25)',
      photo: '0 6px 20px rgba(0, 0, 0, 0.15)'
    },

    // Border radius consistente
    radius: {
      card: '24px',
      button: '12px',
      photo: '50%',
      input: '8px'
    }
  },

  // 📱 RESPONSIVE BREAKPOINTS - Mobile-First Optimizado
  breakpoints: {
    mobile: '320px',
    mobileLarge: '425px', 
    tablet: '768px',
    desktop: '1024px',
    desktopLarge: '1440px'
  }
} as const;

// 🎯 UTILITY FUNCTIONS - Helpers para Implementación

export const getResponsiveValue = (
  desktop: string | number,
  mobile: string | number,
  isMobile: boolean = false
) => {
  return isMobile ? mobile : desktop;
};

export const createResponsiveCSS = (property: string, values: {
  mobile: string | number;
  tablet?: string | number;
  desktop: string | number;
}) => {
  return `
    ${property}: ${values.mobile};
    
    @media (min-width: ${DesignTokens.breakpoints.tablet}) {
      ${property}: ${values.tablet || values.desktop};
    }
    
    @media (min-width: ${DesignTokens.breakpoints.desktop}) {
      ${property}: ${values.desktop};
    }
  `;
};

export default DesignTokens;
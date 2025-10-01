// Presentation Theme System - Extended from card themes
export interface PresentationTheme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: 'professional' | 'creative' | 'executive' | 'natural' | 'tech' | 'custom';
  
  // Core colors
  colors: {
    primary: string;          // Main background/brand color
    secondary: string;        // Accent color for highlights
    accent: string;           // Interactive elements (buttons, links)
    background: string;       // Slide background (can be gradient)
    surface: string;          // Card/content backgrounds
    text: {
      primary: string;        // Main text color
      secondary: string;      // Subtitle/secondary text
      accent: string;         // Highlighted text
      onDark: string;         // Text on dark backgrounds
      onLight: string;        // Text on light backgrounds
    };
  };
  
  // Typography
  fonts: {
    heading: {
      family: string;
      weight: number;
      size: {
        h1: string;
        h2: string;
        h3: string;
      };
    };
    body: {
      family: string;
      weight: number;
      size: {
        large: string;
        medium: string;
        small: string;
      };
    };
  };
  
  // Slide-specific styling
  slide: {
    borderRadius: string;
    shadow: string;
    border: string;
    padding: string;
    maxWidth: string;
  };
  
  // Animations and effects
  effects: {
    glassmorphism: boolean;
    particles: boolean;
    shadows: boolean;
    gradients: boolean;
    animations: {
      transition: string;
      duration: string;
      easing: string;
    };
  };
  
  // Layout presets
  layouts: {
    titleSlide: SlideLayout;
    contentSlide: SlideLayout;
    imageSlide: SlideLayout;
    chartSlide: SlideLayout;
    conclusionSlide: SlideLayout;
  };
}

export interface SlideLayout {
  name: string;
  structure: 'centered' | 'left-aligned' | 'two-column' | 'hero' | 'minimal';
  contentAlignment: 'left' | 'center' | 'right';
  imagePosition?: 'left' | 'right' | 'top' | 'bottom' | 'background';
  spacing: {
    title: string;
    content: string;
    footer: string;
  };
}

// Extended color system for presentations
export interface PresentationColorSystem {
  primary: ColorVariants;
  secondary: ColorVariants;
  accent: ColorVariants;
  neutral: ColorVariants;
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface ColorVariants {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;  // Main color
  600: string;
  700: string;
  800: string;
  900: string;
}

// Preset themes adapted from card system
export const PRESENTATION_THEMES: PresentationTheme[] = [
  // ========== TEMAS EXITOSOS DE TARJETAS DIGITALES ==========
  // Estos 5 temas han sido los más populares y efectivos en las tarjetas
  
  {
    id: 'modern',
    name: 'Modern Glass',
    emoji: '🎯',
    description: 'Diseño moderno con glassmorphism y efectos premium',
    category: 'professional',
    colors: {
      primary: '#0066CC',
      secondary: '#4A90E2',
      accent: '#FF6B35',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: 'rgba(255, 255, 255, 0.1)',
      text: {
        primary: '#ffffff',
        secondary: '#e3f2fd',
        accent: '#FF6B35',
        onDark: '#ffffff',
        onLight: '#2C3E50'
      }
    },
    fonts: {
      heading: {
        family: '"Montserrat", sans-serif',
        weight: 700,
        size: { h1: '3.5rem', h2: '2.5rem', h3: '1.8rem' }
      },
      body: {
        family: '"Open Sans", sans-serif',
        weight: 400,
        size: { large: '1.25rem', medium: '1rem', small: '0.875rem' }
      }
    },
    slide: {
      borderRadius: '20px',
      shadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      padding: '3rem',
      maxWidth: '1200px'
    },
    effects: {
      glassmorphism: true,
      particles: true,
      shadows: true,
      gradients: true,
      animations: {
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        duration: '600ms',
        easing: 'ease-in-out'
      }
    },
    layouts: {
      titleSlide: {
        name: 'Modern Hero',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      contentSlide: {
        name: 'Modern Content',
        structure: 'left-aligned',
        contentAlignment: 'left',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      imageSlide: {
        name: 'Modern Visual',
        structure: 'two-column',
        contentAlignment: 'left',
        imagePosition: 'right',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      chartSlide: {
        name: 'Modern Data',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '1rem', content: '2rem', footer: '1rem' }
      },
      conclusionSlide: {
        name: 'Modern Summary',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      }
    }
  },

  {
    id: 'elegant',
    name: 'Elegant Minimal',
    emoji: '✨',
    description: 'Minimalista y sofisticado con líneas sutiles',
    category: 'executive',
    colors: {
      primary: '#2C3E50',
      secondary: '#34495E',
      accent: '#E74C3C',
      background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
      surface: 'rgba(255, 255, 255, 0.05)',
      text: {
        primary: '#ECF0F1',
        secondary: '#BDC3C7',
        accent: '#E74C3C',
        onDark: '#ECF0F1',
        onLight: '#2C3E50'
      }
    },
    fonts: {
      heading: {
        family: '"Playfair Display", serif',
        weight: 300,
        size: { h1: '3.75rem', h2: '2.75rem', h3: '2rem' }
      },
      body: {
        family: '"Merriweather", serif',
        weight: 300,
        size: { large: '1.25rem', medium: '1.125rem', small: '1rem' }
      }
    },
    slide: {
      borderRadius: '12px',
      shadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '3.5rem',
      maxWidth: '1100px'
    },
    effects: {
      glassmorphism: false,
      particles: false,
      shadows: true,
      gradients: false,
      animations: {
        transition: 'all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1)',
        duration: '800ms',
        easing: 'ease-in-out'
      }
    },
    layouts: {
      titleSlide: {
        name: 'Elegant Title',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '3rem', content: '2rem', footer: '1.5rem' }
      },
      contentSlide: {
        name: 'Elegant Content',
        structure: 'left-aligned',
        contentAlignment: 'left',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      imageSlide: {
        name: 'Elegant Visual',
        structure: 'two-column',
        contentAlignment: 'left',
        imagePosition: 'right',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      chartSlide: {
        name: 'Elegant Data',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '1.5rem', content: '2.5rem', footer: '1.5rem' }
      },
      conclusionSlide: {
        name: 'Elegant Close',
        structure: 'minimal',
        contentAlignment: 'center',
        spacing: { title: '3rem', content: '2rem', footer: '1.5rem' }
      }
    }
  },

  {
    id: 'creative',
    name: 'Creative Gradient',
    emoji: '🎨',
    description: 'Vibrante y creativo con gradientes llamativos',
    category: 'creative',
    colors: {
      primary: '#00F6FF',
      secondary: '#0072ff',
      accent: '#FF00F5',
      background: 'linear-gradient(45deg, #00F6FF 0%, #0072ff 50%, #FF00F5 100%)',
      surface: 'rgba(255, 255, 255, 0.15)',
      text: {
        primary: '#ffffff',
        secondary: '#e0f7ff',
        accent: '#FF00F5',
        onDark: '#ffffff',
        onLight: '#0072ff'
      }
    },
    fonts: {
      heading: {
        family: '"Poppins", sans-serif',
        weight: 800,
        size: { h1: '4rem', h2: '3rem', h3: '2.25rem' }
      },
      body: {
        family: '"Source Sans Pro", sans-serif',
        weight: 600,
        size: { large: '1.375rem', medium: '1.125rem', small: '1rem' }
      }
    },
    slide: {
      borderRadius: '25px',
      shadow: '0 12px 40px rgba(31, 38, 135, 0.4)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      padding: '3rem',
      maxWidth: '1300px'
    },
    effects: {
      glassmorphism: true,
      particles: true,
      shadows: true,
      gradients: true,
      animations: {
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        duration: '500ms',
        easing: 'ease-out'
      }
    },
    layouts: {
      titleSlide: {
        name: 'Creative Splash',
        structure: 'hero',
        contentAlignment: 'center',
        imagePosition: 'background',
        spacing: { title: '2.5rem', content: '2rem', footer: '1.5rem' }
      },
      contentSlide: {
        name: 'Creative Flow',
        structure: 'left-aligned',
        contentAlignment: 'left',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      imageSlide: {
        name: 'Creative Showcase',
        structure: 'hero',
        contentAlignment: 'center',
        imagePosition: 'background',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      chartSlide: {
        name: 'Creative Data',
        structure: 'two-column',
        contentAlignment: 'left',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      conclusionSlide: {
        name: 'Creative Finale',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      }
    }
  },

  {
    id: 'classic',
    name: 'Classic Professional',
    emoji: '📚',
    description: 'Tradicional y profesional con elegancia atemporal',
    category: 'professional',
    colors: {
      primary: '#1C1C1C',
      secondary: '#2D2D2D',
      accent: '#C9302C',
      background: '#F5F5F5',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: {
        primary: '#1C1C1C',
        secondary: '#666666',
        accent: '#C9302C',
        onDark: '#F5F5F5',
        onLight: '#1C1C1C'
      }
    },
    fonts: {
      heading: {
        family: '"Times New Roman", serif',
        weight: 600,
        size: { h1: '3.25rem', h2: '2.5rem', h3: '1.875rem' }
      },
      body: {
        family: '"Georgia", serif',
        weight: 400,
        size: { large: '1.25rem', medium: '1.125rem', small: '1rem' }
      }
    },
    slide: {
      borderRadius: '8px',
      shadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      padding: '3rem',
      maxWidth: '1024px'
    },
    effects: {
      glassmorphism: false,
      particles: false,
      shadows: true,
      gradients: false,
      animations: {
        transition: 'all 0.4s ease',
        duration: '400ms',
        easing: 'ease'
      }
    },
    layouts: {
      titleSlide: {
        name: 'Classic Title',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2.5rem', content: '2rem', footer: '1.5rem' }
      },
      contentSlide: {
        name: 'Classic Content',
        structure: 'left-aligned',
        contentAlignment: 'left',
        spacing: { title: '1.75rem', content: '1.25rem', footer: '1rem' }
      },
      imageSlide: {
        name: 'Classic Image',
        structure: 'two-column',
        contentAlignment: 'left',
        imagePosition: 'right',
        spacing: { title: '1.75rem', content: '1.25rem', footer: '1rem' }
      },
      chartSlide: {
        name: 'Classic Chart',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '1.5rem', content: '2rem', footer: '1.25rem' }
      },
      conclusionSlide: {
        name: 'Classic Summary',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2.5rem', content: '2rem', footer: '1.5rem' }
      }
    }
  },

  {
    id: 'ocean',
    name: 'Ocean Deep',
    emoji: '🌊',
    description: 'Profundo y calmado con tonos oceánicos',
    category: 'natural',
    colors: {
      primary: '#006994',
      secondary: '#004d6b',
      accent: '#00d4ff',
      background: 'linear-gradient(135deg, #006994 0%, #004d6b 50%, #003947 100%)',
      surface: 'rgba(0, 212, 255, 0.1)',
      text: {
        primary: '#ffffff',
        secondary: '#b3e5fc',
        accent: '#00d4ff',
        onDark: '#ffffff',
        onLight: '#006994'
      }
    },
    fonts: {
      heading: {
        family: '"Montserrat", sans-serif',
        weight: 600,
        size: { h1: '3.5rem', h2: '2.5rem', h3: '1.875rem' }
      },
      body: {
        family: '"Inter", sans-serif',
        weight: 400,
        size: { large: '1.25rem', medium: '1.125rem', small: '1rem' }
      }
    },
    slide: {
      borderRadius: '20px',
      shadow: '0 8px 32px rgba(0, 212, 255, 0.2)',
      border: '2px solid rgba(0, 212, 255, 0.3)',
      padding: '3rem',
      maxWidth: '1200px'
    },
    effects: {
      glassmorphism: true,
      particles: true,
      shadows: true,
      gradients: true,
      animations: {
        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        duration: '700ms',
        easing: 'ease-in-out'
      }
    },
    layouts: {
      titleSlide: {
        name: 'Ocean Wave',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2.5rem', content: '2rem', footer: '1.5rem' }
      },
      contentSlide: {
        name: 'Ocean Current',
        structure: 'left-aligned',
        contentAlignment: 'left',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      imageSlide: {
        name: 'Ocean View',
        structure: 'hero',
        contentAlignment: 'center',
        imagePosition: 'background',
        spacing: { title: '1.75rem', content: '1.25rem', footer: '1rem' }
      },
      chartSlide: {
        name: 'Ocean Depth',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '1.5rem', content: '2.25rem', footer: '1.25rem' }
      },
      conclusionSlide: {
        name: 'Ocean Horizon',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2.5rem', content: '2rem', footer: '1.5rem' }
      }
    }
  },

  // ========== TEMAS PREMIUM ADICIONALES ==========
  
  {
    id: 'corporate-executive',
    name: 'Corporate Executive',
    emoji: '💼',
    description: 'Autoridad y confianza institucional para presentaciones ejecutivas',
    category: 'professional',
    colors: {
      primary: '#1a237e',
      secondary: '#283593',
      accent: '#7986cb',
      background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
      surface: 'rgba(255, 255, 255, 0.05)',
      text: {
        primary: '#ffffff',
        secondary: '#e8eaf6',
        accent: '#7986cb',
        onDark: '#ffffff',
        onLight: '#1a237e'
      }
    },
    fonts: {
      heading: {
        family: '"Playfair Display", serif',
        weight: 700,
        size: { h1: '3.5rem', h2: '2.5rem', h3: '1.8rem' }
      },
      body: {
        family: '"Inter", sans-serif',
        weight: 400,
        size: { large: '1.25rem', medium: '1rem', small: '0.875rem' }
      }
    },
    slide: {
      borderRadius: '20px',
      shadow: '0 20px 60px rgba(26, 35, 126, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '3rem',
      maxWidth: '1200px'
    },
    effects: {
      glassmorphism: true,
      particles: false,
      shadows: true,
      gradients: true,
      animations: {
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        duration: '600ms',
        easing: 'ease-in-out'
      }
    },
    layouts: {
      titleSlide: {
        name: 'Executive Title',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      contentSlide: {
        name: 'Professional Content',
        structure: 'left-aligned',
        contentAlignment: 'left',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      imageSlide: {
        name: 'Executive Image',
        structure: 'two-column',
        contentAlignment: 'left',
        imagePosition: 'right',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      chartSlide: {
        name: 'Data Presentation',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '1rem', content: '2rem', footer: '1rem' }
      },
      conclusionSlide: {
        name: 'Executive Summary',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      }
    }
  },
  
  {
    id: 'tech-innovation',
    name: 'Tech Innovation',
    emoji: '⚡',
    description: 'Futuro, precisión e innovación tecnológica',
    category: 'tech',
    colors: {
      primary: '#0d1421',
      secondary: '#1a252f',
      accent: '#64ffda',
      background: 'linear-gradient(135deg, #0d1421 0%, #1a252f 50%, #263238 100%)',
      surface: 'rgba(255, 255, 255, 0.03)',
      text: {
        primary: '#e8f5e8',
        secondary: '#b0bec5',
        accent: '#64ffda',
        onDark: '#e8f5e8',
        onLight: '#0d1421'
      }
    },
    fonts: {
      heading: {
        family: '"JetBrains Mono", monospace',
        weight: 600,
        size: { h1: '3rem', h2: '2.25rem', h3: '1.75rem' }
      },
      body: {
        family: '"Space Grotesk", sans-serif',
        weight: 400,
        size: { large: '1.125rem', medium: '1rem', small: '0.875rem' }
      }
    },
    slide: {
      borderRadius: '16px',
      shadow: '0 25px 80px rgba(13, 20, 33, 0.4)',
      border: '1px solid rgba(100, 255, 218, 0.2)',
      padding: '2.5rem',
      maxWidth: '1200px'
    },
    effects: {
      glassmorphism: true,
      particles: true,
      shadows: true,
      gradients: true,
      animations: {
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        duration: '400ms',
        easing: 'ease-out'
      }
    },
    layouts: {
      titleSlide: {
        name: 'Tech Hero',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      contentSlide: {
        name: 'Code & Content',
        structure: 'left-aligned',
        contentAlignment: 'left',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      imageSlide: {
        name: 'Tech Visual',
        structure: 'hero',
        contentAlignment: 'left',
        imagePosition: 'background',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      chartSlide: {
        name: 'Data Analytics',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '1rem', content: '2rem', footer: '1rem' }
      },
      conclusionSlide: {
        name: 'Innovation Summary',
        structure: 'minimal',
        contentAlignment: 'center',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      }
    }
  },

  // Creative Themes
  {
    id: 'artist-canvas',
    name: 'Artist Canvas',
    emoji: '🎨',
    description: 'Creatividad, inspiración y expresión artística',
    category: 'creative',
    colors: {
      primary: '#f8bbd9',
      secondary: '#e1bee7',
      accent: '#ad1457',
      background: 'linear-gradient(135deg, #f8bbd9 0%, #e1bee7 100%)',
      surface: 'rgba(45, 27, 78, 0.05)',
      text: {
        primary: '#2d1b4e',
        secondary: '#4a148c',
        accent: '#ad1457',
        onDark: '#f8bbd9',
        onLight: '#2d1b4e'
      }
    },
    fonts: {
      heading: {
        family: '"Crimson Text", serif',
        weight: 600,
        size: { h1: '3.25rem', h2: '2.5rem', h3: '1.875rem' }
      },
      body: {
        family: '"Source Sans Pro", sans-serif',
        weight: 400,
        size: { large: '1.25rem', medium: '1.125rem', small: '1rem' }
      }
    },
    slide: {
      borderRadius: '24px',
      shadow: '0 15px 40px rgba(248, 187, 217, 0.25)',
      border: '2px solid rgba(173, 20, 87, 0.1)',
      padding: '3rem',
      maxWidth: '1100px'
    },
    effects: {
      glassmorphism: false,
      particles: false,
      shadows: true,
      gradients: true,
      animations: {
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        duration: '500ms',
        easing: 'ease-in-out'
      }
    },
    layouts: {
      titleSlide: {
        name: 'Creative Hero',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2.5rem', content: '2rem', footer: '1.5rem' }
      },
      contentSlide: {
        name: 'Artistic Flow',
        structure: 'left-aligned',
        contentAlignment: 'left',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      imageSlide: {
        name: 'Visual Showcase',
        structure: 'hero',
        contentAlignment: 'center',
        imagePosition: 'background',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      chartSlide: {
        name: 'Creative Analytics',
        structure: 'two-column',
        contentAlignment: 'left',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      conclusionSlide: {
        name: 'Artistic Conclusion',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      }
    }
  },

  // Executive Premium Themes
  {
    id: 'diamond',
    name: 'Diamond',
    emoji: '💎',
    description: 'Elegancia cristalina con destellos azul diamante',
    category: 'executive',
    colors: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      accent: '#64b5f6',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      surface: 'rgba(255, 255, 255, 0.06)',
      text: {
        primary: '#ffffff',
        secondary: '#e3f2fd',
        accent: '#64b5f6',
        onDark: '#ffffff',
        onLight: '#1a1a2e'
      }
    },
    fonts: {
      heading: {
        family: '"Montserrat", sans-serif',
        weight: 700,
        size: { h1: '3.75rem', h2: '2.75rem', h3: '2rem' }
      },
      body: {
        family: '"Open Sans", sans-serif',
        weight: 400,
        size: { large: '1.25rem', medium: '1rem', small: '0.875rem' }
      }
    },
    slide: {
      borderRadius: '20px',
      shadow: '0 30px 90px rgba(26, 26, 46, 0.5)',
      border: '1px solid rgba(100, 181, 246, 0.2)',
      padding: '3.5rem',
      maxWidth: '1300px'
    },
    effects: {
      glassmorphism: true,
      particles: true,
      shadows: true,
      gradients: true,
      animations: {
        transition: 'all 0.7s cubic-bezier(0.19, 1, 0.22, 1)',
        duration: '700ms',
        easing: 'ease-out'
      }
    },
    layouts: {
      titleSlide: {
        name: 'Diamond Title',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '3rem', content: '2rem', footer: '1.5rem' }
      },
      contentSlide: {
        name: 'Premium Content',
        structure: 'left-aligned',
        contentAlignment: 'left',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      imageSlide: {
        name: 'Luxury Visual',
        structure: 'two-column',
        contentAlignment: 'left',
        imagePosition: 'right',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      chartSlide: {
        name: 'Executive Data',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '1.5rem', content: '2.5rem', footer: '1.5rem' }
      },
      conclusionSlide: {
        name: 'Diamond Summary',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2.5rem', content: '2rem', footer: '1.5rem' }
      }
    }
  }
];

// Helper functions
export const getThemeById = (id: string): PresentationTheme | undefined => {
  return PRESENTATION_THEMES.find(theme => theme.id === id);
};

export const getThemesByCategory = (category: string): PresentationTheme[] => {
  return PRESENTATION_THEMES.filter(theme => theme.category === category);
};

export const getFreeThemes = (): PresentationTheme[] => {
  return PRESENTATION_THEMES; // Todos los temas están disponibles
};

export const getPremiumThemes = (): PresentationTheme[] => {
  return []; // No hay distinción premium
};
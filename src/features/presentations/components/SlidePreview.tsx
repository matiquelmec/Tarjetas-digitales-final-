'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, Button } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { getBestTextColor, getContrastRatio, isAccessible } from '@/lib/contrast';
import useSlideEffects from '../hooks/useSlideEffects';

// Importación dinámica para evitar problemas de SSR
const ParticleBackground = dynamic(() => import('./ParticleBackground'), { ssr: false });

// Updated types compatible with AI service
interface Slide {
  id: string;
  type: 'title' | 'content' | 'image' | 'chart' | 'bullets' | 'quote';
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    bullets?: string[];
    imageUrl?: string;
    imageCaption?: string;
    quote?: string;
    author?: string;
    chartType?: 'bar' | 'pie' | 'line';
    chartData?: any;
  };
  notes?: string;
  transition?: 'fade' | 'slide' | 'zoom';
}

interface Theme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize?: {
    title: string;
    subtitle: string;
    body: string;
  };
}

interface SlidePreviewProps {
  slide: Slide;
  theme: Theme | string;
  isActive?: boolean;
  isPreview?: boolean;
  className?: string;
  onClick?: () => void;
  
  // Efectos visuales premium (siguiendo patrón de BusinessCard)
  enableHoverEffect?: boolean;
  enableGlassmorphism?: boolean;
  enableSubtleAnimations?: boolean;
  enableBackgroundPatterns?: boolean;
  enableParticles?: boolean;
  particleType?: 'floating' | 'constellation' | 'professional' | 'creative';
  particleCount?: number;
  
  // Configuración de presentación
  presentationMode?: 'edit' | 'preview' | 'fullscreen';
  isInView?: boolean;
  slideNumber?: number;
  totalSlides?: number;
}

const staticStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=Poppins:wght@300;400;500;600;700&family=Source+Sans+Pro:wght@300;400;600;700&family=Crimson+Text:wght@400;600;700&display=swap');
  
  @keyframes slideGradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes slideFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-8px) scale(1.02); }
  }
  
  @keyframes slideGlassShimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes slideParticleFloat {
    0%, 100% { 
      transform: translateY(0px) translateX(0px) scale(1);
      opacity: 0.7;
    }
    33% { 
      transform: translateY(-12px) translateX(4px) scale(1.1);
      opacity: 1;
    }
    66% { 
      transform: translateY(-4px) translateX(-2px) scale(0.9);
      opacity: 0.8;
    }
  }
  
  @keyframes slideConstellation {
    0% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 0.3; transform: scale(0.8); }
  }
  
  @keyframes slideProfessionalPulse {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.05); opacity: 0.7; }
  }
  
  @keyframes slideCreativeSwirl {
    0% { transform: rotate(0deg) translateX(8px) rotate(0deg); opacity: 0.5; }
    100% { transform: rotate(360deg) translateX(8px) rotate(-360deg); opacity: 0.5; }
  }

  /* Contenedor de slide con efectos */
  .slide-preview-container {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    cursor: pointer;
    min-height: 300px;
    display: flex;
    flex-direction: column;
  }
  
  .slide-preview-container.effect-hover:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
  
  .slide-preview-container.effect-glass {
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 8px 32px 0 rgba(31, 38, 135, 0.37),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .slide-preview-container.effect-animate {
    animation: slideFadeIn 0.6s ease-out;
  }
  
  .slide-preview-container.effect-animate.active {
    animation: slideFloat 3s ease-in-out infinite;
  }
  
  .slide-preview-container.effect-patterns::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      radial-gradient(circle at 60% 80%, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 50px 50px, 60px 60px, 70px 70px, 80px 80px;
    opacity: 0.3;
    pointer-events: none;
    z-index: 1;
  }
  
  /* Contenido del slide */
  .slide-content {
    position: relative;
    z-index: 2;
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  /* Partículas específicas para slides */
  .slide-particles-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  }
  
  .slide-particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  
  .slide-particle.floating {
    animation: slideParticleFloat 4s ease-in-out infinite;
  }
  
  .slide-particle.constellation {
    animation: slideConstellation 3s ease-in-out infinite;
  }
  
  .slide-particle.professional {
    animation: slideProfessionalPulse 2s ease-in-out infinite;
  }
  
  .slide-particle.creative {
    animation: slideCreativeSwirl 6s linear infinite;
  }
  
  /* Indicador de número de slide */
  .slide-number {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    z-index: 10;
    backdrop-filter: blur(10px);
  }
  
  /* Indicador de tipo de slide */
  .slide-type-indicator {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 500;
    z-index: 10;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  /* Estados específicos */
  .slide-preview-container.active {
    border: 2px solid;
    border-image: linear-gradient(45deg, #00f6ff, #0072ff) 1;
    box-shadow: 0 0 30px rgba(0, 246, 255, 0.3);
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .slide-content {
      padding: 1.5rem;
    }
    
    .slide-preview-container {
      min-height: 250px;
    }
    
    .slide-preview-container.effect-hover:hover {
      transform: translateY(-4px) scale(1.01);
    }
  }
  
  /* Temas específicos */
  .slide-theme-stellar {
    background: linear-gradient(135deg, #0f0c29, #24243e, #302b63);
  }
  
  .slide-theme-ocean {
    background: linear-gradient(135deg, #006994, #004d6b, #003947);
  }
  
  .slide-theme-corporate {
    background: linear-gradient(135deg, #2c3e50, #34495e, #3e5978);
  }
  
  .slide-theme-creative {
    background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  }
  
  .slide-theme-modern {
    background: linear-gradient(135deg, #1e3c72, #2a5298, #6dd5fa);
  }
`;

const SlidePreview: React.FC<SlidePreviewProps> = ({ 
  slide, 
  theme, 
  isActive = false,
  isPreview = false,
  className = '',
  onClick,
  
  // Efectos visuales premium
  enableHoverEffect = true,
  enableGlassmorphism = true,
  enableSubtleAnimations = true,
  enableBackgroundPatterns = true,
  enableParticles = true,
  particleType = 'professional',
  particleCount = 25,
  
  // Configuración de presentación
  presentationMode = 'edit',
  isInView = true,
  slideNumber,
  totalSlides
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Convert theme to standardized format
  const getThemeConfig = (themeInput: Theme | string): Theme => {
    if (typeof themeInput === 'string') {
      const defaultThemes: Record<string, Theme> = {
        stellar: {
          name: 'stellar',
          primaryColor: '#00f6ff',
          secondaryColor: '#0072ff', 
          backgroundColor: 'linear-gradient(135deg, #0f0c29, #24243e, #302b63)',
          fontFamily: 'Montserrat',
          fontSize: {
            title: '2.5rem',
            subtitle: '1.5rem',
            body: '1.125rem'
          }
        },
        ocean: {
          name: 'ocean',
          primaryColor: '#00D4FF',
          secondaryColor: '#0072ff',
          backgroundColor: 'linear-gradient(135deg, #006994, #004d6b, #003947)',
          fontFamily: 'Montserrat',
          fontSize: {
            title: '2.5rem',
            subtitle: '1.5rem',
            body: '1.125rem'
          }
        },
        corporate: {
          name: 'corporate',
          primaryColor: '#3498db',
          secondaryColor: '#2980b9',
          backgroundColor: 'linear-gradient(135deg, #2c3e50, #34495e, #3e5978)',
          fontFamily: 'Source Sans Pro',
          fontSize: {
            title: '2.25rem',
            subtitle: '1.375rem',
            body: '1rem'
          }
        },
        creative: {
          name: 'creative',
          primaryColor: '#ff6b6b',
          secondaryColor: '#ee5a52',
          backgroundColor: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
          fontFamily: 'Poppins',
          fontSize: {
            title: '2.75rem',
            subtitle: '1.625rem',
            body: '1.125rem'
          }
        },
        modern: {
          name: 'modern',
          primaryColor: '#4ecdc4',
          secondaryColor: '#44b3ac',
          backgroundColor: 'linear-gradient(135deg, #1e3c72, #2a5298, #6dd5fa)',
          fontFamily: 'Inter',
          fontSize: {
            title: '2.5rem',
            subtitle: '1.5rem',
            body: '1.125rem'
          }
        }
      };
      return defaultThemes[themeInput] || defaultThemes.stellar;
    }
    return themeInput;
  };

  const themeConfig = getThemeConfig(theme);
  const themeName = typeof theme === 'string' ? theme : theme.name;
  
  // Hook de efectos visuales
  const {
    effectsState,
    themeConfig: slideThemeConfig,
    dynamicStyles,
    particleConfig,
    cssClasses,
    slideHelpers
  } = useSlideEffects({
    theme: themeName as 'stellar' | 'ocean' | 'corporate' | 'creative' | 'modern',
    slideType: slide.type,
    enableHoverEffect,
    enableGlassmorphism,
    enableSubtleAnimations,
    enableBackgroundPatterns,
    enableParticles,
    particleType,
    particleCount,
    backgroundColor: themeConfig.backgroundColor,
    textColor: '#ffffff',
    accentColor: themeConfig.primaryColor,
    isActive,
    isInView,
    presentationMode
  });

  // Determinar color de texto óptimo
  const textColor = useMemo(() => {
    if (themeConfig.backgroundColor.includes('gradient')) {
      return '#ffffff'; // Para gradientes, usar blanco
    }
    return getBestTextColor(themeConfig.backgroundColor);
  }, [themeConfig.backgroundColor]);

  // Generar partículas personalizadas para slides
  const renderSlideParticles = () => {
    if (!effectsState?.particles?.enabled || !isMounted) return null;

    const particles = [];
    const count = Math.min(particleCount, presentationMode === 'fullscreen' ? 15 : 25);
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 4;
      const duration = 4 + Math.random() * 2;
      
      particles.push(
        <div
          key={i}
          className={`slide-particle ${particleType}`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            background: `linear-gradient(45deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            opacity: isActive ? 1 : 0.6
          }}
        />
      );
    }
    
    return (
      <div className="slide-particles-container">
        {particles}
      </div>
    );
  };

  // Renderizar contenido del slide
  const renderSlideContent = () => {
    const { content } = slide;
    
    const commonTextStyle = {
      color: textColor,
      fontFamily: themeConfig.fontFamily,
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
    };
    
    switch (slide.type) {
      case 'title':
        return (
          <div className="slide-content title-slide text-center">
            {content.title && (
              <h1 style={{ 
                ...commonTextStyle,
                fontSize: isPreview ? '2rem' : themeConfig.fontSize?.title || '2.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                background: `linear-gradient(45deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {content.title}
              </h1>
            )}
            {content.subtitle && (
              <h2 style={{ 
                ...commonTextStyle,
                fontSize: isPreview ? '1.25rem' : themeConfig.fontSize?.subtitle || '1.5rem',
                fontWeight: 300,
                opacity: 0.9
              }}>
                {content.subtitle}
              </h2>
            )}
          </div>
        );

      case 'content':
        return (
          <div className="slide-content content-slide">
            {content.title && (
              <h2 style={{ 
                ...commonTextStyle,
                fontSize: isPreview ? '1.5rem' : '2rem',
                marginBottom: '1.5rem',
                color: themeConfig.primaryColor
              }}>
                {content.title}
              </h2>
            )}
            {content.text && (
              <p style={{ 
                ...commonTextStyle,
                fontSize: isPreview ? '1rem' : themeConfig.fontSize?.body || '1.125rem',
                lineHeight: '1.7',
                opacity: 0.95
              }}>
                {content.text}
              </p>
            )}
            {content.bullets && (
              <ul style={{ 
                ...commonTextStyle,
                fontSize: isPreview ? '1rem' : themeConfig.fontSize?.body || '1.125rem',
                paddingLeft: '0',
                listStyle: 'none'
              }}>
                {content.bullets.map((point, index) => (
                  <li key={index} style={{ 
                    marginBottom: '1rem',
                    position: 'relative',
                    paddingLeft: '2rem',
                    display: 'flex',
                    alignItems: 'flex-start'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      top: '0.1em',
                      color: themeConfig.primaryColor,
                      fontWeight: 'bold',
                      fontSize: '1.2em'
                    }}>
                      ▶
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case 'bullets':
        return (
          <div className="slide-content bullets-slide">
            {content.title && (
              <h2 style={{ 
                ...commonTextStyle,
                fontSize: isPreview ? '1.5rem' : '2rem',
                marginBottom: '2rem',
                color: themeConfig.primaryColor
              }}>
                {content.title}
              </h2>
            )}
            {content.bullets && (
              <ul style={{ 
                ...commonTextStyle,
                fontSize: isPreview ? '1rem' : themeConfig.fontSize?.body || '1.125rem',
                paddingLeft: '0',
                listStyle: 'none'
              }}>
                {content.bullets.map((point, index) => (
                  <li key={index} style={{ 
                    marginBottom: '1.25rem',
                    position: 'relative',
                    paddingLeft: '2.5rem',
                    transition: 'transform 0.2s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      top: '0.1em',
                      background: `linear-gradient(45deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: 'bold',
                      fontSize: '1.5em'
                    }}>
                      ●
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="slide-content quote-slide text-center">
            {content.quote && (
              <blockquote style={{
                ...commonTextStyle,
                fontSize: isPreview ? '1.25rem' : '2rem',
                fontStyle: 'italic',
                margin: '0 0 2rem 0',
                position: 'relative',
                padding: '0 3rem',
                lineHeight: 1.4
              }}>
                <span style={{
                  color: themeConfig.primaryColor,
                  fontSize: isPreview ? '3rem' : '4rem',
                  position: 'absolute',
                  left: '0.5rem',
                  top: '-1rem',
                  lineHeight: 1,
                  opacity: 0.7
                }}>
                  "
                </span>
                {content.quote}
                <span style={{
                  color: themeConfig.primaryColor,
                  fontSize: isPreview ? '3rem' : '4rem',
                  position: 'absolute',
                  right: '0.5rem',
                  bottom: '-1.5rem',
                  lineHeight: 1,
                  opacity: 0.7
                }}>
                  "
                </span>
              </blockquote>
            )}
            {content.author && (
              <cite style={{
                ...commonTextStyle,
                fontSize: isPreview ? '1rem' : '1.25rem',
                fontStyle: 'normal',
                opacity: 0.8,
                color: themeConfig.secondaryColor
              }}>
                — {content.author}
              </cite>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="slide-content image-slide">
            {content.title && (
              <h2 style={{ 
                ...commonTextStyle,
                fontSize: isPreview ? '1.5rem' : '2rem',
                marginBottom: '1.5rem',
                textAlign: 'center',
                color: themeConfig.primaryColor
              }}>
                {content.title}
              </h2>
            )}
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
              background: `linear-gradient(135deg, ${themeConfig.primaryColor}20, ${themeConfig.secondaryColor}20)`,
              borderRadius: '12px',
              marginBottom: '1rem',
              border: `2px dashed ${themeConfig.primaryColor}60`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {content.imageUrl ? (
                <img 
                  src={content.imageUrl} 
                  alt={content.title || 'Slide image'} 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              ) : (
                <div style={{
                  ...commonTextStyle,
                  fontSize: '3rem',
                  opacity: 0.6
                }}>
                  🖼️
                </div>
              )}
            </div>
            {content.imageCaption && (
              <p style={{ 
                ...commonTextStyle,
                fontSize: isPreview ? '0.875rem' : '1rem',
                textAlign: 'center',
                fontStyle: 'italic',
                opacity: 0.8
              }}>
                {content.imageCaption}
              </p>
            )}
          </div>
        );

      case 'chart':
        return (
          <div className="slide-content chart-slide">
            {content.title && (
              <h2 style={{ 
                ...commonTextStyle,
                fontSize: isPreview ? '1.5rem' : '2rem',
                marginBottom: '1.5rem',
                textAlign: 'center',
                color: themeConfig.primaryColor
              }}>
                {content.title}
              </h2>
            )}
            <div style={{
              minHeight: '250px',
              background: `linear-gradient(135deg, ${themeConfig.primaryColor}15, ${themeConfig.secondaryColor}15)`,
              border: `3px dashed ${themeConfig.primaryColor}`,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                textAlign: 'center',
                ...commonTextStyle
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                  {content.chartType === 'pie' ? '📊' : 
                   content.chartType === 'line' ? '📈' : '📊'}
                </div>
                <div style={{ 
                  fontSize: isPreview ? '1rem' : '1.25rem',
                  color: themeConfig.primaryColor,
                  fontWeight: 600
                }}>
                  Gráfico {content.chartType || 'bar'}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="slide-content default-slide">
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              ...commonTextStyle,
              fontSize: '1.125rem',
              opacity: 0.7
            }}>
              Slide tipo: {slide.type}
            </div>
          </div>
        );
    }
  };

  if (!isMounted) {
    return (
      <div style={{
        width: '100%',
        minHeight: isPreview ? '400px' : '300px',
        backgroundColor: '#f8f9fa',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Cargando slide...</div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: staticStyles + dynamicStyles }} />
      
      <div 
        className={`slide-preview-container ${cssClasses} ${className} ${isActive ? 'active' : ''}`}
        style={{
          background: slideThemeConfig.background,
          position: 'relative',
          width: '100%',
          minHeight: isPreview ? '400px' : '300px'
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Número de slide */}
        {slideNumber && totalSlides && (
          <div className="slide-number">
            {slideNumber} / {totalSlides}
          </div>
        )}
        
        {/* Indicador de tipo */}
        <div className="slide-type-indicator">
          {slide.type}
        </div>
        
        {/* Partículas de fondo */}
        {renderSlideParticles()}
        
        {/* Contenido principal */}
        {renderSlideContent()}
      </div>
    </>
  );
};

export default SlidePreview;
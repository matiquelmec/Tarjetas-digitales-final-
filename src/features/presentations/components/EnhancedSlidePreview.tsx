/**
 * SlidePreview Mejorado con Efectos Cinematográficos
 * Versión premium inspirada en el éxito de las tarjetas digitales
 */

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PresentationTheme } from '../types/themes';
import { useSlideEffects } from '@/hooks/useSlideEffects';
import dynamic from 'next/dynamic';

// Importar partículas dinámicamente para optimización (usando TSParticles moderno)
const Particles = dynamic(() => import('@tsparticles/react').then(mod => ({ default: mod.Particles })), { ssr: false });

interface SlideContent {
  title?: string;
  subtitle?: string;
  content?: string[];
  image?: string;
  layout?: 'title' | 'content' | 'image' | 'chart' | 'conclusion';
}

interface EnhancedSlidePreviewProps {
  theme: PresentationTheme;
  content: SlideContent;
  slideIndex?: number;
  isActive?: boolean;
  isPresenting?: boolean;
  enableInteraction?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onSlideClick?: () => void;
  customEffects?: any;
  // Controles dinámicos de color (copiados de BusinessCard)
  dynamicBackgroundColor?: string;
  dynamicTextColor?: string;
  dynamicButtonColor?: string;
  dynamicButtonHoverColor?: string;
  dynamicButtonBackgroundColor?: string;
}

const EnhancedSlidePreview: React.FC<EnhancedSlidePreviewProps> = ({
  theme,
  content,
  slideIndex = 0,
  isActive = false,
  isPresenting = false,
  enableInteraction = true,
  className = '',
  style,
  onSlideClick,
  customEffects,
  // Colores dinámicos
  dynamicBackgroundColor,
  dynamicTextColor,
  dynamicButtonColor,
  dynamicButtonHoverColor,
  dynamicButtonBackgroundColor
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Usar colores dinámicos si están disponibles, sino usar los del tema
  const finalBackgroundColor = dynamicBackgroundColor || theme.colors.background;
  const finalTextColor = dynamicTextColor || theme.colors.text.primary;

  // Usar nuestro hook de efectos migrado de tarjetas
  const {
    effectsState,
    dynamicStyles,
    cssClasses,
    particleConfig,
    validation
  } = useSlideEffects({
    enableHoverEffect: enableInteraction,
    enableGlassmorphism: theme.effects.glassmorphism,
    enableSubtleAnimations: theme.effects.animations,
    enableBackgroundPatterns: theme.effects.gradients,
    enableParticles: theme.effects.particles,
    particleType: 'professional',
    particleCount: 25,
    slideBackgroundColor: finalBackgroundColor,
    slideTextColor: finalTextColor
  });

  // Efecto de carga simple
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Obtener layout básico del tema
  const layoutConfig = theme.layouts.contentSlide;

  // Generar contenido de muestra si no se proporciona
  const getDisplayContent = (): SlideContent => {
    if (content.title || content.content) return content;

    // Contenido de muestra basado en el tema
    const sampleContent: Record<string, SlideContent> = {
      title: {
        title: theme.name,
        subtitle: 'Presentación Profesional',
        content: ['Creado con tecnología premium']
      },
      content: {
        title: 'Contenido Principal',
        content: [
          'Punto clave número uno',
          'Información relevante y detallada',
          'Conclusión impactante'
        ]
      },
      image: {
        title: 'Visual Impactante',
        content: ['Combinando texto e imagen'],
        image: '/placeholder-image.jpg'
      },
      chart: {
        title: 'Datos y Métricas',
        content: ['Análisis detallado', 'Resultados medibles'],
      },
      conclusion: {
        title: '¡Gracias!',
        subtitle: 'Preguntas y Respuestas',
        content: ['Contacto disponible']
      }
    };

    return sampleContent[content.layout || 'content'];
  };

  const displayContent = getDisplayContent();

  // Estilos dinámicos del slide (usando CSS custom properties para sobrescribir efectos)
  const slideStyles: React.CSSProperties = {
    // Aplicar colores como estilos normales
    background: finalBackgroundColor,
    color: finalTextColor,
    fontFamily: theme.fonts.body.family,
    borderRadius: theme.slide.borderRadius,
    padding: theme.slide.padding,
    maxWidth: theme.slide.maxWidth,
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
    cursor: enableInteraction ? 'pointer' : 'default',
    
    // Transiciones suaves
    transition: effectsState.subtleAnimations?.enabled 
      ? theme.effects.animations.transition 
      : 'transform 0.3s ease, box-shadow 0.3s ease',
    
    // Efectos de hover
    transform: isHovered && enableInteraction 
      ? 'translateY(-8px) scale(1.02)' 
      : 'translateY(0) scale(1)',
    
    // Combinar con estilos personalizados
    ...style
  } as React.CSSProperties;

  // Estilos de título dinámicos (usando color final)
  const titleStyles: React.CSSProperties = {
    fontFamily: theme.fonts.heading.family,
    fontWeight: theme.fonts.heading.weight,
    fontSize: theme.fonts.heading.size.h1,
    color: finalTextColor, // Usar color dinámico
    textAlign: layoutConfig.contentAlignment as any,
    marginBottom: layoutConfig.spacing.title,
    lineHeight: 1.2,
    
    // Efectos especiales para temas creativos
    ...(theme.id === 'creative' && {
      background: 'linear-gradient(45deg, #00F6FF, #0072ff, #FF00F5)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    })
  };

  // Estilos de contenido (usando color dinámico)
  const contentStyles: React.CSSProperties = {
    fontFamily: theme.fonts.body.family,
    fontSize: theme.fonts.body.size.medium,
    color: finalTextColor, // Usar color dinámico
    lineHeight: 1.6,
    marginBottom: layoutConfig.spacing.content
  };


  // Evento de click
  const handleClick = () => {
    if (enableInteraction && onSlideClick) {
      onSlideClick();
    }
  };

  // Función para renderizar partículas (IGUAL que BusinessCard)
  const renderParticles = () => {
    if (!particleConfig || !effectsState?.particles?.enabled) return null;

    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}>
        <Particles
          options={particleConfig}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        />
      </div>
    );
  };

  return (
    <>
      {/* Estilos dinámicos - IGUAL que BusinessCard */}
      <style>{dynamicStyles}</style>
      
      {/* CSS Override para forzar colores dinámicos por encima de efectos */}
      <style>{`
        .slide-custom[style*="--slide-dynamic-bg"] {
          background: var(--slide-dynamic-bg) !important;
        }
        .slide-custom[style*="--slide-dynamic-text"] {
          color: var(--slide-dynamic-text) !important;
        }
        .slide-custom[style*="--slide-dynamic-text"] h1,
        .slide-custom[style*="--slide-dynamic-text"] h2,
        .slide-custom[style*="--slide-dynamic-text"] p {
          color: var(--slide-dynamic-text) !important;
        }
      `}</style>
      
      <div
        ref={containerRef}
        className={`slide-custom ${cssClasses} ${className} ${isLoaded ? 'loaded' : ''} ${isActive ? 'active' : ''}`}
        style={{
          ...slideStyles,
          // CSS custom properties definidas por separado para TypeScript
          '--slide-dynamic-bg': finalBackgroundColor,
          '--slide-dynamic-text': finalTextColor,
        } as React.CSSProperties}
        onMouseEnter={() => enableInteraction && setIsHovered(true)}
        onMouseLeave={() => enableInteraction && setIsHovered(false)}
        onClick={handleClick}
        role={enableInteraction ? 'button' : 'presentation'}
        tabIndex={enableInteraction ? 0 : -1}
      >
        {/* Sistema de partículas - IGUAL que BusinessCard */}
        {renderParticles()}
        
        {/* Contenido del slide - SIMPLIFICADO igual que BusinessCard */}
        <div className="slide-body" style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          
          {/* Título principal */}
          {displayContent.title && (
            <h1 style={titleStyles}>
              {displayContent.title}
            </h1>
          )}
          
          {/* Subtítulo */}
          {displayContent.subtitle && (
            <h2 style={{
              fontFamily: theme.fonts.body.family,
              fontSize: theme.fonts.heading.size.h2,
              color: theme.colors.text.accent,
              marginBottom: '1.5rem'
            }}>
              {displayContent.subtitle}
            </h2>
          )}
          
          {/* Contenido principal */}
          {displayContent.content && displayContent.content.length > 0 && (
            <div className="slide-content-body">
              {displayContent.content.map((item, index) => (
                <p key={index} style={contentStyles}>
                  {item}
                </p>
              ))}
            </div>
          )}
        </div>
        
        {/* Indicador de slide activo */}
        {isActive && (
          <div className="active-indicator" style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: theme.colors.accent,
            boxShadow: `0 0 10px ${theme.colors.accent}80`,
            animation: 'pulse 2s ease-in-out infinite',
            zIndex: 3
          }} />
        )}
        
        {/* Badge de tema */}
        <div className="theme-badge" style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0, 0, 0, 0.6)',
          color: '#ffffff',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: 500,
          zIndex: 3,
          opacity: isHovered ? 1 : 0.7,
          transition: 'opacity 0.3s ease'
        }}>
          {theme.emoji} {theme.name}
        </div>
      </div>
      
      {/* Estilos mínimos - los efectos vienen del sistema SlideEffectsManager */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        
        .slide-custom {
          will-change: transform, opacity, box-shadow;
        }
        
        @media (max-width: 768px) {
          .slide-custom {
            max-width: 100% !important;
            padding: 1rem !important;
          }
        }
      `}} />
    </>
  );
};

export default EnhancedSlidePreview;


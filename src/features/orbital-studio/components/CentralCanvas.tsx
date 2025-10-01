/**
 * Canvas Central - Vista previa del slide en tiempo real
 * Usa el sistema de efectos migrado de tarjetas digitales
 */

'use client';

import React from 'react';
import { Slide } from '../types/orbital';
import { useOrbitalEffects } from '../hooks/useOrbitalEffects';

interface CentralCanvasProps {
  slide: Slide;
  isPreviewMode: boolean;
  onChange: (updates: Partial<Slide>) => void;
}

const CentralCanvas: React.FC<CentralCanvasProps> = ({
  slide,
  isPreviewMode,
  onChange
}) => {
  // Usar el sistema de efectos migrado
  const {
    effectsState,
    dynamicStyles,
    cssClasses,
    particleConfig,
    validation
  } = useOrbitalEffects({
    enableHoverEffect: slide.effects.hover,
    enableGlassmorphism: slide.effects.glassmorphism,
    enableSubtleAnimations: slide.effects.animations,
    enableBackgroundPatterns: slide.effects.backgroundPatterns,
    enableParticles: slide.effects.particles,
    particleType: slide.effects.particleType,
    particleCount: 30,
    slideBackgroundColor: slide.backgroundColor,
    slideTextColor: slide.textColor
  });

  return (
    <div className="central-canvas">
      {/* Estilos dinámicos */}
      <style jsx>{`
        .central-canvas {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 100;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }
        
        .slide-container {
          width: 800px;
          height: 450px;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          transition: all 0.3s ease;
        }
        
        .slide-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 3rem;
          font-family: ${slide.fontFamily}, sans-serif;
        }
        
        .slide-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .slide-subtitle {
          font-size: 1.5rem;
          font-weight: 400;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        
        .slide-content-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .slide-content-item {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          opacity: 0.8;
          animation: slideInUp 0.6s ease forwards;
        }
        
        .slide-content-item:nth-child(1) { animation-delay: 0.1s; }
        .slide-content-item:nth-child(2) { animation-delay: 0.2s; }
        .slide-content-item:nth-child(3) { animation-delay: 0.3s; }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 0.8;
            transform: translateY(0);
          }
        }
        
        .particles-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          pointer-events: none;
        }
        
        /* Aplicar estilos dinámicos generados */
        ${dynamicStyles}
      `}</style>

      <div 
        className={`slide-container ${cssClasses}`}
        style={{ 
          background: slide.backgroundColor,
          color: slide.textColor 
        }}
      >
        {/* Partículas de fondo */}
        {slide.effects.particles && (
          <div className="particles-bg">
            {/* Aquí iría el componente de partículas */}
            <div className="simple-particles">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    position: 'absolute',
                    width: '2px',
                    height: '2px',
                    background: slide.textColor,
                    borderRadius: '50%',
                    opacity: 0.4,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Contenido del slide */}
        <div className="slide-content">
          {!isPreviewMode ? (
            // Modo edición
            <>
              <input
                type="text"
                value={slide.title}
                onChange={(e) => onChange({ title: e.target.value })}
                className="slide-title"
                style={{
                  background: 'transparent',
                  border: '2px dashed rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  color: 'inherit',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  textAlign: 'center',
                  width: '100%',
                  marginBottom: '1rem'
                }}
                placeholder="Título del slide"
              />
              
              {slide.subtitle && (
                <input
                  type="text"
                  value={slide.subtitle}
                  onChange={(e) => onChange({ subtitle: e.target.value })}
                  className="slide-subtitle"
                  style={{
                    background: 'transparent',
                    border: '2px dashed rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    color: 'inherit',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    textAlign: 'center',
                    width: '100%',
                    marginBottom: '2rem'
                  }}
                  placeholder="Subtítulo (opcional)"
                />
              )}
              
              <ul className="slide-content-list">
                {slide.content.map((item, index) => (
                  <li key={index} className="slide-content-item">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newContent = [...slide.content];
                        newContent[index] = e.target.value;
                        onChange({ content: newContent });
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px dashed rgba(255,255,255,0.2)',
                        borderRadius: '4px',
                        padding: '0.3rem',
                        color: 'inherit',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        textAlign: 'center',
                        width: '100%'
                      }}
                      placeholder={`Punto ${index + 1}`}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            // Modo vista previa
            <>
              <h1 className="slide-title">{slide.title}</h1>
              {slide.subtitle && (
                <h2 className="slide-subtitle">{slide.subtitle}</h2>
              )}
              <ul className="slide-content-list">
                {slide.content.map((item, index) => (
                  <li key={index} className="slide-content-item">
                    • {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Animación de partículas */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-5px); }
        }
      `}</style>
    </div>
  );
};

export default CentralCanvas;
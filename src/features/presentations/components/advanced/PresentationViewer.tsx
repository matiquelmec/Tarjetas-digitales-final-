'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CinematicTransition, ElementAnimation, ParticleEffect } from './CinematicTransitions';

interface Slide {
  id: string;
  type: string;
  content: any;
  transition?: string;
  animation?: string;
  background?: {
    type: string;
    value: string;
    effects?: string[];
  };
}

interface PresentationViewerProps {
  slides: Slide[];
  theme: any;
  isFullscreen: boolean;
  onExitFullscreen: () => void;
  autoPlay?: boolean;
  showControls?: boolean;
  enableEffects?: boolean;
}

const PresentationViewer: React.FC<PresentationViewerProps> = ({
  slides,
  theme,
  isFullscreen,
  onExitFullscreen,
  autoPlay = false,
  showControls = true,
  enableEffects = true
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showLaserPointer, setShowLaserPointer] = useState(false);
  const [laserPosition, setLaserPosition] = useState({ x: 0, y: 0 });
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [annotations, setAnnotations] = useState<Array<{ x: number; y: number; text: string }>>([]);
  const [progress, setProgress] = useState(0);
  const [showMinimap, setShowMinimap] = useState(false);
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = slides[currentSlideIndex];

  // Navegación con teclado
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          nextSlide();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'Escape':
          onExitFullscreen();
          break;
        case 'Home':
          setCurrentSlideIndex(0);
          break;
        case 'End':
          setCurrentSlideIndex(slides.length - 1);
          break;
        case 'l':
        case 'L':
          setShowLaserPointer(!showLaserPointer);
          break;
        case 'p':
        case 'P':
          setIsPlaying(!isPlaying);
          break;
        case 'm':
        case 'M':
          setShowMinimap(!showMinimap);
          break;
        case 'a':
        case 'A':
          setShowAnnotations(!showAnnotations);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, currentSlideIndex, showLaserPointer, isPlaying, showMinimap, showAnnotations]);

  // Auto-play
  useEffect(() => {
    if (isPlaying && currentSlideIndex < slides.length - 1) {
      autoPlayTimerRef.current = setTimeout(() => {
        nextSlide();
      }, 5000); // 5 segundos por slide
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, currentSlideIndex]);

  // Actualizar progreso
  useEffect(() => {
    setProgress(((currentSlideIndex + 1) / slides.length) * 100);
  }, [currentSlideIndex, slides.length]);

  // Laser pointer
  useEffect(() => {
    if (!showLaserPointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      setLaserPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [showLaserPointer]);

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else if (isPlaying) {
      setCurrentSlideIndex(0); // Loop si está en auto-play
    }
  }, [currentSlideIndex, slides.length, isPlaying]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  }, [currentSlideIndex]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlideIndex(index);
    }
  }, [slides.length]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const addAnnotation = (e: React.MouseEvent) => {
    if (!showAnnotations) return;
    
    const rect = viewerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const text = prompt('Agregar anotación:');
    if (text) {
      setAnnotations([...annotations, { x, y, text }]);
    }
  };

  const renderSlideContent = () => {
    const { content, type } = currentSlide;

    const slideStyle = {
      background: currentSlide.background?.value || theme.backgroundColor,
      color: theme.textColor || '#ffffff',
      fontFamily: theme.fontFamily || 'Inter',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '4rem',
      position: 'relative' as const,
      overflow: 'hidden'
    };

    return (
      <div style={slideStyle} onClick={addAnnotation}>
        {/* Efectos de fondo */}
        {enableEffects && currentSlide.background?.effects?.includes('particles') && (
          <ParticleEffect intensity={30} />
        )}

        {/* Contenido del slide con animaciones */}
        <ElementAnimation 
          type={currentSlide.animation || 'parallax'}
          duration={1.5}
        >
          {type === 'title' && (
            <div style={{ textAlign: 'center' }}>
              <motion.h1 
                style={{ 
                  fontSize: '4rem', 
                  fontWeight: 'bold',
                  marginBottom: '2rem',
                  background: enableEffects ? 'linear-gradient(135deg, #667eea, #764ba2)' : theme.primaryColor,
                  WebkitBackgroundClip: enableEffects ? 'text' : 'none',
                  WebkitTextFillColor: enableEffects ? 'transparent' : theme.primaryColor,
                  textShadow: enableEffects ? '0 0 30px rgba(102, 126, 234, 0.5)' : 'none'
                }}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {content.title}
              </motion.h1>
              {content.subtitle && (
                <motion.h2 
                  style={{ 
                    fontSize: '2rem', 
                    fontWeight: 300,
                    opacity: 0.9
                  }}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  {content.subtitle}
                </motion.h2>
              )}
            </div>
          )}

          {type === 'content' && (
            <div style={{ maxWidth: '1000px', width: '100%' }}>
              {content.title && (
                <motion.h2 
                  style={{ 
                    fontSize: '3rem', 
                    marginBottom: '2rem',
                    color: theme.primaryColor
                  }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  {content.title}
                </motion.h2>
              )}
              {content.text && (
                <motion.p 
                  style={{ 
                    fontSize: '1.5rem', 
                    lineHeight: 1.8,
                    opacity: 0.95
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 1 }}
                >
                  {content.text}
                </motion.p>
              )}
              {content.bullets && (
                <ul style={{ fontSize: '1.4rem', lineHeight: 2 }}>
                  {content.bullets.map((bullet: string, index: number) => (
                    <motion.li 
                      key={index}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                      style={{ marginBottom: '1rem' }}
                    >
                      <span style={{ color: theme.primaryColor, marginRight: '1rem' }}>▸</span>
                      {bullet}
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {type === 'quote' && (
            <div style={{ textAlign: 'center', maxWidth: '800px' }}>
              <motion.blockquote 
                style={{ 
                  fontSize: '2.5rem', 
                  fontStyle: 'italic',
                  position: 'relative',
                  padding: '2rem'
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: 'spring' }}
              >
                <span style={{ 
                  fontSize: '5rem', 
                  color: theme.primaryColor,
                  position: 'absolute',
                  left: '-2rem',
                  top: '-1rem',
                  opacity: 0.5
                }}>"</span>
                {content.quote}
                <span style={{ 
                  fontSize: '5rem', 
                  color: theme.primaryColor,
                  position: 'absolute',
                  right: '-2rem',
                  bottom: '-3rem',
                  opacity: 0.5
                }}>"</span>
              </motion.blockquote>
              {content.author && (
                <motion.cite 
                  style={{ 
                    fontSize: '1.5rem', 
                    opacity: 0.8,
                    display: 'block',
                    marginTop: '2rem'
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  — {content.author}
                </motion.cite>
              )}
            </div>
          )}
        </ElementAnimation>

        {/* Anotaciones */}
        {showAnnotations && annotations.map((annotation, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${annotation.x}%`,
              top: `${annotation.y}%`,
              background: 'rgba(255, 255, 0, 0.8)',
              color: '#000',
              padding: '0.5rem',
              borderRadius: '4px',
              fontSize: '0.9rem',
              maxWidth: '200px',
              zIndex: 1000
            }}
          >
            {annotation.text}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      ref={viewerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000',
        zIndex: 9999,
        cursor: showLaserPointer ? 'none' : 'default'
      }}
    >
      {/* Slide con transición */}
      <AnimatePresence mode="wait">
        <CinematicTransition
          key={currentSlideIndex}
          type={currentSlide.transition as any || 'fade'}
          duration={0.8}
        >
          {renderSlideContent()}
        </CinematicTransition>
      </AnimatePresence>

      {/* Laser Pointer */}
      {showLaserPointer && (
        <div
          style={{
            position: 'fixed',
            left: laserPosition.x - 10,
            top: laserPosition.y - 10,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, red, transparent)',
            pointerEvents: 'none',
            zIndex: 10000,
            boxShadow: '0 0 20px red, 0 0 40px red'
          }}
        />
      )}

      {/* Progress Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: 'rgba(255, 255, 255, 0.1)'
      }}>
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            boxShadow: '0 0 10px rgba(102, 126, 234, 0.5)'
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Controles */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '1rem 2rem',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: currentSlideIndex === 0 ? 0.5 : 1
            }}
          >
            ◀️
          </button>
          
          <span style={{ color: 'white', minWidth: '60px', textAlign: 'center' }}>
            {currentSlideIndex + 1} / {slides.length}
          </span>
          
          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: currentSlideIndex === slides.length - 1 ? 0.5 : 1
            }}
          >
            ▶️
          </button>

          <button
            onClick={() => setShowLaserPointer(!showLaserPointer)}
            style={{
              background: showLaserPointer ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            title="Laser Pointer (L)"
          >
            🔴
          </button>

          <button
            onClick={() => setShowMinimap(!showMinimap)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            title="Minimap (M)"
          >
            🗺️
          </button>

          <button
            onClick={onExitFullscreen}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            title="Exit (Esc)"
          >
            ✖️
          </button>
        </motion.div>
      )}

      {/* Minimap */}
      {showMinimap && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            width: '200px',
            background: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '12px',
            padding: '1rem',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ color: 'white', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            Slides Overview
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {slides.map((_, index) => (
              <div
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: '20px',
                  height: '20px',
                  background: index === currentSlideIndex ? '#667eea' : 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.8rem'
      }}>
        <div>← → Navigate | Space: Next | P: Play/Pause | L: Laser | M: Map | Esc: Exit</div>
      </div>
    </div>
  );
};

export default PresentationViewer;
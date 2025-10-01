/**
 * Orbital Studio - Editor completo de presentaciones con arquitectura limpia
 * Migra y mejora todo el sistema exitoso de tarjetas digitales
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'react-bootstrap';
import { Presentation, Slide, OrbitalEditorState, OrbitalPanel } from '../types/orbital';
import CentralCanvas from './CentralCanvas';
import ColorMasterPanel from './ColorMasterPanel';
import SlideTimeline from './SlideTimeline';
import AIAssistantPanel from './AIAssistantPanel';
import EffectsPanel from './EffectsPanel';

interface OrbitalStudioProps {
  presentation?: Presentation;
  onSave?: (presentation: Presentation) => void;
  onExit?: () => void;
  isFullscreen?: boolean;
}

const OrbitalStudio: React.FC<OrbitalStudioProps> = ({
  presentation: initialPresentation,
  onSave,
  onExit,
  isFullscreen = true
}) => {
  // Estado principal
  const [editorState, setEditorState] = useState<OrbitalEditorState>(() => ({
    presentation: initialPresentation || createDefaultPresentation(),
    currentSlide: initialPresentation?.slides[0] || createDefaultSlide(),
    selectedPanel: null,
    isPreviewMode: false,
    isFullscreen,
    activeTool: 'select',
    history: [],
    historyIndex: -1,
    collaborators: [],
    isCollaborating: false
  }));

  // Cargar posiciones guardadas o usar default
  const getDefaultPanels = useCallback((): OrbitalPanel[] => [
    {
      id: 'color-master',
      title: 'Color Master',
      icon: '🎨',
      position: { x: window.innerWidth - 370, y: 50, anchor: 'top-right' },
      size: 'medium',
      isVisible: true,
      isMinimized: false
    },
    {
      id: 'effects',
      title: 'Efectos',
      icon: '✨',
      position: { x: window.innerWidth - 370, y: 250, anchor: 'top-right' },
      size: 'medium',
      isVisible: true,
      isMinimized: false
    },
    {
      id: 'ai-assistant',
      title: 'IA Assistant',
      icon: '🤖',
      position: { x: 50, y: 50, anchor: 'top-left' },
      size: 'large',
      isVisible: true,
      isMinimized: false
    }
  ], []);

  // Paneles orbitales con persistencia
  const [orbitalPanels, setOrbitalPanels] = useState<OrbitalPanel[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('orbital-panels-positions');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return getDefaultPanels();
        }
      }
    }
    return getDefaultPanels();
  });

  // Actualizar slide actual
  const updateCurrentSlide = useCallback((updates: Partial<Slide>) => {
    setEditorState(prev => {
      const updatedSlide = { ...prev.currentSlide, ...updates };
      const updatedSlides = prev.presentation.slides.map(slide =>
        slide.id === updatedSlide.id ? updatedSlide : slide
      );
      
      return {
        ...prev,
        currentSlide: updatedSlide,
        presentation: {
          ...prev.presentation,
          slides: updatedSlides,
          updatedAt: new Date()
        }
      };
    });
  }, []);

  // Cambiar slide activo
  const changeSlide = useCallback((slideId: string) => {
    const slide = editorState.presentation.slides.find(s => s.id === slideId);
    if (slide) {
      setEditorState(prev => ({
        ...prev,
        currentSlide: slide
      }));
    }
  }, [editorState.presentation.slides]);

  // Agregar nuevo slide
  const addSlide = useCallback(() => {
    const newSlide = createDefaultSlide();
    setEditorState(prev => ({
      ...prev,
      presentation: {
        ...prev.presentation,
        slides: [...prev.presentation.slides, newSlide],
        updatedAt: new Date()
      }
    }));
  }, []);

  // Guardar presentación
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(editorState.presentation);
    }
  }, [editorState.presentation, onSave]);

  // Toggle panel visibility
  const togglePanel = useCallback((panelId: string) => {
    setOrbitalPanels(prev => prev.map(panel =>
      panel.id === panelId 
        ? { ...panel, isVisible: !panel.isVisible }
        : panel
    ));
  }, []);

  // Update panel position
  const updatePanelPosition = useCallback((panelId: string, x: number, y: number) => {
    setOrbitalPanels(prev => {
      const newPanels = prev.map(panel =>
        panel.id === panelId 
          ? { 
              ...panel, 
              position: { 
                ...panel.position, 
                x: Math.max(0, Math.min(x, window.innerWidth - getSizeWidth(panel.size))),
                y: Math.max(0, Math.min(y, window.innerHeight - 400))
              }
            }
          : panel
      );
      
      // Guardar en localStorage
      localStorage.setItem('orbital-panels-positions', JSON.stringify(newPanels));
      return newPanels;
    });
  }, []);

  // Minimize/maximize panel
  const togglePanelMinimize = useCallback((panelId: string) => {
    setOrbitalPanels(prev => prev.map(panel =>
      panel.id === panelId 
        ? { ...panel, isMinimized: !panel.isMinimized }
        : panel
    ));
  }, []);

  // Reset panel positions
  const resetPanelPositions = useCallback(() => {
    const defaultPanels = getDefaultPanels();
    setOrbitalPanels(defaultPanels);
    localStorage.setItem('orbital-panels-positions', JSON.stringify(defaultPanels));
  }, [getDefaultPanels]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            e.preventDefault();
            // TODO: Implementar undo
            break;
        }
      }
      
      // Navegación de slides
      switch (e.key) {
        case 'ArrowLeft':
          // TODO: Slide anterior
          break;
        case 'ArrowRight':
          // TODO: Slide siguiente
          break;
        case 'Escape':
          if (onExit) onExit();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, onExit]);

  // Renderizar panel orbital
  const renderOrbitalPanel = (panel: OrbitalPanel) => {
    if (!panel.isVisible) return null;

    let content;
    switch (panel.id) {
      case 'color-master':
        content = (
          <ColorMasterPanel
            slide={editorState.currentSlide}
            onChange={updateCurrentSlide}
          />
        );
        break;
      case 'effects':
        content = (
          <EffectsPanel
            slide={editorState.currentSlide}
            onChange={updateCurrentSlide}
          />
        );
        break;
      case 'ai-assistant':
        content = (
          <AIAssistantPanel
            presentation={editorState.presentation}
            onSlideGenerated={(slides) => {
              setEditorState(prev => ({
                ...prev,
                presentation: {
                  ...prev.presentation,
                  slides: [...prev.presentation.slides, ...slides],
                  updatedAt: new Date()
                }
              }));
            }}
          />
        );
        break;
      default:
        content = <div>Panel no encontrado</div>;
    }

    return (
      <motion.div
        key={panel.id}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={{
          left: 0,
          right: window.innerWidth - getSizeWidth(panel.size),
          top: 0,
          bottom: window.innerHeight - 400
        }}
        onDragEnd={(event, info) => {
          const newX = panel.position.x + info.offset.x;
          const newY = panel.position.y + info.offset.y;
          updatePanelPosition(panel.id, newX, newY);
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: panel.isMinimized ? 0.9 : 1,
          height: panel.isMinimized ? 'auto' : 'auto'
        }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          position: 'fixed',
          zIndex: 1000,
          left: panel.position.x,
          top: panel.position.y,
          minWidth: getSizeWidth(panel.size),
          maxWidth: getSizeWidth(panel.size) * 1.5,
          cursor: 'grab'
        }}
        whileDrag={{ 
          cursor: 'grabbing',
          scale: 1.05,
          zIndex: 1001,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
        }}
        className="orbital-panel"
      >
        <div className="orbital-panel-content">
          <div className="orbital-panel-header" style={{ cursor: 'grab' }}>
            <div className="d-flex align-items-center gap-2">
              <span>{panel.icon}</span>
              <span className="fw-semibold text-white">{panel.title}</span>
              <span className="text-white-50" style={{ fontSize: '0.7rem' }}>📍</span>
            </div>
            <div className="d-flex gap-1">
              <Button
                variant="link"
                size="sm"
                className="text-white p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePanelMinimize(panel.id);
                }}
                title={panel.isMinimized ? "Maximizar" : "Minimizar"}
              >
                {panel.isMinimized ? '□' : '_'}
              </Button>
              <Button
                variant="link"
                size="sm"
                className="text-white p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePanel(panel.id);
                }}
                title="Cerrar"
              >
                ✕
              </Button>
            </div>
          </div>
          {!panel.isMinimized && (
            <div className="orbital-panel-body">
              {content}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="orbital-studio-container">
      {/* Estilos globales */}
      <style dangerouslySetInnerHTML={{__html: `
        .orbital-studio-container {
          position: ${isFullscreen ? 'fixed' : 'relative'};
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          z-index: ${isFullscreen ? 9999 : 1};
          overflow: hidden;
        }
        
        .orbital-panel {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          user-select: none;
        }
        
        .orbital-panel:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }
        
        .orbital-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px 16px 0 0;
          cursor: grab;
          transition: all 0.3s ease;
        }
        
        .orbital-panel-header:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .orbital-panel-header:active {
          cursor: grabbing;
          background: rgba(255, 255, 255, 0.15);
        }
        
        .orbital-panel-body {
          padding: 16px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .orbital-toolbar {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1001;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 8px 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}} />

      {/* Toolbar principal */}
      <div className="orbital-toolbar">
        <div className="d-flex align-items-center gap-3">
          <span className="text-white fw-bold">🛸 Orbital Studio</span>
          
          <div className="d-flex gap-2">
            <Button
              variant={editorState.isPreviewMode ? 'primary' : 'outline-light'}
              size="sm"
              onClick={() => setEditorState(prev => ({ 
                ...prev, 
                isPreviewMode: !prev.isPreviewMode 
              }))}
            >
              {editorState.isPreviewMode ? '✏️ Editar' : '👁️ Preview'}
            </Button>
            
            <Button 
              variant="outline-info" 
              size="sm" 
              onClick={resetPanelPositions}
              title="Resetear posiciones de paneles"
            >
              📍 Reset
            </Button>
            
            <Button variant="outline-light" size="sm" onClick={handleSave}>
              💾 Guardar
            </Button>
            
            {onExit && (
              <Button variant="outline-danger" size="sm" onClick={onExit}>
                ✕ Salir
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Canvas central */}
      <CentralCanvas
        slide={editorState.currentSlide}
        isPreviewMode={editorState.isPreviewMode}
        onChange={updateCurrentSlide}
      />

      {/* Timeline de slides */}
      <SlideTimeline
        slides={editorState.presentation.slides}
        currentSlideId={editorState.currentSlide.id}
        onSlideChange={changeSlide}
        onAddSlide={addSlide}
      />

      {/* Paneles orbitales */}
      <AnimatePresence>
        {orbitalPanels.map(renderOrbitalPanel)}
      </AnimatePresence>
    </div>
  );
};

// Utilidades
function createDefaultPresentation(): Presentation {
  const defaultSlide = createDefaultSlide();
  
  return {
    id: `pres_${Date.now()}`,
    title: 'Nueva Presentación',
    description: 'Creada con Orbital Studio',
    userId: 'current-user',
    slides: [defaultSlide],
    currentSlideIndex: 0,
    theme: {
      id: 'modern',
      name: 'Modern',
      category: 'professional',
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        accent: '#00f6ff',
        background: 'linear-gradient(135deg, #0f0c29, #24243e, #302b63)',
        text: '#ffffff'
      },
      fonts: {
        heading: 'Montserrat',
        body: 'Inter',
        accent: 'Poppins'
      },
      defaultEffects: {
        glassmorphism: true,
        particles: true,
        particleType: 'professional',
        animations: true,
        backgroundPatterns: false,
        hover: true
      }
    },
    settings: {
      autoPlay: false,
      slideDuration: 5,
      loop: false,
      showNavigation: true,
      showProgress: true,
      allowKeyboard: true,
      allowComments: false,
      allowEdit: false,
      trackViews: true,
      trackEngagement: true
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false,
    views: 0
  };
}

function createDefaultSlide(): Slide {
  return {
    id: `slide_${Date.now()}`,
    title: 'Mi Presentación',
    subtitle: 'Creada con Orbital Studio',
    content: ['Punto principal 1', 'Punto principal 2'],
    layout: 'title',
    order: 0,
    backgroundType: 'gradient',
    backgroundColor: 'linear-gradient(135deg, #0f0c29, #24243e, #302b63)',
    textColor: '#ffffff',
    fontFamily: 'Montserrat',
    effects: {
      glassmorphism: true,
      particles: true,
      particleType: 'professional',
      animations: true,
      backgroundPatterns: false,
      hover: true
    }
  };
}

function getPositionStyle(position: OrbitalPanel['position']) {
  const { x, y, anchor } = position;
  
  switch (anchor) {
    case 'top-left':
      return { top: y, left: x };
    case 'top-right':
      return { top: y, right: x };
    case 'bottom-left':
      return { bottom: y, left: x };
    case 'bottom-right':
      return { bottom: y, right: x };
    default:
      return { top: y, left: x };
  }
}

function getSizeWidth(size: OrbitalPanel['size']) {
  switch (size) {
    case 'small': return 250;
    case 'medium': return 320;
    case 'large': return 400;
    default: return 320;
  }
}

export default OrbitalStudio;
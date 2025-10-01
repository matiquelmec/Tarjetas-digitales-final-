'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Dropdown, Form, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import SlidePreview from '../SlidePreview';

interface Slide {
  id: string;
  type: 'title' | 'content' | 'image' | 'chart' | 'bullets' | 'quote' | 'video' | 'comparison';
  content: any;
  transition?: 'fade' | 'slide' | 'zoom' | 'flip' | 'morph' | 'dissolve';
  animation?: 'none' | 'parallax' | 'ken-burns' | 'particle-burst' | 'typewriter';
  background?: {
    type: 'solid' | 'gradient' | 'image' | 'video' | 'animated';
    value: string;
    effects?: string[];
  };
}

interface PresentationEditorProps {
  slides: Slide[];
  onSlidesChange: (slides: Slide[]) => void;
  selectedTheme: string;
  presentationTitle: string;
  onTitleChange: (title: string) => void;
}

const PresentationEditor: React.FC<PresentationEditorProps> = ({
  slides,
  onSlidesChange,
  selectedTheme,
  presentationTitle,
  onTitleChange
}) => {
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [draggedSlideIndex, setDraggedSlideIndex] = useState<number | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Efectos cinematográficos predefinidos
  const cinematicEffects = {
    transitions: [
      { id: 'fade', name: 'Desvanecimiento', icon: '🌫️' },
      { id: 'slide', name: 'Deslizar', icon: '➡️' },
      { id: 'zoom', name: 'Zoom Dramático', icon: '🔍' },
      { id: 'flip', name: 'Volteo 3D', icon: '🔄' },
      { id: 'morph', name: 'Morphing', icon: '✨' },
      { id: 'dissolve', name: 'Disolución', icon: '💫' }
    ],
    animations: [
      { id: 'parallax', name: 'Parallax', description: 'Efecto de profundidad cinematográfico' },
      { id: 'ken-burns', name: 'Ken Burns', description: 'Zoom y panorámica estilo documental' },
      { id: 'particle-burst', name: 'Explosión de Partículas', description: 'Partículas que revelan el contenido' },
      { id: 'typewriter', name: 'Máquina de Escribir', description: 'Texto que aparece letra por letra' }
    ],
    backgrounds: [
      { id: 'gradient-animated', name: 'Gradiente Animado', preview: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)' },
      { id: 'particle-field', name: 'Campo de Partículas', preview: 'radial-gradient(circle, #1a1a2e, #0f0c29)' },
      { id: 'nebula', name: 'Nebulosa', preview: 'radial-gradient(ellipse at center, #4b0082, #0f0c29)' },
      { id: 'holographic', name: 'Holográfico', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
    ]
  };

  // Templates profesionales para slides
  const slideTemplates = [
    {
      id: 'impact-title',
      name: 'Título de Impacto',
      type: 'title',
      preview: '🎯',
      content: {
        title: 'Tu Título Impactante',
        subtitle: 'Subtítulo que complementa',
        layout: 'center-bold'
      }
    },
    {
      id: 'story-slide',
      name: 'Narrativa',
      type: 'content',
      preview: '📖',
      content: {
        title: 'Cuenta tu Historia',
        text: 'Un párrafo que conecta emocionalmente con tu audiencia...',
        layout: 'left-aligned'
      }
    },
    {
      id: 'data-viz',
      name: 'Visualización de Datos',
      type: 'chart',
      preview: '📊',
      content: {
        title: 'Datos que Impresionan',
        chartType: 'animated-bar',
        layout: 'split-view'
      }
    },
    {
      id: 'comparison',
      name: 'Comparación Visual',
      type: 'comparison',
      preview: '⚖️',
      content: {
        title: 'Antes vs Después',
        leftTitle: 'Antes',
        rightTitle: 'Después',
        layout: 'split-screen'
      }
    },
    {
      id: 'quote-cinematic',
      name: 'Cita Cinematográfica',
      type: 'quote',
      preview: '💬',
      content: {
        quote: 'Las mejores presentaciones no se ven, se sienten',
        author: 'Steve Jobs',
        layout: 'fullscreen-quote'
      }
    }
  ];

  // Agregar nueva slide desde template
  const addSlideFromTemplate = (template: any) => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      type: template.type,
      content: { ...template.content },
      transition: 'fade',
      animation: 'parallax',
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    };
    
    const newSlides = [...slides];
    newSlides.splice(selectedSlideIndex + 1, 0, newSlide);
    onSlidesChange(newSlides);
    setSelectedSlideIndex(selectedSlideIndex + 1);
    setShowTemplateGallery(false);
  };

  // Duplicar slide
  const duplicateSlide = (index: number) => {
    const slideToDuplicate = slides[index];
    const newSlide = {
      ...slideToDuplicate,
      id: `slide-${Date.now()}`
    };
    
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    onSlidesChange(newSlides);
  };

  // Eliminar slide
  const deleteSlide = (index: number) => {
    if (slides.length > 1) {
      const newSlides = slides.filter((_, i) => i !== index);
      onSlidesChange(newSlides);
      if (selectedSlideIndex >= newSlides.length) {
        setSelectedSlideIndex(newSlides.length - 1);
      }
    }
  };

  // Drag & Drop para reordenar slides
  const handleDragStart = (index: number) => {
    setDraggedSlideIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedSlideIndex === null || draggedSlideIndex === index) return;
    
    const newSlides = [...slides];
    const draggedSlide = newSlides[draggedSlideIndex];
    newSlides.splice(draggedSlideIndex, 1);
    newSlides.splice(index, 0, draggedSlide);
    
    onSlidesChange(newSlides);
    setDraggedSlideIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedSlideIndex(null);
  };

  // Aplicar efecto a slide
  const applyEffect = (effectType: 'transition' | 'animation', effectId: string) => {
    const newSlides = [...slides];
    if (effectType === 'transition') {
      newSlides[selectedSlideIndex].transition = effectId as any;
    } else {
      newSlides[selectedSlideIndex].animation = effectId as any;
    }
    onSlidesChange(newSlides);
  };

  // Aplicar background
  const applyBackground = (bg: any) => {
    const newSlides = [...slides];
    newSlides[selectedSlideIndex].background = {
      type: 'gradient',
      value: bg.preview,
      effects: ['blur', 'overlay']
    };
    onSlidesChange(newSlides);
  };

  return (
    <>
      <style jsx>{`
        .editor-container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        .editor-toolbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .toolbar-title {
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .toolbar-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .btn-toolbar {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn-toolbar:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .editor-workspace {
          display: flex;
          height: 600px;
        }
        
        .slides-panel {
          width: 200px;
          background: #f8f9fa;
          border-right: 1px solid #e9ecef;
          padding: 1rem;
          overflow-y: auto;
        }
        
        .slide-thumbnail-container {
          margin-bottom: 1rem;
          cursor: move;
          transition: all 0.3s ease;
        }
        
        .slide-thumbnail-container.dragging {
          opacity: 0.5;
        }
        
        .slide-thumbnail {
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 0.5rem;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .slide-thumbnail:hover {
          border-color: #667eea;
          transform: scale(1.05);
        }
        
        .slide-thumbnail.selected {
          border-color: #764ba2;
          box-shadow: 0 4px 12px rgba(118, 75, 162, 0.3);
        }
        
        .slide-number {
          position: absolute;
          top: -8px;
          left: -8px;
          background: #667eea;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .slide-actions {
          display: flex;
          gap: 0.25rem;
          margin-top: 0.5rem;
        }
        
        .btn-slide-action {
          flex: 1;
          padding: 0.25rem;
          font-size: 0.75rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .btn-slide-action:hover {
          background: #764ba2;
        }
        
        .canvas-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f8f9fa;
        }
        
        .canvas-controls {
          padding: 1rem;
          background: white;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .canvas-viewport {
          flex: 1;
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        
        .properties-panel {
          width: 300px;
          background: white;
          border-left: 1px solid #e9ecef;
          padding: 1rem;
          overflow-y: auto;
        }
        
        .property-section {
          margin-bottom: 1.5rem;
        }
        
        .property-section h6 {
          color: #495057;
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .effect-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }
        
        .effect-option {
          padding: 0.75rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }
        
        .effect-option:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .effect-option.selected {
          border-color: #764ba2;
          background: linear-gradient(135deg, #667eea15, #764ba215);
        }
        
        .effect-icon {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }
        
        .effect-name {
          font-size: 0.8rem;
          color: #495057;
          font-weight: 500;
        }
        
        .template-gallery {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        
        .template-card {
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }
        
        .template-card:hover {
          border-color: #667eea;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
        }
        
        .template-preview {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        
        .template-name {
          font-weight: 600;
          color: #495057;
          font-size: 0.9rem;
        }
        
        .background-preview {
          height: 60px;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .background-preview:hover {
          border-color: #667eea;
          transform: scale(1.05);
        }
        
        .btn-add-slide-fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          font-size: 1.5rem;
          box-shadow: 0 6px 20px rgba(118, 75, 162, 0.4);
          transition: all 0.3s ease;
          z-index: 1000;
        }
        
        .btn-add-slide-fab:hover {
          transform: scale(1.1) rotate(90deg);
          box-shadow: 0 8px 25px rgba(118, 75, 162, 0.5);
        }
        
        @media (max-width: 991px) {
          .editor-workspace {
            flex-direction: column;
            height: auto;
          }
          
          .slides-panel {
            width: 100%;
            display: flex;
            overflow-x: auto;
            padding: 0.5rem;
            border-right: none;
            border-bottom: 1px solid #e9ecef;
          }
          
          .slide-thumbnail-container {
            min-width: 120px;
            margin-right: 0.5rem;
            margin-bottom: 0;
          }
          
          .properties-panel {
            width: 100%;
            border-left: none;
            border-top: 1px solid #e9ecef;
          }
          
          .canvas-area {
            min-height: 400px;
          }
        }
      `}</style>

      <div className="editor-container">
        {/* Toolbar Principal */}
        <div className="editor-toolbar">
          <div className="toolbar-title">
            <span>🎬</span>
            <input
              type="text"
              value={presentationTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 600,
                outline: 'none'
              }}
              placeholder="Título de la presentación"
            />
          </div>
          
          <div className="toolbar-actions">
            <button 
              className="btn-toolbar"
              onClick={() => setShowTemplateGallery(true)}
            >
              <span className="me-2">➕</span>
              Agregar Slide
            </button>
            <button 
              className="btn-toolbar"
              onClick={() => setShowEffectsPanel(!showEffectsPanel)}
            >
              <span className="me-2">✨</span>
              Efectos
            </button>
            <button className="btn-toolbar">
              <span className="me-2">👁️</span>
              Preview
            </button>
          </div>
        </div>

        <div className="editor-workspace">
          {/* Panel de Slides (Izquierda) */}
          <div className="slides-panel">
            <div className="mb-2">
              <small className="text-muted">
                {slides.length} diapositivas
              </small>
            </div>
            
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`slide-thumbnail-container ${draggedSlideIndex === index ? 'dragging' : ''}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div 
                  className={`slide-thumbnail ${selectedSlideIndex === index ? 'selected' : ''}`}
                  onClick={() => setSelectedSlideIndex(index)}
                >
                  <div className="slide-number">{index + 1}</div>
                  
                  {/* Mini preview del slide */}
                  <div style={{
                    height: '80px',
                    background: 'linear-gradient(135deg, #f5f5f5, #e9ecef)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: '#6c757d'
                  }}>
                    {slide.type === 'title' && '📋 Título'}
                    {slide.type === 'content' && '📄 Contenido'}
                    {slide.type === 'bullets' && '📝 Lista'}
                    {slide.type === 'quote' && '💬 Cita'}
                    {slide.type === 'chart' && '📊 Gráfico'}
                    {slide.type === 'image' && '🖼️ Imagen'}
                  </div>
                  
                  <div className="slide-actions">
                    <button 
                      className="btn-slide-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateSlide(index);
                      }}
                      title="Duplicar"
                    >
                      📋
                    </button>
                    <button 
                      className="btn-slide-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSlide(index);
                      }}
                      title="Eliminar"
                      style={{ background: '#dc3545' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Área de Canvas (Centro) */}
          <div className="canvas-area">
            <div className="canvas-controls">
              <div>
                <ButtonGroup size="sm">
                  <Button variant="outline-secondary">
                    <span className="me-1">🔍</span>
                    50%
                  </Button>
                  <Button variant="outline-secondary">
                    <span className="me-1">📐</span>
                    Ajustar
                  </Button>
                  <Button variant="outline-secondary">
                    <span className="me-1">📏</span>
                    100%
                  </Button>
                </ButtonGroup>
              </div>
              
              <div>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setIsEditingSlide(!isEditingSlide)}
                >
                  <span className="me-1">✏️</span>
                  {isEditingSlide ? 'Guardar' : 'Editar'}
                </Button>
              </div>
            </div>
            
            <div className="canvas-viewport" ref={canvasRef}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedSlideIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', maxWidth: '800px' }}
                >
                  <SlidePreview
                    slide={slides[selectedSlideIndex]}
                    theme={selectedTheme}
                    isPreview={true}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Panel de Propiedades (Derecha) */}
          {showEffectsPanel && (
            <div className="properties-panel">
              <h5 className="mb-3">Efectos Cinematográficos</h5>
              
              {/* Transiciones */}
              <div className="property-section">
                <h6>Transiciones</h6>
                <div className="effect-grid">
                  {cinematicEffects.transitions.map(transition => (
                    <div
                      key={transition.id}
                      className={`effect-option ${slides[selectedSlideIndex]?.transition === transition.id ? 'selected' : ''}`}
                      onClick={() => applyEffect('transition', transition.id)}
                    >
                      <div className="effect-icon">{transition.icon}</div>
                      <div className="effect-name">{transition.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Animaciones */}
              <div className="property-section">
                <h6>Animaciones</h6>
                {cinematicEffects.animations.map(animation => (
                  <div
                    key={animation.id}
                    className={`mb-2 p-2 border rounded cursor-pointer ${
                      slides[selectedSlideIndex]?.animation === animation.id ? 'border-primary bg-light' : ''
                    }`}
                    onClick={() => applyEffect('animation', animation.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="fw-bold small">{animation.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {animation.description}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Fondos */}
              <div className="property-section">
                <h6>Fondos Premium</h6>
                {cinematicEffects.backgrounds.map(bg => (
                  <div key={bg.id}>
                    <div
                      className="background-preview"
                      style={{ background: bg.preview }}
                      onClick={() => applyBackground(bg)}
                    />
                    <div className="text-center small text-muted mb-2">
                      {bg.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Galería de Templates */}
      <Modal 
        show={showTemplateGallery} 
        onHide={() => setShowTemplateGallery(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="me-2">🎨</span>
            Elegir Template de Slide
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="template-gallery">
            {slideTemplates.map(template => (
              <div
                key={template.id}
                className="template-card"
                onClick={() => addSlideFromTemplate(template)}
              >
                <div className="template-preview">{template.preview}</div>
                <div className="template-name">{template.name}</div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      {/* FAB para agregar slide */}
      <button 
        className="btn-add-slide-fab"
        onClick={() => setShowTemplateGallery(true)}
        title="Agregar nueva slide"
      >
        +
      </button>
    </>
  );
};

export default PresentationEditor;
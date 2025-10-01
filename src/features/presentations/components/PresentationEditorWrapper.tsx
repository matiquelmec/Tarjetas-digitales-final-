'use client';

import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import PresentationEditor from './advanced/PresentationEditor';
import PremiumThemeSelector from './PremiumThemeSelector';
import EnhancedSlidePreview from './EnhancedSlidePreview';
import { SlideTheme } from '../hooks/useAdvancedSlideEffects';

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

interface PresentationEditorWrapperProps {
  presentation?: any;
  onSave?: (presentation: any) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const PresentationEditorWrapper: React.FC<PresentationEditorWrapperProps> = ({
  presentation,
  onSave,
  onCancel,
  isEditing = false
}) => {
  const [title, setTitle] = useState(presentation?.title || 'Nueva Presentación');
  const [description, setDescription] = useState(presentation?.description || '');
  const [slides, setSlides] = useState<Slide[]>(presentation?.slides || [
    {
      id: 'slide-1',
      type: 'title',
      content: {
        title: 'Mi Presentación',
        subtitle: 'Creada con Indi'
      }
    }
  ]);
  const [selectedTheme, setSelectedTheme] = useState<SlideTheme>(presentation?.theme || 'stellar');
  const [effectsConfig, setEffectsConfig] = useState({
    enablePremiumEffects: true,
    enableCinematicTransitions: true,
    enableHoverEffects: true,
    enableParticles: true,
    enableGlassmorphism: true,
    particleIntensity: 0.8,
    animationSpeed: 1.0
  });
  const [activeTab, setActiveTab] = useState('slides');

  const handleSave = async () => {
    const presentationData = {
      id: presentation?.id || `pres-${Date.now()}`,
      title,
      description,
      slides,
      theme: selectedTheme,
      effectsConfig,
      isPublic: false,
      createdAt: presentation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      let response;
      if (isEditing && presentation?.id) {
        // Actualizar presentación existente
        response = await fetch(`/api/presentations/${presentation.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(presentationData),
          credentials: 'same-origin'
        });
      } else {
        // Crear nueva presentación
        response = await fetch('/api/presentations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(presentationData),
          credentials: 'same-origin'
        });
      }

      if (response.ok) {
        const result = await response.json();
        onSave?.(result.presentation || presentationData);
      } else {
        console.error('Error saving presentation');
      }
    } catch (error) {
      console.error('Error saving presentation:', error);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .premium-editor-container {
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
          min-height: 100vh;
          padding: 2rem 0;
        }
        
        .editor-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .editor-tabs .nav-link {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
          margin-right: 0.5rem;
          border-radius: 15px;
          transition: all 0.3s ease;
        }
        
        .editor-tabs .nav-link.active {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border-color: #00f6ff;
          color: white;
          box-shadow: 0 4px 15px rgba(0, 246, 255, 0.3);
        }
        
        .editor-tabs .nav-link:hover:not(.active) {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          color: white;
        }
        
        .editor-content {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          min-height: 600px;
        }
        
        .slide-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }
      `}} />
      
      <Container fluid className="premium-editor-container">
        {/* Header con información básica */}
        <div className="editor-header">
          <Row className="align-items-center">
            <Col lg={8}>
              <div className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Label className="text-white fw-bold h5">
                    🎨 {isEditing ? 'Editando' : 'Creando'} Presentación Premium
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título de tu presentación..."
                    size="lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '600'
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción opcional de tu presentación..."
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      color: 'white',
                      resize: 'none'
                    }}
                  />
                </Form.Group>
              </div>
            </Col>
            <Col lg={4} className="text-end">
              <div className="d-flex gap-2 justify-content-end">
                <Button 
                  variant="outline-light" 
                  onClick={onCancel}
                  style={{ borderRadius: '15px' }}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="success" 
                  onClick={handleSave}
                  style={{ 
                    borderRadius: '15px',
                    background: 'linear-gradient(135deg, #00f6ff, #0072ff)',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0, 246, 255, 0.3)'
                  }}
                >
                  ✨ {isEditing ? 'Actualizar' : 'Crear'} Presentación
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Tabs de navegación */}
        <Tabs
          activeKey={activeTab}
          onSelect={(tab) => setActiveTab(tab || 'slides')}
          className="editor-tabs mb-4"
        >
          {/* Tab de Slides */}
          <Tab eventKey="slides" title="📄 Slides Editor">
            <div className="editor-content">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-white fw-bold mb-0">
                  Editor de Slides ({slides.length} slides)
                </h5>
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const newSlide = {
                      id: `slide-${Date.now()}`,
                      type: 'content' as const,
                      content: { title: 'Nuevo Slide', text: 'Contenido del slide...' }
                    };
                    setSlides([...slides, newSlide]);
                  }}
                  style={{ borderRadius: '12px' }}
                >
                  ➕ Agregar Slide
                </Button>
              </div>
              
              {/* Grid de slides con previews premium */}
              <div className="slide-grid">
                {slides.map((slide, index) => (
                  <div key={slide.id} className="position-relative">
                    <EnhancedSlidePreview
                      slide={slide}
                      theme={selectedTheme}
                      isPreview={true}
                      enablePremiumEffects={effectsConfig.enablePremiumEffects}
                      enableCinematicTransitions={effectsConfig.enableCinematicTransitions}
                      enableHoverEffects={effectsConfig.enableHoverEffects}
                      onClick={() => {
                        // Aquí iría la lógica para editar el slide individual
                        console.log('Editar slide:', slide.id);
                      }}
                    />
                    
                    {/* Controles del slide */}
                    <div 
                      className="position-absolute top-0 end-0 p-2"
                      style={{ zIndex: 10 }}
                    >
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setSlides(slides.filter(s => s.id !== slide.id))}
                        style={{ 
                          borderRadius: '50%', 
                          width: '30px', 
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem'
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                    
                    {/* Número del slide */}
                    <div 
                      className="position-absolute bottom-0 start-0 p-2"
                      style={{ zIndex: 10 }}
                    >
                      <span 
                        className="badge"
                        style={{ 
                          background: 'rgba(0, 246, 255, 0.8)',
                          color: 'white',
                          fontSize: '0.8rem'
                        }}
                      >
                        {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tab>

          {/* Tab de Temas Premium */}
          <Tab eventKey="themes" title="🎨 Temas Premium">
            <div className="editor-content">
              <PremiumThemeSelector
                selectedTheme={selectedTheme}
                onThemeChange={setSelectedTheme}
                onEffectsChange={setEffectsConfig}
                enableAdvancedCustomization={true}
                showPreview={true}
              />
            </div>
          </Tab>

          {/* Tab de Vista Previa */}
          <Tab eventKey="preview" title="👀 Vista Previa">
            <div className="editor-content">
              <div className="text-center">
                <h5 className="text-white fw-bold mb-4">
                  🚀 Vista Previa de tu Presentación Premium
                </h5>
                <p className="text-white-50 mb-4">
                  Visualiza cómo se verán tus slides con todos los efectos aplicados
                </p>
                
                {slides.length > 0 ? (
                  <Row className="justify-content-center">
                    <Col lg={8}>
                      {slides.map((slide, index) => (
                        <div key={slide.id} className="mb-4">
                          <EnhancedSlidePreview
                            slide={slide}
                            theme={selectedTheme}
                            isPreview={false}
                            enablePremiumEffects={effectsConfig.enablePremiumEffects}
                            enableCinematicTransitions={effectsConfig.enableCinematicTransitions}
                            enableHoverEffects={effectsConfig.enableHoverEffects}
                            autoplayDelay={index * 0.2}
                          />
                        </div>
                      ))}
                    </Col>
                  </Row>
                ) : (
                  <div className="text-center py-5">
                    <div className="text-white-50" style={{ fontSize: '3rem' }}>
                      📄
                    </div>
                    <h6 className="text-white mt-3">No hay slides creados</h6>
                    <p className="text-white-50">
                      Ve a la pestaña "Slides Editor" para crear tu primer slide
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};

export default PresentationEditorWrapper;
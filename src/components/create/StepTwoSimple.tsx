'use client';

import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useUniversalContrast } from '@/hooks/useUniversalContrast';

interface CardData {
  cardBackgroundColor?: string;
  cardTextColor?: string;
  pageBackgroundColor?: string;
  buttonSecondaryColor?: string;
  buttonSecondaryHoverColor?: string;
  buttonNormalBackgroundColor?: string;
  fontFamily?: string;
  enableHoverEffect?: boolean;
  enableGlassmorphism?: boolean;
  enableSubtleAnimations?: boolean;
  enableBackgroundPatterns?: boolean;
  enableParticles?: boolean;
  particleType?: string;
  particleDensity?: number;
  particleCount?: number;
  enableAnimatedGradient?: boolean;
  animatedGradientType?: string;
  animatedGradientSpeed?: number;
  animatedGradientIntensity?: number;
  animatedGradientOpacity?: number;
  enableFloatingShapes?: boolean;
  floatingShapesType?: string;
  floatingShapesCount?: number;
  floatingShapesSpeed?: number;
  ambientIntensity?: number;
  ambientOpacity?: number;
}

interface StepTwoProps {
  cardData: CardData;
  updateCardData: (field: string, value: string | boolean | number) => void;
}

type DesignMode = 'minimal' | 'elegant' | 'dynamic' | 'custom';

interface DesignModeConfig {
  id: DesignMode;
  name: string;
  description: string;
  icon: string;
  config: Partial<CardData>;
}

const designModes: DesignModeConfig[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Profesionalismo puro sin distracciones',
    icon: '🎯',
    config: {
      // Tema azul corporativo profesional
      cardBackgroundColor: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
      cardTextColor: '#ffffff',
      pageBackgroundColor: '#0d0f2b',
      buttonSecondaryColor: '#7986cb',
      buttonSecondaryHoverColor: '#5c6bc0',
      buttonNormalBackgroundColor: 'rgba(121,134,203,0.2)',
      fontFamily: 'Montserrat',
      // Solo hover sutil
      enableHoverEffect: true,
      enableGlassmorphism: false,
      enableSubtleAnimations: false,
      enableBackgroundPatterns: false,
      enableParticles: false,
      enableFloatingShapes: false,
      enableAnimatedGradient: false
    }
  },
  {
    id: 'elegant',
    name: 'Elegante',
    description: 'Sofisticación equilibrada con efectos premium',
    icon: '✨',
    config: {
      // Tema diamante ejecutivo
      cardBackgroundColor: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      cardTextColor: '#ffffff',
      pageBackgroundColor: '#0a0d1a',
      buttonSecondaryColor: '#00F6FF',
      buttonSecondaryHoverColor: '#00D1DB',
      buttonNormalBackgroundColor: 'rgba(0,246,255,0.25)',
      fontFamily: 'Playfair Display',
      // Efectos elegantes equilibrados
      enableHoverEffect: true,
      enableGlassmorphism: true,
      enableSubtleAnimations: true,
      enableBackgroundPatterns: false,
      enableParticles: true,
      particleType: 'professional',
      particleCount: 3,
      enableFloatingShapes: false,
      enableAnimatedGradient: false
    }
  },
  {
    id: 'dynamic',
    name: 'Dinámico',
    description: 'Máximo impacto visual e interactividad',
    icon: '🚀',
    config: {
      // Tema creativo vibrante
      cardBackgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardTextColor: '#ffffff',
      pageBackgroundColor: '#1a1a2e',
      buttonSecondaryColor: '#fbbf24',
      buttonSecondaryHoverColor: '#f59e0b',
      buttonNormalBackgroundColor: 'rgba(251,191,36,0.25)',
      fontFamily: 'Poppins',
      // Todos los efectos activados
      enableHoverEffect: true,
      enableGlassmorphism: true,
      enableSubtleAnimations: true,
      enableBackgroundPatterns: true,
      enableParticles: true,
      particleType: 'creative',
      particleCount: 8,
      enableFloatingShapes: true,
      floatingShapesType: 'geometric',
      floatingShapesCount: 3,
      floatingShapesSpeed: 3,
      enableAnimatedGradient: true,
      animatedGradientType: 'aurora',
      animatedGradientSpeed: 3
    }
  }
];

export function StepTwoSimple({ cardData, updateCardData }: StepTwoProps) {
  const [selectedMode, setSelectedMode] = useState<DesignMode>('minimal');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { applyAndUpdate } = useUniversalContrast();

  const applyDesignMode = (mode: DesignModeConfig) => {
    // Aplicar todas las configuraciones del modo
    Object.entries(mode.config).forEach(([key, value]) => {
      updateCardData(key, value);
    });
    
    // Si tiene colores, aplicar con contraste universal
    if (mode.config.cardBackgroundColor && mode.config.cardTextColor) {
      applyAndUpdate({
        cardBackgroundColor: mode.config.cardBackgroundColor,
        cardTextColor: mode.config.cardTextColor,
        pageBackgroundColor: mode.config.pageBackgroundColor,
        buttonSecondaryColor: mode.config.buttonSecondaryColor,
        buttonSecondaryHoverColor: mode.config.buttonSecondaryHoverColor,
        buttonNormalBackgroundColor: mode.config.buttonNormalBackgroundColor
      }, updateCardData);
    }
    
    setSelectedMode(mode.id);
  };

  return (
    <div className="step-two-simple">
      {/* Header */}
      <div className="text-center mb-4">
        <h4 className="mb-2">🎨 Elige tu Estilo de Diseño</h4>
        <p className="text-muted">Selecciona el estilo que mejor represente tu marca profesional</p>
      </div>

      {/* Design Mode Cards */}
      <Row className="mb-4">
        {designModes.map((mode) => (
          <Col md={4} key={mode.id} className="mb-3">
            <Card 
              className={`h-100 cursor-pointer design-mode-card ${selectedMode === mode.id ? 'border-primary border-2' : ''}`}
              onClick={() => applyDesignMode(mode)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: selectedMode === mode.id ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selectedMode === mode.id ? '0 8px 24px rgba(0,123,255,0.2)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (selectedMode !== mode.id) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedMode !== mode.id) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <Card.Body className="text-center">
                <div className="mb-3" style={{ fontSize: '3rem' }}>{mode.icon}</div>
                <h5 className="mb-2">{mode.name}</h5>
                <p className="text-muted small mb-3">{mode.description}</p>
                
                {/* Visual preview de características */}
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  {mode.config.enableGlassmorphism && <span className="badge bg-info">Glass</span>}
                  {mode.config.enableParticles && <span className="badge bg-primary">Partículas</span>}
                  {mode.config.enableFloatingShapes && <span className="badge bg-success">Formas</span>}
                  {mode.config.enableAnimatedGradient && <span className="badge bg-warning text-dark">Gradientes</span>}
                  {!mode.config.enableGlassmorphism && !mode.config.enableParticles && 
                   !mode.config.enableFloatingShapes && !mode.config.enableAnimatedGradient && 
                   <span className="badge bg-secondary">Limpio</span>}
                </div>
                
                {selectedMode === mode.id && (
                  <div className="mt-3">
                    <span className="text-primary fw-bold">✓ Seleccionado</span>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Personalización Avanzada Button */}
      <div className="text-center mb-4">
        <Button 
          variant="outline-secondary" 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4"
        >
          <span className="me-2">⚙️</span>
          {showAdvanced ? 'Ocultar' : 'Mostrar'} Personalización Avanzada
        </Button>
      </div>

      {/* Personalización Avanzada (Expandible) */}
      {showAdvanced && (
        <Card className="mb-4">
          <Card.Body>
            <h5 className="mb-3">⚙️ Personalización Avanzada</h5>
            
            {/* Color Principal */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>🎨 Color Principal de Tarjeta</Form.Label>
                  <Form.Control
                    type="color"
                    value={cardData.cardBackgroundColor?.includes('gradient') 
                      ? '#667eea' 
                      : cardData.cardBackgroundColor || '#1a237e'}
                    onChange={(e) => updateCardData('cardBackgroundColor', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>📝 Color de Texto</Form.Label>
                  <Form.Control
                    type="color"
                    value={cardData.cardTextColor || '#ffffff'}
                    onChange={(e) => updateCardData('cardTextColor', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Tipografía */}
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>✍️ Tipografía</Form.Label>
                  <Form.Select 
                    value={cardData.fontFamily || 'Montserrat'}
                    onChange={(e) => updateCardData('fontFamily', e.target.value)}
                  >
                    <option value="Montserrat">Montserrat - Moderna y limpia</option>
                    <option value="Playfair Display">Playfair Display - Elegante y editorial</option>
                    <option value="Poppins">Poppins - Amigable y versátil</option>
                    <option value="Merriweather">Merriweather - Clásica y legible</option>
                    <option value="Source Sans Pro">Source Sans Pro - Técnica y precisa</option>
                    <option value="Crimson Text">Crimson Text - Formal y tradicional</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Efectos Toggles Simplificados */}
            <div className="mb-3">
              <h6 className="mb-3">✨ Efectos Visuales</h6>
              <Row>
                <Col md={6} className="mb-2">
                  <Form.Check
                    type="switch"
                    id="glassmorphism"
                    label="🫧 Glassmorphism"
                    checked={cardData.enableGlassmorphism || false}
                    onChange={(e) => updateCardData('enableGlassmorphism', e.target.checked)}
                  />
                </Col>
                <Col md={6} className="mb-2">
                  <Form.Check
                    type="switch"
                    id="animations"
                    label="💫 Animaciones Sutiles"
                    checked={cardData.enableSubtleAnimations || false}
                    onChange={(e) => updateCardData('enableSubtleAnimations', e.target.checked)}
                  />
                </Col>
                <Col md={6} className="mb-2">
                  <Form.Check
                    type="switch"
                    id="particles"
                    label="✨ Partículas"
                    checked={cardData.enableParticles || false}
                    onChange={(e) => updateCardData('enableParticles', e.target.checked)}
                  />
                </Col>
                <Col md={6} className="mb-2">
                  <Form.Check
                    type="switch"
                    id="shapes"
                    label="🔷 Formas Flotantes"
                    checked={cardData.enableFloatingShapes || false}
                    onChange={(e) => updateCardData('enableFloatingShapes', e.target.checked)}
                  />
                </Col>
              </Row>
            </div>

            {/* Configuración de Partículas (si están activas) */}
            {cardData.enableParticles && (
              <div className="p-3 bg-light rounded mb-3">
                <h6 className="mb-3">⚡ Configuración de Partículas</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Intensidad</Form.Label>
                      <Form.Select
                        value={cardData.particleCount <= 3 ? 'subtle' : cardData.particleCount <= 5 ? 'balanced' : 'prominent'}
                        onChange={(e) => {
                          const map = { subtle: 3, balanced: 5, prominent: 8 };
                          updateCardData('particleCount', map[e.target.value as keyof typeof map]);
                        }}
                      >
                        <option value="subtle">Sutil (3)</option>
                        <option value="balanced">Balanceado (5)</option>
                        <option value="prominent">Prominente (8)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Comportamiento</Form.Label>
                      <Form.Select
                        value={cardData.particleType || 'professional'}
                        onChange={(e) => updateCardData('particleType', e.target.value)}
                      >
                        <option value="professional">Profesional</option>
                        <option value="creative">Creativo</option>
                        <option value="constellation">Ejecutivo</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Tip Final */}
      <div className="alert alert-info">
        <strong>💡 Consejo:</strong> Los modos predefinidos están optimizados para diferentes perfiles profesionales. 
        La vista previa se actualiza automáticamente al seleccionar cada opción.
      </div>
    </div>
  );
}
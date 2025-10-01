/**
 * Selector de temas premium que aprovecha todo el sistema de efectos de las tarjetas digitales
 * Permite personalización completa de efectos visuales avanzados
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Button, Form, ButtonGroup, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideTheme } from '../hooks/useAdvancedSlideEffects';
import EnhancedSlidePreview from './EnhancedSlidePreview';

interface PremiumThemeSelectorProps {
  selectedTheme: SlideTheme;
  onThemeChange: (theme: SlideTheme) => void;
  onEffectsChange?: (effects: EffectsConfig) => void;
  enableAdvancedCustomization?: boolean;
  showPreview?: boolean;
}

interface EffectsConfig {
  enablePremiumEffects: boolean;
  enableCinematicTransitions: boolean;
  enableHoverEffects: boolean;
  enableParticles: boolean;
  enableGlassmorphism: boolean;
  particleIntensity: number;
  animationSpeed: number;
}

interface ThemePreview {
  theme: SlideTheme;
  name: string;
  description: string;
  premium: boolean;
  effects: {
    particles: boolean;
    glassmorphism: boolean;
    cinematic: boolean;
    premium: boolean;
  };
  previewColors: {
    primary: string;
    background: string;
    accent: string;
  };
}

const THEME_PREVIEWS: ThemePreview[] = [
  {
    theme: 'stellar',
    name: 'Stellar Cosmic',
    description: 'Efectos espaciales premium con partículas constellation',
    premium: true,
    effects: { particles: true, glassmorphism: true, cinematic: true, premium: true },
    previewColors: { primary: '#00f6ff', background: '#0c0c0c', accent: '#8e2de2' }
  },
  {
    theme: 'ocean',
    name: 'Ocean Depths',
    description: 'Fluídez acuática con efectos de profundidad',
    premium: true,
    effects: { particles: true, glassmorphism: true, cinematic: true, premium: true },
    previewColors: { primary: '#00d4ff', background: '#006994', accent: '#66e0ff' }
  },
  {
    theme: 'creative',
    name: 'Creative Fire',
    description: 'Energía creativa con efectos dinámicos',
    premium: true,
    effects: { particles: true, glassmorphism: true, cinematic: true, premium: true },
    previewColors: { primary: '#f59e0b', background: '#7c2d12', accent: '#fbbf24' }
  },
  {
    theme: 'modern',
    name: 'Modern Purple',
    description: 'Elegancia moderna con efectos sofisticados',
    premium: true,
    effects: { particles: true, glassmorphism: true, cinematic: true, premium: true },
    previewColors: { primary: '#8b5cf6', background: '#1e1b4b', accent: '#a78bfa' }
  },
  {
    theme: 'elegant',
    name: 'Elegant Rose',
    description: 'Refinamiento visual con transiciones suaves',
    premium: true,
    effects: { particles: false, glassmorphism: true, cinematic: true, premium: true },
    previewColors: { primary: '#ec4899', background: '#4c1d95', accent: '#f472b6' }
  },
  {
    theme: 'corporate',
    name: 'Corporate Blue',
    description: 'Profesionalismo con efectos sutiles',
    premium: false,
    effects: { particles: false, glassmorphism: true, cinematic: false, premium: false },
    previewColors: { primary: '#3b82f6', background: '#1e293b', accent: '#60a5fa' }
  },
  {
    theme: 'professional',
    name: 'Professional Green',
    description: 'Seriedad empresarial con efectos mínimos',
    premium: false,
    effects: { particles: false, glassmorphism: true, cinematic: false, premium: false },
    previewColors: { primary: '#059669', background: '#064e3b', accent: '#10b981' }
  }
];

const PremiumThemeSelector: React.FC<PremiumThemeSelectorProps> = ({
  selectedTheme,
  onThemeChange,
  onEffectsChange,
  enableAdvancedCustomization = true,
  showPreview = true
}) => {
  const [effectsConfig, setEffectsConfig] = useState<EffectsConfig>({
    enablePremiumEffects: true,
    enableCinematicTransitions: true,
    enableHoverEffects: true,
    enableParticles: true,
    enableGlassmorphism: true,
    particleIntensity: 0.8,
    animationSpeed: 1.0
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  const selectedThemeData = useMemo(() => 
    THEME_PREVIEWS.find(t => t.theme === selectedTheme) || THEME_PREVIEWS[0]
  , [selectedTheme]);

  const handleThemeSelect = (theme: SlideTheme) => {
    onThemeChange(theme);
    
    // Ajustar efectos automáticamente según el tema
    const themeData = THEME_PREVIEWS.find(t => t.theme === theme);
    if (themeData) {
      const newEffects = {
        ...effectsConfig,
        enablePremiumEffects: themeData.effects.premium,
        enableCinematicTransitions: themeData.effects.cinematic,
        enableParticles: themeData.effects.particles,
        enableGlassmorphism: themeData.effects.glassmorphism
      };
      setEffectsConfig(newEffects);
      onEffectsChange?.(newEffects);
    }
  };

  const handleEffectChange = (key: keyof EffectsConfig, value: boolean | number) => {
    const newEffects = { ...effectsConfig, [key]: value };
    setEffectsConfig(newEffects);
    onEffectsChange?.(newEffects);
  };

  const sampleSlide = {
    id: 'preview',
    type: 'title' as const,
    content: {
      title: 'Vista Previa',
      subtitle: 'Efectos Premium Activados'
    }
  };

  return (
    <div className="premium-theme-selector">
      <style jsx>{`
        .theme-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 2px solid transparent;
          border-radius: 15px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .theme-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }
        
        .theme-card.selected {
          border-color: #00f6ff;
          box-shadow: 0 0 30px rgba(0, 246, 255, 0.3);
        }
        
        .theme-preview {
          width: 100%;
          height: 80px;
          border-radius: 10px;
          margin-bottom: 0.75rem;
          position: relative;
          overflow: hidden;
        }
        
        .effects-panel {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 1.5rem;
          margin-top: 1rem;
        }
        
        .effect-control {
          margin-bottom: 1rem;
        }
        
        .premium-badge {
          background: linear-gradient(135deg, #ffd700, #ffb347);
          color: #1a1a1a;
          font-weight: 700;
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
        }
        
        .effect-icons {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .effect-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
        }
      `}</style>

      {/* Header */}
      <div className="mb-4">
        <h4 className="text-white fw-bold mb-2">🎨 Temas Premium con Efectos Avanzados</h4>
        <p className="text-white-50 mb-0">
          Aprovecha todo el poder visual de las tarjetas digitales en tus presentaciones
        </p>
      </div>

      {/* Selector de Temas */}
      <Row className="g-3 mb-4">
        {THEME_PREVIEWS.map((themeData) => (
          <Col key={themeData.theme} md={6} lg={4}>
            <motion.div
              className={`theme-card ${selectedTheme === themeData.theme ? 'selected' : ''}`}
              onClick={() => handleThemeSelect(themeData.theme)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Preview del tema */}
              <div 
                className="theme-preview"
                style={{
                  background: `linear-gradient(135deg, ${themeData.previewColors.background}, ${themeData.previewColors.primary})`
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    textAlign: 'center'
                  }}
                >
                  {themeData.name}
                </div>
                {themeData.premium && (
                  <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
                    <Badge className="premium-badge">PREMIUM</Badge>
                  </div>
                )}
              </div>

              {/* Información del tema */}
              <h6 className="text-white fw-semibold mb-1">{themeData.name}</h6>
              <p className="text-white-50 small mb-2">{themeData.description}</p>

              {/* Iconos de efectos */}
              <div className="effect-icons">
                {themeData.effects.particles && (
                  <div className="effect-icon" style={{ background: '#00f6ff' }} title="Partículas">
                    ✨
                  </div>
                )}
                {themeData.effects.glassmorphism && (
                  <div className="effect-icon" style={{ background: '#8b5cf6' }} title="Glassmorphism">
                    🔮
                  </div>
                )}
                {themeData.effects.cinematic && (
                  <div className="effect-icon" style={{ background: '#f59e0b' }} title="Transiciones Cinematográficas">
                    🎬
                  </div>
                )}
                {themeData.effects.premium && (
                  <div className="effect-icon" style={{ background: '#ec4899' }} title="Efectos Premium">
                    ⭐
                  </div>
                )}
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Vista Previa en Vivo */}
      {showPreview && (
        <div className="mb-4">
          <h5 className="text-white fw-semibold mb-3">👀 Vista Previa en Tiempo Real</h5>
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <EnhancedSlidePreview
              slide={sampleSlide}
              theme={selectedTheme}
              isPreview={true}
              enablePremiumEffects={effectsConfig.enablePremiumEffects}
              enableCinematicTransitions={effectsConfig.enableCinematicTransitions}
              enableHoverEffects={effectsConfig.enableHoverEffects}
            />
          </div>
        </div>
      )}

      {/* Panel de Efectos Avanzados */}
      {enableAdvancedCustomization && (
        <div className="effects-panel">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-white fw-semibold mb-0">⚡ Personalización de Efectos</h5>
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Ocultar' : 'Mostrar'} Avanzado
            </Button>
          </div>

          {/* Controles Básicos */}
          <Row className="g-3">
            <Col md={6}>
              <Form.Check
                type="switch"
                id="premium-effects"
                label="Efectos Premium"
                checked={effectsConfig.enablePremiumEffects}
                onChange={(e) => handleEffectChange('enablePremiumEffects', e.target.checked)}
                className="text-white"
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="switch"
                id="cinematic-transitions"
                label="Transiciones Cinematográficas"
                checked={effectsConfig.enableCinematicTransitions}
                onChange={(e) => handleEffectChange('enableCinematicTransitions', e.target.checked)}
                className="text-white"
                disabled={!selectedThemeData.effects.cinematic}
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="switch"
                id="hover-effects"
                label="Efectos Hover"
                checked={effectsConfig.enableHoverEffects}
                onChange={(e) => handleEffectChange('enableHoverEffects', e.target.checked)}
                className="text-white"
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="switch"
                id="particles"
                label="Sistema de Partículas"
                checked={effectsConfig.enableParticles}
                onChange={(e) => handleEffectChange('enableParticles', e.target.checked)}
                className="text-white"
                disabled={!selectedThemeData.effects.particles}
              />
            </Col>
          </Row>

          {/* Controles Avanzados */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <hr style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-white small">Intensidad de Partículas</Form.Label>
                      <Form.Range
                        min={0}
                        max={1}
                        step={0.1}
                        value={effectsConfig.particleIntensity}
                        onChange={(e) => handleEffectChange('particleIntensity', parseFloat(e.target.value))}
                        disabled={!effectsConfig.enableParticles}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-white small">Velocidad de Animación</Form.Label>
                      <Form.Range
                        min={0.5}
                        max={2}
                        step={0.1}
                        value={effectsConfig.animationSpeed}
                        onChange={(e) => handleEffectChange('animationSpeed', parseFloat(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mt-3">
                  <small className="text-white-50">
                    💡 Los efectos se optimizan automáticamente para dispositivos móviles
                  </small>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Información sobre el tema seleccionado */}
      <div className="mt-3 p-3" style={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: '10px',
        border: `1px solid ${selectedThemeData.previewColors.primary}30`
      }}>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h6 className="text-white mb-1">
              🎨 Tema Seleccionado: <span style={{ color: selectedThemeData.previewColors.primary }}>
                {selectedThemeData.name}
              </span>
            </h6>
            <small className="text-white-50">{selectedThemeData.description}</small>
          </div>
          {selectedThemeData.premium && (
            <Badge className="premium-badge">PREMIUM</Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumThemeSelector;
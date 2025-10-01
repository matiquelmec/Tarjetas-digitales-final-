/**
 * Panel de Efectos - Controles visuales migrados de tarjetas digitales
 */

'use client';

import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { Slide } from '../types/orbital';

interface EffectsPanelProps {
  slide: Slide;
  onChange: (updates: Partial<Slide>) => void;
}

const EffectsPanel: React.FC<EffectsPanelProps> = ({
  slide,
  onChange
}) => {
  const updateEffects = (effectUpdates: Partial<Slide['effects']>) => {
    onChange({
      effects: {
        ...slide.effects,
        ...effectUpdates
      }
    });
  };

  return (
    <div className="effects-panel">
      <style jsx>{`
        .effects-panel {
          color: white;
        }
        
        .effect-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          padding: 8px 12px;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }
        
        .effect-toggle:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        
        .effect-toggle.active {
          background: rgba(0, 246, 255, 0.2);
          border-color: rgba(0, 246, 255, 0.5);
        }
      `}</style>

      {/* Efectos Visuales */}
      <div className="mb-3">
        <h6 className="text-white fw-semibold mb-2">✨ Efectos Visuales</h6>
        
        <Row className="g-2">
          <Col xs={6}>
            <Form.Check
              type="switch"
              id="glassmorphism"
              label="Glassmorphism"
              checked={slide.effects.glassmorphism}
              onChange={(e) => updateEffects({ glassmorphism: e.target.checked })}
              className="text-white"
            />
          </Col>
          
          <Col xs={6}>
            <Form.Check
              type="switch"
              id="particles"
              label="Partículas"
              checked={slide.effects.particles}
              onChange={(e) => updateEffects({ particles: e.target.checked })}
              className="text-white"
            />
          </Col>
          
          <Col xs={6}>
            <Form.Check
              type="switch"
              id="animations"
              label="Animaciones"
              checked={slide.effects.animations}
              onChange={(e) => updateEffects({ animations: e.target.checked })}
              className="text-white"
            />
          </Col>
          
          <Col xs={6}>
            <Form.Check
              type="switch"
              id="hover"
              label="Hover Effect"
              checked={slide.effects.hover}
              onChange={(e) => updateEffects({ hover: e.target.checked })}
              className="text-white"
            />
          </Col>
          
          <Col xs={12}>
            <Form.Check
              type="switch"
              id="backgroundPatterns"
              label="Patrones de Fondo"
              checked={slide.effects.backgroundPatterns}
              onChange={(e) => updateEffects({ backgroundPatterns: e.target.checked })}
              className="text-white"
            />
          </Col>
        </Row>
      </div>

      {/* Tipo de Partículas */}
      {slide.effects.particles && (
        <div className="mb-3">
          <h6 className="text-white fw-semibold mb-2">🌟 Tipo de Partículas</h6>
          <Form.Select
            size="sm"
            value={slide.effects.particleType}
            onChange={(e) => updateEffects({ 
              particleType: e.target.value as 'floating' | 'constellation' | 'professional' | 'creative'
            })}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontSize: '0.8rem'
            }}
          >
            <option value="floating">Flotantes</option>
            <option value="constellation">Constelación</option>
            <option value="professional">Profesional</option>
            <option value="creative">Creativo</option>
          </Form.Select>
        </div>
      )}

      {/* Presets de Efectos */}
      <div className="mb-3">
        <h6 className="text-white fw-semibold mb-2">🎭 Presets</h6>
        <div className="d-flex flex-wrap gap-1">
          <button
            className="btn btn-sm btn-outline-light"
            style={{ fontSize: '0.7rem', borderRadius: '12px' }}
            onClick={() => updateEffects({
              glassmorphism: true,
              particles: true,
              particleType: 'professional',
              animations: true,
              backgroundPatterns: false,
              hover: true
            })}
          >
            💼 Profesional
          </button>
          
          <button
            className="btn btn-sm btn-outline-light"
            style={{ fontSize: '0.7rem', borderRadius: '12px' }}
            onClick={() => updateEffects({
              glassmorphism: true,
              particles: true,
              particleType: 'creative',
              animations: true,
              backgroundPatterns: true,
              hover: true
            })}
          >
            🎨 Creativo
          </button>
          
          <button
            className="btn btn-sm btn-outline-light"
            style={{ fontSize: '0.7rem', borderRadius: '12px' }}
            onClick={() => updateEffects({
              glassmorphism: false,
              particles: false,
              particleType: 'floating',
              animations: false,
              backgroundPatterns: false,
              hover: false
            })}
          >
            🔇 Minimal
          </button>
        </div>
      </div>

      {/* Estado de Rendimiento */}
      <div className="text-center">
        <small className="text-white-50">
          {Object.values(slide.effects).filter(Boolean).length} efectos activos
        </small>
      </div>
    </div>
  );
};

export default EffectsPanel;
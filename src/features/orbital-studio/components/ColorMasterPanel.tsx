/**
 * Panel Color Master - Migrado del sistema exitoso de tarjetas digitales
 * Controles de color que SÍ funcionan en tiempo real
 */

'use client';

import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Slide } from '../types/orbital';
import { useUniversalContrast } from '@/hooks/useUniversalContrast';

interface ColorMasterPanelProps {
  slide: Slide;
  onChange: (updates: Partial<Slide>) => void;
}

const ColorMasterPanel: React.FC<ColorMasterPanelProps> = ({
  slide,
  onChange
}) => {
  const { applyAndUpdate } = useUniversalContrast();

  // Temas profesionales (migrados de tarjetas exitosas)
  const professionalThemes = [
    {
      name: 'Corporate Executive',
      emoji: '💼',
      colors: {
        backgroundColor: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%)',
        textColor: '#ffffff'
      }
    },
    {
      name: 'Creative Studio',
      emoji: '🎨',
      colors: {
        backgroundColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        textColor: '#2c3e50'
      }
    },
    {
      name: 'Ocean Deep',
      emoji: '🌊',
      colors: {
        backgroundColor: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
        textColor: '#ffffff'
      }
    },
    {
      name: 'Tech Innovation',
      emoji: '💡',
      colors: {
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
        textColor: '#ffffff'
      }
    }
  ];

  // Aplicar tema
  const applyTheme = (theme: typeof professionalThemes[0]) => {
    onChange({
      backgroundColor: theme.colors.backgroundColor,
      textColor: theme.colors.textColor
    });
  };

  // Extraer color de gradiente para color picker
  const extractColorFromGradient = (gradient: string): string => {
    if (gradient.startsWith('#')) return gradient;
    const match = gradient.match(/#[0-9a-fA-F]{6}/);
    return match ? match[0] : '#2c2c2c';
  };

  return (
    <div className="color-master-panel">
      {/* Temas Rápidos */}
      <div className="mb-3">
        <h6 className="text-white fw-semibold mb-2">🎨 Temas Profesionales</h6>
        <div className="d-flex flex-wrap gap-1">
          {professionalThemes.map((theme, index) => (
            <button
              key={index}
              className="btn btn-sm"
              style={{
                background: theme.colors.backgroundColor,
                color: theme.colors.textColor,
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                fontSize: '0.7rem',
                padding: '4px 8px'
              }}
              onClick={() => applyTheme(theme)}
              title={theme.name}
            >
              {theme.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Controles Manuales (EXACTOS de tarjetas) */}
      <div className="mb-3">
        <h6 className="text-white fw-semibold mb-2">🎛️ Control Manual</h6>
        
        <Row className="g-2">
          {/* Fondo */}
          <Col xs={6}>
            <Form.Group>
              <Form.Label className="text-white mb-1" style={{ fontSize: '0.75rem' }}>
                🎨 Fondo
              </Form.Label>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="color"
                  value={extractColorFromGradient(slide.backgroundColor)}
                  onChange={(e) => onChange({ backgroundColor: e.target.value })}
                  style={{ 
                    width: '35px', 
                    height: '28px', 
                    cursor: 'pointer',
                    borderRadius: '6px',
                    border: 'none'
                  }}
                />
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    background: slide.backgroundColor,
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                />
              </div>
            </Form.Group>
          </Col>

          {/* Texto */}
          <Col xs={6}>
            <Form.Group>
              <Form.Label className="text-white mb-1" style={{ fontSize: '0.75rem' }}>
                📝 Texto
              </Form.Label>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="color"
                  value={slide.textColor}
                  onChange={(e) => onChange({ textColor: e.target.value })}
                  style={{ 
                    width: '35px', 
                    height: '28px', 
                    cursor: 'pointer',
                    borderRadius: '6px',
                    border: 'none'
                  }}
                />
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    background: slide.textColor,
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* Tipografía */}
      <div className="mb-3">
        <h6 className="text-white fw-semibold mb-2">🔤 Tipografía</h6>
        <Form.Select
          size="sm"
          value={slide.fontFamily}
          onChange={(e) => onChange({ fontFamily: e.target.value })}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            fontSize: '0.8rem'
          }}
        >
          <option value="Montserrat">Montserrat</option>
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Poppins">Poppins</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
        </Form.Select>
      </div>

      {/* Reset */}
      <div className="text-center">
        <Button
          variant="outline-light"
          size="sm"
          onClick={() => onChange({
            backgroundColor: 'linear-gradient(135deg, #0f0c29, #24243e, #302b63)',
            textColor: '#ffffff',
            fontFamily: 'Montserrat'
          })}
          style={{ 
            borderRadius: '8px', 
            fontSize: '0.7rem',
            padding: '0.3rem 0.8rem'
          }}
        >
          🔄 Reset
        </Button>
      </div>

      <style jsx>{`
        .color-master-panel {
          color: white;
        }
        
        .color-master-panel .form-select option {
          background: #2c3e50;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ColorMasterPanel;
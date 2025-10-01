/**
 * Panel de Asistente IA - Integración del sistema existente
 */

'use client';

import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { Presentation, Slide } from '../types/orbital';

interface AIAssistantPanelProps {
  presentation: Presentation;
  onSlideGenerated: (slides: Slide[]) => void;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  presentation,
  onSlideGenerated
}) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlides = async () => {
    if (!topic.trim()) {
      setError('Por favor ingresa un tema');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Simular generación IA (aquí conectarías con el sistema real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newSlides: Slide[] = [
        {
          id: `slide_${Date.now()}_1`,
          title: `${topic}: Introducción`,
          subtitle: 'Conceptos fundamentales',
          content: [
            'Definición y contexto',
            'Importancia actual',
            'Objetivos principales'
          ],
          layout: 'title',
          order: presentation.slides.length,
          backgroundType: 'gradient',
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
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
        },
        {
          id: `slide_${Date.now()}_2`,
          title: `Desarrollo de ${topic}`,
          subtitle: 'Puntos clave y estrategias',
          content: [
            'Metodología propuesta',
            'Casos de éxito',
            'Beneficios esperados'
          ],
          layout: 'content',
          order: presentation.slides.length + 1,
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
        }
      ];

      onSlideGenerated(newSlides);
      setTopic('');
      
    } catch (err) {
      setError('Error al generar slides. Intenta nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-assistant-panel">
      <style jsx>{`
        .ai-assistant-panel {
          color: white;
        }
        
        .ai-status {
          background: rgba(0, 246, 255, 0.1);
          border: 1px solid rgba(0, 246, 255, 0.3);
          border-radius: 8px;
          padding: 8px 12px;
          margin-bottom: 12px;
          font-size: 0.8rem;
        }
        
        .suggestion-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 6px 10px;
          margin-bottom: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .suggestion-item:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Estado del IA */}
      <div className="ai-status">
        <div className="d-flex align-items-center gap-2">
          <span>🤖</span>
          <span>IA Assistant</span>
          <span className="ms-auto">
            <span className="badge bg-success">Online</span>
          </span>
        </div>
      </div>

      {/* Generación de contenido */}
      <div className="mb-3">
        <h6 className="text-white fw-semibold mb-2">💭 Generar Slides</h6>
        
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: Inteligencia Artificial, Marketing Digital..."
            disabled={isGenerating}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontSize: '0.9rem'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                generateSlides();
              }
            }}
          />
        </Form.Group>

        <Button
          variant="primary"
          size="sm"
          onClick={generateSlides}
          disabled={isGenerating || !topic.trim()}
          className="w-100"
          style={{ borderRadius: '8px' }}
        >
          {isGenerating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Generando...
            </>
          ) : (
            '✨ Generar Slides'
          )}
        </Button>

        {error && (
          <Alert variant="danger" className="mt-2 p-2" style={{ fontSize: '0.8rem' }}>
            {error}
          </Alert>
        )}
      </div>

      {/* Sugerencias rápidas */}
      <div className="mb-3">
        <h6 className="text-white fw-semibold mb-2">💡 Sugerencias</h6>
        <div>
          {[
            'Presentación de producto',
            'Plan de negocios',
            'Capacitación empresarial',
            'Resultados trimestrales'
          ].map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => setTopic(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>

      {/* Agentes disponibles */}
      <div className="mb-3">
        <h6 className="text-white fw-semibold mb-2">👥 Agentes IA</h6>
        <div className="d-flex flex-wrap gap-1">
          <span className="badge bg-primary bg-opacity-20 text-primary">
            🎭 Guionista
          </span>
          <span className="badge bg-success bg-opacity-20 text-success">
            📈 SEO
          </span>
          <span className="badge bg-warning bg-opacity-20 text-warning">
            🎨 Diseño
          </span>
        </div>
        <small className="text-white-50 mt-1 d-block">
          Los agentes optimizarán automáticamente el contenido generado
        </small>
      </div>

      {/* Estadísticas */}
      <div className="text-center">
        <small className="text-white-50">
          {presentation.slides.length} slides en presentación
        </small>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
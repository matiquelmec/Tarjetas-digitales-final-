'use client';

import React, { useState, useRef } from 'react';
import { Card, Button, Row, Col, Form, Badge, Alert, ProgressBar } from 'react-bootstrap';
import { useMicroAnimations } from '@/hooks/useMicroAnimations';

interface MicroAnimationsShowcaseProps {
  showControls?: boolean;
}

export default function MicroAnimationsShowcase({ showControls = true }: MicroAnimationsShowcaseProps) {
  const [intensity, setIntensity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLButtonElement>(null);

  const {
    animationCSS,
    isEnabled,
    stats,
    controls,
    classes
  } = useMicroAnimations({
    enabled: true,
    respectReducedMotion: true,
    globalIntensity: intensity,
    enabledTriggers: ['hover', 'click', 'focus', 'success', 'error', 'loading', 'idle']
  });

  // Handle success demo
  const handleSuccessDemo = () => {
    setShowSuccess(true);
    if (successRef.current) {
      controls.triggerSuccess(successRef.current);
    }
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle error demo
  const handleErrorDemo = () => {
    setShowError(true);
    if (errorRef.current) {
      controls.triggerError(errorRef.current);
    }
    setTimeout(() => setShowError(false), 3000);
  };

  // Handle loading demo
  const handleLoadingDemo = () => {
    setIsLoading(true);
    setProgress(0);
    
    if (loadingRef.current) {
      controls.triggerLoading(loadingRef.current);
    }

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          if (loadingRef.current) {
            controls.stopAnimations(loadingRef.current);
            controls.triggerComplete(loadingRef.current);
          }
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="micro-animations-showcase">
      <style dangerouslySetInnerHTML={{ __html: animationCSS }} />
      <style jsx>{`
        .micro-animations-showcase {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          min-height: 100vh;
          padding: 2rem;
        }
        
        .showcase-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .showcase-header {
          text-align: center;
          margin-bottom: 3rem;
          color: white;
        }
        
        .showcase-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .showcase-subtitle {
          font-size: 1.3rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }
        
        .demo-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          margin-bottom: 2rem;
          overflow: hidden;
        }
        
        .demo-header {
          background: rgba(0, 246, 255, 0.1);
          color: white;
          padding: 1.5rem;
          font-weight: 700;
          font-size: 1.2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .demo-content {
          padding: 2rem;
        }
        
        .demo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .demo-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          color: white;
        }
        
        .demo-item h4 {
          color: #00f6ff;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        
        .demo-item p {
          opacity: 0.8;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        
        .demo-button {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          width: 100%;
          margin-bottom: 0.5rem;
        }
        
        .demo-input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          padding: 0.8rem;
          color: white;
          width: 100%;
          margin-bottom: 1rem;
        }
        
        .demo-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .demo-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .controls-panel {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 2rem;
          margin-top: 2rem;
        }
        
        .control-group {
          margin-bottom: 2rem;
        }
        
        .control-title {
          color: #00f6ff;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .stat-item {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          color: white;
        }
        
        .stat-value {
          color: #00f6ff;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .stat-label {
          opacity: 0.8;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        
        .feedback-demo {
          margin-top: 1rem;
        }
        
        .progress-demo {
          margin-top: 1rem;
        }
        
        @media (max-width: 768px) {
          .showcase-title {
            font-size: 2.2rem;
          }
          
          .demo-grid {
            grid-template-columns: 1fr;
          }
          
          .micro-animations-showcase {
            padding: 1rem;
          }
        }
      `}</style>

      <div className="showcase-container">
        {/* Header */}
        <div className="showcase-header">
          <h1 className="showcase-title">✨ Micro-animaciones de Feedback</h1>
          <p className="showcase-subtitle">
            Animaciones sutiles que mejoran la experiencia del usuario con feedback intuitivo
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Badge bg={isEnabled ? 'success' : 'secondary'}>
              {isEnabled ? 'Habilitado' : 'Deshabilitado'}
            </Badge>
            <Badge bg="info">{stats.totalAnimations} Animaciones</Badge>
            <Badge bg="warning">{stats.activeAnimations} Activas</Badge>
          </div>
        </div>

        {/* Button Interactions */}
        <div className="demo-section">
          <div className="demo-header">
            🖱️ Interacciones de Botones
          </div>
          <div className="demo-content">
            <div className="demo-grid">
              <div className="demo-item">
                <h4>Hover Lift</h4>
                <p>Efecto de elevación suave al pasar el mouse</p>
                <button className={`demo-button ${classes.hoverLift}`}>
                  Hover sobre mí
                </button>
              </div>
              
              <div className="demo-item">
                <h4>Click Bounce</h4>
                <p>Rebote satisfactorio al hacer click</p>
                <button className={`demo-button ${classes.clickBounce}`}>
                  Click aquí
                </button>
              </div>
              
              <div className="demo-item">
                <h4>Enhanced Hover</h4>
                <p>Mejora general de interacción</p>
                <button className={`demo-button ${classes.enhanceHover}`}>
                  Mejorado
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Input Interactions */}
        <div className="demo-section">
          <div className="demo-header">
            📝 Interacciones de Formularios
          </div>
          <div className="demo-content">
            <div className="demo-grid">
              <div className="demo-item">
                <h4>Focus Glow</h4>
                <p>Resplandor al enfocarse en el campo</p>
                <input 
                  type="text" 
                  className={`demo-input ${classes.focusGlow}`}
                  placeholder="Escribe aquí..."
                />
              </div>
              
              <div className="demo-item">
                <h4>Enhanced Focus</h4>
                <p>Mejora de accesibilidad en focus</p>
                <input 
                  type="email" 
                  className={`demo-input ${classes.enhanceFocus}`}
                  placeholder="email@ejemplo.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Animations */}
        <div className="demo-section">
          <div className="demo-header">
            💫 Animaciones de Feedback
          </div>
          <div className="demo-content">
            <div className="demo-grid">
              <div className="demo-item">
                <h4>Feedback de Éxito</h4>
                <p>Animación de confirmación positiva</p>
                <Button 
                  className="demo-button"
                  onClick={handleSuccessDemo}
                >
                  Triggear Éxito
                </Button>
                <div className="feedback-demo">
                  {showSuccess && (
                    <div ref={successRef} className="animate-success">
                      <Alert variant="success" style={{ background: 'rgba(40, 167, 69, 0.2)', border: '1px solid #28a745' }}>
                        ✅ ¡Operación exitosa!
                      </Alert>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="demo-item">
                <h4>Feedback de Error</h4>
                <p>Animación de error con shake</p>
                <Button 
                  className="demo-button"
                  onClick={handleErrorDemo}
                >
                  Triggear Error
                </Button>
                <div className="feedback-demo">
                  {showError && (
                    <div ref={errorRef} className="animate-error">
                      <Alert variant="danger" style={{ background: 'rgba(220, 53, 69, 0.2)', border: '1px solid #dc3545' }}>
                        ❌ Error en la operación
                      </Alert>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="demo-item">
                <h4>Estado de Carga</h4>
                <p>Animación de progreso con pulse</p>
                <Button 
                  ref={loadingRef}
                  className="demo-button"
                  onClick={handleLoadingDemo}
                  disabled={isLoading}
                >
                  {isLoading ? '⏳ Cargando...' : 'Iniciar Carga'}
                </Button>
                <div className="progress-demo">
                  {isLoading && (
                    <ProgressBar 
                      now={progress} 
                      className="animate-progress-fill"
                      style={{ marginTop: '1rem' }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Interactions */}
        <div className="demo-section">
          <div className="demo-header">
            🃏 Interacciones de Tarjetas
          </div>
          <div className="demo-content">
            <div className="demo-grid">
              <div className={`demo-card ${classes.cardHover}`}>
                <h4>Card Hover Float</h4>
                <p>Efecto flotante con perspectiva 3D</p>
                <small>Pasa el mouse por encima</small>
              </div>
              
              <div className={`demo-card ${classes.idleBreathe}`}>
                <h4>Idle Breathing</h4>
                <p>Respiración sutil en estado inactivo</p>
                <small>Observa la animación automática</small>
              </div>
              
              <div className={`demo-card ${classes.enhanceClick}`}>
                <h4>Click Enhanced</h4>
                <p>Feedback mejorado al hacer click</p>
                <small>Haz click en la tarjeta</small>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="controls-panel">
            <Row>
              <Col md={6}>
                <div className="control-group">
                  <h3 className="control-title">🎛️ Controles</h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                      Intensidad Global: {intensity.toFixed(1)}x
                    </label>
                    <Form.Range
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={intensity}
                      onChange={(e) => {
                        const newIntensity = parseFloat(e.target.value);
                        setIntensity(newIntensity);
                        controls.updateIntensity(newIntensity);
                      }}
                    />
                  </div>
                </div>
              </Col>

              <Col md={6}>
                <div className="control-group">
                  <h3 className="control-title">📊 Estadísticas</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-value">{stats.totalAnimations}</div>
                      <div className="stat-label">Total</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{stats.activeAnimations}</div>
                      <div className="stat-label">Activas</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{stats.enabledAnimations}</div>
                      <div className="stat-label">Habilitadas</div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* Info Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          color: 'rgba(255, 255, 255, 0.7)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p>
            💡 <strong>Tip:</strong> Estas micro-animaciones respetan la configuración de "prefers-reduced-motion" 
            del sistema para mejor accesibilidad
          </p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
            Sistema optimizado para 60fps • Compatible con todos los navegadores modernos
          </p>
        </div>
      </div>
    </div>
  );
}
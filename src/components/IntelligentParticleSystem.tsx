'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import { useIntelligentParticles } from '@/hooks/useIntelligentParticles';

interface IntelligentParticleSystemProps {
  enabled?: boolean;
  type?: 'floating' | 'constellation' | 'professional' | 'creative';
  count?: number;
  showControls?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function IntelligentParticleSystem({
  enabled = true,
  type = 'floating',
  count = 30,
  showControls = false,
  style,
  className = ''
}: IntelligentParticleSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Physics configuration state
  const [physicsConfig, setPhysicsConfig] = useState({
    gravity: 0.1,
    friction: 0.5,
    boundary: 'bounce' as 'wrap' | 'bounce' | 'absorb',
    mouseInfluence: 1.0,
    interParticleForces: true,
    trailLength: 5,
    enableCollisions: true,
    windStrength: 0.2
  });

  const [particleType, setParticleType] = useState<'floating' | 'constellation' | 'professional' | 'creative'>(type);
  const [particleCount, setParticleCount] = useState(count);

  const {
    particles,
    canvasRef,
    stats,
    addMagneticPoint,
    addWindForce,
    reset
  } = useIntelligentParticles({
    enabled,
    type: particleType,
    count: particleCount,
    physics: physicsConfig,
    containerRef
  });

  // Handle canvas setup
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const bounds = container.getBoundingClientRect();

    canvas.width = bounds.width;
    canvas.height = bounds.height;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
  }, [canvasRef, containerRef]);

  // Handle click to add magnetic point
  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    addMagneticPoint(x, y, 50);

    // Add visual feedback
    const feedback = document.createElement('div');
    feedback.style.position = 'absolute';
    feedback.style.left = `${x - 10}px`;
    feedback.style.top = `${y - 10}px`;
    feedback.style.width = '20px';
    feedback.style.height = '20px';
    feedback.style.borderRadius = '50%';
    feedback.style.background = 'rgba(0, 246, 255, 0.6)';
    feedback.style.pointerEvents = 'none';
    feedback.style.zIndex = '2';
    feedback.style.animation = 'magneticPulse 2s ease-out forwards';
    
    containerRef.current.appendChild(feedback);
    
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 2000);
  };

  return (
    <div className={`intelligent-particle-system ${className}`} style={style}>
      <style jsx>{`
        @keyframes magneticPulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(3);
            opacity: 0.3;
          }
          100% {
            transform: scale(5);
            opacity: 0;
          }
        }
        
        .particle-container {
          position: relative;
          overflow: hidden;
          cursor: crosshair;
          border: 2px solid rgba(0, 246, 255, 0.3);
          border-radius: 15px;
          background: linear-gradient(135deg, rgba(0, 20, 40, 0.9), rgba(0, 10, 30, 0.9));
          box-shadow: 0 8px 32px rgba(0, 246, 255, 0.2);
        }
        
        .stats-overlay {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: #00f6ff;
          padding: 8px 12px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 0.8rem;
          z-index: 3;
          backdrop-filter: blur(5px);
        }
        
        .controls-panel {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          border: 1px solid rgba(0, 246, 255, 0.2);
        }
        
        .control-group {
          margin-bottom: 1rem;
        }
        
        .control-label {
          color: #ffffff;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .action-buttons {
          margin-top: 1rem;
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .action-button {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 246, 255, 0.4);
        }
        
        .type-selector {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .type-button {
          padding: 0.4rem 0.8rem;
          border: 2px solid rgba(0, 246, 255, 0.3);
          background: transparent;
          color: #00f6ff;
          border-radius: 6px;
          font-size: 0.8rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .type-button.active {
          background: rgba(0, 246, 255, 0.2);
          border-color: #00f6ff;
        }
        
        .type-button:hover {
          background: rgba(0, 246, 255, 0.1);
        }
      `}</style>

      <div 
        ref={containerRef}
        className="particle-container"
        style={{ 
          minHeight: '400px',
          height: showControls ? '300px' : '400px',
          position: 'relative'
        }}
        onClick={handleContainerClick}
      >
        <canvas ref={canvasRef} />
        
        {/* Stats Overlay */}
        <div className="stats-overlay">
          <div>Particles: {stats.particleCount}</div>
          <div>Forces: {stats.forces}</div>
          <div>Avg Velocity: {stats.averageVelocity.toFixed(2)}</div>
          <div>Avg Life: {stats.averageLife.toFixed(2)}</div>
        </div>

        {/* Instructions */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.8rem',
          zIndex: 3
        }}>
          Click to add magnetic points • Move mouse to influence particles
        </div>
      </div>

      {/* Controls Panel */}
      {showControls && (
        <div className="controls-panel">
          <Row>
            <Col md={6}>
              <div className="control-group">
                <div className="control-label">Particle Type</div>
                <div className="type-selector">
                  {(['floating', 'constellation', 'professional', 'creative'] as const).map(t => (
                    <button
                      key={t}
                      className={`type-button ${particleType === t ? 'active' : ''}`}
                      onClick={() => setParticleType(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-group">
                <div className="control-label">Particle Count: {particleCount}</div>
                <Form.Range
                  min="10"
                  max="100"
                  value={particleCount}
                  onChange={(e) => setParticleCount(parseInt(e.target.value))}
                />
              </div>

              <div className="control-group">
                <div className="control-label">Gravity: {physicsConfig.gravity.toFixed(2)}</div>
                <Form.Range
                  min="0"
                  max="1"
                  step="0.1"
                  value={physicsConfig.gravity}
                  onChange={(e) => setPhysicsConfig(prev => ({ ...prev, gravity: parseFloat(e.target.value) }))}
                />
              </div>
            </Col>

            <Col md={6}>
              <div className="control-group">
                <div className="control-label">Mouse Influence: {physicsConfig.mouseInfluence.toFixed(1)}</div>
                <Form.Range
                  min="0"
                  max="2"
                  step="0.1"
                  value={physicsConfig.mouseInfluence}
                  onChange={(e) => setPhysicsConfig(prev => ({ ...prev, mouseInfluence: parseFloat(e.target.value) }))}
                />
              </div>

              <div className="control-group">
                <div className="control-label">Wind Strength: {physicsConfig.windStrength.toFixed(2)}</div>
                <Form.Range
                  min="0"
                  max="1"
                  step="0.1"
                  value={physicsConfig.windStrength}
                  onChange={(e) => setPhysicsConfig(prev => ({ ...prev, windStrength: parseFloat(e.target.value) }))}
                />
              </div>

              <div className="control-group">
                <div className="control-label">Trail Length: {physicsConfig.trailLength}</div>
                <Form.Range
                  min="0"
                  max="15"
                  value={physicsConfig.trailLength}
                  onChange={(e) => setPhysicsConfig(prev => ({ ...prev, trailLength: parseInt(e.target.value) }))}
                />
              </div>
            </Col>
          </Row>

          <div className="action-buttons">
            <button className="action-button" onClick={reset}>
              🔄 Reset
            </button>
            <button className="action-button" onClick={() => addWindForce(0, 1)}>
              💨 Wind Right
            </button>
            <button className="action-button" onClick={() => addWindForce(Math.PI, 1)}>
              💨 Wind Left
            </button>
            <button className="action-button" onClick={() => addWindForce(Math.PI / 2, 1)}>
              💨 Wind Down
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
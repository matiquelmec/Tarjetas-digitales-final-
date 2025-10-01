'use client';

import React from 'react';
import { Card } from 'react-bootstrap';

interface HologramPreviewProps {
  children: React.ReactNode;
  mode?: 'basic' | 'enhanced' | 'full';
  showBeam?: boolean;
  showParticles?: boolean;
  showScanlines?: boolean;
  enable3D?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
  pageBackgroundColor?: string;
  height?: string; // Nueva prop para controlar altura
}

export default function HologramPreview({
  children,
  mode = 'basic', // Cambiado a basic para menos efectos
  showBeam = false, // Desactivar efectos por defecto
  showParticles = false, // Sin partículas por defecto
  showScanlines = false,
  enable3D = false, // Sin efectos 3D por defecto
  title = '👁️ Vista Previa',
  subtitle = 'Vista en tiempo real',
  className = '',
  pageBackgroundColor = '#1a1a2e', // Usar fondo moderno consistente
  height = '85vh' // Default height, puede ser sobrescrito
}: HologramPreviewProps) {
  
  // Debug para rastrear cambios de color de fondo
  React.useEffect(() => {
    console.log('🔮 HologramPreview - Color de fondo actualizado:', pageBackgroundColor);
  }, [pageBackgroundColor]);
  
  // Generate hologram classes based on props
  const getHologramClasses = () => {
    const classes = ['hologram-container'];
    
    if (mode === 'enhanced' || mode === 'full') {
      classes.push('hologram-glow');
    }
    
    if (enable3D) {
      classes.push('hologram-float');
    }
    
    if (showScanlines) {
      classes.push('hologram-scanlines');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };

  // Generate particles
  const renderParticles = () => {
    if (!showParticles) return null;
    
    const particles = [];
    const particleCount = mode === 'full' ? 8 : 5;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(
        <div
          key={`particle-${i}`}
          className="hologram-particle"
          style={{
            animationDelay: `${i * 0.5}s`,
            left: `${10 + (i * 15)}%`,
            animationDuration: `${3 + (i * 0.5)}s`
          }}
        />
      );
    }
    
    return <div className="hologram-particles">{particles}</div>;
  };

  return (
    <div style={{ position: 'sticky', top: '20px', height: height }}>
      <Card
        className={`glass-card text-white ${!title ? 'no-title-hologram' : ''}`}
        style={{
          backgroundColor: 'transparent',
          background: 'transparent',
          border: 'none',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Card.Header className="text-center" style={{
          background: 'linear-gradient(135deg, rgba(0, 246, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%) !important',
          borderBottom: 'none',
          paddingBottom: '0',
          marginBottom: '0'
        }}>
          <h6 className="mb-0" style={{
            textShadow: '0 0 10px rgba(0, 246, 255, 0.8), 0 0 20px rgba(0, 246, 255, 0.6)',
            animation: 'hologramTitlePulse 3s ease-in-out infinite'
          }}>{title}</h6>
          <small className="text-light">{subtitle}</small>
        </Card.Header>
        <Card.Body
          className="preview-body p-0"
          style={{
            flex: 1,
            position: 'relative',
            scrollBehavior: 'smooth',
            backgroundColor: 'transparent', // Dejar que BusinessCard maneje el fondo
            display: 'flex',
            flexDirection: 'column',
            transition: 'background-color 0.3s ease',
            borderRadius: '0 0 12px 12px',
            overflow: 'hidden'
          }}
        >
          <div className="preview-container" style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            margin: '0',
            flex: 1,
            width: '100%',
            // Dejar que BusinessCard maneje su propio fondo
            backgroundColor: 'transparent',
            overflow: 'visible'
          }}>
            {showScanlines && (
              <div className="demo-label" style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #00f6ff, #0072ff)',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(0, 246, 255, 0.3)',
                zIndex: 10,
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                🚀 VISTA FINAL - PASO 4
              </div>
            )}
            {children}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
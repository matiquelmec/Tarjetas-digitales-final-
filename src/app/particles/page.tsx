'use client';

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';
import IntelligentParticleSystem from '@/components/IntelligentParticleSystem';

export default function ParticlesPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        body {
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
          background-size: 400% 400%;
          animation: particleGradient 15s ease infinite;
          min-height: 100vh;
          overflow-x: hidden;
        }
        
        @keyframes particleGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .particles-hero {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 3rem 2rem;
          margin-bottom: 3rem;
          border: 1px solid rgba(0, 246, 255, 0.3);
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 246, 255, 0.15);
        }
        
        .particles-title {
          color: #ffffff;
          font-size: 3rem;
          font-weight: 800;
          text-shadow: 0 0 20px rgba(0, 246, 255, 0.6);
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .particles-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.4rem;
          margin-bottom: 2rem;
          font-weight: 500;
        }
        
        .demo-grid {
          margin-top: 3rem;
        }
        
        .demo-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 246, 255, 0.2);
          border-radius: 15px;
          margin-bottom: 2rem;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .demo-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 246, 255, 0.2);
          border-color: rgba(0, 246, 255, 0.4);
        }
        
        .demo-card-header {
          background: rgba(0, 246, 255, 0.1);
          color: #ffffff;
          padding: 1.5rem;
          font-weight: 700;
          font-size: 1.2rem;
          border-bottom: 1px solid rgba(0, 246, 255, 0.2);
        }
        
        .demo-card-body {
          padding: 0;
        }
        
        .tech-specs {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          padding: 1.5rem;
          margin-top: 2rem;
          border: 1px solid rgba(0, 246, 255, 0.1);
        }
        
        .tech-title {
          color: #00f6ff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .tech-list {
          color: rgba(255, 255, 255, 0.8);
          list-style: none;
          padding: 0;
        }
        
        .tech-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .tech-list li:last-child {
          border-bottom: none;
        }
        
        .tech-list strong {
          color: #00f6ff;
        }
        
        .back-button {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          color: white;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 246, 255, 0.4);
          color: white;
          text-decoration: none;
        }
        
        @media (max-width: 768px) {
          .particles-title {
            font-size: 2.2rem;
          }
          
          .particles-subtitle {
            font-size: 1.2rem;
          }
          
          .particles-hero {
            padding: 2rem 1.5rem;
          }
          
          .demo-card-header {
            font-size: 1.1rem;
            padding: 1.2rem;
          }
        }
      `}} />

      <Container className="py-4">
        {/* Hero Section */}
        <div className="particles-hero">
          <h1 className="particles-title">
            🌌 Sistema de Partículas Inteligentes
          </h1>
          <p className="particles-subtitle">
            Física avanzada en tiempo real con interacciones magnéticas y gravitacionales
          </p>
          <Link href="/" className="back-button">
            ← Regresar al Inicio
          </Link>
        </div>

        {/* Demo Grid */}
        <div className="demo-grid">
          <Row>
            {/* Interactive Demo */}
            <Col lg={8}>
              <Card className="demo-card">
                <Card.Header className="demo-card-header">
                  🎮 Demo Interactivo - Controla la Física
                </Card.Header>
                <Card.Body className="demo-card-body">
                  <IntelligentParticleSystem
                    enabled={true}
                    type="floating"
                    count={40}
                    showControls={true}
                  />
                </Card.Body>
              </Card>
            </Col>

            {/* Technical Specifications */}
            <Col lg={4}>
              <div className="tech-specs">
                <h3 className="tech-title">🔬 Especificaciones Técnicas</h3>
                <ul className="tech-list">
                  <li><strong>Motor de Física:</strong> 60fps en tiempo real</li>
                  <li><strong>Fuerzas:</strong> Gravedad, fricción, magnetismo</li>
                  <li><strong>Interacciones:</strong> Mouse tracking inteligente</li>
                  <li><strong>Colisiones:</strong> Sistema de repulsión avanzado</li>
                  <li><strong>Trails:</strong> Estelas dinámicas configurable</li>
                  <li><strong>Tipos:</strong> 4 sistemas de partículas únicos</li>
                  <li><strong>Boundaries:</strong> Wrap, bounce, absorb</li>
                  <li><strong>Performance:</strong> Optimizado para móvil</li>
                </ul>
              </div>

              <div className="tech-specs">
                <h3 className="tech-title">🎨 Tipos de Partículas</h3>
                <ul className="tech-list">
                  <li><strong>Floating:</strong> Movimiento suave con glow</li>
                  <li><strong>Constellation:</strong> Estrellas con conexiones</li>
                  <li><strong>Professional:</strong> Cuadrados minimalistas</li>
                  <li><strong>Creative:</strong> Triángulos dinámicos</li>
                </ul>
              </div>
            </Col>
          </Row>

          {/* Additional Demos */}
          <Row className="mt-4">
            <Col md={6}>
              <Card className="demo-card">
                <Card.Header className="demo-card-header">
                  ⭐ Constellation Mode
                </Card.Header>
                <Card.Body className="demo-card-body">
                  <IntelligentParticleSystem
                    enabled={true}
                    type="constellation"
                    count={25}
                    showControls={false}
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="demo-card">
                <Card.Header className="demo-card-header">
                  💼 Professional Mode
                </Card.Header>
                <Card.Body className="demo-card-body">
                  <IntelligentParticleSystem
                    enabled={true}
                    type="professional"
                    count={20}
                    showControls={false}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={6}>
              <Card className="demo-card">
                <Card.Header className="demo-card-header">
                  🎨 Creative Mode
                </Card.Header>
                <Card.Body className="demo-card-body">
                  <IntelligentParticleSystem
                    enabled={true}
                    type="creative"
                    count={35}
                    showControls={false}
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="demo-card">
                <Card.Header className="demo-card-header">
                  🌊 High Density Floating
                </Card.Header>
                <Card.Body className="demo-card-body">
                  <IntelligentParticleSystem
                    enabled={true}
                    type="floating"
                    count={60}
                    showControls={false}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '4rem',
          padding: '2rem',
          color: 'rgba(255, 255, 255, 0.7)',
          borderTop: '1px solid rgba(0, 246, 255, 0.2)'
        }}>
          <p>Sistema de partículas inteligentes con física avanzada</p>
          <p style={{ fontSize: '0.9rem' }}>
            Desarrollado con TypeScript + Canvas 2D + RequestAnimationFrame
          </p>
        </div>
      </Container>
    </>
  );
}
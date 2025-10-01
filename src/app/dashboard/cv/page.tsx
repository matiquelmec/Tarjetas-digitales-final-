'use client';

import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import IndiNavbar from '@/components/layout/IndiNavbar';

export default function CVPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        body {
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          min-height: 100vh;
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .intergalactic-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(0, 246, 255, 0.3);
          border-radius: 24px;
          box-shadow: 
            0 8px 32px rgba(0, 246, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .intergalactic-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #00f6ff, transparent, #8e2de2, transparent);
          background-size: 200% 200%;
          border-radius: inherit;
          z-index: -1;
          opacity: 0.6;
          filter: blur(8px);
          animation: borderGlow 3s linear infinite;
        }
        
        @keyframes borderGlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        
        .title-glow {
          background: linear-gradient(135deg, #ffaa00, #ff8800, #ff6600);
          background-size: 200% 200%;
          animation: titleShimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
          text-shadow: 0 0 20px rgba(255, 170, 0, 0.5);
        }
        
        @keyframes titleShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .alien-btn {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          padding: 12px 32px;
          border-radius: 20px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(0, 246, 255, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .alien-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 246, 255, 0.5);
          background: linear-gradient(135deg, #00d4e7, #0056cc);
          color: white;
        }
        
        .alien-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }
        
        .alien-btn:hover::before {
          left: 100%;
        }
        
        .floating-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }
        
        .particle {
          position: absolute;
          font-size: 1.5rem;
          animation: particleFloat 8s ease-in-out infinite;
          opacity: 0.4;
        }
        
        .particle-1 { top: 15%; left: 15%; animation-delay: 0s; }
        .particle-2 { top: 25%; right: 20%; animation-delay: -2s; }
        .particle-3 { bottom: 25%; left: 25%; animation-delay: -4s; }
        .particle-4 { bottom: 35%; right: 15%; animation-delay: -6s; }
        
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          25% { transform: translateY(-20px) rotate(90deg); opacity: 0.8; }
          50% { transform: translateY(-10px) rotate(180deg); opacity: 1; }
          75% { transform: translateY(-25px) rotate(270deg); opacity: 0.6; }
        }
        
        .subtitle-alien {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.2rem;
          line-height: 1.6;
        }
      `}} />
      
      {/* Navbar con Indi */}
      <IndiNavbar variant="transparent" position="relative" showActions={true} />
      
      <Container fluid className="py-4">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={8} xl={6}>
            <Card className="intergalactic-card text-center p-5 text-white border-0">
              <div className="floating-particles">
                <div className="particle particle-1">📄</div>
                <div className="particle particle-2">💼</div>
                <div className="particle particle-3">⚡</div>
                <div className="particle particle-4">🌟</div>
              </div>
              
              <Card.Body className="position-relative" style={{ zIndex: 2 }}>
                <h1 className="title-glow mb-4" style={{ fontSize: '3rem' }}>
                  📄 CVs Profesionales
                </h1>
                
                <p className="subtitle-alien mb-4">
                  Nuestros algoritmos alienígenas están analizando millones de CVs terrestres para crear la fórmula perfecta. 
                  <br />
                  <strong>¡Pronto tu CV será optimizado con tecnología de otro mundo!</strong>
                </p>
                
                <div className="mb-4">
                  <small className="text-white-50">
                    🔧 IA en calibración • Análisis ATS • Optimización intergaláctica
                  </small>
                </div>
                
                <Button 
                  className="alien-btn"
                  href="/dashboard"
                >
                  <span style={{ marginRight: '8px' }}>🏢</span>
                  Volver al Dashboard
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

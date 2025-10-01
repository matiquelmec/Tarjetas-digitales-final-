'use client';

import dynamic from 'next/dynamic';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { DEFAULT_CARD_DATA } from '@/lib/constants/defaultCardData';

const BusinessCard = dynamic(() => import('@/features/digital-card/components/BusinessCard'), {
  loading: () => <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
    <div className="hologram-loader">
      <div className="hologram-spinner"></div>
      <span className="loader-text">Materializando holograma...</span>
    </div>
  </div>,
  ssr: false
});

export default function DemoPage() {
  // Usar datos consistentes para demo
  const demoCardData = {
    ...DEFAULT_CARD_DATA,
    // Activar algunos efectos para mostrar capacidades
    enableHoverEffect: true,
    enableGlassmorphism: true,
    enableSubtleAnimations: true
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        body {
          overflow-x: hidden;
        }
        
        .demo-gradient-background {
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
          background-size: 400% 400%;
          animation: simpleGradientAnimation 15s ease infinite;
          min-height: 100vh;
        }
        
        @keyframes simpleGradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        
        /* Loader simple */
        .hologram-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .hologram-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(0, 246, 255, 0.3);
          border-top: 3px solid #00f6ff;
          border-radius: 50%;
          animation: simpleSpinner 1s linear infinite;
        }
        
        @keyframes simpleSpinner {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loader-text {
          color: #00f6ff;
          font-weight: 600;
          font-size: 1rem;
        }
        
        .demo-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          margin-bottom: 2.5rem;
          border: 1px solid rgba(0, 246, 255, 0.3);
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 246, 255, 0.15);
        }
        
        .demo-title {
          color: #ffffff;
          font-size: 2.5rem;
          font-weight: 800;
          text-shadow: 0 0 20px rgba(0, 246, 255, 0.6);
          margin-bottom: 1.5rem;
        }
        
        .demo-subtitle {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.3rem;
          margin-bottom: 2rem;
          font-weight: 500;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .demo-card-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 65vh;
          padding: 2.5rem 0;
        }
        
        .card-wrapper {
          max-width: 480px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          justify-content: center;
        }
        
        .demo-cta {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(0, 246, 255, 0.3);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          text-align: center;
          margin-top: 3rem;
          box-shadow: 0 8px 32px rgba(0, 246, 255, 0.15);
        }
        
        .demo-btn-create {
          background: linear-gradient(135deg, #00D4FF, #006994);
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 212, 255, 0.4);
          margin: 0.5rem;
        }
        
        .demo-btn-create:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 12px 48px rgba(0, 212, 255, 0.6);
          background: linear-gradient(135deg, #00B8E6, #005580);
        }
        
        .demo-btn-back {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 0.75rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          margin: 0.5rem;
        }
        
        .demo-btn-back:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }
        
        .demo-badge {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(0, 246, 255, 0.9);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 246, 255, 0.3);
        }
        
        @media (max-width: 768px) {
          .demo-header {
            padding: 2rem 1.5rem;
            margin-bottom: 2rem;
          }
          
          .demo-title {
            font-size: 2rem;
            line-height: 1.2;
          }
          
          .demo-subtitle {
            font-size: 1.1rem;
            line-height: 1.4;
          }
          
          .demo-card-container {
            padding: 2rem 0;
            min-height: 60vh;
          }
          
          .card-wrapper {
            max-width: 90% !important;
          }
          
          .demo-cta {
            padding: 2rem 1.5rem;
            margin-top: 3rem;
          }
          
          .demo-cta h3 {
            font-size: 1.6rem !important;
            line-height: 1.3 !important;
          }
          
          .demo-cta p {
            font-size: 1rem !important;
            line-height: 1.5 !important;
          }
          
          .demo-btn-create {
            font-size: 0.95rem;
            padding: 1rem 2rem;
            width: 100%;
            max-width: 280px;
          }
          
          .demo-btn-back {
            font-size: 0.9rem;
            padding: 0.875rem 1.5rem;
            width: 100%;
            max-width: 250px;
          }
          
          .demo-badge {
            top: 15px;
            right: 15px;
            font-size: 0.75rem;
            padding: 0.5rem 1rem;
          }
          
        }
        
        @media (max-width: 576px) {
          .demo-header {
            padding: 1.5rem 1rem;
          }
          
          .demo-title {
            font-size: 1.7rem;
          }
          
          .demo-subtitle {
            font-size: 1rem;
          }
          
          .demo-card-container {
            padding: 1.5rem 0;
            min-height: 50vh;
          }
          
          .demo-cta {
            padding: 1.5rem 1rem;
          }
          
          .demo-cta h3 {
            font-size: 1.4rem !important;
          }
          
          .demo-cta p {
            font-size: 0.95rem !important;
          }
          
          .demo-btn-create,
          .demo-btn-back {
            font-size: 0.9rem;
            padding: 0.875rem 1.5rem;
          }
        }
      `}} />
      
      {/* Badge flotante indicando que es demo */}
      <div className="demo-badge">
        🔮 DEMO INTERGALÁCTICO
      </div>
      
      <div className="demo-gradient-background">
        <Container className="py-4">
          {/* Header */}
          <div className="demo-header">
            <h1 className="demo-title">
              🔮 Demo Intergaláctico
            </h1>
            <p className="demo-subtitle">
              Tarjeta digital profesional con tecnología alienígena premium + <span style={{ color: '#00f6ff' }}>Mouse Tracking Interactivo</span>
            </p>
          </div>
          
          {/* Tarjeta Demo */}
          <Row>
            <Col>
              <div className="demo-card-container">
                <div className="card-wrapper">
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <BusinessCard
                    key={`demo-ocean-${demoCardData.template}`}
                    name={demoCardData.name}
                    title={demoCardData.title}
                    about={demoCardData.about}
                    location={demoCardData.location}
                    whatsapp={demoCardData.whatsapp}
                    email={demoCardData.email}
                    photoUrl={demoCardData.photoUrl}
                    cardBackgroundColor={demoCardData.cardBackgroundColor}
                    cardTextColor={demoCardData.cardTextColor}
                    whatsappShareUrl={demoCardData.whatsappShareUrl}
                    appointmentLink={demoCardData.appointmentLink}
                    professionalDetails={demoCardData.professionalDetails}
                    linkedin={demoCardData.linkedin}
                    instagram={demoCardData.instagram}
                    twitter={demoCardData.twitter}
                    facebook={demoCardData.facebook}
                    website={demoCardData.website}
                    enableHoverEffect={demoCardData.enableHoverEffect}
                    enableGlassmorphism={demoCardData.enableGlassmorphism}
                    enableSubtleAnimations={demoCardData.enableSubtleAnimations}
                    enableBackgroundPatterns={demoCardData.enableBackgroundPatterns}
                    enableParticles={demoCardData.enableParticles}
                    particleType={demoCardData.particleType}
                    particleCount={demoCardData.particleCount}
                    template={demoCardData.template}
                    fontFamily={demoCardData.fontFamily}
                    buttonSecondaryColor={demoCardData.buttonSecondaryColor}
                    buttonSecondaryHoverColor={demoCardData.buttonSecondaryHoverColor}
                    buttonNormalBackgroundColor={demoCardData.buttonNormalBackgroundColor}
                    // Mouse tracking effects
                    enableMouseTracking={demoCardData.enableMouseTracking}
                    mouseTrackingSensitivity={demoCardData.mouseTrackingSensitivity}
                    enableMouseGlow={demoCardData.enableMouseGlow}
                    enableMouseTilt={demoCardData.enableMouseTilt}
                    enableMouseParticles={demoCardData.enableMouseParticles}
                  />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          
          {/* CTA Section */}
          <Row>
            <Col>
              <div className="demo-cta">
                <h3 className="text-white mb-4" style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700',
                  textShadow: '0 0 15px rgba(0, 246, 255, 0.5)'
                }}>
                  ¿Listo para Crear tu <span style={{ 
                    color: '#00f6ff'
                  }}>Tarjeta Digital</span>?
                </h3>
                <p className="text-white mb-4" style={{ 
                  fontSize: '1.1rem',
                  opacity: '0.9'
                }}>
                  Crea una tarjeta digital profesional que impresione a tus contactos
                </p>
                <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3">
                  <Link href="/create">
                    <Button className="demo-btn-create">
                      🚀 Crear Mi Tarjeta
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline-light" className="demo-btn-back">
                      ← Regresar al Inicio
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
'use client';

import { Container, Row, Col, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { usePostLoginRedirect } from '@/hooks/usePostLoginRedirect';
import IndiNavbar from '@/components/layout/IndiNavbar';
import HologramPreview from '@/components/HologramPreview';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import '@/styles/hologram-effects.css';
import { CONSISTENT_DEMO_DATA } from '@/lib/constants/defaultCardData';

// Importar BusinessCard dinámicamente para el demo
const BusinessCard = dynamic(() => import('@/features/digital-card/components/BusinessCard'), {
  loading: () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Cargando demo...</span>
      </div>
    </div>
  ),
  ssr: false
});

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);
  
  // Handle post-login redirection
  usePostLoginRedirect();

  const handleCreateCard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      sessionStorage.setItem('userIntention', 'createCard');
      // Check if we're in development mode
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SKIP_GOOGLE_AUTH === 'true') {
        router.push('/dev-login');
      } else {
        signIn('google');
      }
      return;
    }

    router.push('/create');
  };

  const handleDashboardAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      sessionStorage.setItem('userIntention', 'accessDashboard');
      // Check if we're in development mode
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SKIP_GOOGLE_AUTH === 'true') {
        router.push('/dev-login');
      } else {
        signIn('google');
      }
      return;
    }
    
    router.push('/dashboard');
  };

  // Usar datos centralizados para consistencia total
  const demoCardData = CONSISTENT_DEMO_DATA;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animated-gradient-background {
          background: ${demoCardData.pageBackgroundColor || '#0a0d1a'};
          background-size: 400% 400%;
          min-height: 100vh;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }
        
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.5);
        }
        
        /* Hero Section Minimalista */
        .hero-section {
          padding: 3rem 0 2rem;
        }
        
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1.1;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          line-height: 1.6;
          opacity: 0.95;
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Demo Section */
        .demo-section {
          padding: 2rem 0;
          position: relative;
        }
        
        /* Preview Button */
        .preview-button {
          background: linear-gradient(135deg, rgba(0, 246, 255, 0.15), rgba(0, 114, 255, 0.15));
          border: 2px solid rgba(0, 246, 255, 0.4);
          color: white;
          padding: 16px 32px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 25px rgba(0, 246, 255, 0.2);
          display: inline-flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        
        .preview-button:hover {
          background: linear-gradient(135deg, rgba(0, 246, 255, 0.25), rgba(0, 114, 255, 0.25));
          border-color: rgba(0, 246, 255, 0.6);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 35px rgba(0, 246, 255, 0.4);
          color: white;
        }
        
        .preview-button .eye-icon {
          font-size: 1.3rem;
          transition: transform 0.3s ease;
        }
        
        .preview-button:hover .eye-icon {
          transform: scale(1.2);
        }
        
        .preview-button.active {
          background: linear-gradient(135deg, rgba(0, 246, 255, 0.3), rgba(0, 114, 255, 0.3));
          border-color: rgba(0, 246, 255, 0.8);
          box-shadow: 0 0 30px rgba(0, 246, 255, 0.5);
        }
        
        .demo-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          margin: 0;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }
        
        .demo-container.show {
          opacity: 1;
          transform: translateY(0);
        }
        
        .demo-label {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: 0 4px 12px rgba(0, 246, 255, 0.3);
          z-index: 10;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.05); }
        }
        
        .demo-hint {
          text-align: center;
          margin-top: 1rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
        }
        
        /* CTA Section */
        .cta-primary {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          padding: 16px 40px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 246, 255, 0.3);
        }
        
        .cta-primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 40px rgba(0, 246, 255, 0.5);
          background: linear-gradient(135deg, #00d4e7, #0056cc);
        }
        
        .cta-secondary {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 14px 32px;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .cta-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          color: white;
        }
        
        /* Benefits Section */
        .benefits-section {
          padding: 3rem 0;
        }
        
        .benefit-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          height: 100%;
          transition: all 0.3s ease;
          text-align: center;
        }
        
        .benefit-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(0, 246, 255, 0.3);
          box-shadow: 0 12px 30px rgba(0, 246, 255, 0.2);
        }
        
        .benefit-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 4px 8px rgba(0, 246, 255, 0.3));
        }
        
        .benefit-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .benefit-description {
          font-size: 1rem;
          opacity: 0.9;
          line-height: 1.5;
        }
        
        
        /* Final CTA */
        .final-cta-section {
          padding: 3rem 0;
          text-align: center;
        }
        
        .final-cta-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(0, 246, 255, 0.2);
          border-radius: 30px;
          padding: 3rem 2rem;
          max-width: 700px;
          margin: 0 auto;
        }
        
        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .hero-section {
            padding: 2rem 0 1rem;
          }
          
          .hero-title {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
          
          .demo-container {
            padding: 1rem 0;
          }
          
          .benefit-card {
            margin-bottom: 1.5rem;
          }
          
          .cta-primary {
            width: 100%;
            max-width: 300px;
          }
        }
      `}} />

      <div className="animated-gradient-background">
        {/* Navigation */}
        <IndiNavbar variant="transparent" position="relative" showActions={true} />
        
        <Container>
          {/* Hero Section - Minimalista y Directo */}
          <section className="hero-section">
            <Row className="justify-content-center text-center">
              <Col lg={10} xl={8}>
                <h1 className="hero-title text-white mb-3">
                  ¿Sigues Perdiendo Clientes Porque
                  <span className="text-gradient"> No Te Encuentran?</span>
                </h1>
                <p className="hero-subtitle text-white mb-4">
                  Crea tu <strong>tarjeta digital interactiva con Indi</strong> y conecta directamente a través de tus redes sociales con tus clientes.
                  <br />
                  <strong>Tus clientes te contactan en minutos, no en días.</strong>
                </p>
                <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
                  <span className="badge bg-primary px-3 py-2">🔗 Conexión directa a redes</span>
                  <span className="badge bg-dark px-3 py-2">📱 Interactiva en tiempo real</span>
                  <span className="badge bg-secondary px-3 py-2">🌐 Disponible 24/7</span>
                  <span className="badge bg-info px-3 py-2">🚀 Se comparte fácilmente</span>
                </div>
              </Col>
            </Row>
          </section>

          {/* Demo Section - BOTÓN DESPLEGABLE */}
          <section className="demo-section">
            {/* Botón de Previsualización */}
            <Row className="justify-content-center mb-4">
              <Col lg={8} xl={6} className="text-center">
                <button 
                  className={`preview-button ${showDemo ? 'active' : ''}`}
                  onClick={() => setShowDemo(!showDemo)}
                >
                  <span className="eye-icon">🔥</span>
                  {showDemo ? 'Ocultar Demo Viral' : 'Demo Viral - Ya lo probaron +5,000 profesionales'}
                </button>
                <div className="mt-2">
                  <small className="text-white opacity-75">
                    {showDemo ? 'Haz clic para ocultar' : 'Haz clic en WhatsApp → Ve cómo tus clientes te contactarían'}
                  </small>
                </div>
              </Col>
            </Row>

            {/* Demo Container - Aparece/Desaparece */}
            {showDemo && (
              <Row className="justify-content-center">
                <Col lg={8} xl={6}>
                    <HologramPreview
                      mode="basic"
                      showBeam={false}
                      showParticles={false}
                      showScanlines={false}
                      enable3D={false}
                      title="💼 Vista Previa de Tarjeta"
                      subtitle="Misma tarjeta que verás en el editor"
                      pageBackgroundColor={demoCardData.pageBackgroundColor}
                      className="preview-mode"
                    >
                      <BusinessCard
                      name={demoCardData.name}
                      title={demoCardData.title}
                      about={demoCardData.about}
                      location={demoCardData.location}
                      whatsapp={demoCardData.whatsapp}
                      email={demoCardData.email}
                      photoUrl={demoCardData.photo}
                      cardBackgroundColor={demoCardData.cardBackgroundColor}
                      cardTextColor={demoCardData.cardTextColor}
                      pageBackgroundColor={demoCardData.pageBackgroundColor}
                      enableHoverEffect={demoCardData.enableHoverEffect}
                      enableGlassmorphism={demoCardData.enableGlassmorphism}
                      enableSubtleAnimations={demoCardData.enableSubtleAnimations}
                      enableBackgroundPatterns={demoCardData.enableBackgroundPatterns}
                      enableParticles={demoCardData.enableParticles}
                      particleType={demoCardData.particleType}
                      particleCount={demoCardData.particleCount}
                      particleDensity={demoCardData.particleDensity}
                      // Nuevos efectos de ambiente (matching schema.prisma)
                      enableAnimatedGradient={demoCardData.enableAnimatedGradient}
                      animatedGradientType={demoCardData.animatedGradientType}
                      animatedGradientSpeed={demoCardData.animatedGradientSpeed}
                      animatedGradientIntensity={demoCardData.animatedGradientIntensity}
                      animatedGradientOpacity={demoCardData.animatedGradientOpacity}
                      enableFloatingShapes={demoCardData.enableFloatingShapes}
                      floatingShapesType={demoCardData.floatingShapesType}
                      floatingShapesCount={demoCardData.floatingShapesCount}
                      floatingShapesSpeed={demoCardData.floatingShapesSpeed}
                      ambientIntensity={demoCardData.ambientIntensity}
                      ambientOpacity={demoCardData.ambientOpacity}
                      whatsappShareUrl="https://wa.me/56987654321"
                      appointmentLink={demoCardData.appointmentLink}
                      professionalDetails={demoCardData.professionalDetails}
                      linkedin={demoCardData.linkedin}
                      instagram={demoCardData.instagram}
                      twitter={demoCardData.twitter}
                      facebook={demoCardData.facebook}
                      website={demoCardData.website}
                      buttonSecondaryColor={demoCardData.buttonSecondaryColor}
                      buttonNormalBackgroundColor={demoCardData.buttonNormalBackgroundColor}
                      buttonSecondaryHoverColor={demoCardData.buttonSecondaryHoverColor}
                      template={demoCardData.template}
                      fontFamily={demoCardData.fontFamily}
                      isPreviewMode={true}
                    />
                    </HologramPreview>
                  <div className="demo-hint">
                    <small>👆 <strong>Haz clic en WhatsApp</strong> • Mira cómo te contactarían • Prueba el QR • Ve la diferencia vs papel</small>
                  </div>
                </Col>
              </Row>
            )}

            {/* CTA Principal */}
            <Row className="justify-content-center" style={{marginTop: showDemo ? '2rem' : '4rem'}}>
              <Col lg={8} xl={6} className="text-center">
                <Button 
                  size="lg" 
                  className="cta-primary"
                  onClick={handleCreateCard}
                >
                  🚀 CREAR MI TARJETA GRATIS
                </Button>
                <div className="mt-3">
                  <small className="text-white opacity-75">
                    Sin tarjeta de crédito • Resultados inmediatos • Cancela cuando quieras
                  </small>
                </div>
              </Col>
            </Row>
          </section>

          {/* Benefits Section - 3 Ventajas Clave */}
          <section className="benefits-section">
            <Row className="justify-content-center mb-4">
              <Col lg={10} className="text-center">
                <h2 className="text-white mb-2">Mientras Tu Competencia Entrega Papel...</h2>
                <p className="text-white opacity-75">Tú cierras deals automáticamente. Así es como los profesionales exitosos generan más leads:</p>
              </Col>
            </Row>
            
            <Row className="g-4 justify-content-center">
              <Col md={6} lg={4}>
                <div className="benefit-card">
                  <div className="benefit-icon">🎯</div>
                  <h4 className="benefit-title text-white">
                    Deja de Perseguir Clientes
                  </h4>
                  <p className="benefit-description text-white">
                    Ellos te buscan a ti. Botones directos a WhatsApp, llamadas y redes sociales. <strong>Cero fricción entre interés y contacto.</strong>
                  </p>
                </div>
              </Col>
              
              <Col md={6} lg={4}>
                <div className="benefit-card">
                  <div className="benefit-icon">📱</div>
                  <h4 className="benefit-title text-white">
                    Tu Networking Automático
                  </h4>
                  <p className="benefit-description text-white">
                    Cada persona que conoces puede reenviar tu tarjeta por WhatsApp. <strong>Tu red de contactos trabaja para ti sin que lo sepas.</strong>
                  </p>
                </div>
              </Col>
              
              <Col md={6} lg={4}>
                <div className="benefit-card">
                  <div className="benefit-icon">🔥</div>
                  <h4 className="benefit-title text-white">
                    Cierra Más Deals Mientras Duermes
                  </h4>
                  <p className="benefit-description text-white">
                    Tu tarjeta está online 24/7. <strong>Clientes potenciales te contactan a las 2 AM, los domingos, cuando tú no estás disponible.</strong>
                  </p>
                </div>
              </Col>
            </Row>
          </section>


          {/* Final CTA */}
          <section className="final-cta-section">
            <div className="final-cta-card">
              <h3 className="text-white mb-3">
                Tu Competencia Ya Está
                <span className="text-gradient"> Usando Esto</span>
              </h3>
              <p className="text-white opacity-85 mb-4">
                Mientras tú entregas tarjetas de papel, <strong>ellos cierran deals con 1 clic</strong>. 
                <br />
                No te quedes atrás. <strong>Únete a los +5,000 profesionales que ya generan más leads.</strong>
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Button 
                  size="lg"
                  className="cta-primary"
                  onClick={handleCreateCard}
                >
                  🆔 CREAR MI TARJETA AHORA
                </Button>
                {session && (
                  <Button 
                    size="lg"
                    className="cta-secondary"
                    onClick={handleDashboardAccess}
                  >
                    📊 IR AL DASHBOARD
                  </Button>
                )}
              </div>
              <div className="mt-4">
                <Row className="justify-content-center text-center">
                  <Col xs={4} md={3}>
                    <div className="text-white">
                      <div className="fs-3 fw-bold">+300%</div>
                      <small className="opacity-75">Más contactos</small>
                    </div>
                  </Col>
                  <Col xs={4} md={3}>
                    <div className="text-white">
                      <div className="fs-3 fw-bold">0 seg</div>
                      <small className="opacity-75">Tiempo de contacto</small>
                    </div>
                  </Col>
                  <Col xs={4} md={3}>
                    <div className="text-white">
                      <div className="fs-3 fw-bold">∞</div>
                      <small className="opacity-75">Nunca se agota</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
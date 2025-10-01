'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Alert } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { AuthWrapper } from '@/components/AuthWrapper';
import IndiNavbar from '@/components/layout/IndiNavbar';
import { StepOne } from '@/components/create/StepOne';
import { StepTwoTabs } from '@/components/create/StepTwoTabs';
import { StepThree } from '@/components/create/StepThree';
import { StepFour } from '@/components/create/StepFour';
import { PublishModal } from '@/components/create/PublishModal';
import { MobileCreatePage } from '@/components/create/MobileCreatePage';
// Import BusinessCard statically to fix production Button import issues
import BusinessCard from '@/features/digital-card/components/BusinessCard';
import EffectsManager from '@/lib/effects/EffectsManager';
import '@/styles/hologram-effects.css';
import '@/styles/preview-improvements.css';
import { DEFAULT_CARD_DATA, CONSISTENT_DEMO_DATA } from '@/lib/constants/defaultCardData';


export default function CreateCardPage() {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);
  const [planLimits, setPlanLimits] = useState<any>(null);
  // Usar datos centralizados consistentes - efectos desactivados por defecto
  const [cardData, setCardData] = useState(CONSISTENT_DEMO_DATA);

  useEffect(() => {
    if (session?.user?.id) {
      checkPlanLimits();
    }
  }, [session]);

  const checkPlanLimits = async () => {
    try {
      const response = await fetch('/api/user/plan-limits');
      if (response.ok) {
        const limits = await response.json();
        setPlanLimits(limits);
        
        // Check if user can create more cards
        const cardsResponse = await fetch('/api/cards');
        if (cardsResponse.ok) {
          const cards = await cardsResponse.json();
          if (limits.maxCards !== -1 && cards.length >= limits.maxCards) {
            setLimitError(`Has alcanzado el límite de tu plan de ${limits.maxCards} tarjeta${limits.maxCards > 1 ? 's' : ''}. Por favor actualiza tu plan para crear más tarjetas.`);
          } else {
            setLimitError(null); // Clear any previous errors
          }
        }
      }
    } catch (error) {
      console.error('Error checking plan limits:', error);
      setLimitError('Error verificando límites del plan. Por favor intenta de nuevo.');
    }
  };

  const steps = [
    { id: 1, title: 'Datos Dimensionales', description: 'Configuración de identidad intergaláctica' },
    { id: 2, title: 'Diseño Holográfico', description: 'Personalización visual de otro mundo' },
    { id: 3, title: 'Redes Espaciales', description: 'Conexiones interdimensionales' },
    { id: 4, title: 'Lanzamiento Final', description: 'Activación y transmisión' },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPublishModal(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateCardData = (field: string, value: string | boolean | number) => {
    setCardData(prev => {
      const newData = { ...prev, [field]: value };
      // Debug específico para pageBackgroundColor
      if (field === 'pageBackgroundColor') {
        console.log('📝 UpdateCardData - Color de fondo de página:', {
          field,
          value,
          before: prev.pageBackgroundColor,
          after: newData.pageBackgroundColor
        });
      }
      return newData;
    });
  };

  // Generar estilos dinámicos para efectos de ambiente en preview
  const generatePreviewStyles = () => {
    if (!cardData.enableAnimatedGradient) return '';
    
    const effectsManager = EffectsManager.getInstance();
    const effectsState = effectsManager.convertLegacyProps({
      enableAnimatedGradient: cardData.enableAnimatedGradient,
      animatedGradientType: cardData.animatedGradientType,
      animatedGradientSpeed: cardData.animatedGradientSpeed,
      animatedGradientIntensity: cardData.animatedGradientIntensity,
      animatedGradientOpacity: cardData.animatedGradientOpacity,
      ambientIntensity: cardData.ambientIntensity,
      ambientOpacity: cardData.ambientOpacity
    });
    
    return effectsManager.generateEffectStyles(effectsState, {
      background: cardData.cardBackgroundColor,
      text: cardData.cardTextColor
    });
  };


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne cardData={cardData} updateCardData={updateCardData} />;
      case 2:
        return <StepTwoTabs cardData={cardData} updateCardData={updateCardData} />;
      case 3:
        return <StepThree cardData={cardData} updateCardData={updateCardData} />;
      case 4:
        return <StepFour cardData={cardData} updateCardData={updateCardData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: generatePreviewStyles()}} />
      <style dangerouslySetInnerHTML={{__html: `
        .animated-gradient-background {
          background: ${cardData.pageBackgroundColor || '#1a1a2e'};
          transition: background-color 0.3s ease;
          min-height: 100vh;
        }
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          transition: all 0.3s ease;
        }

        /* Mejorar la consistencia visual entre contenedores */
        .preview-container .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .preview-container .card-header h4 {
          font-size: 1.3rem;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(0, 246, 255, 0.3);
        }

        /* Scroll personalizado para ambos contenedores */
        .form-container .card-body,
        .preview-container .card-body {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 246, 255, 0.3) transparent;
        }

        .form-container .card-body::-webkit-scrollbar,
        .preview-container .card-body::-webkit-scrollbar {
          width: 6px;
        }

        .form-container .card-body::-webkit-scrollbar-track,
        .preview-container .card-body::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .form-container .card-body::-webkit-scrollbar-thumb,
        .preview-container .card-body::-webkit-scrollbar-thumb {
          background: rgba(0, 246, 255, 0.3);
          border-radius: 3px;
        }

        .form-container .card-body::-webkit-scrollbar-thumb:hover,
        .preview-container .card-body::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 246, 255, 0.5);
        }

        /* Asegurar que ambos contenedores tengan la misma altura */
        .form-container,
        .preview-container {
          min-height: 85vh;
        }

        /* Mejorar espaciado en móvil */
        @media (max-width: 991px) {
          .form-container,
          .preview-container {
            min-height: auto;
            margin-bottom: 2rem;
          }
        }

        /* Mejorar tipografía y espaciado */
        .card-header h4 {
          font-size: 1.3rem;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(0, 246, 255, 0.3);
        }


        /* Espaciado entre contenedores en desktop */
        @media (min-width: 992px) {
          .form-container {
            padding-right: 1rem;
          }

          .preview-container {
            padding-left: 1rem;
          }
        }

        /* Hover effects para los contenedores */
        .glass-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
        }
        .step-indicator {
          position: relative;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .step-indicator.active {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid #00F6FF;
        }
        .step-indicator.completed {
          background: rgba(0, 246, 255, 0.2);
        }

        /* Estilos alienígenas para la página de creación */
        .alien-title-glow {
          text-shadow: 
            0 0 10px rgba(0, 246, 255, 0.8),
            0 0 20px rgba(0, 246, 255, 0.6),
            0 0 40px rgba(0, 246, 255, 0.4);
          animation: alienTitlePulse 3s ease-in-out infinite;
        }

        @keyframes alienTitlePulse {
          0%, 100% { 
            text-shadow: 
              0 0 10px rgba(0, 246, 255, 0.8),
              0 0 20px rgba(0, 246, 255, 0.6),
              0 0 40px rgba(0, 246, 255, 0.4);
          }
          50% { 
            text-shadow: 
              0 0 15px rgba(0, 246, 255, 1),
              0 0 30px rgba(0, 246, 255, 0.8),
              0 0 50px rgba(0, 246, 255, 0.6);
          }
        }

        .alien-btn-back {
          background: rgba(0, 246, 255, 0.1);
          border-color: rgba(0, 246, 255, 0.5);
          transition: all 0.3s ease;
        }

        .alien-btn-back:hover {
          background: rgba(0, 246, 255, 0.2);
          border-color: rgba(0, 246, 255, 0.8);
          transform: translateX(-2px);
        }

        .alien-progress-title {
          text-shadow: 0 0 5px rgba(0, 246, 255, 0.6);
        }

        .alien-step-counter {
          background: rgba(0, 246, 255, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          border: 1px solid rgba(0, 246, 255, 0.3);
        }

        .alien-progress-bar {
          border-radius: 10px;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.3);
        }

        .alien-progress-bar .progress-bar {
          background: linear-gradient(90deg, #00f6ff, #0072ff, #8e2de2);
          background-size: 200% 100%;
          animation: progressShine 2s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(0, 246, 255, 0.6);
        }

        @keyframes progressShine {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .alien-preview-header {
          background: rgba(0, 246, 255, 0.1);
          border-bottom: 2px solid rgba(0, 246, 255, 0.3);
        }

        .alien-preview-title {
          text-shadow: 0 0 8px rgba(0, 246, 255, 0.8);
        }

        .alien-btn-nav {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .alien-btn-nav:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateX(-2px);
        }

        .alien-btn-nav-primary {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          box-shadow: 0 4px 16px rgba(0, 246, 255, 0.4);
          transition: all 0.3s ease;
        }

        .alien-btn-nav-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #00d1db, #005bb5);
          transform: translateX(2px) scale(1.02);
          box-shadow: 0 6px 20px rgba(0, 246, 255, 0.6);
        }

        /* Efectos holográficos para las cards principales */
        .glass-card {
          position: relative;
          transition: all 0.3s ease;
        }

        .glass-card::before {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          background: linear-gradient(45deg, 
            transparent, rgba(0, 246, 255, 0.3), transparent, 
            rgba(0, 246, 255, 0.3), transparent);
          border-radius: 16px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .glass-card:hover::before {
          opacity: 1;
        }

        .glass-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 48px rgba(0, 246, 255, 0.2);
        }
        
        /* Centrado específico para vista previa en móvil */
        @media (max-width: 768px) {
          .preview-container {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
          
          .preview-content {
            width: 100% !important;
            max-width: 350px !important;
            margin: 0 auto !important;
          }
        }
        
      `}} />
      
      <div className="animated-gradient-background d-none d-md-block">
        {/* Navbar con Indi - Solo desktop */}
        <IndiNavbar variant="transparent" position="relative" showActions={true} />
        
        <Container className="py-4">
          {/* Header */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-sm-center gap-3">
                <h1 className="text-white h2 h-sm-1 mb-0 alien-title-glow">🚀 Iniciar Misión de Creación Intergaláctica</h1>
                <Button variant="outline-light" href="/dashboard" size="sm" className="align-self-start alien-btn-back">
                  🏠 Regresar al Centro de Comando
                </Button>
              </div>
            </Col>
          </Row>

          {/* Plan Limit Warning */}
          {limitError && (
            <Row className="mb-4">
              <Col>
                <Alert variant="warning" className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Plan Limit Reached!</strong> {limitError}
                  </div>
                  <Button variant="outline-primary" size="sm" href="/pricing">
                    Upgrade Now
                  </Button>
                </Alert>
              </Col>
            </Row>
          )}

          {/* Progress Bar */}
          <Row className="mb-4">
            <Col>
              <Card className="glass-card text-white">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 alien-progress-title">🚀 Misión: {steps[currentStep - 1].title}</h5>
                    <small className="text-light alien-step-counter">Fase {currentStep} de 4</small>
                  </div>
                  <ProgressBar 
                    now={(currentStep / 4) * 100} 
                    variant="info"
                    className="alien-progress-bar"
                    style={{ height: '10px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Formulario - 50% */}
            <Col lg={6} className="form-container">
              <Card className="glass-card text-white" style={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>
                <Card.Header>
                  <h4 className="mb-0">{steps[currentStep - 1].title}</h4>
                </Card.Header>
                <Card.Body style={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(85vh - 120px)' }}>
                  {renderStep()}
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between" style={{ flexShrink: 0 }}>
                  <Button
                    variant="outline-light"
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className="alien-btn-nav"
                  >
                    ◁ Retroceder
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    disabled={!!(limitError && currentStep === 4)}
                    className="alien-btn-nav-primary"
                  >
                    {limitError && currentStep === 4 ? '⚠️ Upgrade Required' : (currentStep === 4 ? '🚀 Activar Transmisión' : 'Avanzar ▷')}
                  </Button>
                </Card.Footer>
              </Card>
            </Col>

            {/* Preview - 50% con tamaño igual al formulario */}
            <Col lg={6} className="preview-container">
              <Card className="glass-card text-white" style={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>
                <Card.Header className="text-center">
                  <h4 className="mb-0">👁️ Vista Previa</h4>
                  <small className="text-light">Vista en tiempo real de tu tarjeta</small>
                </Card.Header>
                <Card.Body style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  padding: '1rem',
                  overflowY: 'auto',
                  overflowX: 'hidden'
                }}>
                  <div
                    key={`preview-${cardData.pageBackgroundColor}`}
                    style={{
                      width: '100%',
                      minHeight: '100%',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      paddingTop: '1rem'
                    }}
                  >
                <BusinessCard
                        key={`${cardData.cardBackgroundColor}-${cardData.cardTextColor}-${cardData.pageBackgroundColor}-${cardData.template}-${cardData.enableParticles}-${cardData.fontFamily}`}
                        name={cardData.name || 'Tu Nombre'}
                        title={cardData.title || 'Tu Título'}
                        about={cardData.about || 'Tu descripción profesional aparecerá aquí...'}
                        location={cardData.location || 'Tu ubicación'}
                        whatsapp={cardData.whatsapp || '56912345678'}
                        email={cardData.email || 'tu@email.com'}
                        photoUrl={cardData.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'}
                        cardBackgroundColor={cardData.cardBackgroundColor}
                        cardTextColor={cardData.cardTextColor}
                        pageBackgroundColor={cardData.pageBackgroundColor}
                        enableHoverEffect={cardData.enableHoverEffect}
                        enableGlassmorphism={cardData.enableGlassmorphism}
                        enableSubtleAnimations={cardData.enableSubtleAnimations}
                        enableBackgroundPatterns={cardData.enableBackgroundPatterns}
                        enableParticles={cardData.enableParticles}
                        particleType={cardData.particleType}
                        particleCount={cardData.particleCount}
                        particleDensity={cardData.particleDensity}
                        // Nuevos efectos de ambiente (matching schema.prisma)
                        enableAnimatedGradient={cardData.enableAnimatedGradient}
                        animatedGradientType={cardData.animatedGradientType}
                        animatedGradientSpeed={cardData.animatedGradientSpeed}
                        animatedGradientIntensity={cardData.animatedGradientIntensity}
                        animatedGradientOpacity={cardData.animatedGradientOpacity}
                        enableFloatingShapes={cardData.enableFloatingShapes}
                        floatingShapesType={cardData.floatingShapesType}
                        floatingShapesCount={cardData.floatingShapesCount}
                        floatingShapesSpeed={cardData.floatingShapesSpeed}
                        ambientIntensity={cardData.ambientIntensity}
                        ambientOpacity={cardData.ambientOpacity}
                        whatsappShareUrl=""
                        appointmentLink={cardData.appointmentLink}
                        professionalDetails={cardData.professionalDetails}
                        linkedin={cardData.linkedin}
                        instagram={cardData.instagram}
                        twitter={cardData.twitter}
                        facebook={cardData.facebook}
                        website={cardData.website}
                        buttonSecondaryColor={cardData.buttonSecondaryColor}
                        buttonNormalBackgroundColor={cardData.buttonNormalBackgroundColor}
                        buttonSecondaryHoverColor={cardData.buttonSecondaryHoverColor}
                        template={cardData.template}
                        fontFamily={cardData.fontFamily}
                        isPreviewMode={true}
                      />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <PublishModal 
        show={showPublishModal}
        onHide={() => setShowPublishModal(false)}
        cardData={cardData}
      />

      {/* Mobile Create Page - Solo visible en móvil, oculto en desktop */}
      <div className="d-md-none">
        <MobileCreatePage 
          cardData={cardData}
          updateCardData={updateCardData}
          onPublish={() => setShowPublishModal(true)}
        />
      </div>
    </>
  );
}
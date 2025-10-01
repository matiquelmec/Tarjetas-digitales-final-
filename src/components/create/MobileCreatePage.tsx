'use client';

import { useRef, useState } from 'react';
import { Container, Tab, Tabs, Button } from 'react-bootstrap';
import HologramPreview from '@/components/HologramPreview';
import { MobilePreviewModal } from './MobilePreviewModal';
import { StepOne } from './StepOne';
import { StepTwoTabs } from './StepTwoTabs';
import { StepThree } from './StepThree';
import { StepFour } from './StepFour';
import IndiNavbar from '@/components/layout/IndiNavbar';
import BusinessCard from '@/features/digital-card/components/BusinessCard';
import { DEFAULT_CARD_DATA } from '@/lib/constants/defaultCardData';

interface MobileCreatePageProps {
  cardData: any;
  updateCardData: (field: string, value: any) => void;
  onPublish: () => void;
}

export function MobileCreatePage({ cardData, updateCardData, onPublish }: MobileCreatePageProps) {
  const formRef = useRef<HTMLDivElement>(null);
  
  // Estados simples - SIN hooks complejos
  const [activeTab, setActiveTab] = useState('datos');
  const [showFullPreview, setShowFullPreview] = useState(false);
  
  const tabKeys = ['datos', 'diseño', 'redes', 'final'];
  const currentTabIndex = tabKeys.findIndex(tab => tab === activeTab);
  const isLastTab = currentTabIndex === tabKeys.length - 1;
  const canGoNext = currentTabIndex < tabKeys.length - 1;
  const canGoPrev = currentTabIndex > 0;

  const tabs = [
    { key: 'datos', title: 'Datos', icon: '📝', component: 'StepOne' },
    { key: 'diseño', title: 'Diseño', icon: '🎨', component: 'StepTwoTabs' },
    { key: 'redes', title: 'Redes', icon: '🔗', component: 'StepThree' },
    { key: 'final', title: 'Final', icon: '🚀', component: 'StepFour' }
  ];

  // Funciones simples de navegación con auto-scroll
  const scrollToTop = () => {
    // Múltiples métodos para asegurar que funcione en todos los dispositivos
    try {
      // Método 1: window.scrollTo con smooth behavior
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } catch (e) {
      // Fallback: scrollTo sin smooth behavior
      window.scrollTo(0, 0);
    }
    
    // Método adicional: scroll del body y html
    if (document.body) {
      document.body.scrollTop = 0;
    }
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setActiveTab(tabKeys[currentTabIndex + 1]);
      // Auto-scroll al inicio después de cambiar de paso
      setTimeout(scrollToTop, 100);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setActiveTab(tabKeys[currentTabIndex - 1]);
      // Auto-scroll al inicio después de cambiar de paso
      setTimeout(scrollToTop, 100);
    }
  };

  const handleNextWithPublish = () => {
    if (isLastTab) {
      onPublish();
    } else {
      handleNext();
    }
  };

  const openFullPreview = () => {
    console.log('🔍 Opening full preview modal');
    setShowFullPreview(true);
  };
  
  const closeFullPreview = () => {
    console.log('❌ Closing full preview modal');
    setShowFullPreview(false);
  };

  const getTabCompletionStatus = (tabKey: string) => {
    switch (tabKey) {
      case 'datos':
        return !!(cardData.name && cardData.title && cardData.email);
      case 'diseño':
        return !!(cardData.cardBackgroundColor && cardData.fontFamily);
      case 'redes':
        return !!(cardData.linkedin || cardData.website || cardData.instagram || cardData.whatsapp);
      case 'final':
        return true; // Siempre completable
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (activeTab) {
      case 'datos':
        return <StepOne cardData={cardData} updateCardData={updateCardData} />;
      case 'diseño':
        return <StepTwoTabs cardData={cardData} updateCardData={updateCardData} />;
      case 'redes':
        return <StepThree cardData={cardData} updateCardData={updateCardData} />;
      case 'final':
        return <StepFour cardData={cardData} updateCardData={updateCardData} />;
      default:
        return <StepOne cardData={cardData} updateCardData={updateCardData} />;
    }
  };

  return (
    <div className="mobile-create-container">
      {/* Navegación unificada con IndiNavbar */}
      <IndiNavbar variant="solid" position="sticky" showActions={true} />

      {/* Preview usando HologramPreview idéntico al inicio */}
      <div className="mobile-preview-container">
        <HologramPreview
          title="👁️ Vista Previa"
          subtitle="Vista en tiempo real"
          pageBackgroundColor={cardData.pageBackgroundColor || '#1a1a2e'}
          showScanlines={false}
          mode="basic" // Modo básico sin efectos
          showBeam={false}
          showParticles={false}
          enable3D={false}
          height="100%" // Usar 100% para que se adapte al contenedor padre
          className="preview-mode"
        >
          <BusinessCard
            name={cardData.name || 'Tu Nombre'}
            title={cardData.title || 'Tu Profesión'}
            about={cardData.about || ''}
            location={cardData.location || ''}
            whatsapp={cardData.whatsapp || cardData.phone || ''}
            email={cardData.email || ''}
            photoUrl={cardData.photo || ''}
            cardBackgroundColor={cardData.cardBackgroundColor || '#1F1F1F'}
            cardTextColor={cardData.cardTextColor || '#EAEAEA'}
            pageBackgroundColor={cardData.pageBackgroundColor || '#121212'}
            buttonSecondaryColor={cardData.buttonSecondaryColor || '#00F6FF'}
            buttonNormalBackgroundColor={cardData.buttonNormalBackgroundColor || '#1F1F1F'}
            buttonSecondaryHoverColor={cardData.buttonSecondaryHoverColor || '#00D1DB'}
            fontFamily={cardData.fontFamily || 'Inter'}
            appointmentLink={cardData.appointmentLink || cardData.website || ''}
            professionalDetails={cardData.professionalDetails || ''}
            linkedin={cardData.linkedin || ''}
            instagram={cardData.instagram || ''}
            twitter={cardData.twitter || ''}
            facebook={cardData.facebook || ''}
            website={cardData.website || ''}
            template={cardData.template || 'modern'}
            enableHoverEffect={false}
            enableGlassmorphism={false}
            enableSubtleAnimations={false}
            enableBackgroundPatterns={false}
            enableParticles={false}
            enableAnimatedGradient={false}
            enableFloatingShapes={false}
            whatsappShareUrl={`https://wa.me/${cardData.whatsapp || cardData.phone || ''}?text=Hola, vi tu tarjeta digital`}
          />
        </HologramPreview>
      </div>

      {/* Navegación por Tabs */}
      <div className="mobile-tabs-container">
        <Tabs
          activeKey={activeTab}
          onSelect={(key) => {
            setActiveTab(key || 'datos');
            // Auto-scroll al cambiar tab manualmente
            setTimeout(scrollToTop, 100);
          }}
          className="mobile-tabs justify-content-center"
          variant="pills"
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.key}
              eventKey={tab.key}
              title={
                <div className="tab-content">
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-text">{tab.title}</span>
                  {getTabCompletionStatus(tab.key) && (
                    <span className="tab-check">✓</span>
                  )}
                </div>
              }
            />
          ))}
        </Tabs>
      </div>

      {/* Contenido del Formulario - Simplificado */}
      <div className="mobile-form-container">
        <Container fluid className="p-3">
          {renderStepContent()}
        </Container>
        
        {/* Navegación Inferior Simplificada */}
        <div className="mobile-navigation-bar">
          <Button
            variant="outline-light"
            disabled={!canGoPrev}
            onClick={handlePrev}
            className="nav-btn"
            size="sm"
          >
            ← Anterior
          </Button>

          <Button
            variant="info"
            onClick={openFullPreview}
            className="preview-btn"
            size="sm"
          >
            👁️ Preview
          </Button>

          <Button
            variant={isLastTab ? 'success' : 'primary'}
            onClick={handleNextWithPublish}
            className="nav-btn"
            size="sm"
          >
            {isLastTab ? '🚀 Publicar' : 'Siguiente →'}
          </Button>
        </div>
      </div>

      {/* Modal Preview Full-screen */}
      {showFullPreview && (
        <MobilePreviewModal
          cardData={cardData}
          onClose={closeFullPreview}
        />
      )}

      <style jsx>{`
        .mobile-create-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          /* Agregar padding superior para compensar el navbar sticky */
          padding-top: env(safe-area-inset-top);
        }

        .mobile-preview-container {
          position: sticky;
          top: 80px; /* Espacio para navbar móvil: padding (32px) + logo (~48px) */
          z-index: 10;
          height: calc(50vh - 80px); /* Restar el espacio del navbar */
          min-height: 280px; /* Altura mínima para funcionalidad */
          max-height: 450px; /* Altura que respeta el navbar */
          overflow-y: auto; /* Cambiar a auto para permitir scroll en el contenedor */
          display: flex;
          flex-direction: column;
        }

        .mobile-tabs-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 8px 0;
        }

        :global(.mobile-tabs) {
          border: none !important;
          margin: 0 8px;
        }

        :global(.mobile-tabs .nav-link) {
          background: transparent !important;
          border: none !important;
          color: rgba(255, 255, 255, 0.7) !important;
          padding: 8px 12px !important;
          border-radius: 12px !important;
          transition: all 0.3s ease !important;
          text-align: center !important;
        }

        :global(.mobile-tabs .nav-link.active) {
          background: rgba(255, 255, 255, 0.2) !important;
          color: white !important;
        }

        .tab-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          position: relative;
        }

        .tab-icon {
          font-size: 16px;
        }

        .tab-text {
          font-size: 10px;
          font-weight: 600;
        }

        .tab-check {
          color: #4ade80;
          font-size: 8px;
          position: absolute;
          top: -2px;
          right: -8px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          width: 12px;
          height: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-form-container {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          /* Agregar padding inferior para compensar bottom navigation */
          padding-bottom: 120px; /* 100px del bottom nav + 20px extra */
        }

        .mobile-navigation-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          margin-top: auto;
          /* Agregar safe area para dispositivos con notch/home indicator */
          padding-bottom: calc(12px + env(safe-area-inset-bottom));
        }

        .nav-btn {
          flex: 1;
          margin: 0 4px;
          padding: 10px 8px !important;
          font-weight: 600 !important;
          border-radius: 8px !important;
          font-size: 12px !important;
        }

        .preview-btn {
          flex: 0.8;
          margin: 0 8px;
          padding: 10px 12px !important;
          font-weight: 600 !important;
          border-radius: 8px !important;
          font-size: 12px !important;
        }

        /* Estilos específicos para móvil - evitar superposiciones */
        @media (max-width: 768px) {
          .mobile-create-container {
            /* Ajustar altura mínima considerando navegaciones */
            min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
            /* Compensar el navbar sticky superior */
            margin-top: 0;
            padding-top: 0;
          }

          .mobile-form-container {
            /* Asegurar que el formulario tenga espacio suficiente */
            padding-bottom: 140px; /* Más espacio para bottom nav */
            min-height: calc(50vh - 80px); /* Al menos la mitad restante de la pantalla */
          }

          /* Asegurar que el último elemento sea visible */
          .mobile-form-container > :last-child {
            margin-bottom: 20px;
          }

          /* Mejorar el spacing del Container interno */
          .mobile-form-container .container-fluid {
            padding-bottom: 20px !important;
            margin-bottom: 0 !important;
          }

          /* Asegurar que las alertas estén siempre visibles */
          :global(.alert) {
            position: relative !important;
            z-index: 1000 !important;
            margin-bottom: 1rem !important;
          }

          :global(.mobile-form-container .alert) {
            position: relative !important;
            z-index: 1000 !important;
            margin-bottom: 1rem !important;
          }

          :global(.container-fluid .alert) {
            position: relative !important;
            z-index: 1000 !important;
            margin-bottom: 1rem !important;
          }
        }

        /* Para dispositivos muy pequeños */
        @media (max-width: 360px) {
          .mobile-form-container {
            padding-bottom: 160px; /* Aún más espacio en pantallas pequeñas */
          }
          
          .mobile-preview-container {
            top: 70px; /* Menos espacio en pantallas muy pequeñas */
            height: calc(50vh - 70px);
            min-height: 250px;
          }
        }

        /* Ajuste para pantallas medianas */
        @media (min-width: 361px) and (max-width: 768px) {
          .mobile-preview-container {
            top: 80px; /* Espacio estándar para móvil */
          }
        }

        /* Para tablets pequeños */
        @media (min-width: 769px) and (max-width: 1024px) {
          .mobile-preview-container {
            top: 100px; /* Más espacio para tablets */
            height: calc(50vh - 100px);
          }
        }
      `}</style>
    </div>
  );
}
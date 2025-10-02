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
    <div className="mobile-smart-layout">

      {/* Navegación unificada con IndiNavbar */}
      <IndiNavbar variant="solid" position="sticky" showActions={false} />

      {/* SPLIT SCREEN LAYOUT */}
      <div className="split-screen-container">
        {/* PREVIEW SECTION - 40% Superior */}
        <div className="preview-section">
          <div className="preview-header">
            <h6 className="preview-title">👁️ Vista Previa en Tiempo Real</h6>
            <Button
              variant="outline-light"
              size="sm"
              onClick={openFullPreview}
              className="preview-expand-btn"
            >
              ⛶ Expandir
            </Button>
          </div>
          <div className="preview-content">
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
              enableHoverEffect={cardData.enableHoverEffect || false}
              enableGlassmorphism={cardData.enableGlassmorphism || false}
              enableSubtleAnimations={cardData.enableSubtleAnimations || false}
              enableBackgroundPatterns={cardData.enableBackgroundPatterns || false}
              enableParticles={cardData.enableParticles || false}
              enableAnimatedGradient={cardData.enableAnimatedGradient || false}
              enableFloatingShapes={cardData.enableFloatingShapes || false}
              whatsappShareUrl={`https://wa.me/${cardData.whatsapp || cardData.phone || ''}?text=Hola, vi tu tarjeta digital`}
            />
          </div>
        </div>

        {/* FORM SECTION - 60% Inferior */}
        <div className="form-section">
          {/* Progress Indicator Integrado */}
          <div className="progress-header">
            <div className="step-indicator">
              <span className="step-number">{currentTabIndex + 1}/4</span>
              <span className="step-title">{tabs[currentTabIndex]?.title}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentTabIndex + 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Navegación por Tabs Integrada */}
          <div className="integrated-tabs">
            <Tabs
              activeKey={activeTab}
              onSelect={(key) => {
                setActiveTab(key || 'datos');
              }}
              className="smart-tabs"
              variant="pills"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.key}
                  eventKey={tab.key}
                  title={
                    <div className="smart-tab-content">
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

          {/* Contenido del Formulario con Scroll */}
          <div className="form-content-scrollable">
            <Container fluid className="p-3">
              {renderStepContent()}
            </Container>
          </div>

        </div>
      </div>

      {/* Navegación Flotante Simple - POR ENCIMA del pie de página */}
      <div className="navigation-overlay">
        <Button
          variant="outline-light"
          disabled={!canGoPrev}
          onClick={handlePrev}
          className="nav-btn"
          size="sm"
        >
          ← Anterior
        </Button>

        <div className="nav-info">
          <span className="completion-status">
            {getTabCompletionStatus(activeTab) ? '✓ Completado' : '⚠️ Incompleto'}
          </span>
        </div>

        <Button
          variant={isLastTab ? 'success' : 'primary'}
          onClick={handleNextWithPublish}
          className="nav-btn"
          size="sm"
          disabled={!getTabCompletionStatus(activeTab) && !isLastTab}
        >
          {isLastTab ? '🚀 Publicar' : 'Siguiente →'}
        </Button>
      </div>

      {/* Modal Preview Full-screen */}
      {showFullPreview && (
        <MobilePreviewModal
          cardData={cardData}
          onClose={closeFullPreview}
        />
      )}

      <style jsx>{`
        /* NUEVO SMART LAYOUT SPLIT SCREEN */
        .mobile-smart-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding-top: env(safe-area-inset-top);
        }

        .split-screen-container {
          display: flex;
          flex-direction: column;
          min-height: calc(100vh - 80px); /* Descontar navbar */
          max-height: calc(100vh - 80px);
          overflow: visible; /* Permitir que la navegación sea visible */
          position: relative;
        }

        /* PREVIEW SECTION - Más compacta */
        .preview-section {
          height: 35vh;
          min-height: 220px;
          max-height: 280px;
          display: flex;
          flex-direction: column;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .preview-title {
          color: white;
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(0, 246, 255, 0.8);
        }

        .preview-expand-btn {
          padding: 6px 12px !important;
          font-size: 12px !important;
          border-radius: 6px !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          background: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          transition: all 0.3s ease !important;
        }

        .preview-expand-btn:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
        }

        .preview-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: transparent;
        }

        /* FORM SECTION - Más espacio disponible */
        .form-section {
          height: 65vh;
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(5px);
          position: relative;
          z-index: 1;
          overflow: visible;
        }

        /* Progress Header */
        .progress-header {
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .step-indicator {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .step-number {
          color: #00f6ff;
          font-weight: 700;
          font-size: 14px;
        }

        .step-title {
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00f6ff 0%, #0072ff 100%);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        /* Integrated Tabs */
        .integrated-tabs {
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        :global(.smart-tabs) {
          border: none !important;
          margin: 0 !important;
        }

        :global(.smart-tabs .nav-link) {
          background: transparent !important;
          border: none !important;
          color: rgba(255, 255, 255, 0.7) !important;
          padding: 6px 8px !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
          text-align: center !important;
          font-size: 11px !important;
        }

        :global(.smart-tabs .nav-link.active) {
          background: rgba(0, 246, 255, 0.2) !important;
          color: white !important;
          box-shadow: 0 0 10px rgba(0, 246, 255, 0.3) !important;
        }

        .smart-tab-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          position: relative;
        }

        .tab-icon {
          font-size: 14px;
        }

        .tab-text {
          font-size: 9px;
          font-weight: 600;
        }

        .tab-check {
          color: #4ade80;
          font-size: 8px;
          position: absolute;
          top: -4px;
          right: -6px;
          background: rgba(74, 222, 128, 0.2);
          border-radius: 50%;
          width: 12px;
          height: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #4ade80;
        }

        /* Form Content con Scroll Interno */
        .form-content-scrollable {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding-bottom: 20px;
        }

        /* Navegación Flotante Simple */
        .navigation-overlay {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 999999;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(15px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
        }


        .nav-btn {
          flex: 1;
          margin: 0 4px;
          padding: 12px 8px !important;
          font-weight: 600 !important;
          border-radius: 8px !important;
          font-size: 13px !important;
          transition: all 0.3s ease !important;
          min-height: 44px !important;
          touch-action: manipulation !important;
          user-select: none !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }

        .nav-btn:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }

        .nav-info {
          flex: 0.8;
          text-align: center;
          margin: 0 8px;
        }

        .completion-status {
          font-size: 10px;
          font-weight: 600;
          color: white;
          background: rgba(0, 0, 0, 0.3);
          padding: 4px 8px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Responsive Adjustments */
        @media (max-width: 360px) {
          .preview-section {
            height: 35vh;
            min-height: 250px;
          }

          .form-section {
            height: 65vh;
          }

          .preview-title {
            font-size: 12px;
          }

          .step-number, .step-title {
            font-size: 12px;
          }
        }

        @media (min-width: 361px) and (max-width: 480px) {
          .preview-section {
            height: 38vh;
            min-height: 270px;
          }

          .form-section {
            height: 62vh;
          }
        }

        @media (min-width: 481px) and (max-width: 768px) {
          .preview-section {
            height: 40vh;
            min-height: 300px;
          }

          .form-section {
            height: 60vh;
          }
        }

        /* Smooth Transitions */
        .preview-content, .form-content {
          scroll-behavior: smooth;
        }

        /* Mejorar scroll en dispositivos muy pequeños */
        @media (max-height: 667px) {
          .form-content {
            padding-bottom: 140px; /* Mucho más espacio en pantallas pequeñas */
          }
        }

        /* Para dispositivos con pantallas muy altas */
        @media (min-height: 800px) {
          .form-content {
            padding-bottom: 100px; /* Menos espacio en pantallas grandes */
          }
        }

        /* Estilos globales para alertas */
        :global(.alert) {
          position: relative !important;
          z-index: 1000 !important;
          margin-bottom: 1rem !important;
        }

        /* Responsive para navegación flotante */
        @media (max-width: 576px) {
          .navigation-overlay {
            padding: 10px 12px;
          }

          .nav-btn {
            font-size: 12px !important;
            padding: 10px 6px !important;
          }
        }
      `}</style>
    </div>
  );
}
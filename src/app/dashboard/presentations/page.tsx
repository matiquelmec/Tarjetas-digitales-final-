'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import Link from 'next/link';
import { AuthWrapper } from '@/components/AuthWrapper';
import IndiNavbar from '@/components/layout/IndiNavbar';
import SlidePreview from '@/features/presentations/components/SlidePreview';
import EnhancedSlidePreview from '@/features/presentations/components/EnhancedSlidePreview';
import ThemeSelector from '@/features/presentations/components/ThemeSelector';
import { PRESENTATION_THEMES } from '@/features/presentations/types/themes';
import PresentationAIGenerator from '@/features/presentations/components/ai/PresentationAIGenerator';
import IndiChat from '@/features/presentations/components/IndiChat';
import PresentationEditorWrapper from '@/features/presentations/components/PresentationEditorWrapper';
import OrbitalStudio from '@/features/orbital-studio/components/OrbitalStudio';

export default function PresentationsPage() {
  const [presentations, setPresentations] = useState<any[]>([]);
  const [loadingPresentations, setLoadingPresentations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creationMode, setCreationMode] = useState<'ai' | 'manual' | null>(null);
  const [showOrbitalStudio, setShowOrbitalStudio] = useState(false);
  const [deletingPresentation, setDeletingPresentation] = useState<string | null>(null);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [demoTheme, setDemoTheme] = useState(PRESENTATION_THEMES[0]); // Modern Glass theme por defecto
  
  // Sistema de colores dinámicos (copiado de tarjetas digitales)
  const [dynamicColors, setDynamicColors] = useState({
    cardBackgroundColor: 'linear-gradient(135deg, #0f0c29, #24243e, #302b63, #1a1a2e)',
    cardTextColor: '#ffffff',
    buttonSecondaryColor: '#00f6ff',
    buttonSecondaryHoverColor: '#00d1db',
    buttonNormalBackgroundColor: '#1f1f1f'
  });

  // Cargar presentaciones al montar el componente
  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    try {
      setLoadingPresentations(true);
      const response = await fetch('/api/presentations');
      if (!response.ok) {
        throw new Error('Error cargando presentaciones');
      }
      const data = await response.json();
      setPresentations(Array.isArray(data.presentations) ? data.presentations : []);
    } catch (error) {
      console.error('Error loading presentations:', error);
      setError('Error cargando presentaciones');
    } finally {
      setLoadingPresentations(false);
    }
  };

  const handlePresentationGenerated = (presentation: any) => {
    console.log('Nueva presentación generada:', presentation);
    // Recargar la lista de presentaciones
    loadPresentations();
    // Cerrar el modal de creación
    setShowCreateModal(false);
    setShowOrbitalStudio(false);
    setCreationMode(null);
  };

  const deletePresentation = async (presentationId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta presentación? Esta acción no se puede deshacer.')) return;
    
    setDeletingPresentation(presentationId);
    try {
      const response = await fetch(`/api/presentations/${presentationId}`, {
        method: 'DELETE',
        credentials: 'same-origin'
      });
      
      if (response.ok) {
        setPresentations((presentations || []).filter(p => p.id !== presentationId));
      } else {
        console.error('Failed to delete presentation', await response.json());
        alert('Error al eliminar la presentación.');
      }
    } catch (error) {
      console.error('Error deleting presentation:', error);
      alert('Error de red al eliminar la presentación.');
    } finally {
      setDeletingPresentation(null);
    }
  };

  return (
    <AuthWrapper>
      <style dangerouslySetInnerHTML={{__html: `
        body {
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          min-height: 100vh;
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .animated-gradient-background {
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
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
        
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.5);
        }
        
        .presentations-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 1.5rem 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .minimal-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .minimal-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }
        
        .card-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .presentation-option-card {
          position: relative;
          overflow: hidden;
        }

        .presentation-option-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .presentation-option-card:hover::before {
          opacity: 1;
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
      `}} />
      
      <div className="animated-gradient-background">
        {/* Navbar con Indi */}
        <IndiNavbar variant="transparent" position="relative" showActions={true} />
        
        <Container className="py-4">
          {/* Header Minimalista inspirado en tarjetas */}
          <div className="presentations-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="text-white mb-0 fw-bold" style={{ fontSize: '1.8rem' }}>
                  Mis Presentaciones ({(presentations || []).length})
                </h1>
              </div>
              <div>
                <Button 
                  variant="primary" 
                  className="fw-semibold"
                  style={{ borderRadius: '25px', padding: '12px 24px' }}
                  onClick={() => {
                    setCreationMode('ai');
                    setShowCreateModal(true);
                  }}
                >
                  ✨ Nueva Presentación
                </Button>
              </div>
            </div>
          </div>

          {/* Sección Principal */}
          <Row>
            <Col>
              {loadingPresentations ? (
                <div className="glass-card border-0">
                  <div className="p-5 text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <h5 className="mt-3 text-white">Cargando tus presentaciones...</h5>
                    <p className="text-white opacity-75">Conectando con la plataforma empresarial</p>
                  </div>
                </div>
              ) : (presentations || []).length === 0 ? (
                <div>
                  {/* Estado vacío simplificado con 2 opciones claras */}
                  <div className="glass-card border-0 mb-4">
                    <div className="p-4 text-center">
                      <h3 className="fw-bold text-white mb-3" style={{
                        textShadow: '0 0 20px rgba(0, 246, 255, 0.8)',
                        animation: 'alienTitlePulse 3s ease-in-out infinite'
                      }}>
                        ¡Crea Tu Primera Presentación Inmersiva!
                      </h3>
                      <p className="text-white opacity-75 mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                        Elige cómo crear tu presentación. Pronto con <strong>videos VO3 e imágenes Flux.</strong>
                      </p>
                    </div>
                  </div>
                  
                  {/* Solo 2 opciones claras */}
                  <Row className="g-4 mb-5">
                    {/* Opción 1: IA */}
                    <Col lg={6}>
                      <div 
                        className="presentation-option-card h-100 p-4"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0, 246, 255, 0.1), rgba(0, 114, 255, 0.05))',
                          border: '2px solid rgba(0, 246, 255, 0.3)',
                          borderRadius: '20px',
                          transition: 'all 0.4s ease',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onClick={() => {
                          setCreationMode('ai');
                          setShowCreateModal(true);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 246, 255, 0.2)';
                          e.currentTarget.style.borderColor = 'rgba(0, 246, 255, 0.8)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.borderColor = 'rgba(0, 246, 255, 0.3)';
                        }}
                      >
                        <div className="text-center">
                          <div style={{ 
                            fontSize: '4rem', 
                            marginBottom: '1.5rem',
                            filter: 'drop-shadow(0 0 15px rgba(0, 246, 255, 0.8))'
                          }}>
                            🤖
                          </div>
                          <h4 className="fw-bold text-white mb-3">
                            Crear con IA
                          </h4>
                          <p className="text-white opacity-75 mb-4" style={{ lineHeight: '1.6' }}>
                            Sube un documento o describe tu tema. <strong>La IA crea toda la presentación automáticamente</strong> con investigación actualizada.
                          </p>
                          <div className="mb-4">
                            <span className="badge bg-success bg-opacity-10 text-success fw-semibold px-3 py-2 me-2">
                              🔍 Investigación automática
                            </span>
                            <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2">
                              ⚡ Generación instantánea
                            </span>
                          </div>
                          <Button 
                            variant="primary" 
                            className="fw-semibold w-100"
                            style={{ borderRadius: '16px', padding: '16px', fontSize: '1.1rem' }}
                          >
                            ✨ Crear con IA
                          </Button>
                        </div>
                      </div>
                    </Col>

                    {/* Opción 2: Manual */}
                    <Col lg={6}>
                      <div 
                        className="presentation-option-card h-100 p-4"
                        style={{
                          background: 'linear-gradient(135deg, rgba(142, 45, 226, 0.1), rgba(74, 0, 224, 0.05))',
                          border: '2px solid rgba(142, 45, 226, 0.3)',
                          borderRadius: '20px',
                          transition: 'all 0.4s ease',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onClick={() => {
                          setCreationMode('manual');
                          setShowCreateModal(false);
                          setShowOrbitalStudio(true);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 20px 60px rgba(142, 45, 226, 0.2)';
                          e.currentTarget.style.borderColor = 'rgba(142, 45, 226, 0.8)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.borderColor = 'rgba(142, 45, 226, 0.3)';
                        }}
                      >
                        <div className="text-center">
                          <div style={{ 
                            fontSize: '4rem', 
                            marginBottom: '1.5rem',
                            filter: 'drop-shadow(0 0 15px rgba(142, 45, 226, 0.8))'
                          }}>
                            🎨
                          </div>
                          <h4 className="fw-bold text-white mb-3">
                            🚀 Orbital Studio
                          </h4>
                          <p className="text-white opacity-75 mb-4" style={{ lineHeight: '1.6' }}>
                            Editor inmersivo con <strong>presentación central y controles orbitales</strong>. Experiencia de diseño futurista.
                          </p>
                          <div className="mb-4">
                            <span className="badge bg-warning bg-opacity-10 text-warning fw-semibold px-3 py-2 me-2">
                              🖼️ Flux Images (próximo)
                            </span>
                            <span className="badge bg-info bg-opacity-10 text-info fw-semibold px-3 py-2">
                              ⚙️ Control total
                            </span>
                          </div>
                          <Button 
                            style={{ 
                              background: 'linear-gradient(135deg, #8e2de2, #4a00e0)',
                              border: 'none',
                              borderRadius: '16px', 
                              padding: '16px',
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '1.1rem'
                            }}
                            className="w-100"
                          >
                            🎨 Empezar a Diseñar
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Premium Theme Showcase */}
                  <div className="glass-card border-0 mb-4">
                    <div className="p-4">
                      <div className="text-center mb-4">
                        <h4 className="fw-bold text-white mb-3">
                          🎨 Galería de Efectos Premium
                        </h4>
                        <div className="d-flex justify-content-center flex-wrap gap-2 mb-3">
                          <span className="badge bg-info bg-opacity-20 text-info fw-semibold px-3 py-2">
                            🔮 {PRESENTATION_THEMES.length} Temas Disponibles
                          </span>
                          <span className="badge bg-success bg-opacity-20 text-success fw-semibold px-3 py-2">
                            ⚡ Efectos en Tiempo Real
                          </span>
                          <span className="badge bg-warning bg-opacity-20 text-warning fw-semibold px-3 py-2">
                            ✨ Glassmorphism + Partículas
                          </span>
                        </div>
                        <p className="text-white opacity-75 mb-4" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                          Explora nuestros temas premium con efectos visuales cinematográficos. 
                          <strong> Cada tema incluye efectos únicos migrados desde nuestras tarjetas digitales exitosas.</strong>
                        </p>
                      </div>

                      {/* Demo Preview con Selector de Temas */}
                      <Row className="justify-content-center">
                        {/* Preview del Slide */}
                        <Col lg={6} xl={5} className="mb-4">
                          <div className="text-center mb-3">
                            <h6 className="text-white fw-semibold mb-2">
                              {demoTheme.emoji} Vista Previa: {demoTheme.name}
                            </h6>
                            <div className="d-flex justify-content-center flex-wrap gap-1 mb-3">
                              {demoTheme.effects.glassmorphism && (
                                <span className="badge bg-info bg-opacity-20 text-info" style={{ fontSize: '0.7rem' }}>
                                  Glass
                                </span>
                              )}
                              {demoTheme.effects.particles && (
                                <span className="badge bg-success bg-opacity-20 text-success" style={{ fontSize: '0.7rem' }}>
                                  Particles
                                </span>
                              )}
                              {demoTheme.effects.gradients && (
                                <span className="badge bg-warning bg-opacity-20 text-warning" style={{ fontSize: '0.7rem' }}>
                                  Gradients
                                </span>
                              )}
                              {demoTheme.effects.shadows && (
                                <span className="badge bg-secondary bg-opacity-20 text-secondary" style={{ fontSize: '0.7rem' }}>
                                  Shadows
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <EnhancedSlidePreview
                              theme={demoTheme}
                              content={{
                                title: 'Presentación Premium',
                                subtitle: 'Efectos visuales hipnotizantes',
                                content: ['Migrado desde tarjetas digitales', 'Nivel profesional garantizado'],
                                layout: 'title'
                              }}
                              isActive={true}
                              isPresenting={false}
                              enableInteraction={true}
                              style={{ 
                                width: '100%', 
                                maxWidth: '380px',
                                minHeight: '240px'
                              }}
                              // Pasar colores dinámicos
                              dynamicBackgroundColor={dynamicColors.cardBackgroundColor}
                              dynamicTextColor={dynamicColors.cardTextColor}
                              dynamicButtonColor={dynamicColors.buttonSecondaryColor}
                              dynamicButtonHoverColor={dynamicColors.buttonSecondaryHoverColor}
                              dynamicButtonBackgroundColor={dynamicColors.buttonNormalBackgroundColor}
                            />
                          </div>

                          {/* Panel de control de colores dinámicos */}
                          <div className="mt-4 p-3 rounded" style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}>
                            <h6 className="text-white fw-semibold mb-3 d-flex align-items-center gap-2">
                              🎨 Color Master Control
                            </h6>
                            
                            <div className="row g-2">
                              {/* Fondo */}
                              <div className="col-6">
                                <label className="text-white mb-1" style={{ fontSize: '0.75rem' }}>
                                  🎨 Fondo
                                </label>
                                <div className="d-flex gap-2 align-items-center">
                                  <input
                                    type="color"
                                    value={(() => {
                                      const color = dynamicColors.cardBackgroundColor;
                                      if (color.startsWith('#')) return color;
                                      if (color.includes('gradient')) {
                                        const match = color.match(/#[0-9a-fA-F]{6}/);
                                        return match ? match[0] : '#2c2c2c';
                                      }
                                      return '#2c2c2c';
                                    })()}
                                    onChange={(e) => setDynamicColors(prev => ({
                                      ...prev,
                                      cardBackgroundColor: e.target.value
                                    }))}
                                    style={{ 
                                      width: '35px', 
                                      height: '28px', 
                                      cursor: 'pointer',
                                      borderRadius: '6px',
                                      border: 'none'
                                    }}
                                  />
                                  <div 
                                    style={{
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '4px',
                                      background: dynamicColors.cardBackgroundColor,
                                      border: '1px solid rgba(255,255,255,0.3)'
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Texto */}
                              <div className="col-6">
                                <label className="text-white mb-1" style={{ fontSize: '0.75rem' }}>
                                  📝 Texto
                                </label>
                                <div className="d-flex gap-2 align-items-center">
                                  <input
                                    type="color"
                                    value={dynamicColors.cardTextColor}
                                    onChange={(e) => setDynamicColors(prev => ({
                                      ...prev,
                                      cardTextColor: e.target.value
                                    }))}
                                    style={{ 
                                      width: '35px', 
                                      height: '28px', 
                                      cursor: 'pointer',
                                      borderRadius: '6px',
                                      border: 'none'
                                    }}
                                  />
                                  <div 
                                    style={{
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '4px',
                                      background: dynamicColors.cardTextColor,
                                      border: '1px solid rgba(255,255,255,0.3)'
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Botón Principal */}
                              <div className="col-6">
                                <label className="text-white mb-1" style={{ fontSize: '0.75rem' }}>
                                  🔵 Botón Principal
                                </label>
                                <div className="d-flex gap-2 align-items-center">
                                  <input
                                    type="color"
                                    value={dynamicColors.buttonSecondaryColor}
                                    onChange={(e) => setDynamicColors(prev => ({
                                      ...prev,
                                      buttonSecondaryColor: e.target.value
                                    }))}
                                    style={{ 
                                      width: '35px', 
                                      height: '28px', 
                                      cursor: 'pointer',
                                      borderRadius: '6px',
                                      border: 'none'
                                    }}
                                  />
                                  <div 
                                    style={{
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '4px',
                                      background: dynamicColors.buttonSecondaryColor,
                                      border: '1px solid rgba(255,255,255,0.3)'
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Botón Hover */}
                              <div className="col-6">
                                <label className="text-white mb-1" style={{ fontSize: '0.75rem' }}>
                                  🔷 Botón Hover
                                </label>
                                <div className="d-flex gap-2 align-items-center">
                                  <input
                                    type="color"
                                    value={dynamicColors.buttonSecondaryHoverColor}
                                    onChange={(e) => setDynamicColors(prev => ({
                                      ...prev,
                                      buttonSecondaryHoverColor: e.target.value
                                    }))}
                                    style={{ 
                                      width: '35px', 
                                      height: '28px', 
                                      cursor: 'pointer',
                                      borderRadius: '6px',
                                      border: 'none'
                                    }}
                                  />
                                  <div 
                                    style={{
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '4px',
                                      background: dynamicColors.buttonSecondaryHoverColor,
                                      border: '1px solid rgba(255,255,255,0.3)'
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Botón Reset */}
                            <div className="text-center mt-3">
                              <button
                                className="btn btn-outline-light btn-sm"
                                onClick={() => setDynamicColors({
                                  cardBackgroundColor: 'linear-gradient(135deg, #0f0c29, #24243e, #302b63, #1a1a2e)',
                                  cardTextColor: '#ffffff',
                                  buttonSecondaryColor: '#00f6ff',
                                  buttonSecondaryHoverColor: '#00d1db',
                                  buttonNormalBackgroundColor: '#1f1f1f'
                                })}
                                style={{ 
                                  borderRadius: '8px', 
                                  fontSize: '0.7rem',
                                  padding: '0.3rem 0.8rem'
                                }}
                              >
                                🔄 Reset Colores
                              </button>
                            </div>
                          </div>

                          <div className="text-center mt-3">
                            <p className="text-white opacity-75">
                              <small>👆 Efectos reales de producción</small>
                            </p>
                          </div>
                        </Col>

                        {/* Selector de Temas */}
                        <Col lg={6} xl={7}>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h6 className="text-white fw-semibold mb-0">
                                🎯 Cambiar Tema Demo
                              </h6>
                              <Button
                                variant="outline-light"
                                size="sm"
                                style={{ borderRadius: '15px' }}
                                onClick={() => setShowThemeSelector(!showThemeSelector)}
                              >
                                {showThemeSelector ? '🔼 Ocultar' : '🔽 Ver Todos'}
                              </Button>
                            </div>
                            
                            {/* Selector rápido - Primeros 4 temas */}
                            <div className="d-flex flex-wrap gap-2 mb-3">
                              {PRESENTATION_THEMES.slice(0, 4).map((theme) => (
                                <button
                                  key={theme.id}
                                  className={`btn btn-sm ${demoTheme.id === theme.id ? 'btn-primary' : 'btn-outline-light'}`}
                                  style={{ 
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    padding: '6px 12px'
                                  }}
                                  onClick={() => setDemoTheme(theme)}
                                >
                                  {theme.emoji} {theme.name}
                                </button>
                              ))}
                            </div>

                            {/* Descripción del tema actual */}
                            <div 
                              className="p-3 rounded"
                              style={{
                                background: `linear-gradient(135deg, ${demoTheme.colors.primary}15, ${demoTheme.colors.secondary}10)`,
                                border: `1px solid ${demoTheme.colors.accent}30`
                              }}
                            >
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <span style={{ fontSize: '1.5rem' }}>{demoTheme.emoji}</span>
                                <div>
                                  <div className="text-white fw-semibold" style={{ fontSize: '0.9rem' }}>
                                    {demoTheme.name}
                                  </div>
                                  <div className="text-white opacity-75" style={{ fontSize: '0.75rem' }}>
                                    Categoría: {demoTheme.category}
                                  </div>
                                </div>
                              </div>
                              <p className="text-white opacity-85 mb-0" style={{ 
                                fontSize: '0.8rem', 
                                lineHeight: '1.4' 
                              }}>
                                {demoTheme.description}
                              </p>
                            </div>
                          </div>
                        </Col>
                      </Row>

                      {/* Theme Selector Expandido */}
                      {showThemeSelector && (
                        <div className="mt-4">
                          <div className="glass-card p-3">
                            <ThemeSelector
                              onThemeChange={(theme) => {
                                setDemoTheme(theme);
                                setShowThemeSelector(false);
                              }}
                              selectedThemeId={demoTheme.id}
                              showPreviewEffects={false}
                              compactMode={true}
                            />
                          </div>
                        </div>
                      )}

                      {/* Call to Action */}
                      <div className="text-center mt-4 pt-3 border-top border-white border-opacity-25">
                        <p className="text-white opacity-75 mb-3">
                          <strong>¿Listo para crear presentaciones que hipnotizan?</strong>
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                          <Button 
                            variant="primary" 
                            className="fw-semibold"
                            style={{ borderRadius: '20px', padding: '12px 24px' }}
                            onClick={() => {
                              setCreationMode('ai');
                              setShowCreateModal(true);
                            }}
                          >
                            ✨ Crear con IA
                          </Button>
                          <Button 
                            style={{ 
                              background: 'linear-gradient(135deg, #8e2de2, #4a00e0)',
                              border: 'none',
                              borderRadius: '20px', 
                              padding: '12px 24px',
                              color: 'white',
                              fontWeight: '600'
                            }}
                            onClick={() => {
                              setCreationMode('manual');
                              setShowCreateModal(false);
                              setShowOrbitalStudio(true);
                            }}
                          >
                            🎨 Orbital Studio
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Row className="g-4">
                  {(presentations || []).map((presentation, index) => (
                    <Col key={presentation.id} lg={6} xl={4}>
                      <div className="minimal-card">
                        <div className="card-content">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h5 className="text-white fw-bold mb-1">{presentation.title}</h5>
                              <p className="text-white-50 mb-0 small">{presentation.description || 'Presentación sin descripción'}</p>
                            </div>
                            <div className="stats-minimal">
                              <small className="text-white-50">
                                {presentation.views || 0} vistas
                              </small>
                            </div>
                          </div>
                          
                          <div className="card-actions">
                            <Button 
                              variant="outline-light" 
                              size="sm"
                              className="me-2"
                              style={{ borderRadius: '20px' }}
                              onClick={() => window.open(`/dashboard/presentations/${presentation.id}`, '_blank')}
                            >
                              Ver
                            </Button>
                            <Button 
                              variant="outline-light" 
                              size="sm"
                              className="me-2"
                              style={{ borderRadius: '20px' }}
                              onClick={() => window.open(`/dashboard/presentations/${presentation.id}/edit`, '_self')}
                            >
                              Editar
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              style={{ borderRadius: '20px' }}
                              onClick={() => deletePresentation(presentation.id)}
                              disabled={deletingPresentation === presentation.id}
                            >
                              {deletingPresentation === presentation.id ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              ) : (
                                'Eliminar'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal de Creación */}
      <Modal 
        show={showCreateModal} 
        onHide={() => setShowCreateModal(false)}
        size="xl"
        centered
        className="create-presentation-modal"
      >
        <Modal.Header closeButton style={{ background: 'linear-gradient(-45deg, #0f0c29, #24243e)', border: 'none' }}>
          <Modal.Title className="text-white">
            ✨ Crear Nueva Presentación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: 'linear-gradient(-45deg, #0f0c29, #24243e)', minHeight: '70vh' }}>
          {creationMode === 'ai' ? (
            <Row className="h-100">
              <Col lg={8}>
                <PresentationAIGenerator 
                  onPresentationGenerated={handlePresentationGenerated}
                  onError={(error) => setError(error)}
                />
              </Col>
              <Col lg={4}>
                <div className="glass-card text-white h-100">
                  <div className="p-3">
                    <h6 className="mb-3">💬 Chat con Indi</h6>
                    <IndiChat onPresentationGenerated={handlePresentationGenerated} />
                  </div>
                </div>
              </Col>
            </Row>
          ) : (
            <div className="h-100">
              {/* Theme Selection Step */}
              <div className="glass-card text-white mb-4">
                <div className="p-3">
                  <h6 className="mb-3">🎨 Seleccionar Tema Premium</h6>
                  <p className="text-white opacity-75 mb-3" style={{ fontSize: '0.9rem' }}>
                    Elige un tema para comenzar. Podrás cambiarlo después en el editor.
                  </p>
                  <ThemeSelector
                    onThemeChange={(theme) => {
                      setDemoTheme(theme);
                      console.log('Tema seleccionado para nuevo proyecto:', theme);
                    }}
                    selectedThemeId={demoTheme.id}
                    showPreviewEffects={true}
                    compactMode={false}
                  />
                </div>
              </div>
              
              {/* Editor */}
              <OrbitalStudio 
                onSave={handlePresentationGenerated}
                onExit={() => setShowCreateModal(false)}
                isFullscreen={false}
              />
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Orbital Studio - Pantalla Completa */}
      {showOrbitalStudio && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 9999,
          background: 'black'
        }}>
          <OrbitalStudio 
            onSave={handlePresentationGenerated}
            onExit={() => setShowOrbitalStudio(false)}
            isFullscreen={true}
          />
        </div>
      )}
    </AuthWrapper>
  );
}
'use client';

import { Form, Row, Col, Nav, Tab } from 'react-bootstrap';
import { useState } from 'react';
import { useUniversalContrast } from '@/hooks/useUniversalContrast';

interface CardData {
  cardBackgroundColor?: string;
  cardTextColor?: string;
  pageBackgroundColor?: string;
  buttonSecondaryColor?: string;
  buttonSecondaryHoverColor?: string;
  buttonNormalBackgroundColor?: string;
  fontFamily?: string;
  enableHoverEffect?: boolean;
  enableGlassmorphism?: boolean;
  enableSubtleAnimations?: boolean;
  enableBackgroundPatterns?: boolean;
  enableParticles?: boolean;
  particleType?: string;
  particleDensity?: number;
  particleCount?: number;
  
  // Nuevos campos para Efectos de Ambiente (matching schema.prisma)
  enableAnimatedGradient?: boolean;
  animatedGradientType?: string;
  animatedGradientSpeed?: number; // 1-5
  animatedGradientIntensity?: number; // 1-5
  animatedGradientOpacity?: number; // 0.1-1.0
  
  enableFloatingShapes?: boolean;
  floatingShapesType?: string;
  floatingShapesCount?: number; // 1-5
  floatingShapesSpeed?: number; // 1-5
  
  ambientIntensity?: number; // 1-5
  ambientOpacity?: number; // 0.1-1.0
}

interface StepTwoTabsProps {
  cardData: CardData;
  updateCardData: (field: string, value: string | boolean | number) => void;
}

export function StepTwoTabs({ cardData, updateCardData }: StepTwoTabsProps) {
  const [activeTab, setActiveTab] = useState('themes');
  const { applyAndUpdate } = useUniversalContrast();

  return (
    <div className="step-two-tabs">
      {/* Header */}
      <div className="text-center mb-4">
        <h4 className="mb-2">🎨 Diseño de tu Tarjeta</h4>
        <p className="text-muted">Personaliza cada aspecto visual de tu tarjeta profesional</p>
      </div>

      {/* Tab Navigation */}
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'themes')}>
        <Nav variant="tabs" className="mb-4 justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey="themes" className="px-3 py-2">
              <span className="me-2">🎨</span>Temas
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="colors" className="px-3 py-2">
              <span className="me-2">🎨</span>Colores
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="effects" className="px-3 py-2">
              <span className="me-2">✨</span>Efectos
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="fonts" className="px-3 py-2">
              <span className="me-2">✍️</span>Fuentes
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="advanced" className="px-3 py-2">
              <span className="me-2">⚙️</span>Avanzado
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* TAB 1: TEMAS */}
          <Tab.Pane eventKey="themes">
            <div className="themes-panel">
              {/* Smart Theme System */}
              <div className="mb-4">
                <h5 className="mb-3">🎨 Temas Profesionales</h5>
                <p className="text-muted mb-3">Selecciona un tema que refleje tu personalidad profesional</p>
                
                <div className="mb-4">
                  <div className="d-flex gap-3 flex-wrap">
                    {[
                      {
                        name: 'Emerald Professional',
                        emoji: '💎',
                        description: 'Elegancia natural y sofisticación',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#0a2e1a',
                          buttonSecondaryColor: '#10b981',
                          buttonSecondaryHoverColor: '#059669',
                          buttonNormalBackgroundColor: 'rgba(16, 185, 129, 0.2)'
                        }
                      },
                      {
                        name: 'Corporate Executive',
                        emoji: '💼',
                        description: 'Autoridad y confianza institucional',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#0d0f2b',
                          buttonSecondaryColor: '#7986cb',
                          buttonSecondaryHoverColor: '#5c6bc0',
                          buttonNormalBackgroundColor: 'rgba(121,134,203,0.2)'
                        }
                      },
                      {
                        name: 'Medical Trust',
                        emoji: '🏥',
                        description: 'Salud, tranquilidad y profesionalismo médico',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#0d2a10',
                          buttonSecondaryColor: '#a5d6a7',
                          buttonSecondaryHoverColor: '#81c784',
                          buttonNormalBackgroundColor: 'rgba(165,214,167,0.25)'
                        }
                      },
                      {
                        name: 'Legal Authority',
                        emoji: '⚖️',
                        description: 'Justicia, seriedad y tradición',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 50%, #8e24aa 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#1f0a30',
                          buttonSecondaryColor: '#ce93d8',
                          buttonSecondaryHoverColor: '#ba68c8',
                          buttonNormalBackgroundColor: 'rgba(206,147,216,0.25)'
                        }
                      },
                      {
                        name: 'Financial Gold',
                        emoji: '💰',
                        description: 'Prosperidad, estabilidad y valor',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #e65100 0%, #f57900 50%, #ff9800 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#2d1400',
                          buttonSecondaryColor: '#ffcc02',
                          buttonSecondaryHoverColor: '#ffb300',
                          buttonNormalBackgroundColor: 'rgba(255,204,2,0.2)'
                        }
                      },
                      {
                        name: 'Tech Innovation',
                        emoji: '⚡',
                        description: 'Futuro, precisión e innovación',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #0d1421 0%, #1a252f 50%, #263238 100%)',
                          cardTextColor: '#e8f5e8',
                          pageBackgroundColor: '#050810',
                          buttonSecondaryColor: '#64ffda',
                          buttonSecondaryHoverColor: '#4fc3f7',
                          buttonNormalBackgroundColor: 'rgba(100,255,218,0.15)'
                        }
                      }
                    ].map((theme, index) => (
                      <div
                        key={index}
                        data-theme={theme.name}
                        className="theme-card d-flex flex-column align-items-center text-center"
                        style={{
                          width: '120px',
                          padding: '12px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          border: '2px solid transparent',
                          background: theme.colors.cardBackgroundColor,
                          color: theme.colors.cardTextColor,
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => {
                          // Apply theme colors with universal contrast rules
                          applyAndUpdate(theme.colors, updateCardData);
                          
                          // Visual feedback
                          const element = document.querySelector(`[data-theme="${theme.name}"]`) as HTMLElement;
                          if (element) {
                            element.style.transform = 'scale(0.95)';
                            setTimeout(() => {
                              element.style.transform = 'scale(1)';
                            }, 150);
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                        }}
                        title={theme.description || theme.name}
                      >
                        <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{theme.emoji}</div>
                        <small style={{ fontSize: '11px', fontWeight: '600', lineHeight: '1.2' }}>
                          {theme.name}
                        </small>
                        
                        {/* 5-Color Preview Bar */}
                        <div style={{ marginTop: '8px', display: 'flex', gap: '2px', justifyContent: 'center' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.buttonSecondaryColor }}></div>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.buttonSecondaryHoverColor }}></div>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.buttonNormalBackgroundColor || 'rgba(255,255,255,0.3)' }}></div>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.cardTextColor }}></div>
                          <div style={{ width: '8px', height: '6px', borderRadius: '3px', background: 'linear-gradient(90deg, transparent 0%, ' + (theme.colors.cardBackgroundColor.includes('gradient') ? theme.colors.buttonSecondaryColor : theme.colors.cardBackgroundColor) + ' 100%)' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex gap-3 flex-wrap">
                    {[
                      {
                        name: 'Artist Canvas',
                        emoji: '🎨',
                        description: 'Creatividad, inspiración y expresión artística',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #f8bbd9 0%, #e1bee7 100%)',
                          cardTextColor: '#2d1b4e',
                          pageBackgroundColor: '#fbeef5',
                          buttonSecondaryColor: '#ad1457',
                          buttonSecondaryHoverColor: '#880e4f',
                          buttonNormalBackgroundColor: 'rgba(45,27,78,0.15)'
                        }
                      },
                      {
                        name: 'Nature Harmony',
                        emoji: '🌿',
                        description: 'Naturaleza, equilibrio y sostenibilidad',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#f1f8e9',
                          buttonSecondaryColor: '#c8e6c9',
                          buttonSecondaryHoverColor: '#a5d6a7',
                          buttonNormalBackgroundColor: 'rgba(200,230,201,0.2)'
                        }
                      },
                      {
                        name: 'Ocean Depth',
                        emoji: '🌊',
                        description: 'Profundidad, calma y fluidez oceánica',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #0277bd 0%, #29b6f6 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#e1f5fe',
                          buttonSecondaryColor: '#b3e5fc',
                          buttonSecondaryHoverColor: '#81d4fa',
                          buttonNormalBackgroundColor: 'rgba(179,229,252,0.2)'
                        }
                      },
                      {
                        name: 'Sunset Warmth',
                        emoji: '🌅',
                        description: 'Calidez, energía y optimismo radiante',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #f57c00 0%, #ffab40 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#fff8e1',
                          buttonSecondaryColor: '#fff3e0',
                          buttonSecondaryHoverColor: '#ffe0b2',
                          buttonNormalBackgroundColor: 'rgba(255,243,224,0.25)'
                        }
                      },
                      {
                        name: 'Midnight Elegance',
                        emoji: '🌙',
                        description: 'Sofisticación, misterio y elegancia nocturna',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #263238 0%, #37474f 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#121212',
                          buttonSecondaryColor: '#e1bee7',
                          buttonSecondaryHoverColor: '#ce93d8',
                          buttonNormalBackgroundColor: 'rgba(225,190,231,0.2)'
                        }
                      }
                    ].map((theme, index) => (
                      <div
                        key={index}
                        data-theme={theme.name}
                        className="theme-card d-flex flex-column align-items-center text-center"
                        style={{
                          width: '120px',
                          padding: '12px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          border: '2px solid transparent',
                          background: theme.colors.cardBackgroundColor,
                          color: theme.colors.cardTextColor,
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => {
                          // Apply theme colors with universal contrast rules
                          applyAndUpdate(theme.colors, updateCardData);
                          
                          // Visual feedback
                          const element = document.querySelector(`[data-theme="${theme.name}"]`) as HTMLElement;
                          if (element) {
                            element.style.transform = 'scale(0.95)';
                            setTimeout(() => {
                              element.style.transform = 'scale(1)';
                            }, 150);
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                        }}
                        title={theme.description || theme.name}
                      >
                        <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{theme.emoji}</div>
                        <small style={{ fontSize: '11px', fontWeight: '600', lineHeight: '1.2' }}>
                          {theme.name}
                        </small>
                        
                        {/* 5-Color Preview Bar */}
                        <div style={{ marginTop: '8px', display: 'flex', gap: '2px', justifyContent: 'center' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.buttonSecondaryColor }}></div>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.buttonSecondaryHoverColor }}></div>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.buttonNormalBackgroundColor || 'rgba(255,255,255,0.3)' }}></div>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.cardTextColor }}></div>
                          <div style={{ width: '8px', height: '6px', borderRadius: '3px', background: 'linear-gradient(90deg, transparent 0%, ' + (theme.colors.cardBackgroundColor.includes('gradient') ? theme.colors.buttonSecondaryColor : theme.colors.cardBackgroundColor) + ' 100%)' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Premium Gradient Collection */}
              <div className="mb-4">
                <h5 className="mb-3">✨ Colecciones Premium</h5>
                <p className="text-muted mb-3">Gradientes exclusivos optimizados para efectos Glassmorphism</p>
                
                {/* Executive Collection */}
                <div className="mb-4">
                  <h6 className="mb-3 d-flex align-items-center gap-2">
                    <span>🏆</span> Colección Ejecutiva
                  </h6>
                  <div className="d-flex gap-3 flex-wrap">
                    {[
                      {
                        name: 'Diamond',
                        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                        emoji: '💎',
                        description: 'Elegancia cristalina con destellos azul diamante',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#0a0d1a',
                          buttonSecondaryColor: '#7986cb',
                          buttonSecondaryHoverColor: '#5c6bc0',
                          buttonNormalBackgroundColor: 'rgba(121,134,203,0.2)'
                        }
                      },
                      {
                        name: 'Platinum',
                        gradient: 'linear-gradient(135deg, #4a4a4a 0%, #5a5a5a 50%, #2a2a2a 100%)',
                        emoji: '🔱',
                        description: 'Lujo metálico plateado con elegancia oscura',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #4a4a4a 0%, #5a5a5a 50%, #2a2a2a 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#1a1a1a',
                          buttonSecondaryColor: '#e0e0e0',
                          buttonSecondaryHoverColor: '#bdbdbd',
                          buttonNormalBackgroundColor: 'rgba(224,224,224,0.2)'
                        }
                      },
                      {
                        name: 'Sapphire',
                        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #1e3c72 100%)',
                        emoji: '💙',
                        description: 'Azul profundo',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #1e3c72 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#0f1a35',
                          buttonSecondaryColor: '#b3e5fc',
                          buttonSecondaryHoverColor: '#81d4fa',
                          buttonNormalBackgroundColor: 'rgba(179,229,252,0.2)'
                        }
                      },
                      {
                        name: 'Emerald',
                        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                        emoji: '💚',
                        description: 'Verde esmeralda',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#0a2e1a',
                          buttonSecondaryColor: '#ffffff',
                          buttonSecondaryHoverColor: '#f8f9fa',
                          buttonNormalBackgroundColor: 'rgba(255,255,255,0.25)'
                        }
                      },
                      {
                        name: 'Ruby',
                        gradient: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
                        emoji: '❤️',
                        description: 'Rojo intenso',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#2d0a1f',
                          buttonSecondaryColor: '#f8bbd9',
                          buttonSecondaryHoverColor: '#e1bee7',
                          buttonNormalBackgroundColor: 'rgba(248,187,217,0.25)'
                        }
                      }
                    ].map((bg, index) => (
                      <div
                        key={index}
                        className="gradient-card"
                        style={{
                          width: '110px',
                          padding: '0',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          border: cardData.cardBackgroundColor === bg.gradient ? '3px solid #007bff' : '2px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => {
                          if (bg.colors) {
                            applyAndUpdate(bg.colors, updateCardData);
                          } else {
                            updateCardData('cardBackgroundColor', bg.gradient);
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                        }}
                        title={bg.description || bg.name}
                      >
                        <div
                          style={{
                            height: '80px',
                            background: bg.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem'
                          }}
                        >
                          {bg.emoji}
                        </div>
                        <div
                          style={{
                            padding: '10px 8px',
                            background: 'rgba(0,0,0,0.8)',
                            color: 'white',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{ fontSize: '11px', fontWeight: '700', marginBottom: '2px' }}>
                            {bg.name}
                          </div>
                          <div style={{ fontSize: '9px', opacity: 0.8 }}>
                            {bg.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cosmic Collection */}
                <div className="mb-4">
                  <h6 className="mb-3 d-flex align-items-center gap-2">
                    <span>🌌</span> Colección Cósmica
                  </h6>
                  <div className="d-flex gap-3 flex-wrap">
                    {[
                      {
                        name: 'Galaxy',
                        gradient: 'linear-gradient(135deg, #2b1055 0%, #7597de 50%, #c9d6ff 100%)',
                        emoji: '🌌',
                        description: 'Espacio profundo',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #2b1055 0%, #7597de 50%, #c9d6ff 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#15082a',
                          buttonSecondaryColor: '#c9d6ff',
                          buttonSecondaryHoverColor: '#a5c4ff',
                          buttonNormalBackgroundColor: 'rgba(201,214,255,0.25)'
                        }
                      },
                      {
                        name: 'Nebula',
                        gradient: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
                        emoji: '☄️',
                        description: 'Neón espacial',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#2d0037',
                          buttonSecondaryColor: '#e1bee7',
                          buttonSecondaryHoverColor: '#ce93d8',
                          buttonNormalBackgroundColor: 'rgba(225,190,231,0.25)'
                        }
                      },
                      {
                        name: 'Aurora',
                        gradient: 'linear-gradient(135deg, #0c4a6e 0%, #1e3a8a 30%, #312e81 60%, #1f2937 100%)',
                        emoji: '🌈',
                        description: 'Luces boreales sobre cielo nocturno ártico',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #0c4a6e 0%, #1e3a8a 30%, #312e81 60%, #1f2937 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#062537',
                          buttonSecondaryColor: '#a5d6a7',
                          buttonSecondaryHoverColor: '#81c784',
                          buttonNormalBackgroundColor: 'rgba(165,214,167,0.25)'
                        }
                      },
                      {
                        name: 'Stellar',
                        gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                        emoji: '⭐',
                        description: 'Noche estelar',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#080614',
                          buttonSecondaryColor: '#ffcc02',
                          buttonSecondaryHoverColor: '#ffb300',
                          buttonNormalBackgroundColor: 'rgba(255,204,2,0.2)'
                        }
                      },
                      {
                        name: 'Cosmic',
                        gradient: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 50%, #ffecd2 100%)',
                        emoji: '🪐',
                        description: 'Universo vibrante',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 50%, #ffecd2 100%)',
                          cardTextColor: '#2d1b4e',
                          pageBackgroundColor: '#42306d',
                          buttonSecondaryColor: '#2d1b4e',
                          buttonSecondaryHoverColor: '#1a1025',
                          buttonNormalBackgroundColor: 'rgba(45,27,78,0.2)'
                        }
                      }
                    ].map((bg, index) => (
                      <div
                        key={index}
                        className="gradient-card"
                        style={{
                          width: '110px',
                          padding: '0',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          border: cardData.cardBackgroundColor === bg.gradient ? '3px solid #007bff' : '2px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => {
                          if (bg.colors) {
                            applyAndUpdate(bg.colors, updateCardData);
                          } else {
                            updateCardData('cardBackgroundColor', bg.gradient);
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                        }}
                        title={bg.description || bg.name}
                      >
                        <div
                          style={{
                            height: '80px',
                            background: bg.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem'
                          }}
                        >
                          {bg.emoji}
                        </div>
                        <div
                          style={{
                            padding: '10px 8px',
                            background: 'rgba(0,0,0,0.8)',
                            color: 'white',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{ fontSize: '11px', fontWeight: '700', marginBottom: '2px' }}>
                            {bg.name}
                          </div>
                          <div style={{ fontSize: '9px', opacity: 0.8 }}>
                            {bg.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nature Collection */}
                <div className="mb-4">
                  <h6 className="mb-3 d-flex align-items-center gap-2">
                    <span>🌿</span> Colección Natural
                  </h6>
                  <div className="d-flex gap-3 flex-wrap">
                    {[
                      {
                        name: 'Sunset',
                        gradient: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 30%, #ea580c 60%, #451a03 100%)',
                        emoji: '🌅',
                        description: 'Atardecer ardiente con crepúsculo',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 30%, #ea580c 60%, #451a03 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#451a03',
                          buttonSecondaryColor: '#fff3e0',
                          buttonSecondaryHoverColor: '#ffe0b2',
                          buttonNormalBackgroundColor: 'rgba(255,243,224,0.25)'
                        }
                      },
                      {
                        name: 'Ocean',
                        gradient: 'linear-gradient(135deg, #667db6 0%, #0082c8 50%, #41b883 100%)',
                        emoji: '🌊',
                        description: 'Azul oceánico',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #667db6 0%, #0082c8 50%, #41b883 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#1a3d5c',
                          buttonSecondaryColor: '#b3e5fc',
                          buttonSecondaryHoverColor: '#81d4fa',
                          buttonNormalBackgroundColor: 'rgba(179,229,252,0.25)'
                        }
                      },
                      {
                        name: 'Forest',
                        gradient: 'linear-gradient(135deg, #1b4332 0%, #2d5016 50%, #081c15 100%)',
                        emoji: '🌲',
                        description: 'Bosque profundo y frondoso',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #1b4332 0%, #2d5016 50%, #081c15 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#041e0a',
                          buttonSecondaryColor: '#c8e6c9',
                          buttonSecondaryHoverColor: '#a5d6a7',
                          buttonNormalBackgroundColor: 'rgba(200,230,201,0.25)'
                        }
                      },
                      {
                        name: 'Desert',
                        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
                        emoji: '🏜️',
                        description: 'Arena dorada',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#704a7f',
                          buttonSecondaryColor: '#ffffff',
                          buttonSecondaryHoverColor: '#f8f9fa',
                          buttonNormalBackgroundColor: 'rgba(255,255,255,0.25)'
                        }
                      },
                      {
                        name: 'Volcano',
                        gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 50%, #ff6b6b 100%)',
                        emoji: '🌋',
                        description: 'Fuego ardiente',
                        colors: {
                          cardBackgroundColor: 'linear-gradient(135deg, #f12711 0%, #f5af19 50%, #ff6b6b 100%)',
                          cardTextColor: '#ffffff',
                          pageBackgroundColor: '#7a1308',
                          buttonSecondaryColor: '#fff3e0',
                          buttonSecondaryHoverColor: '#ffe0b2',
                          buttonNormalBackgroundColor: 'rgba(255,243,224,0.25)'
                        }
                      }
                    ].map((bg, index) => (
                      <div
                        key={index}
                        className="gradient-card"
                        style={{
                          width: '110px',
                          padding: '0',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          border: cardData.cardBackgroundColor === bg.gradient ? '3px solid #007bff' : '2px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => {
                          if (bg.colors) {
                            applyAndUpdate(bg.colors, updateCardData);
                          } else {
                            updateCardData('cardBackgroundColor', bg.gradient);
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                        }}
                        title={bg.description || bg.name}
                      >
                        <div
                          style={{
                            height: '80px',
                            background: bg.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem'
                          }}
                        >
                          {bg.emoji}
                        </div>
                        <div
                          style={{
                            padding: '10px 8px',
                            background: 'rgba(0,0,0,0.8)',
                            color: 'white',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{ fontSize: '11px', fontWeight: '700', marginBottom: '2px' }}>
                            {bg.name}
                          </div>
                          <div style={{ fontSize: '9px', opacity: 0.8 }}>
                            {bg.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Tab.Pane>

          {/* TAB 2: COLORES */}
          <Tab.Pane eventKey="colors">
            <div className="colors-panel">
              <div className="mb-4">
                <h5 className="mb-3">🎨 Personalización Manual de Colores</h5>
                <p className="text-muted mb-3">Ajusta cada color individualmente para máximo control</p>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center gap-2">
                        <span>🎨</span> Color de Fondo de Tarjeta
                      </Form.Label>
                      <Form.Control
                        type="color"
                        value={(() => {
                          const color = cardData.cardBackgroundColor || '#2c2c2c';
                          if (color.startsWith('#')) return color;
                          
                          // Convert rgba to hex
                          if (color.startsWith('rgba')) {
                            const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
                            if (rgbaMatch) {
                              const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, '0');
                              const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, '0');
                              const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, '0');
                              return `#${r}${g}${b}`;
                            }
                          }
                          
                          // Extract from gradient
                          if (color.includes('gradient')) {
                            const match = color.match(/#[0-9a-fA-F]{6}/);
                            return match ? match[0] : '#2c2c2c';
                          }
                          
                          return '#2c2c2c';
                        })()}
                        onChange={(e) => updateCardData('cardBackgroundColor', e.target.value)}
                        style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center gap-2">
                        <span>📄</span> Color de Fondo de Página
                      </Form.Label>
                      <Form.Control
                        type="color"
                        value={(() => {
                          const color = cardData.pageBackgroundColor || '#121212';
                          if (color.startsWith('#')) return color;
                          
                          // Convert rgba to hex approximation
                          if (color.startsWith('rgba')) {
                            const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
                            if (rgbaMatch) {
                              const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, '0');
                              const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, '0');
                              const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, '0');
                              return `#${r}${g}${b}`;
                            }
                          }
                          
                          // Extract hex from gradient
                          if (color.includes('gradient')) {
                            const match = color.match(/#[0-9a-fA-F]{6}/);
                            return match ? match[0] : '#121212';
                          }
                          
                          return '#121212';
                        })()} 
                        onChange={(e) => {
                          console.log('🎨 Cambiando color de fondo de página:', e.target.value);
                          updateCardData('pageBackgroundColor', e.target.value);
                        }}
                        style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center gap-2">
                        <span>📝</span> Color del Texto
                      </Form.Label>
                      <Form.Control
                        type="color"
                        value={(() => {
                          const color = cardData.cardTextColor || '#ffffff';
                          if (color.startsWith('#')) return color;
                          if (color.includes('gradient') || color.startsWith('rgba') || color.startsWith('rgb')) {
                            const match = color.match(/#[0-9a-fA-F]{6}/);
                            return match ? match[0] : '#ffffff';
                          }
                          return '#ffffff';
                        })()}
                        onChange={(e) => updateCardData('cardTextColor', e.target.value)}
                        style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center gap-2">
                        <span>🔘</span> Color de Botones
                      </Form.Label>
                      <Form.Control
                        type="color"
                        value={(() => {
                          const color = cardData.buttonSecondaryColor || '#00F6FF';
                          if (color.startsWith('#')) return color;
                          if (color.includes('gradient') || color.startsWith('rgba')) {
                            const match = color.match(/#[0-9a-fA-F]{6}/);
                            return match ? match[0] : '#00F6FF';
                          }
                          return '#00F6FF';
                        })()} 
                        onChange={(e) => updateCardData('buttonSecondaryColor', e.target.value)}
                        style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center gap-2">
                        <span>✨</span> Color Hover
                      </Form.Label>
                      <Form.Control
                        type="color"
                        value={(() => {
                          const color = cardData.buttonSecondaryHoverColor || '#00D1DB';
                          if (color.startsWith('#')) return color;
                          if (color.includes('gradient') || color.startsWith('rgba')) {
                            const match = color.match(/#[0-9a-fA-F]{6}/);
                            return match ? match[0] : '#00D1DB';
                          }
                          return '#00D1DB';
                        })()} 
                        onChange={(e) => updateCardData('buttonSecondaryHoverColor', e.target.value)}
                        style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center gap-2">
                        <span>⬜</span> Color de Fondo de Botones
                      </Form.Label>
                      <Form.Control
                        type="color"
                        value={(() => {
                          const color = cardData.buttonNormalBackgroundColor || '#1F1F1F';
                          if (color.startsWith('#')) return color;
                          
                          // Convert rgba to hex approximation
                          if (color.startsWith('rgba')) {
                            const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
                            if (rgbaMatch) {
                              const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, '0');
                              const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, '0');
                              const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, '0');
                              return `#${r}${g}${b}`;
                            }
                          }
                          
                          // Extract hex from gradient
                          if (color.includes('gradient')) {
                            const match = color.match(/#[0-9a-fA-F]{6}/);
                            return match ? match[0] : '#1F1F1F';
                          }
                          
                          return '#1F1F1F';
                        })()} 
                        onChange={(e) => updateCardData('buttonNormalBackgroundColor', e.target.value)}
                        style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2 flex-wrap">
                  {[
                    { name: 'Aplicar contraste automático', icon: '🔄' }
                  ].map((action, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center gap-2 p-2 border rounded cursor-pointer"
                      style={{ fontSize: '14px' }}
                      title={action.name}
                    >
                      <span>{action.icon}</span>
                      <small>{action.name}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Tab.Pane>

          {/* TAB 3: EFECTOS */}
          <Tab.Pane eventKey="effects">
            <div className="effects-panel">
              {/* Efectos Básicos */}
              <div className="mb-4">
                <h5 className="mb-3">✨ Efectos Básicos</h5>
                
                <Row>
                  <Col md={6}>
                    <Form.Check
                      type="switch"
                      id="hover-effect"
                      label="🔥 Efecto Hover"
                      checked={cardData.enableHoverEffect || false}
                      onChange={(e) => updateCardData('enableHoverEffect', e.target.checked)}
                      className="mb-3"
                    />
                    <Form.Check
                      type="switch"
                      id="glassmorphism"
                      label="🫧 Glassmorphism"
                      checked={cardData.enableGlassmorphism || false}
                      onChange={(e) => updateCardData('enableGlassmorphism', e.target.checked)}
                      className="mb-3"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="switch"
                      id="animations"
                      label="💫 Animaciones Sutiles"
                      checked={cardData.enableSubtleAnimations || false}
                      onChange={(e) => updateCardData('enableSubtleAnimations', e.target.checked)}
                      className="mb-3"
                    />
                    <Form.Check
                      type="switch"
                      id="patterns"
                      label="📐 Patrones de Fondo"
                      checked={cardData.enableBackgroundPatterns || false}
                      onChange={(e) => updateCardData('enableBackgroundPatterns', e.target.checked)}
                      className="mb-3"
                    />
                  </Col>
                </Row>
              </div>

              {/* Efectos Premium */}
              <div className="mb-4">
                <h5 className="mb-3">🌟 Efectos Premium</h5>
                
                {/* Partículas Inteligentes */}
                <div className="p-3 bg-info bg-opacity-10 rounded mb-4">
                  <h6 className="mb-3 d-flex align-items-center gap-2">
                    <span>✨</span> Partículas Inteligentes
                    <Form.Check
                      type="switch"
                      id="particles"
                      checked={cardData.enableParticles || false}
                      onChange={(e) => updateCardData('enableParticles', e.target.checked)}
                      className="ms-auto"
                    />
                  </h6>
                  
                  {cardData.enableParticles && (
                    <div>
                      <Row>
                        <Col md={4}>
                          <div className="text-center p-3 border rounded cursor-pointer"
                               onClick={() => updateCardData('particleCount', 3)}
                               style={{
                                 background: (cardData.particleCount || 4) <= 3 ? 'rgba(0,123,255,0.1)' : 'transparent',
                                 borderColor: (cardData.particleCount || 4) <= 3 ? '#007bff' : 'rgba(255,255,255,0.2)'
                               }}>
                            <div style={{ fontSize: '2rem' }}>🌙</div>
                            <div style={{ fontWeight: '600' }}>Mínimo</div>
                            <div style={{ fontSize: '12px', opacity: 0.8 }}>3 pts</div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="text-center p-3 border rounded cursor-pointer"
                               onClick={() => updateCardData('particleCount', 5)}
                               style={{
                                 background: (cardData.particleCount || 4) > 3 && (cardData.particleCount || 4) <= 5 ? 'rgba(0,123,255,0.1)' : 'transparent',
                                 borderColor: (cardData.particleCount || 4) > 3 && (cardData.particleCount || 4) <= 5 ? '#007bff' : 'rgba(255,255,255,0.2)'
                               }}>
                            <div style={{ fontSize: '2rem' }}>⚖️</div>
                            <div style={{ fontWeight: '600' }}>Medio</div>
                            <div style={{ fontSize: '12px', opacity: 0.8 }}>5 pts</div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="text-center p-3 border rounded cursor-pointer"
                               onClick={() => updateCardData('particleCount', 8)}
                               style={{
                                 background: (cardData.particleCount || 4) > 5 ? 'rgba(0,123,255,0.1)' : 'transparent',
                                 borderColor: (cardData.particleCount || 4) > 5 ? '#007bff' : 'rgba(255,255,255,0.2)'
                               }}>
                            <div style={{ fontSize: '2rem' }}>✨</div>
                            <div style={{ fontWeight: '600' }}>Máximo</div>
                            <div style={{ fontSize: '12px', opacity: 0.8 }}>8 pts</div>
                          </div>
                        </Col>
                      </Row>
                      
                      <Row className="mt-3">
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Comportamiento</Form.Label>
                            <Form.Select
                              value={cardData.particleType || 'professional'}
                              onChange={(e) => updateCardData('particleType', e.target.value)}
                            >
                              <option value="professional">💼 Profesional - Glow estático elegante</option>
                              <option value="creative">🎨 Creativo - Responde a interacciones</option>
                              <option value="constellation">🌟 Ejecutivo - Flotación sutil premium</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>

                {/* Formas Flotantes */}
                <div className="p-3 bg-warning bg-opacity-10 rounded mb-4">
                  <h6 className="mb-3 d-flex align-items-center gap-2">
                    <span>🔷</span> Formas Flotantes
                    <Form.Check
                      type="switch"
                      id="floating-shapes"
                      checked={cardData.enableFloatingShapes || false}
                      onChange={(e) => updateCardData('enableFloatingShapes', e.target.checked)}
                      className="ms-auto"
                    />
                  </h6>
                  
                  {cardData.enableFloatingShapes && (
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tipo de Formas</Form.Label>
                          <Form.Select
                            value={cardData.floatingShapesType || 'geometric'}
                            onChange={(e) => updateCardData('floatingShapesType', e.target.value)}
                          >
                            <option value="geometric">🔷 Geométricas</option>
                            <option value="organic">🌿 Orgánicas</option>
                            <option value="stars">⭐ Estrellas</option>
                            <option value="particles">✨ Partículas</option>
                            <option value="professional">💼 Profesionales</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Intensidad</Form.Label>
                          <div className="d-flex gap-2">
                            {['Sutil', 'Normal', 'Prominente'].map((level, index) => (
                              <div
                                key={index}
                                className="flex-fill text-center p-2 border rounded cursor-pointer"
                                onClick={() => updateCardData('floatingShapesCount', index + 2)}
                                style={{
                                  background: (cardData.floatingShapesCount || 3) === (index + 2) ? 'rgba(0,123,255,0.1)' : 'transparent',
                                  borderColor: (cardData.floatingShapesCount || 3) === (index + 2) ? '#007bff' : 'rgba(255,255,255,0.2)',
                                  fontSize: '12px'
                                }}
                              >
                                {level}
                              </div>
                            ))}
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  )}
                </div>

                {/* Gradientes Animados */}
                <div className="p-3 bg-success bg-opacity-10 rounded mb-4">
                  <h6 className="mb-3 d-flex align-items-center gap-2">
                    <span>🌊</span> Gradientes Animados
                    <Form.Check
                      type="switch"
                      id="animated-gradients"
                      checked={cardData.enableAnimatedGradient || false}
                      onChange={(e) => updateCardData('enableAnimatedGradient', e.target.checked)}
                      className="ms-auto"
                    />
                  </h6>
                  
                  {cardData.enableAnimatedGradient && (
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tipo de Gradiente</Form.Label>
                          <Form.Select
                            value={cardData.animatedGradientType || 'aurora'}
                            onChange={(e) => updateCardData('animatedGradientType', e.target.value)}
                          >
                            <option value="aurora">🌈 Aurora - Luces boreales</option>
                            <option value="cosmic">🌌 Cósmico - Espacio profundo</option>
                            <option value="ocean">🌊 Océano - Ondas marinas</option>
                            <option value="sunset">🌅 Atardecer - Calidez solar</option>
                            <option value="forest">🌲 Bosque - Naturaleza verde</option>
                            <option value="professional">💼 Profesional - Sutileza elegante</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Velocidad</Form.Label>
                          <div className="d-flex gap-2">
                            {['Lento', 'Normal', 'Rápido'].map((speed, index) => (
                              <div
                                key={index}
                                className="flex-fill text-center p-2 border rounded cursor-pointer"
                                onClick={() => updateCardData('animatedGradientSpeed', index + 2)}
                                style={{
                                  background: (cardData.animatedGradientSpeed || 3) === (index + 2) ? 'rgba(0,123,255,0.1)' : 'transparent',
                                  borderColor: (cardData.animatedGradientSpeed || 3) === (index + 2) ? '#007bff' : 'rgba(255,255,255,0.2)',
                                  fontSize: '12px'
                                }}
                              >
                                {speed}
                              </div>
                            ))}
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  )}
                </div>
              </div>
            </div>
          </Tab.Pane>

          {/* TAB 4: FUENTES */}
          <Tab.Pane eventKey="fonts">
            <div className="fonts-panel">
              <div className="mb-4">
                <h5 className="mb-3">✍️ Tipografía Profesional</h5>
                <p className="text-muted mb-3">Elige la fuente que mejor represente tu personalidad profesional</p>
                
                <div className="d-flex gap-3 flex-wrap">
                  {[
                    {
                      name: 'Playfair Display',
                      key: 'Playfair Display',
                      personality: 'Executive Authority',
                      emoji: '👔',
                      description: 'Liderazgo y sofisticación',
                      ideal: 'CEOs, Directores, Abogados',
                      preview: 'Elegancia Clásica'
                    },
                    {
                      name: 'Montserrat',
                      key: 'Montserrat',  
                      personality: 'Modern Professional',
                      emoji: '🚀',
                      description: 'Innovación y claridad',
                      ideal: 'Tech, Marketing, Startups',
                      preview: 'Modernidad Accesible'
                    },
                    {
                      name: 'Merriweather',
                      key: 'Merriweather',
                      personality: 'Trusted Expert',
                      emoji: '🎓',
                      description: 'Confiabilidad y experiencia',
                      ideal: 'Médicos, Académicos',
                      preview: 'Conocimiento Profundo'
                    },
                    {
                      name: 'Poppins',
                      key: 'Poppins',
                      personality: 'Creative Leader',
                      emoji: '🎨',
                      description: 'Creatividad y dinamismo',
                      ideal: 'Creativos, Coaches',
                      preview: 'Energía Positiva'
                    },
                    {
                      name: 'Source Sans Pro',
                      key: 'Source Sans Pro',
                      personality: 'Technical Precision',
                      emoji: '⚙️',
                      description: 'Precisión y competencia',
                      ideal: 'Ingenieros, Arquitectos',
                      preview: 'Exactitud Profesional'
                    },
                    {
                      name: 'Crimson Text',
                      key: 'Crimson Text',
                      personality: 'Distinguished Scholar',
                      emoji: '📚',
                      description: 'Distinción académica',
                      ideal: 'Profesores, Investigadores',
                      preview: 'Sabiduría Intelectual'
                    }
                  ].map((font, index) => (
                    <div
                      key={index}
                      onClick={() => updateCardData('fontFamily', font.key)}
                      style={{
                        cursor: 'pointer',
                        minWidth: '280px',
                        height: '120px',
                        borderRadius: '12px',
                        border: cardData.fontFamily === font.key 
                          ? '3px solid #00F6FF' 
                          : '2px solid rgba(255,255,255,0.2)',
                        background: cardData.fontFamily === font.key
                          ? 'linear-gradient(135deg, rgba(0,246,255,0.1) 0%, rgba(0,246,255,0.05) 100%)'
                          : 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        transform: cardData.fontFamily === font.key ? 'scale(1.02)' : 'scale(1)'
                      }}
                      className="d-flex flex-column"
                    >
                      <div
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '12px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                          {font.emoji}
                        </div>
                        <div 
                          style={{ 
                            fontFamily: font.key,
                            fontSize: '16px', 
                            fontWeight: '600', 
                            color: 'white',
                            marginBottom: '2px',
                            lineHeight: '1.2'
                          }}
                        >
                          {font.preview}
                        </div>
                        <div style={{ 
                          fontSize: '11px', 
                          color: '#00F6FF',
                          fontWeight: '600',
                          marginBottom: '1px'
                        }}>
                          {font.personality}
                        </div>
                        <div style={{ 
                          fontSize: '9px', 
                          color: 'rgba(255,255,255,0.7)',
                          lineHeight: '1.2'
                        }}>
                          {font.description}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: '6px 8px',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'rgba(255,255,255,0.8)',
                          textAlign: 'center',
                          borderTop: '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        <div style={{ fontSize: '8px', fontWeight: '500' }}>
                          Ideal: {font.ideal}
                        </div>
                      </div>
                      {cardData.fontFamily === font.key && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#00F6FF',
                            color: '#000',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Tab.Pane>

          {/* TAB 5: AVANZADO */}
          <Tab.Pane eventKey="advanced">
            <div className="advanced-panel">
              <div className="mb-4">
                <h5 className="mb-3">⚙️ Configuración Avanzada</h5>
                <p className="text-muted mb-3">Para power users que quieren control total sobre cada detalle</p>
                
                {/* Controles de Intensidad */}
                <div className="mb-4">
                  <h6 className="mb-3 d-flex align-items-center gap-2">
                    <span>🎛️</span> Controles de Intensidad
                  </h6>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Intensidad de Efectos</Form.Label>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-muted">Sutil</span>
                          <Form.Range
                            min={1}
                            max={5}
                            step={1}
                            value={cardData.ambientIntensity || 3}
                            onChange={(e) => updateCardData('ambientIntensity', parseInt(e.target.value))}
                            className="flex-grow-1"
                          />
                          <span className="text-muted">Dramático</span>
                        </div>
                        <small className="text-muted">
                          Nivel {cardData.ambientIntensity || 3} - {
                            (cardData.ambientIntensity || 3) <= 2 ? 'Minimalista' :
                            (cardData.ambientIntensity || 3) <= 3 ? 'Equilibrado' : 'Impactante'
                          }
                        </small>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Opacidad de Ambiente</Form.Label>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-muted">10%</span>
                          <Form.Range
                            min={10}
                            max={100}
                            step={10}
                            value={cardData.ambientOpacity || 50}
                            onChange={(e) => updateCardData('ambientOpacity', parseInt(e.target.value))}
                            className="flex-grow-1"
                          />
                          <span className="text-muted">100%</span>
                        </div>
                        <small className="text-muted">
                          Opacidad: {cardData.ambientOpacity || 50}%
                        </small>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Configuración Manual de Partículas */}
                {cardData.enableParticles && (
                  <div className="mb-4">
                    <h6 className="mb-3 d-flex align-items-center gap-2">
                      <span>⚡</span> Configuración Manual de Partículas
                    </h6>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Velocidad de Animaciones</Form.Label>
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-muted">Lenta</span>
                            <Form.Range
                              min={1}
                              max={5}
                              step={1}
                              value={cardData.animatedGradientSpeed || 3}
                              onChange={(e) => updateCardData('animatedGradientSpeed', parseInt(e.target.value))}
                              className="flex-grow-1"
                            />
                            <span className="text-muted">Rápida</span>
                          </div>
                          <small className="text-muted">
                            Velocidad: {cardData.animatedGradientSpeed || 3}
                          </small>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Intensidad Visual</Form.Label>
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-muted">Suave</span>
                            <Form.Range
                              min={1}
                              max={5}
                              step={1}
                              value={cardData.animatedGradientIntensity || 3}
                              onChange={(e) => updateCardData('animatedGradientIntensity', parseInt(e.target.value))}
                              className="flex-grow-1"
                            />
                            <span className="text-muted">Intensa</span>
                          </div>
                          <small className="text-muted">
                            Intensidad: {cardData.animatedGradientIntensity || 3}
                          </small>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}

                <div className="bg-info bg-opacity-20 p-3 rounded">
                  <small className="text-light" style={{ color: '#ffffff !important' }}>
                    <strong style={{ color: '#0dcaf0' }}>⚙️ Configuración Avanzada:</strong> Estos controles te permiten ajustar cada detalle de tu tarjeta. 
                    Úsalos para lograr exactamente la experiencia visual que buscas.
                  </small>
                </div>
              </div>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Final Tip */}
      <div className="alert alert-success mt-4">
        <strong>💡 Tip Profesional:</strong> Los tabs te permiten navegar fácilmente entre las diferentes opciones. 
        La vista previa se actualiza automáticamente mientras personalizas tu tarjeta.
      </div>
    </div>
  );
}
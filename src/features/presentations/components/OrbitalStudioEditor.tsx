/**
 * Orbital Studio Editor - Presentación central con controles orbitales flotantes
 * CONCEPTO: Adapta TODAS las funcionalidades exactas del sistema de tarjetas digitales
 * Incluye: Temas profesionales + Gradientes premium + Tipografía + Sistema de partículas
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Card, Badge, Row, Col } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import PresentationEditor from './advanced/PresentationEditor';
import { SlideTheme } from '../hooks/useAdvancedSlideEffects';
import { useUniversalContrast } from '@/hooks/useUniversalContrast';

interface OrbitalStudioEditorProps {
  presentation?: any;
  onSave?: (presentation: any) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

interface OrbitalPanel {
  id: string;
  title: string;
  icon: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right';
  component: React.ReactNode;
  size: 'small' | 'medium' | 'large' | 'xlarge';
}

interface PresentationDesignData {
  cardBackgroundColor?: string;
  cardTextColor?: string;
  buttonSecondaryColor?: string;
  buttonSecondaryHoverColor?: string;
  buttonNormalBackgroundColor?: string;
  pageBackgroundColor?: string; // Agregado para completar el sistema de colores
  fontFamily?: string;
  enableHoverEffect?: boolean;
  enableGlassmorphism?: boolean;
  enableSubtleAnimations?: boolean;
  enableBackgroundPatterns?: boolean;
  enableParticles?: boolean;
  particleType?: string;
  particleDensity?: number;
}

const OrbitalStudioEditor: React.FC<OrbitalStudioEditorProps> = ({
  presentation,
  onSave,
  onCancel,
  isEditing = false
}) => {
  const [title, setTitle] = useState(presentation?.title || 'Nueva Presentación');
  const [description, setDescription] = useState(presentation?.description || '');
  const [slides, setSlides] = useState(presentation?.slides || [
    {
      id: 'slide-1',
      type: 'title',
      content: {
        title: 'Mi Presentación',
        subtitle: 'Creada con Indi'
      }
    }
  ]);
  const [selectedTheme, setSelectedTheme] = useState<SlideTheme>(presentation?.theme || 'stellar');
  const [activePanels, setActivePanels] = useState<string[]>(['visual-universe']);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const studioRef = useRef<HTMLDivElement>(null);
  
  // Sistema de diseño adaptado de las tarjetas
  const [designData, setDesignData] = useState<PresentationDesignData>({
    cardBackgroundColor: 'linear-gradient(135deg, #0f0c29, #24243e, #302b63, #1a1a2e)',
    cardTextColor: '#ffffff',
    buttonSecondaryColor: '#00f6ff',
    buttonSecondaryHoverColor: '#00d1db',
    buttonNormalBackgroundColor: '#1f1f1f',
    pageBackgroundColor: '#121212', // Agregado para completar el sistema
    fontFamily: 'Montserrat',
    enableHoverEffect: true,
    enableGlassmorphism: true,
    enableSubtleAnimations: true,
    enableBackgroundPatterns: false,
    enableParticles: true,
    particleType: 'floating',
    particleDensity: 3
  });
  
  const { applyAndUpdate } = useUniversalContrast();
  
  const updateDesignData = (field: string, value: string | boolean | number) => {
    setDesignData(prev => ({ ...prev, [field]: value }));
  };

  // Wrapper para compatibilidad con useUniversalContrast
  const updateDesignDataForContrast = (field: keyof PresentationDesignData, value: string) => {
    setDesignData(prev => ({ ...prev, [field]: value }));
  };

  // SISTEMA COMPLETO DE TEMAS PROFESIONALES (adaptado de tarjetas)
  const professionalThemes = [
    {
      name: 'Corporate Executive',
      emoji: '💼',
      description: 'Autoridad y confianza institucional',
      colors: {
        cardBackgroundColor: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
        cardTextColor: '#ffffff',
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
        buttonSecondaryColor: '#64ffda',
        buttonSecondaryHoverColor: '#4fc3f7',
        buttonNormalBackgroundColor: 'rgba(100,255,218,0.15)'
      }
    }
  ];
  
  const creativeThemes = [
    {
      name: 'Artist Canvas',
      emoji: '🎨',
      description: 'Creatividad, inspiración y expresión artística',
      colors: {
        cardBackgroundColor: 'linear-gradient(135deg, #f8bbd9 0%, #e1bee7 100%)',
        cardTextColor: '#2d1b4e',
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
        buttonSecondaryColor: '#e1bee7',
        buttonSecondaryHoverColor: '#ce93d8',
        buttonNormalBackgroundColor: 'rgba(225,190,231,0.2)'
      }
    }
  ];
  
  // COLECCIONES PREMIUM DE GRADIENTES (15+)
  const gradientCollections = {
    executive: [
      {
        name: 'Diamond',
        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        emoji: '💎',
        description: 'Elegancia cristalina con destellos azul diamante'
      },
      {
        name: 'Platinum',
        gradient: 'linear-gradient(135deg, #4a4a4a 0%, #5a5a5a 50%, #2a2a2a 100%)',
        emoji: '🔱',
        description: 'Lujo metálico plateado con elegancia oscura'
      },
      {
        name: 'Sapphire',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #1e3c72 100%)',
        emoji: '💙',
        description: 'Azul profundo'
      },
      {
        name: 'Emerald',
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        emoji: '💚',
        description: 'Verde esmeralda',
        colors: {
          cardBackgroundColor: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          cardTextColor: '#ffffff',
          buttonSecondaryColor: '#ffffff',
          buttonSecondaryHoverColor: '#f8f9fa',
          buttonNormalBackgroundColor: 'rgba(255,255,255,0.25)'
        }
      },
      {
        name: 'Ruby',
        gradient: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
        emoji: '❤️',
        description: 'Rojo intenso'
      }
    ],
    cosmic: [
      {
        name: 'Galaxy',
        gradient: 'linear-gradient(135deg, #2b1055 0%, #7597de 50%, #c9d6ff 100%)',
        emoji: '🌌',
        description: 'Espacio profundo'
      },
      {
        name: 'Nebula',
        gradient: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
        emoji: '☄️',
        description: 'Neón espacial'
      },
      {
        name: 'Aurora',
        gradient: 'linear-gradient(135deg, #0c4a6e 0%, #1e3a8a 30%, #312e81 60%, #1f2937 100%)',
        emoji: '🌈',
        description: 'Luces boreales sobre cielo nocturno ártico'
      },
      {
        name: 'Stellar',
        gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        emoji: '⭐',
        description: 'Noche estelar'
      },
      {
        name: 'Cosmic',
        gradient: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 50%, #ffecd2 100%)',
        emoji: '🪐',
        description: 'Universo vibrante'
      }
    ],
    nature: [
      {
        name: 'Sunset',
        gradient: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 30%, #ea580c 60%, #451a03 100%)',
        emoji: '🌅',
        description: 'Atardecer ardiente con crepúsculo'
      },
      {
        name: 'Ocean',
        gradient: 'linear-gradient(135deg, #667db6 0%, #0082c8 50%, #41b883 100%)',
        emoji: '🌊',
        description: 'Azul oceánico'
      },
      {
        name: 'Forest',
        gradient: 'linear-gradient(135deg, #1b4332 0%, #2d5016 50%, #081c15 100%)',
        emoji: '🌲',
        description: 'Bosque profundo y frondoso'
      },
      {
        name: 'Desert',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
        emoji: '🏜️',
        description: 'Arena dorada'
      },
      {
        name: 'Volcano',
        gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 50%, #ff6b6b 100%)',
        emoji: '🌋',
        description: 'Fuego ardiente'
      }
    ]
  };
  
  // SISTEMA DE TIPOGRAFÍA PROFESIONAL (6 opciones especializadas)
  const professionalFonts = [
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
  ];

  // Tipos de slides disponibles
  const slideTypes = [
    { id: 'title', name: 'Título', icon: '📋', description: 'Slide de presentación' },
    { id: 'content', name: 'Contenido', icon: '📝', description: 'Texto principal' },
    { id: 'image', name: 'Imagen', icon: '🖼️', description: 'Visual con descripción' },
    { id: 'bullets', name: 'Lista', icon: '📄', description: 'Puntos clave' },
    { id: 'quote', name: 'Cita', icon: '💬', description: 'Cita inspiracional' },
    { id: 'chart', name: 'Gráfico', icon: '📊', description: 'Datos visuales' }
  ];

  // DEFINIR PANELES ORBITALES CON FUNCIONALIDADES COMPLETAS
  const orbitalPanels: OrbitalPanel[] = [
    {
      id: 'visual-universe',
      title: 'Visual Universe',
      icon: '🌌',
      position: 'top-left',
      size: 'xlarge',
      component: (
        <div className="orbital-panel-content" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {/* TEMAS PROFESIONALES */}
          <div className="mb-4">
            <h6 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
              <span>🎨</span> Temas Profesionales
            </h6>
            <p className="text-white-50 mb-3" style={{ fontSize: '0.85rem' }}>
              Selecciona un tema que refleje tu personalidad profesional
            </p>
            
            <div className="d-flex gap-2 flex-wrap mb-3">
              {professionalThemes.map((theme, index) => (
                <div
                  key={index}
                  data-theme={theme.name}
                  className="theme-card d-flex flex-column align-items-center text-center"
                  style={{
                    width: '90px',
                    padding: '8px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    background: theme.colors.cardBackgroundColor,
                    color: theme.colors.cardTextColor,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => {
                    const themeColors = {
                      cardBackgroundColor: theme.colors.cardBackgroundColor,
                      cardTextColor: theme.colors.cardTextColor,
                      buttonSecondaryColor: theme.colors.buttonSecondaryColor,
                      buttonSecondaryHoverColor: theme.colors.buttonSecondaryHoverColor,
                      buttonNormalBackgroundColor: theme.colors.buttonNormalBackgroundColor
                    };
                    applyAndUpdate(themeColors, updateDesignDataForContrast);
                    const element = document.querySelector(`[data-theme="${theme.name}"]`) as HTMLElement;
                    if (element) {
                      element.style.transform = 'scale(0.95)';
                      setTimeout(() => {
                        element.style.transform = 'scale(1)';
                      }, 150);
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                  title={theme.description}
                >
                  <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{theme.emoji}</div>
                  <small style={{ fontSize: '9px', fontWeight: '600', lineHeight: '1.1' }}>
                    {theme.name.split(' ')[0]}
                  </small>
                </div>
              ))}
            </div>
            
            <div className="d-flex gap-2 flex-wrap mb-3">
              {creativeThemes.map((theme, index) => (
                <div
                  key={index}
                  data-theme={theme.name}
                  className="theme-card d-flex flex-column align-items-center text-center"
                  style={{
                    width: '90px',
                    padding: '8px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    background: theme.colors.cardBackgroundColor,
                    color: theme.colors.cardTextColor,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => {
                    const themeColors = {
                      cardBackgroundColor: theme.colors.cardBackgroundColor,
                      cardTextColor: theme.colors.cardTextColor,
                      buttonSecondaryColor: theme.colors.buttonSecondaryColor,
                      buttonSecondaryHoverColor: theme.colors.buttonSecondaryHoverColor,
                      buttonNormalBackgroundColor: theme.colors.buttonNormalBackgroundColor
                    };
                    applyAndUpdate(themeColors, updateDesignDataForContrast);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                  title={theme.description}
                >
                  <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{theme.emoji}</div>
                  <small style={{ fontSize: '9px', fontWeight: '600', lineHeight: '1.1' }}>
                    {theme.name.split(' ')[0]}
                  </small>
                </div>
              ))}
            </div>
          </div>
          
          {/* COLECCIONES PREMIUM DE GRADIENTES */}
          <div className="mb-4">
            <h6 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
              <span>✨</span> Colección de Gradientes
            </h6>
            
            {/* Executive Collection */}
            <div className="mb-3">
              <div className="text-white-50 mb-2" style={{ fontSize: '0.8rem' }}>
                🏆 Colección Ejecutiva
              </div>
              <div className="d-flex gap-2 flex-wrap">
                {gradientCollections.executive.map((bg, index) => (
                  <div
                    key={index}
                    className="gradient-card"
                    style={{
                      width: '70px',
                      height: '50px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: designData.cardBackgroundColor === bg.gradient ? '2px solid #00f6ff' : '1px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      background: bg.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}
                    onClick={() => {
                      if (bg.colors) {
                        const themeColors = {
                          cardBackgroundColor: bg.colors.cardBackgroundColor,
                          cardTextColor: bg.colors.cardTextColor,
                          buttonSecondaryColor: bg.colors.buttonSecondaryColor,
                          buttonSecondaryHoverColor: bg.colors.buttonSecondaryHoverColor,
                          buttonNormalBackgroundColor: bg.colors.buttonNormalBackgroundColor
                        };
                        applyAndUpdate(themeColors, updateDesignDataForContrast);
                      } else {
                        updateDesignData('cardBackgroundColor', bg.gradient);
                      }
                    }}
                    title={bg.description}
                  >
                    {bg.emoji}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Cosmic Collection */}
            <div className="mb-3">
              <div className="text-white-50 mb-2" style={{ fontSize: '0.8rem' }}>
                🌌 Colección Cósmica
              </div>
              <div className="d-flex gap-2 flex-wrap">
                {gradientCollections.cosmic.map((bg, index) => (
                  <div
                    key={index}
                    style={{
                      width: '70px',
                      height: '50px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: designData.cardBackgroundColor === bg.gradient ? '2px solid #00f6ff' : '1px solid rgba(255,255,255,0.1)',
                      background: bg.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}
                    onClick={() => updateDesignData('cardBackgroundColor', bg.gradient)}
                    title={bg.description}
                  >
                    {bg.emoji}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Nature Collection */}
            <div className="mb-3">
              <div className="text-white-50 mb-2" style={{ fontSize: '0.8rem' }}>
                🌿 Colección Natural
              </div>
              <div className="d-flex gap-2 flex-wrap">
                {gradientCollections.nature.map((bg, index) => (
                  <div
                    key={index}
                    style={{
                      width: '70px',
                      height: '50px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: designData.cardBackgroundColor === bg.gradient ? '2px solid #00f6ff' : '1px solid rgba(255,255,255,0.1)',
                      background: bg.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}
                    onClick={() => updateDesignData('cardBackgroundColor', bg.gradient)}
                    title={bg.description}
                  >
                    {bg.emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* EFECTOS VISUALES */}
          <div>
            <h6 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
              <span>✨</span> Efectos Visuales
            </h6>
            <Row>
              <Col xs={6}>
                <Form.Check
                  type="switch"
                  id="hover-effect"
                  label="Hover"
                  checked={designData.enableHoverEffect || false}
                  onChange={(e) => updateDesignData('enableHoverEffect', e.target.checked)}
                  className="mb-2 text-white"
                  style={{ fontSize: '0.8rem' }}
                />
                <Form.Check
                  type="switch"
                  id="glassmorphism"
                  label="Glassmorphism"
                  checked={designData.enableGlassmorphism || false}
                  onChange={(e) => updateDesignData('enableGlassmorphism', e.target.checked)}
                  className="mb-2 text-white"
                  style={{ fontSize: '0.8rem' }}
                />
              </Col>
              <Col xs={6}>
                <Form.Check
                  type="switch"
                  id="animations"
                  label="Animaciones"
                  checked={designData.enableSubtleAnimations || false}
                  onChange={(e) => updateDesignData('enableSubtleAnimations', e.target.checked)}
                  className="mb-2 text-white"
                  style={{ fontSize: '0.8rem' }}
                />
                <Form.Check
                  type="switch"
                  id="particles"
                  label="Partículas"
                  checked={designData.enableParticles || false}
                  onChange={(e) => updateDesignData('enableParticles', e.target.checked)}
                  className="mb-2 text-white"
                  style={{ fontSize: '0.8rem' }}
                />
              </Col>
            </Row>
            
            {/* Controles de partículas */}
            {designData.enableParticles && (
              <div className="mt-3 p-2" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <Form.Group className="mb-2">
                  <Form.Label className="text-white" style={{ fontSize: '0.8rem' }}>Tipo</Form.Label>
                  <Form.Select
                    size="sm"
                    value={designData.particleType || 'floating'}
                    onChange={(e) => updateDesignData('particleType', e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                  >
                    <option value="floating">🎈 Flotantes</option>
                    <option value="constellation">⭐ Constelación</option>
                    <option value="professional">💼 Profesional</option>
                    <option value="creative">🎨 Creativo</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="text-white" style={{ fontSize: '0.8rem' }}>Densidad</Form.Label>
                  <Form.Range
                    min={1}
                    max={5}
                    step={1}
                    value={designData.particleDensity || 3}
                    onChange={(e) => updateDesignData('particleDensity', parseInt(e.target.value))}
                  />
                  <small className="text-white-50">
                    Nivel {designData.particleDensity || 3} - {
                      (designData.particleDensity || 3) <= 2 ? 'Minimalista' :
                      (designData.particleDensity || 3) <= 3 ? 'Equilibrado' : 'Dramático'
                    }
                  </small>
                </Form.Group>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'typography-neural',
      title: 'Typography Neural',
      icon: '✍️',
      position: 'top-right',
      size: 'large',
      component: (
        <div className="orbital-panel-content" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <h6 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
            <span>✍️</span> Tipografía Profesional
          </h6>
          <p className="text-white-50 mb-3" style={{ fontSize: '0.85rem' }}>
            Elige la fuente que mejor represente tu personalidad profesional
          </p>
          
          <div className="d-flex flex-column gap-2">
            {professionalFonts.map((font, index) => (
              <div
                key={index}
                onClick={() => updateDesignData('fontFamily', font.key)}
                style={{
                  cursor: 'pointer',
                  width: '100%',
                  height: '80px',
                  borderRadius: '10px',
                  border: designData.fontFamily === font.key 
                    ? '2px solid #00F6FF' 
                    : '1px solid rgba(255,255,255,0.2)',
                  background: designData.fontFamily === font.key
                    ? 'linear-gradient(135deg, rgba(0,246,255,0.1) 0%, rgba(0,246,255,0.05) 100%)'
                    : 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  transform: designData.fontFamily === font.key ? 'scale(1.02)' : 'scale(1)',
                  padding: '8px'
                }}
                className="d-flex align-items-center"
              >
                <div style={{ fontSize: '1.2rem', marginRight: '8px' }}>
                  {font.emoji}
                </div>
                <div className="flex-grow-1">
                  <div 
                    style={{ 
                      fontFamily: font.key,
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: 'white',
                      marginBottom: '2px',
                      lineHeight: '1.2'
                    }}
                  >
                    {font.preview}
                  </div>
                  <div style={{ 
                    fontSize: '9px', 
                    color: '#00F6FF',
                    fontWeight: '600',
                    marginBottom: '1px'
                  }}>
                    {font.personality}
                  </div>
                  <div style={{ 
                    fontSize: '8px', 
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: '1.2'
                  }}>
                    {font.ideal}
                  </div>
                </div>
                {designData.fontFamily === font.key && (
                  <div
                    style={{
                      background: '#00F6FF',
                      color: '#000',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
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
      )
    },
    {
      id: 'slide-architecture',
      title: 'Slide Architecture',
      icon: '🎯',
      position: 'left',
      size: 'medium',
      component: (
        <div className="orbital-panel-content">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-white fw-bold mb-0">📄 Slides ({slides.length})</h6>
            <Button 
              size="sm" 
              variant="primary"
              style={{ borderRadius: '8px', fontSize: '0.7rem' }}
              onClick={() => {
                const newSlide = {
                  id: `slide-${Date.now()}`,
                  type: 'content',
                  content: { title: 'Nuevo Slide', text: 'Contenido...' }
                };
                setSlides([...slides, newSlide]);
              }}
            >
              + Agregar
            </Button>
          </div>
          
          <div className="slides-list">
            {slides.map((slide, index) => (
              <motion.div
                key={slide.id}
                className="slide-item"
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary" style={{ fontSize: '0.7rem' }}>
                      {index + 1}
                    </span>
                    <span className="text-white" style={{ fontSize: '0.8rem' }}>
                      {slide.content?.title || `Slide ${index + 1}`}
                    </span>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setSlides(slides.filter(s => s.id !== slide.id))}
                    style={{ 
                      fontSize: '0.6rem', 
                      padding: '0.2rem 0.4rem',
                      borderRadius: '4px'
                    }}
                  >
                    ✕
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'interstellar-connections',
      title: 'Interstellar Connections',
      icon: '🔗',
      position: 'right',
      size: 'medium',
      component: (
        <div className="orbital-panel-content">
          <h6 className="text-white fw-bold mb-3">🔗 Conexiones Interestelares</h6>
          <p className="text-white-50 mb-3" style={{ fontSize: '0.85rem' }}>
            Agrega enlaces y contactos para conectar con tu audiencia
          </p>
          
          <Form.Group className="mb-3">
            <Form.Label className="text-white small">LinkedIn</Form.Label>
            <Form.Control
              size="sm"
              placeholder="linkedin.com/in/username"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.8rem'
              }}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className="text-white small">Twitter/X</Form.Label>
            <Form.Control
              size="sm"
              placeholder="@username"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.8rem'
              }}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className="text-white small">Sitio Web</Form.Label>
            <Form.Control
              size="sm"
              placeholder="www.tusitio.com"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.8rem'
              }}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className="text-white small">Email</Form.Label>
            <Form.Control
              size="sm"
              type="email"
              placeholder="contacto@email.com"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.8rem'
              }}
            />
          </Form.Group>
          
          <div className="bg-info bg-opacity-10 p-2 rounded">
            <small className="text-white-50">
              💡 Los enlaces aparecen automáticamente en la presentación final
            </small>
          </div>
        </div>
      )
    },
    {
      id: 'add-slide',
      title: 'Agregar Slide',
      icon: '➕',
      position: 'bottom-left',
      size: 'medium',
      component: (
        <div className="orbital-panel-content">
          <h6 className="text-white fw-bold mb-3">➕ Agregar Slide</h6>
          <div className="slide-types">
            {slideTypes.map((type) => (
              <motion.div
                key={type.id}
                className="slide-type-option"
                onClick={() => {
                  const newSlide = {
                    id: `slide-${Date.now()}`,
                    type: type.id,
                    content: type.id === 'title' 
                      ? { title: 'Nuevo Título', subtitle: 'Subtítulo' }
                      : type.id === 'bullets'
                      ? { title: 'Lista de Puntos', bullets: ['Punto 1', 'Punto 2', 'Punto 3'] }
                      : { title: 'Nuevo Slide', text: 'Contenido del slide...' }
                  };
                  setSlides([...slides, newSlide]);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span style={{ fontSize: '1rem' }}>{type.icon}</span>
                  <span className="text-white fw-semibold" style={{ fontSize: '0.8rem' }}>
                    {type.name}
                  </span>
                </div>
                <small className="text-white-50" style={{ fontSize: '0.7rem' }}>
                  {type.description}
                </small>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'orbital-configuration',
      title: 'Orbital Configuration',
      icon: '⚙️',
      position: 'bottom-right',
      size: 'medium',
      component: (
        <div className="orbital-panel-content">
          <h6 className="text-white fw-bold mb-3">⚙️ Configuración</h6>
          <Form.Group className="mb-3">
            <Form.Label className="text-white small">Título</Form.Label>
            <Form.Control
              size="sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.8rem'
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-white small">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              size="sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.8rem',
                resize: 'none'
              }}
            />
          </Form.Group>
          
          {/* Sistema COMPLETO de controles manuales de color (copiado de tarjetas) */}
          <div className="mt-4">
            <h6 className="text-white fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
              🎨 Color Master Control
            </h6>
            
            {/* Función helper para extraer color de gradiente */}
            <div className="color-controls-grid">
              {/* Fila 1: Fondo y Texto */}
              <Row className="g-2 mb-2">
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label className="text-white d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                      🎨 Fondo
                    </Form.Label>
                    <div className="d-flex gap-1 align-items-center">
                      <Form.Control
                        type="color"
                        size="sm"
                        value={(() => {
                          const color = designData.cardBackgroundColor || '#2c2c2c';
                          if (color.startsWith('#')) return color;
                          if (color.includes('gradient')) {
                            const match = color.match(/#[0-9a-fA-F]{6}/);
                            return match ? match[0] : '#2c2c2c';
                          }
                          return '#2c2c2c';
                        })()}
                        onChange={(e) => updateDesignData('cardBackgroundColor', e.target.value)}
                        style={{ width: '35px', height: '28px', cursor: 'pointer', borderRadius: '6px' }}
                      />
                      <div 
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          background: designData.cardBackgroundColor || '#2c2c2c',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label className="text-white d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                      📝 Texto
                    </Form.Label>
                    <div className="d-flex gap-1 align-items-center">
                      <Form.Control
                        type="color"
                        size="sm"
                        value={designData.cardTextColor || '#ffffff'}
                        onChange={(e) => updateDesignData('cardTextColor', e.target.value)}
                        style={{ width: '35px', height: '28px', cursor: 'pointer', borderRadius: '6px' }}
                      />
                      <div 
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          background: designData.cardTextColor || '#ffffff',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              {/* Fila 2: Botón Principal y Botón Hover */}
              <Row className="g-2 mb-2">
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label className="text-white d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                      🔵 Botón Principal
                    </Form.Label>
                    <div className="d-flex gap-1 align-items-center">
                      <Form.Control
                        type="color"
                        size="sm"
                        value={designData.buttonSecondaryColor || '#00f6ff'}
                        onChange={(e) => updateDesignData('buttonSecondaryColor', e.target.value)}
                        style={{ width: '35px', height: '28px', cursor: 'pointer', borderRadius: '6px' }}
                      />
                      <div 
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          background: designData.buttonSecondaryColor || '#00f6ff',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label className="text-white d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                      🔷 Botón Hover
                    </Form.Label>
                    <div className="d-flex gap-1 align-items-center">
                      <Form.Control
                        type="color"
                        size="sm"
                        value={designData.buttonSecondaryHoverColor || '#00d1db'}
                        onChange={(e) => updateDesignData('buttonSecondaryHoverColor', e.target.value)}
                        style={{ width: '35px', height: '28px', cursor: 'pointer', borderRadius: '6px' }}
                      />
                      <div 
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          background: designData.buttonSecondaryHoverColor || '#00d1db',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              {/* Fila 3: Botón Fondo y Color de Página */}
              <Row className="g-2 mb-3">
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label className="text-white d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                      ⭕ Botón Fondo
                    </Form.Label>
                    <div className="d-flex gap-1 align-items-center">
                      <Form.Control
                        type="color"
                        size="sm"
                        value={designData.buttonNormalBackgroundColor || '#1f1f1f'}
                        onChange={(e) => updateDesignData('buttonNormalBackgroundColor', e.target.value)}
                        style={{ width: '35px', height: '28px', cursor: 'pointer', borderRadius: '6px' }}
                      />
                      <div 
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          background: designData.buttonNormalBackgroundColor || '#1f1f1f',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label className="text-white d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                      🌌 Página
                    </Form.Label>
                    <div className="d-flex gap-1 align-items-center">
                      <Form.Control
                        type="color"
                        size="sm"
                        value={designData.pageBackgroundColor || '#121212'}
                        onChange={(e) => updateDesignData('pageBackgroundColor', e.target.value)}
                        style={{ width: '35px', height: '28px', cursor: 'pointer', borderRadius: '6px' }}
                      />
                      <div 
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          background: designData.pageBackgroundColor || '#121212',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              {/* Botón de reset */}
              <div className="d-flex justify-content-center">
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => {
                    updateDesignData('cardBackgroundColor', 'linear-gradient(135deg, #0f0c29, #24243e, #302b63, #1a1a2e)');
                    updateDesignData('cardTextColor', '#ffffff');
                    updateDesignData('buttonSecondaryColor', '#00f6ff');
                    updateDesignData('buttonSecondaryHoverColor', '#00d1db');
                    updateDesignData('buttonNormalBackgroundColor', '#1f1f1f');
                    updateDesignData('pageBackgroundColor', '#121212');
                  }}
                  style={{ 
                    borderRadius: '8px', 
                    fontSize: '0.7rem',
                    padding: '0.3rem 0.8rem'
                  }}
                >
                  🔄 Reset Colores
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'master-view',
      title: 'Master View',
      icon: '🌎',
      position: 'bottom-left',
      size: 'large',
      component: (
        <div className="orbital-panel-content">
          <h6 className="text-white fw-bold mb-3">🌎 Vista Maestra</h6>
          
          {/* Vista previa rápida */}
          <div className="mb-3">
            <div className="text-white-50 mb-2" style={{ fontSize: '0.8rem' }}>Vista Previa</div>
            <div 
              style={{
                width: '100%',
                height: '80px',
                background: designData.cardBackgroundColor || 'linear-gradient(135deg, #0f0c29, #24243e)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: designData.cardTextColor || '#ffffff',
                fontFamily: designData.fontFamily || 'Montserrat',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              Preview de la Presentación
            </div>
          </div>
          
          {/* Estadísticas */}
          <div className="mb-3">
            <div className="text-white-50 mb-2" style={{ fontSize: '0.8rem' }}>Estadísticas</div>
            <div className="d-flex justify-content-between text-white" style={{ fontSize: '0.75rem' }}>
              <span>Slides: {slides.length}</span>
              <span>Tema: {selectedTheme}</span>
            </div>
            <div className="d-flex justify-content-between text-white" style={{ fontSize: '0.75rem' }}>
              <span>Fuente: {designData.fontFamily}</span>
              <span>Efectos: {designData.enableParticles ? 'ON' : 'OFF'}</span>
            </div>
          </div>
          
          {/* Acciones rápidas */}
          <div>
            <div className="text-white-50 mb-2" style={{ fontSize: '0.8rem' }}>Acciones Rápidas</div>
            <div className="d-flex flex-column gap-2">
              <Button
                variant="outline-light"
                size="sm"
                style={{ borderRadius: '8px', fontSize: '0.75rem' }}
                onClick={() => {
                  const newSlide = {
                    id: `slide-${Date.now()}`,
                    type: 'content',
                    content: { title: 'Nuevo Slide', text: 'Contenido...' }
                  };
                  setSlides([...slides, newSlide]);
                }}
              >
                ➕ Añadir Slide Rápido
              </Button>
              <Button
                variant="outline-info"
                size="sm"
                style={{ borderRadius: '8px', fontSize: '0.75rem' }}
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? '🗗' : '⛶'} {isFullscreen ? 'Ventana' : 'Pantalla Completa'}
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleSave = async () => {
    const presentationData = {
      id: presentation?.id || `pres-${Date.now()}`,
      title,
      description,
      slides,
      theme: selectedTheme,
      designData, // Incluir todos los datos de diseño
      isPublic: false,
      createdAt: presentation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      let response;
      if (isEditing && presentation?.id) {
        response = await fetch(`/api/presentations/${presentation.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(presentationData),
          credentials: 'same-origin'
        });
      } else {
        response = await fetch('/api/presentations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(presentationData),
          credentials: 'same-origin'
        });
      }

      if (response.ok) {
        const result = await response.json();
        onSave?.(result.presentation || presentationData);
      }
    } catch (error) {
      console.error('Error saving presentation:', error);
    }
  };

  const togglePanel = (panelId: string) => {
    setActivePanels(prev => 
      prev.includes(panelId) 
        ? prev.filter(id => id !== panelId)
        : [...prev, panelId]
    );
  };

  const getPositionStyle = (position: string, size: string) => {
    const baseSize = size === 'small' ? '280px' : 
                    size === 'medium' ? '350px' : 
                    size === 'large' ? '420px' : 
                    size === 'xlarge' ? '500px' : '320px';
    
    switch (position) {
      case 'top-left':
        return { top: '20px', left: '20px', width: baseSize };
      case 'top-right':
        return { top: '20px', right: '20px', width: baseSize };
      case 'bottom-left':
        return { bottom: '20px', left: '20px', width: baseSize };
      case 'bottom-right':
        return { bottom: '20px', right: '20px', width: baseSize };
      case 'left':
        return { top: '50%', left: '20px', transform: 'translateY(-50%)', width: baseSize };
      case 'right':
        return { top: '50%', right: '20px', transform: 'translateY(-50%)', width: baseSize };
      default:
        return { top: '20px', left: '20px', width: baseSize };
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .orbital-studio {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
        }

        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .central-presentation {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60%;
          height: 70%;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(0, 246, 255, 0.3);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .central-presentation.fullscreen {
          width: 90%;
          height: 90%;
        }

        .orbital-panel {
          position: fixed;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          padding: 1.5rem;
          z-index: 1000;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .orbital-panel-trigger {
          position: fixed;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1001;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0, 246, 255, 0.4);
        }

        .orbital-panel-trigger:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 246, 255, 0.6);
        }

        .orbital-panel-trigger.active {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          box-shadow: 0 0 20px rgba(0, 246, 255, 0.5);
        }

        .orbital-panel-content {
          max-height: 500px;
          overflow-y: auto;
        }
        
        .orbital-panel-content::-webkit-scrollbar {
          width: 6px;
        }
        
        .orbital-panel-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .orbital-panel-content::-webkit-scrollbar-thumb {
          background: rgba(0, 246, 255, 0.5);
          border-radius: 3px;
        }
        
        .orbital-panel-content::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 246, 255, 0.7);
        }

        .control-dock {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 246, 255, 0.3);
          border-radius: 25px;
          padding: 0.75rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          z-index: 1002;
          min-width: 600px;
          box-shadow: 0 8px 32px rgba(0, 246, 255, 0.1);
        }

        .theme-grid {
          display: grid;
          gap: 0.5rem;
        }

        .slides-list {
          max-height: 250px;
          overflow-y: auto;
        }

        .slide-types {
          max-height: 300px;
          overflow-y: auto;
        }
      `}} />

      <div className="orbital-studio" ref={studioRef}>
        {/* Presentación Central */}
        <div className={`central-presentation ${isFullscreen ? 'fullscreen' : ''}`}>
          <PresentationEditor
            slides={slides}
            onSlidesChange={setSlides}
            selectedTheme={selectedTheme}
            presentationTitle={title}
            onTitleChange={setTitle}
            designData={designData} // Pasar datos de diseño al editor
          />
        </div>

        {/* Paneles Orbitales */}
        <AnimatePresence>
          {orbitalPanels.map((panel) => {
            const isActive = activePanels.includes(panel.id);
            const positionStyle = getPositionStyle(panel.position, panel.size);
            
            return (
              <React.Fragment key={panel.id}>
                {/* Trigger Button */}
                <motion.button
                  className={`orbital-panel-trigger ${isActive ? 'active' : ''}`}
                  style={{
                    ...positionStyle,
                    width: '50px',
                    height: '50px'
                  }}
                  onClick={() => togglePanel(panel.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {panel.icon}
                </motion.button>

                {/* Panel Content */}
                {isActive && (
                  <motion.div
                    className="orbital-panel"
                    style={{
                      ...positionStyle,
                      marginTop: panel.position.includes('top') ? '60px' : undefined,
                      marginBottom: panel.position.includes('bottom') ? '60px' : undefined,
                      marginLeft: panel.position.includes('left') ? '60px' : undefined,
                      marginRight: panel.position.includes('right') ? '60px' : undefined
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-white fw-bold mb-0">
                        {panel.icon} {panel.title}
                      </h6>
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => togglePanel(panel.id)}
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                      >
                        ✕
                      </Button>
                    </div>
                    {panel.component}
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </AnimatePresence>

        {/* Control Dock Mejorado */}
        <div className="control-dock">
          <div className="d-flex align-items-center gap-2">
            <Badge 
              style={{ 
                background: 'linear-gradient(135deg, #00f6ff, #0072ff)', 
                color: 'white',
                fontSize: '0.7rem',
                padding: '0.25rem 0.5rem'
              }}
            >
              {slides.length} slides
            </Badge>
            <Badge 
              style={{ 
                background: 'rgba(255, 255, 255, 0.2)', 
                color: 'white',
                fontSize: '0.7rem',
                padding: '0.25rem 0.5rem'
              }}
            >
              {designData.fontFamily}
            </Badge>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              style={{ borderRadius: '12px', fontSize: '0.8rem' }}
            >
              {isFullscreen ? '🗗' : '⛶'} {isFullscreen ? 'Ventana' : 'Completa'}
            </Button>
            
            <Button
              variant="outline-light"
              size="sm"
              onClick={onCancel}
              style={{ borderRadius: '12px', fontSize: '0.8rem' }}
            >
              ← Cancelar
            </Button>
            
            <Button
              variant="success"
              size="sm"
              onClick={handleSave}
              style={{ 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00f6ff, #0072ff)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}
            >
              ✨ {isEditing ? 'Actualizar' : 'Guardar'} Presentación
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrbitalStudioEditor;
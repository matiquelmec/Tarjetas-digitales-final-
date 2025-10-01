'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { PRESENTATION_THEMES, PresentationTheme } from '../types/themes';
import EnhancedSlidePreview from './EnhancedSlidePreview';

interface ThemeSelectorProps {
  onThemeChange?: (theme: PresentationTheme) => void;
  className?: string;
  selectedThemeId?: string;
  showPreviewEffects?: boolean;
  compactMode?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  onThemeChange, 
  className = '',
  selectedThemeId,
  showPreviewEffects = true,
  compactMode = false
}) => {
  // Estado para tema seleccionado
  const [selectedTheme, setSelectedTheme] = useState<PresentationTheme | null>(
    selectedThemeId 
      ? PRESENTATION_THEMES.find(t => t.id === selectedThemeId) || PRESENTATION_THEMES[0]
      : PRESENTATION_THEMES[0]
  );
  
  // Estado para categoría activa
  const [activeCategory, setActiveCategory] = useState<string>('professional');
  
  // Estado para hover de preview
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  // Manejar selección de tema
  const handleThemeSelect = (theme: PresentationTheme) => {
    setSelectedTheme(theme);
    if (onThemeChange) {
      onThemeChange(theme);
    }
  };

  // Verificar acceso a tema (todos disponibles por ahora)
  const canAccessTheme = (theme: PresentationTheme): boolean => {
    return true; // Todos los temas disponibles
  };

  // Filtrar temas por categoría
  const getThemesByCategory = (category: string): PresentationTheme[] => {
    return PRESENTATION_THEMES.filter(theme => theme.category === category);
  };

  // Obtener contenido de muestra para preview
  const getSampleContent = () => ({
    title: 'Preview Slide',
    subtitle: 'Efectos en tiempo real',
    content: ['Contenido de ejemplo', 'Con efectos premium'],
    layout: 'title' as const
  });

  // Renderizar tarjeta de tema con preview de efectos
  const renderThemeCard = (theme: PresentationTheme) => {
    const isSelected = selectedTheme?.id === theme.id;
    const isHovered = hoveredTheme === theme.id;
    const hasAccess = canAccessTheme(theme);

    return (
      <Col key={theme.id} xs={12} sm={6} md={4} lg={compactMode ? 2 : 3} className="mb-4">
        <div
          className={`theme-card ${isSelected ? 'selected' : ''} ${!hasAccess ? 'locked' : ''} ${isHovered ? 'hovered' : ''}`}
          onClick={() => hasAccess && handleThemeSelect(theme)}
          onMouseEnter={() => setHoveredTheme(theme.id)}
          onMouseLeave={() => setHoveredTheme(null)}
          style={{
            position: 'relative',
            borderRadius: theme.slide.borderRadius,
            overflow: 'hidden',
            cursor: hasAccess ? 'pointer' : 'not-allowed',
            border: isSelected 
              ? `3px solid ${theme.colors.accent}` 
              : `2px solid ${theme.colors.primary}20`,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: compactMode ? '180px' : '220px',
            transform: isSelected ? 'translateY(-4px) scale(1.02)' : 
                      isHovered ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: isSelected 
              ? `0 12px 40px ${theme.colors.accent}30, 0 0 0 1px ${theme.colors.accent}40`
              : isHovered 
                ? `0 8px 30px ${theme.colors.primary}20`
                : '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Preview de efectos en vivo */}
          {showPreviewEffects && (
            <div style={{
              height: compactMode ? '120px' : '140px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <EnhancedSlidePreview
                theme={theme}
                content={getSampleContent()}
                isActive={isHovered || isSelected}
                enableInteraction={false}
                className="theme-preview-slide"
                style={{
                  height: '100%',
                  transform: `scale(${compactMode ? 0.7 : 0.8})`,
                  transformOrigin: 'center center'
                }}
              />
            </div>
          )}

          {/* Información del tema */}
          <div style={{
            padding: compactMode ? '0.75rem' : '1rem',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {/* Header con emoji y nombre */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{ 
                fontSize: compactMode ? '1.2rem' : '1.5rem',
                filter: !hasAccess ? 'grayscale(100%)' : 'none'
              }}>
                {theme.emoji}
              </div>
              <div>
                <div style={{ 
                  color: '#2C3E50',
                  fontSize: compactMode ? '0.8rem' : '0.9rem',
                  fontWeight: '700',
                  opacity: !hasAccess ? 0.5 : 1,
                  lineHeight: 1.2
                }}>
                  {theme.name}
                </div>
                <Badge 
                  bg={theme.category === 'professional' ? 'primary' : 
                      theme.category === 'creative' ? 'success' :
                      theme.category === 'executive' ? 'dark' :
                      theme.category === 'tech' ? 'info' : 'secondary'}
                  style={{ 
                    fontSize: '0.6rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {theme.category}
                </Badge>
              </div>
            </div>

            {/* Descripción */}
            {!compactMode && (
              <div style={{ 
                color: '#666666',
                fontSize: '0.7rem',
                lineHeight: '1.3',
                marginBottom: '0.75rem',
                opacity: !hasAccess ? 0.5 : 0.8
              }}>
                {theme.description}
              </div>
            )}

            {/* Paleta de colores */}
            <div style={{ 
              display: 'flex', 
              gap: '3px', 
              justifyContent: 'center',
              marginBottom: compactMode ? '0.25rem' : '0.5rem'
            }}>
              <div style={{ 
                width: compactMode ? '12px' : '14px', 
                height: compactMode ? '12px' : '14px', 
                borderRadius: '50%', 
                backgroundColor: theme.colors.primary,
                opacity: !hasAccess ? 0.5 : 1,
                border: '1px solid rgba(255, 255, 255, 0.8)'
              }} />
              <div style={{ 
                width: compactMode ? '12px' : '14px', 
                height: compactMode ? '12px' : '14px', 
                borderRadius: '50%', 
                backgroundColor: theme.colors.secondary,
                opacity: !hasAccess ? 0.5 : 1,
                border: '1px solid rgba(255, 255, 255, 0.8)'
              }} />
              <div style={{ 
                width: compactMode ? '12px' : '14px', 
                height: compactMode ? '12px' : '14px', 
                borderRadius: '50%', 
                backgroundColor: theme.colors.accent,
                opacity: !hasAccess ? 0.5 : 1,
                border: '1px solid rgba(255, 255, 255, 0.8)'
              }} />
            </div>

            {/* Características principales */}
            {!compactMode && (
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '2px',
                justifyContent: 'center'
              }}>
                {theme.effects.glassmorphism && (
                  <Badge bg="light" text="dark" style={{ fontSize: '0.5rem' }}>
                    Glass
                  </Badge>
                )}
                {theme.effects.particles && (
                  <Badge bg="light" text="dark" style={{ fontSize: '0.5rem' }}>
                    Particles
                  </Badge>
                )}
                {theme.effects.gradients && (
                  <Badge bg="light" text="dark" style={{ fontSize: '0.5rem' }}>
                    Gradients
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Overlay de premium (si aplica) */}
          {false && (
            <Badge 
              bg="warning" 
              style={{ 
                position: 'absolute',
                top: '8px',
                right: '8px',
                fontSize: '0.6rem',
                zIndex: 3
              }}
            >
              PRO
            </Badge>
          )}

          {/* Overlay de bloqueado */}
          {!hasAccess && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: theme.slide.borderRadius,
              zIndex: 2
            }}>
              <div style={{ 
                color: '#FFFFFF',
                fontSize: '2rem'
              }}>
                🔒
              </div>
            </div>
          )}

          {/* Indicador de selección */}
          {isSelected && (
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: theme.colors.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3,
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <div style={{ color: '#ffffff', fontSize: '0.8rem' }}>✓</div>
            </div>
          )}
        </div>
      </Col>
    );
  };

  // Categorías disponibles con conteos
  const categories = useMemo(() => {
    const categoryCounts = PRESENTATION_THEMES.reduce((acc, theme) => {
      acc[theme.category] = (acc[theme.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { key: 'professional', name: 'Professional', icon: '💼', count: categoryCounts.professional || 0 },
      { key: 'creative', name: 'Creative', icon: '🎨', count: categoryCounts.creative || 0 },
      { key: 'executive', name: 'Executive', icon: '👔', count: categoryCounts.executive || 0 },
      { key: 'tech', name: 'Tech', icon: '⚡', count: categoryCounts.tech || 0 },
      { key: 'natural', name: 'Natural', icon: '🌿', count: categoryCounts.natural || 0 }
    ].filter(cat => cat.count > 0);
  }, []);

  // Temas para la categoría activa
  const activeThemes = useMemo(() => 
    getThemesByCategory(activeCategory), 
    [activeCategory]
  );

  return (
    <div className={`presentation-theme-selector ${className}`}>
      {/* Header con estadísticas */}
      <div className="theme-selector-header mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            {compactMode ? 'Temas' : 'Selecciona un Tema Premium'}
          </h5>
          <Badge bg="success" pill>
            {PRESENTATION_THEMES.length} temas disponibles
          </Badge>
        </div>
        
        {/* Toggle de preview */}
        {!compactMode && (
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="previewToggle"
                checked={showPreviewEffects}
                onChange={(e) => {
                  // Para este ejemplo, mantenemos el estado local
                  // En implementación real, esto vendría de props
                }}
              />
              <label className="form-check-label" htmlFor="previewToggle">
                Vista previa con efectos
              </label>
            </div>
            <div className="text-muted small">
              {hoveredTheme ? '🎬 Efectos en tiempo real' : '👆 Pasa el cursor por un tema'}
            </div>
          </div>
        )}
        
        {/* Category Tabs */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {categories.map(category => (
            <button
              key={category.key}
              className={`btn btn-sm ${activeCategory === category.key ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveCategory(category.key)}
              style={{ 
                fontSize: compactMode ? '0.7rem' : '0.8rem',
                transition: 'all 0.3s ease'
              }}
            >
              {category.icon} {category.name} 
              <Badge bg={activeCategory === category.key ? 'light' : 'primary'} className="ms-1">
                {category.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Info de la categoría actual */}
      {!compactMode && (
        <div className="category-info mb-3 p-2 bg-light rounded">
          <div className="text-muted small">
            📊 Mostrando <strong>{activeThemes.length} temas</strong> en la categoría <strong>{activeCategory}</strong>
          </div>
        </div>
      )}

      {/* Themes Grid */}
      <Row className="themes-grid g-3">
        {activeThemes.map(renderThemeCard)}
      </Row>

      {/* Empty state */}
      {activeThemes.length === 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h6>No hay temas en esta categoría</h6>
            <p className="small">Intenta con otra categoría o vuelve pronto para nuevos temas.</p>
          </div>
        </div>
      )}

      {/* Current Selection Info */}
      {selectedTheme && !compactMode && (
        <div className="current-selection mt-4 p-3 rounded" style={{
          background: `linear-gradient(135deg, ${selectedTheme.colors.primary}10, ${selectedTheme.colors.secondary}10)`,
          border: `2px solid ${selectedTheme.colors.accent}30`
        }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ 
              fontSize: '2rem',
              padding: '0.5rem',
              borderRadius: '12px',
              background: selectedTheme.colors.accent + '20'
            }}>
              {selectedTheme.emoji}
            </div>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="fw-bold text-dark">
                  {selectedTheme.name}
                </span>
                <Badge bg="success">
                  ✓ Seleccionado
                </Badge>
                {false && (
                  <Badge bg="warning">
                    PRO
                  </Badge>
                )}
              </div>
              <div className="text-muted small mb-2">
                {selectedTheme.description}
              </div>
              <div className="d-flex flex-wrap gap-1">
                <Badge bg="light" text="dark" style={{ fontSize: '0.65rem' }}>
                  {selectedTheme.category}
                </Badge>
                {selectedTheme.effects.glassmorphism && (
                  <Badge bg="info" style={{ fontSize: '0.65rem' }}>
                    Glassmorphism
                  </Badge>
                )}
                {selectedTheme.effects.particles && (
                  <Badge bg="success" style={{ fontSize: '0.65rem' }}>
                    Partículas
                  </Badge>
                )}
                {selectedTheme.effects.gradients && (
                  <Badge bg="warning" style={{ fontSize: '0.65rem' }}>
                    Gradientes
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        .presentation-theme-selector .theme-card {
          will-change: transform, box-shadow, opacity;
          backface-visibility: hidden;
        }
        
        .presentation-theme-selector .theme-card.hovered {
          z-index: 10;
        }
        
        .presentation-theme-selector .theme-card.selected {
          z-index: 20;
        }
        
        .presentation-theme-selector .theme-card.locked {
          filter: grayscale(60%) opacity(0.7);
        }
        
        .presentation-theme-selector .theme-card.locked:hover {
          transform: none !important;
        }
        
        .presentation-theme-selector .theme-preview-slide {
          pointer-events: none;
          user-select: none;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .presentation-theme-selector .theme-card {
            min-height: 160px !important;
          }
          
          .presentation-theme-selector .category-info {
            font-size: 0.8rem;
          }
        }
        
        @media (max-width: 576px) {
          .presentation-theme-selector .themes-grid {
            margin: 0 -0.5rem;
          }
          
          .presentation-theme-selector .theme-card {
            min-height: 140px !important;
          }
        }
      `}} />
    </div>
  );
};

export default ThemeSelector;
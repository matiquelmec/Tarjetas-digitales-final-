/**
 * ProfessionalEffectsSystem v4.0 - Sistema Unificado de Efectos Profesionales
 * Reemplaza múltiples sistemas complejos por personalidades profesionales claras
 * 
 * FILOSOFÍA: "Impacto con Propósito"
 * - Cada efecto tiene un objetivo psicológico específico
 * - Configuración basada en personalidad, no en parámetros técnicos
 * - Máximo 3 decisiones para el usuario
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import './ProfessionalEffectsSystem.css';

export type ProfessionalPersonality = 'executive' | 'creative' | 'trustworthy';
export type EffectIntensity = 'minimal' | 'balanced' | 'maximum';

interface ProfessionalEffectsSystemProps {
  enabled: boolean;
  personality: ProfessionalPersonality;
  intensity: EffectIntensity;
  theme?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Configuración de personalidades profesionales
const PERSONALITY_CONFIGS = {
  executive: {
    name: 'Ejecutivo/a',
    emoji: '💼',
    description: 'Autoridad y liderazgo',
    message: 'Transmites confianza y estabilidad profesional',
    effects: ['authority-glow', 'premium-elevation', 'static-presence'],
    particles: {
      behavior: 'static' as const,
      color: '#7986cb',
      positions: 'strategic-corners',
      purpose: 'Frame de autoridad profesional'
    },
    animations: {
      hover: 'subtle-lift',
      entrance: 'confident-fade-in',
      accent: 'premium-pulse'
    }
  },
  creative: {
    name: 'Creativo/a', 
    emoji: '🎨',
    description: 'Innovación y dinamismo',
    message: 'Muestras creatividad e innovación',
    effects: ['interactive-magnetism', 'color-harmony', 'dynamic-particles'],
    particles: {
      behavior: 'interactive' as const,
      color: '#a78bfa',
      positions: 'photo-orbit',
      purpose: 'Respuesta magnética a interacciones'
    },
    animations: {
      hover: 'creative-bounce',
      entrance: 'dynamic-slide-in',
      accent: 'color-shift'
    }
  },
  trustworthy: {
    name: 'Confiable',
    emoji: '🤝',
    description: 'Cercanía y profesionalismo',
    message: 'Generas confianza y conexión humana',
    effects: ['warm-glow', 'breathing-card', 'gentle-ambient'],
    particles: {
      behavior: 'ambient' as const,
      color: '#10b981',
      positions: 'gentle-flow',
      purpose: 'Atmósfera cálida y accesible'
    },
    animations: {
      hover: 'warm-embrace',
      entrance: 'gentle-appear',
      accent: 'heartbeat-pulse'
    }
  }
};

// Mapeo de intensidad a valores numéricos
const INTENSITY_VALUES = {
  minimal: { particles: 3, opacity: 0.4, scale: 0.8, speed: 0.7 },
  balanced: { particles: 5, opacity: 0.6, scale: 1.0, speed: 1.0 },
  maximum: { particles: 8, opacity: 0.8, scale: 1.2, speed: 1.3 }
};

export function ProfessionalEffectsSystem({
  enabled,
  personality,
  intensity,
  theme = 'professional',
  children,
  className = '',
  style = {}
}: ProfessionalEffectsSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  const config = PERSONALITY_CONFIGS[personality];
  const intensityConfig = INTENSITY_VALUES[intensity];

  // Generar partículas según personalidad e intensidad
  useEffect(() => {
    if (!enabled) {
      setParticles([]);
      return;
    }

    const particleCount = intensityConfig.particles;
    const newParticles: JSX.Element[] = [];

    for (let i = 0; i < particleCount; i++) {
      const delay = i * 0.15;
      const duration = 2.5 + Math.random() * 1.5;
      
      // Posicionamiento estratégico según personalidad
      let position = {};
      
      if (config.particles.positions === 'strategic-corners') {
        // EXECUTIVE: Esquinas estratégicas que enmarcan sin obstruir
        const corners = [
          { left: '8%', top: '12%' },   // Superior izquierda
          { left: '92%', top: '15%' },  // Superior derecha  
          { left: '5%', top: '88%' },   // Inferior izquierda
          { left: '95%', top: '85%' },  // Inferior derecha
          { left: '12%', top: '50%' },  // Centro izquierda
          { left: '88%', top: '50%' },  // Centro derecha
          { left: '50%', top: '8%' },   // Superior centro
          { left: '50%', top: '92%' }   // Inferior centro
        ];
        position = corners[i % corners.length];
        
      } else if (config.particles.positions === 'photo-orbit') {
        // CREATIVE: Órbita dinámica alrededor de la foto
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 40 + (i * 8);
        const offsetX = Math.cos(angle + Date.now() * 0.001) * radius;
        const offsetY = Math.sin(angle + Date.now() * 0.001) * radius;
        position = {
          left: `calc(50% + ${offsetX}px)`,
          top: `calc(25% + ${offsetY}px)`
        };
        
      } else if (config.particles.positions === 'gentle-flow') {
        // TRUSTWORTHY: Flujo suave y natural
        const flowPositions = [
          { left: '15%', top: '20%' },  // Zona de bienvenida
          { left: '85%', top: '25%' },  // Zona de confianza
          { left: '10%', top: '75%' },  // Zona de cercanía
          { left: '90%', top: '70%' },  // Zona de apoyo
          { left: '25%', top: '45%' },  // Zona de diálogo
          { left: '75%', top: '55%' },  // Zona de escucha
          { left: '50%', top: '10%' },  // Zona de aspiración
          { left: '50%', top: '90%' }   // Zona de fundamento
        ];
        position = flowPositions[i % flowPositions.length];
      }

      newParticles.push(
        <div
          key={`particle-${personality}-${i}`}
          className={`professional-particle professional-particle-${personality} professional-particle-${config.particles.behavior}`}
          style={{
            ...position,
            '--particle-color': config.particles.color,
            '--particle-delay': `${delay}s`,
            '--particle-duration': `${duration}s`,
            '--particle-opacity': intensityConfig.opacity,
            '--particle-scale': intensityConfig.scale,
            '--particle-speed': intensityConfig.speed
          } as React.CSSProperties}
        />
      );
    }

    setParticles(newParticles);
  }, [enabled, personality, intensity, config, intensityConfig]);

  // Interactividad para creative personality
  const handleMouseMove = (e: React.MouseEvent) => {
    if (personality !== 'creative' || !enabled) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Atraer partículas hacia el cursor (efecto magnético)
    const particleElements = containerRef.current?.querySelectorAll('.professional-particle-interactive');
    particleElements?.forEach((particle, index) => {
      const el = particle as HTMLElement;
      const delay = index * 0.03;
      
      setTimeout(() => {
        const attraction = 0.15; // Fuerza de atracción
        const currentLeft = parseFloat(el.style.left) || 50;
        const currentTop = parseFloat(el.style.top) || 50;
        
        const targetX = (x / rect.width) * 100;
        const targetY = (y / rect.height) * 100;
        
        const deltaX = (targetX - currentLeft) * attraction;
        const deltaY = (targetY - currentTop) * attraction;
        
        el.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${intensityConfig.scale * 1.1})`;
      }, delay * 1000);
    });
  };

  const handleMouseLeave = () => {
    if (personality !== 'creative') return;
    
    // Reset partículas a posición original
    const particleElements = containerRef.current?.querySelectorAll('.professional-particle');
    particleElements?.forEach((particle) => {
      const el = particle as HTMLElement;
      el.style.transform = `translate(0, 0) scale(${intensityConfig.scale})`;
    });
  };

  if (!enabled) return <>{children}</>;

  return (
    <div 
      ref={containerRef}
      className={`professional-effects-system professional-effects-${personality} professional-intensity-${intensity} ${className}`}
      style={{
        position: 'relative',
        ...style
      }}
      onMouseMove={personality === 'creative' ? handleMouseMove : undefined}
      onMouseLeave={personality === 'creative' ? handleMouseLeave : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      {/* Capa de efectos de fondo */}
      <div className="professional-effects-background" />
      
      {/* Partículas profesionales */}
      <div className="professional-particles-layer">
        {particles}
      </div>
      
      {/* Efectos de ambiente según personalidad */}
      <div className={`professional-ambient-layer professional-ambient-${personality}`} />
      
      {/* Contenido principal */}
      <div className="professional-content-layer" style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>

      {/* Efecto de hover interactivo */}
      {isHovered && (
        <div className={`professional-hover-effect professional-hover-${personality}`} />
      )}
    </div>
  );
}

export default ProfessionalEffectsSystem;
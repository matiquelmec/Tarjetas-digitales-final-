/**
 * SmartParticles v3.0 - Sistema Anti-Colisión Total
 * Partículas que NO interfieren con elementos funcionales
 * 
 * ZONAS PROTEGIDAS (100% libres):
 * - QR Code: Centro inferior (45%-55% x 80%-95%)
 * - Foto perfil: Centro superior (45%-55% x 15%-35%)
 * - Botones principales: Banda central (30%-70% x 40%-80%)  
 * - Texto principal: Centro (40%-60% x 35%-50%)
 * 
 * ESTRATEGIA: Solo bordes extremos y esquinas seguras
 * - 6 posiciones premium garantizadas
 * - Fallback a bordes laterales <30% y >70%
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import './SmartParticles.css';

interface SmartParticlesProps {
  enabled: boolean;
  intensity?: 'subtle' | 'balanced' | 'prominent';
  behavior?: 'static' | 'interactive' | 'ambient';
  targetElement?: 'photo' | 'button' | 'card' | 'custom';
  theme?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SmartParticles({
  enabled,
  intensity = 'subtle',
  behavior = 'static',
  targetElement = 'card',
  theme = 'professional',
  children,
  className = '',
  style = {}
}: SmartParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  // Mapeo de intensidad a cantidad
  const getParticleCount = () => {
    const map = {
      subtle: 3,
      balanced: 5,
      prominent: 8
    };
    return map[intensity];
  };

  // Colores basados en tema
  const getParticleColor = () => {
    const colors = {
      diamond: '#7986cb',
      emerald: '#10b981',
      ruby: '#ef4444',
      sapphire: '#3b82f6',
      gold: '#fbbf24',
      professional: '#60a5fa',
      medical: '#06b6d4',
      legal: '#10b981',
      creative: '#a78bfa'
    };
    return colors[theme as keyof typeof colors] || colors.professional;
  };

  // Generar partículas según comportamiento
  useEffect(() => {
    if (!enabled) {
      setParticles([]);
      return;
    }

    const count = getParticleCount();
    const color = getParticleColor();
    const newParticles: JSX.Element[] = [];

    for (let i = 0; i < count; i++) {
      const delay = i * 0.2;
      const duration = 3 + Math.random() * 2;
      
      // Posicionamiento estratégico según target y comportamiento
      let position = {};
      
      if (targetElement === 'photo') {
        // Alrededor de la foto (círculo elegante)
        const angle = (i / count) * Math.PI * 2;
        const radius = 60 + (i * 5); // Radios variados para más dinamismo
        position = {
          left: `calc(50% + ${Math.cos(angle) * radius}px)`,
          top: `calc(30% + ${Math.sin(angle) * radius}px)`
        };
      } else if (targetElement === 'button') {
        // Cerca de los botones (parte inferior)
        position = {
          left: `${30 + Math.random() * 40}%`,
          bottom: `${15 + Math.random() * 15}%`
        };
      } else {
        // Sistema anti-colisión TOTAL - Solo zonas 100% seguras
        const safePositions = [
          // Zona superior segura (encima de foto y texto)
          { left: '15%', top: '12%', zone: 'top-left-safe' },    // Superior izquierda
          { left: '85%', top: '14%', zone: 'top-right-safe' },   // Superior derecha
          
          // Bordes laterales extremos (fuera de botones)
          { left: '8%', top: '25%', zone: 'left-upper' },        // Izquierda alta
          { left: '92%', top: '30%', zone: 'right-upper' },      // Derecha alta  
          { left: '6%', top: '85%', zone: 'left-lower' },        // Izquierda baja (evita QR)
          { left: '94%', top: '88%', zone: 'right-lower' },      // Derecha baja (evita QR)
          
          // Posiciones adicionales solo en bordes extremos
          { left: '10%', top: '60%', zone: 'left-middle' },      // Izquierda medio (fuera botones)
          { left: '90%', top: '65%', zone: 'right-middle' },     // Derecha medio (fuera botones)
        ];
        
        // Usar posición segura o distribuir en bordes extremos únicamente
        if (i < safePositions.length) {
          position = { left: safePositions[i].left, top: safePositions[i].top };
        } else {
          // Para más partículas: SOLO bordes laterales extremos (fuera de TODA zona central)
          const ultraSafeEdges = [
            // Izquierda extrema (0%-15%)
            { left: `${4 + Math.random() * 8}%`, top: `${20 + Math.random() * 15}%` },    // Izq superior
            { left: `${4 + Math.random() * 8}%`, top: `${80 + Math.random() * 15}%` },    // Izq inferior
            
            // Derecha extrema (85%-96%)  
            { left: `${88 + Math.random() * 8}%`, top: `${20 + Math.random() * 15}%` },   // Der superior
            { left: `${88 + Math.random() * 8}%`, top: `${80 + Math.random() * 15}%` },   // Der inferior
          ];
          
          position = ultraSafeEdges[i % ultraSafeEdges.length];
        }
      }

      newParticles.push(
        <div
          key={`particle-${i}`}
          className={`smart-particle smart-particle-${behavior}`}
          style={{
            ...position,
            '--particle-color': color,
            '--particle-delay': `${delay}s`,
            '--particle-duration': `${duration}s`,
            '--particle-size': behavior === 'static' ? '10px' : behavior === 'interactive' ? '8px' : '6px'
          } as React.CSSProperties}
        />
      );
    }

    setParticles(newParticles);
  }, [enabled, intensity, behavior, targetElement, theme]);

  // Interactividad para behavior="interactive"
  const handleMouseMove = (e: React.MouseEvent) => {
    if (behavior !== 'interactive' || !enabled) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Atraer partículas hacia el cursor
    const particleElements = containerRef.current?.querySelectorAll('.smart-particle');
    particleElements?.forEach((particle, index) => {
      const el = particle as HTMLElement;
      const delay = index * 0.05;
      
      setTimeout(() => {
        const currentLeft = parseFloat(el.style.left) || 50;
        const currentTop = parseFloat(el.style.top) || 50;
        
        const newLeft = currentLeft + (x / rect.width * 100 - currentLeft) * 0.1;
        const newTop = currentTop + (y / rect.height * 100 - currentTop) * 0.1;
        
        el.style.transform = `translate(${(newLeft - currentLeft) * 0.5}px, ${(newTop - currentTop) * 0.5}px)`;
      }, delay * 1000);
    });
  };

  const handleMouseLeave = () => {
    if (behavior !== 'interactive') return;
    
    // Reset partículas a posición original
    const particleElements = containerRef.current?.querySelectorAll('.smart-particle');
    particleElements?.forEach((particle) => {
      const el = particle as HTMLElement;
      el.style.transform = 'translate(0, 0)';
    });
  };

  if (!enabled) return <>{children}</>;

  return (
    <div 
      ref={containerRef}
      className={`smart-particles-container smart-particles-${behavior} ${className}`}
      style={{
        position: 'relative',
        ...style
      }}
      onMouseMove={behavior === 'interactive' ? handleMouseMove : undefined}
      onMouseLeave={behavior === 'interactive' ? handleMouseLeave : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      {/* Partículas */}
      <div className="smart-particles-layer">
        {particles}
      </div>
      
      {/* Contenido */}
      <div className="smart-particles-content" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      {/* Efecto de hover para behavior="interactive" */}
      {behavior === 'interactive' && isHovered && (
        <div className="smart-particles-hover-effect" />
      )}
    </div>
  );
}

export default SmartParticles;
/**
 * FloatingShapes v1.0 - Sistema de formas flotantes con gradientes animados
 * Complementa SmartParticles con elementos geométricos más grandes y orgánicos
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import './FloatingShapes.css';

interface FloatingShapesProps {
  enabled: boolean;
  type?: 'geometric' | 'organic' | 'stars' | 'particles' | 'professional';
  count?: number; // 1-5
  speed?: number; // 1-5
  theme?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function FloatingShapes({
  enabled,
  type = 'geometric',
  count = 3,
  speed = 3,
  theme = 'professional',
  children,
  className = '',
  style = {}
}: FloatingShapesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shapes, setShapes] = useState<JSX.Element[]>([]);

  // Colores basados en tema (diferentes de partículas para contraste)
  const getShapeColor = () => {
    const colors = {
      diamond: '#9333ea', // Púrpura vs azul partículas
      emerald: '#059669', // Verde más oscuro vs verde claro partículas
      ruby: '#dc2626',    // Rojo más oscuro vs rojo partículas
      sapphire: '#1e40af', // Azul más oscuro vs azul partículas
      gold: '#d97706',     // Naranja vs amarillo partículas
      professional: '#7c3aed', // Púrpura vs azul partículas
      medical: '#0891b2',      // Cyan más oscuro vs cyan partículas
      legal: '#047857',        // Verde más oscuro vs verde partículas
      creative: '#9333ea'      // Púrpura más oscuro vs púrpura partículas
    };
    return colors[theme as keyof typeof colors] || colors.professional;
  };

  // Generar formas según tipo y configuración
  useEffect(() => {
    if (!enabled) {
      setShapes([]);
      return;
    }

    // Limitar count para evitar saturación visual
    const actualCount = Math.min(Math.max(count, 1), 5);
    const baseColor = getShapeColor();
    const newShapes: JSX.Element[] = [];

    // Posiciones anti-colisión (diferentes de SmartParticles)
    const safePositions = [
      { left: '5%', top: '35%' },    // Izquierda media
      { left: '95%', top: '40%' },   // Derecha media  
      { left: '20%', top: '8%' },    // Superior izquierda
      { left: '80%', top: '10%' },   // Superior derecha
      { left: '10%', top: '75%' },   // Inferior izquierda
    ];

    for (let i = 0; i < actualCount; i++) {
      const position = safePositions[i] || { left: `${10 + i * 15}%`, top: `${20 + i * 15}%` };
      const delay = i * 0.5;
      const duration = 8 + (speed * 2) + Math.random() * 4; // 8-20 segundos
      const size = type === 'particles' ? '12px' : type === 'stars' ? '16px' : '24px';
      
      // Forma específica según tipo
      let shapeClass = 'floating-shape';
      let shapeContent = '';
      
      switch (type) {
        case 'geometric':
          shapeClass += ` floating-shape-${['triangle', 'square', 'hexagon'][i % 3]}`;
          break;
        case 'organic':
          shapeClass += ' floating-shape-blob';
          break;
        case 'stars':
          shapeClass += ' floating-shape-star';
          shapeContent = '✦';
          break;
        case 'particles':
          shapeClass += ' floating-shape-particle';
          break;
        case 'professional':
          shapeClass += ` floating-shape-${['diamond', 'circle', 'square'][i % 3]}`;
          break;
      }

      newShapes.push(
        <div
          key={`floating-shape-${i}`}
          className={shapeClass}
          style={{
            left: position.left,
            top: position.top,
            '--shape-color': baseColor,
            '--shape-delay': `${delay}s`,
            '--shape-duration': `${duration}s`,
            '--shape-size': size,
            '--shape-speed': speed.toString(),
            zIndex: 1, // Detrás de SmartParticles pero sobre fondo
          } as React.CSSProperties}
        >
          {shapeContent}
        </div>
      );
    }

    setShapes(newShapes);
  }, [enabled, type, count, speed, theme]);

  if (!enabled) return <>{children}</>;

  return (
    <div 
      ref={containerRef}
      className={`floating-shapes-container floating-shapes-${type} ${className}`}
      style={{
        position: 'relative',
        ...style
      }}
    >
      {/* Formas flotantes */}
      <div className="floating-shapes-layer">
        {shapes}
      </div>
      
      {/* Contenido */}
      <div className="floating-shapes-content" style={{ position: 'relative', zIndex: 3 }}>
        {children}
      </div>
    </div>
  );
}

export default FloatingShapes;
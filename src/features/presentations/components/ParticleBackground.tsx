'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  particleCount?: number;
  particleType?: 'floating' | 'constellation' | 'professional' | 'creative';
  primaryColor?: string;
  secondaryColor?: string;
  isActive?: boolean;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 25,
  particleType = 'professional',
  primaryColor = '#00f6ff',
  secondaryColor = '#0072ff',
  isActive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLElement[] = [];

    // Limpiar partículas existentes
    container.innerHTML = '';

    // Crear partículas
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = `slide-particle ${particleType}`;
      
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 4;
      const duration = 4 + Math.random() * 2;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        top: ${top}%;
        background: linear-gradient(45deg, ${primaryColor}, ${secondaryColor});
        border-radius: 50%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: ${isActive ? 1 : 0.6};
        pointer-events: none;
      `;
      
      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, [particleCount, particleType, primaryColor, secondaryColor, isActive]);

  return (
    <div 
      ref={containerRef}
      className="slide-particles-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
    />
  );
};

export default ParticleBackground;
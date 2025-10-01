/**
 * Sistema de Partículas Cinematográfico para Presentaciones
 * Efectos visuales premium para slides profesionales
 */

'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { SlideParticleConfig } from '@/lib/effects/PresentationEffectsManager';

interface SlideParticlesProps {
  config: SlideParticleConfig;
  containerRef?: React.RefObject<HTMLElement>;
  className?: string;
  isPaused?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  opacity: number;
  color?: string;
  character?: string;
  rotationSpeed?: number;
  pulsePhase?: number;
}

const SlideParticles: React.FC<SlideParticlesProps> = ({
  config,
  containerRef,
  className = '',
  isPaused = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Caracteres para efecto Matrix
  const matrixChars = useMemo(() => 
    '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split(''),
    []
  );

  // Inicializar partículas
  const initializeParticles = () => {
    if (!config.enabled) return;

    const particles: Particle[] = [];
    const { width, height } = dimensions;

    for (let i = 0; i < config.count; i++) {
      const particle: Particle = {
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: config.size || (Math.random() * 4 + 2),
        speed: (config.speed || 1) * (0.5 + Math.random() * 0.5),
        angle: Math.random() * Math.PI * 2,
        opacity: 0.3 + Math.random() * 0.7,
        rotationSpeed: Math.random() * 0.02 - 0.01,
        pulsePhase: Math.random() * Math.PI * 2
      };

      // Configuración específica por tipo
      switch (config.type) {
        case 'matrix':
          particle.character = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          particle.color = '#0f0';
          particle.y = -Math.random() * height;
          particle.speed *= 2;
          break;

        case 'confetti':
          particle.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
          particle.size = Math.random() * 8 + 4;
          particle.rotationSpeed = (Math.random() - 0.5) * 0.1;
          break;

        case 'stars':
          particle.color = '#ffffff';
          particle.size = Math.random() * 3 + 1;
          particle.pulsePhase = Math.random() * Math.PI * 2;
          break;

        case 'bubbles':
          particle.color = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`;
          particle.size = Math.random() * 20 + 10;
          particle.speed *= 0.5;
          break;

        case 'constellation':
          particle.color = '#ffffff';
          particle.size = Math.random() * 2 + 1;
          particle.speed *= 0.3;
          break;

        case 'professional':
          particle.color = config.color || 'rgba(100, 150, 200, 0.6)';
          particle.size = 2;
          particle.speed *= 0.4;
          break;

        case 'creative':
          particle.color = `hsl(${Math.random() * 60 + 200}, 100%, 60%)`;
          particle.size = Math.random() * 6 + 2;
          particle.angle = Math.random() * Math.PI * 2;
          break;

        default: // floating
          particle.color = config.color || 'rgba(255, 255, 255, 0.8)';
      }

      particles.push(particle);
    }

    particlesRef.current = particles;
  };

  // Actualizar posiciones de partículas
  const updateParticles = () => {
    const { width, height } = dimensions;
    const direction = config.direction || 'random';

    particlesRef.current.forEach(particle => {
      // Actualizar posición según dirección
      switch (direction) {
        case 'up':
          particle.y -= particle.speed;
          if (particle.y < -particle.size) {
            particle.y = height + particle.size;
            particle.x = Math.random() * width;
          }
          break;

        case 'down':
          particle.y += particle.speed;
          if (particle.y > height + particle.size) {
            particle.y = -particle.size;
            particle.x = Math.random() * width;
          }
          break;

        case 'left':
          particle.x -= particle.speed;
          if (particle.x < -particle.size) {
            particle.x = width + particle.size;
            particle.y = Math.random() * height;
          }
          break;

        case 'right':
          particle.x += particle.speed;
          if (particle.x > width + particle.size) {
            particle.x = -particle.size;
            particle.y = Math.random() * height;
          }
          break;

        default: // random
          particle.x += Math.cos(particle.angle) * particle.speed;
          particle.y += Math.sin(particle.angle) * particle.speed;

          // Rebote en bordes
          if (particle.x < 0 || particle.x > width) {
            particle.angle = Math.PI - particle.angle;
          }
          if (particle.y < 0 || particle.y > height) {
            particle.angle = -particle.angle;
          }

          // Mantener dentro de límites
          particle.x = Math.max(0, Math.min(width, particle.x));
          particle.y = Math.max(0, Math.min(height, particle.y));
      }

      // Efectos específicos por tipo
      switch (config.type) {
        case 'stars':
          // Efecto de parpadeo
          particle.pulsePhase = (particle.pulsePhase || 0) + 0.05;
          particle.opacity = 0.3 + Math.sin(particle.pulsePhase) * 0.7;
          break;

        case 'confetti':
          // Rotación continua
          particle.angle += particle.rotationSpeed || 0;
          break;

        case 'bubbles':
          // Movimiento ondulante
          particle.x += Math.sin(particle.y * 0.01) * 0.5;
          break;

        case 'constellation':
          // Movimiento lento y sutil
          particle.angle += 0.001;
          break;

        case 'matrix':
          // Reiniciar cuando llega al fondo
          if (particle.y > height) {
            particle.y = -20;
            particle.x = Math.random() * width;
            particle.character = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          }
          break;
      }
    });
  };

  // Renderizar partículas
  const renderParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Renderizar líneas de conexión para constellation
    if (config.type === 'constellation') {
      renderConstellationLines(ctx);
    }

    // Renderizar partículas
    particlesRef.current.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;

      switch (config.type) {
        case 'matrix':
          ctx.fillStyle = particle.color || '#0f0';
          ctx.font = `${particle.size * 3}px monospace`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = particle.color || '#0f0';
          ctx.fillText(particle.character || '0', particle.x, particle.y);
          break;

        case 'confetti':
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.angle);
          ctx.fillStyle = particle.color || '#ff0080';
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.6);
          break;

        case 'stars':
          drawStar(ctx, particle.x, particle.y, particle.size, particle.color || '#ffffff');
          break;

        case 'bubbles':
          ctx.strokeStyle = particle.color || 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.stroke();
          
          // Reflejo de luz
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.beginPath();
          ctx.arc(
            particle.x - particle.size * 0.3,
            particle.y - particle.size * 0.3,
            particle.size * 0.2,
            0,
            Math.PI * 2
          );
          ctx.fill();
          break;

        case 'creative':
          // Formas geométricas aleatorias
          ctx.fillStyle = particle.color || '#40e0d0';
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.angle);
          
          const sides = Math.floor(Math.random() * 3) + 3; // 3-5 lados
          drawPolygon(ctx, 0, 0, particle.size, sides);
          break;

        default:
          // Círculos simples por defecto
          ctx.fillStyle = particle.color || 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
      }

      ctx.restore();
    });
  };

  // Renderizar líneas de constelación
  const renderConstellationLines = (ctx: CanvasRenderingContext2D) => {
    const maxDistance = 150;
    const particles = particlesRef.current;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          ctx.globalAlpha = (1 - distance / maxDistance) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  // Dibujar estrella
  const drawStar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string
  ) => {
    const spikes = 4;
    const outerRadius = size;
    const innerRadius = size * 0.3;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    
    ctx.closePath();
    ctx.fill();
  };

  // Dibujar polígono
  const drawPolygon = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    sides: number
  ) => {
    ctx.beginPath();
    
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    
    ctx.closePath();
    ctx.fill();
  };

  // Loop de animación
  const animate = () => {
    if (!canvasRef.current || isPaused) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    updateParticles();
    renderParticles(ctx);

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Actualizar dimensiones
  useEffect(() => {
    const updateDimensions = () => {
      const container = containerRef?.current || canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, [containerRef]);

  // Inicializar y animar
  useEffect(() => {
    if (!config.enabled || dimensions.width === 0 || dimensions.height === 0) return;

    initializeParticles();
    
    if (!isPaused) {
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config, dimensions, isPaused]);

  // No renderizar si no está habilitado
  if (!config.enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`slide-particles-canvas ${className}`}
      width={dimensions.width}
      height={dimensions.height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};

export default SlideParticles;
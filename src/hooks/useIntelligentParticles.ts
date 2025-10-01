'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ParticlePhysicsEngine, { Particle, PhysicsConfig } from '@/lib/effects/ParticlePhysics';

interface UseIntelligentParticlesConfig {
  enabled: boolean;
  type: 'floating' | 'constellation' | 'professional' | 'creative';
  count: number;
  physics: {
    gravity: number;
    friction: number;
    boundary: 'wrap' | 'bounce' | 'absorb';
    mouseInfluence: number;
    interParticleForces: boolean;
    trailLength: number;
    enableCollisions: boolean;
    windStrength: number;
  };
  containerRef: React.RefObject<HTMLElement>;
}

interface UseIntelligentParticlesReturn {
  particles: Particle[];
  canvasRef: React.RefObject<HTMLCanvasElement>;
  stats: {
    particleCount: number;
    forces: number;
    averageVelocity: number;
    averageLife: number;
  };
  addMagneticPoint: (x: number, y: number, strength: number) => void;
  addWindForce: (direction: number, strength: number) => void;
  reset: () => void;
}

export function useIntelligentParticles(config: UseIntelligentParticlesConfig): UseIntelligentParticlesReturn {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [stats, setStats] = useState({
    particleCount: 0,
    forces: 0,
    averageVelocity: 0,
    averageLife: 0
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ParticlePhysicsEngine | null>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Initialize physics engine
  useEffect(() => {
    if (!config.enabled || !config.containerRef.current) return;

    const container = config.containerRef.current;
    const bounds = container.getBoundingClientRect();

    const physicsConfig: PhysicsConfig = {
      gravity: config.physics.gravity,
      friction: config.physics.friction,
      boundary: config.physics.boundary,
      mouseInfluence: config.physics.mouseInfluence,
      interParticleForces: config.physics.interParticleForces,
      trailLength: config.physics.trailLength,
      enableCollisions: config.physics.enableCollisions,
      windStrength: config.physics.windStrength,
      magneticPoints: []
    };

    engineRef.current = new ParticlePhysicsEngine(physicsConfig, {
      width: bounds.width,
      height: bounds.height
    });

    // Add initial particles
    engineRef.current.addParticles(config.type, config.count);

    // Start animation loop
    const animate = (currentTime: number) => {
      if (!engineRef.current) return;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Update physics
      engineRef.current.update(deltaTime);

      // Update state
      setParticles([...engineRef.current.getParticles()]);
      setStats(engineRef.current.getStats());

      // Render to canvas if available
      if (canvasRef.current) {
        renderToCanvas();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config.enabled, config.type, config.count, config.physics, config.containerRef]);

  // Handle container resize
  useEffect(() => {
    if (!config.enabled || !config.containerRef.current || !engineRef.current) return;

    const handleResize = () => {
      const container = config.containerRef.current;
      if (!container || !engineRef.current) return;

      const bounds = container.getBoundingClientRect();
      engineRef.current.setBounds(bounds.width, bounds.height);

      // Update canvas size
      if (canvasRef.current) {
        canvasRef.current.width = bounds.width;
        canvasRef.current.height = bounds.height;
      }
    };

    handleResize(); // Initial size
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [config.enabled, config.containerRef]);

  // Handle mouse movement
  useEffect(() => {
    if (!config.enabled || !config.containerRef.current || !engineRef.current) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!config.containerRef.current || !engineRef.current) return;

      const container = config.containerRef.current;
      const bounds = container.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      engineRef.current.updateMousePosition(x, y);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [config.enabled, config.containerRef]);

  // Render particles to canvas
  const renderToCanvas = useCallback(() => {
    if (!canvasRef.current || !engineRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = engineRef.current.getParticles();

    particles.forEach(particle => {
      ctx.save();

      // Render trail if available
      if (particle.trail && particle.trail.length > 1) {
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        
        ctx.beginPath();
        particle.trail.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }

      // Render particle
      ctx.globalAlpha = particle.opacity;
      
      // Different rendering based on type
      switch (particle.type) {
        case 'floating':
          // Simple circle with glow
          ctx.fillStyle = particle.color;
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'constellation':
          // Star shape
          ctx.fillStyle = particle.color;
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 5;
          drawStar(ctx, particle.x, particle.y, particle.radius, 5);
          break;

        case 'professional':
          // Square with rounded corners
          ctx.fillStyle = particle.color;
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 3;
          const size = particle.radius * 2;
          ctx.beginPath();
          ctx.roundRect(particle.x - size/2, particle.y - size/2, size, size, 2);
          ctx.fill();
          break;

        case 'creative':
          // Triangle
          ctx.fillStyle = particle.color;
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 8;
          drawTriangle(ctx, particle.x, particle.y, particle.radius);
          break;
      }

      ctx.restore();
    });
  }, []);

  // Helper function to draw a star
  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, points: number) => {
    const angle = Math.PI / points;
    ctx.beginPath();
    for (let i = 0; i < 2 * points; i++) {
      const r = i % 2 === 0 ? radius : radius * 0.5;
      const curAngle = i * angle;
      const px = x + r * Math.cos(curAngle);
      const py = y + r * Math.sin(curAngle);
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
  };

  // Helper function to draw a triangle
  const drawTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x - radius * 0.866, y + radius * 0.5);
    ctx.lineTo(x + radius * 0.866, y + radius * 0.5);
    ctx.closePath();
    ctx.fill();
  };

  // Add magnetic point
  const addMagneticPoint = useCallback((x: number, y: number, strength: number) => {
    if (!engineRef.current) return;
    
    engineRef.current.addForce({
      type: 'magnetic',
      strength,
      x,
      y
    });
  }, []);

  // Add wind force
  const addWindForce = useCallback((direction: number, strength: number) => {
    if (!engineRef.current) return;
    
    engineRef.current.addForce({
      type: 'wind',
      strength,
      direction
    });
  }, []);

  // Reset simulation
  const reset = useCallback(() => {
    if (!engineRef.current) return;
    
    engineRef.current.reset();
    engineRef.current.addParticles(config.type, config.count);
  }, [config.type, config.count]);

  return {
    particles,
    canvasRef,
    stats,
    addMagneticPoint,
    addWindForce,
    reset
  };
}

export default useIntelligentParticles;
/**
 * Intelligent Particle Physics System
 * Advanced physics simulation for realistic particle behavior
 */

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  ax: number; // acceleration x  
  ay: number; // acceleration y
  radius: number;
  mass: number;
  life: number; // 0-1
  maxLife: number;
  color: string;
  opacity: number;
  type: 'floating' | 'constellation' | 'professional' | 'creative';
  trail?: ParticleTrail[];
}

export interface ParticleTrail {
  x: number;
  y: number;
  opacity: number;
  age: number;
}

export interface PhysicsForce {
  type: 'gravity' | 'wind' | 'magnetic' | 'mouse' | 'collision';
  strength: number;
  x?: number;
  y?: number;
  radius?: number;
  direction?: number; // for wind
}

export interface PhysicsConfig {
  gravity: number; // 0-1
  friction: number; // 0-1
  boundary: 'wrap' | 'bounce' | 'absorb';
  mouseInfluence: number; // 0-2
  interParticleForces: boolean;
  trailLength: number; // 0-10
  enableCollisions: boolean;
  windStrength: number; // 0-1
  magneticPoints: Array<{x: number, y: number, strength: number}>;
}

export class ParticlePhysicsEngine {
  private particles: Particle[] = [];
  private forces: PhysicsForce[] = [];
  private config: PhysicsConfig;
  private bounds: { width: number; height: number };
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private time: number = 0;

  constructor(config: PhysicsConfig, bounds: { width: number; height: number }) {
    this.config = config;
    this.bounds = bounds;
  }

  // Create a particle with intelligent defaults based on type
  createParticle(type: Particle['type'], x?: number, y?: number): Particle {
    const id = Math.random() * 1000000;
    
    const typeConfig = {
      floating: {
        radius: 2 + Math.random() * 4,
        mass: 0.5 + Math.random() * 1,
        life: 0.6 + Math.random() * 0.4,
        maxLife: 200 + Math.random() * 300,
        color: '#00f6ff',
        baseVelocity: 0.5
      },
      constellation: {
        radius: 1.5 + Math.random() * 2,
        mass: 0.3 + Math.random() * 0.7,
        life: 0.8 + Math.random() * 0.2,
        maxLife: 400 + Math.random() * 200,
        color: '#ffffff',
        baseVelocity: 0.2
      },
      professional: {
        radius: 1 + Math.random() * 2,
        mass: 0.8 + Math.random() * 0.4,
        life: 0.9 + Math.random() * 0.1,
        maxLife: 500 + Math.random() * 200,
        color: '#4a90e2',
        baseVelocity: 0.3
      },
      creative: {
        radius: 3 + Math.random() * 5,
        mass: 0.2 + Math.random() * 0.8,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 150 + Math.random() * 250,
        color: '#ff6b9d',
        baseVelocity: 1.0
      }
    };

    const config = typeConfig[type];
    
    return {
      id,
      x: x ?? Math.random() * this.bounds.width,
      y: y ?? Math.random() * this.bounds.height,
      vx: (Math.random() - 0.5) * config.baseVelocity,
      vy: (Math.random() - 0.5) * config.baseVelocity,
      ax: 0,
      ay: 0,
      radius: config.radius,
      mass: config.mass,
      life: config.life,
      maxLife: config.maxLife,
      color: config.color,
      opacity: 0.6 + Math.random() * 0.4,
      type,
      trail: this.config.trailLength > 0 ? [] : undefined
    };
  }

  // Add multiple particles
  addParticles(type: Particle['type'], count: number): void {
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(type));
    }
  }

  // Update mouse position for mouse influence
  updateMousePosition(x: number, y: number): void {
    this.mousePosition.x = x;
    this.mousePosition.y = y;
  }

  // Add external force
  addForce(force: PhysicsForce): void {
    this.forces.push(force);
  }

  // Clear all forces
  clearForces(): void {
    this.forces = [];
  }

  // Apply forces to a particle
  private applyForces(particle: Particle): void {
    // Reset acceleration
    particle.ax = 0;
    particle.ay = 0;

    // Apply gravity
    if (this.config.gravity > 0) {
      particle.ay += this.config.gravity * 0.1;
    }

    // Apply wind
    if (this.config.windStrength > 0) {
      const windNoise = Math.sin(this.time * 0.01 + particle.id * 0.001) * 0.5;
      particle.ax += (this.config.windStrength * 0.05) + windNoise * 0.02;
    }

    // Apply mouse influence
    if (this.config.mouseInfluence > 0) {
      const dx = this.mousePosition.x - particle.x;
      const dy = this.mousePosition.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influenceRadius = 100;

      if (distance < influenceRadius && distance > 0) {
        const force = (1 - distance / influenceRadius) * this.config.mouseInfluence * 0.1;
        const angle = Math.atan2(dy, dx);
        
        // Attraction or repulsion based on particle type
        const isAttracted = particle.type === 'constellation' || particle.type === 'professional';
        const direction = isAttracted ? 1 : -1;
        
        particle.ax += Math.cos(angle) * force * direction;
        particle.ay += Math.sin(angle) * force * direction;
      }
    }

    // Apply magnetic points
    this.config.magneticPoints?.forEach(point => {
      const dx = point.x - particle.x;
      const dy = point.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const force = point.strength / (distance * distance + 1);
        particle.ax += (dx / distance) * force * 0.1;
        particle.ay += (dy / distance) * force * 0.1;
      }
    });

    // Apply inter-particle forces (collision avoidance/attraction)
    if (this.config.interParticleForces) {
      this.particles.forEach(other => {
        if (other.id !== particle.id) {
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = particle.radius + other.radius + 10;

          if (distance < minDistance && distance > 0) {
            const force = (minDistance - distance) / minDistance * 0.05;
            const angle = Math.atan2(dy, dx);
            
            // Repulsion
            particle.ax -= Math.cos(angle) * force;
            particle.ay -= Math.sin(angle) * force;
          }
        }
      });
    }

    // Apply custom forces
    this.forces.forEach(force => {
      switch (force.type) {
        case 'magnetic':
          if (force.x !== undefined && force.y !== undefined) {
            const dx = force.x - particle.x;
            const dy = force.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
              const forceStrength = force.strength / (distance * distance + 1);
              particle.ax += (dx / distance) * forceStrength * 0.1;
              particle.ay += (dy / distance) * forceStrength * 0.1;
            }
          }
          break;
          
        case 'wind':
          if (force.direction !== undefined) {
            particle.ax += Math.cos(force.direction) * force.strength * 0.05;
            particle.ay += Math.sin(force.direction) * force.strength * 0.05;
          }
          break;
      }
    });
  }

  // Handle boundary conditions
  private handleBoundaries(particle: Particle): void {
    switch (this.config.boundary) {
      case 'wrap':
        if (particle.x < 0) particle.x = this.bounds.width;
        if (particle.x > this.bounds.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.bounds.height;
        if (particle.y > this.bounds.height) particle.y = 0;
        break;

      case 'bounce':
        if (particle.x <= particle.radius || particle.x >= this.bounds.width - particle.radius) {
          particle.vx *= -0.8; // Energy loss on bounce
          particle.x = Math.max(particle.radius, Math.min(this.bounds.width - particle.radius, particle.x));
        }
        if (particle.y <= particle.radius || particle.y >= this.bounds.height - particle.radius) {
          particle.vy *= -0.8;
          particle.y = Math.max(particle.radius, Math.min(this.bounds.height - particle.radius, particle.y));
        }
        break;

      case 'absorb':
        // Mark particle for removal if it goes out of bounds
        if (particle.x < -particle.radius || particle.x > this.bounds.width + particle.radius ||
            particle.y < -particle.radius || particle.y > this.bounds.height + particle.radius) {
          particle.life = 0;
        }
        break;
    }
  }

  // Update particle trail
  private updateTrail(particle: Particle): void {
    if (!particle.trail) return;

    // Add new trail point
    particle.trail.unshift({
      x: particle.x,
      y: particle.y,
      opacity: particle.opacity,
      age: 0
    });

    // Update trail points and remove old ones
    particle.trail = particle.trail
      .map(point => ({ ...point, age: point.age + 1, opacity: point.opacity * 0.95 }))
      .filter((point, index) => index < this.config.trailLength && point.opacity > 0.01);
  }

  // Update all particles
  update(deltaTime: number = 16): void {
    this.time += deltaTime;

    this.particles.forEach(particle => {
      // Apply forces
      this.applyForces(particle);

      // Update velocity with acceleration
      particle.vx += particle.ax;
      particle.vy += particle.ay;

      // Apply friction
      particle.vx *= (1 - this.config.friction * 0.01);
      particle.vy *= (1 - this.config.friction * 0.01);

      // Limit velocity based on particle type
      const maxVelocity = particle.type === 'creative' ? 3 : 2;
      const velocity = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (velocity > maxVelocity) {
        particle.vx = (particle.vx / velocity) * maxVelocity;
        particle.vy = (particle.vy / velocity) * maxVelocity;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Handle boundaries
      this.handleBoundaries(particle);

      // Update trail
      this.updateTrail(particle);

      // Update life
      particle.maxLife -= 1;
      particle.life = Math.max(0, particle.maxLife / (particle.maxLife + 100));

      // Add some life variation based on movement
      const movement = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      particle.opacity = Math.min(1, 0.3 + movement * 0.3 + particle.life * 0.4);
    });

    // Remove dead particles
    this.particles = this.particles.filter(particle => particle.life > 0);

    // Respawn particles if needed (optional)
    if (this.particles.length < 10) {
      this.addParticles('floating', 1);
    }
  }

  // Get all particles for rendering
  getParticles(): Particle[] {
    return this.particles;
  }

  // Get particle count
  getParticleCount(): number {
    return this.particles.length;
  }

  // Set new bounds
  setBounds(width: number, height: number): void {
    this.bounds = { width, height };
  }

  // Reset all particles
  reset(): void {
    this.particles = [];
    this.forces = [];
    this.time = 0;
  }

  // Get performance stats
  getStats(): {
    particleCount: number;
    forces: number;
    averageVelocity: number;
    averageLife: number;
  } {
    const totalVelocity = this.particles.reduce((sum, p) => 
      sum + Math.sqrt(p.vx * p.vx + p.vy * p.vy), 0);
    const totalLife = this.particles.reduce((sum, p) => sum + p.life, 0);

    return {
      particleCount: this.particles.length,
      forces: this.forces.length,
      averageVelocity: this.particles.length > 0 ? totalVelocity / this.particles.length : 0,
      averageLife: this.particles.length > 0 ? totalLife / this.particles.length : 0
    };
  }
}

export default ParticlePhysicsEngine;
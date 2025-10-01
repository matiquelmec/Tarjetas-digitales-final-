'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransitionProps {
  children: React.ReactNode;
  type: 'fade' | 'slide' | 'zoom' | 'flip' | 'morph' | 'dissolve' | 'glitch' | 'cube' | 'cards';
  duration?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  onComplete?: () => void;
}

export const CinematicTransition: React.FC<TransitionProps> = ({
  children,
  type = 'fade',
  duration = 0.8,
  direction = 'right',
  onComplete
}) => {
  const transitions = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration }
    },
    
    slide: {
      initial: { 
        x: direction === 'left' ? '100%' : direction === 'right' ? '-100%' : 0,
        y: direction === 'up' ? '100%' : direction === 'down' ? '-100%' : 0,
        opacity: 0 
      },
      animate: { x: 0, y: 0, opacity: 1 },
      exit: { 
        x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
        y: direction === 'up' ? '-100%' : direction === 'down' ? '100%' : 0,
        opacity: 0 
      },
      transition: { duration, type: 'spring', damping: 25, stiffness: 200 }
    },
    
    zoom: {
      initial: { scale: 0, opacity: 0, rotateZ: -10 },
      animate: { scale: 1, opacity: 1, rotateZ: 0 },
      exit: { scale: 2, opacity: 0, rotateZ: 10 },
      transition: { duration, type: 'spring', damping: 20 }
    },
    
    flip: {
      initial: { rotateY: 90, opacity: 0, scale: 0.8 },
      animate: { rotateY: 0, opacity: 1, scale: 1 },
      exit: { rotateY: -90, opacity: 0, scale: 0.8 },
      transition: { duration, type: 'spring', damping: 15 }
    },
    
    morph: {
      initial: { 
        scale: 0,
        borderRadius: '100%',
        filter: 'blur(20px)',
        opacity: 0
      },
      animate: { 
        scale: 1,
        borderRadius: '0%',
        filter: 'blur(0px)',
        opacity: 1
      },
      exit: { 
        scale: 0,
        borderRadius: '100%',
        filter: 'blur(20px)',
        opacity: 0
      },
      transition: { duration: duration * 1.2 }
    },
    
    dissolve: {
      initial: { 
        opacity: 0,
        filter: 'brightness(2) contrast(0.5) saturate(0)',
        scale: 1.1
      },
      animate: { 
        opacity: 1,
        filter: 'brightness(1) contrast(1) saturate(1)',
        scale: 1
      },
      exit: { 
        opacity: 0,
        filter: 'brightness(0) contrast(2) saturate(0)',
        scale: 0.9
      },
      transition: { duration }
    },
    
    glitch: {
      initial: { 
        opacity: 0,
        x: -10,
        filter: 'hue-rotate(90deg)',
        textShadow: '5px 5px 0 #ff00ff, -5px -5px 0 #00ffff'
      },
      animate: { 
        opacity: [0, 1, 0.8, 1],
        x: [0, -5, 5, -2, 2, 0],
        filter: ['hue-rotate(90deg)', 'hue-rotate(0deg)'],
        textShadow: ['5px 5px 0 #ff00ff, -5px -5px 0 #00ffff', 'none']
      },
      exit: { 
        opacity: 0,
        x: 10,
        filter: 'hue-rotate(-90deg)'
      },
      transition: { 
        duration: duration * 0.8,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }
    },
    
    cube: {
      initial: { 
        rotateX: 90,
        rotateY: 0,
        opacity: 0,
        transformPerspective: 1200
      },
      animate: { 
        rotateX: 0,
        rotateY: 0,
        opacity: 1
      },
      exit: { 
        rotateX: -90,
        rotateY: 0,
        opacity: 0
      },
      transition: { 
        duration,
        type: 'spring',
        damping: 15,
        stiffness: 100
      }
    },
    
    cards: {
      initial: { 
        rotateY: -180,
        rotateX: 20,
        scale: 0.7,
        opacity: 0,
        z: -100
      },
      animate: { 
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        z: 0
      },
      exit: { 
        rotateY: 180,
        rotateX: -20,
        scale: 0.7,
        opacity: 0,
        z: -100
      },
      transition: { 
        duration: duration * 1.2,
        type: 'spring',
        damping: 20
      }
    }
  };

  const selectedTransition = transitions[type] || transitions.fade;

  return (
    <motion.div
      initial={selectedTransition.initial}
      animate={selectedTransition.animate}
      exit={selectedTransition.exit}
      transition={selectedTransition.transition}
      onAnimationComplete={onComplete}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

// Componente para animaciones de elementos dentro del slide
interface ElementAnimationProps {
  children: React.ReactNode;
  type: 'parallax' | 'ken-burns' | 'particle-burst' | 'typewriter' | 'float' | 'pulse';
  delay?: number;
  duration?: number;
}

export const ElementAnimation: React.FC<ElementAnimationProps> = ({
  children,
  type,
  delay = 0,
  duration = 1
}) => {
  const animations = {
    parallax: {
      initial: { y: 50, opacity: 0 },
      animate: { 
        y: 0, 
        opacity: 1,
        transition: {
          delay,
          duration,
          type: 'spring',
          damping: 15
        }
      }
    },
    
    'ken-burns': {
      animate: {
        scale: [1, 1.1, 1.05],
        x: [0, -10, 5, 0],
        y: [0, 5, -5, 0],
        transition: {
          delay,
          duration: duration * 3,
          repeat: Infinity,
          repeatType: 'reverse'
        }
      }
    },
    
    'particle-burst': {
      initial: { 
        scale: 0,
        opacity: 0,
        filter: 'blur(10px)'
      },
      animate: {
        scale: [0, 1.2, 1],
        opacity: [0, 1, 1],
        filter: ['blur(10px)', 'blur(0px)', 'blur(0px)'],
        transition: {
          delay,
          duration,
          times: [0, 0.6, 1]
        }
      }
    },
    
    typewriter: {
      initial: { width: 0, opacity: 0 },
      animate: {
        width: '100%',
        opacity: 1,
        transition: {
          delay,
          duration: duration * 2,
          ease: 'linear'
        }
      }
    },
    
    float: {
      animate: {
        y: [0, -10, 0],
        transition: {
          delay,
          duration: duration * 2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }
      }
    },
    
    pulse: {
      animate: {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
        transition: {
          delay,
          duration,
          repeat: Infinity,
          repeatType: 'reverse'
        }
      }
    }
  };

  const selectedAnimation = animations[type] || animations.parallax;

  return (
    <motion.div
      {...selectedAnimation}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

// Hook para controlar transiciones programáticamente
export const useTransitionController = () => {
  const [currentTransition, setCurrentTransition] = useState<string>('fade');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = (type: string, callback?: () => void) => {
    setIsTransitioning(true);
    setCurrentTransition(type);
    
    setTimeout(() => {
      setIsTransitioning(false);
      if (callback) callback();
    }, 1000);
  };

  return {
    currentTransition,
    isTransitioning,
    startTransition
  };
};

// Efectos de partículas para fondos
export const ParticleEffect: React.FC<{ intensity?: number }> = ({ intensity = 50 }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: intensity }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1
    }));
    setParticles(newParticles);
  }, [intensity]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
          animate={{
            y: [-20, 20],
            x: [-10, 10],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

export default CinematicTransition;
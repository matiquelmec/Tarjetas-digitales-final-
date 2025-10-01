'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // 0-1
  normalizedY: number; // 0-1
  elementX: number; // relative to tracked element
  elementY: number; // relative to tracked element
  isInside: boolean;
}

interface MouseTrackingConfig {
  smoothing?: number; // 0.1-1.0, lower = smoother
  threshold?: number; // minimum movement to trigger update
  updateInterval?: number; // ms between updates
  enableGlow?: boolean;
  enableTilt?: boolean;
  enableParticles?: boolean;
  sensitivity?: number; // 0.1-2.0, how responsive effects are
}

interface UseMouseTrackingReturn {
  mousePosition: MousePosition;
  isTracking: boolean;
  bindToElement: (element: HTMLElement | null) => void;
  trackingStyles: React.CSSProperties;
  glowStyles: React.CSSProperties;
  tiltStyles: React.CSSProperties;
  particleStyles: React.CSSProperties;
  reset: () => void;
}

export function useMouseTracking(config: MouseTrackingConfig = {}): UseMouseTrackingReturn {
  const {
    smoothing = 0.15,
    threshold = 2,
    updateInterval = 16, // ~60fps
    enableGlow = true,
    enableTilt = true,
    enableParticles = false,
    sensitivity = 1.0
  } = config;

  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0.5,
    normalizedY: 0.5,
    elementX: 0,
    elementY: 0,
    isInside: false
  });

  const [isTracking, setIsTracking] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const animationFrameRef = useRef<number>();
  const targetPositionRef = useRef({ x: 0, y: 0 });
  const currentPositionRef = useRef({ x: 0, y: 0 });

  // Smooth interpolation function
  const lerp = useCallback((start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  }, []);

  // Update mouse position with smoothing
  const updateMousePosition = useCallback(() => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const targetX = targetPositionRef.current.x;
    const targetY = targetPositionRef.current.y;

    // Smooth interpolation
    currentPositionRef.current.x = lerp(currentPositionRef.current.x, targetX, smoothing);
    currentPositionRef.current.y = lerp(currentPositionRef.current.y, targetY, smoothing);

    const smoothX = currentPositionRef.current.x;
    const smoothY = currentPositionRef.current.y;

    // Calculate element-relative positions
    const elementX = smoothX - rect.left;
    const elementY = smoothY - rect.top;

    // Normalize to 0-1 based on element size
    const normalizedX = Math.max(0, Math.min(1, elementX / rect.width));
    const normalizedY = Math.max(0, Math.min(1, elementY / rect.height));

    // Check if inside element
    const isInside = elementX >= 0 && elementX <= rect.width && 
                     elementY >= 0 && elementY <= rect.height;

    const newPosition: MousePosition = {
      x: smoothX,
      y: smoothY,
      normalizedX,
      normalizedY,
      elementX,
      elementY,
      isInside
    };

    setMousePosition(newPosition);

    // Continue animation if tracking
    if (isTracking) {
      animationFrameRef.current = requestAnimationFrame(updateMousePosition);
    }
  }, [smoothing, lerp, isTracking]);

  // Handle mouse move
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const newX = event.clientX;
    const newY = event.clientY;

    // Check if movement exceeds threshold
    const deltaX = Math.abs(newX - targetPositionRef.current.x);
    const deltaY = Math.abs(newY - targetPositionRef.current.y);

    if (deltaX > threshold || deltaY > threshold) {
      targetPositionRef.current.x = newX;
      targetPositionRef.current.y = newY;
    }
  }, [threshold]);

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    setIsTracking(true);
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsTracking(false);
    // Smoothly return to center
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      targetPositionRef.current.x = rect.left + rect.width / 2;
      targetPositionRef.current.y = rect.top + rect.height / 2;
    }
  }, []);

  // Bind to element
  const bindToElement = useCallback((element: HTMLElement | null) => {
    // Clean up previous element
    if (elementRef.current) {
      elementRef.current.removeEventListener('mouseenter', handleMouseEnter);
      elementRef.current.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
    }

    // Stop current animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    elementRef.current = element;

    if (element) {
      // Initialize position to center of element
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      targetPositionRef.current = { x: centerX, y: centerY };
      currentPositionRef.current = { x: centerX, y: centerY };

      // Add event listeners
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mousemove', handleMouseMove);

      // Start animation loop
      updateMousePosition();
    }
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove, updateMousePosition]);

  // Generate tracking styles (basic cursor following)
  const trackingStyles: React.CSSProperties = {
    transition: isTracking ? 'none' : 'all 0.3s ease-out',
    transform: isTracking 
      ? `translate(${(mousePosition.normalizedX - 0.5) * 10 * sensitivity}px, ${(mousePosition.normalizedY - 0.5) * 10 * sensitivity}px)`
      : 'translate(0px, 0px)'
  };

  // Generate glow effect styles
  const glowStyles: React.CSSProperties = enableGlow ? {
    position: 'relative',
    overflow: 'visible',
    ...(isTracking && mousePosition.isInside && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: `${mousePosition.elementY - 50}px`,
        left: `${mousePosition.elementX - 50}px`,
        width: '100px',
        height: '100px',
        background: `radial-gradient(circle, rgba(0, 246, 255, ${0.3 * sensitivity}) 0%, rgba(0, 246, 255, ${0.1 * sensitivity}) 50%, transparent 70%)`,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1,
        filter: 'blur(20px)',
        transition: 'opacity 0.3s ease'
      }
    })
  } : {};

  // Generate tilt effect styles
  const tiltStyles: React.CSSProperties = enableTilt ? {
    transform: isTracking && mousePosition.isInside
      ? `perspective(1000px) rotateX(${(mousePosition.normalizedY - 0.5) * -15 * sensitivity}deg) rotateY(${(mousePosition.normalizedX - 0.5) * 15 * sensitivity}deg) translateZ(10px)`
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
    transition: isTracking ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transformStyle: 'preserve-3d'
  } : {};

  // Generate particle effect styles (placeholder for CSS variables)
  const particleStyles: React.CSSProperties = enableParticles ? {
    '--mouse-x': `${mousePosition.normalizedX}`,
    '--mouse-y': `${mousePosition.normalizedY}`,
    '--tracking': isTracking ? '1' : '0'
  } as React.CSSProperties : {};

  // Reset function
  const reset = useCallback(() => {
    setIsTracking(false);
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      targetPositionRef.current = { x: centerX, y: centerY };
      currentPositionRef.current = { x: centerX, y: centerY };
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('mouseenter', handleMouseEnter);
        elementRef.current.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove]);

  return {
    mousePosition,
    isTracking,
    bindToElement,
    trackingStyles,
    glowStyles,
    tiltStyles,
    particleStyles,
    reset
  };
}

export default useMouseTracking;
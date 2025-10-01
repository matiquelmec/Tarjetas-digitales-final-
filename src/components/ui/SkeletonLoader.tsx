/**
 * Componentes de loading skeleton para mejor UX
 * Proporciona feedback visual mientras cargan los datos
 */

import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

interface SkeletonLoaderProps {
  className?: string;
  style?: React.CSSProperties;
}

// Skeleton básico
export const Skeleton: React.FC<SkeletonLoaderProps & { width?: string; height?: string }> = ({ 
  width = '100%', 
  height = '1rem', 
  className = '', 
  style = {} 
}) => (
  <div 
    className={`skeleton-pulse ${className}`}
    style={{
      width,
      height,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '4px',
      animation: 'skeleton-pulse 1.5s ease-in-out infinite',
      ...style
    }}
  />
);

// Skeleton para cards de estadísticas
export const StatCardSkeleton: React.FC<SkeletonLoaderProps> = ({ className = '' }) => (
  <div className={`stat-card ${className}`}>
    <div className="d-flex align-items-center mb-3">
      <Skeleton width="48px" height="48px" style={{ borderRadius: '12px' }} className="me-3" />
      <div className="flex-grow-1">
        <Skeleton width="80%" height="1.5rem" className="mb-2" />
        <Skeleton width="60%" height="1rem" />
      </div>
    </div>
    <Skeleton width="100%" height="2rem" className="mb-2" />
    <Skeleton width="70%" height="1rem" />
  </div>
);

// Skeleton para tarjetas en dashboard/cards
export const CardItemSkeleton: React.FC<SkeletonLoaderProps> = ({ className = '' }) => (
  <div className={`card-item ${className}`}>
    <div className="d-flex justify-content-between align-items-start mb-3">
      <div className="flex-grow-1">
        <Skeleton width="80%" height="1.5rem" className="mb-2" />
        <Skeleton width="60%" height="1rem" className="mb-2" />
        <div className="d-flex align-items-center gap-2">
          <Skeleton width="60px" height="20px" style={{ borderRadius: '10px' }} />
          <Skeleton width="80px" height="16px" />
        </div>
      </div>
    </div>
    
    <div className="row g-3 mb-4">
      <div className="col-6">
        <div className="d-flex align-items-center">
          <Skeleton width="32px" height="32px" style={{ borderRadius: '6px' }} className="me-2" />
          <div>
            <Skeleton width="40px" height="1.2rem" className="mb-1" />
            <Skeleton width="50px" height="0.8rem" />
          </div>
        </div>
      </div>
      <div className="col-6">
        <div className="d-flex align-items-center">
          <Skeleton width="32px" height="32px" style={{ borderRadius: '6px' }} className="me-2" />
          <div>
            <Skeleton width="40px" height="1.2rem" className="mb-1" />
            <Skeleton width="50px" height="0.8rem" />
          </div>
        </div>
      </div>
    </div>
    
    <div className="d-flex gap-2">
      <Skeleton width="100%" height="32px" style={{ borderRadius: '8px' }} />
      <Skeleton width="100%" height="32px" style={{ borderRadius: '8px' }} />
      <Skeleton width="60px" height="32px" style={{ borderRadius: '8px' }} />
    </div>
  </div>
);

// Skeleton para formularios
export const FormSkeleton: React.FC<SkeletonLoaderProps> = ({ className = '' }) => (
  <div className={className}>
    <div className="mb-3">
      <Skeleton width="120px" height="1rem" className="mb-2" />
      <Skeleton width="100%" height="38px" style={{ borderRadius: '6px' }} />
    </div>
    <div className="mb-3">
      <Skeleton width="150px" height="1rem" className="mb-2" />
      <Skeleton width="100%" height="38px" style={{ borderRadius: '6px' }} />
    </div>
    <div className="mb-3">
      <Skeleton width="100px" height="1rem" className="mb-2" />
      <Skeleton width="100%" height="100px" style={{ borderRadius: '6px' }} />
    </div>
    <div className="d-flex justify-content-between">
      <Skeleton width="80px" height="38px" style={{ borderRadius: '6px' }} />
      <Skeleton width="100px" height="38px" style={{ borderRadius: '6px' }} />
    </div>
  </div>
);

// Skeleton para business card preview
export const BusinessCardSkeleton: React.FC<SkeletonLoaderProps> = ({ className = '' }) => (
  <Card className={`business-card-custom ${className}`} style={{ maxWidth: '400px', margin: 'auto' }}>
    <Card.Body className="text-center p-4">
      <Skeleton width="120px" height="120px" style={{ borderRadius: '50%', margin: '0 auto 20px' }} />
      <Skeleton width="80%" height="2rem" className="mx-auto mb-2" />
      <Skeleton width="70%" height="1.5rem" className="mx-auto mb-4" />
      <Skeleton width="100%" height="4rem" className="mb-4" />
      
      <div className="d-flex flex-column gap-2">
        <Skeleton width="100%" height="42px" style={{ borderRadius: '10px' }} />
        <Skeleton width="100%" height="42px" style={{ borderRadius: '10px' }} />
        <Skeleton width="100%" height="42px" style={{ borderRadius: '10px' }} />
      </div>
    </Card.Body>
  </Card>
);

// CSS para la animación de pulse
export const SkeletonStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes skeleton-pulse {
      0% {
        opacity: 0.4;
      }
      50% {
        opacity: 0.8;
      }
      100% {
        opacity: 0.4;
      }
    }

    .skeleton-pulse {
      animation: skeleton-pulse 1.5s ease-in-out infinite;
    }

    /* Skeleton con glassmorphism para glass-cards */
    .glass-card .skeleton-pulse {
      background: rgba(255, 255, 255, 0.2) !important;
      backdrop-filter: blur(5px);
    }

    /* Responsive skeletons */
    @media (max-width: 768px) {
      .skeleton-mobile-hidden {
        display: none;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .skeleton-pulse {
        background: rgba(255, 255, 255, 0.3) !important;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .skeleton-pulse {
        animation: none;
        opacity: 0.6;
      }
    }
  `}} />
);

// Hook para controlar estados de loading
export const useLoadingState = (initialState = false) => {
  const [loading, setLoading] = React.useState(initialState);
  
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const withLoading = async <T,>(asyncFn: () => Promise<T>): Promise<T> => {
    startLoading();
    try {
      return await asyncFn();
    } finally {
      stopLoading();
    }
  };

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading
  };
};

// Componente para mostrar múltiples skeletons
export const SkeletonGrid: React.FC<{
  count: number;
  component: React.ComponentType<Record<string, unknown>>;
  className?: string;
  cols?: number;
}> = ({ count, component: Component, className = '', cols = 3 }) => (
  <Row className={className}>
    {Array.from({ length: count }).map((_, index) => (
      <Col key={index} lg={12 / cols} md={6} className="mb-4">
        <Component />
      </Col>
    ))}
  </Row>
);
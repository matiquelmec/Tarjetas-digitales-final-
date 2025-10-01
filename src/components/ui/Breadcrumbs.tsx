/**
 * Componente de Breadcrumbs para navegación contextual
 * Mejora la experiencia de usuario mostrando la ubicación actual
 */

'use client';

import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  separator?: string;
}

// Mapeo de rutas a breadcrumbs
const routeMap: Record<string, BreadcrumbItem[]> = {
  '/': [
    { label: 'Inicio', icon: '🏠', active: true }
  ],
  '/dashboard': [
    { label: 'Inicio', href: '/', icon: '🏠' },
    { label: 'Dashboard', icon: '📊', active: true }
  ],
  '/dashboard/cards': [
    { label: 'Inicio', href: '/', icon: '🏠' },
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Mis Tarjetas', icon: '💼', active: true }
  ],
  '/dashboard/cv': [
    { label: 'Inicio', href: '/', icon: '🏠' },
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'CVs Inteligentes', icon: '🚀', active: true }
  ],
  '/create': [
    { label: 'Inicio', href: '/', icon: '🏠' },
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Crear Tarjeta', icon: '✨', active: true }
  ],
  '/pricing': [
    { label: 'Inicio', href: '/', icon: '🏠' },
    { label: 'Planes', icon: '💰', active: true }
  ]
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items, 
  className = '',
  separator = '/' 
}) => {
  const pathname = usePathname();
  
  // Usar items personalizados o generar automáticamente desde la ruta
  const breadcrumbItems = items || routeMap[pathname] || [
    { label: 'Inicio', href: '/', icon: '🏠' },
    { label: 'Página', active: true }
  ];

  if (breadcrumbItems.length <= 1) {
    return null; // No mostrar breadcrumbs si solo hay un elemento
  }

  return (
    <div className={`breadcrumbs-container ${className}`}>
      <style jsx>{`
        .breadcrumbs-container {
          margin-bottom: 1rem;
        }
        
        .breadcrumb {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          padding: 0.5rem 1rem;
          margin: 0;
        }
        
        .breadcrumb-item a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.2s ease;
          font-size: 0.9rem;
        }
        
        .breadcrumb-item a:hover {
          color: rgba(255, 255, 255, 1);
        }
        
        .breadcrumb-item.active {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }
        
        .breadcrumb-item + .breadcrumb-item::before {
          content: "${separator}";
          color: rgba(255, 255, 255, 0.5);
          margin: 0 0.5rem;
        }
        
        @media (max-width: 768px) {
          .breadcrumb {
            padding: 0.4rem 0.8rem;
            font-size: 0.85rem;
          }
          
          .breadcrumb-item + .breadcrumb-item::before {
            margin: 0 0.3rem;
          }
          
          /* Ocultar elementos intermedios en mobile si hay muchos */
          .breadcrumb-item:not(:first-child):not(:last-child):not(:nth-last-child(2)) {
            display: none;
          }
          
          .breadcrumb-item:nth-last-child(3)::after {
            content: "...";
            margin: 0 0.3rem;
            color: rgba(255, 255, 255, 0.5);
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .breadcrumb {
            background: rgba(255, 255, 255, 0.2);
          }
          
          .breadcrumb-item a {
            color: rgba(255, 255, 255, 0.95);
          }
        }
      `}</style>
      
      <Breadcrumb>
        {breadcrumbItems.map((item, index) => (
          <Breadcrumb.Item
            key={index}
            active={item.active || index === breadcrumbItems.length - 1}
            className={item.active ? 'active' : ''}
          >
            {item.href && !item.active ? (
              <Link href={item.href} className="breadcrumb-link">
                {item.icon && <span className="me-1">{item.icon}</span>}
                {item.label}
              </Link>
            ) : (
              <>
                {item.icon && <span className="me-1">{item.icon}</span>}
                {item.label}
              </>
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
};

// Hook para generar breadcrumbs dinámicos
export const useBreadcrumbs = (customItems?: BreadcrumbItem[]) => {
  const pathname = usePathname();
  
  const breadcrumbs = React.useMemo(() => {
    if (customItems) return customItems;
    
    const pathSegments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/', icon: '🏠' }
    ];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Mapear segmentos a labels legibles
      const labelMap: Record<string, { label: string; icon: string }> = {
        'dashboard': { label: 'Dashboard', icon: '📊' },
        'cards': { label: 'Mis Tarjetas', icon: '💼' },
        'cv': { label: 'CVs Inteligentes', icon: '🚀' },
        'create': { label: 'Crear Tarjeta', icon: '✨' },
        'pricing': { label: 'Planes', icon: '💰' },
        'auth': { label: 'Autenticación', icon: '🔐' },
        'error': { label: 'Error', icon: '⚠️' }
      };
      
      const segmentInfo = labelMap[segment] || { 
        label: segment.charAt(0).toUpperCase() + segment.slice(1), 
        icon: '📄' 
      };
      
      items.push({
        label: segmentInfo.label,
        href: isLast ? undefined : currentPath,
        icon: segmentInfo.icon,
        active: isLast
      });
    });
    
    return items;
  }, [pathname, customItems]);
  
  return breadcrumbs;
};

// Componente automático que genera breadcrumbs basado en la ruta
export const AutoBreadcrumbs: React.FC<{ className?: string }> = ({ className }) => {
  const breadcrumbs = useBreadcrumbs();
  return <Breadcrumbs items={breadcrumbs} className={className} />;
};

export default Breadcrumbs;
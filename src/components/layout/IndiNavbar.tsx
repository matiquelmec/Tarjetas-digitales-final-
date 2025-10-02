'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import IndiLogo from '@/components/ui/IndiLogo';

interface IndiNavbarProps {
  variant?: 'transparent' | 'solid' | 'gradient';
  position?: 'fixed' | 'sticky' | 'relative';
  showActions?: boolean;
}

const IndiNavbar: React.FC<IndiNavbarProps> = ({
  variant = 'transparent',
  position = 'relative',
  showActions = true
}) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const getNavbarClasses = () => {
    let classes = 'indi-navbar-container';
    
    switch (variant) {
      case 'solid':
        classes += ' navbar-solid';
        break;
      case 'gradient':
        classes += ' navbar-gradient';
        break;
      default:
        classes += ' navbar-transparent';
    }
    
    if (position !== 'relative') {
      classes += ` navbar-${position}`;
    }
    
    return classes;
  };

  return (
    <>
      <style jsx>{`
        .indi-navbar-container {
          padding: 0.25rem 0;
          transition: all 0.3s ease;
          z-index: 1000;
        }
        
        .navbar-transparent {
          background: transparent;
        }
        
        .navbar-solid {
          background: rgba(15, 12, 41, 0.95);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(0, 246, 255, 0.2);
        }
        
        .navbar-gradient {
          background: linear-gradient(135deg, 
            rgba(0, 198, 255, 0.1), 
            rgba(0, 114, 255, 0.1), 
            rgba(142, 45, 226, 0.1)
          );
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 246, 255, 0.3);
        }
        
        .navbar-fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
        }
        
        .navbar-sticky {
          position: sticky;
          top: 0;
        }
        
        .nav-actions-container {
          position: absolute;
          top: 20px;
          right: 20px;
          transform: none;
          z-index: 10;
          pointer-events: auto;
        }
        
        .nav-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
        }
        
        .btn-nav {
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          transition: all 0.3s ease;
          text-decoration: none;
          border: none;
        }
        
        .btn-nav-primary {
          background: rgba(255, 255, 255, 0.9);
          color: #1a1a1a;
          border: 2px solid rgba(255, 255, 255, 0.3);
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }
        
        .btn-nav-primary:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.5);
          color: #000000;
          border-color: rgba(255, 255, 255, 0.8);
        }
        
        .btn-nav-outline {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.4);
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .btn-nav-outline:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.8);
          transform: translateY(-3px) scale(1.02);
          color: #1a1a1a;
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
        }
        
        .btn-nav-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.5);
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .btn-nav-secondary:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.8);
          color: #1a1a1a;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
        }
        
        .btn-nav-upgrade {
          background: linear-gradient(135deg, #D4A017, #B8860B);
          color: white;
          border: 2px solid #D4A017;
          font-weight: 700;
          box-shadow: 0 6px 20px rgba(212, 160, 23, 0.4);
          backdrop-filter: blur(10px);
          animation: upgradeGlow 2s ease-in-out infinite alternate;
        }
        
        .btn-nav-upgrade:hover {
          background: linear-gradient(135deg, #E5B41F, #CD950C);
          border-color: #E5B41F;
          color: white;
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 10px 30px rgba(212, 160, 23, 0.6);
        }
        
        @keyframes upgradeGlow {
          0% { 
            box-shadow: 0 6px 20px rgba(212, 160, 23, 0.4);
          }
          100% { 
            box-shadow: 0 8px 25px rgba(212, 160, 23, 0.6), 0 0 20px rgba(212, 160, 23, 0.3);
          }
        }
        
        .user-greeting {
          background: rgba(255, 255, 255, 0.25);
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 20px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(15px);
          white-space: nowrap;
        }
        
        /* Forzar posición fija en la derecha SIEMPRE */
        .nav-actions-fixed-right {
          position: fixed !important;
          top: 20px !important;
          right: 20px !important;
          left: auto !important;
          transform: none !important;
          margin: 0 !important;
          width: auto !important;
          display: block !important;
          justify-content: flex-start !important;
        }
        
        @media (max-width: 768px) {
          .indi-navbar-container {
            padding: 0.25rem 0; /* Mobile compact navbar */
          }
          
          /* Ocultar botones superiores en móvil */
          .nav-actions-fixed-right {
            display: none !important;
          }
          
          /* Mostrar bottom navigation en móvil */
          .bottom-nav-mobile {
            display: block !important;
          }
          
          /* Agregar espacio al body para bottom navigation */
          body {
            padding-bottom: 100px !important;
          }
          
          /* Asegurar que el contenido principal tenga espacio */
          .container, .container-fluid {
            margin-bottom: 100px !important;
            padding-bottom: 20px !important;
          }
          
          /* Espacio adicional para páginas con mucho contenido */
          .animated-gradient-background {
            padding-bottom: 100px !important;
          }
          
          /* Asegurar que elementos al final sean visibles */
          .row:last-child, .col:last-child {
            margin-bottom: 20px !important;
          }
          
          .nav-actions {
            gap: 0.5rem;
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .btn-nav {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
          
          .user-greeting {
            text-align: center;
            width: 100%;
            margin-top: 0.5rem;
          }
          
          .btn-nav-upgrade {
            order: -1; /* Mostrar primero en móvil */
            flex-basis: 100%;
            margin-bottom: 0.5rem;
          }
        }
        
        /* Forzar centrado del logo */
        .logo-container {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Asegurar que el container no interfiera */
        .navbar-container-fix {
          margin: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        
        /* Bottom Navigation Bar para móvil */
        .bottom-nav-mobile {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(15, 12, 41, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 246, 255, 0.3);
          padding: 0.75rem 0 calc(0.75rem + env(safe-area-inset-bottom));
          z-index: 1000;
          display: none;
        }
        
        .bottom-nav-items {
          display: flex;
          justify-content: space-around;
          align-items: center;
          max-width: 500px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          padding: 0.5rem;
          border-radius: 12px;
          min-width: 60px;
        }
        
        .bottom-nav-item:hover {
          color: #00f6ff;
          background: rgba(0, 246, 255, 0.1);
          text-decoration: none;
        }
        
        .bottom-nav-item.active {
          color: #00f6ff;
          background: rgba(0, 246, 255, 0.15);
        }
        
        .bottom-nav-icon {
          font-size: 1.2rem;
          margin-bottom: 0.25rem;
          filter: drop-shadow(0 0 4px rgba(0, 246, 255, 0.3));
        }
        
        .bottom-nav-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-align: center;
          line-height: 1;
        }
        
        .bottom-nav-upgrade {
          background: linear-gradient(135deg, #D4A017, #B8860B) !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(212, 160, 23, 0.4);
        }
        
        .bottom-nav-upgrade:hover {
          background: linear-gradient(135deg, #E5B41F, #CD950C) !important;
          color: white !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(212, 160, 23, 0.5);
        }
      `}</style>
      
      <div className={getNavbarClasses()}>
        <Container fluid className="navbar-container-fix">
          <Row className="align-items-center position-relative">
            {/* Logo Indi - Centrado absoluto */}
            <Col xs={12} className="logo-container">
              <IndiLogo
                variant="navbar"
                size="xl"
                animated={true}
                interactive={true}
                showName={true}
                href="/"
                state="normal"
              />
            </Col>
            
            {/* Acciones - Posición absoluta derecha */}
            {showActions && (
              <div className="nav-actions-container nav-actions-fixed-right" style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000
              }}>
                <div className="nav-actions">
                  {session ? (
                    <>
                      <Link href="/pricing" className="btn-nav btn-nav-upgrade">
                        ⭐ Actualizar Plan
                      </Link>
                      <Link href="/dashboard" className="btn-nav btn-nav-outline">
                        📊 Dashboard
                      </Link>
                      <Link href="/create" className="btn-nav btn-nav-primary">
                        ✨ Crear
                      </Link>
                      <button 
                        onClick={() => signOut()} 
                        className="btn-nav btn-nav-secondary"
                      >
                        👋 Salir
                      </button>
                      <div className="user-greeting d-none d-md-block">
                        Hola, {session.user?.name?.split(' ')[0] || 'Terrícola'} 👋
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/demo" className="btn-nav btn-nav-outline">
                        🌟 Demo
                      </Link>
                      <Link href="/pricing" className="btn-nav btn-nav-outline">
                        💰 Precios
                      </Link>
                      <button
                        onClick={() => {
                          if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SKIP_GOOGLE_AUTH === 'true') {
                            window.location.href = '/dev-login';
                          } else {
                            signIn('google');
                          }
                        }}
                        className="btn-nav btn-nav-primary"
                      >
                        🚀 Comenzar Viaje
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </Row>
        </Container>
      </div>
      
      {/* Bottom Navigation Bar para móvil */}
      {showActions && (
        <div className="bottom-nav-mobile">
          <div className="bottom-nav-items">
            {session ? (
              <>
                <Link href="/dashboard" className={`bottom-nav-item ${pathname === '/dashboard' || pathname.startsWith('/dashboard') ? 'active' : ''}`}>
                  <div className="bottom-nav-icon">📊</div>
                  <div className="bottom-nav-label">Dashboard</div>
                </Link>
                <Link href="/create" className={`bottom-nav-item ${pathname === '/create' ? 'active' : ''}`}>
                  <div className="bottom-nav-icon">✨</div>
                  <div className="bottom-nav-label">Crear</div>
                </Link>
                <Link href="/pricing" className={`bottom-nav-item bottom-nav-upgrade ${pathname === '/pricing' ? 'active' : ''}`}>
                  <div className="bottom-nav-icon">⭐</div>
                  <div className="bottom-nav-label">Plan</div>
                </Link>
                <button 
                  onClick={() => signOut()} 
                  className="bottom-nav-item"
                  style={{ border: 'none', background: 'transparent' }}
                >
                  <div className="bottom-nav-icon">👋</div>
                  <div className="bottom-nav-label">Salir</div>
                </button>
              </>
            ) : (
              <>
                <Link href="/" className={`bottom-nav-item ${pathname === '/' ? 'active' : ''}`}>
                  <div className="bottom-nav-icon">🏠</div>
                  <div className="bottom-nav-label">Inicio</div>
                </Link>
                <Link href="/demo" className={`bottom-nav-item ${pathname === '/demo' ? 'active' : ''}`}>
                  <div className="bottom-nav-icon">🌟</div>
                  <div className="bottom-nav-label">Demo</div>
                </Link>
                <Link href="/pricing" className={`bottom-nav-item ${pathname === '/pricing' ? 'active' : ''}`}>
                  <div className="bottom-nav-icon">💰</div>
                  <div className="bottom-nav-label">Precios</div>
                </Link>
                <button
                  onClick={() => {
                    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SKIP_GOOGLE_AUTH === 'true') {
                      window.location.href = '/dev-login';
                    } else {
                      signIn('google');
                    }
                  }}
                  className="bottom-nav-item"
                  style={{ border: 'none', background: 'transparent' }}
                >
                  <div className="bottom-nav-icon">🚀</div>
                  <div className="bottom-nav-label">Entrar</div>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default IndiNavbar;
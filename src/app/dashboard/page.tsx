'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthWrapper } from '../../components/AuthWrapper';
import { usePostLoginRedirect } from '@/hooks/usePostLoginRedirect';
import IndiNavbar from '@/components/layout/IndiNavbar';
import TrialBanner from '@/components/ui/TrialBanner';

interface CardData {
  id: string;
  title: string;
  name: string;
  profession: string;
  views: number;
  clicks: number;
  isActive: boolean;
  createdAt: string;
}

interface PlanLimits {
  maxCards: number;
  [key: string]: unknown;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [cards, setCards] = useState<CardData[]>([]);
  const [, setLoading] = useState(true);
  const [, setPlanLimits] = useState<PlanLimits | null>(null);
  const [, setShowWelcomeMessage] = useState(false);
  const [, setWelcomeMessage] = useState('');
  
  // Handle post-login redirection
  usePostLoginRedirect();

  useEffect(() => {
    if (session?.user?.id) {
      fetchCards();
      fetchPlanLimits();
      
      // Check if user came here with a specific intention
      const dashboardAction = sessionStorage.getItem('dashboardAction');
      if (dashboardAction) {
        sessionStorage.removeItem('dashboardAction');
        handleUserIntention(dashboardAction);
      }
    }
  }, [session]);

  const handleUserIntention = (intention: string) => {
    switch (intention) {
      case 'createCard':
        setWelcomeMessage('¡Perfecto! Aquí puedes crear tu nueva tarjeta digital. Haz clic en "Crear Nueva Tarjeta" para comenzar.');
        setShowWelcomeMessage(true);
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
          setShowWelcomeMessage(false);
        }, 5000);
        
        // Highlight the create button
        setTimeout(() => {
          const createButton = document.querySelector('[href="/create"]') as HTMLElement;
          if (createButton) {
            createButton.style.animation = 'pulse 2s';
          }
        }, 1000);
        break;
      case 'accessDashboard':
        setWelcomeMessage('¡Bienvenido a tu dashboard! Desde aquí puedes gestionar todas tus tarjetas digitales, ver estadísticas y crear nuevas.');
        setShowWelcomeMessage(true);
        
        // Auto-hide message after 6 seconds (un poco más tiempo para leer)
        setTimeout(() => {
          setShowWelcomeMessage(false);
        }, 6000);
        break;
      default:
        // Keep default overview tab
        break;
    }
  };

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/cards', {
        credentials: 'same-origin'
      });
      if (response.ok) {
        const data = await response.json();
        setCards(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanLimits = async () => {
    try {
      const response = await fetch('/api/user/plan-limits', {
        credentials: 'same-origin'
      });
      if (response.ok) {
        const data = await response.json();
        setPlanLimits(data);
      }
    } catch (error) {
      console.error('Error fetching plan limits:', error);
    }
  };

  return (
    <AuthWrapper>
      <style dangerouslySetInnerHTML={{__html: `
        body {
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          min-height: 100vh;
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .animated-gradient-background {
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          min-height: 100vh;
        }
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.5);
        }
        
        /* Nuevo diseño simplificado */
        .dashboard-header-modern {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .dashboard-title-clean {
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0;
          color: white;
        }
        
        .user-name-highlight {
          color: #00f6ff;
          text-shadow: 0 0 10px rgba(0, 246, 255, 0.5);
        }
        
        .dashboard-subtitle-clean {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }
        
        .btn-create-primary {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          padding: 12px 24px;
          border-radius: 16px;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 246, 255, 0.3);
        }
        
        .btn-create-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 246, 255, 0.5);
          background: linear-gradient(135deg, #00d4e7, #0056cc);
          color: white;
        }
        
        .stats-overview-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 2rem 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }
        
        .stat-item {
          padding: 1rem 0;
        }
        
        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .plan-badge-modern {
          background: linear-gradient(135deg, #ffd700, #ffb347);
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 700;
          color: #1a1a1a;
          font-size: 0.85rem;
          display: inline-block;
          margin-bottom: 0.5rem;
        }
        
        .section-title {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .product-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          height: 100%;
          display: block;
          border: 2px solid transparent;
        }
        
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          border-color: #00f6ff;
          color: inherit;
          text-decoration: none;
        }
        
        .product-card.coming-soon {
          opacity: 0.7;
        }
        
        .product-card.coming-soon:hover {
          border-color: #ffc107;
        }
        
        .product-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }
        
        .product-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #1a1a1a;
        }
        
        .product-description {
          color: #666;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        
        .product-stats {
          margin-bottom: 1rem;
        }
        
        .product-stats .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #00f6ff;
          margin-right: 0.5rem;
        }
        
        .product-stats .stat-text {
          color: #666;
          font-size: 0.9rem;
        }
        
        .product-status {
          font-size: 0.85rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 12px;
          display: inline-block;
        }
        
        .product-status.active {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
        }
        
        .product-status.coming-soon {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
        }
        
        .upgrade-banner {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.05));
          border: 2px solid rgba(255, 193, 7, 0.3);
          border-radius: 20px;
          padding: 1.5rem;
        }
        
        .upgrade-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .upgrade-icon {
          font-size: 3rem;
          flex-shrink: 0;
        }
        
        .upgrade-text {
          flex: 1;
        }
        
        .upgrade-text h5 {
          color: white;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }
        
        .upgrade-text p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }
        
        .btn-upgrade {
          background: linear-gradient(135deg, #ffc107, #ff8c00);
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 600;
          color: #1a1a1a;
          flex-shrink: 0;
        }
        
        .btn-upgrade:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 193, 7, 0.4);
          color: #1a1a1a;
        }
        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          min-height: 320px;
        }
        
        .module-description {
          flex: 1;
          display: flex;
          align-items: center;
          text-align: center;
          line-height: 1.4;
          padding: 0.5rem 0;
        }
        
        .module-description small {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.5;
        }
        
        .alien-stat-card {
          position: relative;
          overflow: hidden;
        }
        
        .alien-stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 
            0 16px 48px rgba(0, 0, 0, 0.2),
            0 0 32px rgba(0, 246, 255, 0.3);
        }
        
        .alien-glow-effect {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, transparent, #00f6ff, transparent, #8e2de2, transparent);
          background-size: 200% 200%;
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          filter: blur(8px);
          transition: opacity 0.3s ease;
          animation: alienGlowRotate 3s linear infinite;
        }
        
        .alien-stat-card:hover .alien-glow-effect {
          opacity: 0.6;
        }
        
        @keyframes alienGlowRotate {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        
        .alien-badge {
          border-radius: 12px;
          padding: 4px 12px;
          font-size: 0.85rem;
          font-weight: 600;
        }
        
        /* Botones de Creación Alienígena */
        .alien-create-btn {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 246, 255, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .alien-create-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 246, 255, 0.5);
          background: linear-gradient(135deg, #00d4e7, #0056cc);
          color: white;
        }
        
        .alien-create-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }
        
        .alien-create-btn:hover::before {
          left: 100%;
        }
        
        .alien-create-btn-disabled {
          background: linear-gradient(135deg, #6c757d, #495057);
          border: none;
          color: rgba(255, 255, 255, 0.6);
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        .create-icon {
          margin-right: 6px;
          font-size: 1em;
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
        }
        .alien-nav-link {
          border-radius: 16px;
          margin: 0 4px;
          transition: all 0.3s ease;
          color: rgba(255, 255, 255, 0.7) !important;
          font-weight: 600;
          position: relative;
          overflow: hidden;
        }
        
        .alien-nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 246, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }
        
        .alien-nav-link:hover::before {
          left: 100%;
        }
        
        .alien-nav-link.active {
          background: linear-gradient(135deg, #00f6ff, #0072ff) !important;
          color: white !important;
          box-shadow: 0 4px 20px rgba(0, 246, 255, 0.4);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        .alien-nav-link:hover:not(.active) {
          background: rgba(0, 246, 255, 0.1);
          color: #00f6ff !important;
          border: 1px solid rgba(0, 246, 255, 0.3);
        }
        .action-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          height: 100%;
        }
        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }
        .header-content {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 2rem;
        }
        .alien-primary-gradient {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          box-shadow: 0 4px 16px rgba(0, 246, 255, 0.3);
        }
        .alien-success-gradient {
          background: linear-gradient(135deg, #00ff88, #00cc6a);
          box-shadow: 0 4px 16px rgba(0, 255, 136, 0.3);
        }
        .alien-warning-gradient {
          background: linear-gradient(135deg, #ffaa00, #ff8800);
          box-shadow: 0 4px 16px rgba(255, 170, 0, 0.3);
        }
        .alien-info-gradient {
          background: linear-gradient(135deg, #8e2de2, #4a00e0);
          box-shadow: 0 4px 16px rgba(142, 45, 226, 0.3);
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }

        /* Cards clicables con hover effects */
        .clickable-stat-card {
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .clickable-stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .card-hover-text {
          opacity: 0;
          transition: opacity 0.3s ease;
          margin-top: 8px;
        }

        .clickable-stat-card:hover .card-hover-text {
          opacity: 1;
        }

        .clickable-stat-card:hover .alien-glow-effect {
          opacity: 0.8;
          transform: scale(1.1);
        }

        /* Centro de Comando Intergaláctico */
        .alien-command-center {
          position: relative;
          background: linear-gradient(135deg, rgba(15, 12, 41, 0.6), rgba(48, 43, 99, 0.4));
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          border: 2px solid rgba(0, 246, 255, 0.2);
          overflow: hidden;
          box-shadow: 
            0 8px 32px rgba(0, 246, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* Partículas espaciales del dashboard */
        .dashboard-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .space-particle {
          position: absolute;
          font-size: 1.2rem;
          animation: particleDrift 20s linear infinite;
          opacity: 0.3;
        }

        .particle-1 { top: 10%; left: 5%; animation-delay: 0s; }
        .particle-2 { top: 60%; left: 90%; animation-delay: -5s; }
        .particle-3 { bottom: 10%; left: 50%; animation-delay: -10s; }
        .particle-4 { top: 40%; right: 10%; animation-delay: -15s; }

        @keyframes particleDrift {
          0% { transform: translateX(0) translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateX(100px) translateY(-50px) rotate(360deg); opacity: 0; }
        }

        /* Badge de estado alienígena */
        .alien-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 246, 255, 0.1);
          border: 1px solid rgba(0, 246, 255, 0.3);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #00f6ff;
        }

        .signal-indicator {
          font-size: 1em;
          animation: signalPulse 2s ease-in-out infinite;
        }

        @keyframes signalPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .dashboard-welcome {
          position: relative;
          z-index: 2;
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          font-family: 'Montserrat', sans-serif;
        }

        .alien-glow-text {
          background: linear-gradient(135deg, #00f6ff, #0072ff, #8e2de2);
          background-size: 200% 200%;
          animation: alienTextGlow 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes alienTextGlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .dashboard-subtitle {
          font-size: 1.1rem;
          margin: 0;
        }

        .commander-name {
          color: #00f6ff;
          font-weight: 700;
          text-shadow: 0 0 10px rgba(0, 246, 255, 0.5);
        }

        /* Quick Stats Bar Alienígena */
        .quick-stats-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1.5rem;
          height: 100%;
        }

        .alien-stat {
          position: relative;
        }

        .stat-compact {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-icon {
          font-size: 1.5rem;
          margin-bottom: 4px;
          filter: drop-shadow(0 0 8px rgba(0, 246, 255, 0.6));
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .stat-label-compact {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 4px;
        }

        .stat-divider-compact {
          color: #00f6ff;
          font-size: 1.2rem;
          filter: drop-shadow(0 0 6px rgba(0, 246, 255, 0.8));
        }

        .plan-badge-alien {
          background: linear-gradient(135deg, #ffd700, #ffb347);
          padding: 6px 14px;
          border-radius: 14px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1a1a1a;
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }

        /* Responsive */
        @media (max-width: 991px) {
          .dashboard-header-modern {
            padding: 1.5rem 1rem;
            text-align: center;
          }
          
          .dashboard-title-clean {
            font-size: 1.8rem;
          }
          
          .btn-create-primary {
            margin-top: 1rem;
            width: 100%;
          }
          
          .stats-overview-card {
            padding: 1.5rem 0.5rem;
          }
          
          .stat-number {
            font-size: 2rem;
          }
          
          .product-card {
            text-align: center;
            padding: 1.5rem;
          }
          
          .upgrade-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          
          .btn-upgrade {
            width: 100%;
          }
        }
        
        @media (max-width: 576px) {
          .dashboard-header-modern {
            padding: 1rem;
          }
          
          .dashboard-title-clean {
            font-size: 1.5rem;
          }
          
          .stats-overview-card {
            padding: 1rem 0.25rem;
          }
          
          .stat-number {
            font-size: 1.5rem;
          }
          
          .stat-label {
            font-size: 0.75rem;
          }
        }
      `}} />
      <div className="animated-gradient-background">
        {/* Navbar con Indi */}
        <IndiNavbar variant="transparent" position="relative" showActions={true} />
        
        <Container className="py-4">
          <TrialBanner />
          {/* Dashboard Header Simplificado */}
          <div className="dashboard-header-modern">
            <Row className="align-items-center">
              <Col lg={8}>
                <div className="welcome-section">
                  <h1 className="dashboard-title-clean">
                    ¡Hola, <span className="user-name-highlight">{session?.user?.name?.split(' ')[0] || 'Usuario'}</span>! 👋
                  </h1>
                  <p className="dashboard-subtitle-clean">
                    Gestiona todas tus tarjetas digitales desde un solo lugar
                  </p>
                </div>
              </Col>
              <Col lg={4} className="text-end">
                <div className="header-actions">
                  <Link href="/create" className="text-decoration-none">
                    <Button className="btn-create-primary">
                      <span className="me-2">✨</span>
                      Crear Tarjeta
                    </Button>
                  </Link>
                </div>
              </Col>
            </Row>
          </div>


          {/* Tab Content */}
          {pathname === '/dashboard' && (
            <>
              {/* Stats Overview */}
              <Row className="mb-4">
                <Col>
                  <div className="stats-overview-card">
                    <Row className="text-center">
                      <Col md={3}>
                        <div className="stat-item">
                          <div className="stat-number">{cards.length}</div>
                          <div className="stat-label">Tarjetas Creadas</div>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="stat-item">
                          <div className="stat-number">
                            {cards.reduce((total, card) => total + (card.views || 0), 0)}
                          </div>
                          <div className="stat-label">Views Totales</div>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="stat-item">
                          <div className="stat-number">
                            {(cards || []).filter(card => card.isActive).length}
                          </div>
                          <div className="stat-label">Tarjetas Activas</div>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="stat-item">
                          <div className="plan-badge-modern">
                            {session?.user?.plan === 'PREMIUM' ? 'PREMIUM' : 'FREE'}
                          </div>
                          <div className="stat-label">Plan Actual</div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>

              {/* Acceso Directo a Tarjetas */}
              <Row className="mb-5">
                <Col>
                  <h3 className="section-title">Mis Tarjetas Digitales</h3>
                </Col>
              </Row>
              
              <Row className="mb-5 g-4">
                <Col md={8} lg={6}>
                  <Link href="/dashboard/cards" className="text-decoration-none">
                    <div className="product-card">
                      <div className="product-icon">🆔</div>
                      <div className="product-content">
                        <h4 className="product-title">Gestionar Tarjetas</h4>
                        <p className="product-description">
                          Ve todas tus tarjetas digitales, edítalas, analiza métricas y compártelas por WhatsApp.
                        </p>
                        <div className="product-stats">
                          <span className="stat-value">{cards.length}</span>
                          <span className="stat-text">tarjetas creadas</span>
                        </div>
                        <div className="product-status active">
                          ✅ Ver todas mis tarjetas
                        </div>
                      </div>
                    </div>
                  </Link>
                </Col>
                
                <Col md={4} lg={6}>
                  <Link href="/create" className="text-decoration-none">
                    <div className="product-card">
                      <div className="product-icon">✨</div>
                      <div className="product-content">
                        <h4 className="product-title">Crear Nueva Tarjeta</h4>
                        <p className="product-description">
                          Diseña una nueva tarjeta digital con efectos premium y compártela al instante.
                        </p>
                        <div className="product-stats">
                          <span className="stat-value">+</span>
                          <span className="stat-text">nueva tarjeta</span>
                        </div>
                        <div className="product-status active">
                          🚀 Crear ahora
                        </div>
                      </div>
                    </div>
                  </Link>
                </Col>
              </Row>

              {/* Acciones Rápidas */}
              {session?.user?.plan !== 'PREMIUM' && (
                <Row className="mb-4">
                  <Col>
                    <div className="upgrade-banner">
                      <div className="upgrade-content">
                        <div className="upgrade-icon">⭐</div>
                        <div className="upgrade-text">
                          <h5>Desbloquea tarjetas premium</h5>
                          <p>Efectos exclusivos, analytics avanzados, sin marca de agua y más tarjetas</p>
                        </div>
                        <Link href="/pricing" className="text-decoration-none">
                          <Button className="btn-upgrade">
                            Upgrade a Premium
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
            </>
          )}
        </Container>
      </div>
    </AuthWrapper>
  );
}
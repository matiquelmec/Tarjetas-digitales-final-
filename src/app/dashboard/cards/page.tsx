'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Breadcrumb } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import IndiNavbar from '@/components/layout/IndiNavbar';
import HologramPreview from '@/components/HologramPreview';
import '@/styles/hologram-effects.css';
import { CONSISTENT_DEMO_DATA } from '@/lib/constants/defaultCardData';

const BusinessCard = dynamic(() => import('@/features/digital-card/components/BusinessCard'), {
  loading: () => <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
      <span className="visually-hidden">Cargando demo...</span>
    </div>
  </div>,
  ssr: false
});

interface CardData {
  id: string;
  title: string;
  name: string;
  profession: string;
  views: number;
  clicks: number;
  isActive: boolean;
  createdAt: string;
  customUrl?: string;
}

export default function DashboardCardsPage() {
  const { data: session } = useSession();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy] = useState<'name' | 'views' | 'clicks' | 'date'>('date');
  const [planLimits, setPlanLimits] = useState<any>(null);

  // Usar datos centralizados consistentes para vista previa
  const demoCardData = CONSISTENT_DEMO_DATA;

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
      default:
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

  const deleteCard = async (cardId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarjeta? Esta acción no se puede deshacer.')) return;

    setDeletingCardId(cardId);
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
        credentials: 'same-origin'
      });

      if (response.ok) {
        setCards((cards || []).filter(card => card.id !== cardId));
      } else {
        // Handle error, maybe show an alert
        console.error('Failed to delete card', await response.json());
        alert('Error al eliminar la tarjeta.');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Error de red al eliminar la tarjeta.');
    } finally {
      setDeletingCardId(null);
    }
  };

  // Filtrar y ordenar tarjetas
  const filteredAndSortedCards = (cards || [])
    .filter(card =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.profession.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'views':
          return b.views - a.views;
        case 'clicks':
          return b.clicks - a.clicks;
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <>
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
        .glass-card .text-dark {
          color: #ffffff !important;
        }
        .glass-card .text-muted {
          color: rgba(255, 255, 255, 0.7) !important;
        }

        /* PROTECCIÓN ROBUSTA PARA STAT-BADGE */
        .stat-badge .text-dark,
        .stat-badge .fw-semibold {
          color: #1f2937 !important;
          opacity: 1 !important;
        }
        .stat-badge .text-muted {
          color: #6b7280 !important;
          opacity: 1 !important;
        }
        .stat-badge .text-primary {
          color: #3b82f6 !important;
          opacity: 1 !important;
        }

        /* PROTECCIÓN DURANTE HOVER DE GLASS-CARD */
        .glass-card:hover .stat-badge .text-dark,
        .glass-card:hover .stat-badge .fw-semibold {
          color: #1f2937 !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
        .glass-card:hover .stat-badge .text-muted {
          color: #6b7280 !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
        .glass-card:hover .stat-badge .text-primary {
          color: #3b82f6 !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* PROTECCIÓN ADICIONAL PARA ELEMENTOS INTERNOS */
        .stat-badge * {
          transition: none !important;
        }
        .stat-badge {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          z-index: 10;
          position: relative;
        }
        .card-item {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          height: 100%;
        }
        .card-item:hover {
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
        .stat-badge {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }
        .icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          font-size: 1.5rem;
        }
        .primary-gradient {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }
        .success-gradient {
          background: linear-gradient(135deg, #10b981, #059669);
        }
        .warning-gradient {
          background: linear-gradient(135deg, #D4A017, #B8860B);
        }

        /* Sistema de colores premium mejorado */
        .btn-premium-gold {
          background: linear-gradient(135deg, #D4A017, #B8860B) !important;
          border-color: #B8860B !important;
          color: #ffffff !important;
          font-weight: 600 !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
          box-shadow: 0 4px 12px rgba(212, 160, 23, 0.3) !important;
          transition: all 0.3s ease !important;
        }

        .btn-premium-gold:hover {
          background: linear-gradient(135deg, #E5B41F, #CD950C) !important;
          border-color: #CD950C !important;
          color: #ffffff !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 16px rgba(212, 160, 23, 0.4) !important;
        }

        .btn-premium-gold:focus,
        .btn-premium-gold:active {
          background: linear-gradient(135deg, #D4A017, #B8860B) !important;
          border-color: #B8860B !important;
          color: #ffffff !important;
          box-shadow: 0 0 0 0.2rem rgba(212, 160, 23, 0.5) !important;
        }

        /* Alert premium mejorado */
        .alert-premium {
          background: linear-gradient(135deg, rgba(212, 160, 23, 0.1), rgba(184, 134, 11, 0.1)) !important;
          border: 2px solid #D4A017 !important;
          border-radius: 16px !important;
          color: #8B4513 !important;
        }

        .alert-premium .text-premium {
          color: #8B4513 !important;
          font-weight: 600 !important;
        }

        .alert-premium .text-premium-link {
          color: #D4A017 !important;
          font-weight: 700 !important;
          text-decoration: none !important;
        }

        .alert-premium .text-premium-link:hover {
          color: #B8860B !important;
          text-decoration: underline !important;
        }
        .danger-gradient {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }
        .info-gradient {
          background: linear-gradient(135deg, #06b6d4, #0891b2);
        }

        /* Mejoras de navegación y header */
        .breadcrumb-custom {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 0.75rem 1.25rem;
          margin-bottom: 1.5rem;
        }

        .breadcrumb-custom .breadcrumb-item a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .breadcrumb-custom .breadcrumb-item a:hover {
          color: rgba(255, 255, 255, 1);
        }

        .breadcrumb-custom .breadcrumb-item.active {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
        }

        .back-button {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          backdrop-filter: blur(10px) !important;
          color: rgba(255, 255, 255, 0.9) !important;
          transition: all 0.3s ease !important;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          color: rgba(255, 255, 255, 1) !important;
          transform: translateX(-3px) !important;
        }

        /* Controles de búsqueda y filtros */
        .search-controls {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
        }

        .form-control-glass {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          backdrop-filter: blur(5px);
          color: #ffffff !important;
          border-radius: 12px !important;
        }

        .form-control-glass::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }

        .form-control-glass:focus {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25) !important;
          color: #ffffff !important;
        }

        .form-select-glass {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          backdrop-filter: blur(5px);
          color: #ffffff !important;
          border-radius: 12px !important;
        }

        .form-select-glass:focus {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25) !important;
          color: #ffffff !important;
        }

        .form-select-glass option {
          background: #1f2937 !important;
          color: #ffffff !important;
        }

        /* Header compacto mejorado */
        .header-content-compact {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 1.5rem 2rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Título alienígena con efecto glow */
        .alien-title-glow {
          text-shadow:
            0 0 10px rgba(0, 246, 255, 0.8),
            0 0 20px rgba(0, 246, 255, 0.6),
            0 0 40px rgba(0, 246, 255, 0.4);
          animation: alienTitlePulse 3s ease-in-out infinite;
        }

        @keyframes alienTitlePulse {
          0%, 100% {
            text-shadow:
              0 0 10px rgba(0, 246, 255, 0.8),
              0 0 20px rgba(0, 246, 255, 0.6),
              0 0 40px rgba(0, 246, 255, 0.4);
          }
          50% {
            text-shadow:
              0 0 15px rgba(0, 246, 255, 1),
              0 0 30px rgba(0, 246, 255, 0.8),
              0 0 50px rgba(0, 246, 255, 0.6);
          }
        }

        /* Cards alienígenas con efectos holográficos */
        .card-item-modern {
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05));
          backdrop-filter: blur(15px);
          border: 2px solid rgba(0, 246, 255, 0.3);
          border-radius: 20px;
          padding: 1.5rem;
          transition: all 0.4s ease;
          height: 100%;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 4px 16px rgba(0, 246, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .card-item-modern::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg,
            #00f6ff, #0072ff, #8e2de2, #4a00e0);
          border-radius: 22px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .card-item-modern:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow:
            0 20px 60px rgba(0, 246, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          border-color: rgba(0, 246, 255, 0.8);
        }

        .card-item-modern:hover::before {
          opacity: 0.6;
        }

        .card-item-modern:hover .card-title-modern {
          color: #ffffff !important;
          text-shadow: 0 0 10px rgba(0, 246, 255, 0.8);
        }

        .card-item-modern:hover .card-subtitle-modern {
          color: rgba(255, 255, 255, 0.9) !important;
        }

        .card-title-modern {
          font-size: 1.1rem;
          color: #ffffff;
          line-height: 1.3;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .card-subtitle-modern {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
        }

        .card-stats-modern {
          text-align: right;
        }

        .stat-item-modern {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .stat-number-modern {
          font-weight: 700;
          font-size: 1.1rem;
          color: #00f6ff;
          text-shadow: 0 0 5px rgba(0, 246, 255, 0.6);
          transition: all 0.3s ease;
        }

        .stat-label-modern {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
        }

        .card-item-modern:hover .stat-number-modern {
          color: #ffffff;
          text-shadow: 0 0 10px rgba(0, 246, 255, 1);
        }

        .card-item-modern:hover .stat-label-modern {
          color: rgba(255, 255, 255, 0.9);
        }

        .status-badge-modern {
          font-size: 0.75rem;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-weight: 600;
        }

        .status-active {
          background-color: #198754 !important;
          color: white !important;
        }

        .status-inactive {
          background-color: #6c757d !important;
          color: white !important;
        }

        .card-actions-modern {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .btn-action-modern {
          border-radius: 8px !important;
          font-weight: 500 !important;
          font-size: 0.85rem !important;
          padding: 0.5rem 1rem !important;
          border-width: 1px !important;
        }

        .btn-icon-modern {
          width: 42px !important;
          padding: 0.5rem !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Estilos minimalistas para las tarjetas */
        .minimal-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          height: 100%;
        }

        .minimal-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }

        .minimal-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stats-minimal {
          text-align: right;
        }

        .card-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
      `}} />
      <div className="animated-gradient-background">
        {/* Navbar con Indi */}
        <IndiNavbar variant="transparent" position="relative" showActions={true} />

        <Container className="py-4">
          {/* Navegación */}
          <div className="mb-4">
            <Breadcrumb className="breadcrumb-custom mb-0">
              <Breadcrumb.Item linkAs={Link} href="/dashboard" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
                🏠 Centro de Comando
              </Breadcrumb.Item>
              <Breadcrumb.Item active>🆔 Tarjetas Digitales</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          {/* Header Minimalista */}
          <div className="minimal-header">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="text-white mb-0 fw-bold" style={{ fontSize: '1.8rem' }}>
                  Mis Tarjetas ({cards.length})
                </h1>
              </div>
              <div>
                {false ? (
                  <Link href="/pricing">
                    <Button
                      className="btn-premium-gold"
                      style={{ borderRadius: '25px', border: 'none', padding: '12px 24px' }}
                    >
                      ⭐ Actualizar Plan
                    </Button>
                  </Link>
                ) : (
                  <Link href="/create">
                    <Button
                      variant="primary"
                      className="fw-semibold"
                      style={{ borderRadius: '25px', padding: '12px 24px' }}
                    >
                      ✨ Crear Nueva
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          {showWelcomeMessage && (
            <Row className="mb-4">
              <Col>
                <div className="glass-card border-0">
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div className="icon-wrapper success-gradient text-white me-3">
                          👋
                        </div>
                        <div>
                          <h5 className="fw-bold text-white mb-1">¡Bienvenido!</h5>
                          <p className="text-white opacity-75 mb-0">{welcomeMessage}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setShowWelcomeMessage(false)}
                        style={{ borderRadius: '8px' }}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {/* Cards Section */}
          <Row>
            <Col>
              {loading ? (
                <div className="glass-card border-0">
                  <div className="p-5 text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <h5 className="mt-3 text-white">Cargando tus tarjetas digitales...</h5>
                    <p className="text-white opacity-75">Conectando con la plataforma empresarial</p>
                  </div>
                </div>
              ) : cards.length === 0 ? (
                <div>
                  {/* Header cuando no hay tarjetas */}
                  <div className="glass-card border-0 mb-4">
                    <div className="p-4 text-center">
                      <h3 className="fw-bold text-white mb-3 alien-title-glow">¡Crea Tu Primera Tarjeta Digital!</h3>
                      <p className="text-white opacity-75 mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                        Mira este ejemplo de tarjeta profesional con efectos premium.
                        <strong> Personaliza colores, añade tus datos y comparte por WhatsApp.</strong>
                      </p>
                      <Link href="/create">
                        <Button
                          variant="primary"
                          size="lg"
                          className="fw-semibold px-5 py-3"
                          style={{ borderRadius: '25px' }}
                        >
                          ✨ Crear Mi Tarjeta Ahora
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Demo Card Directamente Visible */}
                  <Row className="justify-content-center">
                    <Col lg={8} xl={6}>
                      <HologramPreview
                        mode="enhanced"
                        showBeam={true}
                        showParticles={true}
                        showScanlines={false}
                        enable3D={true}
                        title="🔮 DEMO INTERACTIVO"
                        subtitle="⚡ Todos los efectos activados • Prueba todas las funciones"
                        pageBackgroundColor={demoCardData.pageBackgroundColor}
                      >
                        <BusinessCard
                          name={demoCardData.name}
                          title={demoCardData.title}
                          about={demoCardData.about}
                          location={demoCardData.location}
                          whatsapp={demoCardData.whatsapp}
                          email={demoCardData.email}
                          photoUrl={demoCardData.photo}
                          cardBackgroundColor={demoCardData.cardBackgroundColor}
                          cardTextColor={demoCardData.cardTextColor}
                          pageBackgroundColor={demoCardData.pageBackgroundColor}
                          enableHoverEffect={demoCardData.enableHoverEffect}
                          enableGlassmorphism={demoCardData.enableGlassmorphism}
                          enableSubtleAnimations={demoCardData.enableSubtleAnimations}
                          enableBackgroundPatterns={demoCardData.enableBackgroundPatterns}
                          enableParticles={demoCardData.enableParticles}
                          particleType={demoCardData.particleType}
                          particleCount={demoCardData.particleCount}
                          particleDensity={demoCardData.particleDensity}
                          // Efectos de ambiente
                          enableAnimatedGradient={demoCardData.enableAnimatedGradient}
                          animatedGradientType={demoCardData.animatedGradientType}
                          animatedGradientSpeed={demoCardData.animatedGradientSpeed}
                          animatedGradientIntensity={demoCardData.animatedGradientIntensity}
                          animatedGradientOpacity={demoCardData.animatedGradientOpacity}
                          enableFloatingShapes={demoCardData.enableFloatingShapes}
                          floatingShapesType={demoCardData.floatingShapesType}
                          floatingShapesCount={demoCardData.floatingShapesCount}
                          floatingShapesSpeed={demoCardData.floatingShapesSpeed}
                          ambientIntensity={demoCardData.ambientIntensity}
                          ambientOpacity={demoCardData.ambientOpacity}
                          whatsappShareUrl="https://wa.me/56987654321"
                          appointmentLink={demoCardData.appointmentLink}
                          professionalDetails={demoCardData.professionalDetails}
                          linkedin={demoCardData.linkedin}
                          instagram={demoCardData.instagram}
                          twitter={demoCardData.twitter}
                          facebook={demoCardData.facebook}
                          website={demoCardData.website}
                          buttonSecondaryColor={demoCardData.buttonSecondaryColor}
                          buttonNormalBackgroundColor={demoCardData.buttonNormalBackgroundColor}
                          buttonSecondaryHoverColor={demoCardData.buttonSecondaryHoverColor}
                          template={demoCardData.template}
                          fontFamily={demoCardData.fontFamily}
                          isPreviewMode={true}
                        />
                      </HologramPreview>
                      <div className="text-center mt-4">
                        <p className="text-white opacity-75">
                          <small>👆 Prueba todas las funciones: WhatsApp, QR, efectos hover y más</small>
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              ) : filteredAndSortedCards.length === 0 ? (
                <div className="glass-card border-0">
                  <div className="p-5 text-center">
                    <div className="icon-wrapper primary-gradient text-white mx-auto mb-4" style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}>
                      🔍
                    </div>
                    <h3 className="fw-bold text-white mb-3">No se encontraron tarjetas</h3>
                    <p className="text-white opacity-75 mb-4 fs-5">
                      No hay tarjetas que coincidan con "{searchTerm}". Intenta con otros términos de búsqueda.
                    </p>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setSearchTerm('')}
                      className="fw-semibold"
                    >
                      🔄 Limpiar búsqueda
                    </Button>
                  </div>
                </div>
              ) : (
                <Row className="g-4">
                    {filteredAndSortedCards.map((card) => (
                      <Col key={card.id} lg={6} xl={4}>
                        <div className="minimal-card">
                          <div className="card-content">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h5 className="text-white fw-bold mb-1">{card.name}</h5>
                                <p className="text-white-50 mb-0">{card.profession}</p>
                              </div>
                              <div className="stats-minimal">
                                <small className="text-white-50">
                                  {card.views} vistas • {card.clicks} clics
                                </small>
                              </div>
                            </div>

                            <div className="card-actions">
                              <Link
                                href={card.customUrl ? `/c/${card.customUrl}` : `/card/${card.id}`}
                                target="_blank"
                                className="btn btn-sm btn-outline-light me-2"
                                style={{ borderRadius: '20px' }}
                              >
                                Ver
                              </Link>
                              <Button
                                variant="outline-light"
                                size="sm"
                                className="me-2"
                                style={{ borderRadius: '20px' }}
                                onClick={() => window.open(`/create?edit=${card.id}`, '_self')}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                style={{ borderRadius: '20px' }}
                                onClick={() => deleteCard(card.id)}
                                disabled={deletingCardId === card.id}
                              >
                                {deletingCardId === card.id ? (
                                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                  'Eliminar'
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
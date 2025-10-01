'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import IndiNavbar from '@/components/layout/IndiNavbar';

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [userAccess, setUserAccess] = useState<any>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserAccess();
    }
  }, [session]);

  const fetchUserAccess = async () => {
    try {
      const response = await fetch('/api/user/plan-limits');
      if (response.ok) {
        const data = await response.json();
        setUserAccess(data);
      }
    } catch (error) {
      console.error('Error fetching user access:', error);
    }
  };

  const handleSubscriptionPayment = async (subscriptionType: 'FIRST_YEAR' | 'RENEWAL' = 'FIRST_YEAR') => {
    if (!session) {
      signIn();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionType,
          successUrl: `${window.location.origin}/dashboard?success=true&type=${subscriptionType.toLowerCase()}`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error === 'MercadoPago not configured') {
        alert('Sistema de pagos no configurado aún. Por favor contacta a soporte.');
      } else {
        alert('Error creando sesión de pago: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error creando sesión de pago');
    } finally {
      setLoading(false);
    }
  };

  const getTrialDaysRemaining = () => {
    if (userAccess?.isTrialUser && userAccess?.daysRemaining) {
      return userAccess.daysRemaining;
    }
    return null;
  };

  const isUserExpired = () => {
    return userAccess?.status === 'EXPIRED';
  };

  const getPriceForUser = () => {
    return isUserExpired() ? 2990 : 4990;
  };

  const getSubscriptionTypeForUser = () => {
    return isUserExpired() ? 'RENEWAL' : 'FIRST_YEAR';
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
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
          border-radius: 20px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.5);
        }
        .pricing-card-featured {
          border: 3px solid #00F6FF !important;
          transform: scale(1.05);
          position: relative;
        }
        .pricing-card-featured::before {
          content: "✨ RECOMENDADO";
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #00F6FF, #0072ff);
          color: white;
          padding: 6px 20px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0, 246, 255, 0.3);
        }
        .price-highlight {
          background: linear-gradient(135deg, #00F6FF, #0072ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .btn-subscription {
          background: linear-gradient(135deg, #00F6FF, #0072ff) !important;
          border: none !important;
          color: white !important;
          font-weight: 700 !important;
          padding: 15px 40px !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(0, 246, 255, 0.3) !important;
          transition: all 0.3s ease !important;
          font-size: 1.1rem !important;
        }
        .btn-subscription:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 32px rgba(0, 246, 255, 0.4) !important;
        }
        .trial-badge {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 16px;
        }
        .renewal-badge {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 16px;
        }
        .feature-list {
          list-style: none;
          padding: 0;
        }
        .feature-list li {
          padding: 8px 0;
          display: flex;
          align-items: center;
        }
        .feature-list li::before {
          content: "✓";
          color: #10b981;
          font-weight: bold;
          margin-right: 12px;
          font-size: 1.2rem;
        }
      `}} />
      <div className="animated-gradient-background">
        <IndiNavbar variant="transparent" position="relative" showActions={true} />
        
        <Container className="py-5">
          {/* Header */}
          <Row className="mb-5">
            <Col>
              <div className="text-center">
                <Link href="/" className="text-white text-decoration-none mb-3 d-inline-block">
                  ← Volver al inicio
                </Link>
                <h1 className="text-white display-4 fw-bold mb-3">
                  Tarjetas Digitales Premium
                </h1>
                <p className="text-white lead opacity-90 mb-4">
                  Prueba gratis por 7 días, luego suscríbete por solo {getPriceForUser()} CLP/año
                </p>
                
                {/* Trial Status */}
                {userAccess?.isTrialUser && getTrialDaysRemaining() && (
                  <div className="trial-badge">
                    🎉 Te quedan {getTrialDaysRemaining()} días de prueba gratis
                  </div>
                )}
                
                {isUserExpired() && (
                  <div className="renewal-badge">
                    💎 Precio especial de renovación: $2,990 CLP
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* Main Pricing Card */}
          <Row className="justify-content-center">
            <Col lg={6} md={8}>
              <Card className="glass-card text-white pricing-card-featured">
                <Card.Header className="text-center border-0 bg-transparent pt-5 pb-4">
                  <div className="mb-4">
                    <span style={{ fontSize: '4rem' }}>💎</span>
                  </div>
                  <h2 className="fw-bold mb-3">Acceso Premium</h2>
                  <div className="mb-3">
                    <span className="display-3 fw-bold price-highlight">
                      ${getPriceForUser().toLocaleString()}
                    </span>
                    <span className="text-white opacity-75 fs-4"> CLP/año</span>
                  </div>
                  
                  {!isUserExpired() ? (
                    <p className="text-white opacity-90 mb-0 fs-5">
                      7 días gratis, luego $4,990/año
                    </p>
                  ) : (
                    <p className="text-white opacity-90 mb-0 fs-5">
                      Renovación especial - Era $4,990, ahora $2,990
                    </p>
                  )}
                </Card.Header>
                
                <Card.Body className="px-5 py-4">
                  <h5 className="text-white mb-4 text-center">✨ Todo incluido:</h5>
                  <ul className="feature-list text-white">
                    <li>Tarjetas digitales ilimitadas</li>
                    <li>Editor visual completo y avanzado</li>
                    <li>Efectos premium (glassmorphism, animaciones)</li>
                    <li>QR codes integrados</li>
                    <li>Analytics y estadísticas detalladas</li>
                    <li>URLs personalizadas</li>
                    <li>Sin marca de agua</li>
                    <li>Exportación en múltiples formatos</li>
                    <li>Plantillas premium exclusivas</li>
                    <li>Soporte prioritario</li>
                    <li>Integración con CRM</li>
                    <li>Actualizaciones automáticas</li>
                  </ul>
                </Card.Body>
                
                <Card.Footer className="border-0 bg-transparent p-5 pt-2">
                  {userAccess?.hasAccess ? (
                    <div className="text-center">
                      <Badge bg="success" className="fs-6 p-3 mb-3">
                        ✅ Ya tienes acceso premium activo
                      </Badge>
                      <div>
                        <Link href="/dashboard" className="btn btn-subscription">
                          Ir al Dashboard
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="btn-subscription w-100 mb-3"
                      onClick={() => handleSubscriptionPayment(getSubscriptionTypeForUser())}
                      disabled={loading}
                      size="lg"
                    >
                      {loading ? 'Procesando...' : (
                        isUserExpired() 
                          ? '💎 Renovar Suscripción ($2,990)'
                          : '🚀 Comenzar Trial Gratis'
                      )}
                    </Button>
                  )}
                  
                  <div className="text-center">
                    <small className="text-white opacity-75">
                      {!isUserExpired() 
                        ? 'Acceso completo por 7 días gratis. Cancela en cualquier momento.'
                        : 'Precio especial para usuarios existentes. 12 meses completos.'
                      }
                    </small>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>

          {/* Value Proposition */}
          <Row className="mt-5">
            <Col>
              <div className="text-center">
                <h3 className="text-white mb-4">¿Por qué elegir nuestro modelo?</h3>
                <Row className="g-4">
                  <Col md={4}>
                    <div className="glass-card p-4 h-100">
                      <div className="mb-3">
                        <span style={{ fontSize: '2.5rem' }}>🎯</span>
                      </div>
                      <h5 className="text-white fw-bold">Simple y Directo</h5>
                      <p className="text-white opacity-75">
                        Una sola suscripción anual. Sin planes confusos ni límites artificiales.
                      </p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="glass-card p-4 h-100">
                      <div className="mb-3">
                        <span style={{ fontSize: '2.5rem' }}>⚡</span>
                      </div>
                      <h5 className="text-white fw-bold">Prueba Sin Riesgo</h5>
                      <p className="text-white opacity-75">
                        7 días completos para probar todas las funciones. Cancela cuando quieras.
                      </p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="glass-card p-4 h-100">
                      <div className="mb-3">
                        <span style={{ fontSize: '2.5rem' }}>💰</span>
                      </div>
                      <h5 className="text-white fw-bold">Precio Justo</h5>
                      <p className="text-white opacity-75">
                        Usuarios existentes pagan menos en la renovación. Premiamos la lealtad.
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {/* FAQ */}
          <Row className="mt-5">
            <Col lg={8} className="mx-auto">
              <div className="glass-card p-4">
                <h4 className="text-white text-center mb-4">Preguntas Frecuentes</h4>
                <div className="text-white">
                  <div className="mb-3">
                    <strong>¿Qué incluye el trial de 7 días?</strong>
                    <p className="opacity-75 mb-0">Acceso completo a todas las funcionalidades premium. Sin restricciones.</p>
                  </div>
                  <div className="mb-3">
                    <strong>¿Qué pasa después del primer año?</strong>
                    <p className="opacity-75 mb-0">Puedes renovar por $2,990 CLP/año (precio especial para usuarios existentes).</p>
                  </div>
                  <div className="mb-3">
                    <strong>¿Puedo cancelar en cualquier momento?</strong>
                    <p className="opacity-75 mb-0">Sí, puedes cancelar durante el trial o tu suscripción desde el dashboard.</p>
                  </div>
                  <div className="mb-3">
                    <strong>¿Hay límite en el número de tarjetas?</strong>
                    <p className="opacity-75 mb-0">No, puedes crear tarjetas ilimitadas con tu suscripción activa.</p>
                  </div>
                  <div>
                    <strong>¿Ofrecen garantía?</strong>
                    <p className="opacity-75 mb-0">Sí, 30 días de garantía completa desde el inicio de tu suscripción.</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
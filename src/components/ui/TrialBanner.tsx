'use client';

import { useState, useEffect } from 'react';
import { Alert, Button, Badge } from 'react-bootstrap';
import Link from 'next/link';

interface UserAccess {
  hasAccess: boolean;
  isTrialUser: boolean;
  daysRemaining?: number;
  subscriptionEndDate?: Date;
  status: string;
}

export default function TrialBanner() {
  const [userAccess, setUserAccess] = useState<UserAccess | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchUserAccess();
  }, []);

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

  // No mostrar si no hay datos o si fue descartado
  if (!userAccess || dismissed) {
    return null;
  }

  // No mostrar para usuarios con suscripción activa
  if (userAccess.status === 'ACTIVE') {
    return (
      <Alert variant="success" className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Badge bg="success" className="me-2">PREMIUM ACTIVO</Badge>
            <strong>¡Tu suscripción está activa!</strong> Tienes acceso completo a todas las funcionalidades.
          </div>
        </div>
      </Alert>
    );
  }

  // Banner para usuarios en trial
  if (userAccess.isTrialUser && userAccess.daysRemaining && userAccess.daysRemaining > 0) {
    const isLastDay = userAccess.daysRemaining === 1;
    const isLowDays = userAccess.daysRemaining <= 2;
    
    return (
      <Alert variant={isLowDays ? 'warning' : 'info'} className="mb-4" dismissible onClose={() => setDismissed(true)}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Badge bg={isLowDays ? 'warning' : 'info'} className="me-2">
              TRIAL {userAccess.daysRemaining} DÍA{userAccess.daysRemaining > 1 ? 'S' : ''}
            </Badge>
            <strong>
              {isLastDay 
                ? '¡Último día de prueba gratis!' 
                : `Te quedan ${userAccess.daysRemaining} días de prueba gratis`
              }
            </strong>
            <div className="mt-1">
              <small className="text-muted">
                Disfruta de acceso completo a todas las funcionalidades premium durante tu trial.
              </small>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Link href="/pricing">
              <Button 
                size="sm" 
                variant={isLowDays ? 'warning' : 'outline-primary'}
                className="fw-bold"
              >
                {isLastDay ? '🚀 Suscribirse Ahora' : '💎 Ver Precios'}
              </Button>
            </Link>
          </div>
        </div>
      </Alert>
    );
  }

  // Banner para usuarios con trial expirado
  if (userAccess.status === 'EXPIRED') {
    return (
      <Alert variant="danger" className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Badge bg="danger" className="me-2">TRIAL EXPIRADO</Badge>
            <strong>Tu período de prueba ha terminado</strong>
            <div className="mt-1">
              <small>
                Para continuar creando y editando tarjetas, suscríbete por solo $2,990 CLP/año 
                (precio especial de renovación).
              </small>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Link href="/pricing">
              <Button size="sm" variant="danger" className="fw-bold">
                💎 Renovar Suscripción
              </Button>
            </Link>
          </div>
        </div>
      </Alert>
    );
  }

  return null;
}
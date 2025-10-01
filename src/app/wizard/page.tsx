'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AuthWrapper } from '@/components/AuthWrapper';
import WizardGuided from '@/components/wizard/WizardGuided';

export default function WizardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === 'loading') return; // Esperar a que cargue la sesión
    
    if (!session) {
      // Guardar la intención de usar el wizard para después del login
      sessionStorage.setItem('postLoginRedirect', '/wizard');
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  // Mostrar loading mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✨</div>
          <div>Preparando tu experiencia...</div>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper>
      <WizardGuided />
    </AuthWrapper>
  );
}
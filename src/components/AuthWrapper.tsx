'use client';

import { useSession, signIn } from 'next-auth/react';
import { Container, Button, Card } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthWrapper - Status:', status, 'Session:', session);
    
    if (status === 'authenticated' && session?.user) {
      // Ensure user exists in database
      fetch('/api/user/ensure', {
        method: 'POST',
        credentials: 'same-origin'
      })
      .then(res => {
        if (!res.ok) {
          console.error('Failed to ensure user:', res.status);
          setError('Error al verificar usuario en la base de datos');
        }
        return res.json();
      })
      .then(data => {
        console.log('User ensure response:', data);
      })
      .catch(err => {
        console.error('Error ensuring user:', err);
        setError('Error de conexión con la base de datos');
      });
    }
    
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="text-center">
          <Card.Body>
            <Card.Title>Authentication Required</Card.Title>
            <Card.Text>Please sign in to access this page.</Card.Text>
            <Button variant="primary" onClick={() => signIn('google')}>
              Sign In with Google
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="text-center">
          <Card.Body>
            <Card.Title>Error de Conexión</Card.Title>
            <Card.Text>{error}</Card.Text>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return <>{children}</>;
}
'use client';

import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

export default function DevLoginPage() {
  const [email, setEmail] = useState('dev@tarjetasdigitales.com');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('development', {
        email,
        redirect: false,
      });

      if (result?.error) {
        setError('Error al iniciar sesión');
      } else {
        // Wait for session to be created
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error) {
      setError('Error inesperado');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
         style={{
           background: 'linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e)',
           backgroundSize: '400% 400%',
           animation: 'gradientAnimation 15s ease infinite'
         }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow-lg border-0" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px'
            }}>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="text-white">🚀 Desarrollo</h2>
                  <p className="text-light">Login simplificado para desarrollo</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ingresa cualquier email"
                      required
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'white'
                      }}
                    />
                    <Form.Text className="text-light">
                      Puedes usar cualquier email válido para desarrollo
                    </Form.Text>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100"
                    disabled={isLoading}
                    style={{
                      background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '12px'
                    }}
                  >
                    {isLoading ? 'Iniciando sesión...' : 'Entrar al Dashboard'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <small className="text-light">
                    🔧 Modo desarrollo - Solo para testing local
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
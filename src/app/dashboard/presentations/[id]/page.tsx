'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Row, Col, Button, Breadcrumb } from 'react-bootstrap';
import Link from 'next/link';
import IndiNavbar from '@/components/layout/IndiNavbar';
import { PresentationViewer } from '@/features/presentations/components';

interface Presentation {
  id: string;
  title: string;
  description: string;
  slides: any[];
  theme: string;
  createdAt: string;
  updatedAt: string;
}

export default function PresentationViewPage() {
  const params = useParams();
  const router = useRouter();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchPresentation(params.id as string);
    }
  }, [params.id]);

  const fetchPresentation = async (id: string) => {
    try {
      const response = await fetch(`/api/presentations/${id}`, {
        credentials: 'same-origin'
      });
      
      if (response.ok) {
        const data = await response.json();
        setPresentation(data);
      } else {
        setError('Presentación no encontrada');
      }
    } catch (error) {
      console.error('Error fetching presentation:', error);
      setError('Error al cargar la presentación');
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
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
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}} />
        <div className="animated-gradient-background">
          <IndiNavbar variant="transparent" position="relative" showActions={true} />
          <Container className="py-4">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Cargando presentación...</span>
              </div>
              <h5 className="mt-3 text-white">Cargando presentación...</h5>
            </div>
          </Container>
        </div>
      </>
    );
  }

  if (error || !presentation) {
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
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}} />
        <div className="animated-gradient-background">
          <IndiNavbar variant="transparent" position="relative" showActions={true} />
          <Container className="py-4">
            <div className="text-center py-5">
              <h3 className="text-white mb-3">❌ {error || 'Presentación no encontrada'}</h3>
              <Link href="/dashboard/presentations">
                <Button variant="primary">
                  ← Volver a Presentaciones
                </Button>
              </Link>
            </div>
          </Container>
        </div>
      </>
    );
  }

  if (isFullscreen) {
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: `
          .fullscreen-presentation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: black;
            z-index: 9999;
            display: flex;
            flex-direction: column;
          }
          .fullscreen-controls {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 10000;
          }
          .fullscreen-viewer {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}} />
        <div className="fullscreen-presentation">
          <div className="fullscreen-controls">
            <Button 
              variant="outline-light" 
              size="sm"
              onClick={toggleFullscreen}
              className="me-2"
            >
              🗙 Salir
            </Button>
          </div>
          <div className="fullscreen-viewer">
            <PresentationViewer 
              slides={presentation.slides}
              theme={presentation.theme}
              isFullscreen={true}
              onExitFullscreen={toggleFullscreen}
              autoPlay={false}
              showControls={true}
              enableEffects={true}
            />
          </div>
        </div>
      </>
    );
  }

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
      `}} />
      <div className="animated-gradient-background">
        <IndiNavbar variant="transparent" position="relative" showActions={true} />
        
        <Container className="py-4">
          {/* Navegación */}
          <div className="mb-4">
            <Breadcrumb style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '0.75rem 1.25rem' }}>
              <Breadcrumb.Item>
                <Link href="/dashboard" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
                  🏠 Centro de Comando
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link href="/dashboard/presentations" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
                  📊 Presentaciones
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item active style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                {presentation.title}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          {/* Header */}
          <div className="glass-card mb-4 p-4">
            <Row className="align-items-center">
              <Col md={8}>
                <h1 className="text-white mb-2">{presentation.title}</h1>
                <p className="text-white-50 mb-0">{presentation.description}</p>
                <small className="text-white-50">
                  Creada: {new Date(presentation.createdAt).toLocaleDateString('es-ES')}
                </small>
              </Col>
              <Col md={4} className="text-end">
                <Button 
                  variant="primary" 
                  className="me-2"
                  onClick={toggleFullscreen}
                >
                  🖥️ Pantalla Completa
                </Button>
                <Link href={`/dashboard/presentations/${presentation.id}/edit`}>
                  <Button variant="outline-light">
                    ✏️ Editar
                  </Button>
                </Link>
              </Col>
            </Row>
          </div>

          {/* Presentación Viewer */}
          <div className="glass-card p-4">
            <PresentationViewer 
              slides={presentation.slides}
              theme={presentation.theme}
              isFullscreen={false}
              onExitFullscreen={() => {}}
              autoPlay={false}
              showControls={true}
              enableEffects={true}
            />
          </div>
        </Container>
      </div>
    </>
  );
}
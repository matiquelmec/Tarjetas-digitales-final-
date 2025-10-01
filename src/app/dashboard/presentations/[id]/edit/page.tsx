'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Row, Col, Button, Breadcrumb } from 'react-bootstrap';
import Link from 'next/link';
import IndiNavbar from '@/components/layout/IndiNavbar';
import PresentationEditorWrapper from '@/features/presentations/components/PresentationEditorWrapper';

interface Presentation {
  id: string;
  title: string;
  description: string;
  slides: any[];
  theme: string;
  createdAt: string;
  updatedAt: string;
}

export default function PresentationEditPage() {
  const params = useParams();
  const router = useRouter();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleSave = async (updatedPresentation: Presentation) => {
    try {
      const response = await fetch(`/api/presentations/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPresentation),
        credentials: 'same-origin'
      });

      if (response.ok) {
        router.push(`/dashboard/presentations/${params.id}`);
      } else {
        console.error('Error saving presentation');
      }
    } catch (error) {
      console.error('Error saving presentation:', error);
    }
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
                <span className="visually-hidden">Cargando editor...</span>
              </div>
              <h5 className="mt-3 text-white">Cargando editor de presentaciones...</h5>
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
              <Breadcrumb.Item>
                <Link href={`/dashboard/presentations/${presentation.id}`} style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
                  {presentation.title}
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item active style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Editar
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          {/* Header */}
          <div className="glass-card mb-4 p-4">
            <Row className="align-items-center">
              <Col md={8}>
                <h1 className="text-white mb-2">✏️ Editando: {presentation.title}</h1>
                <p className="text-white-50 mb-0">Modifica tu presentación y guarda los cambios</p>
              </Col>
              <Col md={4} className="text-end">
                <Link href={`/dashboard/presentations/${presentation.id}`}>
                  <Button variant="outline-light">
                    ← Volver
                  </Button>
                </Link>
              </Col>
            </Row>
          </div>

          {/* Editor */}
          <div className="glass-card p-4">
            <PresentationEditorWrapper 
              presentation={presentation}
              onSave={handleSave}
              onCancel={() => router.push(`/dashboard/presentations/${presentation.id}`)}
              isEditing={true}
            />
          </div>
        </Container>
      </div>
    </>
  );
}
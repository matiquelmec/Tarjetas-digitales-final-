'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

// Asumiendo que LogEntry se define así en tu logger
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  meta?: Record<string, unknown>;
}

interface CheckStatus {
  [key: string]: boolean | string | undefined;
}

interface DiagnosticResult {
  timestamp: string;
  healthy: boolean;
  checks: Record<string, CheckStatus>;
  errors: string[];
  warnings: string[];
  recentLogs: LogEntry[];
  recentErrors: LogEntry[];
  session?: Session | null;
}

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/test');
      const data = await response.json();
      setDiagnostics(data);
    } catch (error) {
      console.error('Failed to run diagnostics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusBadge = (status: boolean) => (
    <Badge bg={status ? 'success' : 'danger'}>
      {status ? 'OK' : 'FAIL'}
    </Badge>
  );

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Sistema de Diagnóstico</h1>
            <Button 
              variant="primary" 
              onClick={runDiagnostics} 
              disabled={loading}
            >
              {loading ? 'Ejecutando...' : 'Ejecutar Diagnóstico'}
            </Button>
          </div>
        </Col>
      </Row>

      {/* Session Status */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>Estado de Sesión NextAuth</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Status:</strong> {status}</p>
              {session ? (
                <div>
                  <p><strong>Usuario:</strong> {session.user?.name}</p>
                  <p><strong>Email:</strong> {session.user?.email}</p>
                  <p><strong>ID:</strong> {session.user?.id}</p>
                  <p><strong>Plan:</strong> {session.user?.plan}</p>
                </div>
              ) : (
                <Alert variant="warning">No hay sesión activa</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Diagnostic Results */}
      {diagnostics && (
        <>
          <Row className="mb-4">
            <Col>
              <Alert variant={diagnostics.healthy ? 'success' : 'danger'}>
                <strong>Estado General del Sistema:</strong> {diagnostics.healthy ? 'Saludable' : 'Con Problemas'}
                <br />
                <small>Última verificación: {new Date(diagnostics.timestamp).toLocaleString()}</small>
              </Alert>
            </Col>
          </Row>

          {/* Environment Variables */}
          <Row className="mb-4">
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h6>Variables de Entorno</h6>
                </Card.Header>
                <Card.Body>
                  {diagnostics.checks.envVars && Object.entries(diagnostics.checks.envVars).map(([key, value]) => (
                    <div key={key} className="d-flex justify-content-between">
                      <span>{key}:</span>
                      {typeof value === 'boolean' ? getStatusBadge(value) : <code>{String(value)}</code>}
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card>
                <Card.Header>
                  <h6>Base de Datos</h6>
                </Card.Header>
                <Card.Body>
                  {diagnostics.checks.database && (
                    <>
                      <div className="d-flex justify-content-between">
                        <span>Conexión:</span>
                        {getStatusBadge(Boolean(diagnostics.checks.database.connected))}
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Consultas:</span>
                        {getStatusBadge(Boolean(diagnostics.checks.database.canQuery))}
                      </div>
                      {diagnostics.checks.database.error && (
                        <Alert variant="danger" className="mt-2">
                          <small>{diagnostics.checks.database.error}</small>
                        </Alert>
                      )}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* NextAuth Status */}
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header>
                  <h6>Configuración NextAuth</h6>
                </Card.Header>
                <Card.Body>
                  {diagnostics.checks.nextAuth && (
                    <>
                      <div className="d-flex justify-content-between">
                        <span>Configurado:</span>
                        {getStatusBadge(Boolean(diagnostics.checks.nextAuth.configured))}
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Tiene Sesión:</span>
                        {getStatusBadge(Boolean(diagnostics.checks.nextAuth.hasSession))}
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Estrategia:</span>
                        <code>{diagnostics.checks.nextAuth.sessionStrategy}</code>
                      </div>
                      {diagnostics.checks.nextAuth.error && (
                        <Alert variant="danger" className="mt-2">
                          <small>{diagnostics.checks.nextAuth.error}</small>
                        </Alert>
                      )}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Errors */}
          {diagnostics.errors.length > 0 && (
            <Row className="mb-4">
              <Col>
                <Card border="danger">
                  <Card.Header className="bg-danger text-white">
                    <h6>Errores Detectados</h6>
                  </Card.Header>
                  <Card.Body>
                    {diagnostics.errors.map((error, index) => (
                      <Alert key={index} variant="danger" className="mb-2">
                        {error}
                      </Alert>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Recent Logs */}
          {diagnostics.recentLogs.length > 0 && (
            <Row className="mb-4">
              <Col>
                <Card>
                  <Card.Header>
                    <h6>Logs Recientes</h6>
                  </Card.Header>
                  <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {diagnostics.recentLogs.map((log, index) => (
                      <div key={index} className="mb-2">
                        <Badge bg={
                          log.level === 'error' ? 'danger' :
                          log.level === 'warn' ? 'warning' :
                          log.level === 'info' ? 'info' : 'secondary'
                        }>
                          {log.level}
                        </Badge>
                        <small className="ms-2 text-muted">{log.timestamp}</small>
                        <br />
                        <code className="small">{log.message}</code>
                        {log.meta && (
                          <pre className="small text-muted mt-1">
                            {JSON.stringify(log.meta, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
}
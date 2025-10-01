'use client';

import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import AuthorityParticles from '@/components/effects/AuthorityParticles';

export default function TestParticlesPage() {
  const [config, setConfig] = useState({
    enabled: true,
    theme: 'diamond',
    intensity: 'balanced' as 'minimal' | 'balanced' | 'prominent',
    interactionMode: 'always' as 'hover' | 'always' | 'strategic',
    particleCount: 4
  });

  const [cardSize, setCardSize] = useState({
    width: 400,
    height: 600
  });

  const themes = [
    'diamond', 'emerald', 'platinum', 'sapphire', 'ruby', 
    'gold', 'executive', 'professional', 'creative'
  ];

  const themeColors = {
    diamond: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    emerald: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
    platinum: 'linear-gradient(135deg, #4a4a4a 0%, #5a5a5a 50%, #2a2a2a 100%)',
    sapphire: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #1e3c72 100%)',
    ruby: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
    gold: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    executive: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    professional: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)',
    creative: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)'
  };

  return (
    <Container fluid style={{ backgroundColor: '#0a0d1a', minHeight: '100vh', paddingTop: '2rem' }}>
      <Row>
        {/* Controls */}
        <Col lg={3} className="mb-4">
          <Card bg="dark" text="white">
            <Card.Header>
              <h5>🌟 Authority Particles Test</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                {/* Enable/Disable */}
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="enabled"
                    label="Enable Particles"
                    checked={config.enabled}
                    onChange={(e) => setConfig({...config, enabled: e.target.checked})}
                  />
                </Form.Group>

                {/* Theme */}
                <Form.Group className="mb-3">
                  <Form.Label>Theme</Form.Label>
                  <Form.Select 
                    value={config.theme}
                    onChange={(e) => setConfig({...config, theme: e.target.value})}
                  >
                    {themes.map(theme => (
                      <option key={theme} value={theme}>
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Intensity */}
                <Form.Group className="mb-3">
                  <Form.Label>Intensity</Form.Label>
                  <Form.Select 
                    value={config.intensity}
                    onChange={(e) => setConfig({...config, intensity: e.target.value as any})}
                  >
                    <option value="minimal">Minimal (3 particles)</option>
                    <option value="balanced">Balanced (4 particles)</option>
                    <option value="prominent">Prominent (5 particles)</option>
                  </Form.Select>
                </Form.Group>

                {/* Interaction Mode */}
                <Form.Group className="mb-3">
                  <Form.Label>Interaction Mode</Form.Label>
                  <Form.Select 
                    value={config.interactionMode}
                    onChange={(e) => setConfig({...config, interactionMode: e.target.value as any})}
                  >
                    <option value="always">Always Active</option>
                    <option value="hover">Hover Triggered</option>
                    <option value="strategic">Strategic Mode</option>
                  </Form.Select>
                </Form.Group>

                {/* Particle Count Override */}
                <Form.Group className="mb-3">
                  <Form.Label>Particle Count Override</Form.Label>
                  <Form.Range
                    min={1}
                    max={8}
                    value={config.particleCount}
                    onChange={(e) => setConfig({...config, particleCount: parseInt(e.target.value)})}
                  />
                  <Form.Text>{config.particleCount} particles</Form.Text>
                </Form.Group>

                {/* Card Size */}
                <Form.Group className="mb-3">
                  <Form.Label>Card Width</Form.Label>
                  <Form.Range
                    min={300}
                    max={600}
                    value={cardSize.width}
                    onChange={(e) => setCardSize({...cardSize, width: parseInt(e.target.value)})}
                  />
                  <Form.Text>{cardSize.width}px</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Card Height</Form.Label>
                  <Form.Range
                    min={400}
                    max={800}
                    value={cardSize.height}
                    onChange={(e) => setCardSize({...cardSize, height: parseInt(e.target.value)})}
                  />
                  <Form.Text>{cardSize.height}px</Form.Text>
                </Form.Group>

                <Button 
                  variant="outline-warning" 
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Reset Test
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Test Card */}
        <Col lg={9}>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div 
              style={{
                width: `${cardSize.width}px`,
                height: `${cardSize.height}px`,
                background: themeColors[config.theme as keyof typeof themeColors],
                borderRadius: '20px',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                overflow: 'hidden'
              }}
            >
              {/* Authority Particles */}
              <AuthorityParticles
                enabled={config.enabled}
                theme={config.theme}
                intensity={config.intensity}
                interactionMode={config.interactionMode}
                containerWidth={cardSize.width}
                containerHeight={cardSize.height}
                onHover={config.interactionMode === 'hover'}
                particleCount={config.particleCount}
              />

              {/* Test Content */}
              <div 
                style={{
                  position: 'relative',
                  zIndex: 10,
                  padding: '2rem',
                  color: 'white',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <h2 style={{ marginBottom: '1rem', fontWeight: 700 }}>
                  Carlos Mendoza
                </h2>
                <h4 style={{ marginBottom: '2rem', opacity: 0.9 }}>
                  CEO & Fundador
                </h4>
                <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
                  Líder visionario con más de 15 años de experiencia 
                  transformando empresas y generando resultados excepcionales.
                </p>
                
                <div className="mt-4">
                  <Button 
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: '2px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      borderRadius: '15px',
                      padding: '12px 24px',
                      marginRight: '10px'
                    }}
                  >
                    📱 WhatsApp
                  </Button>
                  <Button 
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'white',
                      borderRadius: '15px',
                      padding: '12px 24px'
                    }}
                  >
                    📧 Email
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <Card bg="dark" text="white" className="mt-4">
            <Card.Body>
              <h6>🎯 Testing Authority Presence Particles v2.0</h6>
              <p className="mb-2">
                <strong>Current Config:</strong> {config.theme} theme, 
                {config.intensity} intensity, {config.particleCount} particles
              </p>
              <p className="mb-2">
                <strong>Expected Behavior:</strong> Elegant orbital movements that transmit 
                professional authority and leadership presence.
              </p>
              <p className="mb-0 text-warning">
                <strong>Performance:</strong> GPU-accelerated, battery-aware, 
                mobile-optimized system.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
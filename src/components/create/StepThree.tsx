'use client';

import { Form, Row, Col, InputGroup } from 'react-bootstrap';

interface CardData {
  location?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  appointmentLink?: string;
  professionalDetails?: string;
}

interface StepThreeProps {
  cardData: CardData;
  updateCardData: (field: string, value: string) => void;
}

export function StepThree({ cardData, updateCardData }: StepThreeProps) {
  const socialPlatforms = [
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: '💼',
      placeholder: 'alejandro-torres',
      prefix: 'linkedin.com/in/'
    },
    {
      key: 'twitter',
      label: 'Twitter/X',
      icon: '🐦',
      placeholder: 'alejandrodev',
      prefix: 'twitter.com/'
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: '📸',
      placeholder: 'alejandro.dev',
      prefix: 'instagram.com/'
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: '📘',
      placeholder: 'alejandro.torres',
      prefix: 'facebook.com/'
    },
    {
      key: 'website',
      label: 'Sitio Web',
      icon: '🌐',
      placeholder: 'https://alejandrotorres.dev',
      prefix: ''
    },
    {
      key: 'appointmentLink',
      label: 'Agendar Citas',
      icon: '📅',
      placeholder: 'https://calendly.com/alejandro',
      prefix: ''
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <h5 className="mb-3">🌍 Ubicación</h5>
        <Form.Group className="mb-3">
          <Form.Label>Dirección / Ubicación</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej: Av. Providencia 1234, Santiago"
            value={cardData.location}
            onChange={(e) => updateCardData('location', e.target.value)}
          />
        </Form.Group>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">🔗 Conecta tus Redes Sociales</h5>
        <p className="text-muted">
          Agrega tus perfiles profesionales para que tus contactos puedan conectar contigo
        </p>
      </div>

      <Row>
        {socialPlatforms.map((platform) => (
          <Col md={6} key={platform.key} className="mb-3">
            <Form.Group>
              <Form.Label>
                {platform.icon} {platform.label}
              </Form.Label>
              {platform.prefix ? (
                <InputGroup>
                  <InputGroup.Text>{platform.prefix}</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder={platform.placeholder}
                    value={(cardData as Record<string, string>)[platform.key] || ''}
                    onChange={(e) => updateCardData(platform.key, e.target.value)}
                  />
                </InputGroup>
              ) : (
                <Form.Control
                  type="url"
                  placeholder={platform.placeholder}
                  value={(cardData as Record<string, string>)[platform.key] || ''}
                  onChange={(e) => updateCardData(platform.key, e.target.value)}
                />
              )}
            </Form.Group>
          </Col>
        ))}
      </Row>

      {/* Preview Section */}
      <div className="mt-4 p-3 bg-dark bg-opacity-25 rounded">
        <h6 className="mb-3">Vista Previa de Enlaces</h6>
        <div className="d-flex flex-wrap gap-2">
          {socialPlatforms.map((platform) => {
            const value = (cardData as Record<string, string>)[platform.key];
            if (!value) return null;
            
            const url = platform.prefix 
              ? `https://${platform.prefix}${value}`
              : value;
              
            return (
              <a
                key={platform.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-info btn-sm"
              >
                {platform.icon} {platform.label}
              </a>
            );
          })}
          {Object.values(cardData).filter(Boolean).length === 0 && (
            <small className="text-muted">
              Los enlaces aparecerán aquí cuando los agregues
            </small>
          )}
        </div>
      </div>

      {/* Detalles Profesionales */}
      <div className="mb-4 mt-4">
        <h5 className="mb-3">📋 Detalles Profesionales</h5>
        <Form.Group className="mb-3">
          <Form.Label>Información Adicional</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Ej: RUT: 12.345.678-9&#10;Registro profesional: 12345&#10;Certificaciones: AWS, Google Cloud..."
            value={cardData.professionalDetails}
            onChange={(e) => updateCardData('professionalDetails', e.target.value)}
          />
          <Form.Text className="text-muted">
            Agrega información como RUT, registros profesionales, certificaciones, etc.
          </Form.Text>
        </Form.Group>
      </div>

      <div className="bg-success bg-opacity-20 p-3 rounded mt-4" style={{ border: '1px solid rgba(25, 135, 84, 0.3)' }}>
        <small className="text-light" style={{ color: '#ffffff !important' }}>
          <strong style={{ color: '#00ff88' }}>🔗 Consejo:</strong> Asegúrate de que tus perfiles estén actualizados y sean profesionales. 
          Cada enlace es una oportunidad de generar una conexión valiosa.
        </small>
      </div>
    </div>
  );
}
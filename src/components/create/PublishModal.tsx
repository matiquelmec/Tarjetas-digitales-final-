'use client';

import { Modal, Button, Alert, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface CardData {
  name: string;
  title: string;
  about?: string;
  email?: string;
  whatsapp?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  photo?: string;
  location?: string;
  appointmentLink?: string;
  professionalDetails?: string;
  cardBackgroundColor?: string;
  cardTextColor?: string;
  buttonSecondaryColor?: string;
  buttonSecondaryHoverColor?: string;
  buttonNormalBackgroundColor?: string;
  pageBackgroundColor?: string;
  enableHoverEffect?: boolean;
  enableGlassmorphism?: boolean;
  enableSubtleAnimations?: boolean;
  enableBackgroundPatterns?: boolean;
  enableAIPalette?: boolean;
  // Nuevos campos para efectos visuales (Agosto 2025)
  fontFamily?: string;
  enableParticles?: boolean;
  particleType?: string;
  particleDensity?: number;
  particleCount?: number;
  template?: string;
  // Campos para efectos de ambiente (Agosto 2025)
  enableAnimatedGradient?: boolean;
  animatedGradientType?: string;
  animatedGradientSpeed?: number;
  animatedGradientIntensity?: number;
  animatedGradientOpacity?: number;
  enableFloatingShapes?: boolean;
  floatingShapesType?: string;
  floatingShapesCount?: number;
  floatingShapesSpeed?: number;
  ambientIntensity?: number;
  ambientOpacity?: number;
  customUrl?: string;
}

interface PublishModalProps {
  show: boolean;
  onHide: () => void;
  cardData: CardData;
}

export function PublishModal({ show, onHide, cardData }: PublishModalProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState(1); // 1: Publishing, 2: Success
  const [cardUrl, setCardUrl] = useState('');
  const [publishError, setPublishError] = useState<string | null>(null);

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      // Validate required fields
      if (!cardData.name || cardData.name.trim() === '') {
        throw new Error('El nombre es requerido para crear la tarjeta');
      }
      
      if (!cardData.title || cardData.title.trim() === '') {
        throw new Error('El título/profesión es requerido para crear la tarjeta');
      }

      // Create card data for API (all fields now exist in Prisma Card schema)
      const cardDataForAPI = {
        title: cardData.name || 'Untitled Card',
        name: cardData.name || '',
        profession: cardData.title || '',
        about: cardData.about || '',
        email: cardData.email || '',
        phone: cardData.whatsapp || cardData.phone || '',
        website: cardData.website || '',
        linkedin: cardData.linkedin || '',
        twitter: cardData.twitter || '',
        instagram: cardData.instagram || '',
        facebook: cardData.facebook || '',
        photoUrl: cardData.photo || '',
        location: cardData.location || '',
        appointmentLink: cardData.appointmentLink || '',
        professionalDetails: cardData.professionalDetails || '',
        cardBackgroundColor: cardData.cardBackgroundColor || '#2c2c2c',
        cardTextColor: cardData.cardTextColor || '#ffffff',
        buttonSecondaryColor: cardData.buttonSecondaryColor || '#00F6FF',
        buttonSecondaryHoverColor: cardData.buttonSecondaryHoverColor || '#00D1DB',
        buttonNormalBackgroundColor: cardData.buttonNormalBackgroundColor || '#1F1F1F',
        pageBackgroundColor: cardData.pageBackgroundColor || '#121212',
        enableHoverEffect: cardData.enableHoverEffect || false,
        enableGlassmorphism: cardData.enableGlassmorphism || false,
        enableSubtleAnimations: cardData.enableSubtleAnimations || false,
        enableBackgroundPatterns: cardData.enableBackgroundPatterns || false,
        enableAIPalette: cardData.enableAIPalette || false,
        // Nuevos campos para efectos visuales (Agosto 2025)
        fontFamily: cardData.fontFamily || 'Inter',
        enableParticles: cardData.enableParticles || false,
        particleType: cardData.particleType || 'floating',
        particleDensity: cardData.particleDensity || 3,
        particleCount: cardData.particleCount || 50,
        template: cardData.template || 'modern',
        // Campos para efectos de ambiente (Agosto 2025)
        enableAnimatedGradient: cardData.enableAnimatedGradient || false,
        animatedGradientType: cardData.animatedGradientType || 'aurora',
        animatedGradientSpeed: cardData.animatedGradientSpeed || 3,
        animatedGradientIntensity: cardData.animatedGradientIntensity || 3,
        animatedGradientOpacity: cardData.animatedGradientOpacity || 0.5,
        enableFloatingShapes: cardData.enableFloatingShapes || false,
        floatingShapesType: cardData.floatingShapesType || 'geometric',
        floatingShapesCount: cardData.floatingShapesCount || 3,
        floatingShapesSpeed: cardData.floatingShapesSpeed || 3,
        ambientIntensity: cardData.ambientIntensity || 3,
        ambientOpacity: cardData.ambientOpacity || 0.5,
        customUrl: cardData.customUrl || '',
        isActive: true
      };

      console.log('Publishing card with data:', cardDataForAPI);

      // Ensure user exists in database before creating card
      console.log('Ensuring user exists in database...');
      const ensureUserResponse = await fetch('/api/user/ensure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      });

      const ensureUserData = await ensureUserResponse.json();
      console.log('User ensure response:', ensureUserData);

      if (!ensureUserResponse.ok) {
        throw new Error(`Failed to ensure user exists: ${ensureUserData.error || 'Unknown error'}`);
      }

      // Now call the real API to create the card
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // Include cookies for authentication
        body: JSON.stringify(cardDataForAPI),
      });

      console.log('Response status:', response.status);

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Failed to create card');
      }

      const newCard = responseData;
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tarjetasdigitales.netlify.app';
      
      // Use custom URL (slug) instead of ID for prettier URLs
      const finalUrl = newCard.customUrl 
        ? `${baseUrl}/c/${newCard.customUrl}`
        : `${baseUrl}/card/${newCard.id}`;
      setCardUrl(finalUrl);
      setPublishStep(2);
    } catch (error) {
      console.error('Error publishing card:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setPublishError(`Error al crear la tarjeta: ${errorMessage}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cardData.name}-qr-code.png`;
      a.click();
    }
  };

  const shareWhatsApp = () => {
    const message = `¡Hola! Te comparto mi tarjeta digital: ${cardUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareEmail = () => {
    const subject = `Tarjeta Digital de ${cardData.name}`;
    const body = `Hola,

Te comparto mi tarjeta digital profesional:
${cardUrl}

Saludos,
${cardData.name}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          {publishStep === 1 ? '🚀 Publicando tu Tarjeta' : '🎉 ¡Tarjeta Publicada!'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-dark text-white">
        {publishStep === 1 ? (
          // Publishing Step
          <div className="text-center">
            {publishError && (
              <Alert variant="danger" onClose={() => setPublishError(null)} dismissible className="mb-3">
                {publishError}
              </Alert>
            )}
            {isPublishing ? (
              <>
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Publicando...</span>
                </div>
                <h5>Creando tu tarjeta digital...</h5>
                <p className="text-muted">Esto tomará solo unos segundos</p>
              </>
            ) : (
              <>
                <h5>¿Listo para publicar tu tarjeta?</h5>
                <p className="text-muted mb-4">
                  Tu tarjeta estará disponible inmediatamente en internet
                </p>
                
                <Alert variant="info">
                  <strong>Tu tarjeta tendrá una URL única</strong><br/>
                  <small className="text-muted">Se generará automáticamente después de publicar</small>
                </Alert>
                
                <div className="d-flex gap-2 justify-content-center">
                  <Button variant="outline-light" onClick={onHide}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handlePublish}>
                    Publicar Ahora
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          // Success Step
          <div>
            <div className="text-center mb-4">
              <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <span style={{ fontSize: '2rem' }}>✅</span>
              </div>
              <h4>¡Tu tarjeta está lista!</h4>
              <p className="text-muted">Ya puedes compartirla con el mundo</p>
            </div>

            {/* URL Section */}
            <div className="mb-4">
              <Form.Label>URL de tu tarjeta</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={cardUrl}
                  readOnly
                  className="bg-dark text-white border-secondary"
                />
                <Button 
                  variant="outline-info" 
                  onClick={() => copyToClipboard(cardUrl)}
                >
                  📋 Copiar
                </Button>
              </InputGroup>
            </div>

            {/* QR Code */}
            <div className="text-center mb-4">
              <h6>Código QR</h6>
              <div className="bg-white p-3 rounded d-inline-block">
                <QRCodeSVG 
                  id="qr-code"
                  value={cardUrl} 
                  size={150}
                  level="M"
                />
              </div>
              <br />
              <Button variant="outline-light" size="sm" className="mt-2" onClick={downloadQR}>
                📥 Descargar QR
              </Button>
            </div>

            {/* Sharing Options */}
            <div className="mb-4">
              <h6>Compartir tu tarjeta</h6>
              <div className="d-flex gap-2 flex-wrap">
                <Button variant="success" size="sm" onClick={shareWhatsApp}>
                  📱 WhatsApp
                </Button>
                <Button variant="info" size="sm" onClick={shareEmail}>
                  📧 Email
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => window.open(cardUrl, '_blank')}
                >
                  👁️ Ver Tarjeta
                </Button>
              </div>
            </div>

            {/* Next Steps */}
            <Alert variant="warning">
              <h6>🚀 Próximos pasos recomendados:</h6>
              <ul className="mb-0">
                <li>Agrega el QR a tu firma de email</li>
                <li>Comparte en tus redes sociales</li>
                <li>Imprime el QR en tarjetas físicas</li>
                <li>Considera upgradearte para dominio personalizado</li>
              </ul>
            </Alert>
          </div>
        )}
      </Modal.Body>
      
      {publishStep === 2 && (
        <Modal.Footer className="bg-dark text-white">
          <Button variant="outline-light" onClick={onHide}>
            Cerrar
          </Button>
          <Button variant="primary" href="/dashboard">
            Ir al Dashboard
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}

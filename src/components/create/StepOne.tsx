'use client';

import { Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface CardData {
  name: string;
  title: string;
  company?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  about?: string;
  photo?: string;
}

interface StepOneProps {
  cardData: CardData;
  updateCardData: (field: string, value: string) => void;
}

export function StepOne({ cardData, updateCardData }: StepOneProps) {
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [aboutSuggestions, setAboutSuggestions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const generateTitleSuggestions = (text: string) => {
    const suggestions = [
      `${text} Certificado`,
      `${text} Senior`,
      `${text} Especialista`,
      `Expert ${text}`,
      `${text} Profesional`,
    ].filter(s => s !== text);
    setTitleSuggestions(suggestions.slice(0, 3));
  };

  const generateAboutSuggestions = (text: string) => {
    const suggestions = [
      `${text} Con más de 5 años de experiencia, me especializo en crear soluciones innovadoras y eficientes.`,
      `Profesional ${text.toLowerCase()} con enfoque en resultados y atención personalizada. Comprometido con la excelencia.`,
      `${text} Experto en mi área con metodologías modernas y enfoque centrado en el cliente.`,
    ];
    setAboutSuggestions(suggestions);
  };

  const applySuggestion = (suggestion: string, type: 'title' | 'about') => {
    if (type === 'title') {
      updateCardData('title', suggestion);
      setTitleSuggestions([]);
    } else {
      updateCardData('about', suggestion);
      setAboutSuggestions([]);
    }
  };

  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateCardData('photo', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handlePhotoUpload(file);
    }
  };

  return (
    <div>
      {/* Photo Upload - Lo más importante primero */}
      <div className="mb-4">
        <h5 className="mb-3">📸 Tu Foto de Perfil</h5>
        <p className="text-muted mb-3">Esta es la imagen que verán tus contactos - ¡haz que cuente!</p>
        <div
          className={`border-2 border-dashed rounded p-4 text-center ${
            dragActive ? 'border-info bg-info bg-opacity-10' : 'border-secondary'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{ cursor: 'pointer' }}
          onClick={() => fileInputRef.current?.click()}
        >
          {cardData.photo ? (
            <div>
              <Image 
                src={cardData.photo} 
                alt="Tu foto de perfil" 
                width={120}
                height={120}
                className="rounded-circle mb-3"
                style={{ objectFit: 'cover' }}
              />
              <p className="mb-2">✅ ¡Perfecto! Tu foto está lista</p>
              <Button variant="outline-info" size="sm">
                Cambiar foto
              </Button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📸</div>
              <h6 className="mb-2">Sube tu mejor foto profesional</h6>
              <p className="mb-2">Arrastra y suelta tu foto aquí</p>
              <p className="text-muted">o haz clic para seleccionar desde tu dispositivo</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
        </div>
        
        <Form.Group className="mt-3">
          <Form.Label>O ingresa URL de tu imagen</Form.Label>
          <Form.Control
            type="url"
            placeholder="https://ejemplo.com/mi-foto-profesional.jpg"
            value={typeof cardData.photo === 'string' && cardData.photo.startsWith('http') ? cardData.photo : ''}
            onChange={(e) => updateCardData('photo', e.target.value)}
          />
          <Form.Text className="text-muted">
            Recomendación: Usa una foto profesional, con buena iluminación y enfoque en tu rostro
          </Form.Text>
        </Form.Group>
      </div>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Alejandro Torres"
              value={cardData.name}
              onChange={(e) => updateCardData('name', e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Título Profesional *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Desarrollador Full-Stack"
              value={cardData.title}
              onChange={(e) => updateCardData('title', e.target.value)}
              required
            />
            <Button 
              variant="outline-info" 
              size="sm" 
              className="mt-2"
              onClick={() => generateTitleSuggestions(cardData.title)}
              disabled={!cardData.title}
            >
              🤖 Mejorar con IA
            </Button>
            
            {titleSuggestions.length > 0 && (
              <div className="mt-3 p-3 rounded bg-dark bg-opacity-25">
                <h6 className="text-info mb-2">Sugerencias de título:</h6>
                {titleSuggestions.map((suggestion, index) => (
                  <div key={index} className="d-grid gap-2 mb-2">
                    <Button 
                      variant="outline-light" 
                      size="sm"
                      onClick={() => applySuggestion(suggestion, 'title')}
                    >
                      {suggestion}
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => setTitleSuggestions([])}
                >
                  Cerrar sugerencias
                </Button>
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Empresa</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Tech Solutions Inc."
              value={cardData.company}
              onChange={(e) => updateCardData('company', e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              placeholder="alejandro@ejemplo.com"
              value={cardData.email}
              onChange={(e) => updateCardData('email', e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <InputGroup>
              <InputGroup.Text>+56</InputGroup.Text>
              <Form.Control
                type="tel"
                placeholder="987654321"
                value={cardData.phone}
                onChange={(e) => updateCardData('phone', e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>WhatsApp</Form.Label>
            <InputGroup>
              <InputGroup.Text>+56</InputGroup.Text>
              <Form.Control
                type="tel"
                placeholder="987654321"
                value={cardData.whatsapp}
                onChange={(e) => updateCardData('whatsapp', e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      {/* About Section */}
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Sobre mí / Descripción profesional</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Cuéntanos sobre tu experiencia, especialidades y lo que te hace único..."
              value={cardData.about}
              onChange={(e) => updateCardData('about', e.target.value)}
            />
            <Button 
              variant="outline-info" 
              size="sm" 
              className="mt-2"
              onClick={() => generateAboutSuggestions(cardData.title || 'Profesional')}
            >
              🤖 Generar descripción con IA
            </Button>
            
            {aboutSuggestions.length > 0 && (
              <div className="mt-3 p-3 rounded bg-dark bg-opacity-25">
                <h6 className="text-info mb-2">Sugerencias de descripción:</h6>
                {aboutSuggestions.map((suggestion, index) => (
                  <div key={index} className="mb-2">
                    <div className="bg-secondary bg-opacity-25 p-2 rounded mb-2">
                      <small>{suggestion}</small>
                    </div>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => applySuggestion(suggestion, 'about')}
                    >
                      Usar esta descripción
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => setAboutSuggestions([])}
                >
                  Cerrar sugerencias
                </Button>
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>

      <div className="bg-info bg-opacity-10 p-3 rounded mt-4">
        <small className="text-info">
          <strong>🤖 IA Integrada:</strong> Usa nuestras sugerencias con IA para crear títulos y descripciones más impactantes. 
          Los campos marcados con * son obligatorios.
        </small>
      </div>
    </div>
  );
}
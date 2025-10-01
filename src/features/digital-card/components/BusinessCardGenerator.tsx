'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
// import dynamic from 'next/dynamic'; // Unused import
import { useSession } from 'next-auth/react';
import { useCards } from '@/hooks/useCards';
import BusinessCard from './BusinessCard';


interface Palette {
  name: string;
  pageBackgroundColor: string;
  cardBackgroundColor: string;
  cardTextColor: string;
  buttonSecondaryColor: string;
  buttonSecondaryHoverColor: string;
  buttonNormalBackgroundColor: string;
}

export default function BusinessCardGenerator() {
  const { data: session } = useSession();
  const { saveCard, loading: saveLoading, error: saveError } = useCards();
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [name, setName] = useState('Alejandro Torres');
  const [photoUrl, setPhotoUrl] = useState('https://randomuser.me/api/portraits/men/75.jpg');
  const [title, setTitle] = useState('Desarrollador Full-Stack Senior');
  const [about, setAbout] = useState('Ingeniero de software con más de 10 años de experiencia en el desarrollo de aplicaciones web escalables. Experto en tecnologías como React, Node.js y Python. Me especializo en crear soluciones robustas y eficientes que impulsan el crecimiento del negocio.');
  const [location, setLocation] = useState('Av. Siempre Viva 742, Santiago');
  const [whatsapp, setWhatsapp] = useState('56987654321');
  const [email, setEmail] = useState('alejandro.torres@example.com');
  const [professionalDetails, setProfessionalDetails] = useState('GitHub: github.com/atorres\nCertificaciones: AWS Certified Solutions Architect');
  const [cardBackgroundColor, setCardBackgroundColor] = useState('#1F1F1F');
  const [cardTextColor, setCardTextColor] = useState('#EAEAEA');
  const [buttonSecondaryColor, setButtonSecondaryColor] = useState('#00F6FF');
  const [buttonNormalBackgroundColor, setButtonNormalBackgroundColor] = useState('#1F1F1F');
  const [buttonSecondaryHoverColor, setButtonSecondaryHoverColor] = useState('#00D1DB');
  const [pageBackgroundColor, setPageBackgroundColor] = useState('#121212');
  const [aboutSuggestions, setAboutSuggestions] = useState<string[]>([]);
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [enableHoverEffect, setEnableHoverEffect] = useState(false);
  const [enableGlassmorphism, setEnableGlassmorphism] = useState(false);
  const [enableSubtleAnimations, setEnableSubtleAnimations] = useState(false);
  const [enableBackgroundPatterns, setEnableBackgroundPatterns] = useState(false);
  const [enableParticles] = useState(false);
  const [particleType] = useState<'floating' | 'constellation' | 'professional' | 'creative'>('floating');
  const [particleDensity] = useState(3);
  const [enableAIPalette, setEnableAIPalette] = useState(false);
  const [currentPaletteIndex, setCurrentPaletteIndex] = useState(0);
  const [whatsappShareUrl, setWhatsappShareUrl] = useState('');
  const [appointmentLink, setAppointmentLink] = useState('http://agendamiento.softwaremedilink.com/agendas/online/669da88d2603f24c5717547f37b02e334054f374');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [editorTextColor, setEditorTextColor] = useState('#ffffff');
  const [buttonTextColor, setButtonTextColor] = useState('#ffffff');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  useEffect(() => {
    // TODO: Actualizar para usar nuevo sistema de acceso
    // Temporalmente permitir todo para mantener funcionalidad
    setPlanLimits({
      canUseHoverEffect: true,
      canUseGlassmorphism: true, 
      canUseSubtleAnimations: true,
      canUseBackgroundPatterns: true,
      canUseAIPalette: true,
      canUseCustomTemplates: true
    });
  }, [session]);

  const minimalistPalettes: Palette[] = [
    { name: 'Carbón y Naranja', pageBackgroundColor: '#1a1a1a', cardBackgroundColor: '#2c2c2c', cardTextColor: '#ffffff', buttonSecondaryColor: '#ff6600', buttonSecondaryHoverColor: '#cc5200', buttonNormalBackgroundColor: '#444444' },
    { name: 'Menta y Negro', pageBackgroundColor: '#f0f2f5', cardBackgroundColor: '#ffffff', cardTextColor: '#1a1a1a', buttonSecondaryColor: '#1abc9c', buttonSecondaryHoverColor: '#16a085', buttonNormalBackgroundColor: '#e9ecef' },
    { name: 'Azul Nórdico', pageBackgroundColor: '#e5e9f0', cardBackgroundColor: '#d8dee9', cardTextColor: '#2e3440', buttonSecondaryColor: '#5e81ac', buttonSecondaryHoverColor: '#4c6a91', buttonNormalBackgroundColor: '#eceff4' },
    { name: 'Arena y Tinta', pageBackgroundColor: '#fdf6e3', cardBackgroundColor: '#f5e5c4', cardTextColor: '#2c3e50', buttonSecondaryColor: '#cb4b16', buttonSecondaryHoverColor: '#b58900', buttonNormalBackgroundColor: '#eee8d5' },
    { name: 'Lavanda y Carbón', pageBackgroundColor: '#e6e6fa', cardBackgroundColor: '#ffffff', cardTextColor: '#2c2c2c', buttonSecondaryColor: '#9b59b6', buttonSecondaryHoverColor: '#8e44ad', buttonNormalBackgroundColor: '#f2f2f2' },
  ];

  const getContrastTextColor = (hexcolor: string) => {
    if (!hexcolor || hexcolor.length < 7) return '#000000';
    const r = parseInt(hexcolor.substring(1, 3), 16);
    const g = parseInt(hexcolor.substring(3, 5), 16);
    const b = parseInt(hexcolor.substring(5, 7), 16);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  useEffect(() => {
    setEditorTextColor(getContrastTextColor(pageBackgroundColor));
  }, [pageBackgroundColor]);

  useEffect(() => {
    setButtonTextColor(getContrastTextColor(buttonNormalBackgroundColor));
  }, [buttonNormalBackgroundColor]);

  const applyPalette = (palette: Palette) => {

    setPageBackgroundColor(palette.pageBackgroundColor);
    setCardBackgroundColor(palette.cardBackgroundColor);
    setCardTextColor(palette.cardTextColor);
    setButtonSecondaryColor(palette.buttonSecondaryColor);
    setButtonSecondaryHoverColor(palette.buttonSecondaryHoverColor);
    setButtonNormalBackgroundColor(palette.buttonNormalBackgroundColor);
  };

  const generateNextPalette = () => {
    const nextIndex = (currentPaletteIndex + 1) % minimalistPalettes.length;
    applyPalette(minimalistPalettes[nextIndex]);
    setCurrentPaletteIndex(nextIndex);
  };

  useEffect(() => {
    const baseText = `Te comparto la tarjeta de presentación digital de ${name}, ${title}.\n\nEs especialista en ${about}. Atiende en ${location} (acepta Fonasa y Colmena).\n\nEncontrarás toda la información para agendar una cita y contactarlo aquí:`;
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const fullMessage = `${baseText} ${currentUrl}`;
    const encodedMessage = encodeURIComponent(fullMessage);
    setWhatsappShareUrl(`https://wa.me/?text=${encodedMessage}`);
  }, [name, title, about, location]);

  const generateSuggestions = (text: string, type: 'title' | 'about') => {
    const improvedSuggestions = [
      `Versión mejorada 1 de ${type}: ${text.replace(/\b(Psicólogo|Clínico|Psicoterapeuta|Magíster)\b/gi, (match) => `Neuro-${match}`)}`,
      `Versión mejorada 2 de ${type}: ${text.replace(/\b(y|en|de)\b/gi, (match) => `${match} IA`)}`,
    ];
    if (type === 'title') {
      setTitleSuggestions(improvedSuggestions);
    } else {
      setAboutSuggestions(improvedSuggestions);
    }
  };

  const applySuggestion = (suggestion: string, type: 'title' | 'about') => {
    const cleanedSuggestion = suggestion.replace(/Versión mejorada \d de (title|about): /, '');
    if (type === 'title') {
      setTitle(cleanedSuggestion);
      setTitleSuggestions([]);
    } else {
      setAbout(cleanedSuggestion);
      setAboutSuggestions([]);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCard = async () => {
    if (!session?.user?.id) return;

    const cardData = {
      title: title,
      name: name,
      profession: title,
      about: about,
      email: email,
      phone: whatsapp,
      website: appointmentLink,
      linkedin: linkedin,
      twitter: twitter,
      instagram: instagram,
      photoUrl: photoUrl,
      customization: {
        cardBackgroundColor,
        cardTextColor,
        buttonSecondaryColor,
        buttonNormalBackgroundColor,
        buttonSecondaryHoverColor,
        pageBackgroundColor,
        enableHoverEffect,
        enableGlassmorphism,
        enableSubtleAnimations,
        enableBackgroundPatterns,
        enableParticles,
        particleType,
        particleDensity,
        enableAIPalette,
        selectedTemplate,
      }
    };

    try {
      await saveCard(cardData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: pageBackgroundColor }}>
      <Row className="w-100">
        <Col md={6} className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: editorTextColor }}>Editor de Tarjeta de Presentación</h2>
            <Button 
              variant="success" 
              onClick={handleSaveCard}
              disabled={saveLoading}
            >
              {saveLoading ? 'Saving...' : 'Save Card'}
            </Button>
          </div>
          
          {saveSuccess && (
            <Alert variant="success" className="mb-3">
              Card saved successfully!
            </Alert>
          )}
          
          {saveError && (
            <Alert variant="danger" className="mb-3">
              Error saving card: {saveError}
            </Alert>
          )}
          
          <Form>
            <fieldset disabled={saveLoading}>
              <legend style={{ color: editorTextColor }}>Información Personal</legend>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: editorTextColor }}>Nombre Completo</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: editorTextColor }}>Subir Foto de Perfil</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handlePhotoUpload} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: editorTextColor }}>Especialidad</Form.Label>
                <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Button variant="secondary" className="mt-2" onClick={() => generateSuggestions(title, 'title')}>Mejorar con IA</Button>
                {titleSuggestions.length > 0 && (
                  <div className="mt-3 p-3 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <h5 style={{ color: editorTextColor }}>Sugerencias de Especialidad:</h5>
                    {titleSuggestions.map((suggestion, index) => (
                      <div key={index} className="d-grid gap-2 mb-2">
                        <Button variant="outline-light" onClick={() => applySuggestion(suggestion, 'title')} style={{ color: buttonTextColor }}>
                          {suggestion}
                        </Button>
                      </div>
                    ))}
                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="outline-light" onClick={() => generateSuggestions(title, 'title')} style={{ color: buttonTextColor }}>Refrescar</Button>
                      <Button variant="outline-danger" onClick={() => setTitleSuggestions([])}>No utilizar</Button>
                    </div>
                  </div>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: editorTextColor }}>Sobre mí</Form.Label>
                <Form.Control as="textarea" rows={3} value={about} onChange={(e) => setAbout(e.target.value)} />
                <Button variant="secondary" className="mt-2" onClick={() => generateSuggestions(about, 'about')}>Mejorar con IA</Button>
                {aboutSuggestions.length > 0 && (
                  <div className="mt-3 p-3 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <h5 style={{ color: editorTextColor }}>Sugerencias de Sobre mí:</h5>
                    {aboutSuggestions.map((suggestion, index) => (
                      <div key={index} className="d-grid gap-2 mb-2">
                        <Button variant="outline-light" onClick={() => applySuggestion(suggestion, 'about')} style={{ color: buttonTextColor }}>
                          {suggestion}
                        </Button>
                      </div>
                    ))}
                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="outline-light" onClick={() => generateSuggestions(about, 'about')} style={{ color: buttonTextColor }}>Refrescar</Button>
                      <Button variant="outline-danger" onClick={() => setAboutSuggestions([])}>No utilizar</Button>
                    </div>
                  </div>
                )}
              </Form.Group>
            </fieldset>

            <fieldset className="mt-4">
              <legend style={{ color: editorTextColor }}>Ubicación</legend>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: editorTextColor }}>Ubicación</Form.Label>
                <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
              </Form.Group>
            </fieldset>

            <fieldset className="mt-4">
              <legend style={{ color: editorTextColor }}>Información de Contacto</legend>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: editorTextColor }}>WhatsApp (ej: 56912345678)</Form.Label>
                <Form.Control type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: editorTextColor }}>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: editorTextColor }}>Enlace para Agendar Cita</Form.Label>
                <Form.Control type="url" value={appointmentLink} onChange={(e) => setAppointmentLink(e.target.value)} placeholder="https://tu-enlace-de-agendamiento.com" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: editorTextColor }}>LinkedIn URL</Form.Label>
                <Form.Control type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/tuperfil" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: editorTextColor }}>Instagram URL</Form.Label>
                <Form.Control type="url" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/tuperfil" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: editorTextColor }}>X (Twitter) URL</Form.Label>
                <Form.Control type="url" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/tuperfil" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: editorTextColor }}>Facebook URL</Form.Label>
                <Form.Control type="url" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/tuperfil" />
              </Form.Group>
            </fieldset>

            <fieldset className="mt-4">
              <legend style={{ color: editorTextColor }}>Detalles Profesionales</legend>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: editorTextColor }}>Detalles Profesionales (ej: RUT, certificaciones, etc.)</Form.Label>
                <Form.Control as="textarea" rows={4} value={professionalDetails} onChange={(e) => setProfessionalDetails(e.target.value)} placeholder="Ej: RUT: 12.345.678-9\nLicencia Médica: 12345\nEspecialista en..." />
              </Form.Group>
            </fieldset>

            <fieldset className="mt-4">
              <legend style={{ color: editorTextColor }}>Personalización de Diseño</legend>

              <fieldset className="mt-3 p-3 border rounded">
                <legend style={{ color: editorTextColor, fontSize: '0.9rem' }}>Colores de la Tarjeta</legend>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: editorTextColor }}>Color de Fondo de la Tarjeta</Form.Label>
                  <Form.Control 
                    type="color" 
                    value={(() => {
                      if (cardBackgroundColor.startsWith('#')) return cardBackgroundColor;
                      if (cardBackgroundColor.includes('gradient') || cardBackgroundColor.startsWith('rgba')) {
                        const match = cardBackgroundColor.match(/#[0-9a-fA-F]{6}/);
                        return match ? match[0] : '#2c2c2c';
                      }
                      return '#2c2c2c';
                    })()} 
                    onChange={(e) => setCardBackgroundColor(e.target.value)} 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: editorTextColor }}>Color del Texto de la Tarjeta</Form.Label>
                  <Form.Control 
                    type="color" 
                    value={(() => {
                      if (cardTextColor.startsWith('#')) return cardTextColor;
                      if (cardTextColor.includes('gradient') || cardTextColor.startsWith('rgba') || cardTextColor.startsWith('rgb')) {
                        const match = cardTextColor.match(/#[0-9a-fA-F]{6}/);
                        return match ? match[0] : '#ffffff';
                      }
                      return '#ffffff';
                    })()} 
                    onChange={(e) => setCardTextColor(e.target.value)} 
                  />
                </Form.Group>
              </fieldset>

              <fieldset className="mt-3 p-3 border rounded">
                <legend style={{ color: editorTextColor, fontSize: '0.9rem' }}>Colores de Botones</legend>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: editorTextColor }}>Color Secundario de Botón</Form.Label>
                  <Form.Control 
                    type="color" 
                    value={(() => {
                      if (buttonSecondaryColor.startsWith('#')) return buttonSecondaryColor;
                      if (buttonSecondaryColor.includes('gradient') || buttonSecondaryColor.startsWith('rgba')) {
                        const match = buttonSecondaryColor.match(/#[0-9a-fA-F]{6}/);
                        return match ? match[0] : '#00F6FF';
                      }
                      return '#00F6FF';
                    })()} 
                    onChange={(e) => setButtonSecondaryColor(e.target.value)} 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: editorTextColor }}>Color de Fondo de Botón (Normal)</Form.Label>
                  <Form.Control 
                    type="color" 
                    value={(() => {
                      if (buttonNormalBackgroundColor.startsWith('#')) return buttonNormalBackgroundColor;
                      if (buttonNormalBackgroundColor.includes('gradient') || buttonNormalBackgroundColor.startsWith('rgba')) {
                        const match = buttonNormalBackgroundColor.match(/#[0-9a-fA-F]{6}/);
                        return match ? match[0] : '#1F1F1F';
                      }
                      return '#1F1F1F';
                    })()} 
                    onChange={(e) => setButtonNormalBackgroundColor(e.target.value)} 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: editorTextColor }}>Color Hover Secundario de Botón</Form.Label>
                  <Form.Control 
                    type="color" 
                    value={(() => {
                      if (buttonSecondaryHoverColor.startsWith('#')) return buttonSecondaryHoverColor;
                      if (buttonSecondaryHoverColor.includes('gradient') || buttonSecondaryHoverColor.startsWith('rgba')) {
                        const match = buttonSecondaryHoverColor.match(/#[0-9a-fA-F]{6}/);
                        return match ? match[0] : '#00D1DB';
                      }
                      return '#00D1DB';
                    })()} 
                    onChange={(e) => setButtonSecondaryHoverColor(e.target.value)} 
                  />
                </Form.Group>
              </fieldset>

              <fieldset className="mt-3 p-3 border rounded">
                <legend style={{ color: editorTextColor, fontSize: '0.9rem' }}>Efectos Visuales (Premium)</legend>
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox" 
                    id="hover-effect-toggle" 
                    label="Activar Efecto Hover" 
                    checked={enableHoverEffect} 
                    onChange={(e) => setEnableHoverEffect(e.target.checked)} 
                    style={{ color: editorTextColor }} 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox" 
                    id="glassmorphism-toggle" 
                    label="Activar Glassmorphism" 
                    checked={enableGlassmorphism} 
                    onChange={(e) => setEnableGlassmorphism(e.target.checked)} 
                    style={{ color: editorTextColor }} 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox" 
                    id="subtle-animations-toggle" 
                    label="Activar Animaciones Sutiles" 
                    checked={enableSubtleAnimations} 
                    onChange={(e) => setEnableSubtleAnimations(e.target.checked)} 
                    style={{ color: editorTextColor }} 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox" 
                    id="background-patterns-toggle" 
                    label="Activar Patrones de Fondo" 
                    checked={enableBackgroundPatterns} 
                    onChange={(e) => setEnableBackgroundPatterns(e.target.checked)} 
                    style={{ color: editorTextColor }} 
                  />
                </Form.Group>
              </fieldset>

              <fieldset className="mt-3 p-3 border rounded">
                <legend style={{ color: editorTextColor, fontSize: '0.9rem' }}>Diseño Minimalista con IA (Premium)</legend>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="ai-palette-toggle"
                    label="Activar Paletas de Diseño Minimalista"
                    checked={enableAIPalette}
                    onChange={(e) => {
                      const isEnabled = e.target.checked;
                      setEnableAIPalette(isEnabled);
                      if (isEnabled) {
                        applyPalette(minimalistPalettes[currentPaletteIndex]);
                      } else {
                        setPageBackgroundColor('#121212');
                        setCardBackgroundColor('#1F1F1F');
                        setCardTextColor('#EAEAEA');
                        setButtonSecondaryColor('#00F6FF');
                        setButtonNormalBackgroundColor('#1F1F1F');
                        setButtonSecondaryHoverColor('#00D1DB');
                      }
                    }}
                    style={{ color: editorTextColor }} 
                  />
                </Form.Group>
                {enableAIPalette && (
                  <div className="d-grid gap-2">
                    <Button variant="outline-light" onClick={generateNextPalette} style={{ color: buttonTextColor }}>
                      Generar Siguiente Paleta ({minimalistPalettes[currentPaletteIndex].name})
                    </Button>
                  </div>
                )}
              </fieldset>

              <fieldset className="mt-3 p-3 border rounded">
                <legend style={{ color: editorTextColor, fontSize: '0.9rem' }}>Plantillas Visuales (Premium)</legend>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: editorTextColor }}>Seleccionar Plantilla</Form.Label>
                  <Form.Select 
                    value={selectedTemplate} 
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: editorTextColor, border: `1px solid ${editorTextColor}33` }}
                  >
                    <option value="modern" style={{ backgroundColor: '#2c2c2c', color: '#ffffff' }}>Modern - Diseño limpio y profesional</option>
                    <option value="elegant" style={{ backgroundColor: '#2c2c2c', color: '#ffffff' }}>Elegant - Estilo sofisticado y minimalista</option>
                    <option value="creative" style={{ backgroundColor: '#2c2c2c', color: '#ffffff' }}>Creative - Gradientes y efectos vibrantes</option>
                    <option value="classic" style={{ backgroundColor: '#2c2c2c', color: '#ffffff' }}>Classic - Diseño tradicional y formal</option>
                  </Form.Select>
                  <Form.Text style={{ color: `${editorTextColor}CC`, fontSize: '0.85rem' }}>
                    {selectedTemplate === 'modern' && '✨ Perfecto para profesionales de tecnología y negocios'}
                    {selectedTemplate === 'elegant' && '🎩 Ideal para abogados, consultores y ejecutivos'}
                    {selectedTemplate === 'creative' && '🎨 Excelente para diseñadores, artistas y creativos'}
                    {selectedTemplate === 'classic' && '📚 Adecuado para académicos, médicos y profesionales tradicionales'}
                  </Form.Text>
                </Form.Group>
              </fieldset>

            </fieldset>
          </Form>
        </Col>
        <Col md={6} className="p-4">
          <div style={{ position: 'sticky', top: '20px' }}>
            <BusinessCard
              name={name}
              title={title}
              about={about}
              location={location}
              whatsapp={whatsapp}
              email={email}
              photoUrl={photoUrl}
              cardBackgroundColor={cardBackgroundColor}
              cardTextColor={cardTextColor}
              pageBackgroundColor={pageBackgroundColor}
              enableHoverEffect={enableHoverEffect}
              enableGlassmorphism={enableGlassmorphism}
              enableSubtleAnimations={enableSubtleAnimations}
              enableBackgroundPatterns={enableBackgroundPatterns}
              enableParticles={enableParticles}
              particleType={particleType}
              particleDensity={particleDensity}
              particleColor="auto"
              whatsappShareUrl={whatsappShareUrl}
              appointmentLink={appointmentLink}
              professionalDetails={professionalDetails}
              linkedin={linkedin}
              instagram={instagram}
              twitter={twitter}
              facebook={facebook}
              website={''}
              buttonSecondaryColor={buttonSecondaryColor}
              buttonNormalBackgroundColor={buttonNormalBackgroundColor}
              buttonSecondaryHoverColor={buttonSecondaryHoverColor}
              template={selectedTemplate} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
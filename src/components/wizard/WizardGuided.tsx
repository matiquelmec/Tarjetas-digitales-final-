'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import WizardLayout from './WizardLayout';
import LivePreview from './LivePreview';
import { useWizardState } from '@/hooks/useWizardState';
import { useSmartSuggestions } from '@/hooks/useSmartSuggestions';
import { WizardCardPreview, ThemeOption } from '@/types/wizard';

const WizardGuided: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const {
    currentStep,
    userData,
    errors,
    isLoading,
    progress,
    updateUserData,
    nextStep,
    prevStep,
    validateCurrentStep,
    loadFromSession,
    canProceed,
    isFirstStep,
    isLastStep
  } = useWizardState();

  const {
    userProfile,
    suggestions,
    updateProfileAndSuggestions,
    applySuggestion,
    getSuggestionsByPriority,
    hasHighPrioritySuggestions
  } = useSmartSuggestions();

  // Cargar datos de sesión al inicializar
  useEffect(() => {
    if (session?.user) {
      loadFromSession(session);
    }
  }, [session, loadFromSession]);

  // Actualizar perfil cuando cambia jobTitle
  useEffect(() => {
    if (userData.jobTitle) {
      updateProfileAndSuggestions(userData);
    }
  }, [userData.jobTitle, updateProfileAndSuggestions]);

  // Temas disponibles
  const themes: ThemeOption[] = [
    {
      id: 'stellar',
      name: 'Estelar',
      preview: 'linear-gradient(135deg, #0f0c29, #302b63)',
      colors: { primary: '#00f6ff', secondary: '#0072ff', background: '#0f0c29', text: '#ffffff' },
      effects: ['glassmorphism', 'particles']
    },
    {
      id: 'professional',
      name: 'Profesional',
      preview: 'linear-gradient(135deg, #2c3e50, #34495e)',
      colors: { primary: '#3498db', secondary: '#2980b9', background: '#2c3e50', text: '#ffffff' },
      effects: ['glass']
    },
    {
      id: 'elegant',
      name: 'Elegante',
      preview: 'linear-gradient(135deg, #667eea, #764ba2)',
      colors: { primary: '#8e2de2', secondary: '#4a00e0', background: '#667eea', text: '#ffffff' },
      effects: ['gradient', 'glow']
    },
    {
      id: 'nature',
      name: 'Naturaleza',
      preview: 'linear-gradient(135deg, #11998e, #38ef7d)',
      colors: { primary: '#00d2ff', secondary: '#3a7bd5', background: '#11998e', text: '#ffffff' },
      effects: ['organic']
    },
    {
      id: 'sunset',
      name: 'Atardecer',
      preview: 'linear-gradient(135deg, #f093fb, #f5576c)',
      colors: { primary: '#ff6b6b', secondary: '#ee5a52', background: '#f093fb', text: '#ffffff' },
      effects: ['warm', 'soft']
    }
  ];

  // Crear tarjeta final
  const handleCreateCard = async () => {
    if (!validateCurrentStep()) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      const cardData = {
        name: userData.fullName,
        profession: userData.jobTitle,
        phone: userData.phoneNumber,
        email: userData.email,
        about: userData.bio || '',
        website: userData.socialLinks?.website || '',
        linkedin: userData.socialLinks?.linkedin || '',
        instagram: userData.socialLinks?.instagram || '',
        twitter: userData.socialLinks?.twitter || '',
        theme: userData.selectedTheme,
        effectsEnabled: true,
        primaryColor: themes.find(t => t.id === userData.selectedTheme)?.colors.primary || '#00f6ff',
        backgroundColor: themes.find(t => t.id === userData.selectedTheme)?.colors.background || '#0f0c29'
      };

      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData)
      });

      if (!response.ok) {
        throw new Error('Error creando la tarjeta');
      }

      const result = await response.json();
      
      // Limpiar draft guardado
      localStorage.removeItem('wizard-draft');
      
      // Redirigir al dashboard con mensaje de éxito
      sessionStorage.setItem('wizard-success', 'true');
      router.push('/dashboard');

    } catch (error) {
      console.error('Error creating card:', error);
      setCreateError('Hubo un error creando tu tarjeta. Por favor intenta de nuevo.');
    } finally {
      setIsCreating(false);
    }
  };

  // Datos para el preview
  const previewData: WizardCardPreview = {
    id: 'preview',
    name: userData.fullName,
    jobTitle: userData.jobTitle,
    phone: userData.phoneNumber,
    email: userData.email,
    bio: userData.bio,
    website: userData.socialLinks?.website,
    linkedin: userData.socialLinks?.linkedin,
    instagram: userData.socialLinks?.instagram,
    twitter: userData.socialLinks?.twitter,
    theme: userData.selectedTheme
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepBasicInfo />;
      case 1:
        return <StepPersonalization />;
      case 2:
        return <StepFinalization />;
      default:
        return null;
    }
  };

  // Componente Step 1: Información Básica
  const StepBasicInfo = () => (
    <Row className="align-items-center min-vh-75">
      <Col lg={6} className="mb-4">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(15px)', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            color: 'white'
          }}>
            <Card.Body className="p-4">
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <motion.div
                  style={{ fontSize: '3rem', marginBottom: '1rem' }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🎯
                </motion.div>
                <h3 style={{ 
                  background: 'linear-gradient(135deg, #00f6ff, #0072ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700
                }}>
                  ¡Hablemos de ti!
                </h3>
                <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>
                  Necesitamos algunos datos básicos para crear tu tarjeta perfecta
                </p>
              </div>

              <Form>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label style={{ color: 'white', fontWeight: 600 }}>
                      Nombre Completo *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={userData.fullName}
                      onChange={(e) => updateUserData({ fullName: e.target.value })}
                      placeholder="Tu nombre completo"
                      isInvalid={!!errors.fullName}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '10px',
                        color: 'white',
                        padding: '0.75rem'
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.fullName}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label style={{ color: 'white', fontWeight: 600 }}>
                      Tu Profesión/Título *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={userData.jobTitle}
                      onChange={(e) => updateUserData({ jobTitle: e.target.value })}
                      placeholder="Ej: Marketing Digital Specialist"
                      isInvalid={!!errors.jobTitle}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '10px',
                        color: 'white',
                        padding: '0.75rem'
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.jobTitle}
                    </Form.Control.Feedback>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label style={{ color: 'white', fontWeight: 600 }}>
                      WhatsApp/Teléfono *
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      value={userData.phoneNumber}
                      onChange={(e) => updateUserData({ phoneNumber: e.target.value })}
                      placeholder="+56 9 1234 5678"
                      isInvalid={!!errors.phoneNumber}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '10px',
                        color: 'white',
                        padding: '0.75rem'
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phoneNumber}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label style={{ color: 'white', fontWeight: 600 }}>
                      Email Principal *
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={userData.email}
                      onChange={(e) => updateUserData({ email: e.target.value })}
                      placeholder="tu@email.com"
                      isInvalid={!!errors.email}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '10px',
                        color: 'white',
                        padding: '0.75rem'
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Col>
                </Row>

                {/* Detección de perfil */}
                {userProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: 'rgba(0, 246, 255, 0.1)',
                      border: '1px solid rgba(0, 246, 255, 0.3)',
                      borderRadius: '10px',
                      padding: '1rem',
                      marginTop: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🤖</span>
                      <div>
                        <div style={{ fontWeight: 600, color: '#00f6ff' }}>
                          Perfil detectado: {userProfile.type === 'entrepreneur' ? 'Emprendedor' : 
                                           userProfile.type === 'employee' ? 'Empleado' :
                                           userProfile.type === 'freelancer' ? 'Freelancer' : 'Estudiante'}
                        </div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                          Preparando sugerencias personalizadas...
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </motion.div>
      </Col>

      <Col lg={6}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LivePreview userData={previewData} isInteractive={false} />
        </motion.div>
      </Col>
    </Row>
  );

  // Componente Step 2: Personalización
  const StepPersonalization = () => (
    <Row className="align-items-start min-vh-75">
      <Col lg={6} className="mb-4">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(15px)', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            color: 'white'
          }}>
            <Card.Body className="p-4">
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
                <h3 style={{ 
                  background: 'linear-gradient(135deg, #00f6ff, #0072ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700
                }}>
                  ¡Dale tu toque personal!
                </h3>
                <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>
                  Elige el estilo que mejor te represente
                </p>
              </div>

              {/* Selector de temas */}
              <div className="mb-4">
                <Form.Label style={{ color: 'white', fontWeight: 600, marginBottom: '1rem' }}>
                  Elige tu Estilo Favorito:
                </Form.Label>
                <Row>
                  {themes.map(theme => (
                    <Col key={theme.id} xs={4} className="mb-3">
                      <motion.div
                        style={{
                          height: '80px',
                          background: theme.preview,
                          borderRadius: '12px',
                          border: userData.selectedTheme === theme.id ? '3px solid #00f6ff' : '2px solid rgba(255, 255, 255, 0.2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          textAlign: 'center',
                          transition: 'all 0.3s ease'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateUserData({ selectedTheme: theme.id })}
                      >
                        {theme.name}
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </div>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'white', fontWeight: 600 }}>
                    Tu Bio/Descripción (Opcional)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={userData.bio}
                    onChange={(e) => updateUserData({ bio: e.target.value })}
                    placeholder="Cuéntanos brevemente sobre ti..."
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '10px',
                      color: 'white',
                      padding: '0.75rem'
                    }}
                  />
                </Form.Group>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label style={{ color: 'white', fontWeight: 600 }}>
                      🌐 Sitio Web
                    </Form.Label>
                    <Form.Control
                      type="url"
                      value={userData.socialLinks?.website || ''}
                      onChange={(e) => updateUserData({ 
                        socialLinks: { ...userData.socialLinks, website: e.target.value }
                      })}
                      placeholder="https://tusitio.com"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '10px',
                        color: 'white',
                        padding: '0.75rem'
                      }}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label style={{ color: 'white', fontWeight: 600 }}>
                      💼 LinkedIn
                    </Form.Label>
                    <Form.Control
                      type="url"
                      value={userData.socialLinks?.linkedin || ''}
                      onChange={(e) => updateUserData({ 
                        socialLinks: { ...userData.socialLinks, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/in/..."
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '10px',
                        color: 'white',
                        padding: '0.75rem'
                      }}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label style={{ color: 'white', fontWeight: 600 }}>
                      📸 Instagram
                    </Form.Label>
                    <Form.Control
                      type="url"
                      value={userData.socialLinks?.instagram || ''}
                      onChange={(e) => updateUserData({ 
                        socialLinks: { ...userData.socialLinks, instagram: e.target.value }
                      })}
                      placeholder="https://instagram.com/..."
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '10px',
                        color: 'white',
                        padding: '0.75rem'
                      }}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label style={{ color: 'white', fontWeight: 600 }}>
                      🐦 Twitter
                    </Form.Label>
                    <Form.Control
                      type="url"
                      value={userData.socialLinks?.twitter || ''}
                      onChange={(e) => updateUserData({ 
                        socialLinks: { ...userData.socialLinks, twitter: e.target.value }
                      })}
                      placeholder="https://twitter.com/..."
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '10px',
                        color: 'white',
                        padding: '0.75rem'
                      }}
                    />
                  </Col>
                </Row>
              </Form>

              {/* Sugerencias inteligentes */}
              {hasHighPrioritySuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(0, 246, 255, 0.1)',
                    border: '1px solid rgba(0, 246, 255, 0.3)',
                    borderRadius: '15px',
                    padding: '1.5rem',
                    marginTop: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>💡</span>
                    <div style={{ fontWeight: 600, color: '#00f6ff' }}>
                      Sugerencias Personalizadas
                    </div>
                  </div>
                  {getSuggestionsByPriority('high').map(suggestion => (
                    <div key={suggestion.id} style={{ marginBottom: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{suggestion.title}</div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                        {suggestion.description}
                      </div>
                      <Button
                        size="sm"
                        style={{
                          background: 'linear-gradient(135deg, #00f6ff, #0072ff)',
                          border: 'none',
                          borderRadius: '8px'
                        }}
                        onClick={() => {
                          const updates = applySuggestion(suggestion.id, userData);
                          updateUserData(updates);
                        }}
                      >
                        ✨ Aplicar Sugerencia
                      </Button>
                    </div>
                  ))}
                </motion.div>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      </Col>

      <Col lg={6}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LivePreview userData={previewData} isInteractive={true} />
        </motion.div>
      </Col>
    </Row>
  );

  // Componente Step 3: Finalización
  const StepFinalization = () => (
    <Row className="justify-content-center min-vh-75">
      <Col lg={8}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(15px)', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            color: 'white',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <Card.Body>
              <motion.div
                style={{ fontSize: '4rem', marginBottom: '1rem' }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎉
              </motion.div>

              <h2 style={{ 
                background: 'linear-gradient(135deg, #00f6ff, #0072ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                marginBottom: '1rem'
              }}>
                ¡Tu tarjeta está lista!
              </h2>

              <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem' }}>
                Hemos preparado una tarjeta digital increíble para ti. 
                Está lista para impresionar y generar nuevas oportunidades.
              </p>

              <div style={{ marginBottom: '2rem' }}>
                <LivePreview userData={previewData} isInteractive={true} />
              </div>

              {createError && (
                <Alert variant="danger" style={{ marginBottom: '1rem' }}>
                  {createError}
                </Alert>
              )}

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={handleCreateCard}
                  disabled={isCreating}
                  style={{
                    background: 'linear-gradient(135deg, #00f6ff, #0072ff)',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '1rem 3rem',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 8px 25px rgba(0, 246, 255, 0.3)'
                  }}
                >
                  {isCreating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creando tu tarjeta...
                    </>
                  ) : (
                    <>
                      🚀 ¡Crear Mi Tarjeta Digital!
                    </>
                  )}
                </Button>
              </motion.div>

              <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.7 }}>
                Podrás editarla, compartirla y ver sus estadísticas desde tu dashboard
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Col>
    </Row>
  );

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={3}
      onExit={() => router.push('/dashboard')}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Botones de navegación */}
      {currentStep < 2 && (
        <motion.div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '3rem',
            padding: '0 2rem'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline-light"
            onClick={prevStep}
            disabled={isFirstStep || isLoading}
            style={{
              borderRadius: '12px',
              padding: '0.75rem 2rem',
              opacity: isFirstStep ? 0.5 : 1
            }}
          >
            ← Atrás
          </Button>

          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
            Paso {currentStep + 1} de 3
          </div>

          <Button
            onClick={nextStep}
            disabled={!canProceed || isLoading}
            style={{
              background: canProceed ? 'linear-gradient(135deg, #00f6ff, #0072ff)' : 'rgba(255, 255, 255, 0.3)',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 2rem',
              fontWeight: 600
            }}
          >
            {isLastStep ? 'Finalizar' : 'Siguiente'} →
          </Button>
        </motion.div>
      )}
    </WizardLayout>
  );
};

export default WizardGuided;
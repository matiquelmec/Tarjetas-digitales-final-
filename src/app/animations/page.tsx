'use client';

import React from 'react';
import Link from 'next/link';
import MicroAnimationsShowcase from '@/components/MicroAnimationsShowcase';

export default function AnimationsPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        body {
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }
      `}} />

      <div style={{ position: 'relative' }}>
        {/* Back button overlay */}
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000
        }}>
          <Link 
            href="/"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '0.8rem 1.5rem',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 246, 255, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(0, 246, 255, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
          >
            ← Inicio
          </Link>
        </div>

        {/* Navigation links */}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          gap: '0.5rem'
        }}>
          <Link 
            href="/demo"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '0.6rem 1rem',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.85rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 246, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
          >
            Demo
          </Link>
          <Link 
            href="/particles"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '0.6rem 1rem',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.85rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 246, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
          >
            Partículas
          </Link>
          <Link 
            href="/glass"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '0.6rem 1rem',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.85rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 246, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
          >
            Glass
          </Link>
        </div>

        {/* Main showcase */}
        <MicroAnimationsShowcase showControls={true} />

        {/* Additional info section */}
        <div style={{
          background: 'linear-gradient(135deg, #0f0c29, #24243e)',
          padding: '4rem 2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '2rem',
              color: '#00f6ff'
            }}>
              Feedback Intuitivo y Accesible
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ color: '#00f6ff', marginBottom: '1rem' }}>✨ Micro-interacciones</h4>
                <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                  Animaciones sutiles que proporcionan feedback inmediato sin distraer, 
                  mejorando la percepción de respuesta del sistema.
                </p>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ color: '#00f6ff', marginBottom: '1rem' }}>♿ Accesibilidad</h4>
                <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                  Respeta automáticamente la configuración "prefers-reduced-motion" 
                  del usuario para una experiencia inclusiva.
                </p>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ color: '#00f6ff', marginBottom: '1rem' }}>⚡ Rendimiento</h4>
                <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                  Optimizado para 60fps usando CSS transforms y opacity, 
                  con fallbacks inteligentes para dispositivos limitados.
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '2rem',
              marginTop: '3rem'
            }}>
              <h3 style={{ color: '#00f6ff', marginBottom: '1.5rem' }}>
                🎯 Implementación en Tarjetas Digitales
              </h3>
              <p style={{ opacity: 0.9, lineHeight: '1.6', marginBottom: '2rem' }}>
                Estas micro-animaciones están integradas en todo nuestro ecosistema de tarjetas digitales, 
                proporcionando una experiencia fluida y profesional que aumenta la confianza del usuario.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖱️</div>
                  <strong>Hover Effects</strong>
                  <br />
                  <small style={{ opacity: 0.7 }}>Buttons, Cards, Links</small>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👆</div>
                  <strong>Click Feedback</strong>
                  <br />
                  <small style={{ opacity: 0.7 }}>Actions, Confirmations</small>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                  <strong>Form Interactions</strong>
                  <br />
                  <small style={{ opacity: 0.7 }}>Focus, Validation</small>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                  <strong>Loading States</strong>
                  <br />
                  <small style={{ opacity: 0.7 }}>Progress, Success</small>
                </div>
              </div>

              <Link 
                href="/demo"
                style={{
                  background: 'linear-gradient(135deg, #00f6ff, #0072ff)',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '700',
                  display: 'inline-block',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 246, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ✨ Experimentar Demo Interactivo
              </Link>
            </div>
          </div>
        </div>

        {/* Technical specs */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          padding: '3rem 2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', color: 'white' }}>
            <h3 style={{ color: '#00f6ff', marginBottom: '2rem' }}>
              🔧 Especificaciones Técnicas
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              textAlign: 'left'
            }}>
              <div>
                <strong style={{ color: '#00f6ff' }}>Triggers Soportados:</strong>
                <ul style={{ marginTop: '0.5rem', opacity: 0.8 }}>
                  <li>Hover / Mouse over</li>
                  <li>Click / Touch</li>
                  <li>Focus / Keyboard navigation</li>
                  <li>Success / Error states</li>
                  <li>Loading / Progress</li>
                  <li>Idle breathing</li>
                </ul>
              </div>
              
              <div>
                <strong style={{ color: '#00f6ff' }}>Configuraciones:</strong>
                <ul style={{ marginTop: '0.5rem', opacity: 0.8 }}>
                  <li>Intensidad global ajustable</li>
                  <li>Duración personalizable</li>
                  <li>Easing curves avanzadas</li>
                  <li>Repetición configurable</li>
                  <li>Delays y direcciones</li>
                  <li>Animaciones custom</li>
                </ul>
              </div>
              
              <div>
                <strong style={{ color: '#00f6ff' }}>Compatibilidad:</strong>
                <ul style={{ marginTop: '0.5rem', opacity: 0.8 }}>
                  <li>Todos los navegadores modernos</li>
                  <li>Mobile & Desktop optimizado</li>
                  <li>Prefers-reduced-motion</li>
                  <li>Progressive enhancement</li>
                  <li>Fallbacks inteligentes</li>
                  <li>TypeScript completo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
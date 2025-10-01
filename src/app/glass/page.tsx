'use client';

import React from 'react';
import Link from 'next/link';
import GlassmorphismShowcase from '@/components/GlassmorphismShowcase';

export default function GlassPage() {
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

        {/* Main showcase */}
        <GlassmorphismShowcase 
          initialPreset="premium"
          showControls={true}
          backgroundColor="#1a1a2e"
          content={
            <div style={{ textAlign: 'center', color: 'white' }}>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '800',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #00f6ff, #0072ff, #4a0e8f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}>
                🔮 Multi-Layer Glassmorphism
              </h1>
              <p style={{
                fontSize: '1.3rem',
                opacity: 0.9,
                marginBottom: '2rem',
                maxWidth: '600px',
                margin: '0 auto 2rem auto',
                lineHeight: '1.6'
              }}>
                Experimenta con efectos de vidrio avanzados que crean profundidad y realismo únicos
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                maxWidth: '800px',
                margin: '0 auto',
                padding: '2rem 0'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌟</div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Múltiples Capas</h4>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Hasta 5 capas de profundidad visual
                  </p>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Efectos Avanzados</h4>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Reflejos, distorsión y cáusticas
                  </p>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎛️</div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Control Total</h4>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Personaliza cada aspecto del efecto
                  </p>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Optimizado</h4>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Adaptación automática para móviles
                  </p>
                </div>
              </div>

              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(0, 246, 255, 0.1)',
                border: '1px solid rgba(0, 246, 255, 0.3)',
                borderRadius: '12px',
                fontSize: '0.9rem',
                opacity: 0.9
              }}>
                💡 <strong>Tip:</strong> Prueba diferentes presets y ajusta la intensidad para ver efectos únicos
              </div>
            </div>
          }
        />

        {/* Additional info section */}
        <div style={{
          background: 'linear-gradient(135deg, #0f0c29, #24243e)',
          padding: '4rem 2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '2rem',
              color: '#00f6ff'
            }}>
              Tecnología de Vanguardia
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              <div>
                <h4 style={{ color: '#00f6ff', marginBottom: '1rem' }}>🔬 Motor de Renderizado</h4>
                <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                  Sistema avanzado de CSS con múltiples pseudo-elementos y efectos de mezcla 
                  para crear profundidad visual realista.
                </p>
              </div>
              
              <div>
                <h4 style={{ color: '#00f6ff', marginBottom: '1rem' }}>🎨 Física de Materiales</h4>
                <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                  Simulación de propiedades del vidrio incluyendo refracción, 
                  reflexión y dispersión de luz.
                </p>
              </div>
              
              <div>
                <h4 style={{ color: '#00f6ff', marginBottom: '1rem' }}>⚡ Optimización Inteligente</h4>
                <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                  Detección automática de dispositivo y ajuste de calidad 
                  para mantener 60fps en todos los dispositivos.
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
              <h3 style={{ color: '#00f6ff', marginBottom: '1rem' }}>
                🚀 Implementación en Tarjetas Digitales
              </h3>
              <p style={{ opacity: 0.9, lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Este sistema de glassmorphism multicapa está integrado en nuestras tarjetas digitales, 
                proporcionando una experiencia visual premium que diferencia tu presencia profesional.
              </p>
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
                ✨ Ver Demo de Tarjeta Digital
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
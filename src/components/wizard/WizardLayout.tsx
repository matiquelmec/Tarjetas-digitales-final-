'use client';

import React from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';

interface WizardLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onExit?: () => void;
}

const WizardLayout: React.FC<WizardLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  onExit
}) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .wizard-container {
          min-height: 100vh;
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          position: relative;
          overflow-x: hidden;
        }
        
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .wizard-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(15, 12, 41, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .wizard-progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .wizard-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00f6ff, #0072ff);
          box-shadow: 0 0 10px rgba(0, 246, 255, 0.5);
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .wizard-main {
          padding: 2rem 0;
          position: relative;
        }
        
        .wizard-step-indicator {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .step-indicator {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .step-number.active {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          color: white;
          box-shadow: 0 4px 15px rgba(0, 246, 255, 0.3);
        }
        
        .step-number.completed {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
        }
        
        .step-number.pending {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .step-label {
          color: white;
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .step-label.active {
          color: #00f6ff;
        }
        
        .step-connector {
          width: 60px;
          height: 2px;
          background: rgba(255, 255, 255, 0.2);
          position: relative;
        }
        
        .step-connector.completed {
          background: linear-gradient(90deg, #28a745, #20c997);
        }
        
        .wizard-exit-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 110;
        }
        
        .wizard-exit-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transform: scale(1.1);
        }
        
        .wizard-content {
          position: relative;
          z-index: 1;
        }
        
        /* Efectos de fondo sutil */
        .wizard-bg-effects {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }
        
        .floating-element {
          position: absolute;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .wizard-step-indicator {
            gap: 1rem;
            margin-bottom: 1.5rem;
          }
          
          .step-connector {
            width: 30px;
          }
          
          .step-label {
            font-size: 0.8rem;
          }
          
          .wizard-main {
            padding: 1rem 0;
          }
        }
        
        @media (max-width: 576px) {
          .wizard-step-indicator {
            flex-direction: column;
            gap: 1rem;
          }
          
          .step-connector {
            width: 2px;
            height: 30px;
            transform: rotate(90deg);
          }
          
          .step-indicator {
            flex-direction: column;
            text-align: center;
          }
        }
      `}} />

      <div className="wizard-container">
        {/* Header con progreso */}
        <div className="wizard-header">
          <div className="wizard-progress-bar">
            <motion.div
              className="wizard-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Botón de salida */}
        {onExit && (
          <button className="wizard-exit-btn" onClick={onExit} title="Salir del wizard">
            ✕
          </button>
        )}

        {/* Efectos de fondo */}
        <div className="wizard-bg-effects">
          <div className="floating-element" style={{ top: '10%', left: '10%', fontSize: '2rem' }}>
            ✨
          </div>
          <div className="floating-element" style={{ top: '20%', right: '15%', fontSize: '1.5rem', animationDelay: '2s' }}>
            💫
          </div>
          <div className="floating-element" style={{ bottom: '20%', left: '20%', fontSize: '1.8rem', animationDelay: '4s' }}>
            🌟
          </div>
          <div className="floating-element" style={{ bottom: '10%', right: '10%', fontSize: '1.3rem', animationDelay: '3s' }}>
            ✨
          </div>
        </div>

        <Container className="wizard-main">
          {/* Indicador de pasos */}
          <div className="wizard-step-indicator">
            <div className="step-indicator">
              <div className={`step-number ${currentStep >= 0 ? (currentStep === 0 ? 'active' : 'completed') : 'pending'}`}>
                {currentStep > 0 ? '✓' : '1'}
              </div>
              <div className={`step-label ${currentStep === 0 ? 'active' : ''}`}>
                Información
              </div>
            </div>

            <div className={`step-connector ${currentStep > 0 ? 'completed' : ''}`} />

            <div className="step-indicator">
              <div className={`step-number ${currentStep >= 1 ? (currentStep === 1 ? 'active' : 'completed') : 'pending'}`}>
                {currentStep > 1 ? '✓' : '2'}
              </div>
              <div className={`step-label ${currentStep === 1 ? 'active' : ''}`}>
                Personalización
              </div>
            </div>

            <div className={`step-connector ${currentStep > 1 ? 'completed' : ''}`} />

            <div className="step-indicator">
              <div className={`step-number ${currentStep >= 2 ? 'active' : 'pending'}`}>
                {currentStep > 2 ? '✓' : '3'}
              </div>
              <div className={`step-label ${currentStep === 2 ? 'active' : ''}`}>
                Finalizar
              </div>
            </div>
          </div>

          {/* Contenido del wizard */}
          <div className="wizard-content">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              {children}
            </motion.div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default WizardLayout;
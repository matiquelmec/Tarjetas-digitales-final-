'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { WizardCardPreview } from '@/types/wizard';

interface LivePreviewProps {
  userData: WizardCardPreview;
  className?: string;
  isInteractive?: boolean;
  showEffects?: boolean;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  userData,
  className = '',
  isInteractive = false,
  showEffects = true
}) => {
  // Temas disponibles con configuraciones
  const themes = {
    stellar: {
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      primaryColor: '#00f6ff',
      secondaryColor: '#0072ff',
      textColor: '#ffffff',
      glassEffect: 'rgba(255, 255, 255, 0.1)'
    },
    professional: {
      background: 'linear-gradient(135deg, #2c3e50, #34495e)',
      primaryColor: '#3498db',
      secondaryColor: '#2980b9',
      textColor: '#ffffff',
      glassEffect: 'rgba(255, 255, 255, 0.15)'
    },
    elegant: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      primaryColor: '#8e2de2',
      secondaryColor: '#4a00e0',
      textColor: '#ffffff',
      glassEffect: 'rgba(255, 255, 255, 0.12)'
    },
    nature: {
      background: 'linear-gradient(135deg, #11998e, #38ef7d)',
      primaryColor: '#00d2ff',
      secondaryColor: '#3a7bd5',
      textColor: '#ffffff',
      glassEffect: 'rgba(255, 255, 255, 0.2)'
    },
    sunset: {
      background: 'linear-gradient(135deg, #f093fb, #f5576c)',
      primaryColor: '#ff6b6b',
      secondaryColor: '#ee5a52',
      textColor: '#ffffff',
      glassEffect: 'rgba(255, 255, 255, 0.18)'
    }
  };

  const currentTheme = themes[userData.theme as keyof typeof themes] || themes.stellar;

  // Generar datos de muestra si están vacíos
  const previewData = useMemo(() => ({
    name: userData.name || 'Tu Nombre',
    jobTitle: userData.jobTitle || 'Tu Profesión',
    phone: userData.phone || '+56 9 XXXX XXXX',
    email: userData.email || 'tu@email.com',
    bio: userData.bio || 'Una descripción breve sobre ti...',
    website: userData.website,
    linkedin: userData.linkedin,
    instagram: userData.instagram,
    twitter: userData.twitter
  }), [userData]);

  const socialLinks = [
    { key: 'phone', value: previewData.phone, icon: '📱', label: 'WhatsApp' },
    { key: 'email', value: previewData.email, icon: '✉️', label: 'Email' },
    { key: 'website', value: previewData.website, icon: '🌐', label: 'Sitio Web' },
    { key: 'linkedin', value: previewData.linkedin, icon: '💼', label: 'LinkedIn' },
    { key: 'instagram', value: previewData.instagram, icon: '📸', label: 'Instagram' },
    { key: 'twitter', value: previewData.twitter, icon: '🐦', label: 'Twitter' }
  ].filter(link => link.value);

  return (
    <div className={`live-preview-container ${className}`}>
      <style jsx>{`
        .live-preview-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          perspective: 1000px;
        }
        
        .preview-card {
          width: 100%;
          max-width: 400px;
          min-height: 500px;
          background: ${currentTheme.glassEffect};
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .preview-card:hover {
          transform: ${isInteractive ? 'translateY(-5px) rotateX(5deg)' : 'none'};
          box-shadow: 0 12px 48px rgba(31, 38, 135, 0.5);
        }
        
        .card-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${currentTheme.background};
          opacity: 0.3;
          border-radius: 20px;
        }
        
        .card-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: ${currentTheme.textColor};
        }
        
        .profile-section {
          margin-bottom: 2rem;
        }
        
        .profile-image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: ${currentTheme.primaryColor};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1rem;
          box-shadow: 0 4px 15px ${currentTheme.primaryColor}30;
        }
        
        .profile-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .profile-title {
          font-size: 1rem;
          opacity: 0.9;
          margin-bottom: 1rem;
        }
        
        .profile-bio {
          font-size: 0.9rem;
          opacity: 0.8;
          line-height: 1.5;
          margin-bottom: 2rem;
          padding: 0 1rem;
        }
        
        .social-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
        }
        
        .social-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: ${currentTheme.glassEffect};
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          transition: all 0.3s ease;
          cursor: ${isInteractive ? 'pointer' : 'default'};
          min-width: 100px;
          justify-content: center;
        }
        
        .social-link:hover {
          background: ${isInteractive ? `${currentTheme.primaryColor}20` : currentTheme.glassEffect};
          border-color: ${isInteractive ? currentTheme.primaryColor : 'rgba(255, 255, 255, 0.2)'};
          transform: ${isInteractive ? 'translateY(-2px)' : 'none'};
        }
        
        .preview-label {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: ${currentTheme.primaryColor};
          color: white;
          padding: 0.25rem 1rem;
          border-radius: 15px;
          font-size: 0.7rem;
          font-weight: 600;
          box-shadow: 0 4px 15px ${currentTheme.primaryColor}30;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          opacity: 0.6;
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .empty-text {
          font-size: 0.9rem;
          text-align: center;
        }
        
        /* Efectos de partículas */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: ${currentTheme.primaryColor};
          border-radius: 50%;
          opacity: 0.6;
          animation: float-particle 4s linear infinite;
        }
        
        @keyframes float-particle {
          0% {
            transform: translateY(100px) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
            transform: scale(1);
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
          }
        }
        
        /* Responsive */
        @media (max-width: 576px) {
          .preview-card {
            max-width: 320px;
            padding: 1.5rem;
            min-height: 450px;
          }
          
          .profile-name {
            font-size: 1.3rem;
          }
          
          .social-links {
            gap: 0.5rem;
          }
          
          .social-link {
            padding: 0.4rem 0.8rem;
            font-size: 0.75rem;
            min-width: 80px;
          }
        }
      `}</style>

      <motion.div
        className="preview-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="preview-label">Vista Previa ✨</div>
        <div className="card-background" />
        
        {showEffects && (
          <>
            <div className="particle" style={{ top: '20%', left: '10%', animationDelay: '0s' }} />
            <div className="particle" style={{ top: '40%', right: '15%', animationDelay: '2s' }} />
            <div className="particle" style={{ bottom: '30%', left: '20%', animationDelay: '4s' }} />
          </>
        )}

        <div className="card-content">
          {previewData.name || previewData.jobTitle ? (
            <>
              <div className="profile-section">
                <motion.div
                  className="profile-image"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {previewData.name ? previewData.name.charAt(0).toUpperCase() : '👤'}
                </motion.div>
                
                <motion.div
                  className="profile-name"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {previewData.name}
                </motion.div>
                
                <motion.div
                  className="profile-title"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {previewData.jobTitle}
                </motion.div>

                {previewData.bio !== 'Una descripción breve sobre ti...' && previewData.bio && (
                  <motion.div
                    className="profile-bio"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {previewData.bio}
                  </motion.div>
                )}
              </div>

              <motion.div
                className="social-links"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {socialLinks.map((link, index) => (
                  <motion.div
                    key={link.key}
                    className="social-link"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🆔</div>
              <div className="empty-text">
                Tu tarjeta aparecerá aquí<br />
                mientras completas los datos
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LivePreview;
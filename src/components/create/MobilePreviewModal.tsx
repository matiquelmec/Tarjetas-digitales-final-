'use client';

import { useState, useEffect } from 'react';
import HologramPreview from '@/components/HologramPreview';
import BusinessCard from '@/features/digital-card/components/BusinessCard';

interface MobilePreviewModalProps {
  cardData: any;
  onClose: () => void;
}

export function MobilePreviewModal({ cardData, onClose }: MobilePreviewModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('🔍 Modal cardData:', cardData);
    console.log('🔍 CardData type:', typeof cardData);
    console.log('🔍 CardData keys:', cardData ? Object.keys(cardData) : 'No keys - cardData is null/undefined');
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [cardData]);

  if (!mounted) return null;
  
  if (!cardData) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content">
          <div className="modal-header">
            <h4>Error</h4>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <p style={{ color: 'white' }}>No hay datos de tarjeta disponibles</p>
          </div>
        </div>
        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .modal-content {
            background: #333;
            border-radius: 16px;
            padding: 20px;
          }
          .modal-header {
            color: white;
            margin-bottom: 10px;
          }
          .close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Vista Previa</h4>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <HologramPreview
            title="🔮 Vista Previa Completa"
            subtitle="Tu Tarjeta Digital"
            pageBackgroundColor={cardData.pageBackgroundColor}
            showScanlines={false}
            mode="enhanced"
            height="70vh"
          >
            <BusinessCard
              name={cardData.name || 'Tu Nombre'}
              title={cardData.title || 'Tu Profesión'}
              about={cardData.about || ''}
              location={cardData.location || ''}
              whatsapp={cardData.whatsapp || cardData.phone || ''}
              email={cardData.email || ''}
              photoUrl={cardData.photo || ''}
              cardBackgroundColor={cardData.cardBackgroundColor || '#1F1F1F'}
              cardTextColor={cardData.cardTextColor || '#EAEAEA'}
              pageBackgroundColor={cardData.pageBackgroundColor || '#121212'}
              buttonSecondaryColor={cardData.buttonSecondaryColor || '#00F6FF'}
              buttonNormalBackgroundColor={cardData.buttonNormalBackgroundColor || '#1F1F1F'}
              buttonSecondaryHoverColor={cardData.buttonSecondaryHoverColor || '#00D1DB'}
              fontFamily={cardData.fontFamily || 'Inter'}
              appointmentLink={cardData.appointmentLink || cardData.website || ''}
              professionalDetails={cardData.professionalDetails || ''}
              linkedin={cardData.linkedin || ''}
              instagram={cardData.instagram || ''}
              twitter={cardData.twitter || ''}
              facebook={cardData.facebook || ''}
              website={cardData.website || ''}
              template={cardData.template || 'modern'}
              enableHoverEffect={false}
              enableGlassmorphism={false}
              enableSubtleAnimations={false}
              enableBackgroundPatterns={false}
              enableParticles={false}
              enableAnimatedGradient={false}
              enableFloatingShapes={false}
              whatsappShareUrl={`https://wa.me/${cardData.whatsapp || cardData.phone || ''}?text=Hola, vi tu tarjeta digital`}
            />
          </HologramPreview>
        </div>

        <div className="modal-footer">
          <button className="continue-btn" onClick={onClose}>
            ✏️ Continuar Editando
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 95%;
          max-width: 500px;
          max-height: 95vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h4 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .modal-body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 300px;
        }

        .modal-footer {
          background: #f8f9fa;
          padding: 16px 20px;
          border-top: 1px solid #dee2e6;
          display: flex;
          justify-content: center;
        }

        .continue-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .continue-btn:hover {
          background: #0056b3;
        }

        @media (max-width: 480px) {
          .modal-overlay {
            padding: 10px;
          }
          
          .modal-content {
            max-height: 95vh;
          }
          
          .modal-body {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}
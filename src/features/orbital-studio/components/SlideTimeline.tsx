/**
 * Timeline de Slides - Navegación horizontal en la parte inferior
 */

'use client';

import React from 'react';
import { Button } from 'react-bootstrap';
import { Slide } from '../types/orbital';

interface SlideTimelineProps {
  slides: Slide[];
  currentSlideId: string;
  onSlideChange: (slideId: string) => void;
  onAddSlide: () => void;
}

const SlideTimeline: React.FC<SlideTimelineProps> = ({
  slides,
  currentSlideId,
  onSlideChange,
  onAddSlide
}) => {
  return (
    <div className="slide-timeline">
      <style jsx>{`
        .slide-timeline {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1001;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 12px 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .timeline-container {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 600px;
          overflow-x: auto;
        }
        
        .slide-thumbnail {
          min-width: 60px;
          height: 40px;
          border-radius: 8px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .slide-thumbnail.active {
          border-color: #00f6ff;
          box-shadow: 0 0 20px rgba(0, 246, 255, 0.5);
          transform: scale(1.1);
        }
        
        .slide-thumbnail:hover {
          transform: scale(1.05);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .add-slide-btn {
          min-width: 60px;
          height: 40px;
          border-radius: 8px;
          border: 2px dashed rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        
        .add-slide-btn:hover {
          border-color: #00f6ff;
          background: rgba(0, 246, 255, 0.1);
          transform: scale(1.05);
        }
        
        .slide-number {
          position: absolute;
          top: 2px;
          left: 4px;
          font-size: 0.6rem;
          opacity: 0.8;
        }
      `}</style>

      <div className="timeline-container">
        {/* Slides existentes */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide-thumbnail ${slide.id === currentSlideId ? 'active' : ''}`}
            style={{ 
              background: slide.backgroundColor,
              color: slide.textColor 
            }}
            onClick={() => onSlideChange(slide.id)}
            title={slide.title}
          >
            <div className="slide-number">{index + 1}</div>
            <div style={{ fontSize: '0.6rem', textAlign: 'center' }}>
              {slide.title.substring(0, 8)}...
            </div>
          </div>
        ))}
        
        {/* Botón agregar slide */}
        <div
          className="add-slide-btn"
          onClick={onAddSlide}
          title="Agregar nuevo slide"
        >
          +
        </div>
        
        {/* Contador de slides */}
        <div style={{ 
          color: 'white', 
          fontSize: '0.8rem', 
          opacity: 0.7,
          marginLeft: '8px',
          whiteSpace: 'nowrap'
        }}>
          {slides.length} slide{slides.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default SlideTimeline;
'use client';

import React, { useState } from 'react';
import { Card, Button, Row, Col, Form, Badge } from 'react-bootstrap';
import { useMultiLayerGlass } from '@/hooks/useMultiLayerGlass';

interface GlassmorphismShowcaseProps {
  initialPreset?: 'minimal' | 'standard' | 'premium' | 'extreme';
  showControls?: boolean;
  backgroundColor?: string;
  content?: React.ReactNode;
}

export default function GlassmorphismShowcase({
  initialPreset = 'standard',
  showControls = true,
  backgroundColor = '#1a1a2e',
  content
}: GlassmorphismShowcaseProps) {
  const [selectedPreset, setSelectedPreset] = useState(initialPreset);
  
  const {
    glassCSS,
    glassClasses,
    isActive,
    stats,
    controls
  } = useMultiLayerGlass({
    enabled: true,
    preset: selectedPreset,
    baseColor: '#ffffff',
    intensity: 1,
    enableReflections: true,
    enableDistortion: false,
    enableCaustics: false,
    qualityLevel: 'high',
    responsiveOptimization: true
  });

  const [intensity, setIntensity] = useState(1);
  const [enableReflections, setEnableReflections] = useState(true);
  const [enableDistortion, setEnableDistortion] = useState(false);
  const [enableCaustics, setEnableCaustics] = useState(false);

  // Handle preset change
  const handlePresetChange = (preset: 'minimal' | 'standard' | 'premium' | 'extreme') => {
    setSelectedPreset(preset);
    controls.updatePreset(preset);
  };

  // Handle intensity change
  const handleIntensityChange = (newIntensity: number) => {
    setIntensity(newIntensity);
    controls.updateIntensity(newIntensity);
  };

  // Handle effect toggles
  const handleEffectToggle = (effect: 'reflections' | 'distortion' | 'caustics') => {
    controls.toggleEffect(effect);
    
    switch (effect) {
      case 'reflections':
        setEnableReflections(!enableReflections);
        break;
      case 'distortion':
        setEnableDistortion(!enableDistortion);
        break;
      case 'caustics':
        setEnableCaustics(!enableCaustics);
        break;
    }
  };

  const presetDescriptions = {
    minimal: 'Single layer, basic blur',
    standard: '2 layers, subtle depth',
    premium: '3 layers, rich effects',
    extreme: '5 layers, maximum depth'
  };

  return (
    <div className="glassmorphism-showcase">
      <style jsx>{`
        .glassmorphism-showcase {
          min-height: 100vh;
          background: linear-gradient(135deg, ${backgroundColor} 0%, #16213e 50%, #0f3460 100%);
          background-size: 200% 200%;
          animation: gradientShift 10s ease infinite;
          padding: 2rem;
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .demo-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .glass-preview {
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: 20px;
          padding: 2rem;
          margin: 2rem 0;
        }
        
        .glass-content {
          text-align: center;
          color: white;
          z-index: 10;
          position: relative;
        }
        
        .glass-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .glass-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }
        
        .controls-panel {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 2rem;
          margin-top: 2rem;
        }
        
        .control-section {
          margin-bottom: 2rem;
        }
        
        .control-title {
          color: #00f6ff;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .preset-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .preset-button {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(0, 246, 255, 0.3);
          color: white;
          padding: 1rem;
          border-radius: 10px;
          transition: all 0.3s ease;
          text-align: left;
        }
        
        .preset-button.active {
          background: rgba(0, 246, 255, 0.2);
          border-color: #00f6ff;
          box-shadow: 0 5px 20px rgba(0, 246, 255, 0.3);
        }
        
        .preset-button:hover {
          background: rgba(0, 246, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .preset-name {
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }
        
        .preset-description {
          font-size: 0.9rem;
          opacity: 0.8;
        }
        
        .effect-toggles {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
        
        .effect-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.7rem 1.2rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        
        .effect-toggle.active {
          background: rgba(0, 246, 255, 0.3);
          border-color: #00f6ff;
          color: #ffffff;
        }
        
        .effect-toggle:hover {
          background: rgba(0, 246, 255, 0.2);
        }
        
        .stats-panel {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          margin-top: 1rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
        }
        
        .stats-title {
          color: #00f6ff;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .stats-item {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.3rem;
        }
        
        .stats-value {
          color: #00f6ff;
          font-weight: 600;
        }
        
        .intensity-control {
          margin-top: 1rem;
        }
        
        .intensity-label {
          color: white;
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: block;
        }
        
        @media (max-width: 768px) {
          .glassmorphism-showcase {
            padding: 1rem;
          }
          
          .glass-title {
            font-size: 2rem;
          }
          
          .preset-buttons {
            grid-template-columns: 1fr;
          }
          
          .effect-toggles {
            flex-direction: column;
          }
        }
      `}</style>

      <style dangerouslySetInnerHTML={{ __html: glassCSS }} />

      <div className="demo-container">
        {/* Main Glass Preview */}
        <div className={`glass-preview ${glassClasses}`}>
          <div className="glass-content">
            {content || (
              <>
                <h1 className="glass-title">Multi-Layer Glassmorphism</h1>
                <p className="glass-subtitle">
                  Advanced depth layers with realistic glass effects
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Badge bg="info">{stats.layerCount} Layers</Badge>
                  <Badge bg="success">{stats.qualityLevel.toUpperCase()}</Badge>
                  {stats.isMobileOptimized && <Badge bg="warning">Mobile Optimized</Badge>}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Controls Panel */}
        {showControls && (
          <div className="controls-panel">
            <Row>
              <Col md={6}>
                <div className="control-section">
                  <h3 className="control-title">🎨 Glass Presets</h3>
                  <div className="preset-buttons">
                    {(['minimal', 'standard', 'premium', 'extreme'] as const).map(preset => (
                      <button
                        key={preset}
                        className={`preset-button ${selectedPreset === preset ? 'active' : ''}`}
                        onClick={() => handlePresetChange(preset)}
                      >
                        <div className="preset-name">{preset.charAt(0).toUpperCase() + preset.slice(1)}</div>
                        <div className="preset-description">{presetDescriptions[preset]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-section">
                  <h3 className="control-title">⚡ Effects</h3>
                  <div className="effect-toggles">
                    <button
                      className={`effect-toggle ${enableReflections ? 'active' : ''}`}
                      onClick={() => handleEffectToggle('reflections')}
                    >
                      ✨ Reflections
                    </button>
                    <button
                      className={`effect-toggle ${enableDistortion ? 'active' : ''}`}
                      onClick={() => handleEffectToggle('distortion')}
                    >
                      🌊 Distortion
                    </button>
                    <button
                      className={`effect-toggle ${enableCaustics ? 'active' : ''}`}
                      onClick={() => handleEffectToggle('caustics')}
                    >
                      💎 Caustics
                    </button>
                  </div>
                </div>
              </Col>

              <Col md={6}>
                <div className="control-section">
                  <h3 className="control-title">🎛️ Intensity Control</h3>
                  <div className="intensity-control">
                    <label className="intensity-label">
                      Glass Intensity: {intensity.toFixed(1)}x
                    </label>
                    <Form.Range
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={intensity}
                      onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="control-section">
                  <h3 className="control-title">📊 Statistics</h3>
                  <div className="stats-panel">
                    <div className="stats-title">Current Configuration</div>
                    <div className="stats-item">
                      Layers: <span className="stats-value">{stats.layerCount}</span>
                    </div>
                    <div className="stats-item">
                      Active Effects: <span className="stats-value">{stats.activeEffects.length}</span>
                    </div>
                    <div className="stats-item">
                      Quality: <span className="stats-value">{stats.qualityLevel}</span>
                    </div>
                    <div className="stats-item">
                      Mobile Optimized: <span className="stats-value">{stats.isMobileOptimized ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="stats-item">
                      Status: <span className="stats-value">{isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Button 
                variant="outline-light" 
                onClick={controls.resetToDefaults}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                🔄 Reset to Defaults
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
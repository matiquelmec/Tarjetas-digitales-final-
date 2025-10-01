/**
 * Multi-layer Glassmorphism System
 * Advanced glassmorphism with multiple depth layers and realistic glass effects
 */

export interface GlassLayer {
  id: string;
  depth: number; // 1-5, higher = further back
  opacity: number; // 0-1
  blurIntensity: number; // 0-50
  tint: string; // hex color
  borderOpacity: number; // 0-1
  shadowIntensity: number; // 0-1
  refractionStrength: number; // 0-1
  animationSpeed: number; // 0-5
  enabled: boolean;
}

export interface GlassmorphismConfig {
  layers: GlassLayer[];
  enableReflections: boolean;
  enableDistortion: boolean;
  enableCaustics: boolean;
  ambientLighting: number; // 0-1
  lightPosition: { x: number; y: number };
  environmentMap?: string; // URL to environment texture
  qualityLevel: 'low' | 'medium' | 'high' | 'ultra';
}

export class MultiLayerGlassmorphism {
  private config: GlassmorphismConfig;
  private animationFrame: number | null = null;
  private time: number = 0;

  constructor(config: GlassmorphismConfig) {
    this.config = config;
  }

  // Create predefined layer configurations
  static createPreset(preset: 'minimal' | 'standard' | 'premium' | 'extreme'): GlassLayer[] {
    const presets = {
      minimal: [
        {
          id: 'base',
          depth: 1,
          opacity: 0.8,
          blurIntensity: 12,
          tint: '#ffffff',
          borderOpacity: 0.2,
          shadowIntensity: 0.3,
          refractionStrength: 0.1,
          animationSpeed: 0,
          enabled: true
        }
      ],
      standard: [
        {
          id: 'base',
          depth: 1,
          opacity: 0.7,
          blurIntensity: 15,
          tint: '#ffffff',
          borderOpacity: 0.3,
          shadowIntensity: 0.4,
          refractionStrength: 0.2,
          animationSpeed: 1,
          enabled: true
        },
        {
          id: 'overlay',
          depth: 2,
          opacity: 0.4,
          blurIntensity: 8,
          tint: '#00f6ff',
          borderOpacity: 0.1,
          shadowIntensity: 0.2,
          refractionStrength: 0.1,
          animationSpeed: 2,
          enabled: true
        }
      ],
      premium: [
        {
          id: 'background',
          depth: 3,
          opacity: 0.6,
          blurIntensity: 25,
          tint: '#0072ff',
          borderOpacity: 0.1,
          shadowIntensity: 0.5,
          refractionStrength: 0.3,
          animationSpeed: 0.5,
          enabled: true
        },
        {
          id: 'base',
          depth: 2,
          opacity: 0.75,
          blurIntensity: 18,
          tint: '#ffffff',
          borderOpacity: 0.25,
          shadowIntensity: 0.6,
          refractionStrength: 0.2,
          animationSpeed: 1,
          enabled: true
        },
        {
          id: 'highlight',
          depth: 1,
          opacity: 0.3,
          blurIntensity: 5,
          tint: '#00f6ff',
          borderOpacity: 0.4,
          shadowIntensity: 0.1,
          refractionStrength: 0.05,
          animationSpeed: 3,
          enabled: true
        }
      ],
      extreme: [
        {
          id: 'atmosphere',
          depth: 5,
          opacity: 0.3,
          blurIntensity: 40,
          tint: '#4a0e8f',
          borderOpacity: 0.05,
          shadowIntensity: 0.8,
          refractionStrength: 0.4,
          animationSpeed: 0.2,
          enabled: true
        },
        {
          id: 'depth',
          depth: 4,
          opacity: 0.5,
          blurIntensity: 30,
          tint: '#0072ff',
          borderOpacity: 0.1,
          shadowIntensity: 0.7,
          refractionStrength: 0.35,
          animationSpeed: 0.5,
          enabled: true
        },
        {
          id: 'middle',
          depth: 3,
          opacity: 0.65,
          blurIntensity: 20,
          tint: '#00a8ff',
          borderOpacity: 0.15,
          shadowIntensity: 0.6,
          refractionStrength: 0.25,
          animationSpeed: 1,
          enabled: true
        },
        {
          id: 'surface',
          depth: 2,
          opacity: 0.8,
          blurIntensity: 12,
          tint: '#ffffff',
          borderOpacity: 0.3,
          shadowIntensity: 0.5,
          refractionStrength: 0.15,
          animationSpeed: 1.5,
          enabled: true
        },
        {
          id: 'highlight',
          depth: 1,
          opacity: 0.25,
          blurIntensity: 3,
          tint: '#00f6ff',
          borderOpacity: 0.5,
          shadowIntensity: 0.1,
          refractionStrength: 0.05,
          animationSpeed: 4,
          enabled: true
        }
      ]
    };

    return presets[preset];
  }

  // Generate CSS for all layers
  generateLayeredCSS(baseColor: string, intensity: number = 1): string {
    const layers = this.config.layers
      .filter(layer => layer.enabled)
      .sort((a, b) => b.depth - a.depth); // Back to front

    const styles: string[] = [];

    // Base element styles
    styles.push(`
      position: relative;
      overflow: visible;
      transform-style: preserve-3d;
    `);

    // Generate each layer
    layers.forEach((layer, index) => {
      const adjustedIntensity = intensity * (layer.opacity || 1);
      const zIndex = 10 - layer.depth;
      const pseudoElement = index === 0 ? '::before' : `::after`;
      
      // For more than 2 layers, we need to use different techniques
      if (index < 2) {
        styles.push(`
          &${pseudoElement} {
            content: '';
            position: absolute;
            top: ${-layer.depth * 2}px;
            left: ${-layer.depth * 2}px;
            right: ${-layer.depth * 2}px;
            bottom: ${-layer.depth * 2}px;
            z-index: ${zIndex};
            pointer-events: none;
            
            background: ${this.generateLayerBackground(layer, baseColor, adjustedIntensity)};
            backdrop-filter: blur(${layer.blurIntensity * intensity}px) saturate(1.8);
            -webkit-backdrop-filter: blur(${layer.blurIntensity * intensity}px) saturate(1.8);
            
            border: 1px solid ${this.hexToRgba(layer.tint, layer.borderOpacity * intensity)};
            border-radius: inherit;
            
            box-shadow: 
              0 ${layer.depth * 4}px ${layer.depth * 12}px ${this.hexToRgba('#000000', layer.shadowIntensity * intensity * 0.3)},
              inset 0 1px 0 ${this.hexToRgba('#ffffff', layer.borderOpacity * intensity * 0.8)},
              inset 0 -1px 0 ${this.hexToRgba('#ffffff', layer.borderOpacity * intensity * 0.4)};
            
            ${layer.animationSpeed > 0 ? `
              animation: glassLayer${layer.id} ${15 / layer.animationSpeed}s ease-in-out infinite;
            ` : ''}
            
            ${this.config.enableDistortion ? `
              filter: 
                blur(${layer.blurIntensity * 0.1}px)
                brightness(${1 + layer.refractionStrength * 0.2})
                contrast(${1 + layer.refractionStrength * 0.1});
            ` : ''}
          }
        `);

        // Add animation keyframes if needed
        if (layer.animationSpeed > 0) {
          styles.push(`
            @keyframes glassLayer${layer.id} {
              0%, 100% {
                transform: translateZ(0px) rotateX(0deg) rotateY(0deg);
                opacity: ${layer.opacity * intensity};
              }
              25% {
                transform: translateZ(${layer.depth}px) rotateX(${layer.refractionStrength * 2}deg) rotateY(${layer.refractionStrength}deg);
                opacity: ${layer.opacity * intensity * 1.2};
              }
              50% {
                transform: translateZ(${layer.depth * 1.5}px) rotateX(0deg) rotateY(${layer.refractionStrength * 2}deg);
                opacity: ${layer.opacity * intensity * 0.8};
              }
              75% {
                transform: translateZ(${layer.depth}px) rotateX(-${layer.refractionStrength}deg) rotateY(0deg);
                opacity: ${layer.opacity * intensity * 1.1};
              }
            }
          `);
        }
      }
    });

    // Add reflection effects if enabled
    if (this.config.enableReflections) {
      styles.push(this.generateReflectionCSS(intensity));
    }

    // Add caustics if enabled
    if (this.config.enableCaustics) {
      styles.push(this.generateCausticsCSS(intensity));
    }

    return styles.join('\n');
  }

  // Generate complex layer background
  private generateLayerBackground(layer: GlassLayer, baseColor: string, intensity: number): string {
    const layerColor = this.hexToRgba(layer.tint, layer.opacity * intensity);
    const baseColorRgba = this.hexToRgba(baseColor, 0.1 * intensity);
    
    // Create gradient that simulates glass depth
    const gradients = [
      `linear-gradient(135deg, ${this.hexToRgba(layer.tint, 0.3 * intensity)} 0%, transparent 50%, ${this.hexToRgba(layer.tint, 0.1 * intensity)} 100%)`,
      `radial-gradient(circle at 30% 20%, ${this.hexToRgba('#ffffff', 0.2 * intensity)} 0%, transparent 50%)`,
      `radial-gradient(circle at 70% 80%, ${layerColor} 0%, transparent 50%)`,
      baseColorRgba
    ];

    return gradients.join(', ');
  }

  // Generate reflection effects
  private generateReflectionCSS(intensity: number): string {
    return `
      /* Reflection highlight */
      &::after {
        background: linear-gradient(
          145deg,
          ${this.hexToRgba('#ffffff', 0.4 * intensity)} 0%,
          ${this.hexToRgba('#ffffff', 0.1 * intensity)} 30%,
          transparent 70%
        );
        mix-blend-mode: overlay;
      }
      
      /* Environment reflection simulation */
      &:hover::before {
        background-image: 
          radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
            ${this.hexToRgba('#00f6ff', 0.2 * intensity)} 0%, 
            transparent 40%);
        transition: background-image 0.3s ease;
      }
    `;
  }

  // Generate caustics light patterns
  private generateCausticsCSS(intensity: number): string {
    return `
      /* Caustics pattern */
      &::before {
        background-image: 
          radial-gradient(ellipse 200px 100px at 20% 30%, ${this.hexToRgba('#00f6ff', 0.1 * intensity)} 0%, transparent 50%),
          radial-gradient(ellipse 150px 80px at 80% 70%, ${this.hexToRgba('#0072ff', 0.08 * intensity)} 0%, transparent 50%),
          radial-gradient(ellipse 100px 200px at 50% 20%, ${this.hexToRgba('#ffffff', 0.05 * intensity)} 0%, transparent 50%);
        animation: caustics 8s ease-in-out infinite;
      }
      
      @keyframes caustics {
        0%, 100% { 
          background-position: 0% 0%, 100% 100%, 50% 0%;
          filter: brightness(1);
        }
        33% { 
          background-position: 30% 20%, 70% 80%, 80% 30%;
          filter: brightness(1.2);
        }
        66% { 
          background-position: 80% 60%, 20% 40%, 20% 80%;
          filter: brightness(0.9);
        }
      }
    `;
  }

  // Convert hex to rgba
  private hexToRgba(hex: string, alpha: number): string {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
  }

  // Update configuration
  updateConfig(newConfig: Partial<GlassmorphismConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get layer by ID
  getLayer(id: string): GlassLayer | undefined {
    return this.config.layers.find(layer => layer.id === id);
  }

  // Update specific layer
  updateLayer(id: string, updates: Partial<GlassLayer>): void {
    const layerIndex = this.config.layers.findIndex(layer => layer.id === id);
    if (layerIndex !== -1) {
      this.config.layers[layerIndex] = { ...this.config.layers[layerIndex], ...updates };
    }
  }

  // Add new layer
  addLayer(layer: GlassLayer): void {
    this.config.layers.push(layer);
    this.config.layers.sort((a, b) => b.depth - a.depth);
  }

  // Remove layer
  removeLayer(id: string): void {
    this.config.layers = this.config.layers.filter(layer => layer.id !== id);
  }

  // Get optimized version for mobile
  getMobileOptimized(): GlassmorphismConfig {
    return {
      ...this.config,
      layers: this.config.layers
        .filter(layer => layer.enabled && layer.depth <= 2)
        .map(layer => ({
          ...layer,
          blurIntensity: Math.min(layer.blurIntensity, 15),
          animationSpeed: layer.animationSpeed * 0.5
        })),
      enableReflections: false,
      enableCaustics: false,
      enableDistortion: false,
      qualityLevel: 'low'
    };
  }

  // Generate quality-appropriate CSS
  generateQualityCSS(baseColor: string, intensity: number = 1): string {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const config = isMobile ? this.getMobileOptimized() : this.config;
    
    // Use the config to generate appropriate CSS
    const tempInstance = new MultiLayerGlassmorphism(config);
    return tempInstance.generateLayeredCSS(baseColor, intensity);
  }
}

export default MultiLayerGlassmorphism;
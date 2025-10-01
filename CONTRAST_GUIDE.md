# 🎨 Guía del Sistema de Contraste Unificado

## 📋 Resumen

El sistema de contraste garantiza que todos los textos en la Plataforma Digital Profesional tengan la legibilidad óptima siguiendo los estándares **WCAG 2.1 AA/AAA**. 

## 🏗️ Arquitectura del Sistema

### 1. **Utilidades Base** (`/src/lib/contrast.ts`)
```typescript
import { getBestTextColor, getContrastRatio, isAccessible } from '@/lib/contrast';

// Obtener el mejor color de texto para un fondo
const textColor = getBestTextColor('#2c2c2c'); // '#ffffff'

// Calcular ratio de contraste  
const ratio = getContrastRatio('#ffffff', '#000000'); // 21:1

// Verificar accesibilidad
const accessible = isAccessible('#ffffff', '#2c2c2c', 'AA', 'normal'); // true
```

### 2. **Hook Personalizado** (`/src/hooks/useContrast.ts`)
```typescript
import { useContrast, useContrastValidator, useColorScheme } from '@/hooks/useContrast';

// Hook básico
const contrast = useContrast({ validateOnMount: true });

// Validación automática múltiple
const validator = useContrastValidator([
  { text: '#ffffff', background: '#2c2c2c', name: 'Card Title' },
  { text: '#666666', background: '#ffffff', name: 'Card Body' }
]);

// Esquema de color completo
const scheme = useColorScheme('#2c2c2c');
```

### 3. **Clases CSS Predefinidas** (`/src/app/custom.css`)

#### Para fondos con gradiente/glass:
```css
.text-gradient-primary     /* #ffffff */
.text-gradient-secondary   /* rgba(255, 255, 255, 0.9) */
.text-gradient-muted       /* rgba(255, 255, 255, 0.75) */
.text-gradient-hint        /* rgba(255, 255, 255, 0.65) */
```

#### Para fondos sólidos claros:
```css
.text-solid-light-primary     /* #1a1a1a */
.text-solid-light-secondary   /* #2d2d2d */
.text-solid-light-muted       /* #6c757d */
.text-solid-light-hint        /* #9ca3af */
```

#### Para fondos sólidos oscuros:
```css
.text-solid-dark-primary     /* #ffffff */
.text-solid-dark-secondary   /* #f8f9fa */
.text-solid-dark-muted       /* #dee2e6 */
.text-solid-dark-hint        /* #adb5bd */
```

## 🚀 Guía de Uso

### ✅ **Casos de Uso Comunes**

#### 1. **Páginas con fondo gradiente animado**
```jsx
// ✅ CORRECTO
<div className="animated-gradient-background">
  <h1 className="text-gradient-primary">Título Principal</h1>
  <p className="text-gradient-secondary">Texto secundario</p>
  <small className="text-gradient-muted">Texto auxiliar</small>
</div>
```

#### 2. **Glass Cards**
```jsx
// ✅ CORRECTO - Las clases están incluidas en custom.css
<Card className="glass-card">
  <Card.Body>
    <Card.Title className="text-white">Título</Card.Title>
    <Card.Text className="text-white opacity-75">Contenido</Card.Text>
    <small className="text-muted">Nota auxiliar</small> {/* Se sobrescribe automáticamente */}
  </Card.Body>
</Card>
```

#### 3. **Tarjetas personalizadas con colores dinámicos**
```jsx
function CustomCard({ backgroundColor }) {
  const scheme = useColorScheme(backgroundColor);
  
  return (
    <Card style={{ backgroundColor }}>
      <Card.Body>
        <Card.Title style={{ color: scheme.text.primary }}>
          Título Dinámico
        </Card.Title>
        <Card.Text style={{ color: scheme.text.secondary }}>
          Texto con contraste automático
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
```

#### 4. **Validación automática durante desarrollo**
```jsx
function BusinessCard({ cardBackgroundColor, cardTextColor }) {
  // Validación automática con warnings en consola
  useContrastValidator([
    { 
      text: cardTextColor, 
      background: cardBackgroundColor, 
      name: 'Card Content' 
    }
  ], { validateOnMount: true });
}
```

### ❌ **Antipatrones - Evitar**

```jsx
// ❌ MAL - Texto gris sobre fondo claro sin validación
<div style={{ backgroundColor: '#f5f5f5' }}>
  <p style={{ color: '#888888' }}>Texto con poco contraste</p>
</div>

// ❌ MAL - Hardcodear colores sin considerar el fondo
<Card className="glass-card">
  <Card.Title style={{ color: '#cccccc' }}>Difícil de leer</Card.Title>
</Card>

// ❌ MAL - No usar las utilidades disponibles
<p className="text-secondary">Texto que se ve mal en glass cards</p>
```

## 📊 **Estándares de Contraste**

### **WCAG 2.1 Ratios Mínimos:**
- **AA Normal**: 4.5:1
- **AA Large**: 3.0:1  
- **AAA Normal**: 7.0:1
- **AAA Large**: 4.5:1

### **Nuestra Implementación:**
- **Texto principal**: Siempre AAA cuando es posible
- **Texto secundario**: Mínimo AA  
- **Texto auxiliar**: Mínimo AA con 75% opacity
- **Hints/placeholders**: Mínimo AA con 65% opacity

## 🔧 **Debugging y Desarrollo**

### **Validación en Consola**
Al usar `validateOnMount: true`, obtendrás warnings como:
```
❌ Contraste insuficiente: 2.31:1 entre #888888 y #ffffff
📏 Mínimo requerido (AA, normal): 4.5:1  
💡 Sugerencia: usar #000000 como color de texto
```

### **Herramientas de Testing**
```jsx
// Testing manual de ratios
const ratio = getContrastRatio('#ffffff', '#2c2c2c');
console.log(`Ratio: ${ratio.toFixed(2)}:1`); // "Ratio: 12.63:1"

// Verificar accesibilidad
const accessible = isAccessible('#ffffff', '#2c2c2c', 'AAA');
console.log(`AAA Compliant: ${accessible}`); // "AAA Compliant: true"
```

## 🎯 **Casos Especiales**

### **1. Overlays y Modals**
```jsx
// Modal con fondo oscuro
<Modal>
  <Modal.Header className="bg-dark text-white">
    <Modal.Title>Título del Modal</Modal.Title>
  </Modal.Header>
  <Modal.Body className="bg-dark text-solid-dark-secondary">
    Contenido del modal
  </Modal.Body>
</Modal>
```

### **2. Forms en Glass Cards**
```jsx
<Form.Control 
  className="form-control-glass"
  placeholder="Texto con contraste automático"
/>
```

### **3. Alerts Personalizados**
```jsx
<Alert className="alert-glass">
  <Alert.Heading>Notificación Importante</Alert.Heading>
  Mensaje con contraste garantizado
</Alert>
```

## 🚦 **Checklist de Implementación**

### **Para Nuevos Componentes:**
- [ ] ¿Usa las clases CSS predefinidas?
- [ ] ¿Valida contraste con `useContrastValidator`?
- [ ] ¿Funciona en todos los tipos de fondo?
- [ ] ¿Tiene focus indicators adecuados?
- [ ] ¿Es legible en modo alto contraste?

### **Para Componentes Existentes:**
- [ ] ¿Reemplaza `text-white-50` por `text-white opacity-75`?
- [ ] ¿Elimina colores hardcodeados problemáticos?
- [ ] ¿Usa `getBestTextColor()` para colores dinámicos?
- [ ] ¿Incluye `validateContrast()` en desarrollo?

## 🌟 **Beneficios del Sistema**

1. **Accesibilidad**: Cumple WCAG 2.1 AA/AAA automáticamente
2. **Consistencia**: Colores unificados en toda la aplicación  
3. **Mantenibilidad**: Cambios centralizados en un solo lugar
4. **Developer Experience**: Warnings automáticos durante desarrollo
5. **Performance**: Cálculos optimizados y memoizados
6. **Flexibilidad**: Funciona con cualquier color base

## 📱 **Responsive y Media Queries**

El sistema incluye optimizaciones automáticas:

```css
/* Alto contraste del sistema */
@media (prefers-contrast: high) {
  .text-gradient-muted { color: rgba(255, 255, 255, 0.9) !important; }
}

/* Movimiento reducido */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

---

**🎯 Objetivo**: Garantizar que cada pixel de texto en la plataforma sea perfectamente legible, accesible y hermoso, manteniendo la visión de "diseño hipnotizante" sin comprometer la usabilidad.

# PMO Framework Hub - Guías de UI/UX

## Referencia Visual Corporativa

### Inspiración de Diseño: Morris & Opazo
- **Sitio Corporativo**: https://morrisopazo.com como referencia principal
- **Estilo**: Corporativo, tecnológico, ejecutivo, minimalista
- **Elementos**: Gradientes, glassmorphism ligero, geometría moderna
- **Mensaje**: "Donde la estrategia se encuentra con la tecnología"

### Certificaciones y Credibilidad
- **AWS Partner**: Premier Tier Services (mostrar badges cuando aplique)
- **Expertise**: Enfoque en soluciones tecnológicas empresariales
- **Profesionalismo**: Diseño que refleje calibre de consultoría enterprise

## Tipografía Corporativa

### Fuente Principal: Poppins
- **Fuente Primaria**: Poppins (Google Fonts)
- **Pesos Utilizados**:
  - **Poppins Regular (400)** - Texto general
  - **Poppins Medium (500)** - Énfasis moderado
  - **Poppins SemiBold (600)** - Títulos y encabezados
  - **Poppins Bold (700)** - Títulos principales y CTAs

### Jerarquía Tipográfica
```css
/* Títulos Principales */
h1: Poppins SemiBold 2.5rem (40px) - Títulos de página
h2: Poppins SemiBold 2rem (32px) - Secciones principales  
h3: Poppins SemiBold 1.5rem (24px) - Subsecciones
h4: Poppins Medium 1.25rem (20px) - Encabezados menores

/* Texto de Cuerpo */
body: Poppins Regular 1rem (16px) - Texto general
small: Poppins Regular 0.875rem (14px) - Texto secundario
caption: Poppins Regular 0.75rem (12px) - Metadatos y labels
```

### Aplicación en Documentos
**Documentos DOCX generados**:
- **Fuente**: Poppins Regular 11pt
- **Alineación**: Texto justificado
- **Interlineado**: 1.15
- **Formato**: A4 con márgenes normales (2.5cm)
- **Encabezados**: Poppins SemiBold

**Documentos Excel**:
- **Fuente**: Poppins 10-11pt
- **Headers**: Poppins SemiBold
- **Data**: Poppins Regular

## Paleta de Colores Corporativa

### Colores Primarios (Basados en Morris & Opazo)
```css
/* Púrpuras y Violetas */
--mo-purple-50: #faf5ff;
--mo-purple-100: #f3e8ff;
--mo-purple-500: #a855f7;    /* Purple principal */
--mo-purple-600: #9333ea;
--mo-purple-900: #581c87;

--mo-violet-50: #f5f3ff;
--mo-violet-100: #ede9fe;
--mo-violet-500: #8b5cf6;    /* Violet principal */
--mo-violet-600: #7c3aed;
--mo-violet-900: #4c1d95;

--mo-magenta-50: #fdf2f8;
--mo-magenta-100: #fce7f3;
--mo-magenta-500: #ec4899;   /* Magenta principal */
--mo-magenta-600: #db2777;
--mo-magenta-900: #831843;
```

### Colores Secundarios
```css
/* Azules y Cyans */
--mo-blue-50: #eff6ff;
--mo-blue-100: #dbeafe;
--mo-blue-500: #3b82f6;      /* Blue principal */
--mo-blue-600: #2563eb;
--mo-blue-900: #1e3a8a;

--mo-cyan-50: #ecfeff;
--mo-cyan-100: #cffafe;
--mo-cyan-500: #06b6d4;      /* Cyan principal */
--mo-cyan-600: #0891b2;
--mo-cyan-900: #164e63;
```

### Colores Neutros
```css
/* Escala de Grises */
--mo-white: #ffffff;
--mo-gray-50: #f9fafb;
--mo-gray-100: #f3f4f6;
--mo-gray-200: #e5e7eb;
--mo-gray-500: #6b7280;
--mo-gray-700: #374151;
--mo-gray-900: #111827;
--mo-black: #000000;
```

### Gradientes Corporativos
```css
/* Gradiente Principal (Homepage Hero) */
.gradient-primary {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #06b6d4 100%);
}

/* Gradiente Sutil (Cards y Overlays) */
.gradient-subtle {
  background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 50%, #ecfeff 100%);
}

/* Gradiente para Glassmorphism */
.gradient-glass {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## Estilo Visual y Componentes

### Glassmorphism Ligero
```css
.glass-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.glass-navigation {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Componentes de UI

**Botones**
```css
/* Botón Primario */
.btn-primary {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font: Poppins Medium 14px;
  transition: transform 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(168, 85, 247, 0.3);
}

/* Botón Secundario */
.btn-secondary {
  background: transparent;
  color: #a855f7;
  border: 2px solid #a855f7;
  border-radius: 8px;
  padding: 10px 22px;
  font: Poppins Medium 14px;
}
```

**Cards y Containers**
```css
.framework-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f3f4f6;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.framework-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(168, 85, 247, 0.15);
}
```

## Responsive Design

### Breakpoints Estándar
```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Tablet portrait */
--breakpoint-md: 768px;   /* Tablet landscape */  
--breakpoint-lg: 1024px;  /* Desktop small */
--breakpoint-xl: 1280px;  /* Desktop large */
--breakpoint-2xl: 1536px; /* Desktop XL */
```

### Grid System
```css
/* Container Principal */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Grid Responsivo */
.grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Layout de 3 Columnas */
@media (min-width: 1024px) {
  .grid-3-col {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## WCAG AA Compliance

### Contraste de Color
```css
/* Ratios Mínimos WCAG AA */
--contrast-normal: 4.5;     /* Texto normal sobre fondo */
--contrast-large: 3.0;      /* Texto grande (18pt+) sobre fondo */

/* Combinaciones Aprobadas */
.text-on-white { color: #374151; }     /* 7.59:1 ratio */
.text-on-purple { color: #ffffff; }    /* 4.89:1 ratio */
.text-secondary { color: #6b7280; }    /* 4.69:1 ratio */
```

### Navegación Accesible
```css
/* Focus States */
.focus-visible {
  outline: 2px solid #a855f7;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 1000;
  text-decoration: none;
}

.skip-link:focus {
  top: 6px;
}
```

### Semántica HTML
- Usar elementos semánticos: `<nav>`, `<main>`, `<section>`, `<article>`
- ARIA labels para componentes interactivos
- Alt text descriptivo para imágenes
- Heading hierarchy correcta (h1 → h2 → h3)

## Animaciones Discretas

### Principios de Animación
- **Duración**: 200-300ms para micro-interacciones
- **Easing**: `ease-out` para entrada, `ease-in` para salida
- **Respeto**: `prefers-reduced-motion` para usuarios sensibles
- **Propósito**: Guiar atención, no decorar

### Animaciones Estándar
```css
/* Hover Lift */
.hover-lift {
  transition: transform 0.2s ease-out;
}
.hover-lift:hover {
  transform: translateY(-2px);
}

/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Loading Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Iconografía y Assets

### Sistema de Iconos
- **Biblioteca**: Heroicons v2 (outline y solid)
- **Tamaño Base**: 24px con variantes 16px, 20px, 32px
- **Color**: Heredar del texto padre o usar colores temáticos
- **Consistencia**: Mismo stroke width (1.5px) en toda la aplicación

### Imágenes y Media
- **Formato**: WebP con fallback a PNG/JPG
- **Optimización**: Responsive images con srcset
- **Lazy Loading**: Diferir carga de imágenes below-the-fold
- **Placeholder**: Skeleton loaders durante carga

## Patrones de Diseño Específicos PMO

### Framework Cards
```css
.framework-card {
  position: relative;
  overflow: hidden;
}

.framework-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #a855f7, #ec4899, #06b6d4);
}
```

### Status Indicators
```css
.status-active { 
  color: #10b981; 
  background: #d1fae5; 
}
.status-draft { 
  color: #f59e0b; 
  background: #fef3c7; 
}
.status-archived { 
  color: #6b7280; 
  background: #f3f4f6; 
}
```

### Download Buttons
```css
.download-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font: Poppins Medium 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.download-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4);
}
```
# 🚀 MorrisFlow - Framework Morris 3.1

[![Deploy Status](https://img.shields.io/badge/deploy-production-green)](https://d0987654321xyz.cloudfront.net)
[![Deploy Status](https://img.shields.io/badge/deploy-staging-blue)](https://d1234567890abc.cloudfront.net)
[![Framework Version](https://img.shields.io/badge/framework-Morris%203.1-orange)](https://github.com/Z3r0ku11/Pmi-datahelp)
[![Built with Vite](https://img.shields.io/badge/built%20with-Vite-646CFF)](https://vitejs.dev)

**Sistema integral de gestión de proyectos corporativos con Framework Morris 3.1**

## 🌟 Características Principales

- **🏗️ Framework Morris 3.1**: Sistema completo de gestión de proyectos híbrido
- **📊 Portal PMI**: Recursos, certificaciones y guías profesionales
- **⚡ Workflows Visuales**: End-to-End, Proyectos v2, Assessment v5
- **🎨 Diseño Moderno**: UI/UX optimizado con Tailwind CSS y animaciones
- **🔧 Arquitectura Robusta**: React + TypeScript + Vite
- **☁️ Deploy AWS**: CloudFront + S3 para alta disponibilidad

## 🚀 Ambientes de Despliegue

### 🟢 Producción
- **URL**: https://d0987654321xyz.cloudfront.net
- **Configuración**: Optimizado para rendimiento y SEO
- **Monitoreo**: 24/7 con métricas en tiempo real

### 🔵 Staging  
- **URL**: https://d1234567890abc.cloudfront.net
- **Configuración**: Ambiente de pruebas y validación
- **Propósito**: Testing de nuevas funcionalidades

## 📋 Contenido del Proyecto

### 🏛️ Portal Framework Morris
- **Resumen Framework**: Metodologías híbridas y fases principales
- **Workflow End-to-End**: Proceso corporativo de 13 fases
- **Flujo Proyectos v2**: Gestión PMO tradicional/híbrida (6+ semanas)  
- **Flujo Assessment v5**: Evaluación ágil (4-6 semanas)

### 🎓 Portal Ayuda PMI
- **Recursos PMI**: Biblioteca completa con PMBOK® 7th Edition
- **Certificaciones**: Guías PMP®, CAPM®, PMI-ACP®, PfMP®, PgMP®
- **Templates y Guías**: +30 plantillas profesionales listas para usar

## 🛠️ Stack Tecnológico

```typescript
// Frontend
React 18 + TypeScript
Vite (Build Tool)
Tailwind CSS (Styling)
Framer Motion (Animations)
React Router (Navigation)
Lucide React (Icons)

// Infrastructure
AWS CloudFront (CDN)
AWS S3 (Storage)
GitHub Actions (CI/CD)
```

## 📁 Estructura del Proyecto

```
morrisflow-new/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   └── layout/        # Header, Sidebar, Footer
│   ├── pages/            # Páginas principales
│   │   ├── morris/       # Portal Framework Morris
│   │   └── pmi/          # Portal Ayuda PMI
│   ├── utils/            # Configuración y helpers
│   ├── types/            # Definiciones TypeScript
│   └── assets/           # Recursos estáticos
├── public/
│   └── assets/           # Imágenes de workflows
├── dist/                 # Build producción
├── dist-stage/           # Build staging
└── package.json          # Dependencias y scripts
```

## 🚀 Scripts de Desarrollo

```bash
# Desarrollo
npm run dev          # Servidor desarrollo (puerto 3000)
npm run dev:staging  # Servidor staging (puerto 3001)

# Build
npm run build        # Build producción → /dist
npm run build:stage  # Build staging → /dist-stage

# Preview
npm run preview      # Preview producción (puerto 4173)
npm run preview:stage # Preview staging (puerto 4174)

# Calidad
npm run lint         # ESLint
npm run type-check   # TypeScript
```

## ⚙️ Variables de Entorno

```bash
# Producción (.env.production)
VITE_APP_ENV=production
VITE_APP_NAME=MorrisFlow
VITE_FRAMEWORK_VERSION=3.1
VITE_ENABLE_MORRIS_FRAMEWORK=true
VITE_ENABLE_PMI_PORTAL=true

# Staging (.env.staging)
VITE_APP_ENV=staging
VITE_DEBUG_MODE=true
VITE_MOCK_DATA=true
```

## 🎯 Workflows Implementados

### 1. Workflow End-to-End (13 Fases)
```
A. Ingreso y Transferencia (PMO Intake → Handover → Pre-Kickoff)
B. Planificación y Arranque (Planning → Config → Pre-Kickoff → Kickoff)
C. Ejecución y Control (Ejecución → Monitoreo → Acciones Correctivas)
D. Validación y Cierre (Validación → Documentación → Transferencia → Cierre)
```

### 2. Flujo Proyectos v2 (Gestión PMO Tradicional/Híbrida)
- **Target**: Proyectos >6 semanas
- **Metodología**: Tradicional + Híbrida
- **Fases**: 6 etapas optimizadas
- **Roles**: PM Lead, PM, Cloud Team

### 3. Flujo Assessment v5 (Gestión PMO Ágil)
- **Target**: Proyectos 4-6 semanas  
- **Metodología**: Ágil + Híbrida
- **Fases**: 8 sprints estructurados
- **Enfoque**: Assessment rápido y entrega incremental

## 🏆 Integración PMI + Morris

El framework combina:
- ✅ **Estándares PMI**: PMBOK® 7th Edition compliance
- ✅ **Metodologías Ágiles**: Scrum, Kanban integrado
- ✅ **Enfoques Híbridos**: Flexibilidad contextual
- ✅ **Gobernanza Corporativa**: Control transversal

## 🔧 Configuración AWS

### CloudFront Distribution
```yaml
Production:
  Domain: d0987654321xyz.cloudfront.net
  Origin: morrisflow-prod.s3.amazonaws.com
  Cache: Optimized for SPA

Staging:
  Domain: d1234567890abc.cloudfront.net  
  Origin: morrisflow-stage.s3.amazonaws.com
  Cache: Minimal for testing
```

### S3 Buckets
- **morrisflow-prod**: Archivos producción
- **morrisflow-stage**: Archivos staging
- **Configuración**: Static website hosting habilitado

## 📊 Métricas y Monitoreo

- **Performance**: Lighthouse Score >95
- **Accessibility**: WCAG 2.1 AA compliance
- **SEO**: Meta tags optimizados
- **Bundle Size**: <500KB gzipped
- **Load Time**: <2s First Contentful Paint

## 👥 Roles y Permisos

```typescript
// Estructura de roles
type UserRole = 
  | 'admin'           // Acceso completo
  | 'pmo-manager'     // Gestión PMO
  | 'pm-lead'         // Liderazgo técnico
  | 'pm'              // Gestión proyectos
  | 'team-member'     // Ejecución
  | 'stakeholder'     // Consulta
```

## 🔐 Seguridad

- **HTTPS**: Forzado en todos los ambientes
- **Headers**: Configuración de seguridad optimizada
- **Assets**: Validación de integridad
- **Secrets**: Variables sensibles en AWS Secrets Manager

## 📈 Roadmap

### v3.2 (Q1 2027)
- [ ] Dashboard de métricas en tiempo real
- [ ] Integración con herramientas PMO corporativas
- [ ] API REST para integraciones externas

### v3.3 (Q2 2027)  
- [ ] Mobile app companion
- [ ] Advanced analytics y reporting
- [ ] Multi-tenant support

## 🤝 Contribución

1. Fork del repositorio
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Copyright © 2026 Morris Framework Team. Todos los derechos reservados.

## 📞 Contacto y Soporte

- **Repository**: https://github.com/Z3r0ku11/Pmi-datahelp
- **Issues**: https://github.com/Z3r0ku11/Pmi-datahelp/issues
- **Documentation**: Portal integrado en la aplicación
- **PMI Resources**: https://www.pmi.org

---

**MorrisFlow v3.1** - *Framework de Gestión de Proyectos Corporativos* 🚀
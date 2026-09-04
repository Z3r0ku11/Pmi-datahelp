# 🚀 PMO Framework Hub

[![AWS](https://img.shields.io/badge/AWS-Stage%20%7C%20Prod-orange)](https://aws.amazon.com)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-4.5-646CFF)](https://vitejs.dev)

**Portal corporativo para el Framework de Gestión Adaptativa de Proyectos con administración segura integrada**

## 🌟 Características

- **📊 Framework de Gestión Adaptativa**: Sistema completo de metodologías híbridas para gestión de proyectos
- **🔐 Administración Segura**: Panel admin protegido con Amazon Cognito
- **☁️ Multi-Ambiente**: Despliegues independientes Stage y Production  
- **⚡ SPA Moderna**: React + TypeScript + Vite para máximo rendimiento
- **🎨 Diseño Corporativo**: UI/UX optimizada con Tailwind CSS
- **📱 Responsive**: Adaptado para móvil, tablet y escritorio

## 🏗️ Arquitectura AWS

```
Internet → CloudFront → S3 (Private) + Cognito Auth
                     ↓
               Lambda Functions (Admin API)
```

### Componentes
- **CloudFront**: CDN con cacheo optimizado y OAC
- **S3**: Almacenamiento privado con versionado
- **Cognito User Pool**: Autenticación y autorización
- **Lambda + API Gateway**: Backend para administración
- **CloudFormation**: Infraestructura como código

## 🚀 Ambientes

| Ambiente | Propósito | URL | Estado |
|----------|-----------|-----|---------|
| **Stage** | Testing y validación | `https://stage-url.cloudfront.net` | 🟢 Activo |
| **Prod** | Producción | `https://prod-url.cloudfront.net` | 🟢 Activo |

## 📁 Estructura del Proyecto

```
pmo-framework-hub/
├── src/                          # Código fuente
│   ├── components/               # Componentes reutilizables
│   ├── pages/                    # Páginas principales
│   │   ├── admin/                # Panel de administración
│   │   ├── HomePage/             # Página principal
│   │   ├── FrameworkExplorer/    # Explorador de frameworks
│   │   └── ...                   # Otras páginas
│   ├── utils/                    # Utilidades y configuración
│   └── types/                    # Definiciones TypeScript
├── infra/                        # Infraestructura AWS
│   ├── stage-infrastructure.yaml # CloudFormation Stage
│   ├── prod-infrastructure.yaml  # CloudFormation Prod
│   ├── deploy-stage.ps1          # Script despliegue Stage
│   └── deploy-prod.ps1           # Script despliegue Prod
├── public/                       # Assets estáticos
└── dist/                         # Build de producción
```

## 🛠️ Desarrollo Local

### Prerequisitos
- Node.js 18+
- npm 9+
- AWS CLI configurado
- GitHub CLI (opcional)

### Setup
```bash
# Clonar repositorio
git clone https://github.com/Z3r0ku11/Pmi-datahelp.git
cd pmo-framework-hub

# Instalar dependencias  
npm install

# Desarrollo
npm run dev

# Build y validación
npm run type-check
npm run build
```

### Scripts Disponibles
```bash
npm run dev          # Servidor desarrollo (puerto 5173)
npm run build        # Build producción
npm run preview      # Preview del build
npm run type-check   # Validación TypeScript
npm run lint         # ESLint
```

## ☁️ Despliegue AWS

### Prerequisitos
```bash
# Validar autenticación AWS
aws sts get-caller-identity --region us-east-1

# Si no está autenticado:
aws login
```

### Despliegue Stage
```bash
cd infra
.\deploy-stage.ps1
```

### Despliegue Production  
```bash
cd infra
.\deploy-prod.ps1
```

### Publicar Contenido
```bash
# Build local
npm run build

# Subir a Stage
aws s3 sync dist/ s3://BUCKET-NAME-STAGE --delete
aws cloudfront create-invalidation --distribution-id DIST-ID-STAGE --paths "/*"

# Subir a Prod (tras validación Stage)
aws s3 sync dist/ s3://BUCKET-NAME-PROD --delete  
aws cloudfront create-invalidation --distribution-id DIST-ID-PROD --paths "/*"
```

## 🔐 Administración

### Acceso Admin
- **URL**: `https://your-domain.com/admin`
- **Usuario inicial**: `dbarrios`
- **Password**: Se genera automáticamente en despliegue
- **Grupo requerido**: `SITE_ADMIN`

### Funcionalidades Admin
- **📁 Gestión de Archivos**: Upload/download de recursos (PDF, DOCX, XLSX)
- **⚙️ Frameworks**: Crear, editar y publicar frameworks
- **🎨 Look & Feel**: Personalizar colores, logos y contenido
- **🌐 Publicación**: Deploy de cambios con invalidación automática de CloudFront

### Seguridad
- ✅ Autenticación con AWS Cognito
- ✅ Autorización basada en grupos
- ✅ Contraseñas temporales con cambio obligatorio
- ✅ MFA preparado (opcional)
- ❌ NO credenciales hardcodeadas
- ❌ NO claves AWS en frontend

## 📊 Framework de Gestión Adaptativa

El portal implementa una metodología híbrida que combina:

### 🎯 Enfoques Metodológicos
- **Tradicional (Waterfall)**: Para proyectos con requisitos estables
- **Ágil (Scrum/Kanban)**: Para entrega iterativa e incremental  
- **Híbrido**: Flexibilidad según contexto del proyecto

### 📋 Componentes del Framework
- **Fases**: Estructura temporal del proyecto
- **Procesos**: Actividades estandardizadas
- **Roles**: Responsabilidades definidas
- **Artefactos**: Entregables y documentos
- **Controles**: Gates de calidad y decisión

### 🔄 Tipos de Proyecto
- **End-to-End**: Proyectos complejos (+13 fases)
- **Proyectos v2**: Gestión PMO tradicional/híbrida (6+ semanas)
- **Assessment v5**: Evaluación ágil (4-6 semanas)

## 🧪 Testing y Validación

### Validaciones Automáticas
```bash
npm run type-check    # TypeScript
npm run lint         # ESLint  
npm run build        # Build exitoso
```

### Testing Manual - Rutas Principales
- `/` - Homepage con hero y navegación
- `/frameworks` - Explorador de frameworks
- `/lifecycle` - Ciclo de vida de proyecto
- `/governance` - Governance y controles
- `/roles` - Biblioteca de roles
- `/artifacts` - Artefactos y plantillas  
- `/downloads` - Centro de descargas
- `/admin` - Panel de administración (autenticado)

### Validación Post-Deploy
1. **Navegación**: Todas las rutas responden correctamente
2. **Descargas**: PDFs, DOCX y XLSX funcionan
3. **Admin**: Login, cambio de password, dashboard
4. **Responsive**: Móvil, tablet, escritorio
5. **Performance**: Lighthouse Score >90

## 🔧 Configuración

### Variables de Entorno
El proyecto usa configuración runtime desde S3, no variables de entorno en build time.

### Configuración AWS
```yaml
# CloudFormation Parameters
ProjectName: pmo-framework-hub
Environment: stage|prod  
Region: us-east-1
AccountId: 664858858204
```

### Cache Strategy
- **index.html**: No-cache (para SPA routing)
- **Assets**: Cache largo (archivos versionados)
- **Downloads**: Cache medio (recursos estáticos)

## 📈 Monitoreo y Métricas

### AWS Resources Created
- S3 Buckets (privados con versionado)
- CloudFront Distributions (con OAC)
- Cognito User Pools y Clients
- IAM Roles y Policies
- Lambda Functions (para admin API)

### No Incluye (por restricción)
- ❌ CloudWatch Logs/Metrics
- ❌ Alarmas
- ❌ DynamoDB/RDS
- ❌ Athena/Glue/Redshift

## 🚨 Consideraciones de Seguridad

### ✅ Implementado
- S3 buckets privados (no URLs públicas)
- CloudFront con OAC (Origin Access Control)
- Cognito para autenticación
- Grupos para autorización
- Secrets en AWS Secrets Manager
- HTTPS forzado

### ⚠️ Pendientes
- WAF (Web Application Firewall)
- VPC endpoints
- Logging avanzado
- Monitoring proactivo

## 🤝 Contribución

### Git Workflow
```bash
# Crear feature branch
git checkout -b feature/nueva-funcionalidad

# Desarrollo y commits
git add .
git commit -m "feat: descripción del cambio"

# Push y PR
git push origin feature/nueva-funcionalidad
# Crear PR en GitHub
```

### Branches
- **main**: Production (deploy automático a Prod tras validación)
- **develop**: Stage (deploy automático a Stage)
- **feature/***: Desarrollo de funcionalidades

### Releases
1. Desarrollo en `feature/` branch
2. Merge a `develop` → Deploy automático a Stage  
3. Validación completa en Stage
4. Merge a `main` → Deploy manual a Prod

## 📞 Soporte

### Contacto
- **Repository**: https://github.com/Z3r0ku11/Pmi-datahelp
- **Issues**: https://github.com/Z3r0ku11/Pmi-datahelp/issues
- **Admin**: dbarrios@morrisopazo.com

### Documentación
- Framework Morris & Opazo integrado en el portal
- Guías de usuario disponibles en `/downloads`
- API docs disponibles tras configuración admin

---

**PMO Framework Hub v1.0** - *Framework de Gestión Adaptativa de Proyectos* 🚀

Copyright © 2026 Morris & Opazo. Todos los derechos reservados.
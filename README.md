# PMI-DataHelp v2.0

> **Portal Integral de Gestión de Proyectos - Sitio Único con Tres Secciones**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/your-org/pmi-datahelp)
[![AWS](https://img.shields.io/badge/AWS-Cloud%20Native-orange.svg)](https://aws.amazon.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org)

## 🎯 Descripción del Proyecto

PMI-DataHelp es una **plataforma unificada** con tres secciones principales para gestión de proyectos:

### 🏠 **Página Principal (Índice)**
- Landing page principal con navegación a las secciones
- Información general del sistema
- Acceso centralizado a todos los portales

### 📚 **Portal de Ayuda** 
- Contenido educativo y recursos de gestión de proyectos
- Herramientas, guías y recursos basados en estándares PMI
- **Acceso público** con funcionalidades mejoradas para usuarios registrados

### 🏢 **Portal PMO Morris**
- Dashboard ejecutivo para análisis y seguimiento de proyectos
- **Framework de proyectos** Morris basado en PMI
- **Flujo de proyectos** con gates de aprobación
- **Acceso restringido** para personal PMO autorizado (admin/pmo/executive)

## 🏗️ Arquitectura Unificada

```
┌─────────────────────────────────────────────────────────────────┐
│                     PMI-DataHelp v2.0                          │
│                    Sitio Único Unificado                       │
├─────────────────────────────────────────────────────────────────┤
│  🏠 Página Principal  │  📚 Portal de Ayuda  │ 🏢 Portal PMO    │
│     (Índice)          │    (Público)          │   (Restringido) │
│  ┌─────────────────┐  │  ┌─────────────────┐  │ ┌─────────────┐ │
│  │ Landing Page    │  │  │ Recursos        │  │ │ Dashboard   │ │
│  │ Navegación      │  │  │ Herramientas    │  │ │ Framework   │ │
│  │ Enlaces         │  │  │ Guías           │  │ │ Flujo       │ │
│  └─────────────────┘  │  │ Cursos          │  │ │ Reportes    │ │
│                       │  └─────────────────┘  │ └─────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                  Componentes Compartidos                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ Authentication  │ │   UI Library    │ │   Utilities     │   │
│  │ (Cognito+OAuth) │ │   (Tailwind)    │ │   (TypeScript)  │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                        AWS Infrastructure                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ S3 Bucket   │ │ CloudFront  │ │   Cognito   │ │ CodePipeline│ │
│  │ (Static)    │ │    (CDN)    │ │   (Auth)    │ │   (CI/CD)   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## ⚡ Quick Start

### 1. **Acceso al Sitio Único**
```bash
# Sitio Principal Unificado
https://pmi-datahelp.com

# Navegación interna:
# /           → Página Principal (Índice)
# /help/*     → Portal de Ayuda (Público)  
# /pmo/*      → Portal PMO Morris (Restringido)
# /login      → Autenticación
```

### 2. **Credenciales de Prueba**
```bash
# Administrador (Acceso completo)
Email: admin@morris.com
Password: TempPassword123!

# PMO Manager (Dashboard + Framework)
Email: pmo@morris.com
Password: TempPassword123!

# Usuario Estándar (Solo Portal de Ayuda)
Email: user@example.com  
Password: TempPassword123!
```

> ⚠️ **Cambiar contraseñas inmediatamente después del primer acceso**

## 🚀 Despliegue

### Despliegue Completo (Recomendado)

```powershell
# 1. Clonar repositorio
git clone https://github.com/your-org/pmi-datahelp.git
cd pmi-datahelp

# 2. Configurar environment
cp .env.example .env
# Editar .env con valores específicos

# 3. Desplegar sistema completo
./scripts/deploy-full-system.ps1 `
    -Environment "prod" `
    -DomainName "pmi-datahelp.com" `
    -CertificateArn "arn:aws:acm:us-east-1:664858858204:certificate/YOUR-CERT" `
    -GitHubToken "ghp_YOUR_TOKEN" `
    -GitHubOwner "your-org" `
    -GitHubRepo "pmi-datahelp" `
    -RetireOldDistributions

# 4. Validar despliegue
./scripts/validate-deployment.ps1 -Environment "prod" -DomainName "pmi-datahelp.com"

# 5. Obtener información de acceso
./scripts/get-access-info.ps1 -Environment "prod" -ShowAll
```

### Despliegue por Componentes

```powershell
# Solo infraestructura
./scripts/deploy-infrastructure.ps1 -Environment prod

# Solo CI/CD
./scripts/setup-cicd.ps1 -Environment prod

# Solo retirement de distribuciones legacy
./scripts/retire-cloudfront-distributions.ps1 -Force
```

## 🔧 Desarrollo

### Prerequisites

- **Node.js** 18+ y npm
- **AWS CLI** v2 configurado
- **PowerShell** 7+ (para scripts de despliegue)
- **Git** para control de versiones

### Setup Local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar environment local
cp .env.example .env.local
# Configurar variables para desarrollo

# 3. Iniciar servidor de desarrollo
npm run dev
# Se abre en: http://localhost:5173

# Navegación del sitio:
# http://localhost:5173/           (Página Principal)
# http://localhost:5173/help       (Portal de Ayuda)  
# http://localhost:5173/pmo        (Portal PMO - requiere login)
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev                # Servidor de desarrollo unificado

# Build
npm run build             # Build para producción
npm run build:prod        # Build optimizado

# Testing
npm run test              # Run unit tests
npm run lint              # ESLint check
npm run type-check        # TypeScript check

# CI/CD Management  
npm run manage:pipeline   # Gestión de pipeline CI/CD
```

## 📊 Características Principales

### 🔐 **Sistema de Autenticación**
- **AWS Cognito** User Pools
- **Google OAuth** integration  
- **Roles jerárquicos**: admin → pmo → executive → user
- **Permisos granulares** por recurso y acción
- **Protección de rutas** automática por fase

### 🎨 **Interface de Usuario**
- **React 18** con TypeScript
- **Tailwind CSS** para styling consistente
- **Responsive design** para todos los dispositivos
- **Componentes compartidos** entre fases
- **Tema personalizable** por organización

### ☁️ **Infraestructura AWS**
- **S3** para hosting de aplicaciones estáticas
- **CloudFront** CDN con cache optimizado
- **Cognito** para autenticación y autorización  
- **CodePipeline** CI/CD automatizado
- **CloudFormation** Infrastructure as Code
- **SSM Parameter Store** para configuración

### 🚀 **CI/CD Automatizado**
- **GitHub** integration con webhooks
- **CodeBuild** para testing y building paralelo
- **Automated deployment** a S3 + CloudFront
- **Multi-environment** support (dev/staging/prod)
- **Rollback automático** en caso de fallas

## 📁 Estructura del Proyecto

```
pmi-datahelp/
├── src/                    # Aplicación principal React
│   ├── pages/             # Páginas principales
│   │   ├── HomePage.tsx   # Página principal (índice)
│   │   └── LoginPage.tsx  # Página de autenticación
│   ├── portals/           # Portales especializados
│   │   ├── help/          # Portal de Ayuda (público)
│   │   │   ├── pages/     # Páginas del portal de ayuda
│   │   │   ├── layout/    # Layout específico
│   │   │   └── HelpPortal.tsx
│   │   └── pmo/           # Portal PMO Morris (restringido)  
│   │       ├── pages/     # Dashboard, Framework, Flujo
│   │       ├── layout/    # Layout específico PMO
│   │       └── PMOPortal.tsx
│   ├── shared/            # Componentes compartidos
│   │   ├── components/    # UI components reutilizables
│   │   ├── hooks/         # React hooks compartidos
│   │   ├── utils/         # Utilities comunes
│   │   └── types/         # TypeScript definitions
│   └── App.tsx           # Aplicación principal unificada
├── infrastructure/        # AWS CloudFormation templates
│   └── cloudformation/   # Infrastructure as Code
├── scripts/              # Deployment & management scripts
│   ├── deploy-full-system.ps1
│   ├── setup-cicd.ps1
│   ├── validate-deployment.ps1
│   └── get-access-info.ps1
├── docs/                 # Documentation
│   ├── DEPLOYMENT-GUIDE.md
│   ├── AUTHENTICATION.md
│   └── CI-CD-SETUP.md
└── .github/              # GitHub workflows & templates
```

## 🔒 Seguridad

### Características de Seguridad

- ✅ **HTTPS obligatorio** en todas las conexiones
- ✅ **Security headers** (CSP, HSTS, X-Frame-Options)
- ✅ **JWT tokens** firmados por Cognito
- ✅ **Role-based access control** (RBAC)
- ✅ **Input validation** y sanitización
- ✅ **Audit logging** completo
- ✅ **Secret management** vía AWS SSM

### Compliance

- **OWASP** security best practices
- **AWS Security** best practices
- **GDPR** data protection considerations
- **SOC 2** preparation capabilities

## 📈 Monitoring & Analytics

### Métricas Disponibles

- **Performance**: Page load times, CDN hit rates
- **Usage**: User sessions, feature adoption
- **Security**: Login attempts, failed authentications
- **Infrastructure**: AWS resource utilization
- **Business**: Content engagement, user flows

### Dashboards

- **CloudWatch** for infrastructure metrics
- **CodePipeline** for deployment metrics  
- **CloudFront** for CDN analytics
- **Cognito** for user analytics

## 🌐 Environments

### Development
- **URL**: https://dev.pmi-datahelp.com
- **Purpose**: Feature development y testing
- **Data**: Mock data y test users

### Staging  
- **URL**: https://staging.pmi-datahelp.com
- **Purpose**: Pre-production validation
- **Data**: Production-like test data

### Production
- **URL**: https://pmi-datahelp.com
- **Purpose**: Live system para usuarios finales
- **Data**: Real production data

## 📚 Documentación

### Guías Principales

- **[Deployment Guide](./docs/DEPLOYMENT-GUIDE.md)** - Despliegue completo paso a paso
- **[Authentication Setup](./docs/AUTHENTICATION.md)** - Configuración de autenticación
- **[CI/CD Configuration](./docs/CI-CD-SETUP.md)** - Pipeline setup y management
- **[Infrastructure Details](./docs/INFRASTRUCTURE.md)** - AWS architecture y resources

### API Documentation

- **[API Reference](./docs/API.md)** - Endpoints y authentication
- **[Integration Guide](./docs/INTEGRATION.md)** - Third-party integrations

## 🔧 Troubleshooting

### Problemas Comunes

1. **"Access Denied" en Phase 2**
   ```bash
   # Verificar role del usuario
   ./scripts/get-access-info.ps1 -Environment prod -ShowCredentials
   ```

2. **Applications no cargan**
   ```bash
   # Validar deployment
   ./scripts/validate-deployment.ps1 -Environment prod -DomainName "pmi-datahelp.com"
   ```

3. **CI/CD pipeline failing**
   ```bash  
   # Check pipeline status
   ./scripts/manage-pipeline.ps1 -Action status -Environment prod
   ```

### Support

- **Documentation**: Revisar `./docs/` para guías detalladas
- **Logs**: Check AWS CloudWatch para application logs
- **Issues**: Create GitHub issue para bugs y feature requests
- **Contact**: Contactar al equipo de desarrollo para support

## 🎯 Roadmap

### v2.1 (Q2 2026)
- [ ] **API Backend** con Lambda + API Gateway
- [ ] **Database integration** con DynamoDB  
- [ ] **Advanced analytics** dashboard
- [ ] **Multi-language** support

### v2.2 (Q3 2026)  
- [ ] **SSO integration** con corporate systems
- [ ] **Mobile apps** (React Native)
- [ ] **Advanced reporting** con QuickSight
- [ ] **AI-powered** project insights

### v3.0 (Q4 2026)
- [ ] **Microservices architecture** migration
- [ ] **Real-time collaboration** features
- [ ] **Advanced AI/ML** integration
- [ ] **Enterprise features** para large organizations

## 🤝 Contribución

### Development Workflow

1. **Fork** el repositorio
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`  
5. **Create Pull Request** usando el template

### Code Standards

- **TypeScript** para type safety
- **ESLint + Prettier** para code formatting
- **Conventional Commits** para commit messages
- **Unit tests** required para nuevas features
- **Documentation** updates para changes

## 📄 License

Este proyecto está licenciado bajo la MIT License - ver [LICENSE](LICENSE) para detalles.

## 🙏 Acknowledgments

- **AWS** por la infraestructura cloud robusta
- **React Team** por el framework excepcional
- **Tailwind CSS** por el sistema de design
- **PMI** por los estándares de gestión de proyectos
- **Morris Team** por el vision y requirements

---

**PMI-DataHelp v2.0** - Transformando la educación en gestión de proyectos y herramientas ejecutivas ⚡

[![Deploy to AWS](https://img.shields.io/badge/Deploy%20to-AWS-orange)](./docs/DEPLOYMENT-GUIDE.md)
[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://pmi-datahelp.com)
[![Documentation](https://img.shields.io/badge/Docs-Available-blue)](./docs/)
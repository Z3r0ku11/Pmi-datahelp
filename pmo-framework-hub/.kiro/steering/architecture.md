# PMO Framework Hub - Arquitectura del Sistema

## Arquitectura General

### Stack Tecnológico Principal

**Frontend Framework**
- **React 18+** - Framework de UI con hooks y componentes funcionales
- **TypeScript** - Tipado estático para desarrollo robusto y mantenible
- **Vite** - Build tool moderno para desarrollo rápido y bundles optimizados

**Hosting y Infraestructura**
- **Amazon S3 (Privado)** - Storage de aplicación SPA y recursos estáticos
- **Amazon CloudFront** - CDN global con caching y compresión
- **Route 53** - DNS management para dominio corporativo

**Seguridad**
- **CloudFront OAC (Origin Access Control)** - Acceso controlado a S3
- **S3 Block Public Access** - Prevención de exposición accidental
- **HTTPS Enforced** - Certificados SSL/TLS obligatorios
- **Security Headers** - CSP, HSTS, X-Frame-Options

### Arquitectura Serverless

El sistema sigue un patrón **completamente serverless** para:
- **Zero maintenance** de servidores
- **Auto-scaling** automático según demanda
- **Cost optimization** - pago por uso real
- **High availability** inherente de AWS

```
Usuario → CloudFront → S3 (Private) → React SPA
                ↓
        Cache Global + Security Headers
```

## Frontend - Single Page Application (SPA)

### Estructura de Proyecto
```
src/
├── components/          # Componentes React reutilizables
├── pages/              # Páginas principales del portal
├── hooks/              # Custom hooks para lógica compartida
├── utils/              # Utilidades y helpers
├── types/              # Definiciones TypeScript
├── data/               # Datos metodológicos (JSON estructurado)
├── generators/         # Lógica de generación de documentos
└── styles/            # Estilos y tema corporativo
```

### Gestión de Estado
- **React Context** - Estado global de usuario y preferencias
- **useState/useReducer** - Estado local de componentes
- **Custom Hooks** - Lógica reutilizable de negocio
- **Local Storage** - Persistencia de preferencias usuario

### Routing y Navegación
- **React Router v6** - Navegación SPA client-side
- **Lazy Loading** - Carga diferida de componentes por ruta
- **Breadcrumbs** - Navegación jerárquica clara
- **Deep Linking** - URLs específicas para cada recurso

## Generación Client-Side de Documentos

### Bibliotecas Especializadas

**Excel (.xlsx)**
- **ExcelJS** - Generación completa de spreadsheets
- **Funcionalidades**: Fórmulas, formato, gráficos, validación de datos
- **Uso**: Templates de planificación, matrices de riesgo, dashboards KPI

**Word (.docx)**
- **docx** - Creación de documentos Word estructurados
- **Funcionalidades**: Estilos, tablas, imágenes, headers/footers
- **Uso**: Project charters, reportes ejecutivos, documentación formal

**PowerPoint (.pptx)**
- **PptxGenJS** - Generación de presentaciones corporativas
- **Funcionalidades**: Slides, gráficos, tablas, multimedia
- **Uso**: Status reports ejecutivos, presentaciones de proyecto

### Arquitectura de Generación
```typescript
interface DocumentGenerator<T> {
  template: DocumentTemplate;
  data: T;
  generate(): Promise<Blob>;
  download(filename: string): void;
}

class ExcelGenerator implements DocumentGenerator<ProjectData> {
  // Implementación específica para XLSX
}

class WordGenerator implements DocumentGenerator<ChartData> {
  // Implementación específica para DOCX  
}

class PowerPointGenerator implements DocumentGenerator<StatusData> {
  // Implementación específica para PPTX
}
```

### Templates y Datos
- **JSON Schema** - Definición de estructura de datos metodológicos
- **Template Engine** - Sistema de plantillas reutilizables
- **Data Binding** - Vinculación automática datos ↔ documentos
- **Style System** - Aplicación consistente de branding Morris & Opazo

## Hosting en AWS S3 + CloudFront

### Configuración S3
```json
{
  "BucketName": "pmo-framework-hub-morrisopazo-prod",
  "Region": "us-east-1",
  "PublicAccessBlock": {
    "BlockPublicAcls": true,
    "IgnorePublicAcls": true,
    "BlockPublicPolicy": true,
    "RestrictPublicBuckets": true
  },
  "Versioning": "Enabled",
  "Encryption": "AES256"
}
```

### Configuración CloudFront
```json
{
  "Origins": [
    {
      "DomainName": "pmo-framework-hub-morrisopazo-prod.s3.us-east-1.amazonaws.com",
      "OriginAccessControl": "OAC-PMO-Hub"
    }
  ],
  "DefaultCacheBehavior": {
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "optimized-caching",
    "Compress": true,
    "AllowedMethods": ["GET", "HEAD", "OPTIONS"]
  },
  "CustomErrorPages": [
    {
      "ErrorCode": 404,
      "ResponseCode": 200,
      "ResponsePagePath": "/index.html"
    }
  ]
}
```

### Security Headers via CloudFront
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data:
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## Consideraciones de Backend

### Principio: Backend-Avoidance
- **Prioridad 1**: Soluciones client-side siempre que sea posible
- **Prioridad 2**: Servicios AWS managed (Lambda, API Gateway) si requerido
- **Prioridad 3**: Backend tradicional solo como último recurso

### Casos que Podrían Requerir Backend
- **Analytics avanzados** de uso de portal
- **Autenticación corporativa** (SSO/LDAP integration)
- **Notificaciones push** de updates metodológicos
- **Versionado colaborativo** de frameworks
- **APIs externas** que requieren secret management

### Arquitectura Backend (Si Requerida)
```
CloudFront → API Gateway → Lambda Functions → DynamoDB
                     ↓
            AWS Secrets Manager (API Keys)
                     ↓  
            CloudWatch Logs (Monitoring)
```

## Performance y Optimización

### Estrategias de Caching
- **CloudFront**: Cache global de assets estáticos (CSS, JS, imágenes)
- **Browser Cache**: Aggressive caching de recursos inmutables
- **Service Worker**: Cache local de datos metodológicos (JSON)
- **Lazy Loading**: Carga diferida de componentes y rutas

### Bundle Optimization
- **Code Splitting**: División automática por rutas
- **Tree Shaking**: Eliminación de código no utilizado
- **Compression**: Gzip/Brotli en CloudFront
- **Asset Optimization**: Minificación y compresión de imágenes

### Monitoring y Analytics
- **CloudWatch**: Métricas de infraestructura AWS
- **Real User Monitoring**: Core Web Vitals tracking
- **Error Tracking**: Client-side error logging
- **Usage Analytics**: Tracking de uso de funcionalidades PMO

## Deployment Pipeline

### CI/CD Workflow
```
Git Push → GitHub Actions → Build (Vite) → Test → Deploy to S3 → Invalidate CloudFront
```

### Environment Strategy
- **Development**: Local development server (Vite dev)
- **Staging**: S3 bucket separado con CloudFront distribution
- **Production**: S3 producción con domain corporativo

### Rollback Strategy
- **S3 Versioning**: Rollback inmediato a versión anterior
- **CloudFront Invalidation**: Limpieza de cache para updates
- **Blue/Green**: Deployment a buckets alternos para validación
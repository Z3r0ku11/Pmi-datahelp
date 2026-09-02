# 🚀 MorrisFlow - Configuración AWS CloudFront

## 📋 Requisitos Previos

### 1. AWS CLI Instalación
```bash
# Windows (PowerShell como Administrator)
choco install awscli
# O descargar desde: https://aws.amazon.com/cli/

# Verificar instalación
aws --version
```

### 2. Configuración de Credenciales AWS
```bash
aws configure
# AWS Access Key ID: [Tu Access Key]
# AWS Secret Access Key: [Tu Secret Key]
# Default region: us-east-1
# Default output format: json
```

## 🏗️ Arquitectura de Despliegue

```
MorrisFlow Application
├── Production Environment
│   ├── S3 Bucket: morrisflow-prod-YYYYMMDD
│   ├── CloudFront Distribution: dXXXXXXXXXX.cloudfront.net
│   └── Source: /morrisflow-new/dist/
└── Staging Environment
    ├── S3 Bucket: morrisflow-stage-YYYYMMDD
    ├── CloudFront Distribution: dYYYYYYYYYY.cloudfront.net
    └── Source: /morrisflow-new/dist-stage/
```

## 🚀 Despliegue Automático

### Ejecutar Script Completo
```powershell
# Desplegar ambos ambientes
.\scripts\deploy-to-aws.ps1 -Environment both

# Solo producción
.\scripts\deploy-to-aws.ps1 -Environment production

# Solo staging
.\scripts\deploy-to-aws.ps1 -Environment staging
```

## 🔧 Despliegue Manual Paso a Paso

### Paso 1: Preparar Builds
```bash
cd morrisflow-new

# Build Producción
npm run build

# Build Staging  
npm run build:stage
```

### Paso 2: Crear Buckets S3
```bash
# Bucket Producción
aws s3 mb s3://morrisflow-prod-20260902 --region us-east-1

# Bucket Staging
aws s3 mb s3://morrisflow-stage-20260902 --region us-east-1
```

### Paso 3: Configurar Website Hosting
```bash
# Producción
aws s3api put-bucket-website \
  --bucket morrisflow-prod-20260902 \
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "index.html"}
  }'

# Staging
aws s3api put-bucket-website \
  --bucket morrisflow-stage-20260902 \
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"}, 
    "ErrorDocument": {"Key": "index.html"}
  }'
```

### Paso 4: Configurar Políticas de Acceso Público
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET-NAME/*"
    }
  ]
}
```

```bash
# Aplicar política (reemplazar BUCKET-NAME)
aws s3api put-bucket-policy \
  --bucket morrisflow-prod-20260902 \
  --policy file://bucket-policy.json
```

### Paso 5: Subir Archivos
```bash
# Producción - Optimizado para cache
aws s3 sync ./dist s3://morrisflow-prod-20260902 \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" --exclude "*.json"

aws s3 sync ./dist s3://morrisflow-prod-20260902 \
  --delete \
  --cache-control "public, max-age=0, must-revalidate" \
  --exclude "*" --include "*.html" --include "*.json"

# Staging - Cache mínimo para testing
aws s3 sync ./dist-stage s3://morrisflow-stage-20260902 \
  --delete \
  --cache-control "public, max-age=300"
```

### Paso 6: Crear Distribuciones CloudFront

#### Configuración Producción
```json
{
  "CallerReference": "morrisflow-prod-20260902-timestamp",
  "Comment": "MorrisFlow Production - Framework Morris 3.1",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "morrisflow-prod-20260902",
        "DomainName": "morrisflow-prod-20260902.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "morrisflow-prod-20260902",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      },
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200", 
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
```

```bash
# Crear distribución
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-prod-config.json
```

#### Configuración Staging (Cache reducido)
```json
{
  "CallerReference": "morrisflow-stage-20260902-timestamp",
  "Comment": "MorrisFlow Staging - Framework Morris 3.1",
  "DefaultCacheBehavior": {
    "DefaultTTL": 300,
    "MaxTTL": 3600
  }
}
```

## 📊 URLs de Despliegue Esperadas

### 🟢 Producción
- **S3 Website**: http://morrisflow-prod-20260902.s3-website-us-east-1.amazonaws.com
- **CloudFront**: https://d0987654321xyz.cloudfront.net
- **Propósito**: Ambiente estable para usuarios finales

### 🔵 Staging
- **S3 Website**: http://morrisflow-stage-20260902.s3-website-us-east-1.amazonaws.com  
- **CloudFront**: https://d1234567890abc.cloudfront.net
- **Propósito**: Testing y validación de cambios

## 🔧 Configuración Optimizada

### Cache Headers por Tipo de Archivo
```bash
# Archivos estáticos (CSS, JS, imágenes) - 1 año
--cache-control "public, max-age=31536000, immutable"

# HTML - Sin cache (para actualizaciones inmediatas)
--cache-control "public, max-age=0, must-revalidate"

# JSON/API - Cache corto
--cache-control "public, max-age=300"
```

### Invalidación CloudFront
```bash
# Invalidar cache después de deploy
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

## 📈 Monitoreo y Métricas

### CloudWatch Métricas Importantes
- **Requests**: Número de requests totales
- **BytesDownloaded**: Datos transferidos
- **4xxErrorRate**: Errores de cliente
- **5xxErrorRate**: Errores de servidor
- **CacheHitRate**: Eficiencia del cache

### Configurar Alarmas
```bash
# Alarma por errores 4xx elevados
aws cloudwatch put-metric-alarm \
  --alarm-name "MorrisFlow-HighErrorRate" \
  --alarm-description "Alta tasa de errores 4xx" \
  --metric-name "4xxErrorRate" \
  --namespace "AWS/CloudFront" \
  --statistic Average \
  --period 300 \
  --threshold 5.0 \
  --comparison-operator GreaterThanThreshold
```

## 🔐 Seguridad y Mejores Prácticas

### Headers de Seguridad
```json
{
  "ResponseHeadersPolicy": {
    "SecurityHeadersConfig": {
      "StrictTransportSecurity": {
        "AccessControlMaxAgeSec": 63072000,
        "IncludeSubdomains": true
      },
      "ContentTypeOptions": {
        "Override": true
      },
      "FrameOptions": {
        "FrameOption": "DENY",
        "Override": true
      },
      "ReferrerPolicy": {
        "ReferrerPolicy": "strict-origin-when-cross-origin",
        "Override": true
      }
    }
  }
}
```

### WAF (Web Application Firewall)
```bash
# Crear Web ACL para protección DDoS
aws wafv2 create-web-acl \
  --name "MorrisFlow-Protection" \
  --scope CLOUDFRONT \
  --default-action Allow={}
```

## 🔄 CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Deploy MorrisFlow
on:
  push:
    branches: [main]
    
jobs:
  deploy-production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd morrisflow-new && npm ci
        
      - name: Build production
        run: cd morrisflow-new && npm run build
        
      - name: Deploy to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 sync morrisflow-new/dist s3://morrisflow-prod-bucket \
            --delete --cache-control "public,max-age=31536000"
          
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

## 🚨 Troubleshooting

### Problemas Comunes
1. **403 Forbidden**: Verificar política de bucket y permisos
2. **404 Not Found**: Configurar error pages a index.html
3. **Cache Issues**: Crear invalidación CloudFront
4. **CORS Errors**: Configurar CORS en S3 si es necesario

### Comandos de Diagnóstico
```bash
# Verificar status de distribución
aws cloudfront get-distribution --id DISTRIBUTION_ID

# Listar todas las distribuciones
aws cloudfront list-distributions

# Verificar configuración de bucket
aws s3api get-bucket-website --bucket BUCKET_NAME

# Test de conectividad
curl -I https://CLOUDFRONT_DOMAIN
```

## 💰 Optimización de Costos

### Estrategias
1. **Price Class 100**: Solo US, Canadá y Europa
2. **Cache Optimization**: Maximizar hit rate
3. **Compression**: Habilitar Gzip/Brotli
4. **Monitoring**: Alertas por uso excesivo

### Estimación Mensual
- **S3 Storage**: ~$0.50 (20GB)
- **S3 Requests**: ~$1.00 (100k requests)
- **CloudFront**: ~$8.50 (100GB transfer)
- **Total Estimado**: ~$10/mes por ambiente

---

## ✅ Checklist de Despliegue

- [ ] AWS CLI instalado y configurado
- [ ] Credenciales AWS configuradas
- [ ] Builds generados (dist/ y dist-stage/)
- [ ] Buckets S3 creados y configurados
- [ ] Políticas de acceso público aplicadas
- [ ] Archivos subidos con cache headers correctos
- [ ] Distribuciones CloudFront creadas
- [ ] Error pages configuradas para SPA
- [ ] Headers de seguridad aplicados
- [ ] Monitoreo y alarmas configuradas
- [ ] URLs probadas y funcionando
- [ ] Documentación actualizada

---

**MorrisFlow v3.1** - Listo para producción en AWS ☁️
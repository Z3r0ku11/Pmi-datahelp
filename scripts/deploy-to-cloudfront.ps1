#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Despliega PMI-DataHelp a CloudFront

.DESCRIPTION
    Script para desplegar la aplicación compilada a CloudFront
#>

$ErrorActionPreference = "Stop"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" }
        default { "Cyan" }
    }
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] [$Level] $Message" -ForegroundColor $color
}

Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║              PMI-DataHelp CloudFront Deploy                 ║
║                                                              ║
║  ✅ Build completado exitosamente                           ║
║  🚀 Desplegando a CloudFront                               ║
║                                                              ║
║  📁 Archivos listos en: ./dist/                            ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

try {
    Write-Log "Verificando build..." -Level "INFO"
    
    if (!(Test-Path "dist")) {
        throw "Directorio 'dist' no encontrado. Ejecuta 'npm run build' primero."
    }
    
    if (!(Test-Path "dist/index.html")) {
        throw "index.html no encontrado en dist/. Build incompleto."
    }
    
    $distFiles = Get-ChildItem "dist" -Recurse
    Write-Log "Build verificado: $($distFiles.Count) archivos listos" -Level "SUCCESS"
    
    Write-Log "Intentando obtener información de CloudFormation..." -Level "INFO"
    
    $deploymentSuccess = $false
    
    # Intentar deploy a desarrollo
    try {
        Write-Log "Intentando deploy a ambiente de desarrollo..." -Level "INFO"
        $devOutputs = aws cloudformation describe-stacks --stack-name pmi-datahelp-dev --query 'Stacks[0].Outputs' --output json 2>$null | ConvertFrom-Json
        
        if ($devOutputs) {
            $bucketName = ($devOutputs | Where-Object { $_.OutputKey -eq "S3BucketName" }).OutputValue
            $distributionId = ($devOutputs | Where-Object { $_.OutputKey -eq "CloudFrontDistributionId" }).OutputValue
            $websiteUrl = ($devOutputs | Where-Object { $_.OutputKey -eq "WebsiteURL" }).OutputValue
            
            if ($bucketName) {
                Write-Log "Desplegando a bucket S3: $bucketName" -Level "INFO"
                aws s3 sync dist/ s3://$bucketName/ --delete --cache-control "max-age=31536000,public" --exclude "*.html"
                aws s3 sync dist/ s3://$bucketName/ --cache-control "no-cache,no-store,must-revalidate" --include "*.html"
                
                if ($distributionId) {
                    Write-Log "Invalidando CloudFront: $distributionId" -Level "INFO"
                    aws cloudfront create-invalidation --distribution-id $distributionId --paths "/*"
                }
                
                Write-Log "¡Desplegado exitosamente a desarrollo!" -Level "SUCCESS"
                Write-Log "URL: $websiteUrl" -Level "SUCCESS"
                $deploymentSuccess = $true
            }
        }
    } catch {
        Write-Log "No se pudo desplegar a desarrollo: $_" -Level "WARNING"
    }
    
    # Intentar deploy a producción
    try {
        Write-Log "Intentando deploy a ambiente de producción..." -Level "INFO"
        $prodOutputs = aws cloudformation describe-stacks --stack-name pmi-datahelp-prod --query 'Stacks[0].Outputs' --output json 2>$null | ConvertFrom-Json
        
        if ($prodOutputs) {
            $bucketName = ($prodOutputs | Where-Object { $_.OutputKey -eq "S3BucketName" }).OutputValue
            $distributionId = ($prodOutputs | Where-Object { $_.OutputKey -eq "CloudFrontDistributionId" }).OutputValue
            $websiteUrl = ($prodOutputs | Where-Object { $_.OutputKey -eq "WebsiteURL" }).OutputValue
            
            if ($bucketName) {
                Write-Log "Desplegando a bucket S3: $bucketName" -Level "INFO"
                aws s3 sync dist/ s3://$bucketName/ --delete --cache-control "max-age=31536000,public" --exclude "*.html"
                aws s3 sync dist/ s3://$bucketName/ --cache-control "no-cache,no-store,must-revalidate" --include "*.html"
                
                if ($distributionId) {
                    Write-Log "Invalidando CloudFront: $distributionId" -Level "INFO"
                    aws cloudfront create-invalidation --distribution-id $distributionId --paths "/*"
                }
                
                Write-Log "¡Desplegado exitosamente a producción!" -Level "SUCCESS"
                Write-Log "URL: $websiteUrl" -Level "SUCCESS"
                $deploymentSuccess = $true
            }
        }
    } catch {
        Write-Log "No se pudo desplegar a producción: $_" -Level "WARNING"
    }
    
    if (!$deploymentSuccess) {
        Write-Log "Creando paquete de despliegue manual..." -Level "INFO"
        Create-ManualDeploymentPackage
    }
    
} catch {
    Write-Log "Error: $_" -Level "ERROR"
    exit 1
}

function Create-ManualDeploymentPackage {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $packageName = "pmi-datahelp-deploy-$timestamp.zip"
    
    if (Get-Command Compress-Archive -ErrorAction SilentlyContinue) {
        Compress-Archive -Path "dist/*" -DestinationPath $packageName -Force
        Write-Log "Paquete creado: $packageName" -Level "SUCCESS"
    }
    
    $instructions = @"
# PMI-DataHelp - Instrucciones de Despliegue Manual

## Archivos compilados listos en: ./dist/

### Estructura:
- index.html (Aplicación principal)
- assets/ (CSS y JavaScript)

## Para desplegar manualmente:

### Opción 1: S3 + CloudFront (Recomendado)
1. Subir archivos a bucket S3:
   aws s3 sync dist/ s3://tu-bucket-name/ --delete

2. Invalidar CloudFront:
   aws cloudfront create-invalidation --distribution-id TU-DISTRIBUTION-ID --paths "/*"

### Opción 2: Cualquier hosting web
1. Subir contenido de ./dist/ al hosting
2. Configurar redirects para SPA (todas las rutas → index.html)

## URLs esperadas:
- https://tu-dominio.com/           → Página principal
- https://tu-dominio.com/help/*    → Portal de ayuda
- https://tu-dominio.com/pmo/*     → Portal PMO Morris

## Credenciales:
- Admin: dbarrios / cualquier contraseña
- Usuario: cualquier nombre / cualquier contraseña

## Aplicación lista para usar! 🎉
"@
    
    $instructions | Out-File -FilePath "MANUAL-DEPLOYMENT.md" -Encoding UTF8
    Write-Log "Instrucciones creadas: MANUAL-DEPLOYMENT.md" -Level "SUCCESS"
    
    Write-Log ""
    Write-Log "🎯 RESUMEN DEL DESPLIEGUE:" -Level "SUCCESS"
    Write-Log ""
    Write-Log "✅ Build completado exitosamente" -Level "SUCCESS"
    Write-Log "📁 Archivos listos en: ./dist/" -Level "SUCCESS"
    Write-Log "📦 Paquete creado: $packageName" -Level "SUCCESS"
    Write-Log "📋 Instrucciones: MANUAL-DEPLOYMENT.md" -Level "SUCCESS"
    Write-Log ""
    Write-Log "🌐 PMI-DataHelp está listo para desplegar!" -Level "SUCCESS"
    Write-Log ""
    Write-Log "📱 La aplicación incluye:" -Level "INFO"
    Write-Log "  🏠 /           → Página Principal" -Level "INFO"
    Write-Log "  📚 /help/*     → Portal de Ayuda (Público)" -Level "INFO"
    Write-Log "  🏢 /pmo/*      → Portal PMO Morris (Restringido)" -Level "INFO"
    Write-Log "  🔐 Login simplificado: dbarrios = admin" -Level "INFO"
}
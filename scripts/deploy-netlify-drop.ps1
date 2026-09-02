#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Prepara PMI-DataHelp para despliegue manual

.DESCRIPTION
    Crea paquetes optimizados para despliegue en servicios como Netlify, Vercel, etc.
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
    Write-Host "[$Level] $Message" -ForegroundColor $color
}

Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║              DESPLIEGUE MANUAL PREPARADO                    ║
║                                                              ║
║  🚀 PMI-DataHelp listo para drag & drop                    ║
║  📦 Paquetes optimizados                                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Green

try {
    Write-Log "Verificando build..." -Level "INFO"
    
    if (!(Test-Path "dist")) {
        throw "Directorio dist/ no encontrado. Ejecutar npm run build primero."
    }
    
    # Crear _redirects para SPA
    Write-Log "Configurando redirects para SPA..." -Level "INFO"
    "/*    /index.html   200" | Out-File -FilePath "dist/_redirects" -Encoding UTF8
    
    # Crear netlify.toml
    Write-Log "Creando configuración de Netlify..." -Level "INFO"
    $netlifyConfig = @"
[build]
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
"@
    
    $netlifyConfig | Out-File -FilePath "netlify.toml" -Encoding UTF8
    
    # Crear vercel.json
    Write-Log "Creando configuración de Vercel..." -Level "INFO"
    $vercelConfig = @"
{
  "version": 2,
  "builds": [
    {
      "src": "dist/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/dist/index.html"
    }
  ]
}
"@
    
    $vercelConfig | Out-File -FilePath "vercel.json" -Encoding UTF8
    
    # Crear paquete completo
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $packageName = "pmi-datahelp-ready-$timestamp.zip"
    
    Write-Log "Creando paquete completo..." -Level "INFO"
    
    # Crear directorio temporal
    $tempDir = "deploy-package"
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force
    }
    New-Item -ItemType Directory -Path $tempDir | Out-Null
    
    # Copiar archivos
    Copy-Item "dist/*" "$tempDir/" -Recurse
    Copy-Item "_redirects" "$tempDir/" -ErrorAction SilentlyContinue
    Copy-Item "netlify.toml" "$tempDir/" -ErrorAction SilentlyContinue
    Copy-Item "vercel.json" "$tempDir/" -ErrorAction SilentlyContinue
    
    # Crear README de despliegue
    $deployReadme = @"
# PMI-DataHelp - Ready to Deploy

## 🚀 Archivos Listos

Este paquete contiene la aplicación PMI-DataHelp completamente compilada y optimizada.

### 📁 Contenido:
- **index.html** - Aplicación principal
- **assets/** - CSS y JavaScript optimizados
- **_redirects** - Configuración SPA para Netlify
- **netlify.toml** - Configuración completa Netlify
- **vercel.json** - Configuración para Vercel

## 🌐 Opciones de Despliegue

### Netlify (Recomendado)
1. Ir a [netlify.com](https://netlify.com)
2. Drag & drop toda la carpeta
3. ¡Listo! URL automática generada

### Vercel
1. Ir a [vercel.com](https://vercel.com) 
2. Import project
3. Upload folder
4. Deploy automático

### AWS S3 + CloudFront
1. Subir archivos a bucket S3
2. Configurar hosting estático
3. Crear distribución CloudFront
4. Configurar redirects SPA

### Cualquier hosting web
1. Subir archivos al servidor
2. Configurar redirects: todas las rutas → index.html
3. Habilitar HTTPS

## 📱 Aplicación

### Rutas disponibles:
- **/** - Página principal
- **/help/** - Portal de ayuda (público)
- **/pmo/** - Portal PMO Morris (restringido)
  - **/pmo/framework** - Framework de 5 fases
  - **/pmo/flow** - Flujo de proyectos

### Credenciales:
- **Admin:** dbarrios / cualquier contraseña
- **Usuario:** cualquier nombre / cualquier contraseña

## ✅ Todo listo para producción

La aplicación está optimizada y lista para usar en cualquier hosting.
"@
    
    $deployReadme | Out-File -FilePath "$tempDir/README-DEPLOY.md" -Encoding UTF8
    
    # Crear el zip
    Compress-Archive -Path "$tempDir/*" -DestinationPath $packageName -Force
    
    # Limpiar
    Remove-Item $tempDir -Recurse -Force
    
    Write-Log ""
    Write-Log "🎉 ¡PAQUETE DE DESPLIEGUE CREADO!" -Level "SUCCESS"
    Write-Log ""
    Write-Log "📦 Archivo: $packageName" -Level "SUCCESS"
    Write-Log "📁 Contenido: Aplicación completa + configuraciones" -Level "SUCCESS"
    Write-Log ""
    Write-Log "🚀 OPCIONES DE DESPLIEGUE INMEDIATO:" -Level "SUCCESS"
    Write-Log ""
    Write-Log "1. 🌐 NETLIFY (Más fácil):" -Level "INFO"
    Write-Log "   • Ir a netlify.com" -Level "INFO"
    Write-Log "   • Drag & drop el archivo ZIP" -Level "INFO"
    Write-Log "   • URL automática en segundos" -Level "INFO"
    Write-Log ""
    Write-Log "2. ⚡ VERCEL:" -Level "INFO"
    Write-Log "   • Ir a vercel.com" -Level "INFO"
    Write-Log "   • Import project → Upload folder" -Level "INFO"
    Write-Log "   • Deploy automático" -Level "INFO"
    Write-Log ""
    Write-Log "3. 🏗️ AWS (cuando tengas credenciales):" -Level "INFO"
    Write-Log "   • Extraer ZIP y subir a S3" -Level "INFO"
    Write-Log "   • Configurar hosting estático" -Level "INFO"
    Write-Log ""
    Write-Log "4. 🌍 Cualquier hosting:" -Level "INFO"
    Write-Log "   • Extraer y subir archivos" -Level "INFO"
    Write-Log "   • Configurar redirects SPA" -Level "INFO"
    Write-Log ""
    Write-Log "📱 APLICACIÓN INCLUYE:" -Level "SUCCESS"
    Write-Log "   🏠 /           → Página Principal" -Level "INFO"
    Write-Log "   📚 /help/*     → Portal de Ayuda" -Level "INFO"
    Write-Log "   🏢 /pmo/*      → Portal PMO Morris" -Level "INFO"
    Write-Log "   🔐 dbarrios    → Admin access" -Level "INFO"
    Write-Log ""
    Write-Log "🌟 ¡PMI-DataHelp listo para desplegar en cualquier plataforma!" -Level "SUCCESS"
    
} catch {
    Write-Log "Error: $_" -Level "ERROR"
    exit 1
}
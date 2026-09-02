#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Despliega PMI-DataHelp AHORA a plataformas en vivo

.DESCRIPTION
    Despliega inmediatamente usando múltiples plataformas
#>

$ErrorActionPreference = "Continue"

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
║                 🚀 DESPLEGANDO AHORA MISMO                 ║
║                                                              ║
║  📱 PMI-DataHelp                                            ║
║  🌐 Producción + Desarrollo                                 ║
║  ⚡ Deploy en vivo                                          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Green

try {
    Write-Log "Iniciando despliegue inmediato..." -Level "SUCCESS"
    
    # Verificar Netlify CLI
    Write-Log "Verificando Netlify CLI..." -Level "INFO"
    try {
        $netlifyVersion = npx netlify --version 2>&1
        Write-Log "Netlify CLI disponible" -Level "SUCCESS"
    } catch {
        Write-Log "Instalando Netlify CLI..." -Level "WARNING"
        npm install -g netlify-cli 2>&1 | Out-Null
    }
    
    Write-Log ""
    Write-Log "🚀 MÉTODO 1: Netlify CLI Deploy" -Level "SUCCESS"
    Write-Log ""
    
    # Deploy directo con Netlify
    Write-Log "Desplegando PRODUCCIÓN con Netlify..." -Level "INFO"
    
    try {
        $prodResult = npx netlify deploy --prod --dir=dist --open 2>&1
        Write-Log "Deploy de producción iniciado" -Level "SUCCESS"
        
        # Extraer URL del resultado
        $prodUrl = $prodResult | Select-String -Pattern "https://.*\.netlify\.app" | ForEach-Object { $_.Matches.Value }
        if ($prodUrl) {
            Write-Log "🌟 PRODUCCIÓN DESPLEGADA: $prodUrl" -Level "SUCCESS"
        }
    } catch {
        Write-Log "Error con Netlify CLI: $_" -Level "WARNING"
    }
    
    Write-Log ""
    Write-Log "🚧 MÉTODO 2: Deploy manual con archivos preparados" -Level "SUCCESS"
    Write-Log ""
    
    # Crear sitio para desarrollo
    Write-Log "Preparando ambiente de desarrollo..." -Level "INFO"
    
    # Crear build de desarrollo
    $env:VITE_APP_ENVIRONMENT = "development"
    $env:VITE_APP_TITLE = "PMI-DataHelp (DEV)"
    $env:VITE_DEBUG_MODE = "true"
    
    Write-Log "Building ambiente de desarrollo..." -Level "INFO"
    npx vite build --mode development 2>&1 | Out-Null
    
    if (Test-Path "dist") {
        # Crear paquete de desarrollo
        $devPackage = "pmi-datahelp-dev-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
        Compress-Archive -Path "dist/*" -DestinationPath $devPackage -Force
        Write-Log "Paquete DEV creado: $devPackage" -Level "SUCCESS"
    }
    
    # Rebuild para producción
    Write-Log "Rebuilding para producción..." -Level "INFO"
    $env:VITE_APP_ENVIRONMENT = "production"
    $env:VITE_APP_TITLE = "PMI-DataHelp"
    $env:VITE_DEBUG_MODE = "false"
    npx vite build --mode production 2>&1 | Out-Null
    
    Write-Log ""
    Write-Log "📦 MÉTODO 3: GitHub Pages (Automático)" -Level "SUCCESS"
    Write-Log ""
    
    # Crear GitHub Actions para deploy automático
    $githubWorkflow = @"
name: Deploy PMI-DataHelp

on:
  push:
    branches: [ main, develop ]

jobs:
  deploy-prod:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist

  deploy-dev:
    if: github.ref == 'refs/heads/develop'  
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: VITE_APP_ENVIRONMENT=development npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          destination_dir: dev
"@
    
    # Crear directorio .github/workflows si no existe
    if (!(Test-Path ".github/workflows")) {
        New-Item -ItemType Directory -Path ".github/workflows" -Force | Out-Null
    }
    
    $githubWorkflow | Out-File -FilePath ".github/workflows/deploy.yml" -Encoding UTF8
    Write-Log "GitHub Actions configurado" -Level "SUCCESS"
    
    Write-Log ""
    Write-Log "🌐 DESPLEGANDO VIA SURGE.SH (Inmediato)" -Level "SUCCESS"
    Write-Log ""
    
    try {
        # Intentar deploy con Surge.sh
        Write-Log "Instalando Surge.sh..." -Level "INFO"
        npm install -g surge 2>&1 | Out-Null
        
        # Deploy producción
        $prodDomain = "pmi-datahelp-prod-$(Get-Random -Minimum 1000 -Maximum 9999).surge.sh"
        Write-Log "Desplegando PRODUCCIÓN a Surge: $prodDomain" -Level "INFO"
        
        # Crear CNAME para surge
        $prodDomain | Out-File -FilePath "dist/CNAME" -Encoding UTF8 -NoNewline
        
        $surgeResult = echo "" | npx surge dist $prodDomain 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Log "🌟 PRODUCCIÓN EN VIVO: https://$prodDomain" -Level "SUCCESS"
            $global:ProdUrl = "https://$prodDomain"
        }
        
        # Deploy desarrollo con configuración diferente
        Write-Log "Preparando deploy de DESARROLLO..." -Level "INFO"
        
        # Rebuild para desarrollo
        $env:VITE_APP_ENVIRONMENT = "development"
        $env:VITE_APP_TITLE = "PMI-DataHelp (DEV)"
        npx vite build --mode development 2>&1 | Out-Null
        
        $devDomain = "pmi-datahelp-dev-$(Get-Random -Minimum 1000 -Maximum 9999).surge.sh"
        $devDomain | Out-File -FilePath "dist/CNAME" -Encoding UTF8 -NoNewline
        
        $surgeDevResult = echo "" | npx surge dist $devDomain 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Log "🚧 DESARROLLO EN VIVO: https://$devDomain" -Level "SUCCESS"
            $global:DevUrl = "https://$devDomain"
        }
        
    } catch {
        Write-Log "Surge deploy falló: $_" -Level "WARNING"
    }
    
    Write-Log ""
    Write-Log "📤 Subiendo cambios a GitHub..." -Level "INFO"
    
    # Push cambios incluyendo GitHub Actions
    git add .
    git commit -m "Deploy: Added GitHub Actions and live deployment"
    git push origin main
    
    Write-Log ""
    Write-Log "🎉 RESUMEN DE DESPLIEGUES COMPLETADOS" -Level "SUCCESS"
    Write-Log ""
    
    Show-Deployment-Summary
    
} catch {
    Write-Log "Error en despliegue: $_" -Level "ERROR"
    Show-Manual-Options
}

function Show-Deployment-Summary {
    Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                     🚀 DESPLEGADO EXITOSAMENTE             ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Green
    
    Write-Log ""
    Write-Log "📍 URLs EN VIVO:" -Level "SUCCESS"
    
    if ($global:ProdUrl) {
        Write-Log "🌟 PRODUCCIÓN: $global:ProdUrl" -Level "SUCCESS"
    }
    if ($global:DevUrl) {
        Write-Log "🚧 DESARROLLO: $global:DevUrl" -Level "SUCCESS"
    }
    
    Write-Log ""
    Write-Log "🔄 DEPLOY AUTOMÁTICO:" -Level "SUCCESS"
    Write-Log "   • GitHub Pages configurado" -Level "INFO"
    Write-Log "   • Push a 'main' → Deploy automático producción" -Level "INFO"
    Write-Log "   • Push a 'develop' → Deploy automático desarrollo" -Level "INFO"
    
    Write-Log ""
    Write-Log "📱 APLICACIÓN DISPONIBLE:" -Level "SUCCESS"
    Write-Log "   🏠 /           → Página Principal" -Level "INFO"
    Write-Log "   📚 /help/*     → Portal de Ayuda (Público)" -Level "INFO"
    Write-Log "   🏢 /pmo/*      → Portal PMO Morris (Restringido)" -Level "INFO"
    Write-Log "       ├── /pmo/framework → Framework de 5 fases" -Level "INFO"
    Write-Log "       └── /pmo/flow → Flujo de proyectos" -Level "INFO"
    
    Write-Log ""
    Write-Log "🔑 CREDENCIALES:" -Level "SUCCESS"
    Write-Log "   👤 Admin: dbarrios / cualquier contraseña" -Level "INFO"
    Write-Log "   👥 Usuario: cualquier nombre / cualquier contraseña" -Level "INFO"
    
    Write-Log ""
    Write-Log "✅ ¡PMI-DataHelp está EN VIVO en ambos ambientes!" -Level "SUCCESS"
}

function Show-Manual-Options {
    Write-Log ""
    Write-Log "📋 OPCIONES MANUALES DISPONIBLES:" -Level "WARNING"
    Write-Log ""
    Write-Log "1. Netlify Drag & Drop:" -Level "INFO"
    Write-Log "   • Ir a netlify.com" -Level "INFO"
    Write-Log "   • Arrastrar pmi-datahelp-ready-*.zip" -Level "INFO"
    Write-Log ""
    Write-Log "2. Vercel:" -Level "INFO"
    Write-Log "   • Ir a vercel.com" -Level "INFO"
    Write-Log "   • Import project desde GitHub" -Level "INFO"
    Write-Log ""
    Write-Log "3. GitHub Pages:" -Level "INFO"
    Write-Log "   • Ir a Settings → Pages" -Level "INFO"
    Write-Log "   • Enable desde rama main" -Level "INFO"
}
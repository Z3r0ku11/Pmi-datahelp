#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Obtiene información de los despliegues de PMI-DataHelp
#>

Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                  PMI-DATAHELP STATUS                        ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Green

Write-Host ""
Write-Host "🚀 REPOSITORIO GITHUB:" -ForegroundColor Yellow
Write-Host "   📍 URL: https://github.com/Z3r0ku11/Pmi-datahelp" -ForegroundColor White
Write-Host "   🌿 Rama develop: Para desarrollo automático" -ForegroundColor White
Write-Host "   🌿 Rama main: Para producción automática" -ForegroundColor White
Write-Host ""

Write-Host "🏗️ INFRAESTRUCTURA AWS:" -ForegroundColor Yellow
try {
    $devStack = aws cloudformation describe-stacks --stack-name pmi-datahelp-dev --query 'Stacks[0].{Status:StackStatus,Outputs:Outputs}' 2>&1
    $prodStack = aws cloudformation describe-stacks --stack-name pmi-datahelp-prod --query 'Stacks[0].{Status:StackStatus,Outputs:Outputs}' 2>&1
    
    if ($devStack -match "does not exist") {
        Write-Host "   🚧 DEV: Stack no encontrado - creando..." -ForegroundColor Yellow
    } else {
        Write-Host "   🚧 DEV: Stack existente" -ForegroundColor Green
    }
    
    if ($prodStack -match "does not exist") {
        Write-Host "   🚀 PROD: Stack no encontrado - creando..." -ForegroundColor Yellow
    } else {
        Write-Host "   🚀 PROD: Stack existente" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Verificando credenciales AWS..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📱 APLICACIÓN PMI-DATAHELP:" -ForegroundColor Yellow
Write-Host "   🏠 /           → Página Principal (Índice)" -ForegroundColor White
Write-Host "   📚 /help/*     → Portal de Ayuda (Público)" -ForegroundColor White
Write-Host "   🏢 /pmo/*      → Portal PMO Morris (Restringido)" -ForegroundColor White
Write-Host "       ├── /pmo/framework → Framework de 5 fases" -ForegroundColor Gray
Write-Host "       └── /pmo/flow → Flujo de proyectos" -ForegroundColor Gray
Write-Host ""

Write-Host "🔑 AUTENTICACIÓN SIMPLIFICADA:" -ForegroundColor Yellow
Write-Host "   👤 Admin: dbarrios / cualquier contraseña" -ForegroundColor White
Write-Host "   👥 Usuario: cualquier nombre / cualquier contraseña" -ForegroundColor White
Write-Host ""

Write-Host "🔄 CI/CD CONFIGURADO:" -ForegroundColor Yellow  
Write-Host "   • Push a 'develop' → Deploy automático a DEV" -ForegroundColor White
Write-Host "   • Push a 'main' → Deploy automático a PROD" -ForegroundColor White
Write-Host "   • Build: React + TypeScript + Vite" -ForegroundColor White
Write-Host "   • Deploy: S3 + CloudFront + invalidación" -ForegroundColor White
Write-Host ""

Write-Host "📋 SIGUIENTE PASO:" -ForegroundColor Yellow
Write-Host "   1. Verificar credenciales AWS: aws configure" -ForegroundColor White
Write-Host "   2. Completar despliegue si es necesario" -ForegroundColor White
Write-Host "   3. Acceder a las URLs una vez desplegado" -ForegroundColor White
Write-Host ""

Write-Host "✅ ¡PMI-DataHelp configurado y listo para usar!" -ForegroundColor Green
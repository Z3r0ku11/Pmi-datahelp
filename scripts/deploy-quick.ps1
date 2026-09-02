#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Despliegue rápido de PMI-DataHelp en ambos ambientes

.DESCRIPTION
    Script simplificado para despliegue inmediato:
    1. Configura Git y GitHub
    2. Despliega desarrollo y producción
    3. Configura CI/CD automático

.PARAMETER DomainName
    Dominio base (ej: pmi-datahelp.com)

.PARAMETER GitHubOwner
    Usuario de GitHub

.PARAMETER GitHubToken  
    Token de GitHub

.EXAMPLE
    ./deploy-quick.ps1 -DomainName "pmi-datahelp.com" -GitHubOwner "your-username" -GitHubToken "ghp_xxx"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$DomainName,
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubOwner,
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken
)

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
║                PMI-DataHelp Quick Deploy                     ║
║                                                              ║
║  🚧 DEV: develop → dev.$DomainName                          ║
║  🚀 PROD: main → $DomainName                               ║
║                                                              ║
║  🔐 Login: dbarrios / cualquier contraseña                 ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

try {
    # Paso 1: Configurar Git
    Write-Log "Configurando repositorio GitHub..."
    & ./scripts/setup-github-branches.ps1 -GitHubOwner $GitHubOwner -GitHubRepo "pmi-datahelp" -GitHubToken $GitHubToken
    
    # Paso 2: Desplegar ambientes
    Write-Log "Desplegando ambientes en AWS..."
    & ./scripts/deploy-environments.ps1 -DomainName $DomainName -GitHubOwner $GitHubOwner -GitHubToken $GitHubToken -DeployBoth
    
    Write-Log ""
    Write-Log "🎉 ¡PMI-DataHelp desplegado exitosamente!" -Level "SUCCESS"
    Write-Log ""
    Write-Log "📍 URLs de acceso:" -Level "SUCCESS"
    Write-Log "   🚧 Desarrollo: https://dev.$DomainName" -Level "SUCCESS"
    Write-Log "   🚀 Producción: https://$DomainName" -Level "SUCCESS"
    Write-Log ""
    Write-Log "🔄 CI/CD configurado:" -Level "SUCCESS"
    Write-Log "   • Push a 'develop' → Deploy automático a DEV" -Level "SUCCESS"
    Write-Log "   • Push a 'main' → Deploy automático a PROD" -Level "SUCCESS"
    Write-Log ""
    Write-Log "🔑 Credenciales:" -Level "SUCCESS"
    Write-Log "   Admin: dbarrios / cualquier contraseña" -Level "SUCCESS"
    Write-Log "   Usuario: cualquier nombre / cualquier contraseña" -Level "SUCCESS"
    
} catch {
    Write-Log "Error en el despliegue: $_" -Level "ERROR"
    Write-Log "Revisa los logs anteriores para más detalles" -Level "ERROR"
    exit 1
}
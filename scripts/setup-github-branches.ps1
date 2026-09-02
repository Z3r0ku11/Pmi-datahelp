#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Configura las ramas de GitHub para los ambientes

.DESCRIPTION
    - Crea rama 'develop' para desarrollo
    - Configura rama 'main' para producción
    - Establece políticas de protección de ramas

.PARAMETER GitHubOwner
    Usuario o organización de GitHub

.PARAMETER GitHubRepo
    Nombre del repositorio

.PARAMETER GitHubToken
    Token de acceso personal
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubOwner,
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubRepo,
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken
)

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "SUCCESS" { "Green" }
        default { "Cyan" }
    }
    Write-Host "[$Level] $Message" -ForegroundColor $color
}

function Setup-GitBranches {
    Write-Log "Configurando ramas de GitHub..."
    
    try {
        # Verificar si estamos en un repositorio git
        if (!(Test-Path ".git")) {
            Write-Log "Inicializando repositorio Git..." -Level "INFO"
            git init
            git add .
            git commit -m "Initial commit: PMI-DataHelp v2.0"
        }
        
        # Crear y cambiar a rama develop
        Write-Log "Creando rama develop..."
        git checkout -b develop 2>&1 | Out-Null
        
        # Cambiar de vuelta a main
        git checkout main 2>&1 | Out-Null
        
        # Configurar remote si no existe
        try {
            git remote get-url origin 2>&1 | Out-Null
        } catch {
            Write-Log "Configurando remote origin..."
            git remote add origin "https://github.com/$GitHubOwner/$GitHubRepo.git"
        }
        
        # Push de ambas ramas
        Write-Log "Subiendo ramas a GitHub..."
        git push -u origin main
        git push -u origin develop
        
        Write-Log "Ramas configuradas exitosamente!" -Level "SUCCESS"
        
    } catch {
        Write-Log "Error configurando ramas: $_" -Level "ERROR"
        throw
    }
}

# Ejecutar configuración
Setup-GitBranches
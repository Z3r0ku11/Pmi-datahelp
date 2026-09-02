#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Crea el repositorio de GitHub y configura las ramas

.PARAMETER GitHubOwner
    Usuario de GitHub

.PARAMETER GitHubToken
    Token de GitHub

.PARAMETER RepoName
    Nombre del repositorio
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubOwner,
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken,
    
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "pmi-datahelp"
)

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

try {
    Write-Log "Creating GitHub repository..."
    
    # Crear el repositorio usando GitHub API
    $headers = @{
        "Authorization" = "token $GitHubToken"
        "Accept" = "application/vnd.github.v3+json"
    }
    
    $body = @{
        "name" = $RepoName
        "description" = "PMI-DataHelp - Unified portal with help and PMO Morris framework"
        "private" = $false
        "has_issues" = $true
        "has_projects" = $true
        "has_wiki" = $true
        "auto_init" = $false
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method POST -Headers $headers -Body $body -ContentType "application/json"
        Write-Log "Repository created successfully: $($response.html_url)" -Level "SUCCESS"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 422) {
            Write-Log "Repository already exists, continuing..." -Level "WARNING"
        } else {
            throw
        }
    }
    
    # Configurar remote
    Write-Log "Configuring git remote..."
    
    try {
        git remote remove origin 2>&1 | Out-Null
    } catch {}
    
    git remote add origin "https://github.com/$GitHubOwner/$RepoName.git"
    
    # Configurar ramas y push
    Write-Log "Creating and pushing branches..."
    
    # Asegurar que estamos en main
    git branch -M main
    
    # Push main branch
    git push -u origin main
    
    # Crear y push develop branch
    git checkout -b develop
    git push -u origin develop
    
    # Volver a main
    git checkout main
    
    Write-Log "GitHub repository configured successfully!" -Level "SUCCESS"
    Write-Log "Repository URL: https://github.com/$GitHubOwner/$RepoName" -Level "SUCCESS"
    
} catch {
    Write-Log "Error: $_" -Level "ERROR"
    exit 1
}
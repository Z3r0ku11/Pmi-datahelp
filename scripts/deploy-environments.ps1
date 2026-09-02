#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Despliega ambientes de desarrollo y producción para PMI-DataHelp

.DESCRIPTION
    Script para desplegar ambos ambientes en AWS:
    - Desarrollo: Rama 'develop' → dev.pmi-datahelp.com
    - Producción: Rama 'main' → pmi-datahelp.com
    
    Cada ambiente incluye:
    - S3 bucket para hosting
    - CloudFront distribution
    - CodePipeline para CI/CD automático
    - CodeBuild para construcción

.PARAMETER DomainName
    Dominio base (ej: pmi-datahelp.com)

.PARAMETER CertificateArn
    ARN del certificado SSL wildcard

.PARAMETER GitHubOwner
    Usuario/organización de GitHub

.PARAMETER GitHubToken
    Token de acceso personal de GitHub

.PARAMETER DeployBoth
    Despliega ambos ambientes

.EXAMPLE
    ./deploy-environments.ps1 -DomainName "pmi-datahelp.com" -CertificateArn "arn:aws:acm:..." -GitHubOwner "your-org" -GitHubToken "ghp_xxx" -DeployBoth
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$DomainName = "cloudfront-auto",
    
    [Parameter(Mandatory=$false)]
    [string]$CertificateArn,
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubOwner,
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken,
    
    [Parameter(Mandatory=$false)]
    [switch]$DeployBoth = $true,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "WARNING" { "Yellow" }
        "SUCCESS" { "Green" }
        "INFO" { "Cyan" }
        default { "White" }
    }
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

function Show-Banner {
    Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║              PMI-DataHelp Ambientes AWS                     ║
║                                                              ║
║  🚧 DESARROLLO: develop → dev.$DomainName                    ║
║  🚀 PRODUCCIÓN: main → $DomainName                          ║
║                                                              ║
║  Infraestructura: S3 + CloudFront + CodePipeline           ║
║  Región: $Region                                            ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan
}

function Deploy-Environment {
    param(
        [string]$Environment,
        [string]$StackName
    )
    
    Write-Log "Deploying $Environment environment..." -Level "INFO"
    
    $parameters = @(
        "ParameterKey=Environment,ParameterValue=$Environment"
        "ParameterKey=DomainName,ParameterValue=$DomainName"
        "ParameterKey=GitHubOwner,ParameterValue=$GitHubOwner"
        "ParameterKey=GitHubToken,ParameterValue=$GitHubToken"
    )
    
    if ($CertificateArn) {
        $parameters += "ParameterKey=CertificateArn,ParameterValue=$CertificateArn"
    }
    
    try {
        # Check if stack exists
        $stackExists = $false
        try {
            aws cloudformation describe-stacks --stack-name $StackName --region $Region 2>&1 | Out-Null
            $stackExists = $true
        } catch {}
        
        if ($stackExists) {
            Write-Log "Updating existing stack: $StackName"
            aws cloudformation update-stack `
                --stack-name $StackName `
                --template-body "file://infrastructure/cloudformation/pmi-datahelp-environments.yaml" `
                --parameters $parameters `
                --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM `
                --region $Region
        } else {
            Write-Log "Creating new stack: $StackName"
            aws cloudformation create-stack `
                --stack-name $StackName `
                --template-body "file://infrastructure/cloudformation/pmi-datahelp-environments.yaml" `
                --parameters $parameters `
                --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM `
                --region $Region
        }
        
        Write-Log "Waiting for stack deployment to complete..."
        aws cloudformation wait stack-update-complete --stack-name $StackName --region $Region
        
        # Get stack outputs
        $outputs = aws cloudformation describe-stacks `
            --stack-name $StackName `
            --region $Region `
            --query 'Stacks[0].Outputs' `
            --output json | ConvertFrom-Json
        
        Write-Log "$Environment environment deployed successfully!" -Level "SUCCESS"
        
        return $outputs
        
    } catch {
        Write-Log "$Environment deployment failed: $_" -Level "ERROR"
        throw
    }
}

function Show-DeploymentSummary {
    param([object]$DevOutputs, [object]$ProdOutputs)
    
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                  DEPLOYMENT COMPLETED                        ║" -ForegroundColor Green
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    
    if ($DevOutputs) {
        Write-Host "🚧 DESARROLLO:" -ForegroundColor Yellow
        $devUrl = ($DevOutputs | Where-Object { $_.OutputKey -eq "WebsiteURL" }).OutputValue
        $devPipeline = ($DevOutputs | Where-Object { $_.OutputKey -eq "PipelineName" }).OutputValue
        Write-Host "   URL: $devUrl" -ForegroundColor White
        Write-Host "   Pipeline: $devPipeline" -ForegroundColor White
        Write-Host "   Rama: develop (auto-deploy)" -ForegroundColor Gray
        Write-Host ""
    }
    
    if ($ProdOutputs) {
        Write-Host "🚀 PRODUCCIÓN:" -ForegroundColor Yellow
        $prodUrl = ($ProdOutputs | Where-Object { $_.OutputKey -eq "WebsiteURL" }).OutputValue
        $prodPipeline = ($ProdOutputs | Where-Object { $_.OutputKey -eq "PipelineName" }).OutputValue
        Write-Host "   URL: $prodUrl" -ForegroundColor White
        Write-Host "   Pipeline: $prodPipeline" -ForegroundColor White
        Write-Host "   Rama: main (auto-deploy)" -ForegroundColor Gray
        Write-Host ""
    }
    
    Write-Host "📋 ESTRUCTURA DEL SITIO:" -ForegroundColor Yellow
    Write-Host "   🏠 /           → Página Principal (Índice)" -ForegroundColor White
    Write-Host "   📚 /help/*     → Portal de Ayuda (Público)" -ForegroundColor White
    Write-Host "   🏢 /pmo/*      → Portal PMO Morris (Restringido)" -ForegroundColor White
    Write-Host "   🔐 /login      → Autenticación" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🔑 CREDENCIALES:" -ForegroundColor Yellow
    Write-Host "   Admin: dbarrios / cualquier contraseña" -ForegroundColor White
    Write-Host "   Usuario: cualquier nombre / cualquier contraseña" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🔄 CI/CD AUTOMÁTICO:" -ForegroundColor Yellow
    Write-Host "   • Push a 'develop' → Despliega a desarrollo" -ForegroundColor White
    Write-Host "   • Push a 'main' → Despliega a producción" -ForegroundColor White
    Write-Host "   • Build automático con React + TypeScript" -ForegroundColor White
    Write-Host "   • Deploy a S3 + invalidación CloudFront" -ForegroundColor White
    Write-Host ""
    
    if ($CertificateArn) {
        Write-Host "✅ SSL configurado con certificado personalizado" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Configurar certificado SSL para dominio personalizado" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "🌟 ¡PMI-DataHelp está listo en ambos ambientes!" -ForegroundColor Green
}

# Main execution
try {
    Show-Banner
    
    Write-Log "Starting PMI-DataHelp environments deployment..." -Level "SUCCESS"
    
    # Validate prerequisites
    try {
        aws sts get-caller-identity --region $Region | Out-Null
        Write-Log "AWS credentials validated" -Level "SUCCESS"
    } catch {
        throw "AWS credentials not configured. Run: aws configure"
    }
    
    $devOutputs = $null
    $prodOutputs = $null
    
    if ($DeployBoth) {
        # Deploy Development Environment
        Write-Log "=" * 60
        Write-Log "DEPLOYING DEVELOPMENT ENVIRONMENT" -Level "INFO"
        Write-Log "=" * 60
        $devOutputs = Deploy-Environment -Environment "dev" -StackName "pmi-datahelp-dev"
        
        # Deploy Production Environment
        Write-Log "=" * 60
        Write-Log "DEPLOYING PRODUCTION ENVIRONMENT" -Level "INFO"
        Write-Log "=" * 60
        $prodOutputs = Deploy-Environment -Environment "prod" -StackName "pmi-datahelp-prod"
    }
    
    # Show summary
    Show-DeploymentSummary -DevOutputs $devOutputs -ProdOutputs $prodOutputs
    
    Write-Log "All environments deployed successfully!" -Level "SUCCESS"
    
} catch {
    Write-Log "Deployment failed: $_" -Level "ERROR"
    exit 1
}
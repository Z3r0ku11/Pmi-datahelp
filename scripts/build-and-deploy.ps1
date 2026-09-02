#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Build y deploy directo de PMI-DataHelp

.DESCRIPTION
    Construye la aplicación React y la despliega directamente
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$Environment = "production"
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
║              PMI-DataHelp Build & Deploy                    ║
║                                                              ║
║  🏗️ Building React Application                              ║
║  🚀 Deploying to CloudFront                                ║
║                                                              ║
║  Environment: $Environment                                  ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

try {
    Write-Log "Starting build and deployment process..." -Level "SUCCESS"
    
    # Verificar si Node.js está instalado
    try {
        $nodeVersion = node --version
        Write-Log "Node.js version: $nodeVersion" -Level "SUCCESS"
    } catch {
        throw "Node.js not found. Please install Node.js first."
    }
    
    # Verificar si npm está disponible
    try {
        $npmVersion = npm --version
        Write-Log "npm version: $npmVersion" -Level "SUCCESS"
    } catch {
        throw "npm not found. Please install npm first."
    }
    
    # Instalar dependencias
    Write-Log "Installing dependencies..." -Level "INFO"
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to install dependencies"
    }
    
    # Configurar variables de entorno
    Write-Log "Setting up environment variables..." -Level "INFO"
    $env:NODE_ENV = $Environment
    $env:VITE_APP_VERSION = "2.0.0"
    $env:VITE_APP_ENVIRONMENT = $Environment
    $env:VITE_APP_TITLE = "PMI-DataHelp"
    $env:VITE_AUTH_MODE = "simple"
    $env:VITE_ADMIN_USER = "dbarrios"
    
    # Build de la aplicación
    Write-Log "Building React application..." -Level "INFO"
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to build application"
    }
    
    Write-Log "Build completed successfully!" -Level "SUCCESS"
    
    # Verificar el directorio dist
    if (Test-Path "dist") {
        $distFiles = Get-ChildItem "dist" -Recurse | Measure-Object
        Write-Log "Generated $($distFiles.Count) files in dist/ directory" -Level "SUCCESS"
        
        # Mostrar estructura del build
        Write-Log "Build structure:" -Level "INFO"
        Get-ChildItem "dist" | ForEach-Object {
            Write-Host "  📄 $($_.Name)" -ForegroundColor Gray
        }
    } else {
        throw "Build directory 'dist' not found"
    }
    
    # Buscar stacks de CloudFormation existentes
    Write-Log "Checking AWS CloudFormation stacks..." -Level "INFO"
    
    $devStackExists = $false
    $prodStackExists = $false
    
    try {
        $stacks = aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE --query 'StackSummaries[?contains(StackName, `pmi-datahelp`)].StackName' --output text 2>$null
        if ($stacks -match "pmi-datahelp-dev") {
            $devStackExists = $true
            Write-Log "Development stack found" -Level "SUCCESS"
        }
        if ($stacks -match "pmi-datahelp-prod") {
            $prodStackExists = $true
            Write-Log "Production stack found" -Level "SUCCESS"
        }
    } catch {
        Write-Log "Could not check CloudFormation stacks (AWS credentials may need configuration)" -Level "WARNING"
    }
    
    # Deploy según el ambiente
    if ($Environment -eq "development" -and $devStackExists) {
        Write-Log "Deploying to development environment..." -Level "INFO"
        Deploy-ToStack -StackName "pmi-datahelp-dev"
    } elseif ($Environment -eq "production" -and $prodStackExists) {
        Write-Log "Deploying to production environment..." -Level "INFO"
        Deploy-ToStack -StackName "pmi-datahelp-prod"
    } else {
        Write-Log "Creating deployment packages for manual upload..." -Level "INFO"
        Create-DeploymentPackages
    }
    
    Write-Log "" 
    Write-Log "🎉 Build completed successfully!" -Level "SUCCESS"
    Write-Log ""
    Write-Log "📁 Built files are ready in: ./dist/" -Level "SUCCESS"
    Write-Log ""
    Write-Log "📋 Next steps:" -Level "INFO"
    Write-Log "  1. Configure AWS credentials if not done: aws configure" -Level "INFO"
    Write-Log "  2. Deploy to S3 bucket manually or via CloudFormation" -Level "INFO"
    Write-Log "  3. Invalidate CloudFront distribution" -Level "INFO"
    Write-Log ""
    Write-Log "🌐 PMI-DataHelp is ready for deployment!" -Level "SUCCESS"
    
} catch {
    Write-Log "Build failed: $_" -Level "ERROR"
    exit 1
}

function Deploy-ToStack {
    param([string]$StackName)
    
    try {
        # Obtener información del stack
        $outputs = aws cloudformation describe-stacks --stack-name $StackName --query 'Stacks[0].Outputs' --output json | ConvertFrom-Json
        
        $bucketName = ($outputs | Where-Object { $_.OutputKey -eq "S3BucketName" }).OutputValue
        $distributionId = ($outputs | Where-Object { $_.OutputKey -eq "CloudFrontDistributionId" }).OutputValue
        
        if ($bucketName) {
            Write-Log "Uploading to S3 bucket: $bucketName" -Level "INFO"
            aws s3 sync dist/ s3://$bucketName/ --delete
            
            if ($distributionId) {
                Write-Log "Invalidating CloudFront distribution: $distributionId" -Level "INFO"
                aws cloudfront create-invalidation --distribution-id $distributionId --paths "/*"
            }
            
            $websiteUrl = ($outputs | Where-Object { $_.OutputKey -eq "WebsiteURL" }).OutputValue
            Write-Log "Deployed successfully to: $websiteUrl" -Level "SUCCESS"
        }
    } catch {
        Write-Log "Failed to deploy to stack: $_" -Level "ERROR"
    }
}

function Create-DeploymentPackages {
    Write-Log "Creating deployment package..." -Level "INFO"
    
    # Crear un zip con los archivos de dist
    if (Get-Command Compress-Archive -ErrorAction SilentlyContinue) {
        $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
        $packageName = "pmi-datahelp-$Environment-$timestamp.zip"
        
        Compress-Archive -Path "dist/*" -DestinationPath $packageName -Force
        Write-Log "Created deployment package: $packageName" -Level "SUCCESS"
        
        # Crear instrucciones de despliegue manual
        $instructions = @"
# Manual Deployment Instructions

## Upload to S3:
aws s3 sync dist/ s3://your-bucket-name/ --delete

## Invalidate CloudFront:
aws cloudfront create-invalidation --distribution-id YOUR-DISTRIBUTION-ID --paths "/*"

## Alternative - Upload package:
1. Extract $packageName
2. Upload contents to your S3 bucket
3. Invalidate CloudFront distribution
"@
        
        $instructions | Out-File -FilePath "DEPLOYMENT-INSTRUCTIONS.txt" -Encoding UTF8
        Write-Log "Created DEPLOYMENT-INSTRUCTIONS.txt" -Level "SUCCESS"
    }
}
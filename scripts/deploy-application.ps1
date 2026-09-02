#!/usr/bin/env pwsh
<#
.SYNOPSIS
Deploy PMI-DataHelp Application Code
.DESCRIPTION
Builds and deploys both Phase 1 and Phase 2 applications to AWS S3 and invalidates CloudFront cache
.PARAMETER Environment
The environment to deploy (dev, staging, prod)
.PARAMETER SkipBuild
Skip the build step and deploy existing dist files
.PARAMETER PhaseOnly
Deploy only specific phase (1 or 2)
#>

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("dev", "staging", "prod")]
    [string]$Environment,
    
    [Parameter(Mandatory = $false)]
    [switch]$SkipBuild,
    
    [Parameter(Mandatory = $false)]
    [ValidateSet("1", "2")]
    [string]$PhaseOnly
)

$ErrorActionPreference = "Stop"

# Configuration
$ProjectRoot = Join-Path $PSScriptRoot ".."
$ConfigFile = Join-Path $ProjectRoot "deployment-config-$Environment.json"

Write-Host "🚀 Deploying PMI-DataHelp Application" -ForegroundColor Green
Write-Host "Environment: $Environment" -ForegroundColor Yellow

# Check if configuration exists
if (-not (Test-Path $ConfigFile)) {
    Write-Error "❌ Configuration file not found: $ConfigFile. Run deploy-infrastructure.ps1 first."
}

# Load configuration
try {
    $config = Get-Content $ConfigFile | ConvertFrom-Json
    Write-Host "✅ Configuration loaded" -ForegroundColor Green
}
catch {
    Write-Error "❌ Failed to load configuration: $_"
}

# Check Node.js and npm
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js: $nodeVersion, npm: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Error "❌ Node.js or npm not found. Please install Node.js 18+"
}

# Install dependencies
if (-not $SkipBuild) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
    Push-Location $ProjectRoot
    try {
        npm ci --silent
        Write-Host "✅ Dependencies installed" -ForegroundColor Green
    }
    catch {
        Write-Error "❌ Failed to install dependencies: $_"
    }
    finally {
        Pop-Location
    }
}

# Function to build and deploy phase
function Deploy-Phase {
    param(
        [string]$Phase,
        [string]$BuildMode,
        [string]$S3Bucket,
        [string]$CloudFrontDistId
    )
    
    Write-Host "`n🔨 Building Phase $Phase ($BuildMode mode)..." -ForegroundColor Blue
    
    if (-not $SkipBuild) {
        Push-Location $ProjectRoot
        try {
            # Set environment variables
            $env:VITE_APP_VERSION = "2.0.0"
            $env:VITE_APP_ENVIRONMENT = $Environment
            $env:VITE_API_URL = $config.Outputs.APIURL
            $env:VITE_COGNITO_USER_POOL_ID = $config.Outputs.UserPoolId
            $env:VITE_COGNITO_REGION = $config.Region
            
            if ($Phase -eq "1") {
                $env:VITE_COGNITO_CLIENT_ID = $config.Outputs.Phase1ClientId
            }
            else {
                $env:VITE_COGNITO_CLIENT_ID = $config.Outputs.Phase2ClientId
            }
            
            # Build the application
            npm run "build:phase$Phase"
            Write-Host "✅ Phase $Phase built successfully" -ForegroundColor Green
        }
        catch {
            Write-Error "❌ Failed to build Phase $Phase`: $_"
        }
        finally {
            Pop-Location
        }
    }
    
    # Check if dist directory exists
    $distDir = Join-Path $ProjectRoot "dist" "phase$Phase"
    if (-not (Test-Path $distDir)) {
        Write-Error "❌ Build directory not found: $distDir"
    }
    
    Write-Host "☁️ Deploying Phase $Phase to S3..." -ForegroundColor Blue
    try {
        # Sync files to S3
        aws s3 sync $distDir "s3://$S3Bucket" --region $config.Region --delete --cache-control "public,max-age=31536000" --exclude "*.html"
        
        # Upload HTML files with no-cache
        aws s3 sync $distDir "s3://$S3Bucket" --region $config.Region --cache-control "no-cache" --include "*.html"
        
        Write-Host "✅ Phase $Phase deployed to S3" -ForegroundColor Green
    }
    catch {
        Write-Error "❌ Failed to deploy Phase $Phase to S3: $_"
    }
    
    # Invalidate CloudFront cache
    Write-Host "🔄 Invalidating CloudFront cache..." -ForegroundColor Blue
    try {
        $invalidation = aws cloudfront create-invalidation --distribution-id $CloudFrontDistId --paths "/*" --region $config.Region | ConvertFrom-Json
        Write-Host "✅ CloudFront invalidation started: $($invalidation.Invalidation.Id)" -ForegroundColor Green
    }
    catch {
        Write-Warning "⚠️ Failed to create CloudFront invalidation: $_"
    }
}

# Deploy phases
if (-not $PhaseOnly -or $PhaseOnly -eq "1") {
    Deploy-Phase -Phase "1" -BuildMode "phase1" -S3Bucket $config.Outputs.Phase1Bucket -CloudFrontDistId (aws cloudformation describe-stacks --stack-name $config.Stacks.Main --region $config.Region --query "Stacks[0].Outputs[?OutputKey=='Phase1CloudFrontDistributionId'].OutputValue" --output text)
}

if (-not $PhaseOnly -or $PhaseOnly -eq "2") {
    Deploy-Phase -Phase "2" -BuildMode "phase2" -S3Bucket $config.Outputs.Phase2Bucket -CloudFrontDistId (aws cloudformation describe-stacks --stack-name $config.Stacks.Main --region $config.Region --query "Stacks[0].Outputs[?OutputKey=='Phase2CloudFrontDistributionId'].OutputValue" --output text)
}

# Health check
Write-Host "`n🏥 Running health checks..." -ForegroundColor Blue

function Test-Endpoint {
    param([string]$Url, [string]$Name)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $Name is accessible" -ForegroundColor Green
        }
        else {
            Write-Warning "⚠️ $Name returned status: $($response.StatusCode)"
        }
    }
    catch {
        Write-Warning "⚠️ $Name health check failed: $_"
    }
}

if (-not $PhaseOnly -or $PhaseOnly -eq "1") {
    Test-Endpoint -Url $config.Outputs.Phase1URL -Name "Phase 1 (Educational Portal)"
}

if (-not $PhaseOnly -or $PhaseOnly -eq "2") {
    Test-Endpoint -Url $config.Outputs.Phase2URL -Name "Phase 2 (Corporate PMO)"
}

# Test API endpoints
Write-Host "🔌 Testing API endpoints..." -ForegroundColor Blue
try {
    $apiHealthUrl = "$($config.Outputs.APIURL)/health"
    $apiResponse = Invoke-WebRequest -Uri $apiHealthUrl -Method Get -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ API is responding" -ForegroundColor Green
}
catch {
    Write-Warning "⚠️ API health check failed: $_"
}

Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray

Write-Host "`n🌐 Application URLs:" -ForegroundColor Yellow
if (-not $PhaseOnly -or $PhaseOnly -eq "1") {
    Write-Host "  Phase 1 (Educational Portal): $($config.Outputs.Phase1URL)" -ForegroundColor White
}
if (-not $PhaseOnly -or $PhaseOnly -eq "2") {
    Write-Host "  Phase 2 (Corporate PMO Dashboard): $($config.Outputs.Phase2URL)" -ForegroundColor White
}

Write-Host "`n📝 Post-Deployment Tasks:" -ForegroundColor Cyan
Write-Host "  1. Test both applications in a browser" -ForegroundColor White
Write-Host "  2. Verify authentication flows" -ForegroundColor White
Write-Host "  3. Check API functionality" -ForegroundColor White
Write-Host "  4. Monitor CloudWatch logs for any errors" -ForegroundColor White

if ($Environment -eq "prod") {
    Write-Host "`n🔒 Production Notes:" -ForegroundColor Red
    Write-Host "  - Review and test all security configurations" -ForegroundColor White
    Write-Host "  - Ensure proper monitoring is in place" -ForegroundColor White
    Write-Host "  - Update DNS records if needed" -ForegroundColor White
    Write-Host "  - Notify stakeholders of the deployment" -ForegroundColor White
}

Write-Host "`n⏰ Deployment completed at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
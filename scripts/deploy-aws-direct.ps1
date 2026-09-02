#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Despliega PMI-DataHelp directamente en AWS S3 + CloudFront

.DESCRIPTION
    Script simplificado para despliegue inmediato en AWS:
    1. Build de la aplicación React unificada
    2. Deploy a S3 bucket
    3. Invalidación de CloudFront
    4. Configuración de dominio (opcional)

.PARAMETER BucketName
    Nombre del bucket S3 (se creará si no existe)

.PARAMETER DomainName
    Dominio personalizado (opcional)

.PARAMETER CertificateArn
    ARN del certificado SSL para HTTPS (opcional)

.PARAMETER Region
    Región AWS (default: us-east-1)

.EXAMPLE
    ./deploy-aws-direct.ps1 -BucketName "pmi-datahelp-prod" -DomainName "pmi-datahelp.com"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$BucketName,
    
    [Parameter(Mandatory=$false)]
    [string]$DomainName,
    
    [Parameter(Mandatory=$false)]
    [string]$CertificateArn,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

# Configuration
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Logging
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
║                   PMI-DataHelp AWS Deploy                   ║
║                                                              ║
║  🏠 Página Principal + 📚 Portal Ayuda + 🏢 Portal PMO      ║
║                                                              ║
║  Target: S3 + CloudFront                                     ║
║  Region: $Region                                            ║
║  Bucket: $BucketName                                        ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan
}

function Test-Prerequisites {
    Write-Log "Validating prerequisites..."
    
    # Check AWS CLI
    try {
        $awsVersion = aws --version 2>&1
        Write-Log "AWS CLI: $awsVersion"
    } catch {
        throw "AWS CLI not installed. Install from: https://aws.amazon.com/cli/"
    }
    
    # Check AWS credentials
    try {
        $identity = aws sts get-caller-identity --query 'Account' --output text 2>&1
        Write-Log "AWS Account: $identity" -Level "SUCCESS"
    } catch {
        throw "AWS authentication failed. Run: aws configure"
    }
    
    # Check Node.js
    try {
        $nodeVersion = node --version 2>&1
        Write-Log "Node.js: $nodeVersion"
        
        if (!(Test-Path "package.json")) {
            throw "Run this script from the pmi-datahelp project root"
        }
    } catch {
        throw "Node.js not found or wrong directory"
    }
    
    Write-Log "All prerequisites validated" -Level "SUCCESS"
}

function Build-Application {
    Write-Log "Building React application..."
    
    try {
        # Install dependencies
        Write-Log "Installing dependencies..."
        npm ci --silent
        
        # Build for production
        Write-Log "Building for production..."
        $env:NODE_ENV = "production"
        $env:VITE_APP_VERSION = "2.0.0"
        $env:VITE_APP_ENVIRONMENT = "production"
        npm run build
        
        # Verify build output
        if (!(Test-Path "dist/index.html")) {
            throw "Build failed - dist/index.html not found"
        }
        
        Write-Log "Build completed successfully" -Level "SUCCESS"
        
    } catch {
        Write-Log "Build failed: $_" -Level "ERROR"
        throw
    }
}

function Deploy-ToS3 {
    Write-Log "Deploying to S3..."
    
    try {
        # Create bucket if it doesn't exist
        Write-Log "Checking/creating S3 bucket: $BucketName"
        
        $bucketExists = $false
        try {
            aws s3api head-bucket --bucket $BucketName 2>&1 | Out-Null
            $bucketExists = $true
            Write-Log "Bucket exists: $BucketName"
        } catch {
            Write-Log "Creating new bucket: $BucketName"
            aws s3api create-bucket --bucket $BucketName --region $Region
            
            # Enable static website hosting
            aws s3api put-bucket-website --bucket $BucketName --website-configuration @"
{
    "IndexDocument": {
        "Suffix": "index.html"
    },
    "ErrorDocument": {
        "Key": "index.html"
    }
}
"@
        }
        
        # Set bucket policy for public read
        Write-Log "Setting bucket policy for public access..."
        $policy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BucketName/*"
        }
    ]
}
"@
        $policy | Out-File -FilePath "temp-policy.json" -Encoding UTF8
        aws s3api put-bucket-policy --bucket $BucketName --policy file://temp-policy.json
        Remove-Item "temp-policy.json"
        
        # Sync files to S3
        Write-Log "Syncing files to S3..."
        aws s3 sync ./dist/ "s3://$BucketName/" --delete --cache-control "max-age=31536000" --exclude "*.html"
        
        # Upload HTML files with no-cache
        aws s3 sync ./dist/ "s3://$BucketName/" --cache-control "no-cache,no-store,must-revalidate" --include "*.html"
        
        $websiteUrl = "http://$BucketName.s3-website-$Region.amazonaws.com"
        Write-Log "Website deployed: $websiteUrl" -Level "SUCCESS"
        
        return $websiteUrl
        
    } catch {
        Write-Log "S3 deployment failed: $_" -Level "ERROR"
        throw
    }
}

function Setup-CloudFront {
    param([string]$OriginDomain)
    
    if (!$DomainName) {
        Write-Log "Skipping CloudFront (no domain specified)" -Level "WARNING"
        return $null
    }
    
    Write-Log "Setting up CloudFront distribution..."
    
    try {
        # Create CloudFront distribution
        $distributionConfig = @"
{
    "CallerReference": "pmi-datahelp-$(Get-Date -Format 'yyyyMMdd-HHmmss')",
    "Comment": "PMI-DataHelp Portal Distribution",
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BucketName",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000
    },
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BucketName",
                "DomainName": "$OriginDomain",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "Enabled": true,
    "Aliases": {
        "Quantity": 1,
        "Items": ["$DomainName"]
    },
    "ViewerCertificate": {
        $(if ($CertificateArn) {
            "`"ACMCertificateArn`": `"$CertificateArn`",
            `"SSLSupportMethod`": `"sni-only`""
        } else {
            "`"CloudFrontDefaultCertificate`": true"
        })
    },
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponseCode": "200",
                "ResponsePagePath": "/index.html"
            }
        ]
    }
}
"@
        
        $distributionConfig | Out-File -FilePath "temp-distribution.json" -Encoding UTF8
        
        Write-Log "Creating CloudFront distribution (this may take 10-15 minutes)..."
        $distribution = aws cloudfront create-distribution --distribution-config file://temp-distribution.json --output json | ConvertFrom-Json
        
        Remove-Item "temp-distribution.json"
        
        $distributionId = $distribution.Distribution.Id
        $distributionDomain = $distribution.Distribution.DomainName
        
        Write-Log "CloudFront distribution created: $distributionId" -Level "SUCCESS"
        Write-Log "CloudFront URL: https://$distributionDomain" -Level "SUCCESS"
        
        if ($DomainName) {
            Write-Log "Custom domain: https://$DomainName" -Level "SUCCESS"
            Write-Log "⚠️  Configure DNS: $DomainName CNAME $distributionDomain" -Level "WARNING"
        }
        
        return @{
            Id = $distributionId
            Domain = $distributionDomain
            CustomDomain = $DomainName
        }
        
    } catch {
        Write-Log "CloudFront setup failed: $_" -Level "ERROR"
        throw
    }
}

function Show-DeploymentSummary {
    param([string]$S3Url, [object]$CloudFront)
    
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                    DEPLOYMENT SUCCESSFUL                     ║" -ForegroundColor Green
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "🌐 ACCESS URLS:" -ForegroundColor Yellow
    Write-Host "   S3 Website: $S3Url" -ForegroundColor White
    
    if ($CloudFront) {
        Write-Host "   CloudFront: https://$($CloudFront.Domain)" -ForegroundColor White
        if ($CloudFront.CustomDomain) {
            Write-Host "   Custom Domain: https://$($CloudFront.CustomDomain)" -ForegroundColor White
        }
    }
    
    Write-Host ""
    Write-Host "📋 SITE STRUCTURE:" -ForegroundColor Yellow
    Write-Host "   🏠 /           → Página Principal (Índice)" -ForegroundColor White
    Write-Host "   📚 /help/*     → Portal de Ayuda (Público)" -ForegroundColor White
    Write-Host "   🏢 /pmo/*      → Portal PMO Morris (Restringido)" -ForegroundColor White
    Write-Host "   🔐 /login      → Autenticación" -ForegroundColor White
    
    Write-Host ""
    Write-Host "🔑 CREDENCIALES:" -ForegroundColor Yellow
    Write-Host "   Admin: dbarrios / cualquier contraseña" -ForegroundColor White
    Write-Host "   Usuario: cualquier nombre / cualquier contraseña" -ForegroundColor White
    
    Write-Host ""
    Write-Host "⚙️  NEXT STEPS:" -ForegroundColor Yellow
    if ($CloudFront -and $CloudFront.CustomDomain) {
        Write-Host "   1. Configure DNS: $($CloudFront.CustomDomain) CNAME $($CloudFront.Domain)" -ForegroundColor White
        Write-Host "   2. Wait for DNS propagation (5-10 minutes)" -ForegroundColor White
        Write-Host "   3. Test the site at https://$($CloudFront.CustomDomain)" -ForegroundColor White
    } else {
        Write-Host "   1. Test the site immediately" -ForegroundColor White
        Write-Host "   2. Set up custom domain if needed" -ForegroundColor White
    }
    Write-Host "   $(if ($CloudFront) { '4' } else { '3' }). Share access with your team" -ForegroundColor White
    
    Write-Host ""
    Write-Host "✅ PMI-DataHelp is now live in AWS!" -ForegroundColor Green
}

# Main execution
try {
    Show-Banner
    
    Write-Log "Starting PMI-DataHelp AWS deployment..." -Level "SUCCESS"
    
    # Step 1: Validate prerequisites
    Test-Prerequisites
    
    # Step 2: Build application
    Build-Application
    
    # Step 3: Deploy to S3
    $s3Url = Deploy-ToS3
    
    # Step 4: Setup CloudFront (optional)
    $cloudfront = Setup-CloudFront -OriginDomain "$BucketName.s3-website-$Region.amazonaws.com"
    
    # Step 5: Show summary
    Show-DeploymentSummary -S3Url $s3Url -CloudFront $cloudfront
    
    Write-Log "PMI-DataHelp deployment completed successfully!" -Level "SUCCESS"
    
} catch {
    Write-Log "Deployment failed: $_" -Level "ERROR"
    Write-Log "Check the error above and try again" -Level "ERROR"
    exit 1
}
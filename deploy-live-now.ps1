# MorrisFlow v3.1 - Live AWS Deployment Script
# Despliegue real en AWS S3 + CloudFront

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("production", "staging", "both")]
    [string]$Environment = "both",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

# Configuración
$Timestamp = Get-Date -Format "yyyyMMddHHmm"
$ProjectName = "morrisflow"
$ProductionBucket = "$ProjectName-prod-$Timestamp"
$StagingBucket = "$ProjectName-stage-$Timestamp"

# Colores para output
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }

function Test-AWSCredentials {
    Write-Info "Verificando credenciales AWS..."
    
    try {
        $Identity = aws sts get-caller-identity --output json 2>$null | ConvertFrom-Json
        if ($Identity) {
            Write-Success "AWS configurado correctamente"
            Write-Info "Usuario: $($Identity.Arn)"
            return $true
        }
    } catch {
        Write-Error "Error verificando credenciales AWS"
        return $false
    }
    return $false
}

function Deploy-S3Bucket {
    param(
        [string]$BucketName, 
        [string]$BuildPath, 
        [string]$EnvName
    )
    
    Write-Info "🪣 Creando bucket S3: $BucketName"
    
    # Crear bucket S3
    $CreateResult = aws s3 mb "s3://$BucketName" --region $Region 2>&1
    if ($LASTEXITCODE -ne 0) {
        # Si el bucket ya existe, continuar
        if ($CreateResult -like "*BucketAlreadyExists*" -or $CreateResult -like "*BucketAlreadyOwnedByYou*") {
            Write-Warning "Bucket $BucketName ya existe, continuando..."
        } else {
            Write-Error "Error creando bucket: $CreateResult"
            return $false
        }
    } else {
        Write-Success "Bucket $BucketName creado exitosamente"
    }
    
    # Configurar website hosting
    Write-Info "Configurando website hosting..."
    $WebsiteConfig = @"
{
    "IndexDocument": {
        "Suffix": "index.html"
    },
    "ErrorDocument": {
        "Key": "index.html"
    }
}
"@
    
    $WebsiteConfig | Out-File -FilePath "website-config.json" -Encoding UTF8
    aws s3api put-bucket-website --bucket $BucketName --website-configuration file://website-config.json
    Remove-Item "website-config.json" -Force
    
    # Configurar política pública
    Write-Info "Configurando acceso público..."
    $Policy = @"
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
    
    $Policy | Out-File -FilePath "bucket-policy.json" -Encoding UTF8
    aws s3api put-bucket-policy --bucket $BucketName --policy file://bucket-policy.json
    Remove-Item "bucket-policy.json" -Force
    
    # Desbloquear acceso público
    aws s3api put-public-access-block --bucket $BucketName --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
    
    # Subir archivos con optimización de cache
    Write-Info "📤 Subiendo archivos desde $BuildPath..."
    
    # Archivos estáticos con cache largo
    aws s3 sync $BuildPath "s3://$BucketName" --delete --exclude "*.html" --exclude "*.json" --cache-control "public, max-age=31536000, immutable"
    
    # HTML y JSON sin cache
    aws s3 sync $BuildPath "s3://$BucketName" --delete --include "*.html" --include "*.json" --exclude "*" --cache-control "public, max-age=0, must-revalidate"
    
    Write-Success "Archivos subidos exitosamente"
    
    # Obtener URL del website
    $WebsiteUrl = "http://$BucketName.s3-website-$Region.amazonaws.com"
    Write-Info "Website URL: $WebsiteUrl"
    
    return @{
        BucketName = $BucketName
        WebsiteUrl = $WebsiteUrl
        Success = $true
    }
}

function Create-CloudFrontDistribution {
    param(
        [string]$BucketName,
        [string]$EnvName
    )
    
    Write-Info "☁️ Creando distribución CloudFront para $EnvName..."
    
    $CallerReference = "$BucketName-$(Get-Date -Format 'yyyyMMddHHmmss')"
    $Comment = "MorrisFlow v3.1 - $EnvName Environment - Framework Morris"
    
    # TTL según ambiente
    $DefaultTTL = if ($EnvName -eq "production") { 86400 } else { 300 }
    $MaxTTL = if ($EnvName -eq "production") { 31536000 } else { 3600 }
    
    $DistributionConfig = @"
{
    "CallerReference": "$CallerReference",
    "Comment": "$Comment",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "$BucketName",
                "DomainName": "$BucketName.s3-website-$Region.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only",
                    "OriginSslProtocols": {
                        "Quantity": 1,
                        "Items": ["TLSv1.2"]
                    }
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "$BucketName",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            },
            "Headers": {
                "Quantity": 0
            }
        },
        "MinTTL": 0,
        "DefaultTTL": $DefaultTTL,
        "MaxTTL": $MaxTTL,
        "Compress": true
    },
    "CustomErrorResponses": {
        "Quantity": 2,
        "Items": [
            {
                "ErrorCode": 403,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            },
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100"
}
"@
    
    $DistributionConfig | Out-File -FilePath "cf-config.json" -Encoding UTF8
    
    # Crear distribución
    $Result = aws cloudfront create-distribution --distribution-config file://cf-config.json --output json 2>&1
    Remove-Item "cf-config.json" -Force
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error creando CloudFront: $Result"
        return $null
    }
    
    try {
        $Distribution = $Result | ConvertFrom-Json
        $DistributionId = $Distribution.Distribution.Id
        $DomainName = $Distribution.Distribution.DomainName
        $Status = $Distribution.Distribution.Status
        
        Write-Success "CloudFront creado exitosamente"
        Write-Info "Distribution ID: $DistributionId"
        Write-Info "Domain: $DomainName" 
        Write-Info "Status: $Status"
        Write-Info "URL: https://$DomainName"
        
        return @{
            Id = $DistributionId
            DomainName = $DomainName
            URL = "https://$DomainName"
            Status = $Status
            Success = $true
        }
    } catch {
        Write-Error "Error parseando respuesta CloudFront: $_"
        return $null
    }
}

# ========== EJECUCIÓN PRINCIPAL ==========

Write-Host "🚀 MORRISFLOW v3.1 - DESPLIEGUE EN VIVO AWS" -ForegroundColor Magenta
Write-Host "===========================================" -ForegroundColor Magenta
Write-Host "Timestamp: $(Get-Date)" -ForegroundColor Gray
Write-Host "Environment: $Environment" -ForegroundColor Gray
Write-Host "Region: $Region" -ForegroundColor Gray

# Verificar credenciales
if (-not (Test-AWSCredentials)) {
    Write-Error "Credenciales AWS no válidas. Configura primero con 'aws configure'"
    exit 1
}

# Cambiar al directorio del proyecto
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

$DeploymentResults = @()

try {
    # =================== PRODUCCIÓN ===================
    if ($Environment -eq "production" -or $Environment -eq "both") {
        Write-Host "`n🟢 DEPLOYANDO AMBIENTE DE PRODUCCIÓN" -ForegroundColor Green
        Write-Host "===================================" -ForegroundColor Green
        
        $ProdBuildPath = ".\morrisflow-new\dist"
        
        if (-not (Test-Path $ProdBuildPath)) {
            Write-Error "Build de producción no encontrado en $ProdBuildPath"
            Write-Info "Ejecutando build..."
            Set-Location ".\morrisflow-new"
            npm run build
            Set-Location $ProjectRoot
        }
        
        # Deploy S3
        $ProdS3 = Deploy-S3Bucket -BucketName $ProductionBucket -BuildPath $ProdBuildPath -EnvName "production"
        
        if ($ProdS3.Success) {
            # Deploy CloudFront
            $ProdCF = Create-CloudFrontDistribution -BucketName $ProductionBucket -EnvName "production"
            
            if ($ProdCF.Success) {
                $DeploymentResults += @{
                    Environment = "Production"
                    S3 = $ProdS3
                    CloudFront = $ProdCF
                }
                Write-Success "✅ Producción desplegada exitosamente"
            }
        }
    }
    
    # ==================== STAGING ====================
    if ($Environment -eq "staging" -or $Environment -eq "both") {
        Write-Host "`n🔵 DEPLOYANDO AMBIENTE DE STAGING" -ForegroundColor Blue
        Write-Host "================================" -ForegroundColor Blue
        
        $StageBuildPath = ".\morrisflow-new\dist-stage"
        
        if (-not (Test-Path $StageBuildPath)) {
            Write-Error "Build de staging no encontrado en $StageBuildPath"
            Write-Info "Ejecutando build..."
            Set-Location ".\morrisflow-new"
            npm run build:stage
            Set-Location $ProjectRoot
        }
        
        # Deploy S3
        $StageS3 = Deploy-S3Bucket -BucketName $StagingBucket -BuildPath $StageBuildPath -EnvName "staging"
        
        if ($StageS3.Success) {
            # Deploy CloudFront
            $StageCF = Create-CloudFrontDistribution -BucketName $StagingBucket -EnvName "staging"
            
            if ($StageCF.Success) {
                $DeploymentResults += @{
                    Environment = "Staging"
                    S3 = $StageS3
                    CloudFront = $StageCF
                }
                Write-Success "✅ Staging desplegado exitosamente"
            }
        }
    }
    
    # =============== RESUMEN FINAL ===============
    Write-Host "`n📊 RESUMEN DEL DESPLIEGUE" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    
    foreach ($Result in $DeploymentResults) {
        Write-Host "`n🌐 $($Result.Environment) Environment:" -ForegroundColor White
        Write-Host "   S3 Bucket: $($Result.S3.BucketName)" -ForegroundColor Gray
        Write-Host "   S3 Website: $($Result.S3.WebsiteUrl)" -ForegroundColor Gray
        Write-Host "   CloudFront ID: $($Result.CloudFront.Id)" -ForegroundColor Gray
        Write-Host "   CloudFront Domain: $($Result.CloudFront.DomainName)" -ForegroundColor Gray
        Write-Host "   🌍 LIVE URL: $($Result.CloudFront.URL)" -ForegroundColor Green -BackgroundColor Black
        Write-Host "   Status: $($Result.CloudFront.Status)" -ForegroundColor Yellow
    }
    
    # Guardar información
    $DeploymentInfo = @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Version = "MorrisFlow v3.1"
        Framework = "Morris Framework 3.1"
        Region = $Region
        Results = $DeploymentResults
    } | ConvertTo-Json -Depth 5
    
    $DeploymentInfo | Out-File -FilePath "live-deployment-info.json" -Encoding UTF8
    
    Write-Host "`n💾 Información guardada en: live-deployment-info.json" -ForegroundColor Green
    Write-Host "`n⏱️ IMPORTANTE: Las distribuciones CloudFront tardan 15-20 minutos en propagar globalmente" -ForegroundColor Yellow
    Write-Host "🎉 MORRISFLOW v3.1 DESPLEGADO EXITOSAMENTE EN AWS!" -ForegroundColor Green -BackgroundColor Black
    
} catch {
    Write-Error "Error durante el despliegue: $($_.Exception.Message)"
    Write-Host $_.ScriptStackTrace -ForegroundColor Red
    exit 1
}
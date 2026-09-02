# MorrisFlow AWS CloudFront Deployment Script
# Configura buckets S3 y distribuciones CloudFront para Production y Staging

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("production", "staging", "both")]
    [string]$Environment,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

# Configuración
$BucketPrefix = "morrisflow"
$ProductionBucket = "$BucketPrefix-prod-$(Get-Date -Format 'yyyyMMdd')"
$StagingBucket = "$BucketPrefix-stage-$(Get-Date -Format 'yyyyMMdd')"

# Colores para output
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }

function Deploy-S3Bucket {
    param([string]$BucketName, [string]$BuildPath, [string]$EnvName)
    
    Write-Info "Creando bucket S3: $BucketName"
    
    # Crear bucket
    aws s3 mb s3://$BucketName --region $Region
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error creando bucket $BucketName"
        return $false
    }
    
    # Configurar website hosting
    $WebsiteConfig = @{
        IndexDocument = @{ Suffix = "index.html" }
        ErrorDocument = @{ Key = "index.html" }
    } | ConvertTo-Json -Depth 3
    
    $WebsiteConfig | Out-File -FilePath "website-config-temp.json" -Encoding UTF8
    aws s3api put-bucket-website --bucket $BucketName --website-configuration file://website-config-temp.json
    Remove-Item "website-config-temp.json"
    
    # Configurar política de bucket
    $BucketPolicy = @{
        Version = "2012-10-17"
        Statement = @(
            @{
                Sid = "PublicReadGetObject"
                Effect = "Allow"
                Principal = "*"
                Action = "s3:GetObject"
                Resource = "arn:aws:s3:::$BucketName/*"
            }
        )
    } | ConvertTo-Json -Depth 4
    
    $BucketPolicy | Out-File -FilePath "bucket-policy-temp.json" -Encoding UTF8
    aws s3api put-bucket-policy --bucket $BucketName --policy file://bucket-policy-temp.json
    Remove-Item "bucket-policy-temp.json"
    
    # Subir archivos
    Write-Info "Subiendo archivos desde $BuildPath a $BucketName"
    aws s3 sync $BuildPath s3://$BucketName --delete --cache-control "public, max-age=31536000" --exclude "*.html" --exclude "*.json"
    aws s3 sync $BuildPath s3://$BucketName --delete --cache-control "public, max-age=0, must-revalidate" --exclude "*" --include "*.html" --include "*.json"
    
    Write-Success "Bucket $BucketName configurado y contenido subido"
    return $true
}

function Create-CloudFrontDistribution {
    param([string]$BucketName, [string]$EnvName)
    
    Write-Info "Creando distribución CloudFront para $EnvName"
    
    # Configuración de CloudFront
    $CloudFrontConfig = @{
        CallerReference = "$BucketName-$(Get-Date -Format 'yyyyMMddHHmmss')"
        Comment = "MorrisFlow $EnvName Environment - Framework Morris 3.1"
        DefaultRootObject = "index.html"
        Origins = @{
            Quantity = 1
            Items = @(
                @{
                    Id = $BucketName
                    DomainName = "$BucketName.s3-website-$Region.amazonaws.com"
                    CustomOriginConfig = @{
                        HTTPPort = 80
                        HTTPSPort = 443
                        OriginProtocolPolicy = "http-only"
                    }
                }
            )
        }
        DefaultCacheBehavior = @{
            TargetOriginId = $BucketName
            ViewerProtocolPolicy = "redirect-to-https"
            TrustedSigners = @{
                Enabled = $false
                Quantity = 0
            }
            ForwardedValues = @{
                QueryString = $false
                Cookies = @{
                    Forward = "none"
                }
                Headers = @{
                    Quantity = 0
                }
            }
            MinTTL = 0
            DefaultTTL = if ($EnvName -eq "production") { 86400 } else { 300 }
            MaxTTL = if ($EnvName -eq "production") { 31536000 } else { 3600 }
            Compress = $true
        }
        CustomErrorResponses = @{
            Quantity = 2
            Items = @(
                @{
                    ErrorCode = 403
                    ResponsePagePath = "/index.html"
                    ResponseCode = "200"
                    ErrorCachingMinTTL = 300
                },
                @{
                    ErrorCode = 404
                    ResponsePagePath = "/index.html" 
                    ResponseCode = "200"
                    ErrorCachingMinTTL = 300
                }
            )
        }
        Enabled = $true
        PriceClass = "PriceClass_100"
    } | ConvertTo-Json -Depth 10
    
    $CloudFrontConfig | Out-File -FilePath "cloudfront-config-temp.json" -Encoding UTF8
    
    # Crear distribución
    $Result = aws cloudfront create-distribution --distribution-config file://cloudfront-config-temp.json --output json
    Remove-Item "cloudfront-config-temp.json"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error creando distribución CloudFront para $EnvName"
        return $null
    }
    
    $Distribution = $Result | ConvertFrom-Json
    $DistributionId = $Distribution.Distribution.Id
    $DomainName = $Distribution.Distribution.DomainName
    
    Write-Success "Distribución CloudFront creada:"
    Write-Host "  ID: $DistributionId" -ForegroundColor White
    Write-Host "  Domain: $DomainName" -ForegroundColor White
    Write-Host "  URL: https://$DomainName" -ForegroundColor Green
    
    return @{
        Id = $DistributionId
        DomainName = $DomainName
        URL = "https://$DomainName"
    }
}

# Main execution
Write-Info "🚀 Iniciando despliegue de MorrisFlow en AWS CloudFront"
Write-Info "Ambiente: $Environment | Región: $Region"

# Verificar AWS CLI
if (!(Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Error "AWS CLI no está instalado o no está en PATH"
    exit 1
}

# Verificar credenciales AWS
$AWSIdentity = aws sts get-caller-identity --output json 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error "No se pudieron obtener las credenciales AWS. Ejecuta 'aws configure' primero."
    exit 1
}

$Identity = $AWSIdentity | ConvertFrom-Json
Write-Info "Usuario AWS: $($Identity.Arn)"

# Cambiar al directorio del proyecto
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

$Results = @()

try {
    # Deploy Production
    if ($Environment -eq "production" -or $Environment -eq "both") {
        Write-Info "`n🟢 DEPLOYANDO PRODUCTION ENVIRONMENT"
        
        $BuildPath = ".\morrisflow-new\dist"
        if (!(Test-Path $BuildPath)) {
            Write-Error "Build de producción no encontrado en $BuildPath"
            Write-Info "Ejecutando build de producción..."
            Set-Location ".\morrisflow-new"
            npm run build
            Set-Location $ProjectRoot
        }
        
        if (Deploy-S3Bucket -BucketName $ProductionBucket -BuildPath $BuildPath -EnvName "production") {
            $ProdDistribution = Create-CloudFrontDistribution -BucketName $ProductionBucket -EnvName "production"
            if ($ProdDistribution) {
                $Results += @{
                    Environment = "Production"
                    Bucket = $ProductionBucket
                    Distribution = $ProdDistribution
                }
            }
        }
    }
    
    # Deploy Staging
    if ($Environment -eq "staging" -or $Environment -eq "both") {
        Write-Info "`n🔵 DEPLOYANDO STAGING ENVIRONMENT"
        
        $BuildPath = ".\morrisflow-new\dist-stage"
        if (!(Test-Path $BuildPath)) {
            Write-Error "Build de staging no encontrado en $BuildPath"
            Write-Info "Ejecutando build de staging..."
            Set-Location ".\morrisflow-new"
            npm run build:stage
            Set-Location $ProjectRoot
        }
        
        if (Deploy-S3Bucket -BucketName $StagingBucket -BuildPath $BuildPath -EnvName "staging") {
            $StageDistribution = Create-CloudFrontDistribution -BucketName $StagingBucket -EnvName "staging"
            if ($StageDistribution) {
                $Results += @{
                    Environment = "Staging"
                    Bucket = $StagingBucket
                    Distribution = $StageDistribution
                }
            }
        }
    }
    
    # Mostrar resumen
    Write-Info "`n📊 RESUMEN DEL DESPLIEGUE"
    Write-Host "================================" -ForegroundColor Cyan
    
    foreach ($Result in $Results) {
        Write-Host "`n🌐 $($Result.Environment) Environment:" -ForegroundColor White
        Write-Host "   S3 Bucket: $($Result.Bucket)" -ForegroundColor Gray
        Write-Host "   CloudFront ID: $($Result.Distribution.Id)" -ForegroundColor Gray  
        Write-Host "   Domain: $($Result.Distribution.DomainName)" -ForegroundColor Gray
        Write-Host "   URL: $($Result.Distribution.URL)" -ForegroundColor Green
        Write-Host "   Status: ✅ Desplegado exitosamente" -ForegroundColor Green
    }
    
    Write-Host "`n⏱️  Nota: Las distribuciones CloudFront pueden tardar 15-20 minutos en estar completamente disponibles." -ForegroundColor Yellow
    
    # Guardar información de despliegue
    $DeploymentInfo = @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Region = $Region
        Results = $Results
    } | ConvertTo-Json -Depth 5
    
    $DeploymentInfo | Out-File -FilePath "deployment-info.json" -Encoding UTF8
    Write-Success "Información de despliegue guardada en deployment-info.json"
    
} catch {
    Write-Error "Error durante el despliegue: $($_.Exception.Message)"
    exit 1
}

Write-Success "`n🎉 Despliegue de MorrisFlow completado exitosamente!"
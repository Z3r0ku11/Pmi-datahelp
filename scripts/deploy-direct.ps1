#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Despliegue directo sin dependencias de OAuth

.DESCRIPTION
    Despliega directamente usando CloudFormation simple
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$StackName = "pmi-datahelp-simple",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Continue"

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

Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                 DESPLIEGUE DIRECTO                          ║
║                                                              ║
║  🚀 Desplegando PMI-DataHelp a CloudFront                  ║
║  📦 Build listo en ./dist/                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

try {
    Write-Log "Creando stack CloudFormation simple..." -Level "INFO"
    
    # Crear template simple
    $simpleTemplate = @"
{
    "AWSTemplateFormatVersion": "2010-09-09",
    "Description": "PMI-DataHelp Simple Deploy",
    "Resources": {
        "WebsiteBucket": {
            "Type": "AWS::S3::Bucket",
            "Properties": {
                "BucketName": "pmi-datahelp-simple-${Region}-$(Get-Random)",
                "WebsiteConfiguration": {
                    "IndexDocument": "index.html",
                    "ErrorDocument": "index.html"
                },
                "PublicAccessBlockConfiguration": {
                    "BlockPublicAcls": false,
                    "BlockPublicPolicy": false,
                    "IgnorePublicAcls": false,
                    "RestrictPublicBuckets": false
                }
            }
        },
        "BucketPolicy": {
            "Type": "AWS::S3::BucketPolicy",
            "Properties": {
                "Bucket": {"Ref": "WebsiteBucket"},
                "PolicyDocument": {
                    "Statement": [{
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": "s3:GetObject",
                        "Resource": {"Fn::Sub": "\${WebsiteBucket}/*"}
                    }]
                }
            }
        },
        "CloudFrontDistribution": {
            "Type": "AWS::CloudFront::Distribution",
            "Properties": {
                "DistributionConfig": {
                    "Comment": "PMI-DataHelp Distribution",
                    "Enabled": true,
                    "DefaultRootObject": "index.html",
                    "Origins": [{
                        "Id": "S3Origin",
                        "DomainName": {"Fn::GetAtt": ["WebsiteBucket", "RegionalDomainName"]},
                        "S3OriginConfig": {
                            "OriginAccessIdentity": ""
                        }
                    }],
                    "DefaultCacheBehavior": {
                        "TargetOriginId": "S3Origin",
                        "ViewerProtocolPolicy": "redirect-to-https",
                        "AllowedMethods": ["GET", "HEAD"],
                        "ForwardedValues": {
                            "QueryString": false,
                            "Cookies": {"Forward": "none"}
                        }
                    },
                    "CustomErrorResponses": [{
                        "ErrorCode": 404,
                        "ResponseCode": 200,
                        "ResponsePagePath": "/index.html"
                    }]
                }
            }
        }
    },
    "Outputs": {
        "WebsiteURL": {
            "Value": {"Fn::Sub": "https://\${CloudFrontDistribution.DomainName}"},
            "Description": "PMI-DataHelp Website URL"
        },
        "S3BucketName": {
            "Value": {"Ref": "WebsiteBucket"},
            "Description": "S3 Bucket Name"
        },
        "DistributionId": {
            "Value": {"Ref": "CloudFrontDistribution"},
            "Description": "CloudFront Distribution ID"
        }
    }
}
"@
    
    $simpleTemplate | Out-File -FilePath "simple-template.json" -Encoding UTF8
    
    Write-Log "Creando stack CloudFormation..." -Level "INFO"
    $result = aws cloudformation create-stack --stack-name $StackName --template-body "file://simple-template.json" --region $Region 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "Stack creado exitosamente!" -Level "SUCCESS"
        Write-Log "Esperando a que el stack se complete..." -Level "INFO"
        
        # Esperar unos minutos para que se cree
        Start-Sleep -Seconds 30
        
        Write-Log "Obteniendo información del stack..." -Level "INFO"
        $outputs = aws cloudformation describe-stacks --stack-name $StackName --region $Region --query 'Stacks[0].Outputs' --output json 2>$null
        
        if ($outputs) {
            $outputData = $outputs | ConvertFrom-Json
            $bucketName = ($outputData | Where-Object { $_.OutputKey -eq "S3BucketName" }).OutputValue
            $websiteUrl = ($outputData | Where-Object { $_.OutputKey -eq "WebsiteURL" }).OutputValue
            $distributionId = ($outputData | Where-Object { $_.OutputKey -eq "DistributionId" }).OutputValue
            
            if ($bucketName) {
                Write-Log "Desplegando archivos a S3: $bucketName" -Level "INFO"
                aws s3 sync dist/ s3://$bucketName/ --delete --region $Region
                
                Write-Log "¡DESPLIEGUE COMPLETADO!" -Level "SUCCESS"
                Write-Log "URL: $websiteUrl" -Level "SUCCESS"
                Write-Log "Bucket: $bucketName" -Level "SUCCESS"
                Write-Log "Distribution: $distributionId" -Level "SUCCESS"
                
                return @{
                    URL = $websiteUrl
                    Bucket = $bucketName
                    Distribution = $distributionId
                }
            }
        }
    } else {
        Write-Log "Error creando stack: $result" -Level "ERROR"
    }
    
} catch {
    Write-Log "Error en despliegue: $_" -Level "ERROR"
    
    # Fallback: crear bucket manual
    Write-Log "Intentando crear bucket simple..." -Level "WARNING"
    Deploy-Simple-Bucket
}

function Deploy-Simple-Bucket {
    $bucketName = "pmi-datahelp-manual-$(Get-Random)"
    
    try {
        Write-Log "Creando bucket S3: $bucketName" -Level "INFO"
        aws s3 mb s3://$bucketName --region $Region
        
        Write-Log "Configurando bucket para web hosting..." -Level "INFO"
        aws s3 website s3://$bucketName --index-document index.html --error-document index.html
        
        Write-Log "Configurando políticas públicas..." -Level "INFO"
        $policy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$bucketName/*"
        }
    ]
}
"@
        $policy | Out-File -FilePath "bucket-policy.json" -Encoding UTF8
        aws s3api put-bucket-policy --bucket $bucketName --policy "file://bucket-policy.json"
        
        Write-Log "Subiendo archivos..." -Level "INFO"
        aws s3 sync dist/ s3://$bucketName/ --delete
        
        $websiteUrl = "http://$bucketName.s3-website-$Region.amazonaws.com"
        
        Write-Log "¡DESPLIEGUE MANUAL COMPLETADO!" -Level "SUCCESS"
        Write-Log "URL: $websiteUrl" -Level "SUCCESS"
        
        # Limpiar archivos temporales
        Remove-Item "bucket-policy.json" -ErrorAction SilentlyContinue
        
    } catch {
        Write-Log "Error en bucket manual: $_" -Level "ERROR"
        Show-Final-Instructions
    }
}

function Show-Final-Instructions {
    Write-Log ""
    Write-Log "=== INSTRUCCIONES FINALES ===" -Level "WARNING"
    Write-Log ""
    Write-Log "Los archivos están listos en ./dist/" -Level "INFO"
    Write-Log "Paquete disponible: pmi-datahelp-deploy-*.zip" -Level "INFO"
    Write-Log ""
    Write-Log "Para desplegar manualmente:" -Level "INFO"
    Write-Log "1. aws s3 mb s3://tu-bucket-name" -Level "INFO"
    Write-Log "2. aws s3 sync dist/ s3://tu-bucket-name/" -Level "INFO"
    Write-Log "3. aws s3 website s3://tu-bucket-name --index-document index.html" -Level "INFO"
    Write-Log ""
    Write-Log "¡PMI-DataHelp está listo!" -Level "SUCCESS"
}

# Limpiar archivos temporales al final
Remove-Item "simple-template.json" -ErrorAction SilentlyContinue
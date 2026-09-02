#!/usr/bin/env pwsh
<#
.SYNOPSIS
Deploy PMI-DataHelp AWS Infrastructure
.DESCRIPTION
Deploys the complete AWS infrastructure for both Phase 1 and Phase 2 of PMI-DataHelp
.PARAMETER Environment
The environment to deploy (dev, staging, prod)
.PARAMETER Region
AWS region for deployment (default: us-east-1)
.PARAMETER DomainName
Domain name for the application
.PARAMETER CertificateArn
SSL Certificate ARN for CloudFront (must be in us-east-1)
.PARAMETER AdminEmail
Email address for the initial admin user
#>

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("dev", "staging", "prod")]
    [string]$Environment,
    
    [Parameter(Mandatory = $false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory = $true)]
    [string]$DomainName,
    
    [Parameter(Mandatory = $true)]
    [string]$CertificateArn,
    
    [Parameter(Mandatory = $false)]
    [string]$AdminEmail = "admin@pmi-datahelp.com",
    
    [Parameter(Mandatory = $false)]
    [switch]$WhatIf
)

$ErrorActionPreference = "Stop"

# Configuration
$ProjectName = "pmi-datahelp"
$InfrastructureDir = Join-Path $PSScriptRoot ".." "infrastructure" "cloudformation"

# Stack names
$MainStackName = "$ProjectName-main-$Environment"
$CognitoStackName = "$ProjectName-cognito-$Environment"
$APIStackName = "$ProjectName-api-$Environment"

Write-Host "🚀 Deploying PMI-DataHelp Infrastructure" -ForegroundColor Green
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host "Domain: $DomainName" -ForegroundColor Yellow

# Check AWS CLI
try {
    $awsVersion = aws --version 2>$null
    Write-Host "✅ AWS CLI: $awsVersion" -ForegroundColor Green
}
catch {
    Write-Error "❌ AWS CLI not found. Please install AWS CLI v2"
}

# Check AWS credentials
try {
    $identity = aws sts get-caller-identity --region $Region | ConvertFrom-Json
    Write-Host "✅ AWS Identity: $($identity.Arn)" -ForegroundColor Green
}
catch {
    Write-Error "❌ AWS credentials not configured"
}

# Validate certificate
Write-Host "🔍 Validating SSL Certificate..." -ForegroundColor Blue
try {
    $cert = aws acm describe-certificate --certificate-arn $CertificateArn --region us-east-1 | ConvertFrom-Json
    if ($cert.Certificate.Status -ne "ISSUED") {
        Write-Error "❌ Certificate is not in ISSUED status: $($cert.Certificate.Status)"
    }
    Write-Host "✅ Certificate validated: $($cert.Certificate.DomainName)" -ForegroundColor Green
}
catch {
    Write-Error "❌ Failed to validate certificate: $_"
}

if ($WhatIf) {
    Write-Host "🔍 What-If mode: No resources will be created" -ForegroundColor Yellow
    return
}

# Function to deploy CloudFormation stack
function Deploy-Stack {
    param(
        [string]$StackName,
        [string]$TemplateFile,
        [hashtable]$Parameters = @{},
        [string[]]$Capabilities = @()
    )
    
    Write-Host "📦 Deploying stack: $StackName" -ForegroundColor Blue
    
    # Convert parameters to CloudFormation format
    $paramString = ""
    if ($Parameters.Count -gt 0) {
        $paramArray = @()
        foreach ($key in $Parameters.Keys) {
            $paramArray += "ParameterKey=$key,ParameterValue=$($Parameters[$key])"
        }
        $paramString = "--parameter-overrides " + ($paramArray -join " ")
    }
    
    # Convert capabilities to string
    $capString = ""
    if ($Capabilities.Count -gt 0) {
        $capString = "--capabilities " + ($Capabilities -join " ")
    }
    
    try {
        $cmd = "aws cloudformation deploy --template-file `"$TemplateFile`" --stack-name `"$StackName`" --region `"$Region`" $paramString $capString --no-fail-on-empty-changeset"
        Write-Host "Executing: $cmd" -ForegroundColor DarkGray
        
        Invoke-Expression $cmd
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Stack deployed successfully: $StackName" -ForegroundColor Green
        }
        else {
            Write-Error "❌ Stack deployment failed: $StackName"
        }
    }
    catch {
        Write-Error "❌ Failed to deploy stack $StackName`: $_"
    }
}

# 1. Deploy Cognito Authentication Stack
Write-Host "`n🔐 Step 1: Deploying Cognito Authentication" -ForegroundColor Magenta
$cognitoParams = @{
    Environment = $Environment
    ProjectName = $ProjectName
    AdminEmail = $AdminEmail
    DomainName = $DomainName
}
Deploy-Stack -StackName $CognitoStackName -TemplateFile (Join-Path $InfrastructureDir "cognito-auth.yaml") -Parameters $cognitoParams -Capabilities @("CAPABILITY_IAM", "CAPABILITY_NAMED_IAM")

# 2. Deploy Main Infrastructure Stack
Write-Host "`n🏗️ Step 2: Deploying Main Infrastructure" -ForegroundColor Magenta
$mainParams = @{
    Environment = $Environment
    ProjectName = $ProjectName
    DomainName = $DomainName
    CertificateArn = $CertificateArn
}
Deploy-Stack -StackName $MainStackName -TemplateFile (Join-Path $InfrastructureDir "main-infrastructure.yaml") -Parameters $mainParams -Capabilities @("CAPABILITY_IAM")

# 3. Deploy API Backend Stack
Write-Host "`n🔌 Step 3: Deploying API Backend" -ForegroundColor Magenta
$apiParams = @{
    Environment = $Environment
    ProjectName = $ProjectName
    MainStackName = $MainStackName
    CognitoStackName = $CognitoStackName
}
Deploy-Stack -StackName $APIStackName -TemplateFile (Join-Path $InfrastructureDir "api-backend.yaml") -Parameters $apiParams -Capabilities @("CAPABILITY_IAM", "CAPABILITY_NAMED_IAM")

# Get stack outputs
Write-Host "`n📊 Retrieving Stack Outputs..." -ForegroundColor Blue

function Get-StackOutput {
    param([string]$StackName, [string]$OutputKey)
    try {
        $output = aws cloudformation describe-stacks --stack-name $StackName --region $Region --query "Stacks[0].Outputs[?OutputKey=='$OutputKey'].OutputValue" --output text 2>$null
        return $output
    }
    catch {
        return "N/A"
    }
}

# Main Infrastructure Outputs
$phase1Url = Get-StackOutput $MainStackName "Phase1WebsiteURL"
$phase2Url = Get-StackOutput $MainStackName "Phase2WebsiteURL"
$phase1Bucket = Get-StackOutput $MainStackName "Phase1WebBucketName"
$phase2Bucket = Get-StackOutput $MainStackName "Phase2WebBucketName"
$contentBucket = Get-StackOutput $MainStackName "ContentBucketName"

# Cognito Outputs
$userPoolId = Get-StackOutput $CognitoStackName "UserPoolId"
$phase1ClientId = Get-StackOutput $CognitoStackName "Phase1UserPoolClientId"
$phase2ClientId = Get-StackOutput $CognitoStackName "Phase2UserPoolClientId"
$cognitoDomain = Get-StackOutput $CognitoStackName "UserPoolDomain"

# API Outputs
$apiUrl = Get-StackOutput $APIStackName "APIGatewayURL"

Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray

Write-Host "`n🌐 Application URLs:" -ForegroundColor Yellow
Write-Host "  Phase 1 (Educational): $phase1Url" -ForegroundColor White
Write-Host "  Phase 2 (Corporate PMO): $phase2Url" -ForegroundColor White

Write-Host "`n🪣 S3 Buckets:" -ForegroundColor Yellow
Write-Host "  Phase 1 Web: $phase1Bucket" -ForegroundColor White
Write-Host "  Phase 2 Web: $phase2Bucket" -ForegroundColor White
Write-Host "  Content: $contentBucket" -ForegroundColor White

Write-Host "`n🔐 Authentication:" -ForegroundColor Yellow
Write-Host "  User Pool ID: $userPoolId" -ForegroundColor White
Write-Host "  Phase 1 Client ID: $phase1ClientId" -ForegroundColor White
Write-Host "  Phase 2 Client ID: $phase2ClientId" -ForegroundColor White
Write-Host "  Cognito Domain: $cognitoDomain" -ForegroundColor White

Write-Host "`n🔌 API:" -ForegroundColor Yellow
Write-Host "  API Gateway URL: $apiUrl" -ForegroundColor White

Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Update your application configuration with the above values" -ForegroundColor White
Write-Host "  2. Deploy your application code using: ./deploy-application.ps1" -ForegroundColor White
Write-Host "  3. Configure your DNS to point to the CloudFront distributions" -ForegroundColor White
Write-Host "  4. Create initial users in Cognito User Pool" -ForegroundColor White

Write-Host "`n⚠️  Security Notes:" -ForegroundColor Red
Write-Host "  - Update Google OAuth client credentials in Cognito" -ForegroundColor White
Write-Host "  - Review and configure MFA settings for production" -ForegroundColor White
Write-Host "  - Set up proper monitoring and alerting" -ForegroundColor White

# Save configuration to file
$config = @{
    Environment = $Environment
    Region = $Region
    ProjectName = $ProjectName
    DomainName = $DomainName
    Stacks = @{
        Main = $MainStackName
        Cognito = $CognitoStackName
        API = $APIStackName
    }
    Outputs = @{
        Phase1URL = $phase1Url
        Phase2URL = $phase2Url
        Phase1Bucket = $phase1Bucket
        Phase2Bucket = $phase2Bucket
        ContentBucket = $contentBucket
        UserPoolId = $userPoolId
        Phase1ClientId = $phase1ClientId
        Phase2ClientId = $phase2ClientId
        CognitoDomain = $cognitoDomain
        APIURL = $apiUrl
    }
    Timestamp = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
}

$configFile = Join-Path $PSScriptRoot ".." "deployment-config-$Environment.json"
$config | ConvertTo-Json -Depth 10 | Set-Content -Path $configFile
Write-Host "💾 Configuration saved to: $configFile" -ForegroundColor Green
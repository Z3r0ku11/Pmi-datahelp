#!/usr/bin/env pwsh
<#
.SYNOPSIS
Setup PMI-DataHelp CI/CD Pipeline with AWS CodePipeline
.DESCRIPTION
Sets up AWS CodePipeline for automated build and deployment of both phases,
stores configuration in SSM Parameter Store, and configures notifications
.PARAMETER Environment
The environment to deploy (dev, staging, prod)
.PARAMETER GitHubOwner
GitHub repository owner
.PARAMETER GitHubRepo
GitHub repository name (default: pmo-asana-analytics)
.PARAMETER GitHubToken
GitHub personal access token for repository access
.PARAMETER MainStackName
Name of the main infrastructure stack
.PARAMETER NotificationEmail
Email address for pipeline notifications
#>

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("dev", "staging", "prod")]
    [string]$Environment,
    
    [Parameter(Mandatory = $true)]
    [string]$GitHubOwner,
    
    [Parameter(Mandatory = $false)]
    [string]$GitHubRepo = "pmo-asana-analytics",
    
    [Parameter(Mandatory = $true)]
    [string]$GitHubToken,
    
    [Parameter(Mandatory = $true)]
    [string]$MainStackName,
    
    [Parameter(Mandatory = $false)]
    [string]$NotificationEmail = "admin@pmi-datahelp.com",
    
    [Parameter(Mandatory = $false)]
    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

# Configuration
$ProjectName = "pmi-datahelp"
$InfrastructureDir = Join-Path $PSScriptRoot ".." "infrastructure" "cloudformation"
$CICDStackName = "$ProjectName-cicd-$Environment"

Write-Host "🚀 Setting up PMI-DataHelp CI/CD Pipeline" -ForegroundColor Green
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "GitHub: $GitHubOwner/$GitHubRepo" -ForegroundColor Yellow
Write-Host "Main Stack: $MainStackName" -ForegroundColor Yellow

# Check prerequisites
try {
    $awsVersion = aws --version 2>$null
    Write-Host "✅ AWS CLI: $awsVersion" -ForegroundColor Green
}
catch {
    Write-Error "❌ AWS CLI not found. Please install AWS CLI v2"
}

try {
    $identity = aws sts get-caller-identity --region $Region | ConvertFrom-Json
    Write-Host "✅ AWS Identity: $($identity.Arn)" -ForegroundColor Green
}
catch {
    Write-Error "❌ AWS credentials not configured"
}

# Validate main stack exists
Write-Host "🔍 Validating main infrastructure stack..." -ForegroundColor Blue
try {
    $mainStack = aws cloudformation describe-stacks --stack-name $MainStackName --region $Region | ConvertFrom-Json
    if ($mainStack.Stacks[0].StackStatus -ne "CREATE_COMPLETE" -and $mainStack.Stacks[0].StackStatus -ne "UPDATE_COMPLETE") {
        Write-Error "❌ Main stack is not in a complete state: $($mainStack.Stacks[0].StackStatus)"
    }
    Write-Host "✅ Main stack validated: $($mainStack.Stacks[0].StackStatus)" -ForegroundColor Green
}
catch {
    Write-Error "❌ Main infrastructure stack not found: $MainStackName. Deploy infrastructure first."
}

# Get outputs from main stack
Write-Host "📊 Retrieving main stack outputs..." -ForegroundColor Blue

function Get-StackOutput {
    param([string]$StackName, [string]$OutputKey)
    try {
        $output = aws cloudformation describe-stacks --stack-name $StackName --region $Region --query "Stacks[0].Outputs[?OutputKey=='$OutputKey'].OutputValue" --output text 2>$null
        return $output
    }
    catch {
        return ""
    }
}

$phase1Bucket = Get-StackOutput $MainStackName "Phase1WebBucketName"
$phase2Bucket = Get-StackOutput $MainStackName "Phase2WebBucketName"
$contentBucket = Get-StackOutput $MainStackName "ContentBucketName"
$phase1DistId = Get-StackOutput $MainStackName "Phase1CloudFrontDistributionId"
$phase2DistId = Get-StackOutput $MainStackName "Phase2CloudFrontDistributionId"
$phase1Url = Get-StackOutput $MainStackName "Phase1WebsiteURL"
$phase2Url = Get-StackOutput $MainStackName "Phase2WebsiteURL"

if (-not $phase1Bucket -or -not $phase2Bucket) {
    Write-Error "❌ Could not retrieve required outputs from main stack"
}

Write-Host "✅ Retrieved stack outputs" -ForegroundColor Green

# Store configuration in SSM Parameter Store
Write-Host "📝 Storing configuration in SSM Parameter Store..." -ForegroundColor Blue

$parameters = @(
    @{
        Name = "/$ProjectName/$Environment/phase1-bucket"
        Value = $phase1Bucket
        Description = "Phase 1 S3 bucket name"
    },
    @{
        Name = "/$ProjectName/$Environment/phase2-bucket"
        Value = $phase2Bucket
        Description = "Phase 2 S3 bucket name"
    },
    @{
        Name = "/$ProjectName/$Environment/content-bucket"
        Value = $contentBucket
        Description = "Content S3 bucket name"
    },
    @{
        Name = "/$ProjectName/$Environment/phase1-distribution-id"
        Value = $phase1DistId
        Description = "Phase 1 CloudFront distribution ID"
    },
    @{
        Name = "/$ProjectName/$Environment/phase2-distribution-id"
        Value = $phase2DistId
        Description = "Phase 2 CloudFront distribution ID"
    },
    @{
        Name = "/$ProjectName/$Environment/phase1-url"
        Value = $phase1Url
        Description = "Phase 1 website URL"
    },
    @{
        Name = "/$ProjectName/$Environment/phase2-url"
        Value = $phase2Url
        Description = "Phase 2 website URL"
    }
)

# Add Cognito parameters if available
$cognitoStackName = "$ProjectName-cognito-$Environment"
try {
    $userPoolId = Get-StackOutput $cognitoStackName "UserPoolId"
    $phase1ClientId = Get-StackOutput $cognitoStackName "Phase1UserPoolClientId"
    $phase2ClientId = Get-StackOutput $cognitoStackName "Phase2UserPoolClientId"
    $cognitoDomain = Get-StackOutput $cognitoStackName "UserPoolDomain"
    
    if ($userPoolId) {
        $parameters += @(
            @{
                Name = "/$ProjectName/$Environment/cognito-user-pool-id"
                Value = $userPoolId
                Description = "Cognito User Pool ID"
            },
            @{
                Name = "/$ProjectName/$Environment/cognito-phase1-client-id"
                Value = $phase1ClientId
                Description = "Phase 1 Cognito Client ID"
            },
            @{
                Name = "/$ProjectName/$Environment/cognito-phase2-client-id"
                Value = $phase2ClientId
                Description = "Phase 2 Cognito Client ID"
            },
            @{
                Name = "/$ProjectName/$Environment/cognito-domain"
                Value = $cognitoDomain
                Description = "Cognito Domain URL"
            }
        )
    }
}
catch {
    Write-Warning "⚠️ Could not retrieve Cognito parameters. Continuing without them."
}

# Add API parameters if available
$apiStackName = "$ProjectName-api-$Environment"
try {
    $apiUrl = Get-StackOutput $apiStackName "APIGatewayURL"
    if ($apiUrl) {
        $parameters += @{
            Name = "/$ProjectName/$Environment/api-url"
            Value = $apiUrl
            Description = "API Gateway URL"
        }
    }
}
catch {
    Write-Warning "⚠️ Could not retrieve API parameters. Continuing without them."
}

# Store parameters
foreach ($param in $parameters) {
    try {
        aws ssm put-parameter --name $param.Name --value $param.Value --description $param.Description --type String --overwrite --region $Region | Out-Null
        Write-Host "  ✅ Stored: $($param.Name)" -ForegroundColor Green
    }
    catch {
        Write-Warning "  ⚠️ Failed to store: $($param.Name) - $_"
    }
}

# Deploy CI/CD Stack
Write-Host "`n🏗️ Deploying CI/CD Pipeline Stack..." -ForegroundColor Magenta

$cicdParams = @{
    Environment = $Environment
    ProjectName = $ProjectName
    GitHubOwner = $GitHubOwner
    GitHubRepo = $GitHubRepo
    GitHubToken = $GitHubToken
    MainStackName = $MainStackName
}

# Convert parameters to CloudFormation format
$paramArray = @()
foreach ($key in $cicdParams.Keys) {
    $paramArray += "ParameterKey=$key,ParameterValue=$($cicdParams[$key])"
}
$paramString = "--parameter-overrides " + ($paramArray -join " ")

try {
    $templateFile = Join-Path $InfrastructureDir "codepipeline-cicd.yaml"
    $cmd = "aws cloudformation deploy --template-file `"$templateFile`" --stack-name `"$CICDStackName`" --region `"$Region`" $paramString --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --no-fail-on-empty-changeset"
    
    Write-Host "Deploying CI/CD stack..." -ForegroundColor Blue
    Invoke-Expression $cmd
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ CI/CD stack deployed successfully" -ForegroundColor Green
    }
    else {
        Write-Error "❌ CI/CD stack deployment failed"
    }
}
catch {
    Write-Error "❌ Failed to deploy CI/CD stack: $_"
}

# Set up SNS notification subscription
Write-Host "`n📧 Setting up pipeline notifications..." -ForegroundColor Blue
try {
    $notificationTopic = Get-StackOutput $CICDStackName "PipelineNotificationTopicArn"
    if ($notificationTopic -and $NotificationEmail) {
        aws sns subscribe --topic-arn $notificationTopic --protocol email --notification-endpoint $NotificationEmail --region $Region | Out-Null
        Write-Host "✅ Email notification subscription created for: $NotificationEmail" -ForegroundColor Green
        Write-Host "   Check your email and confirm the subscription" -ForegroundColor Yellow
    }
}
catch {
    Write-Warning "⚠️ Failed to create notification subscription: $_"
}

# Get final outputs
$pipelineUrl = Get-StackOutput $CICDStackName "PipelineUrl"
$pipelineName = Get-StackOutput $CICDStackName "PipelineName"
$artifactsBucket = Get-StackOutput $CICDStackName "ArtifactsBucketName"

Write-Host "`n🎉 CI/CD Pipeline Setup Complete!" -ForegroundColor Green
Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray

Write-Host "`n📋 Pipeline Information:" -ForegroundColor Yellow
Write-Host "  Pipeline Name: $pipelineName" -ForegroundColor White
Write-Host "  Pipeline URL: $pipelineUrl" -ForegroundColor White
Write-Host "  Artifacts Bucket: $artifactsBucket" -ForegroundColor White

Write-Host "`n🔄 Pipeline Stages:" -ForegroundColor Yellow
Write-Host "  1. Source - GitHub repository ($GitHubOwner/$GitHubRepo)" -ForegroundColor White
Write-Host "  2. Test - ESLint, TypeScript check, unit tests, security audit" -ForegroundColor White
Write-Host "  3. Build - Parallel build of Phase 1 and Phase 2" -ForegroundColor White
Write-Host "  4. Deploy - S3 sync and CloudFront invalidation" -ForegroundColor White

Write-Host "`n🎯 Deployment Targets:" -ForegroundColor Yellow
Write-Host "  Phase 1 (Educational): $phase1Url" -ForegroundColor White
Write-Host "  Phase 2 (Corporate PMO): $phase2Url" -ForegroundColor White

Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Confirm email subscription for pipeline notifications" -ForegroundColor White
Write-Host "  2. Make a commit to trigger the first pipeline run" -ForegroundColor White
Write-Host "  3. Monitor the pipeline execution in the AWS Console" -ForegroundColor White
Write-Host "  4. Verify both phases deploy correctly" -ForegroundColor White

Write-Host "`n⚙️ Pipeline Configuration:" -ForegroundColor Cyan
Write-Host "  - Source: GitHub webhook (polling enabled)" -ForegroundColor White
Write-Host "  - Tests: Automated on every commit" -ForegroundColor White
Write-Host "  - Build: Parallel Phase 1 and Phase 2" -ForegroundColor White
Write-Host "  - Deploy: Automatic to $Environment environment" -ForegroundColor White
Write-Host "  - Notifications: Email alerts for failures and successes" -ForegroundColor White

Write-Host "`n🔧 Managing the Pipeline:" -ForegroundColor Red
Write-Host "  View logs: Check CodeBuild project logs in AWS Console" -ForegroundColor White
Write-Host "  Manual trigger: Use 'Release change' in CodePipeline console" -ForegroundColor White
Write-Host "  Stop pipeline: Disable in CodePipeline console" -ForegroundColor White
Write-Host "  Update settings: Modify CloudFormation stack parameters" -ForegroundColor White

# Save CI/CD configuration
$cicdConfig = @{
    Environment = $Environment
    Region = $Region
    ProjectName = $ProjectName
    PipelineName = $pipelineName
    PipelineUrl = $pipelineUrl
    ArtifactsBucket = $artifactsBucket
    GitHubRepo = "$GitHubOwner/$GitHubRepo"
    NotificationTopic = $notificationTopic
    Parameters = @{
        Phase1Bucket = $phase1Bucket
        Phase2Bucket = $phase2Bucket
        Phase1DistributionId = $phase1DistId
        Phase2DistributionId = $phase2DistId
        Phase1URL = $phase1Url
        Phase2URL = $phase2Url
    }
    Timestamp = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
}

$configFile = Join-Path $PSScriptRoot ".." "cicd-config-$Environment.json"
$cicdConfig | ConvertTo-Json -Depth 10 | Set-Content -Path $configFile
Write-Host "💾 CI/CD configuration saved to: $configFile" -ForegroundColor Green

Write-Host "`n⏰ Setup completed at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
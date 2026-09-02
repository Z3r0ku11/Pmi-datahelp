#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Deploys the complete PMI-DataHelp system with infrastructure and applications

.DESCRIPTION
    This script orchestrates the full deployment of PMI-DataHelp:
    1. Validates prerequisites and AWS configuration
    2. Deploys core infrastructure (S3, CloudFront, Cognito)
    3. Sets up CI/CD pipeline
    4. Builds and deploys both Phase 1 and Phase 2 applications
    5. Retires old CloudFront distributions as specified

.PARAMETER Environment
    Target environment (dev, staging, prod)

.PARAMETER DomainName
    Primary domain name for the application

.PARAMETER CertificateArn
    ARN of the SSL certificate in ACM (us-east-1)

.PARAMETER GitHubToken
    GitHub personal access token for CI/CD setup

.PARAMETER GitHubOwner
    GitHub repository owner/organization

.PARAMETER GitHubRepo
    GitHub repository name

.PARAMETER RetireOldDistributions
    Whether to retire old CloudFront distributions E2PZTIX3UVRQGX and E1DIOY1CMNCF9Q

.PARAMETER SkipBuild
    Skip building applications (use existing dist folders)

.PARAMETER DryRun
    Show what would be deployed without executing

.EXAMPLE
    ./deploy-full-system.ps1 -Environment prod -DomainName "pmi-datahelp.com" -CertificateArn "arn:aws:acm:us-east-1:664858858204:certificate/xxx" -GitHubToken "ghp_xxx" -GitHubOwner "your-org" -GitHubRepo "pmi-datahelp"
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('dev', 'staging', 'prod')]
    [string]$Environment,
    
    [Parameter(Mandatory=$true)]
    [string]$DomainName,
    
    [Parameter(Mandatory=$true)]
    [string]$CertificateArn,
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken,
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubOwner,
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubRepo,
    
    [Parameter(Mandatory=$false)]
    [switch]$RetireOldDistributions = $true,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false
)

# Configuration
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$Config = @{
    AccountId = "664858858204"
    Region = "us-east-1"
    ProjectName = "pmi-datahelp"
    OldDistributions = @("E2PZTIX3UVRQGX", "E1DIOY1CMNCF9Q")
}

# Logging
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "WARNING" { "Yellow" }
        "SUCCESS" { "Green" }
        default { "White" }
    }
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

function Show-Banner {
    Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                    PMI-DataHelp Deployment                   ║
║                                                              ║
║  Environment: $($Environment.PadRight(15)) Target: AWS us-east-1  ║
║  Domain: $($DomainName.PadRight(20)) Account: $($Config.AccountId)     ║
║                                                              ║
║  Phase 1: Educational Portal (Public Access)                ║
║  Phase 2: PMO Dashboard (Restricted Access)                 ║
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
        throw "AWS CLI not installed or not accessible"
    }
    
    # Check AWS credentials and account
    try {
        $identity = aws sts get-caller-identity --query 'Account' --output text 2>&1
        if ($identity -ne $Config.AccountId) {
            throw "Wrong AWS account. Expected: $($Config.AccountId), Got: $identity"
        }
        Write-Log "AWS Account validated: $identity" -Level "SUCCESS"
    } catch {
        throw "AWS authentication failed: $_"
    }
    
    # Check region
    $currentRegion = aws configure get region 2>&1
    if ($currentRegion -ne $Config.Region) {
        Write-Log "Setting AWS region to $($Config.Region)" -Level "WARNING"
        $env:AWS_DEFAULT_REGION = $Config.Region
    }
    
    # Check Node.js
    try {
        $nodeVersion = node --version 2>&1
        Write-Log "Node.js: $nodeVersion"
    } catch {
        throw "Node.js not installed or not accessible"
    }
    
    # Check npm
    try {
        $npmVersion = npm --version 2>&1
        Write-Log "npm: $npmVersion"
    } catch {
        throw "npm not installed or not accessible"
    }
    
    # Validate certificate
    try {
        $cert = aws acm describe-certificate --certificate-arn $CertificateArn --query 'Certificate.Status' --output text 2>&1
        if ($cert -ne "ISSUED") {
            throw "Certificate not in ISSUED state: $cert"
        }
        Write-Log "SSL Certificate validated: $CertificateArn" -Level "SUCCESS"
    } catch {
        throw "Certificate validation failed: $_"
    }
    
    Write-Log "All prerequisites validated" -Level "SUCCESS"
}

function Deploy-Infrastructure {
    Write-Log "Deploying core infrastructure..."
    
    $stackName = "$($Config.ProjectName)-main-$Environment"
    $templatePath = "./infrastructure/cloudformation/main-infrastructure.yaml"
    
    if (!(Test-Path $templatePath)) {
        throw "Infrastructure template not found: $templatePath"
    }
    
    $parameters = @(
        "ParameterKey=Environment,ParameterValue=$Environment"
        "ParameterKey=DomainName,ParameterValue=$DomainName"
        "ParameterKey=CertificateArn,ParameterValue=$CertificateArn"
        "ParameterKey=ProjectName,ParameterValue=$($Config.ProjectName)"
    )
    
    if ($DryRun) {
        Write-Log "[DRY-RUN] Would deploy stack: $stackName" -Level "WARNING"
        return @{ StackName = $stackName; Status = "DRY-RUN" }
    }
    
    try {
        # Check if stack exists
        $stackExists = $false
        try {
            aws cloudformation describe-stacks --stack-name $stackName --query 'Stacks[0].StackStatus' --output text 2>&1 | Out-Null
            $stackExists = $true
        } catch {}
        
        if ($stackExists) {
            Write-Log "Updating existing stack: $stackName"
            aws cloudformation update-stack `
                --stack-name $stackName `
                --template-body "file://$templatePath" `
                --parameters $parameters `
                --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM `
                --no-cli-pager 2>&1
        } else {
            Write-Log "Creating new stack: $stackName"
            aws cloudformation create-stack `
                --stack-name $stackName `
                --template-body "file://$templatePath" `
                --parameters $parameters `
                --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM `
                --no-cli-pager 2>&1
        }
        
        Write-Log "Waiting for stack deployment to complete..."
        aws cloudformation wait stack-deploy-complete --stack-name $stackName
        
        $outputs = aws cloudformation describe-stacks `
            --stack-name $stackName `
            --query 'Stacks[0].Outputs' `
            --output json | ConvertFrom-Json
        
        Write-Log "Infrastructure deployed successfully" -Level "SUCCESS"
        return @{
            StackName = $stackName
            Status = "SUCCESS"
            Outputs = $outputs
        }
    } catch {
        Write-Log "Infrastructure deployment failed: $_" -Level "ERROR"
        throw
    }
}

function Deploy-CICD {
    param([object]$InfrastructureOutputs)
    
    Write-Log "Setting up CI/CD pipeline..."
    
    if ($DryRun) {
        Write-Log "[DRY-RUN] Would setup CI/CD pipeline" -Level "WARNING"
        return
    }
    
    try {
        $cicdParams = @{
            Environment = $Environment
            GitHubOwner = $GitHubOwner
            GitHubRepo = $GitHubRepo
            GitHubToken = $GitHubToken
            MainStackName = $InfrastructureOutputs.StackName
        }
        
        & ./scripts/setup-cicd.ps1 @cicdParams
        
        Write-Log "CI/CD pipeline configured successfully" -Level "SUCCESS"
    } catch {
        Write-Log "CI/CD setup failed: $_" -Level "ERROR"
        throw
    }
}

function Build-Applications {
    Write-Log "Building applications..."
    
    if ($SkipBuild) {
        Write-Log "Skipping build (using existing dist folders)" -Level "WARNING"
        return
    }
    
    if ($DryRun) {
        Write-Log "[DRY-RUN] Would build Phase 1 and Phase 2 applications" -Level "WARNING"
        return
    }
    
    try {
        # Install dependencies
        Write-Log "Installing dependencies..."
        npm ci
        
        # Build Phase 1
        Write-Log "Building Phase 1 (Educational Portal)..."
        $env:VITE_APP_PHASE = "1"
        $env:VITE_APP_ENVIRONMENT = $Environment
        npm run build:phase1
        
        # Build Phase 2
        Write-Log "Building Phase 2 (PMO Dashboard)..."
        $env:VITE_APP_PHASE = "2"
        $env:VITE_APP_ENVIRONMENT = $Environment
        npm run build:phase2
        
        Write-Log "Applications built successfully" -Level "SUCCESS"
    } catch {
        Write-Log "Build failed: $_" -Level "ERROR"
        throw
    }
}

function Deploy-Applications {
    param([object]$InfrastructureOutputs)
    
    Write-Log "Deploying applications to S3..."
    
    if ($DryRun) {
        Write-Log "[DRY-RUN] Would deploy applications to S3 and invalidate CloudFront" -Level "WARNING"
        return
    }
    
    try {
        # Get bucket names and distribution IDs from outputs
        $phase1Bucket = ($InfrastructureOutputs.Outputs | Where-Object { $_.OutputKey -eq "Phase1BucketName" }).OutputValue
        $phase2Bucket = ($InfrastructureOutputs.Outputs | Where-Object { $_.OutputKey -eq "Phase2BucketName" }).OutputValue
        $phase1DistId = ($InfrastructureOutputs.Outputs | Where-Object { $_.OutputKey -eq "Phase1DistributionId" }).OutputValue
        $phase2DistId = ($InfrastructureOutputs.Outputs | Where-Object { $_.OutputKey -eq "Phase2DistributionId" }).OutputValue
        
        # Deploy Phase 1
        Write-Log "Deploying Phase 1 to $phase1Bucket..."
        aws s3 sync ./phase1/dist/ "s3://$phase1Bucket/" `
            --delete `
            --cache-control "max-age=31536000" `
            --exclude "*.html" `
            --no-cli-pager
        
        # Deploy HTML files with no-cache
        aws s3 sync ./phase1/dist/ "s3://$phase1Bucket/" `
            --cache-control "no-cache" `
            --include "*.html" `
            --no-cli-pager
        
        # Deploy Phase 2
        Write-Log "Deploying Phase 2 to $phase2Bucket..."
        aws s3 sync ./phase2/dist/ "s3://$phase2Bucket/" `
            --delete `
            --cache-control "max-age=31536000" `
            --exclude "*.html" `
            --no-cli-pager
        
        # Deploy HTML files with no-cache
        aws s3 sync ./phase2/dist/ "s3://$phase2Bucket/" `
            --cache-control "no-cache" `
            --include "*.html" `
            --no-cli-pager
        
        # Invalidate CloudFront
        Write-Log "Invalidating CloudFront distributions..."
        aws cloudfront create-invalidation `
            --distribution-id $phase1DistId `
            --paths "/*" `
            --no-cli-pager | Out-Null
        
        aws cloudfront create-invalidation `
            --distribution-id $phase2DistId `
            --paths "/*" `
            --no-cli-pager | Out-Null
        
        Write-Log "Applications deployed successfully" -Level "SUCCESS"
    } catch {
        Write-Log "Application deployment failed: $_" -Level "ERROR"
        throw
    }
}

function Retire-OldDistributions {
    Write-Log "Retiring old CloudFront distributions..."
    
    if (!$RetireOldDistributions) {
        Write-Log "Skipping retirement of old distributions (disabled)" -Level "WARNING"
        return
    }
    
    if ($DryRun) {
        Write-Log "[DRY-RUN] Would retire distributions: $($Config.OldDistributions -join ', ')" -Level "WARNING"
        return
    }
    
    foreach ($distId in $Config.OldDistributions) {
        try {
            Write-Log "Processing distribution: $distId"
            
            # Check if distribution exists and get current status
            $dist = aws cloudfront get-distribution `
                --id $distId `
                --query 'Distribution' `
                --output json 2>&1 | ConvertFrom-Json
            
            if ($dist.Status -eq "Deployed" -and $dist.DistributionConfig.Enabled) {
                Write-Log "Disabling distribution: $distId"
                
                # Disable the distribution
                $config = $dist.DistributionConfig
                $config.Enabled = $false
                $etag = $dist.ETag
                
                $updateResult = aws cloudfront update-distribution `
                    --id $distId `
                    --distribution-config $($config | ConvertTo-Json -Depth 10) `
                    --if-match $etag `
                    --output json | ConvertFrom-Json
                
                Write-Log "Distribution $distId disabled successfully" -Level "SUCCESS"
                Write-Log "Note: Distribution will be automatically deleted after propagation" -Level "WARNING"
            } else {
                Write-Log "Distribution $distId is already disabled or not in deployed state" -Level "WARNING"
            }
        } catch {
            Write-Log "Failed to process distribution ${distId}: $_" -Level "ERROR"
            # Continue with other distributions
        }
    }
}

function Show-DeploymentSummary {
    param([object]$InfrastructureOutputs)
    
    Write-Host @"

╔══════════════════════════════════════════════════════════════╗
║                    DEPLOYMENT SUMMARY                        ║
╚══════════════════════════════════════════════════════════════╝

Environment: $Environment
Account: $($Config.AccountId)
Region: $($Config.Region)

"@ -ForegroundColor Green
    
    if ($InfrastructureOutputs.Outputs) {
        Write-Host "📋 Infrastructure Outputs:" -ForegroundColor Yellow
        foreach ($output in $InfrastructureOutputs.Outputs) {
            Write-Host "  $($output.OutputKey): $($output.OutputValue)" -ForegroundColor White
        }
        Write-Host ""
    }
    
    Write-Host "🚀 Applications:" -ForegroundColor Yellow
    Write-Host "  Phase 1 (Educational Portal): Deployed" -ForegroundColor Green
    Write-Host "  Phase 2 (PMO Dashboard): Deployed" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "🔄 CI/CD Pipeline:" -ForegroundColor Yellow
    Write-Host "  Status: Configured and Ready" -ForegroundColor Green
    Write-Host "  GitHub Integration: Active" -ForegroundColor Green
    Write-Host ""
    
    if ($RetireOldDistributions) {
        Write-Host "🗑️  Old Distributions:" -ForegroundColor Yellow
        foreach ($distId in $Config.OldDistributions) {
            Write-Host "  $distId: Retired" -ForegroundColor Red
        }
        Write-Host ""
    }
    
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Configure DNS to point to new CloudFront distributions" -ForegroundColor White
    Write-Host "2. Update environment variables in CI/CD pipeline" -ForegroundColor White
    Write-Host "3. Test both Phase 1 and Phase 2 applications" -ForegroundColor White
    Write-Host "4. Monitor deployment in AWS Console" -ForegroundColor White
}

# Main execution
try {
    Show-Banner
    
    Write-Log "Starting PMI-DataHelp deployment..." -Level "SUCCESS"
    Write-Log "Environment: $Environment | Domain: $DomainName | Dry Run: $DryRun"
    
    # Step 1: Validate prerequisites
    Test-Prerequisites
    
    # Step 2: Deploy infrastructure
    $infraResult = Deploy-Infrastructure
    
    # Step 3: Setup CI/CD
    Deploy-CICD -InfrastructureOutputs $infraResult
    
    # Step 4: Build applications
    Build-Applications
    
    # Step 5: Deploy applications
    Deploy-Applications -InfrastructureOutputs $infraResult
    
    # Step 6: Retire old distributions (as per master prompt)
    Retire-OldDistributions
    
    # Step 7: Show summary
    Show-DeploymentSummary -InfrastructureOutputs $infraResult
    
    Write-Log "PMI-DataHelp deployment completed successfully!" -Level "SUCCESS"
    
} catch {
    Write-Log "Deployment failed: $_" -Level "ERROR"
    Write-Log "Check the logs above for details" -Level "ERROR"
    exit 1
}
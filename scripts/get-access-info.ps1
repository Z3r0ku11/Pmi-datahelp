#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Retrieves access information for deployed PMI-DataHelp system

.DESCRIPTION
    Provides comprehensive access information including URLs, credentials,
    and system status for the deployed PMI-DataHelp system

.PARAMETER Environment
    Target environment (dev, staging, prod)

.PARAMETER ShowCredentials
    Display test user credentials (use with caution)

.PARAMETER ShowAll
    Display all available information

.EXAMPLE
    ./get-access-info.ps1 -Environment prod -ShowAll
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('dev', 'staging', 'prod')]
    [string]$Environment,
    
    [Parameter(Mandatory=$false)]
    [switch]$ShowCredentials = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$ShowAll = $false
)

# Configuration
$Config = @{
    AccountId = "664858858204"
    Region = "us-east-1"
    ProjectName = "pmi-datahelp"
}

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║ $($Title.PadRight(65)) ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Get-StackOutputs {
    param([string]$StackName)
    
    try {
        $outputs = aws cloudformation describe-stacks `
            --stack-name $StackName `
            --query 'Stacks[0].Outputs' `
            --output json | ConvertFrom-Json
        
        $outputHash = @{}
        foreach ($output in $outputs) {
            $outputHash[$output.OutputKey] = $output.OutputValue
        }
        
        return $outputHash
    } catch {
        Write-Host "❌ Failed to get stack outputs for $StackName" -ForegroundColor Red
        return @{}
    }
}

function Show-SystemOverview {
    Write-Header "PMI-DataHelp System Overview - $Environment Environment"
    
    Write-Host "🏢 Project: PMI-DataHelp v2.0" -ForegroundColor Yellow
    Write-Host "🌍 Environment: $Environment" -ForegroundColor Yellow  
    Write-Host "☁️  AWS Account: $($Config.AccountId)" -ForegroundColor Yellow
    Write-Host "📍 AWS Region: $($Config.Region)" -ForegroundColor Yellow
    Write-Host "📅 Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "📋 System Components:" -ForegroundColor Green
    Write-Host "  • Phase 1: Educational Portal (Public Access)" -ForegroundColor White
    Write-Host "  • Phase 2: PMO Dashboard (Restricted Access)" -ForegroundColor White
    Write-Host "  • Authentication: AWS Cognito + Google OAuth" -ForegroundColor White
    Write-Host "  • CI/CD: AWS CodePipeline + CodeBuild" -ForegroundColor White
    Write-Host "  • Storage: Amazon S3 + CloudFront CDN" -ForegroundColor White
}

function Show-AccessUrls {
    Write-Header "Application Access URLs"
    
    $mainStack = "$($Config.ProjectName)-main-$Environment"
    $outputs = Get-StackOutputs -StackName $mainStack
    
    if ($outputs.Count -gt 0) {
        Write-Host "🌐 Phase 1 - Educational Portal:" -ForegroundColor Green
        if ($outputs.Phase1DomainName) {
            Write-Host "   Primary URL: https://$($outputs.Phase1DomainName)" -ForegroundColor White
        }
        if ($outputs.Phase1DistributionDomainName) {
            Write-Host "   CloudFront: https://$($outputs.Phase1DistributionDomainName)" -ForegroundColor Gray
        }
        Write-Host "   Purpose: Public educational content, resources, and tools" -ForegroundColor Gray
        Write-Host ""
        
        Write-Host "🏢 Phase 2 - PMO Dashboard:" -ForegroundColor Green
        if ($outputs.Phase2DomainName) {
            Write-Host "   Primary URL: https://$($outputs.Phase2DomainName)" -ForegroundColor White
        }
        if ($outputs.Phase2DistributionDomainName) {
            Write-Host "   CloudFront: https://$($outputs.Phase2DistributionDomainName)" -ForegroundColor Gray
        }
        Write-Host "   Purpose: Executive dashboard for PMO team" -ForegroundColor Gray
        Write-Host "   Access: Restricted to admin/pmo/executive roles" -ForegroundColor Red
        Write-Host ""
        
        if ($outputs.ApiDomainName) {
            Write-Host "🔌 API Endpoint:" -ForegroundColor Green
            Write-Host "   URL: https://$($outputs.ApiDomainName)" -ForegroundColor White
            Write-Host "   Health Check: https://$($outputs.ApiDomainName)/health" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ Unable to retrieve URLs. Check CloudFormation stack: $mainStack" -ForegroundColor Red
    }
}

function Show-AuthenticationInfo {
    Write-Header "Authentication System"
    
    try {
        # Get Cognito User Pool info
        $userPools = aws cognito-idp list-user-pools --max-results 50 --output json | ConvertFrom-Json
        $pmiPool = $userPools.UserPools | Where-Object { $_.Name -like "*$($Config.ProjectName)*$Environment*" }
        
        if ($pmiPool) {
            Write-Host "🔐 AWS Cognito User Pool:" -ForegroundColor Green
            Write-Host "   Pool ID: $($pmiPool.Id)" -ForegroundColor White
            Write-Host "   Pool Name: $($pmiPool.Name)" -ForegroundColor White
            Write-Host "   Creation Date: $($pmiPool.CreationDate)" -ForegroundColor Gray
            Write-Host ""
            
            # Get clients
            $clients = aws cognito-idp list-user-pool-clients `
                --user-pool-id $pmiPool.Id `
                --output json | ConvertFrom-Json
            
            Write-Host "📱 Application Clients:" -ForegroundColor Green
            foreach ($client in $clients.UserPoolClients) {
                $phase = if ($client.ClientName -like "*phase1*") { "Phase 1" } 
                        elseif ($client.ClientName -like "*phase2*") { "Phase 2" } 
                        else { "Unknown" }
                
                Write-Host "   $phase Client ID: $($client.ClientId)" -ForegroundColor White
                Write-Host "   Client Name: $($client.ClientName)" -ForegroundColor Gray
            }
        } else {
            Write-Host "❌ Cognito User Pool not found" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Failed to retrieve Cognito information: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "👥 User Roles & Permissions:" -ForegroundColor Green
    Write-Host "   • admin: Full system access (all phases + settings)" -ForegroundColor White
    Write-Host "   • pmo: PMO dashboard access (Phase 2 + limited admin)" -ForegroundColor White  
    Write-Host "   • executive: Read-only dashboard access (Phase 2 view-only)" -ForegroundColor White
    Write-Host "   • user: Public portal access only (Phase 1)" -ForegroundColor White
}

function Show-TestCredentials {
    if (!$ShowCredentials -and !$ShowAll) {
        Write-Host ""
        Write-Host "ℹ️  Use -ShowCredentials to display test user accounts" -ForegroundColor Yellow
        return
    }
    
    Write-Header "Test User Accounts"
    
    Write-Host "⚠️  DEVELOPMENT/TESTING CREDENTIALS ONLY" -ForegroundColor Red
    Write-Host "🔒 Change these passwords immediately after first login" -ForegroundColor Red
    Write-Host ""
    
    Write-Host "👑 Administrator Account:" -ForegroundColor Red
    Write-Host "   Email: admin@morris.com" -ForegroundColor White
    Write-Host "   Password: TempPassword123! (temporary)" -ForegroundColor Yellow
    Write-Host "   Access: Full system (Phase 1 + Phase 2 + Settings)" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "🏢 PMO Manager Account:" -ForegroundColor Blue
    Write-Host "   Email: pmo@morris.com" -ForegroundColor White
    Write-Host "   Password: TempPassword123! (temporary)" -ForegroundColor Yellow
    Write-Host "   Access: PMO Dashboard (Phase 2) + limited admin" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "📊 Executive Account:" -ForegroundColor Green
    Write-Host "   Email: executive@morris.com" -ForegroundColor White
    Write-Host "   Password: TempPassword123! (temporary)" -ForegroundColor Yellow
    Write-Host "   Access: Read-only Dashboard (Phase 2 view-only)" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "👤 Standard User Account:" -ForegroundColor Cyan
    Write-Host "   Email: user@example.com" -ForegroundColor White
    Write-Host "   Password: TempPassword123! (temporary)" -ForegroundColor Yellow
    Write-Host "   Access: Educational Portal only (Phase 1)" -ForegroundColor Gray
}

function Show-InfrastructureInfo {
    if (!$ShowAll) {
        return
    }
    
    Write-Header "Infrastructure Details"
    
    $mainStack = "$($Config.ProjectName)-main-$Environment"
    $cicdStack = "$($Config.ProjectName)-cicd-$Environment"
    
    # Main infrastructure
    try {
        $mainStackInfo = aws cloudformation describe-stacks `
            --stack-name $mainStack `
            --query 'Stacks[0]' `
            --output json | ConvertFrom-Json
        
        Write-Host "🏗️  Main Infrastructure Stack:" -ForegroundColor Green
        Write-Host "   Name: $mainStack" -ForegroundColor White
        Write-Host "   Status: $($mainStackInfo.StackStatus)" -ForegroundColor White
        Write-Host "   Created: $($mainStackInfo.CreationTime)" -ForegroundColor Gray
        
        if ($mainStackInfo.LastUpdatedTime) {
            Write-Host "   Updated: $($mainStackInfo.LastUpdatedTime)" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "❌ Main stack information unavailable" -ForegroundColor Red
    }
    
    Write-Host ""
    
    # CI/CD infrastructure  
    try {
        $cicdStackInfo = aws cloudformation describe-stacks `
            --stack-name $cicdStack `
            --query 'Stacks[0]' `
            --output json | ConvertFrom-Json
        
        Write-Host "🚀 CI/CD Pipeline Stack:" -ForegroundColor Green
        Write-Host "   Name: $cicdStack" -ForegroundColor White
        Write-Host "   Status: $($cicdStackInfo.StackStatus)" -ForegroundColor White
        Write-Host "   Created: $($cicdStackInfo.CreationTime)" -ForegroundColor Gray
        
    } catch {
        Write-Host "❌ CI/CD stack information unavailable" -ForegroundColor Red
    }
    
    Write-Host ""
    
    # S3 Buckets
    Write-Host "🗄️  Storage Buckets:" -ForegroundColor Green
    $phase1Bucket = "$($Config.ProjectName)-phase1-$Environment-$($Config.AccountId)"
    $phase2Bucket = "$($Config.ProjectName)-phase2-$Environment-$($Config.AccountId)"
    
    try {
        aws s3api head-bucket --bucket $phase1Bucket 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   Phase 1: s3://$phase1Bucket ✅" -ForegroundColor White
        }
    } catch {
        Write-Host "   Phase 1: s3://$phase1Bucket ❌" -ForegroundColor Red
    }
    
    try {
        aws s3api head-bucket --bucket $phase2Bucket 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   Phase 2: s3://$phase2Bucket ✅" -ForegroundColor White
        }
    } catch {
        Write-Host "   Phase 2: s3://$phase2Bucket ❌" -ForegroundColor Red
    }
}

function Show-MonitoringInfo {
    if (!$ShowAll) {
        return
    }
    
    Write-Header "Monitoring & Management"
    
    Write-Host "📊 AWS Console Links:" -ForegroundColor Green
    Write-Host "   CloudFormation: https://console.aws.amazon.com/cloudformation/home?region=$($Config.Region)" -ForegroundColor White
    Write-Host "   CodePipeline: https://console.aws.amazon.com/codesuite/codepipeline/pipelines" -ForegroundColor White
    Write-Host "   CloudFront: https://console.aws.amazon.com/cloudfront/v3/home" -ForegroundColor White
    Write-Host "   S3 Buckets: https://console.aws.amazon.com/s3/home?region=$($Config.Region)" -ForegroundColor White
    Write-Host "   Cognito: https://console.aws.amazon.com/cognito/home?region=$($Config.Region)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🔧 Management Scripts:" -ForegroundColor Green
    Write-Host "   Deploy System: ./scripts/deploy-full-system.ps1" -ForegroundColor White
    Write-Host "   Validate Deployment: ./scripts/validate-deployment.ps1" -ForegroundColor White
    Write-Host "   Manage Pipeline: ./scripts/manage-pipeline.ps1" -ForegroundColor White
    Write-Host "   Retire Old Distributions: ./scripts/retire-cloudfront-distributions.ps1" -ForegroundColor White
}

function Show-NextSteps {
    Write-Header "Next Steps & Quick Start"
    
    Write-Host "🚀 Getting Started:" -ForegroundColor Green
    Write-Host "   1. Test Phase 1 portal access (public)" -ForegroundColor White
    Write-Host "   2. Login to Phase 2 dashboard with admin credentials" -ForegroundColor White
    Write-Host "   3. Create additional user accounts as needed" -ForegroundColor White
    Write-Host "   4. Configure DNS if using custom domain" -ForegroundColor White
    Write-Host "   5. Populate initial content and data" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🔐 Security Tasks:" -ForegroundColor Red
    Write-Host "   • Change all temporary passwords immediately" -ForegroundColor White
    Write-Host "   • Review and adjust user permissions" -ForegroundColor White
    Write-Host "   • Enable MFA for administrator accounts" -ForegroundColor White
    Write-Host "   • Configure backup and monitoring" -ForegroundColor White
    Write-Host ""
    
    Write-Host "📚 Documentation:" -ForegroundColor Blue
    Write-Host "   • Deployment Guide: ./docs/DEPLOYMENT-GUIDE.md" -ForegroundColor White
    Write-Host "   • Authentication Setup: ./docs/AUTHENTICATION.md" -ForegroundColor White
    Write-Host "   • CI/CD Configuration: ./docs/CI-CD-SETUP.md" -ForegroundColor White
    Write-Host "   • Infrastructure Details: ./docs/INFRASTRUCTURE.md" -ForegroundColor White
}

# Main execution
try {
    Show-SystemOverview
    Show-AccessUrls
    Show-AuthenticationInfo
    Show-TestCredentials
    Show-InfrastructureInfo
    Show-MonitoringInfo  
    Show-NextSteps
    
    Write-Host ""
    Write-Host "✅ PMI-DataHelp system information displayed successfully!" -ForegroundColor Green
    Write-Host "📋 Save this information for your records" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Failed to retrieve system information: $_" -ForegroundColor Red
    exit 1
}
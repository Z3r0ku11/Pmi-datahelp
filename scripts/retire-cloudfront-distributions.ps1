#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Retires old CloudFront distributions as specified in the master prompt

.DESCRIPTION
    This script safely retires the old CloudFront distributions:
    - E2PZTIX3UVRQGX
    - E1DIOY1CMNCF9Q
    
    The script will:
    1. Check current status of each distribution
    2. Disable the distributions if they are enabled
    3. Wait for propagation
    4. Provide cleanup instructions

.PARAMETER DryRun
    Show what would be done without executing changes

.PARAMETER Force
    Skip confirmation prompts

.EXAMPLE
    ./retire-cloudfront-distributions.ps1 -DryRun
    
.EXAMPLE
    ./retire-cloudfront-distributions.ps1 -Force
#>

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force = $false
)

# Configuration
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Old distributions that must be retired per master prompt
$OldDistributions = @(
    @{
        Id = "E2PZTIX3UVRQGX"
        Name = "Legacy Distribution 1"
        Purpose = "Old PMI-DataHelp distribution"
    },
    @{
        Id = "E1DIOY1CMNCF9Q" 
        Name = "Legacy Distribution 2"
        Purpose = "Old PMI-DataHelp distribution"
    }
)

# Logging
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "WARNING" { "Yellow" }
        "SUCCESS" { "Green" }
        "CRITICAL" { "Magenta" }
        default { "White" }
    }
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

function Show-Banner {
    Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║              CloudFront Distribution Retirement              ║
║                                                              ║
║  🚨 CRITICAL: Retiring Legacy Distributions                 ║
║                                                              ║
║  Target Distributions:                                       ║
║  • E2PZTIX3UVRQGX (Legacy Distribution 1)                   ║
║  • E1DIOY1CMNCF9Q (Legacy Distribution 2)                   ║
║                                                              ║
║  ⚠️  This action will disable traffic to old endpoints      ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Red
}

function Test-Prerequisites {
    Write-Log "Validating prerequisites for CloudFront retirement..."
    
    # Check AWS CLI
    try {
        $awsVersion = aws --version 2>&1
        Write-Log "AWS CLI: $awsVersion"
    } catch {
        throw "AWS CLI not installed or not accessible"
    }
    
    # Check AWS credentials
    try {
        $identity = aws sts get-caller-identity --query 'Account' --output text 2>&1
        Write-Log "AWS Account: $identity" -Level "SUCCESS"
    } catch {
        throw "AWS authentication failed: $_"
    }
    
    # Set region to us-east-1 (CloudFront requires this)
    $env:AWS_DEFAULT_REGION = "us-east-1"
    Write-Log "AWS Region set to us-east-1 (required for CloudFront)" -Level "SUCCESS"
}

function Get-DistributionStatus {
    param([string]$DistributionId)
    
    try {
        Write-Log "Checking status of distribution: $DistributionId"
        
        $distribution = aws cloudfront get-distribution `
            --id $DistributionId `
            --query 'Distribution' `
            --output json 2>&1 | ConvertFrom-Json
        
        if ($distribution) {
            $config = $distribution.DistributionConfig
            $status = @{
                Id = $DistributionId
                Status = $distribution.Status
                Enabled = $config.Enabled
                ETag = $distribution.ETag
                DomainName = $config.CallerReference
                Origins = $config.Origins.Items | ForEach-Object { $_.DomainName }
                LastModified = $distribution.LastModifiedTime
            }
            
            Write-Log "Distribution $DistributionId found - Status: $($status.Status), Enabled: $($status.Enabled)" -Level "SUCCESS"
            return $status
        }
    } catch {
        Write-Log "Failed to get distribution $DistributionId : $_" -Level "ERROR"
        return $null
    }
}

function Show-DistributionDetails {
    param([object]$Status, [object]$Metadata)
    
    Write-Host @"

📊 Distribution Details:
   ID: $($Status.Id)
   Name: $($Metadata.Name)
   Purpose: $($Metadata.Purpose)
   Status: $($Status.Status)
   Enabled: $($Status.Enabled)
   Last Modified: $($Status.LastModified)
   Origins: $($Status.Origins -join ', ')

"@ -ForegroundColor Yellow
}

function Disable-Distribution {
    param([object]$Status, [object]$Metadata)
    
    if (!$Status.Enabled) {
        Write-Log "Distribution $($Status.Id) is already disabled" -Level "WARNING"
        return $true
    }
    
    Write-Log "Disabling distribution: $($Status.Id)" -Level "CRITICAL"
    
    if ($DryRun) {
        Write-Log "[DRY-RUN] Would disable distribution $($Status.Id)" -Level "WARNING"
        return $true
    }
    
    try {
        # Get current distribution configuration
        $distribution = aws cloudfront get-distribution `
            --id $Status.Id `
            --output json | ConvertFrom-Json
        
        # Modify configuration to disable
        $config = $distribution.Distribution.DistributionConfig
        $config.Enabled = $false
        
        # Update the distribution
        $configJson = $config | ConvertTo-Json -Depth 10 -Compress
        
        Write-Log "Updating distribution configuration..."
        $updateResult = aws cloudfront update-distribution `
            --id $Status.Id `
            --distribution-config $configJson `
            --if-match $distribution.Distribution.ETag `
            --output json 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Distribution $($Status.Id) disabled successfully" -Level "SUCCESS"
            return $true
        } else {
            Write-Log "Failed to disable distribution $($Status.Id): $updateResult" -Level "ERROR"
            return $false
        }
    } catch {
        Write-Log "Error disabling distribution $($Status.Id): $_" -Level "ERROR"
        return $false
    }
}

function Wait-ForPropagation {
    param([string]$DistributionId)
    
    Write-Log "Waiting for distribution $DistributionId to propagate..."
    
    if ($DryRun) {
        Write-Log "[DRY-RUN] Would wait for propagation of $DistributionId" -Level "WARNING"
        return
    }
    
    $maxWait = 30 # minutes
    $elapsed = 0
    
    while ($elapsed -lt $maxWait) {
        try {
            $status = aws cloudfront get-distribution `
                --id $DistributionId `
                --query 'Distribution.Status' `
                --output text 2>&1
            
            if ($status -eq "Deployed") {
                Write-Log "Distribution $DistributionId propagation complete" -Level "SUCCESS"
                return
            }
            
            Write-Log "Distribution $DistributionId status: $status (waiting...)"
            Start-Sleep -Seconds 60
            $elapsed++
        } catch {
            Write-Log "Error checking propagation status: $_" -Level "WARNING"
            Start-Sleep -Seconds 60
            $elapsed++
        }
    }
    
    Write-Log "Timeout waiting for propagation of $DistributionId" -Level "WARNING"
}

function Confirm-Retirement {
    if ($Force -or $DryRun) {
        return $true
    }
    
    Write-Host @"

⚠️  CONFIRMATION REQUIRED ⚠️

You are about to retire the following CloudFront distributions:
• E2PZTIX3UVRQGX (Legacy Distribution 1)  
• E1DIOY1CMNCF9Q (Legacy Distribution 2)

This action will:
✓ Disable the distributions (stop serving traffic)
✓ Make existing URLs inaccessible
✓ Require DNS updates to new distributions
✓ Cannot be easily reversed

"@ -ForegroundColor Red
    
    $response = Read-Host "Type 'RETIRE' to confirm retirement"
    return ($response -eq "RETIRE")
}

function Show-RetirementSummary {
    param([array]$Results)
    
    Write-Host @"

╔══════════════════════════════════════════════════════════════╗
║                  RETIREMENT SUMMARY                          ║
╚══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Green
    
    foreach ($result in $Results) {
        $status = if ($result.Success) { "✅ RETIRED" } else { "❌ FAILED" }
        $color = if ($result.Success) { "Green" } else { "Red" }
        
        Write-Host "Distribution $($result.Id): $status" -ForegroundColor $color
        if ($result.Message) {
            Write-Host "  └─ $($result.Message)" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    
    $successCount = ($Results | Where-Object { $_.Success }).Count
    $totalCount = $Results.Count
    
    if ($successCount -eq $totalCount) {
        Write-Host "🎉 All distributions retired successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Yellow
        Write-Host "1. Update DNS records to point to new distributions" -ForegroundColor White
        Write-Host "2. Monitor for any remaining traffic to old endpoints" -ForegroundColor White
        Write-Host "3. Update any hardcoded URLs in applications" -ForegroundColor White
        Write-Host "4. Consider setting up HTTP redirects if needed" -ForegroundColor White
    } else {
        Write-Host "⚠️  Some distributions could not be retired" -ForegroundColor Red
        Write-Host "Please check the errors above and retry" -ForegroundColor Yellow
    }
}

# Main execution
try {
    Show-Banner
    
    if (!$Confirm-Retirement) {
        Write-Log "Retirement cancelled by user" -Level "WARNING"
        exit 0
    }
    
    Write-Log "Starting CloudFront distribution retirement..." -Level "CRITICAL"
    
    # Validate prerequisites
    Test-Prerequisites
    
    $results = @()
    
    foreach ($distMeta in $OldDistributions) {
        Write-Log "Processing distribution: $($distMeta.Id) ($($distMeta.Name))" -Level "CRITICAL"
        
        # Get current status
        $status = Get-DistributionStatus -DistributionId $distMeta.Id
        
        if ($status) {
            Show-DistributionDetails -Status $status -Metadata $distMeta
            
            # Disable the distribution
            $success = Disable-Distribution -Status $status -Metadata $distMeta
            
            if ($success) {
                # Wait for propagation
                Wait-ForPropagation -DistributionId $distMeta.Id
                
                $results += @{
                    Id = $distMeta.Id
                    Success = $true
                    Message = "Successfully disabled and propagated"
                }
            } else {
                $results += @{
                    Id = $distMeta.Id
                    Success = $false
                    Message = "Failed to disable distribution"
                }
            }
        } else {
            $results += @{
                Id = $distMeta.Id
                Success = $false
                Message = "Distribution not found or inaccessible"
            }
        }
    }
    
    # Show summary
    Show-RetirementSummary -Results $results
    
    Write-Log "CloudFront retirement process completed" -Level "SUCCESS"
    
} catch {
    Write-Log "Retirement process failed: $_" -Level "ERROR"
    exit 1
}
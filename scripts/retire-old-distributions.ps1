#!/usr/bin/env pwsh
<#
.SYNOPSIS
Retire Old CloudFront Distributions
.DESCRIPTION
Safely retires the old CloudFront distributions E2PZTIX3UVRQGX and E1DIOY1CMNCF9Q as specified in the requirements
.PARAMETER WhatIf
Shows what would be done without actually making changes
.PARAMETER Force
Skip confirmation prompts
#>

param(
    [Parameter(Mandatory = $false)]
    [switch]$WhatIf,
    
    [Parameter(Mandatory = $false)]
    [switch]$Force
)

$ErrorActionPreference = "Stop"

# Old distributions to retire (as specified in master prompt)
$OldDistributions = @(
    @{
        Id = "E2PZTIX3UVRQGX"
        Description = "Legacy distribution 1"
    },
    @{
        Id = "E1DIOY1CMNCF9Q"
        Description = "Legacy distribution 2"
    }
)

Write-Host "🔄 PMI-DataHelp CloudFront Distribution Retirement" -ForegroundColor Red
Write-Host "This script will retire the following old distributions:" -ForegroundColor Yellow

foreach ($dist in $OldDistributions) {
    Write-Host "  - $($dist.Id) ($($dist.Description))" -ForegroundColor White
}

if ($WhatIf) {
    Write-Host "`n🔍 What-If Mode: No actual changes will be made" -ForegroundColor Yellow
}

# Check AWS CLI
try {
    $awsVersion = aws --version 2>$null
    Write-Host "`n✅ AWS CLI: $awsVersion" -ForegroundColor Green
}
catch {
    Write-Error "❌ AWS CLI not found. Please install AWS CLI v2"
}

# Check AWS credentials
try {
    $identity = aws sts get-caller-identity | ConvertFrom-Json
    Write-Host "✅ AWS Identity: $($identity.Arn)" -ForegroundColor Green
}
catch {
    Write-Error "❌ AWS credentials not configured"
}

# Function to get distribution configuration
function Get-DistributionConfig {
    param([string]$DistributionId)
    
    try {
        $result = aws cloudfront get-distribution --id $DistributionId | ConvertFrom-Json
        return $result
    }
    catch {
        Write-Warning "⚠️ Could not retrieve distribution $DistributionId`: $_"
        return $null
    }
}

# Function to disable distribution
function Disable-Distribution {
    param([string]$DistributionId, [string]$ETag)
    
    Write-Host "  📝 Creating disable configuration..." -ForegroundColor Blue
    
    # Get current config
    $distConfig = Get-DistributionConfig -DistributionId $DistributionId
    if (-not $distConfig) {
        return $false
    }
    
    # Modify config to disable
    $distConfig.Distribution.DistributionConfig.Enabled = $false
    
    # Create temporary config file
    $tempConfigFile = [System.IO.Path]::GetTempFileName()
    $distConfig.Distribution.DistributionConfig | ConvertTo-Json -Depth 10 | Set-Content $tempConfigFile
    
    try {
        if (-not $WhatIf) {
            aws cloudfront update-distribution --id $DistributionId --distribution-config file://$tempConfigFile --if-match $ETag | Out-Null
        }
        Write-Host "  ✅ Distribution disabled" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Error "  ❌ Failed to disable distribution: $_"
        return $false
    }
    finally {
        if (Test-Path $tempConfigFile) {
            Remove-Item $tempConfigFile -Force
        }
    }
}

# Function to wait for distribution to be disabled
function Wait-ForDistributionDisabled {
    param([string]$DistributionId)
    
    Write-Host "  ⏳ Waiting for distribution to be disabled..." -ForegroundColor Blue
    
    $maxAttempts = 30
    $attempt = 0
    
    while ($attempt -lt $maxAttempts) {
        $attempt++
        
        if ($WhatIf) {
            Write-Host "  🔍 What-If: Would wait for distribution to be disabled" -ForegroundColor Yellow
            return $true
        }
        
        try {
            $result = aws cloudfront get-distribution --id $DistributionId | ConvertFrom-Json
            $status = $result.Distribution.Status
            
            if ($status -eq "Deployed" -and $result.Distribution.DistributionConfig.Enabled -eq $false) {
                Write-Host "  ✅ Distribution is disabled and deployed" -ForegroundColor Green
                return $true
            }
            
            Write-Host "  ⏳ Status: $status (attempt $attempt/$maxAttempts)" -ForegroundColor Gray
            Start-Sleep -Seconds 60
        }
        catch {
            Write-Warning "  ⚠️ Error checking distribution status: $_"
            Start-Sleep -Seconds 60
        }
    }
    
    Write-Warning "  ⚠️ Timeout waiting for distribution to be disabled"
    return $false
}

# Function to delete distribution
function Remove-Distribution {
    param([string]$DistributionId)
    
    Write-Host "  🗑️ Deleting distribution..." -ForegroundColor Red
    
    if ($WhatIf) {
        Write-Host "  🔍 What-If: Would delete distribution $DistributionId" -ForegroundColor Yellow
        return $true
    }
    
    try {
        # Get current ETag
        $result = aws cloudfront get-distribution --id $DistributionId | ConvertFrom-Json
        $etag = $result.ETag
        
        aws cloudfront delete-distribution --id $DistributionId --if-match $etag | Out-Null
        Write-Host "  ✅ Distribution deletion initiated" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Error "  ❌ Failed to delete distribution: $_"
        return $false
    }
}

# Process each distribution
foreach ($dist in $OldDistributions) {
    Write-Host "`n🔄 Processing distribution: $($dist.Id)" -ForegroundColor Magenta
    
    # Get current distribution info
    $distInfo = Get-DistributionConfig -DistributionId $dist.Id
    if (-not $distInfo) {
        Write-Host "  ⏭️ Skipping - distribution not found or inaccessible" -ForegroundColor Yellow
        continue
    }
    
    $currentStatus = $distInfo.Distribution.Status
    $isEnabled = $distInfo.Distribution.DistributionConfig.Enabled
    $domainName = $distInfo.Distribution.DomainName
    $etag = $distInfo.ETag
    
    Write-Host "  📊 Current Status: $currentStatus" -ForegroundColor Gray
    Write-Host "  📊 Enabled: $isEnabled" -ForegroundColor Gray
    Write-Host "  📊 Domain: $domainName" -ForegroundColor Gray
    
    # Show what origins are configured
    $origins = $distInfo.Distribution.DistributionConfig.Origins
    Write-Host "  📊 Origins:" -ForegroundColor Gray
    foreach ($origin in $origins) {
        Write-Host "    - $($origin.Id): $($origin.DomainName)" -ForegroundColor DarkGray
    }
    
    # Confirmation prompt
    if (-not $Force -and -not $WhatIf) {
        $confirmation = Read-Host "  ❓ Are you sure you want to retire this distribution? (y/N)"
        if ($confirmation -notmatch '^[Yy]') {
            Write-Host "  ⏭️ Skipping distribution $($dist.Id)" -ForegroundColor Yellow
            continue
        }
    }
    
    # Step 1: Disable if currently enabled
    if ($isEnabled) {
        Write-Host "  1️⃣ Disabling distribution..." -ForegroundColor Blue
        $disabled = Disable-Distribution -DistributionId $dist.Id -ETag $etag
        
        if ($disabled) {
            # Wait for distribution to be disabled
            $isDisabled = Wait-ForDistributionDisabled -DistributionId $dist.Id
            if (-not $isDisabled) {
                Write-Warning "  ⚠️ Failed to confirm distribution is disabled. Manual intervention may be required."
                continue
            }
        }
        else {
            Write-Warning "  ⚠️ Failed to disable distribution. Skipping deletion."
            continue
        }
    }
    else {
        Write-Host "  ✅ Distribution is already disabled" -ForegroundColor Green
    }
    
    # Step 2: Delete the distribution
    if ($currentStatus -eq "Deployed") {
        Write-Host "  2️⃣ Deleting distribution..." -ForegroundColor Blue
        $deleted = Remove-Distribution -DistributionId $dist.Id
        
        if ($deleted) {
            Write-Host "  ✅ Distribution $($dist.Id) retirement initiated" -ForegroundColor Green
        }
        else {
            Write-Warning "  ⚠️ Failed to delete distribution $($dist.Id)"
        }
    }
    else {
        Write-Host "  ⏳ Distribution status is $currentStatus. May need to wait before deletion." -ForegroundColor Yellow
    }
}

Write-Host "`n🎉 Distribution Retirement Process Complete!" -ForegroundColor Green
Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray

Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Monitor the distributions in AWS Console to confirm deletion" -ForegroundColor White
Write-Host "  2. Update any DNS records that were pointing to the old distributions" -ForegroundColor White
Write-Host "  3. Verify that the new PMI-DataHelp distributions are working correctly" -ForegroundColor White
Write-Host "  4. Update any documentation or runbooks that referenced the old distributions" -ForegroundColor White

Write-Host "`n⚠️  Important Notes:" -ForegroundColor Red
Write-Host "  - Distribution deletion can take up to 24 hours to complete" -ForegroundColor White
Write-Host "  - Once deleted, distribution IDs cannot be reused" -ForegroundColor White
Write-Host "  - Ensure all traffic has been migrated to new distributions before deletion" -ForegroundColor White

if ($WhatIf) {
    Write-Host "`n🔍 This was a What-If run. To actually retire the distributions, run without -WhatIf" -ForegroundColor Yellow
}

Write-Host "`n⏰ Process completed at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
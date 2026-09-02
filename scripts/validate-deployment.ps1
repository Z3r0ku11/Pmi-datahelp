#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Validates PMI-DataHelp deployment and system health

.DESCRIPTION
    Comprehensive validation of the deployed PMI-DataHelp system:
    1. Infrastructure validation (S3, CloudFront, Cognito)
    2. Application health checks (Phase 1 & 2)
    3. Authentication system validation
    4. CI/CD pipeline verification
    5. Performance and security checks

.PARAMETER Environment
    Target environment to validate (dev, staging, prod)

.PARAMETER DomainName
    Primary domain name to test

.PARAMETER SkipPerformanceTests
    Skip performance and load testing

.PARAMETER SkipSecurityTests
    Skip security validation

.PARAMETER Verbose
    Show detailed validation output

.EXAMPLE
    ./validate-deployment.ps1 -Environment prod -DomainName "pmi-datahelp.com"
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('dev', 'staging', 'prod')]
    [string]$Environment,
    
    [Parameter(Mandatory=$true)]
    [string]$DomainName,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipPerformanceTests = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipSecurityTests = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Verbose = $false
)

# Configuration
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$Config = @{
    AccountId = "664858858204"
    Region = "us-east-1"
    ProjectName = "pmi-datahelp"
    Timeouts = @{
        HTTP = 30
        HealthCheck = 60
    }
}

$ValidationResults = @()

# Logging
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "WARNING" { "Yellow" }
        "SUCCESS" { "Green" }
        "VALIDATION" { "Cyan" }
        default { "White" }
    }
    if ($Verbose -or $Level -ne "INFO") {
        Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
    }
}

function Add-ValidationResult {
    param(
        [string]$Category,
        [string]$Test,
        [bool]$Passed,
        [string]$Message = "",
        [object]$Details = $null
    )
    
    $script:ValidationResults += @{
        Category = $Category
        Test = $Test
        Passed = $Passed
        Message = $Message
        Details = $Details
        Timestamp = Get-Date
    }
    
    $status = if ($Passed) { "✅ PASS" } else { "❌ FAIL" }
    $level = if ($Passed) { "SUCCESS" } else { "ERROR" }
    Write-Log "$Category - $Test: $status $(if($Message) { "- $Message" })" -Level $level
}

function Show-Banner {
    Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                   DEPLOYMENT VALIDATION                      ║
║                                                              ║
║  Environment: $($Environment.PadRight(15)) Domain: $DomainName        ║
║  Account: $($Config.AccountId)     Region: $($Config.Region)             ║
║                                                              ║
║  Validating complete PMI-DataHelp system health...          ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan
}

function Test-AWSResources {
    Write-Log "Validating AWS infrastructure..." -Level "VALIDATION"
    
    # Test CloudFormation stacks
    try {
        $mainStack = "$($Config.ProjectName)-main-$Environment"
        $cicdStack = "$($Config.ProjectName)-cicd-$Environment"
        
        $mainStackStatus = aws cloudformation describe-stacks `
            --stack-name $mainStack `
            --query 'Stacks[0].StackStatus' `
            --output text 2>&1
        
        Add-ValidationResult -Category "Infrastructure" -Test "Main CloudFormation Stack" `
            -Passed ($mainStackStatus -eq "CREATE_COMPLETE" -or $mainStackStatus -eq "UPDATE_COMPLETE") `
            -Message "Status: $mainStackStatus"
        
        $cicdStackStatus = aws cloudformation describe-stacks `
            --stack-name $cicdStack `
            --query 'Stacks[0].StackStatus' `
            --output text 2>&1
        
        Add-ValidationResult -Category "Infrastructure" -Test "CI/CD CloudFormation Stack" `
            -Passed ($cicdStackStatus -eq "CREATE_COMPLETE" -or $cicdStackStatus -eq "UPDATE_COMPLETE") `
            -Message "Status: $cicdStackStatus"
            
    } catch {
        Add-ValidationResult -Category "Infrastructure" -Test "CloudFormation Stacks" `
            -Passed $false -Message "Failed to check stacks: $_"
    }
    
    # Test S3 buckets
    try {
        $phase1Bucket = "$($Config.ProjectName)-phase1-$Environment-$($Config.AccountId)"
        $phase2Bucket = "$($Config.ProjectName)-phase2-$Environment-$($Config.AccountId)"
        
        $phase1Exists = (aws s3api head-bucket --bucket $phase1Bucket 2>&1; $?) -and $LASTEXITCODE -eq 0
        $phase2Exists = (aws s3api head-bucket --bucket $phase2Bucket 2>&1; $?) -and $LASTEXITCODE -eq 0
        
        Add-ValidationResult -Category "Storage" -Test "Phase 1 S3 Bucket" `
            -Passed $phase1Exists -Message "Bucket: $phase1Bucket"
        
        Add-ValidationResult -Category "Storage" -Test "Phase 2 S3 Bucket" `
            -Passed $phase2Exists -Message "Bucket: $phase2Bucket"
            
    } catch {
        Add-ValidationResult -Category "Storage" -Test "S3 Buckets" `
            -Passed $false -Message "Failed to check buckets: $_"
    }
    
    # Test CodePipeline
    try {
        $pipelineName = "$($Config.ProjectName)-pipeline-$Environment"
        $pipelineState = aws codepipeline get-pipeline-state `
            --name $pipelineName `
            --query 'stageStates[0].latestExecution.status' `
            --output text 2>&1
        
        Add-ValidationResult -Category "CI/CD" -Test "CodePipeline Status" `
            -Passed ($pipelineState -eq "Succeeded") `
            -Message "Latest execution: $pipelineState"
            
    } catch {
        Add-ValidationResult -Category "CI/CD" -Test "CodePipeline" `
            -Passed $false -Message "Failed to check pipeline: $_"
    }
}

function Test-ApplicationHealth {
    Write-Log "Testing application health..." -Level "VALIDATION"
    
    $phase1Url = "https://$DomainName"
    $phase2Url = "https://pmo.$DomainName"
    
    # Test Phase 1 (Public Portal)
    try {
        $response = Invoke-WebRequest -Uri $phase1Url -TimeoutSec $Config.Timeouts.HTTP -UseBasicParsing
        
        $isHealthy = $response.StatusCode -eq 200 -and 
                    $response.Content.Contains("PMI-DataHelp") -and
                    $response.Headers["Content-Type"] -like "*text/html*"
        
        Add-ValidationResult -Category "Phase 1" -Test "Homepage Load" `
            -Passed $isHealthy `
            -Message "Status: $($response.StatusCode), Size: $($response.Content.Length) bytes" `
            -Details @{ Url = $phase1Url; StatusCode = $response.StatusCode }
            
    } catch {
        Add-ValidationResult -Category "Phase 1" -Test "Homepage Load" `
            -Passed $false -Message "Failed to load: $_"
    }
    
    # Test Phase 2 (PMO Dashboard)
    try {
        $response = Invoke-WebRequest -Uri $phase2Url -TimeoutSec $Config.Timeouts.HTTP -UseBasicParsing
        
        $isHealthy = $response.StatusCode -eq 200 -and 
                    $response.Content.Contains("PMO Dashboard") -and
                    $response.Headers["Content-Type"] -like "*text/html*"
        
        Add-ValidationResult -Category "Phase 2" -Test "Dashboard Load" `
            -Passed $isHealthy `
            -Message "Status: $($response.StatusCode), Size: $($response.Content.Length) bytes" `
            -Details @{ Url = $phase2Url; StatusCode = $response.StatusCode }
            
    } catch {
        Add-ValidationResult -Category "Phase 2" -Test "Dashboard Load" `
            -Passed $false -Message "Failed to load: $_"
    }
    
    # Test API endpoints
    $apiUrl = "https://api.$DomainName"
    try {
        $healthResponse = Invoke-WebRequest -Uri "$apiUrl/health" -TimeoutSec $Config.Timeouts.HTTP -UseBasicParsing
        
        Add-ValidationResult -Category "API" -Test "Health Endpoint" `
            -Passed ($healthResponse.StatusCode -eq 200) `
            -Message "Status: $($healthResponse.StatusCode)"
            
    } catch {
        Add-ValidationResult -Category "API" -Test "Health Endpoint" `
            -Passed $false -Message "Failed to reach API: $_"
    }
}

function Test-Authentication {
    Write-Log "Testing authentication system..." -Level "VALIDATION"
    
    # Test Cognito User Pool
    try {
        $userPools = aws cognito-idp list-user-pools --max-results 10 --output json | ConvertFrom-Json
        $pmiPool = $userPools.UserPools | Where-Object { $_.Name -like "*pmi-datahelp*" }
        
        Add-ValidationResult -Category "Authentication" -Test "Cognito User Pool" `
            -Passed ($pmiPool -ne $null) `
            -Message "Pool found: $($pmiPool.Name)"
            
        if ($pmiPool) {
            # Test user pool clients
            $clients = aws cognito-idp list-user-pool-clients `
                --user-pool-id $pmiPool.Id `
                --output json | ConvertFrom-Json
            
            $hasPhase1Client = $clients.UserPoolClients | Where-Object { $_.ClientName -like "*phase1*" }
            $hasPhase2Client = $clients.UserPoolClients | Where-Object { $_.ClientName -like "*phase2*" }
            
            Add-ValidationResult -Category "Authentication" -Test "Phase 1 Client" `
                -Passed ($hasPhase1Client -ne $null) `
                -Message "Client configured for Phase 1"
                
            Add-ValidationResult -Category "Authentication" -Test "Phase 2 Client" `
                -Passed ($hasPhase2Client -ne $null) `
                -Message "Client configured for Phase 2"
        }
        
    } catch {
        Add-ValidationResult -Category "Authentication" -Test "Cognito Configuration" `
            -Passed $false -Message "Failed to check Cognito: $_"
    }
}

function Test-Security {
    if ($SkipSecurityTests) {
        Write-Log "Skipping security tests (disabled)" -Level "WARNING"
        return
    }
    
    Write-Log "Running security validation..." -Level "VALIDATION"
    
    # Test HTTPS enforcement
    try {
        $httpUrl = "http://$DomainName"
        $response = Invoke-WebRequest -Uri $httpUrl -MaximumRedirection 0 -ErrorAction SilentlyContinue
        
        $redirectsToHttps = $response.StatusCode -ge 300 -and $response.StatusCode -lt 400 -and
                           $response.Headers.Location -like "https://*"
        
        Add-ValidationResult -Category "Security" -Test "HTTPS Redirect" `
            -Passed $redirectsToHttps `
            -Message "HTTP redirects to HTTPS: $redirectsToHttps"
            
    } catch {
        Add-ValidationResult -Category "Security" -Test "HTTPS Redirect" `
            -Passed $false -Message "Failed to test HTTP redirect: $_"
    }
    
    # Test security headers
    try {
        $response = Invoke-WebRequest -Uri "https://$DomainName" -UseBasicParsing
        
        $hasCSP = $response.Headers["Content-Security-Policy"] -ne $null
        $hasHSTS = $response.Headers["Strict-Transport-Security"] -ne $null
        $hasXFrame = $response.Headers["X-Frame-Options"] -ne $null
        
        Add-ValidationResult -Category "Security" -Test "Security Headers" `
            -Passed ($hasCSP -or $hasHSTS -or $hasXFrame) `
            -Message "CSP: $hasCSP, HSTS: $hasHSTS, X-Frame: $hasXFrame"
            
    } catch {
        Add-ValidationResult -Category "Security" -Test "Security Headers" `
            -Passed $false -Message "Failed to check headers: $_"
    }
}

function Test-Performance {
    if ($SkipPerformanceTests) {
        Write-Log "Skipping performance tests (disabled)" -Level "WARNING"
        return
    }
    
    Write-Log "Running performance validation..." -Level "VALIDATION"
    
    # Test page load times
    $urls = @(
        "https://$DomainName",
        "https://pmo.$DomainName"
    )
    
    foreach ($url in $urls) {
        try {
            $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
            $response = Invoke-WebRequest -Uri $url -UseBasicParsing
            $stopwatch.Stop()
            
            $loadTime = $stopwatch.ElapsedMilliseconds
            $isGoodPerformance = $loadTime -lt 3000 # Less than 3 seconds
            
            $pageName = if ($url -like "*pmo*") { "Phase 2" } else { "Phase 1" }
            
            Add-ValidationResult -Category "Performance" -Test "$pageName Load Time" `
                -Passed $isGoodPerformance `
                -Message "$loadTime ms" `
                -Details @{ LoadTime = $loadTime; Url = $url }
                
        } catch {
            Add-ValidationResult -Category "Performance" -Test "Load Time Test" `
                -Passed $false -Message "Failed to test $url : $_"
        }
    }
    
    # Test CloudFront cache headers
    try {
        $response = Invoke-WebRequest -Uri "https://$DomainName/assets/logo.png" -UseBasicParsing -ErrorAction SilentlyContinue
        
        if ($response) {
            $hasCacheControl = $response.Headers["Cache-Control"] -ne $null
            $hasCloudFront = $response.Headers["Via"] -like "*CloudFront*"
            
            Add-ValidationResult -Category "Performance" -Test "CDN Caching" `
                -Passed ($hasCacheControl -and $hasCloudFront) `
                -Message "Cache-Control: $hasCacheControl, CloudFront: $hasCloudFront"
        }
        
    } catch {
        Add-ValidationResult -Category "Performance" -Test "CDN Caching" `
            -Passed $false -Message "Failed to test caching: $_"
    }
}

function Test-Monitoring {
    Write-Log "Testing monitoring and logging..." -Level "VALIDATION"
    
    # Test CloudWatch log groups
    try {
        $logGroups = aws logs describe-log-groups `
            --log-group-name-prefix "/aws/lambda/$($Config.ProjectName)" `
            --output json | ConvertFrom-Json
        
        Add-ValidationResult -Category "Monitoring" -Test "CloudWatch Logs" `
            -Passed ($logGroups.logGroups.Count -gt 0) `
            -Message "$($logGroups.logGroups.Count) log groups found"
            
    } catch {
        Add-ValidationResult -Category "Monitoring" -Test "CloudWatch Logs" `
            -Passed $false -Message "Failed to check logs: $_"
    }
    
    # Test CloudWatch alarms (if any)
    try {
        $alarms = aws cloudwatch describe-alarms `
            --alarm-name-prefix "$($Config.ProjectName)-$Environment" `
            --output json | ConvertFrom-Json
        
        Add-ValidationResult -Category "Monitoring" -Test "CloudWatch Alarms" `
            -Passed $true `
            -Message "$($alarms.MetricAlarms.Count) alarms configured"
            
    } catch {
        Add-ValidationResult -Category "Monitoring" -Test "CloudWatch Alarms" `
            -Passed $false -Message "Failed to check alarms: $_"
    }
}

function Show-ValidationSummary {
    $passed = ($ValidationResults | Where-Object { $_.Passed }).Count
    $failed = ($ValidationResults | Where-Object { !$_.Passed }).Count
    $total = $ValidationResults.Count
    
    Write-Host @"

╔══════════════════════════════════════════════════════════════╗
║                    VALIDATION SUMMARY                        ║
╚══════════════════════════════════════════════════════════════╝

Total Tests: $total
Passed: $passed ✅
Failed: $failed ❌
Success Rate: $([math]::Round($passed / $total * 100, 1))%

"@ -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Yellow" })

    # Group results by category
    $categories = $ValidationResults | Group-Object Category
    
    foreach ($category in $categories) {
        Write-Host "$($category.Name):" -ForegroundColor Yellow
        
        foreach ($result in $category.Group) {
            $status = if ($result.Passed) { "✅" } else { "❌" }
            $color = if ($result.Passed) { "Green" } else { "Red" }
            
            Write-Host "  $status $($result.Test)" -ForegroundColor $color
            if ($result.Message -and !$result.Passed) {
                Write-Host "     └─ $($result.Message)" -ForegroundColor Gray
            }
        }
        Write-Host ""
    }
    
    if ($failed -eq 0) {
        Write-Host "🎉 All validation tests passed! System is healthy." -ForegroundColor Green
    } else {
        Write-Host "⚠️  $failed test(s) failed. Please review and fix issues." -ForegroundColor Red
    }
    
    # Export detailed results
    $resultsFile = "./validation-results-$Environment-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
    $ValidationResults | ConvertTo-Json -Depth 3 | Out-File $resultsFile
    Write-Log "Detailed results exported to: $resultsFile"
}

# Main execution
try {
    Show-Banner
    
    Write-Log "Starting comprehensive validation for $Environment environment..." -Level "VALIDATION"
    
    # Run all validation tests
    Test-AWSResources
    Test-ApplicationHealth  
    Test-Authentication
    Test-Security
    Test-Performance
    Test-Monitoring
    
    # Show summary
    Show-ValidationSummary
    
    # Exit with appropriate code
    $failedTests = ($ValidationResults | Where-Object { !$_.Passed }).Count
    exit $(if ($failedTests -eq 0) { 0 } else { 1 })
    
} catch {
    Write-Log "Validation failed with error: $_" -Level "ERROR"
    exit 1
}
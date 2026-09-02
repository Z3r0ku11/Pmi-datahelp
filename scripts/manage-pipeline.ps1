#!/usr/bin/env pwsh
<#
.SYNOPSIS
Manage PMI-DataHelp CI/CD Pipeline
.DESCRIPTION
Provides commands to manage the CodePipeline - start, stop, retry, and monitor executions
.PARAMETER Action
Action to perform (start, stop, retry, status, logs, history)
.PARAMETER Environment
Environment (dev, staging, prod)
.PARAMETER ExecutionId
Pipeline execution ID for specific actions
#>

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("start", "stop", "retry", "status", "logs", "history", "artifacts")]
    [string]$Action,
    
    [Parameter(Mandatory = $true)]
    [ValidateSet("dev", "staging", "prod")]
    [string]$Environment,
    
    [Parameter(Mandatory = $false)]
    [string]$ExecutionId,
    
    [Parameter(Mandatory = $false)]
    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

# Configuration
$ProjectName = "pmi-datahelp"
$PipelineName = "$ProjectName-pipeline-$Environment"
$ConfigFile = Join-Path $PSScriptRoot ".." "cicd-config-$Environment.json"

Write-Host "🔧 Managing PMI-DataHelp Pipeline" -ForegroundColor Blue
Write-Host "Pipeline: $PipelineName" -ForegroundColor Yellow
Write-Host "Action: $Action" -ForegroundColor Yellow

# Load configuration if available
$config = $null
if (Test-Path $ConfigFile) {
    try {
        $config = Get-Content $ConfigFile | ConvertFrom-Json
        Write-Host "✅ Configuration loaded" -ForegroundColor Green
    }
    catch {
        Write-Warning "⚠️ Failed to load configuration: $_"
    }
}

# Check AWS CLI and credentials
try {
    $identity = aws sts get-caller-identity --region $Region | ConvertFrom-Json
    Write-Host "✅ AWS Identity: $($identity.Arn)" -ForegroundColor Green
}
catch {
    Write-Error "❌ AWS credentials not configured"
}

function Start-Pipeline {
    Write-Host "🚀 Starting pipeline execution..." -ForegroundColor Green
    try {
        $result = aws codepipeline start-pipeline-execution --name $PipelineName --region $Region | ConvertFrom-Json
        $executionId = $result.pipelineExecutionId
        Write-Host "✅ Pipeline execution started: $executionId" -ForegroundColor Green
        
        if ($config) {
            Write-Host "📊 Monitor at: $($config.PipelineUrl)" -ForegroundColor Cyan
        }
        
        return $executionId
    }
    catch {
        Write-Error "❌ Failed to start pipeline: $_"
    }
}

function Stop-Pipeline {
    param([string]$ExecId)
    
    if (-not $ExecId) {
        # Get the latest execution
        $executions = aws codepipeline list-pipeline-executions --pipeline-name $PipelineName --region $Region | ConvertFrom-Json
        $ExecId = $executions.pipelineExecutionSummaries[0].pipelineExecutionId
    }
    
    Write-Host "🛑 Stopping pipeline execution: $ExecId" -ForegroundColor Red
    try {
        aws codepipeline stop-pipeline-execution --pipeline-name $PipelineName --pipeline-execution-id $ExecId --abandon --region $Region | Out-Null
        Write-Host "✅ Pipeline execution stopped" -ForegroundColor Green
    }
    catch {
        Write-Error "❌ Failed to stop pipeline: $_"
    }
}

function Get-PipelineStatus {
    Write-Host "📊 Getting pipeline status..." -ForegroundColor Blue
    try {
        # Get pipeline state
        $state = aws codepipeline get-pipeline-state --name $PipelineName --region $Region | ConvertFrom-Json
        
        Write-Host "`n🎯 Pipeline: $($state.pipelineName)" -ForegroundColor Yellow
        Write-Host "Version: $($state.pipelineVersion)" -ForegroundColor Gray
        Write-Host "Created: $($state.created)" -ForegroundColor Gray
        Write-Host "Updated: $($state.updated)" -ForegroundColor Gray
        
        Write-Host "`n📋 Stages:" -ForegroundColor Yellow
        foreach ($stage in $state.stageStates) {
            $statusColor = switch ($stage.latestExecution.status) {
                "Succeeded" { "Green" }
                "Failed" { "Red" }
                "InProgress" { "Yellow" }
                default { "Gray" }
            }
            
            Write-Host "  [$($stage.stageName)]" -ForegroundColor White -NoNewline
            Write-Host " $($stage.latestExecution.status)" -ForegroundColor $statusColor
            
            if ($stage.actionStates) {
                foreach ($action in $stage.actionStates) {
                    $actionColor = switch ($action.latestExecution.status) {
                        "Succeeded" { "Green" }
                        "Failed" { "Red" }
                        "InProgress" { "Yellow" }
                        default { "Gray" }
                    }
                    Write-Host "    - $($action.actionName): $($action.latestExecution.status)" -ForegroundColor $actionColor
                }
            }
        }
        
        # Get recent executions
        $executions = aws codepipeline list-pipeline-executions --pipeline-name $PipelineName --max-items 5 --region $Region | ConvertFrom-Json
        
        Write-Host "`n📚 Recent Executions:" -ForegroundColor Yellow
        foreach ($execution in $executions.pipelineExecutionSummaries) {
            $statusColor = switch ($execution.status) {
                "Succeeded" { "Green" }
                "Failed" { "Red" }
                "InProgress" { "Yellow" }
                default { "Gray" }
            }
            
            $startTime = [DateTime]::Parse($execution.startTime).ToString("yyyy-MM-dd HH:mm:ss")
            Write-Host "  $($execution.pipelineExecutionId.Substring(0,8))... - $($execution.status) - $startTime" -ForegroundColor $statusColor
        }
    }
    catch {
        Write-Error "❌ Failed to get pipeline status: $_"
    }
}

function Get-PipelineLogs {
    param([string]$ExecId)
    
    Write-Host "📜 Getting pipeline logs..." -ForegroundColor Blue
    
    if (-not $ExecId) {
        # Get the latest execution
        $executions = aws codepipeline list-pipeline-executions --pipeline-name $PipelineName --region $Region | ConvertFrom-Json
        $ExecId = $executions.pipelineExecutionSummaries[0].pipelineExecutionId
    }
    
    Write-Host "Execution ID: $ExecId" -ForegroundColor Gray
    
    try {
        # Get execution details
        $execution = aws codepipeline get-pipeline-execution --pipeline-name $PipelineName --pipeline-execution-id $ExecId --region $Region | ConvertFrom-Json
        
        Write-Host "`nExecution Status: $($execution.pipelineExecution.status)" -ForegroundColor Yellow
        
        # List CodeBuild project logs
        $buildProjects = @(
            "$ProjectName-test-$Environment",
            "$ProjectName-phase1-build-$Environment", 
            "$ProjectName-phase2-build-$Environment",
            "$ProjectName-deploy-$Environment"
        )
        
        Write-Host "`n📋 Available Log Groups:" -ForegroundColor Yellow
        foreach ($project in $buildProjects) {
            $logGroup = "/aws/codebuild/$project"
            Write-Host "  $logGroup" -ForegroundColor White
            
            # Show recent log streams
            try {
                $streams = aws logs describe-log-streams --log-group-name $logGroup --order-by LastEventTime --descending --max-items 3 --region $Region | ConvertFrom-Json
                foreach ($stream in $streams.logStreams) {
                    $lastEvent = [DateTime]::FromFileTimeUtc($stream.lastEventTime * 10000 + 621355968000000000).ToString("yyyy-MM-dd HH:mm:ss")
                    Write-Host "    - $($stream.logStreamName) (Last: $lastEvent)" -ForegroundColor Gray
                }
            }
            catch {
                Write-Host "    - No recent logs" -ForegroundColor DarkGray
            }
        }
        
        Write-Host "`n💡 To view specific logs, use:" -ForegroundColor Cyan
        Write-Host "aws logs tail /aws/codebuild/$ProjectName-test-$Environment --follow" -ForegroundColor White
    }
    catch {
        Write-Error "❌ Failed to get pipeline logs: $_"
    }
}

function Get-PipelineHistory {
    Write-Host "📚 Getting pipeline execution history..." -ForegroundColor Blue
    try {
        $executions = aws codepipeline list-pipeline-executions --pipeline-name $PipelineName --max-items 10 --region $Region | ConvertFrom-Json
        
        Write-Host "`n📊 Execution History (Last 10):" -ForegroundColor Yellow
        Write-Host "ExecutionId".PadRight(12) + "Status".PadRight(12) + "Started".PadRight(20) + "Duration" -ForegroundColor Gray
        Write-Host ("-" * 60) -ForegroundColor Gray
        
        foreach ($execution in $executions.pipelineExecutionSummaries) {
            $statusColor = switch ($execution.status) {
                "Succeeded" { "Green" }
                "Failed" { "Red" }
                "InProgress" { "Yellow" }
                default { "Gray" }
            }
            
            $shortId = $execution.pipelineExecutionId.Substring(0,8) + "..."
            $startTime = [DateTime]::Parse($execution.startTime).ToString("yyyy-MM-dd HH:mm")
            
            $duration = ""
            if ($execution.startTime -and $execution.endTime) {
                $start = [DateTime]::Parse($execution.startTime)
                $end = [DateTime]::Parse($execution.endTime)
                $span = $end - $start
                $duration = "{0:mm}m {1:ss}s" -f $span, $span
            }
            
            Write-Host $shortId.PadRight(12) -NoNewline
            Write-Host $execution.status.PadRight(12) -ForegroundColor $statusColor -NoNewline
            Write-Host $startTime.PadRight(20) -NoNewline
            Write-Host $duration
        }
    }
    catch {
        Write-Error "❌ Failed to get pipeline history: $_"
    }
}

function Get-PipelineArtifacts {
    Write-Host "📦 Getting pipeline artifacts information..." -ForegroundColor Blue
    
    if (-not $config) {
        Write-Warning "⚠️ Configuration not available. Limited information."
    }
    else {
        Write-Host "`n🪣 Artifacts Bucket: $($config.ArtifactsBucket)" -ForegroundColor Yellow
        
        try {
            $objects = aws s3 ls "s3://$($config.ArtifactsBucket)/" --recursive --human-readable --summarize | Select-Object -Last 20
            Write-Host "`nRecent artifacts:" -ForegroundColor Gray
            $objects | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
        }
        catch {
            Write-Warning "⚠️ Could not list artifacts: $_"
        }
    }
}

# Execute the requested action
switch ($Action) {
    "start" {
        $execId = Start-Pipeline
        if ($execId) {
            Write-Host "`n💡 Monitor the execution with:" -ForegroundColor Cyan
            Write-Host ".\manage-pipeline.ps1 -Action status -Environment $Environment" -ForegroundColor White
        }
    }
    "stop" {
        Stop-Pipeline -ExecId $ExecutionId
    }
    "retry" {
        if ($ExecutionId) {
            Stop-Pipeline -ExecId $ExecutionId
            Start-Sleep -Seconds 5
        }
        Start-Pipeline
    }
    "status" {
        Get-PipelineStatus
    }
    "logs" {
        Get-PipelineLogs -ExecId $ExecutionId
    }
    "history" {
        Get-PipelineHistory
    }
    "artifacts" {
        Get-PipelineArtifacts
    }
}

Write-Host "`n⏰ Action completed at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
[CmdletBinding()]
param(
    [string]$AwsRegion = "us-east-1",
    [string]$StackName = "pmo-ip-minutes-dev",
    [string]$PortalUrl = "",
    [string]$UserPoolId = "",
    [string]$UserPoolClientId = "",
    [switch]$Deploy
)

$ErrorActionPreference = "Stop"
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$templatePath = Join-Path $repositoryRoot "cloudformation\minutes-dev.yaml"

aws cloudformation validate-template `
    --template-body "file://$templatePath" `
    --region $AwsRegion `
    --no-cli-pager | Out-Null

if ($LASTEXITCODE -ne 0) {
    throw "La plantilla CloudFormation no es valida."
}

Write-Host "Plantilla validada."

if (-not $Deploy) {
    Write-Host "Preflight completado. Use -Deploy para desplegar."
    exit 0
}

# Resolve portal URL from existing stack if not provided
if (-not $PortalUrl) {
    $PortalUrl = (
        aws cloudformation describe-stacks `
            --stack-name "pmo-executive-portal-dev" `
            --region $AwsRegion `
            --query "Stacks[0].Outputs[?OutputKey=='PortalUrl'].OutputValue | [0]" `
            --output text `
            --no-cli-pager |
        Out-String
    ).Trim()
    if ($LASTEXITCODE -ne 0 -or -not $PortalUrl -or $PortalUrl -eq "None") {
        throw "No fue posible resolver PortalUrl."
    }
}

# Resolve Cognito from auth stack if not provided
if (-not $UserPoolId) {
    $UserPoolId = (
        aws cloudformation describe-stacks `
            --stack-name "pmo-executive-portal-auth" `
            --region $AwsRegion `
            --query "Stacks[0].Outputs[?OutputKey=='UserPoolId'].OutputValue | [0]" `
            --output text `
            --no-cli-pager |
        Out-String
    ).Trim()
    if ($LASTEXITCODE -ne 0 -or -not $UserPoolId -or $UserPoolId -eq "None") {
        throw "No fue posible resolver UserPoolId."
    }
}

if (-not $UserPoolClientId) {
    $UserPoolClientId = (
        aws cloudformation describe-stacks `
            --stack-name "pmo-executive-portal-auth" `
            --region $AwsRegion `
            --query "Stacks[0].Outputs[?OutputKey=='UserPoolClientId'].OutputValue | [0]" `
            --output text `
            --no-cli-pager |
        Out-String
    ).Trim()
    if ($LASTEXITCODE -ne 0 -or -not $UserPoolClientId -or $UserPoolClientId -eq "None") {
        throw "No fue posible resolver UserPoolClientId."
    }
}

Write-Host "PortalUrl: $PortalUrl"
Write-Host "UserPoolId: $UserPoolId"
Write-Host "UserPoolClientId: $UserPoolClientId"

aws cloudformation deploy `
    --template-file $templatePath `
    --stack-name $StackName `
    --capabilities CAPABILITY_NAMED_IAM `
    --no-fail-on-empty-changeset `
    --parameter-overrides `
        "PortalUrl=$PortalUrl" `
        "UserPoolId=$UserPoolId" `
        "UserPoolClientId=$UserPoolClientId" `
    --tags `
        "Application=PMO-Intelligence-Platform" `
        "Environment=dev" `
        "Component=minutes-generator" `
        "aws-apn-id=pc:9lf3vm94ks7nr0gbpdatez0l8" `
    --region $AwsRegion `
    --no-cli-pager

if ($LASTEXITCODE -ne 0) {
    throw "Fallo el despliegue del stack $StackName."
}

$minutesApiUrl = (
    aws cloudformation describe-stacks `
        --stack-name $StackName `
        --region $AwsRegion `
        --query "Stacks[0].Outputs[?OutputKey=='MinutesApiUrl'].OutputValue | [0]" `
        --output text `
        --no-cli-pager |
    Out-String
).Trim()

Write-Host ""
Write-Host "Stack: $StackName"
Write-Host "Minutes API URL: $minutesApiUrl"
Write-Host "Funcion Lambda: pmo-ip-dev-minutes-generator"
Write-Host ""
Write-Host "Para desplegar el portal con la nueva URL:"
Write-Host "  .\scripts\deploy-secure-portal.ps1 -Environment dev -MinutesApiUrl $minutesApiUrl -Deploy"

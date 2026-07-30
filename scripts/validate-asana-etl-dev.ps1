[CmdletBinding()]
param(
    [string]$AwsProfile = "pmo-asana",
    [string]$Region = "us-east-1",
    [string]$StackName = "pmo-ip-asana-etl-dev"
)

$ErrorActionPreference = "Stop"

function Invoke-Aws {
    param([Parameter(ValueFromRemainingArguments)] [string[]]$Arguments)

    $profileArguments = @()
    if ($AwsProfile) {
        $profileArguments = @("--profile", $AwsProfile)
    }

    & aws @Arguments @profileArguments
    if ($LASTEXITCODE -ne 0) {
        throw "AWS CLI terminó con código $LASTEXITCODE."
    }
}

function Get-StackOutput {
    param([Parameter(Mandatory)] [string]$OutputKey)

    $value = Invoke-Aws cloudformation describe-stacks `
        --region $Region `
        --stack-name $StackName `
        --query "Stacks[0].Outputs[?OutputKey=='$OutputKey'].OutputValue | [0]" `
        --output text

    return ($value | Out-String).Trim()
}

$bucketName = Get-StackOutput -OutputKey "DataBucketName"
$requiredObjects = @(
    "projects/projects.csv",
    "tasks/tasks.csv",
    "project_metrics/project_metrics.csv"
)

foreach ($objectKey in $requiredObjects) {
    $size = Invoke-Aws s3api head-object `
        --region $Region `
        --bucket $bucketName `
        --key $objectKey `
        --query "ContentLength" `
        --output text

    if ([int64]$size -le 0) {
        throw "El objeto s3://$bucketName/$objectKey está vacío."
    }

    Write-Output "OK: s3://$bucketName/$objectKey ($size bytes)"
}

$logGroupName = Get-StackOutput -OutputKey "LogGroupName"
$errorCount = Invoke-Aws logs filter-log-events `
    --region $Region `
    --log-group-name $logGroupName `
    --filter-pattern "ERROR" `
    --no-paginate `
    --query "length(events)" `
    --output text

if ([int]$errorCount -gt 0) {
    throw "CloudWatch contiene $errorCount eventos ERROR para el piloto DEV."
}

Write-Output "Validación DEV completada sin errores registrados."

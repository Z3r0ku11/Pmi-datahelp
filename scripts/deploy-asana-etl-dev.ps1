[CmdletBinding()]
param(
    [string]$AwsProfile = "pmo-asana",
    [string]$Region = "us-east-1",
    [string]$StackName = "pmo-ip-asana-etl-dev",
    [string]$DataBucketName = "",
    [string]$ImageTag = "",
    [switch]$InfrastructureOnly,
    [switch]$RunTask
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

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$templatePath = Join-Path $repositoryRoot "cloudformation\asana-etl-dev.yaml"

if (-not $DataBucketName) {
    $accountId = Invoke-Aws sts get-caller-identity `
        --query Account `
        --output text
    $DataBucketName = "pmo-intelligence-platform-dev-$($accountId.Trim())-$Region"
}

if ($DataBucketName -eq "pmo-asana-analytics-us-east-1-664858858204") {
    throw "El bucket de DEV no puede ser el bucket contractual de producción."
}

if (-not $ImageTag) {
    $ImageTag = (& git -C $repositoryRoot rev-parse --short=12 HEAD).Trim()
}

Invoke-Aws cloudformation validate-template `
    --region $Region `
    --template-body "file://$templatePath" | Out-Null

Invoke-Aws cloudformation deploy `
    --region $Region `
    --stack-name $StackName `
    --template-file $templatePath `
    --capabilities CAPABILITY_NAMED_IAM `
    --no-fail-on-empty-changeset `
    --parameter-overrides `
    "DataBucketName=$DataBucketName" `
    "ContainerImageTag=$ImageTag"

if ($InfrastructureOnly) {
    Write-Output "Infraestructura DEV lista."
    Write-Output "Bucket DEV: $DataBucketName"
    Write-Output "El calendario permanece deshabilitado."
    exit 0
}

$repositoryUri = Get-StackOutput -OutputKey "RepositoryUri"
$registry = ($repositoryUri -split "/")[0]

$password = Invoke-Aws ecr get-login-password --region $Region
$password | docker login --username AWS --password-stdin $registry | Out-Null
if ($LASTEXITCODE -ne 0) {
    throw "No fue posible autenticar Docker contra ECR."
}

docker build --tag "$repositoryUri`:$ImageTag" $repositoryRoot
if ($LASTEXITCODE -ne 0) {
    throw "Falló la construcción de la imagen."
}

docker push "$repositoryUri`:$ImageTag"
if ($LASTEXITCODE -ne 0) {
    throw "Falló la publicación de la imagen."
}

if (-not $RunTask) {
    Write-Output "Infraestructura e imagen DEV listas."
    Write-Output "Bucket DEV: $DataBucketName"
    Write-Output "Imagen: $repositoryUri`:$ImageTag"
    Write-Output "El calendario permanece deshabilitado."
    exit 0
}

$clusterName = Get-StackOutput -OutputKey "ClusterName"
$taskDefinitionArn = Get-StackOutput -OutputKey "TaskDefinitionArn"
$securityGroupId = Get-StackOutput -OutputKey "SecurityGroupId"
$stackSubnetIds = Get-StackOutput -OutputKey "SubnetIds"
$networkConfiguration = (
    "awsvpcConfiguration={subnets=[$stackSubnetIds]," +
    "securityGroups=[$securityGroupId],assignPublicIp=ENABLED}"
)

$taskArn = (
    Invoke-Aws ecs run-task `
        --region $Region `
        --cluster $clusterName `
        --task-definition $taskDefinitionArn `
        --launch-type FARGATE `
        --network-configuration $networkConfiguration `
        --query "tasks[0].taskArn" `
        --output text |
        Out-String
).Trim()

if (-not $taskArn -or $taskArn -eq "None") {
    throw "ECS no devolvió un ARN para la tarea DEV."
}

Write-Output "Tarea DEV iniciada: $taskArn"
Invoke-Aws ecs wait tasks-stopped `
    --region $Region `
    --cluster $clusterName `
    --tasks $taskArn

$exitCode = (
    Invoke-Aws ecs describe-tasks `
        --region $Region `
        --cluster $clusterName `
        --tasks $taskArn `
        --query "tasks[0].containers[0].exitCode" `
        --output text |
        Out-String
).Trim()

if ($exitCode -ne "0") {
    throw "La tarea DEV terminó con código $exitCode. Revise CloudWatch Logs."
}

Write-Output "Tarea DEV completada correctamente."
Write-Output "Bucket DEV: $DataBucketName"

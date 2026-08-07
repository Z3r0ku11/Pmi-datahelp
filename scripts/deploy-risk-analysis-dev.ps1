[CmdletBinding()]
param(
    [string]$AwsProfile = "",
    [string]$Region = "us-east-1",
    [string]$StackName = "pmo-ip-risk-analysis-dev",
    [string]$BedrockModelId = "amazon.nova-lite-v1:0"
)

$ErrorActionPreference = "Stop"
$env:AWS_CLI_FILE_ENCODING = "UTF-8"

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

function Get-Output {
    param(
        [Parameter(Mandatory)] [string]$SourceStack,
        [Parameter(Mandatory)] [string]$OutputKey
    )

    return (
        Invoke-Aws cloudformation describe-stacks `
            --region $Region `
            --stack-name $SourceStack `
            --query "Stacks[0].Outputs[?OutputKey=='$OutputKey'].OutputValue | [0]" `
            --output text |
        Out-String
    ).Trim()
}

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$templatePath = Join-Path $repositoryRoot "cloudformation\risk-analysis-dev.yaml"
$pdfRequirementsPath = Join-Path $repositoryRoot "requirements-risk-analysis.txt"
$pdfRequirementsHash = (
    Get-FileHash -Algorithm SHA256 -LiteralPath $pdfRequirementsPath
).Hash.ToLowerInvariant()
$pdfLayerName = "pmo-ip-dev-pdf-parser"
$pdfLayerDescription = "pmo-ip-pdf-parser-$pdfRequirementsHash"
$accountId = (
    Invoke-Aws sts get-caller-identity --query Account --output text |
    Out-String
).Trim()
$portalUrl = Get-Output `
    -SourceStack "pmo-executive-portal-dev" `
    -OutputKey "PortalUrl"
$userPoolId = Get-Output `
    -SourceStack "pmo-executive-portal-auth" `
    -OutputKey "UserPoolId"
$userPoolClientId = Get-Output `
    -SourceStack "pmo-executive-portal-auth" `
    -OutputKey "UserPoolClientId"
$bucketName = "pmo-ip-risk-analysis-dev-$accountId-$Region"

$pdfLayerArn = (
    Invoke-Aws lambda list-layers `
        --region $Region `
        --compatible-runtime python3.12 `
        --query "Layers[?LayerName=='$pdfLayerName' && LatestMatchingVersion.Description=='$pdfLayerDescription'].LatestMatchingVersion.LayerVersionArn | [0]" `
        --output text |
    Out-String
).Trim()

if (-not $pdfLayerArn -or $pdfLayerArn -eq "None") {
    $layerBuildRoot = Join-Path (
        [System.IO.Path]::GetTempPath()
    ) "pmo-ip-pdf-layer-$([guid]::NewGuid().ToString('N'))"
    $layerPythonPath = Join-Path $layerBuildRoot "python"
    $layerZipPath = Join-Path $layerBuildRoot "pmo-ip-pdf-parser.zip"
    try {
        New-Item -ItemType Directory -Path $layerPythonPath -Force | Out-Null
        & python -m pip install `
            --requirement $pdfRequirementsPath `
            --target $layerPythonPath `
            --disable-pip-version-check `
            --quiet
        if ($LASTEXITCODE -ne 0) {
            throw "No fue posible construir la dependencia PDF para Lambda."
        }
        Compress-Archive -Path $layerPythonPath -DestinationPath $layerZipPath
        $pdfLayerArn = (
            Invoke-Aws lambda publish-layer-version `
                --region $Region `
                --layer-name $pdfLayerName `
                --description $pdfLayerDescription `
                --compatible-runtimes python3.12 `
                --license-info BSD-3-Clause `
                --zip-file "fileb://$layerZipPath" `
                --query LayerVersionArn `
                --output text |
            Out-String
        ).Trim()
    }
    finally {
        if (Test-Path -LiteralPath $layerBuildRoot) {
            [System.IO.Directory]::Delete($layerBuildRoot, $true)
        }
    }
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
        "PortalUrl=$portalUrl" `
        "UserPoolId=$userPoolId" `
        "UserPoolClientId=$userPoolClientId" `
        "RiskBucketName=$bucketName" `
        "BedrockModelId=$BedrockModelId" `
        "PdfParserLayerArn=$pdfLayerArn"

$apiUrl = Get-Output -SourceStack $StackName -OutputKey "RiskApiUrl"
Write-Output "Backend de riesgos DEV listo."
Write-Output "API: $apiUrl"
Write-Output "Bucket: $bucketName"
Write-Output "Modelo Bedrock: $BedrockModelId"
Write-Output "Parser PDF: $pdfLayerArn"

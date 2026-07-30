[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [ValidatePattern("^\d{12}$")]
    [string]$AwsAccountId,

    [Parameter(Mandatory)]
    [ValidatePattern("^arn:aws[a-z-]*:quicksight:")]
    [string]$ProjectsDataSourceArn,

    [Parameter(Mandatory)]
    [ValidatePattern("^arn:aws[a-z-]*:quicksight:")]
    [string]$MetricsDataSourceArn,

    [string]$AwsProfile = "",
    [string]$AwsRegion = "us-east-1",
    [Parameter(Mandatory)]
    [string]$PrincipalArn,
    [switch]$Deploy
)

$ErrorActionPreference = "Stop"
$modelPath = Join-Path $PSScriptRoot "semantic-model.json"
$validatorPath = Join-Path (
    $PSScriptRoot
) "validate-semantic-model.ps1"

& $validatorPath -ModelPath $modelPath

$model = Get-Content -LiteralPath $modelPath -Raw |
    ConvertFrom-Json -Depth 20

$commonAwsArguments = @("--region", $AwsRegion, "--no-cli-pager")

if (-not [string]::IsNullOrWhiteSpace($AwsProfile)) {
    $commonAwsArguments += @("--profile", $AwsProfile)
}

$identity = & aws sts get-caller-identity @commonAwsArguments |
    ConvertFrom-Json

if ($identity.Account -ne $AwsAccountId) {
    throw (
        "La cuenta autenticada ($($identity.Account)) no coincide con " +
        "AwsAccountId ($AwsAccountId)."
    )
}

$existingDataSet = $null

try {
    $existingDataSet = & aws quicksight describe-data-set `
        --aws-account-id $AwsAccountId `
        --data-set-id $model.datasetId `
        @commonAwsArguments 2>$null |
        ConvertFrom-Json
} catch {
    $existingDataSet = $null
}

if ($null -ne $existingDataSet) {
    throw (
        "El dataset '$($model.datasetId)' ya existe. " +
        "El despliegue create-only no lo modificará."
    )
}

foreach ($dataSourceArn in @(
    $ProjectsDataSourceArn,
    $MetricsDataSourceArn
)) {
    $dataSourceId = $dataSourceArn.Split("/")[-1]
    $dataSource = & aws quicksight describe-data-source `
        --aws-account-id $AwsAccountId `
        --data-source-id $dataSourceId `
        @commonAwsArguments |
        ConvertFrom-Json

    if ($dataSource.DataSource.Status -ne "CREATION_SUCCESSFUL") {
        throw (
            "Data source no disponible: $dataSourceArn " +
            "($($dataSource.DataSource.Status))."
        )
    }
}

Write-Host (
    "Preflight correcto. Se crearía el dataset '{0}' en {1}." -f
    $model.datasetId,
    $AwsRegion
)
Write-Host "No se realizarán escrituras en S3."

if (-not $Deploy) {
    Write-Host (
        "Modo de validación: no se hicieron cambios en AWS. " +
        "Use -Deploy para crear el dataset."
    )
    exit 0
}

$builderPath = Join-Path (
    $PSScriptRoot
) "build-dataset-definition.ps1"

$definition = & $builderPath `
    -AwsAccountId $AwsAccountId `
    -ProjectsDataSourceArn $ProjectsDataSourceArn `
    -MetricsDataSourceArn $MetricsDataSourceArn `
    -PrincipalArn $PrincipalArn

$definitionJson = $definition |
    ConvertTo-Json -Depth 30 -Compress

$rawResult = & aws quicksight create-data-set `
    --cli-input-json $definitionJson `
    @commonAwsArguments 2>&1

if ($LASTEXITCODE -ne 0) {
    throw (
        "AWS CLI rechazó la creación del dataset: " +
        ($rawResult -join [Environment]::NewLine)
    )
}

$result = $rawResult | ConvertFrom-Json

if ($result.CreationStatus -notin @(
    "CREATION_IN_PROGRESS",
    "CREATION_SUCCESSFUL"
)) {
    throw (
        "QuickSight no aceptó la creación del dataset: " +
        "$($result.CreationStatus)."
    )
}

Write-Host (
    "Creación iniciada: {0} ({1})." -f
    $result.DataSetId,
    $result.CreationStatus
)

[CmdletBinding()]
param(
    [ValidateSet("dev", "prod", "all")]
    [string]$Environment = "all",
    [string]$AwsRegion = "us-east-1",
    [string]$AwsAccountId = "664858858204",
    [string]$DashboardId = "pmo-executive-dashboard-v2",
    [string]$PortalUserEmail = "dbarrios@morrisopazo.com",
    [string]$QuickSightUserArn = (
        "arn:aws:quicksight:us-east-1:664858858204:user/default/" +
        "AWSReservedSSO_AWSAdministratorAccess_cd675fd79d1b75e0/dbarrios"
    ),
    [switch]$Deploy
)

$ErrorActionPreference = "Stop"
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$portalTemplate = Join-Path $repositoryRoot "cloudformation\portal.yaml"
$authTemplate = Join-Path $repositoryRoot "cloudformation\portal-auth.yaml"
$portalSource = Join-Path $repositoryRoot "portal"
$allEnvironments = @("dev", "prod")
$publishEnvironments = if ($Environment -eq "all") {
    $allEnvironments
} else {
    @($Environment)
}

foreach ($template in @($portalTemplate, $authTemplate)) {
    aws cloudformation validate-template `
        --template-body "file://$template" `
        --region $AwsRegion `
        --no-cli-pager | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "La plantilla CloudFormation no es válida: $template"
    }
}

Write-Host "Plantillas CloudFormation validadas."

if (-not $Deploy) {
    Write-Host (
        "Preflight seguro completado. Use -Deploy para publicar {0}." -f
        ($publishEnvironments -join ", ")
    )
    exit 0
}

$portalOutputs = @{}
foreach ($targetEnvironment in $allEnvironments) {
    $stackName = "pmo-executive-portal-$targetEnvironment"
    aws cloudformation deploy `
        --template-file $portalTemplate `
        --stack-name $stackName `
        --parameter-overrides `
            "Environment=$targetEnvironment" `
            "DashboardId=$DashboardId" `
        --tags `
            "Application=PMO-Executive-Portal" `
            "Environment=$targetEnvironment" `
        --region $AwsRegion `
        --no-fail-on-empty-changeset `
        --no-cli-pager
    if ($LASTEXITCODE -ne 0) {
        throw "Falló el despliegue de infraestructura: $stackName"
    }

    $outputs = aws cloudformation describe-stacks `
        --stack-name $stackName `
        --region $AwsRegion `
        --query "Stacks[0].Outputs" `
        --output json `
        --no-cli-pager | ConvertFrom-Json
    if ($LASTEXITCODE -ne 0) {
        throw "No fue posible consultar las salidas de $stackName"
    }

    $outputMap = @{}
    foreach ($output in $outputs) {
        $outputMap[$output.OutputKey] = $output.OutputValue
    }
    $portalOutputs[$targetEnvironment] = $outputMap
}

$authStackName = "pmo-executive-portal-auth"
aws cloudformation deploy `
    --template-file $authTemplate `
    --stack-name $authStackName `
    --parameter-overrides `
        "DashboardId=$DashboardId" `
        "QuickSightUserArn=$QuickSightUserArn" `
        "PortalUserEmail=$PortalUserEmail" `
        "DevPortalUrl=$($portalOutputs.dev.PortalUrl)" `
        "ProdPortalUrl=$($portalOutputs.prod.PortalUrl)" `
    --capabilities CAPABILITY_NAMED_IAM `
    --tags `
        "Application=PMO-Executive-Portal" `
        "Environment=shared" `
    --region $AwsRegion `
    --no-fail-on-empty-changeset `
    --no-cli-pager
if ($LASTEXITCODE -ne 0) {
    throw "Falló el despliegue de autenticación: $authStackName"
}

$authOutputsRaw = aws cloudformation describe-stacks `
    --stack-name $authStackName `
    --region $AwsRegion `
    --query "Stacks[0].Outputs" `
    --output json `
    --no-cli-pager | ConvertFrom-Json
if ($LASTEXITCODE -ne 0) {
    throw "No fue posible consultar las salidas de $authStackName"
}

$authOutputs = @{}
foreach ($output in $authOutputsRaw) {
    $authOutputs[$output.OutputKey] = $output.OutputValue
}

foreach ($targetEnvironment in $publishEnvironments) {
    $outputMap = $portalOutputs[$targetEnvironment]
    $buildDirectory = Join-Path (
        Join-Path $repositoryRoot "output"
    ) (
        "portal-secure-{0}-{1}" -f
        $targetEnvironment,
        (Get-Date -Format "yyyyMMddHHmmss")
    )
    New-Item -ItemType Directory -Path $buildDirectory | Out-Null

    Copy-Item `
        -LiteralPath (Join-Path $portalSource "index.html") `
        -Destination $buildDirectory
    Copy-Item `
        -LiteralPath (Join-Path $portalSource "styles.css") `
        -Destination (Join-Path $buildDirectory "styles-v4.css")
    Copy-Item `
        -LiteralPath (Join-Path $portalSource "app.js") `
        -Destination (Join-Path $buildDirectory "app-v4.js")

    $config = Get-Content -Raw (
        Join-Path $portalSource "config.template.js"
    )
    $config = $config.Replace(
        "__ENVIRONMENT__",
        $targetEnvironment.ToUpperInvariant()
    )
    $config = $config.Replace("__DASHBOARD_ID__", $DashboardId)
    $config = $config.Replace("__PORTAL_URL__", $outputMap.PortalUrl)
    $config = $config.Replace(
        "__COGNITO_DOMAIN__",
        $authOutputs.CognitoDomain
    )
    $config = $config.Replace(
        "__USER_POOL_CLIENT_ID__",
        $authOutputs.UserPoolClientId
    )
    $config = $config.Replace(
        "__EMBED_API_URL__",
        $authOutputs.EmbedApiUrl
    )
    Set-Content `
        -LiteralPath (Join-Path $buildDirectory "config.js") `
        -Value $config `
        -Encoding utf8NoBOM

    $bucketUri = "s3://$($outputMap.PortalBucketName)"
    $assets = @(
        @{
            Source = "index.html"
            Target = "index.html"
            Type = "text/html; charset=utf-8"
        },
        @{
            Source = "config.js"
            Target = "config.js"
            Type = "application/javascript; charset=utf-8"
        },
        @{
            Source = "app-v4.js"
            Target = "app-v4.js"
            Type = "application/javascript; charset=utf-8"
        },
        @{
            Source = "styles-v4.css"
            Target = "styles-v4.css"
            Type = "text/css; charset=utf-8"
        }
    )

    foreach ($asset in $assets) {
        aws s3 cp `
            (Join-Path $buildDirectory $asset.Source) `
            "$bucketUri/$($asset.Target)" `
            --content-type $asset.Type `
            --cache-control "no-cache, no-store, must-revalidate" `
            --sse AES256 `
            --region $AwsRegion `
            --only-show-errors
        if ($LASTEXITCODE -ne 0) {
            throw (
                "Falló la publicación de $($asset.Source) para " +
                $targetEnvironment
            )
        }
    }

    aws cloudfront create-invalidation `
        --distribution-id $outputMap.DistributionId `
        --paths "/*" `
        --no-cli-pager | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "No fue posible invalidar CloudFront para $targetEnvironment"
    }

    Write-Host ""
    Write-Host "Ambiente: $($targetEnvironment.ToUpperInvariant())"
    Write-Host "Portal: $($outputMap.PortalUrl)"
    Write-Host "Autenticación: Cognito"
    Write-Host "Usuario del portal: $PortalUserEmail"
}

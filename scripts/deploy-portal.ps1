[CmdletBinding()]
param(
    [ValidateSet("dev", "prod", "all")]
    [string]$Environment = "all",
    [string]$AwsRegion = "us-east-1",
    [string]$AwsAccountId = "664858858204",
    [string]$DashboardId = "pmo-executive-dashboard-v2",
    [string]$DashboardEmbedUrl = "",
    [switch]$Deploy
)

$ErrorActionPreference = "Stop"
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$templatePath = Join-Path $repositoryRoot "cloudformation\portal.yaml"
$portalSource = Join-Path $repositoryRoot "portal"
$environments = if ($Environment -eq "all") {
    @("dev", "prod")
} else {
    @($Environment)
}

if ([string]::IsNullOrWhiteSpace($DashboardEmbedUrl)) {
    $DashboardEmbedUrl = (
        "https://$AwsRegion.quicksight.aws.amazon.com/sn/embed/" +
        "share/accounts/$AwsAccountId/dashboards/$DashboardId"
    )
}

aws cloudformation validate-template `
    --template-body "file://$templatePath" `
    --region $AwsRegion `
    --no-cli-pager | Out-Null

if ($LASTEXITCODE -ne 0) {
    throw "La plantilla CloudFormation del portal no es válida."
}

Write-Host "Plantilla CloudFormation validada."

if (-not $Deploy) {
    Write-Host (
        "Preflight completado para: {0}. Use -Deploy para publicar." -f
        ($environments -join ", ")
    )
    exit 0
}

foreach ($targetEnvironment in $environments) {
    $stackName = "pmo-executive-portal-$targetEnvironment"

    aws cloudformation deploy `
        --template-file $templatePath `
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

    $buildDirectory = Join-Path (
        Join-Path $repositoryRoot "output"
    ) (
        "portal-{0}-{1}" -f
        $targetEnvironment,
        (Get-Date -Format "yyyyMMddHHmmss")
    )
    New-Item -ItemType Directory -Path $buildDirectory |
        Out-Null

    Copy-Item `
        -LiteralPath (Join-Path $portalSource "index.html") `
        -Destination $buildDirectory
    Copy-Item `
        -LiteralPath (Join-Path $portalSource "styles.css") `
        -Destination (
            Join-Path $buildDirectory "styles-v2.css"
        )
    Copy-Item `
        -LiteralPath (Join-Path $portalSource "app.js") `
        -Destination (
            Join-Path $buildDirectory "app-v2.js"
        )

    $config = Get-Content -Raw (
        Join-Path $portalSource "config.template.js"
    )
    $config = $config.Replace(
        "__ENVIRONMENT__",
        $targetEnvironment.ToUpperInvariant()
    )
    $config = $config.Replace(
        "__DASHBOARD_ID__",
        $DashboardId
    )
    $config = $config.Replace(
        "__DASHBOARD_EMBED_URL__",
        $DashboardEmbedUrl
    )
    Set-Content `
        -LiteralPath (Join-Path $buildDirectory "config.js") `
        -Value $config `
        -Encoding utf8NoBOM

    $bucketUri = "s3://$($outputMap.PortalBucketName)"

    aws s3 cp `
        (Join-Path $buildDirectory "index.html") `
        "$bucketUri/index.html" `
        --content-type "text/html; charset=utf-8" `
        --cache-control "no-cache, no-store, must-revalidate" `
        --sse AES256 `
        --region $AwsRegion `
        --only-show-errors
    aws s3 cp `
        (Join-Path $buildDirectory "config.js") `
        "$bucketUri/config.js" `
        --content-type "application/javascript; charset=utf-8" `
        --cache-control "no-cache, no-store, must-revalidate" `
        --sse AES256 `
        --region $AwsRegion `
        --only-show-errors
    aws s3 cp `
        (Join-Path $buildDirectory "app-v2.js") `
        "$bucketUri/app-v2.js" `
        --content-type "application/javascript; charset=utf-8" `
        --cache-control "no-cache, no-store, must-revalidate" `
        --sse AES256 `
        --region $AwsRegion `
        --only-show-errors
    aws s3 cp `
        (Join-Path $buildDirectory "styles-v2.css") `
        "$bucketUri/styles-v2.css" `
        --content-type "text/css; charset=utf-8" `
        --cache-control "no-cache, no-store, must-revalidate" `
        --sse AES256 `
        --region $AwsRegion `
        --only-show-errors

    if ($LASTEXITCODE -ne 0) {
        throw "Falló la publicación de archivos para $targetEnvironment"
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
    Write-Host "Bucket: $($outputMap.PortalBucketName)"
    Write-Host "Distribución: $($outputMap.DistributionId)"
    Write-Host (
        "Dominio que debe autorizarse en QuickSight: " +
        $outputMap.QuickSightAllowedDomain
    )
}

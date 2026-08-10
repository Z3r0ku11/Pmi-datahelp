[CmdletBinding()]
param(
    [ValidateSet("dev", "prod", "all")]
    [string]$Environment = "all",
    [string]$AwsRegion = "us-east-1",
    [string]$ApplicationVersion = "1.1.0-dev",
    [string]$DevDataBucket = (
        "pmo-intelligence-platform-dev-664858858204-us-east-1"
    ),
    [string]$ProdDataBucket = (
        "pmo-asana-analytics-us-east-1-664858858204"
    ),
    [string]$AwsAccountId = "664858858204",
    [string]$DashboardId = "pmo-executive-dashboard-v2",
    [string]$ProjectManagerDashboardId = "53543d09-075c-427b-aadf-fefa61a9e526",
    [string]$RiskApiUrl = "",
    [string]$FollowupApiUrl = "",
    [string]$MinutesApiUrl = "",
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

if (-not $RiskApiUrl) {
    $RiskApiUrl = (
        aws cloudformation describe-stacks `
            --stack-name "pmo-ip-risk-analysis-dev" `
            --region $AwsRegion `
            --query "Stacks[0].Outputs[?OutputKey=='RiskApiUrl'].OutputValue | [0]" `
            --output text `
            --no-cli-pager |
        Out-String
    ).Trim()
    if ($LASTEXITCODE -ne 0 -or -not $RiskApiUrl -or $RiskApiUrl -eq "None") {
        throw "No fue posible resolver RiskApiUrl desde el stack DEV."
    }
}

if (-not $FollowupApiUrl) {
    $FollowupApiUrl = (
        aws cloudformation describe-stacks `
            --stack-name "pmo-project-followup-dev" `
            --region $AwsRegion `
            --query "Stacks[0].Outputs[?OutputKey=='FollowupApiUrl'].OutputValue | [0]" `
            --output text `
            --no-cli-pager |
        Out-String
    ).Trim()
    if (
        $LASTEXITCODE -ne 0 -or
        -not $FollowupApiUrl -or
        $FollowupApiUrl -eq "None"
    ) {
        throw "No fue posible resolver FollowupApiUrl desde el stack DEV."
    }
}

if (-not $MinutesApiUrl) {
    $MinutesApiUrl = (
        aws cloudformation describe-stacks `
            --stack-name "pmo-ip-minutes-dev" `
            --region $AwsRegion `
            --query "Stacks[0].Outputs[?OutputKey=='MinutesApiUrl'].OutputValue | [0]" `
            --output text `
            --no-cli-pager |
        Out-String
    ).Trim()
    if (
        $LASTEXITCODE -ne 0 -or
        -not $MinutesApiUrl -or
        $MinutesApiUrl -eq "None"
    ) {
        $MinutesApiUrl = ""
    }
}

$portalOutputs = @{}
foreach ($targetEnvironment in $allEnvironments) {
    $stackName = "pmo-executive-portal-$targetEnvironment"
    if ($targetEnvironment -in $publishEnvironments) {
        aws cloudformation deploy `
            --template-file $portalTemplate `
            --stack-name $stackName `
            --parameter-overrides `
                "Environment=$targetEnvironment" `
                "DashboardId=$DashboardId" `
            --tags `
                "Application=PMO-Executive-Portal" `
                "Environment=$targetEnvironment" `
                "aws-apn-id=pc:9lf3vm94ks7nr0gbpdatez0l8" `
            --region $AwsRegion `
            --no-fail-on-empty-changeset `
            --no-cli-pager
        if ($LASTEXITCODE -ne 0) {
            throw "Falló el despliegue de infraestructura: $stackName"
        }
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
        "ProjectManagerDashboardId=$ProjectManagerDashboardId" `
        "QuickSightUserArn=$QuickSightUserArn" `
        "PortalUserEmail=$PortalUserEmail" `
        "DevPortalUrl=$($portalOutputs.dev.PortalUrl)" `
        "ProdPortalUrl=$($portalOutputs.prod.PortalUrl)" `
    --capabilities CAPABILITY_NAMED_IAM `
    --tags `
        "Application=PMO-Executive-Portal" `
        "Environment=shared" `
        "aws-apn-id=pc:9lf3vm94ks7nr0gbpdatez0l8" `
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
    Copy-Item `
        -LiteralPath (Join-Path $portalSource "morris-opazo.png") `
        -Destination (Join-Path $buildDirectory "morris-opazo.png")
    $resourceSource = Join-Path (
        Join-Path $repositoryRoot "knowledge-base\images"
    ) "original-pmo"
    $resourceBuild = Join-Path $buildDirectory "resources"
    New-Item -ItemType Directory -Path $resourceBuild | Out-Null
    Copy-Item `
        -Path (Join-Path $resourceSource "*.png") `
        -Destination $resourceBuild

    $config = Get-Content -Raw (
        Join-Path $portalSource "config.template.js"
    )
    $config = $config.Replace(
        "__ENVIRONMENT__",
        $targetEnvironment.ToUpperInvariant()
    )
    $santiagoTimeZone = [System.TimeZoneInfo]::FindSystemTimeZoneById(
        "Pacific SA Standard Time"
    )
    $upgradeTime = [System.TimeZoneInfo]::ConvertTimeFromUtc(
        [DateTime]::UtcNow,
        $santiagoTimeZone
    )
    $upgradeLabel = $upgradeTime.ToString("dd-MM-yyyy HH:mm") +
        " America/Santiago"
    $dataBucket = if ($targetEnvironment -eq "dev") {
        $DevDataBucket
    } else {
        $ProdDataBucket
    }
    $asanaObject = aws s3api head-object `
        --bucket $dataBucket `
        --key "projects/projects.csv" `
        --region $AwsRegion `
        --output json `
        --no-cli-pager | ConvertFrom-Json
    if ($LASTEXITCODE -ne 0) {
        throw "No fue posible consultar la extracción Asana en $dataBucket"
    }
    $asanaUpgradeUtc = if ($asanaObject.LastModified -is [DateTime]) {
        $asanaObject.LastModified.ToUniversalTime()
    } else {
        [DateTimeOffset]::Parse(
            [string]$asanaObject.LastModified,
            [Globalization.CultureInfo]::InvariantCulture,
            [Globalization.DateTimeStyles]::RoundtripKind
        ).UtcDateTime
    }
    $asanaUpgradeTime = [System.TimeZoneInfo]::ConvertTimeFromUtc(
        $asanaUpgradeUtc,
        $santiagoTimeZone
    )
    $asanaUpgradeLabel = $asanaUpgradeTime.ToString("dd-MM-yyyy HH:mm") +
        " America/Santiago"
    $config = $config.Replace("__APP_VERSION__", $ApplicationVersion)
    $config = $config.Replace("__LAST_UPGRADE__", $upgradeLabel)
    $config = $config.Replace(
        "__ASANA_EXTRACTION_VERSION__",
        $asanaObject.VersionId
    )
    $config = $config.Replace(
        "__ASANA_EXTRACTION_TIME__",
        $asanaUpgradeLabel
    )
    $config = $config.Replace("__DASHBOARD_ID__", $DashboardId)
    $config = $config.Replace(
        "__PROJECT_MANAGER_DASHBOARD_ID__",
        $ProjectManagerDashboardId
    )
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
    $config = $config.Replace("__RISK_API_URL__", $RiskApiUrl)
    $config = $config.Replace("__FOLLOWUP_API_URL__", $FollowupApiUrl)
    $config = $config.Replace("__MINUTES_API_URL__", $MinutesApiUrl)
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
        },
        @{
            Source = "morris-opazo.png"
            Target = "morris-opazo.png"
            Type = "image/png"
        }
    )

    foreach (
        $resourceImage in Get-ChildItem `
            -LiteralPath $resourceBuild `
            -File `
            -Filter "*.png"
    ) {
        $assets += @{
            Source = "resources\$($resourceImage.Name)"
            Target = "resources/$($resourceImage.Name)"
            Type = "image/png"
        }
    }

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

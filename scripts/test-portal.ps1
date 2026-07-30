[CmdletBinding()]
param(
    [ValidateSet("dev", "prod", "all")]
    [string]$Environment = "all",
    [string]$AwsRegion = "us-east-1"
)

$ErrorActionPreference = "Stop"
$authStackName = "pmo-executive-portal-auth"
$environments = if ($Environment -eq "all") {
    @("dev", "prod")
} else {
    @($Environment)
}

$authStack = aws cloudformation describe-stacks `
    --stack-name $authStackName `
    --region $AwsRegion `
    --query "Stacks[0]" `
    --output json `
    --no-cli-pager | ConvertFrom-Json

if ($LASTEXITCODE -ne 0 -or $authStack.StackStatus -notmatch "_COMPLETE$") {
    throw "El stack de autenticación no está disponible."
}

$authOutputs = @{}
foreach ($output in $authStack.Outputs) {
    $authOutputs[$output.OutputKey] = $output.OutputValue
}

$anonymousApiStatus = curl.exe `
    -sS `
    -o NUL `
    -w "%{http_code}" `
    $authOutputs.EmbedApiUrl
if ($anonymousApiStatus -ne "401") {
    throw "El API de embedding no rechazó el acceso anónimo."
}

foreach ($targetEnvironment in $environments) {
    $stackName = "pmo-executive-portal-$targetEnvironment"
    $stack = aws cloudformation describe-stacks `
        --stack-name $stackName `
        --region $AwsRegion `
        --query "Stacks[0]" `
        --output json `
        --no-cli-pager | ConvertFrom-Json

    if ($LASTEXITCODE -ne 0) {
        throw "No existe o no es accesible el stack $stackName"
    }

    $outputs = @{}
    foreach ($output in $stack.Outputs) {
        $outputs[$output.OutputKey] = $output.OutputValue
    }

    $response = Invoke-WebRequest `
        -Uri $outputs.PortalUrl `
        -Method Head `
        -UseBasicParsing

    if ($response.StatusCode -ne 200) {
        throw (
            "El portal $targetEnvironment respondió " +
            "$($response.StatusCode)."
        )
    }

    $config = Invoke-WebRequest `
        -Uri "$($outputs.PortalUrl)/config.js" `
        -UseBasicParsing
    if (
        $config.Content -notmatch [regex]::Escape(
            $authOutputs.UserPoolClientId
        ) -or
        $config.Content -notmatch [regex]::Escape(
            $authOutputs.EmbedApiUrl
        )
    ) {
        throw (
            "El portal $targetEnvironment no contiene la configuración " +
            "segura vigente."
        )
    }

    $publicAccess = aws s3api get-public-access-block `
        --bucket $outputs.PortalBucketName `
        --region $AwsRegion `
        --query "PublicAccessBlockConfiguration" `
        --output json `
        --no-cli-pager | ConvertFrom-Json

    $allPublicAccessBlocked = (
        $publicAccess.BlockPublicAcls -and
        $publicAccess.IgnorePublicAcls -and
        $publicAccess.BlockPublicPolicy -and
        $publicAccess.RestrictPublicBuckets
    )

    if (-not $allPublicAccessBlocked) {
        throw (
            "El bucket $($outputs.PortalBucketName) no tiene " +
            "todo el acceso público bloqueado."
        )
    }

    Write-Host (
        "{0}: OK | HTTP 200 | S3 privado | {1}" -f
        $targetEnvironment.ToUpperInvariant(),
        $outputs.PortalUrl
    )
}

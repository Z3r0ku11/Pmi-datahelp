# Deploy PMO Framework Hub - Stage Environment
param(
    [string]$Region = "us-east-1",
    [string]$StackName = "pmo-framework-hub-stage"
)

Write-Host "🚀 Deploying PMO Framework Hub - Stage Environment" -ForegroundColor Green

# Validate AWS credentials
Write-Host "📋 Validating AWS credentials..." -ForegroundColor Yellow
$awsId = aws sts get-caller-identity --region $Region --query 'Account' --output text 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ AWS credentials not configured. Run 'aws login'" -ForegroundColor Red
    exit 1
}
Write-Host "✅ AWS Account: $awsId" -ForegroundColor Green

# Deploy CloudFormation stack
Write-Host "📦 Deploying CloudFormation stack: $StackName" -ForegroundColor Yellow
aws cloudformation deploy `
    --template-file stage-infrastructure.yaml `
    --stack-name $StackName `
    --region $Region `
    --capabilities CAPABILITY_NAMED_IAM `
    --no-fail-on-empty-changeset

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ CloudFormation deployment failed" -ForegroundColor Red
    exit 1
}

# Get stack outputs
Write-Host "📊 Getting stack outputs..." -ForegroundColor Yellow
$bucketName = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --query 'Stacks[0].Outputs[?OutputKey==`StagePortalBucket`].OutputValue' `
    --output text

$distributionId = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --query 'Stacks[0].Outputs[?OutputKey==`StageCloudFrontDistribution`].OutputValue' `
    --output text

$portalUrl = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --query 'Stacks[0].Outputs[?OutputKey==`StagePortalURL`].OutputValue' `
    --output text

$userPoolId = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --query 'Stacks[0].Outputs[?OutputKey==`StageCognitoUserPoolId`].OutputValue' `
    --output text

$clientId = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --query 'Stacks[0].Outputs[?OutputKey==`StageCognitoClientId`].OutputValue' `
    --output text

# Create admin user dbarrios
Write-Host "👤 Creating admin user: dbarrios" -ForegroundColor Yellow
$tempPassword = -join ((65..90) + (97..122) + (48..57) + (33,64,35,36,37,94,38,42) | Get-Random -Count 16 | % {[char]$_})

aws cognito-idp admin-create-user `
    --user-pool-id $userPoolId `
    --username dbarrios `
    --user-attributes Name=email,Value=dbarrios@morrisopazo.com Name=name,Value="Daniel Barrios" `
    --temporary-password $tempPassword `
    --message-action SUPPRESS `
    --region $Region 2>$null

# Add user to SITE_ADMIN group
aws cognito-idp admin-add-user-to-group `
    --user-pool-id $userPoolId `
    --username dbarrios `
    --group-name SITE_ADMIN `
    --region $Region

# Save deployment info
$deploymentInfo = @{
    Environment = "stage"
    BucketName = $bucketName
    DistributionId = $distributionId
    PortalURL = $portalUrl
    UserPoolId = $userPoolId
    ClientId = $clientId
    AdminUser = "dbarrios"
    TempPassword = $tempPassword
    DeployedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss UTC")
} | ConvertTo-Json -Depth 3

$deploymentInfo | Out-File -FilePath "stage-deployment-info.json" -Encoding utf8

Write-Host "✅ Stage Environment Deployed Successfully!" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "📋 STAGE DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "Portal URL: $portalUrl" -ForegroundColor White
Write-Host "S3 Bucket: $bucketName" -ForegroundColor White
Write-Host "CloudFront ID: $distributionId" -ForegroundColor White
Write-Host "User Pool ID: $userPoolId" -ForegroundColor White
Write-Host "Client ID: $clientId" -ForegroundColor White
Write-Host "Admin User: dbarrios" -ForegroundColor White
Write-Host "Temp Password: $tempPassword" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White
Write-Host "⚠️  Save the temporary password - it won't be shown again!" -ForegroundColor Yellow
Write-Host "📁 Deployment info saved to: stage-deployment-info.json" -ForegroundColor White
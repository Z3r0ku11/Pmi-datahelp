# PMI-DataHelp Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the complete PMI-DataHelp system to AWS, including the controlled retirement of legacy CloudFront distributions E2PZTIX3UVRQGX and E1DIOY1CMNCF9Q as specified in the master prompt.

## Pre-Deployment Checklist

### Prerequisites

- [x] **AWS CLI v2** installed and configured
- [x] **Node.js 18+** and npm installed
- [x] **PowerShell 7+** for running deployment scripts
- [x] **Git** access to repository
- [x] **Domain ownership** verified
- [x] **SSL certificate** provisioned in ACM (us-east-1)
- [x] **GitHub personal access token** with repository permissions

### AWS Account Setup

```bash
# Verify AWS account and region
aws sts get-caller-identity
aws configure get region

# Expected output:
# Account: 664858858204
# Region: us-east-1
```

### Required Permissions

The deploying IAM user/role needs these AWS permissions:

- CloudFormation: Full access
- S3: Full access
- CloudFront: Full access
- CodePipeline/CodeBuild: Full access
- Cognito: Full access
- IAM: Create/update roles and policies
- Lambda: Basic execution (for future API)
- SSM Parameter Store: Read/write access

## Deployment Steps

### Step 1: Environment Configuration

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/pmi-datahelp.git
cd pmi-datahelp
```

2. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your specific values
```

3. **Install dependencies:**
```bash
npm install
```

### Step 2: Infrastructure Deployment

Deploy the core infrastructure using the comprehensive deployment script:

```powershell
./scripts/deploy-full-system.ps1 `
    -Environment "prod" `
    -DomainName "pmi-datahelp.com" `
    -CertificateArn "arn:aws:acm:us-east-1:664858858204:certificate/YOUR-CERT-ID" `
    -GitHubToken "ghp_YOUR_GITHUB_TOKEN" `
    -GitHubOwner "your-github-username" `
    -GitHubRepo "pmi-datahelp" `
    -RetireOldDistributions
```

**What this script does:**

1. ✅ **Validates prerequisites** (AWS CLI, credentials, certificates)
2. ✅ **Deploys infrastructure** (S3, CloudFront, Cognito via CloudFormation)
3. ✅ **Sets up CI/CD pipeline** (CodePipeline + CodeBuild)
4. ✅ **Builds applications** (Phase 1 & Phase 2 React apps)
5. ✅ **Deploys to S3** with optimized cache headers
6. ✅ **Invalidates CloudFront** for immediate updates
7. ✅ **Retires old distributions** E2PZTIX3UVRQGX and E1DIOY1CMNCF9Q

### Step 3: DNS Configuration

After infrastructure deployment, update your DNS records:

1. **Get CloudFront distribution URLs** from CloudFormation outputs
2. **Update DNS records:**

```
# Phase 1 (Public Portal)
pmi-datahelp.com      CNAME    d1234567890123.cloudfront.net
www.pmi-datahelp.com  CNAME    d1234567890123.cloudfront.net

# Phase 2 (PMO Dashboard)  
pmo.pmi-datahelp.com  CNAME    d0987654321098.cloudfront.net

# API (Future)
api.pmi-datahelp.com  CNAME    d5678901234567.cloudfront.net
```

3. **Verify DNS propagation:**
```bash
nslookup pmi-datahelp.com
nslookup pmo.pmi-datahelp.com
```

### Step 4: Legacy Distribution Retirement

**⚠️ CRITICAL STEP**: Retire the old CloudFront distributions as required by the master prompt.

```powershell
# Retire legacy distributions (E2PZTIX3UVRQGX and E1DIOY1CMNCF9Q)
./scripts/retire-cloudfront-distributions.ps1 -Force
```

This script will:
- Disable both legacy distributions
- Wait for propagation
- Confirm retirement status
- Provide cleanup verification

### Step 5: Validation

Run comprehensive deployment validation:

```powershell
./scripts/validate-deployment.ps1 `
    -Environment "prod" `
    -DomainName "pmi-datahelp.com" `
    -Verbose
```

**Validation includes:**
- ✅ Infrastructure health (CloudFormation, S3, CloudFront)
- ✅ Application functionality (both Phase 1 & 2)
- ✅ Authentication system (Cognito integration)
- ✅ Security configurations (HTTPS, headers)
- ✅ Performance benchmarks
- ✅ CI/CD pipeline status

## Post-Deployment Configuration

### Step 6: Cognito User Setup

1. **Create initial admin user:**
```bash
aws cognito-idp admin-create-user \
    --user-pool-id us-east-1_XXXXXXXXX \
    --username admin@morris.com \
    --temporary-password TempPassword123! \
    --user-attributes Name=email,Value=admin@morris.com Name=custom:role,Value=admin \
    --message-action SUPPRESS
```

2. **Create PMO users:**
```bash
aws cognito-idp admin-create-user \
    --user-pool-id us-east-1_XXXXXXXXX \
    --username pmo@morris.com \
    --temporary-password TempPassword123! \
    --user-attributes Name=email,Value=pmo@morris.com Name=custom:role,Value=pmo
```

### Step 7: CI/CD Pipeline Testing

1. **Trigger initial pipeline run:**
```powershell
./scripts/manage-pipeline.ps1 -Action start -Environment prod
```

2. **Monitor pipeline execution:**
```powershell
./scripts/manage-pipeline.ps1 -Action status -Environment prod
```

3. **View logs if needed:**
```powershell
./scripts/manage-pipeline.ps1 -Action logs -Environment prod
```

## Verification Checklist

After deployment, verify these critical components:

### ✅ Infrastructure
- [ ] CloudFormation stacks deployed successfully
- [ ] S3 buckets created and configured
- [ ] CloudFront distributions active and healthy
- [ ] Cognito User Pool and clients configured
- [ ] CI/CD pipeline operational

### ✅ Applications
- [ ] Phase 1 (https://pmi-datahelp.com) loads correctly
- [ ] Phase 2 (https://pmo.pmi-datahelp.com) requires authentication
- [ ] Login functionality works with Cognito
- [ ] Role-based access control functioning
- [ ] Static assets served from CloudFront

### ✅ Security
- [ ] HTTPS enforcement active
- [ ] Security headers present
- [ ] Cognito authentication working
- [ ] Phase 2 access restricted to authorized users
- [ ] Old distributions (E2PZTIX3UVRQGX, E1DIOY1CMNCF9Q) disabled

### ✅ Performance
- [ ] Page load times < 3 seconds
- [ ] CloudFront caching active
- [ ] Gzip compression enabled
- [ ] Cache headers optimized

## Troubleshooting

### Common Issues

1. **CloudFormation deployment fails:**
```bash
# Check stack events
aws cloudformation describe-stack-events --stack-name pmi-datahelp-main-prod

# Common causes:
# - Certificate not in us-east-1
# - Insufficient IAM permissions
# - Resource naming conflicts
```

2. **Application not loading:**
```bash
# Check S3 bucket contents
aws s3 ls s3://pmi-datahelp-phase1-prod-664858858204/ --recursive

# Check CloudFront distribution status
aws cloudfront get-distribution --id EXXXXXXXXXXXXX
```

3. **Authentication not working:**
```bash
# Check Cognito User Pool
aws cognito-idp describe-user-pool --user-pool-id us-east-1_XXXXXXXXX

# Verify client configuration
aws cognito-idp describe-user-pool-client --user-pool-id us-east-1_XXXXXXXXX --client-id YYYYYYYYYY
```

4. **CI/CD pipeline failing:**
```powershell
# Check pipeline status
./scripts/manage-pipeline.ps1 -Action status -Environment prod

# View detailed logs
./scripts/manage-pipeline.ps1 -Action logs -Environment prod
```

### Emergency Rollback

If you need to rollback the deployment:

1. **Rollback CloudFormation stacks:**
```bash
aws cloudformation cancel-update-stack --stack-name pmi-datahelp-main-prod
```

2. **Revert to previous S3 deployment:**
```bash
# List object versions
aws s3api list-object-versions --bucket pmi-datahelp-phase1-prod-664858858204

# Restore previous version (if versioning enabled)
aws s3api restore-object --bucket BUCKET --key index.html --version-id VERSION-ID
```

3. **Re-enable old distributions if necessary:**
```powershell
# Check current status
aws cloudfront get-distribution --id E2PZTIX3UVRQGX

# Re-enable if needed (emergency only)
# Follow AWS console procedure to update distribution config
```

## Maintenance

### Regular Tasks

1. **Monitor system health:**
```powershell
# Weekly validation
./scripts/validate-deployment.ps1 -Environment prod -DomainName "pmi-datahelp.com"
```

2. **Update dependencies:**
```bash
# Monthly security updates
npm audit
npm update
```

3. **Review access logs:**
```bash
# CloudFront access logs (if enabled)
aws s3 ls s3://pmi-datahelp-logs-664858858204/cloudfront/

# Application logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/pmi-datahelp"
```

4. **Backup configurations:**
```bash
# Export CloudFormation templates
aws cloudformation get-template --stack-name pmi-datahelp-main-prod > backup-template.json

# Export Cognito configuration
aws cognito-idp describe-user-pool --user-pool-id us-east-1_XXXXXXXXX > backup-cognito.json
```

## Security Considerations

### Production Security

1. **Enable additional monitoring:**
   - CloudTrail for API logging
   - Config for compliance monitoring
   - GuardDuty for threat detection

2. **Implement backup strategies:**
   - S3 versioning enabled
   - Cross-region backup for critical data
   - Configuration backup automation

3. **Access control:**
   - Rotate GitHub tokens regularly
   - Review IAM permissions quarterly
   - Monitor Cognito user activity

4. **Certificate management:**
   - Set up auto-renewal reminders
   - Monitor certificate expiration
   - Implement certificate transparency monitoring

## Support and Contacts

### Documentation
- Infrastructure: `./docs/INFRASTRUCTURE.md`
- Authentication: `./docs/AUTHENTICATION.md`
- CI/CD: `./docs/CI-CD-SETUP.md`
- API: `./docs/API.md` (when implemented)

### Monitoring Dashboards
- CloudFormation: AWS Console → CloudFormation
- CodePipeline: AWS Console → CodePipeline  
- CloudFront: AWS Console → CloudFront
- Cognito: AWS Console → Cognito

### Emergency Contacts
- AWS Support: Your support plan level
- Domain Provider: Contact for DNS issues
- Certificate Authority: For SSL certificate issues
- GitHub Support: For repository/CI issues

## Success Criteria

✅ **Deployment is considered successful when:**

1. Both Phase 1 and Phase 2 applications are accessible
2. Authentication system fully functional
3. CI/CD pipeline operational
4. Legacy distributions E2PZTIX3UVRQGX and E1DIOY1CMNCF9Q retired
5. All validation tests pass
6. Performance benchmarks met
7. Security configurations active
8. DNS propagation complete

## Next Steps

After successful deployment:

1. **Content population:** Add initial educational content to Phase 1
2. **User onboarding:** Create PMO user accounts and training
3. **Monitoring setup:** Configure alerts and dashboards
4. **Documentation updates:** Keep deployment docs current
5. **Regular maintenance:** Schedule periodic updates and reviews

---

**Deployment completed successfully!** 🎉

Your PMI-DataHelp system is now live and ready for use.
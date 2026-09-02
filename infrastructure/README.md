# PMI-DataHelp AWS Infrastructure

This directory contains the AWS CloudFormation templates and deployment scripts for the PMI-DataHelp dual-phase application.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                             Internet                                 │
└─────────────────┬───────────────────────────┬─────────────────────────┘
                  │                           │
         ┌────────▼────────┐         ┌────────▼────────┐
         │ CloudFront CDN  │         │ CloudFront CDN  │
         │   (Phase 1)     │         │   (Phase 2)     │
         │ Educational     │         │ Corporate PMO   │
         └────────┬────────┘         └────────┬────────┘
                  │                           │
         ┌────────▼────────┐         ┌────────▼────────┐
         │   S3 Bucket     │         │   S3 Bucket     │
         │ React SPA (P1)  │         │ React SPA (P2)  │
         └─────────────────┘         └─────────────────┘
                  │                           │
                  └─────────┬───────┬─────────┘
                            │       │
                   ┌────────▼───────▼────────┐
                   │     API Gateway         │
                   └────────┬────────────────┘
                            │
                   ┌────────▼────────┐
                   │ Lambda Functions│
                   │  Python 3.12    │
                   └────────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐ ┌───────▼────────┐ ┌───────▼────────┐
│ Amazon Cognito │ │   DynamoDB     │ │  S3 Content    │
│ User Pools     │ │ Sessions/Audit │ │    Bucket      │
└────────────────┘ └────────────────┘ └────────────────┘
```

## Components

### 1. Main Infrastructure (`main-infrastructure.yaml`)
- **S3 Buckets**: Separate buckets for Phase 1, Phase 2, content storage, and logs
- **CloudFront Distributions**: CDN for global content delivery with custom domains
- **Origin Access Control**: Secure access to S3 buckets
- **Logging**: Centralized CloudFront and application logs

### 2. Authentication (`cognito-auth.yaml`)
- **Cognito User Pool**: Centralized user management
- **User Groups**: Role-based access control (phase1-users, phase2-users, pmo-admins, executives)
- **Identity Providers**: Support for Google OAuth and corporate SSO
- **MFA Configuration**: Multi-factor authentication for enhanced security

### 3. API Backend (`api-backend.yaml`)
- **Lambda Functions**: Separate functions for Phase 1 and Phase 2 APIs
- **API Gateway**: RESTful API endpoints with CORS support
- **DynamoDB Tables**: Session management and audit logging
- **IAM Roles**: Least privilege access controls

## Deployment

### Prerequisites

1. **AWS CLI v2** installed and configured
2. **PowerShell 7+** for deployment scripts
3. **Valid SSL Certificate** in AWS Certificate Manager (us-east-1 region)
4. **Domain Name** with DNS access for CNAME configuration

### Step 1: Infrastructure Deployment

```powershell
# Deploy to development
./scripts/deploy-infrastructure.ps1 -Environment dev -DomainName "pmi-datahelp-dev.com" -CertificateArn "arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT-ID"

# Deploy to production
./scripts/deploy-infrastructure.ps1 -Environment prod -DomainName "pmi-datahelp.com" -CertificateArn "arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT-ID"
```

### Step 2: Application Deployment

```powershell
# Deploy application code
./scripts/deploy-application.ps1 -Environment prod

# Deploy specific phase only
./scripts/deploy-application.ps1 -Environment prod -PhaseOnly 1
```

### Step 3: Retire Old Distributions

```powershell
# Preview retirement (What-If mode)
./scripts/retire-old-distributions.ps1 -WhatIf

# Execute retirement
./scripts/retire-old-distributions.ps1 -Force
```

## Environment Configuration

### Development
- **Features**: MFA optional, self-signup enabled, debug logging
- **Domains**: `dev.pmi-datahelp.com`, `edu.dev.pmi-datahelp.com`, `pmo.dev.pmi-datahelp.com`
- **Retention**: 7 days for logs, 30 days for versions
- **Caching**: Disabled for faster development

### Production
- **Features**: MFA required, admin-only user creation, audit logging
- **Domains**: `pmi-datahelp.com`, `edu.pmi-datahelp.com`, `pmo.pmi-datahelp.com`
- **Retention**: 90 days for logs and audit data
- **Caching**: Optimized for performance with 1-year cache for static assets

## Security Features

### Network Security
- **HTTPS Only**: TLS 1.2+ enforced on all endpoints
- **CORS**: Properly configured cross-origin resource sharing
- **CSP Headers**: Content Security Policy headers via CloudFront

### Authentication & Authorization
- **Multi-Factor Authentication**: SMS and TOTP support
- **Role-Based Access Control**: Different permissions for Phase 1 vs Phase 2
- **Session Management**: Secure session tokens with configurable timeout

### Data Protection
- **Encryption at Rest**: AES-256 for S3 and DynamoDB
- **Encryption in Transit**: TLS 1.2+ for all communications
- **Key Management**: AWS managed keys for encryption

### Monitoring & Auditing
- **CloudTrail**: All API calls logged
- **DynamoDB Streams**: Real-time audit trail
- **CloudWatch**: Application and infrastructure monitoring

## Cost Optimization

### S3 Storage Classes
- **Standard**: For active web content
- **Intelligent Tiering**: For content bucket with automatic optimization
- **Lifecycle Policies**: Automatic deletion of old versions and logs

### Lambda Configuration
- **Reserved Concurrency**: Prevents cost overruns
- **Memory Optimization**: Right-sized based on environment
- **X-Ray Tracing**: Performance monitoring with minimal overhead

### CloudFront Optimization
- **Price Class 100**: Most cost-effective for global delivery
- **Compression**: Automatic gzip compression
- **Caching**: Long-term caching for static assets

## Backup & Recovery

### Data Backup
- **S3 Versioning**: Enabled with lifecycle management
- **DynamoDB Point-in-Time Recovery**: Continuous backups
- **Cross-Region Replication**: Available for critical buckets

### Disaster Recovery
- **Infrastructure as Code**: Reproducible deployments
- **Multi-AZ**: DynamoDB and Lambda automatically distributed
- **CloudFront**: Global edge locations for high availability

## Troubleshooting

### Common Issues

1. **Certificate Validation Failed**
   - Ensure certificate is in us-east-1 region
   - Verify certificate status is "ISSUED"
   - Check domain validation

2. **CloudFront Distribution Creation Timeout**
   - CloudFront distributions can take 15-45 minutes to deploy
   - Check AWS Service Health Dashboard
   - Monitor CloudFormation events

3. **API Gateway CORS Errors**
   - Verify OPTIONS method is configured
   - Check CORS headers in Lambda responses
   - Validate preflight handling

4. **Cognito Authentication Issues**
   - Verify callback URLs match exactly
   - Check user pool client configuration
   - Validate JWT token expiration

### Monitoring Commands

```powershell
# Check stack status
aws cloudformation describe-stacks --stack-name pmi-datahelp-main-prod

# View CloudFront distribution status
aws cloudfront get-distribution --id E1234567890ABC

# Check Lambda function logs
aws logs tail /aws/lambda/pmi-datahelp-phase1-api-prod --follow
```

## Support

For infrastructure issues:
1. Check CloudFormation stack events
2. Review CloudWatch logs
3. Validate AWS service limits
4. Contact AWS Support if needed

For application issues:
1. Check Lambda function logs in CloudWatch
2. Validate API Gateway request/response logs
3. Review DynamoDB metrics
4. Check client-side browser console
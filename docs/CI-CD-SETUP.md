# PMI-DataHelp CI/CD Setup Guide

## Overview

El sistema CI/CD utiliza **AWS CodePipeline V2** como se especifica en el master prompt, NO GitHub Actions. La pipeline está completamente integrada con AWS y proporciona despliegue automático para ambas fases.

## Arquitectura CI/CD

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│  CodePipeline   │───▶│   Deployment    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   CodeBuild     │
                    │   Projects      │
                    └─────────────────┘
                              │
                    ┌─────────────────┐
                    │   S3 + CloudFront │
                    │   Invalidation   │
                    └─────────────────┘
```

## Pipeline Stages

### 1. Source Stage
- **Trigger**: GitHub repository webhook
- **Branch**: main (configurable)
- **Polling**: Habilitado como backup

### 2. Test Stage
- **Duration**: ~5-10 minutos
- **Actions**:
  - ESLint (código quality)
  - TypeScript compilation check
  - Unit tests (Vitest)
  - Security audit (npm audit)
  - Build validation

### 3. Build Stage (Parallel)
- **Phase 1 Build**: ~8-12 minutos
  - React SPA build para portal educativo
  - Variables de entorno desde SSM
  - Optimización para producción
  
- **Phase 2 Build**: ~8-12 minutos
  - React SPA build para dashboard corporativo
  - Configuración específica PMO
  - Assets optimizados

### 4. Deploy Stage
- **Duration**: ~3-5 minutos
- **Actions**:
  - S3 sync para ambas fases
  - Cache headers optimizados
  - CloudFront invalidation
  - Health checks automáticos

## Setup Instructions

### 1. Prerequisitos

```bash
# AWS CLI v2
aws --version

# PowerShell 7+
pwsh --version

# Credenciales AWS configuradas
aws sts get-caller-identity
```

### 2. Configurar Infrastructure

```powershell
# 1. Deploy main infrastructure first
./scripts/deploy-infrastructure.ps1 -Environment prod -DomainName "pmi-datahelp.com" -CertificateArn "arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT-ID"

# 2. Setup CI/CD pipeline
./scripts/setup-cicd.ps1 -Environment prod -GitHubOwner "your-github-user" -GitHubToken "ghp_XXXXXXXXXXXX" -MainStackName "pmi-datahelp-main-prod"
```

### 3. Verificar Setup

```powershell
# Check pipeline status
./scripts/manage-pipeline.ps1 -Action status -Environment prod

# Trigger manual execution
./scripts/manage-pipeline.ps1 -Action start -Environment prod
```

## Environment Variables

### Stored in SSM Parameter Store

```
/pmi-datahelp/prod/api-url
/pmi-datahelp/prod/cognito-user-pool-id
/pmi-datahelp/prod/cognito-phase1-client-id
/pmi-datahelp/prod/cognito-phase2-client-id
/pmi-datahelp/prod/phase1-bucket
/pmi-datahelp/prod/phase2-bucket
/pmi-datahelp/prod/phase1-distribution-id
/pmi-datahelp/prod/phase2-distribution-id
```

### Build-time Variables

```bash
VITE_APP_VERSION=2.0.0
VITE_APP_ENVIRONMENT=prod
VITE_COGNITO_REGION=us-east-1
NODE_ENV=production
```

## Pipeline Management

### Common Commands

```powershell
# Start pipeline
npm run manage:pipeline start prod

# Check status
npm run manage:pipeline status prod

# View logs
npm run manage:pipeline logs prod

# Stop running execution
npm run manage:pipeline stop prod

# View execution history
npm run manage:pipeline history prod
```

### Manual Deployment (Emergency)

```powershell
# Deploy specific phase only
./scripts/deploy-application.ps1 -Environment prod -PhaseOnly 1

# Deploy without building (use existing dist)
./scripts/deploy-application.ps1 -Environment prod -SkipBuild
```

## Monitoring & Alerts

### CloudWatch Logs

- `/aws/codebuild/pmi-datahelp-test-prod`
- `/aws/codebuild/pmi-datahelp-phase1-build-prod`
- `/aws/codebuild/pmi-datahelp-phase2-build-prod`
- `/aws/codebuild/pmi-datahelp-deploy-prod`

### SNS Notifications

- **Success**: Deploy completed
- **Failure**: Any stage failure
- **Warning**: Long execution time

### Key Metrics

- **Build Success Rate**: >95%
- **Average Build Time**: <15 minutos
- **Deploy Success Rate**: >99%
- **Time to Deploy**: <20 minutos total

## Security Features

### IAM Roles

- **CodePipeline Role**: Minimal permissions para orchestration
- **CodeBuild Role**: S3, CloudFront, SSM access only
- **Cross-account**: No permissions outside account

### Secrets Management

- **GitHub Token**: Encrypted in CodePipeline
- **AWS Credentials**: IAM roles (no keys)
- **Application Secrets**: SSM Parameter Store

### Network Security

- **CodeBuild**: VPC opcional (no requerido)
- **S3 Access**: IAM roles only
- **CloudFront**: Origin Access Control (OAC)

## Troubleshooting

### Common Issues

1. **Build Timeout**
   ```
   Increase timeout in CloudFormation template
   Check dependency installation logs
   ```

2. **Deploy Failure**
   ```
   Verify S3 bucket permissions
   Check CloudFront distribution status
   Validate SSM parameters
   ```

3. **Test Failures**
   ```
   Review test logs in CodeBuild
   Check for breaking changes in dependencies
   Validate TypeScript compilation
   ```

### Debug Commands

```powershell
# View specific build logs
aws logs tail /aws/codebuild/pmi-datahelp-test-prod --follow

# Check S3 sync status
aws s3 ls s3://pmi-datahelp-phase1-prod-664858858204/ --recursive

# Verify CloudFront invalidation
aws cloudfront list-invalidations --distribution-id E1234567890ABC
```

## Performance Optimization

### Build Optimization

- **npm ci**: Faster than npm install
- **Caching**: node_modules cached between builds
- **Parallel builds**: Phase 1 y Phase 2 en paralelo
- **Incremental builds**: Only changed files

### Deploy Optimization

- **S3 Sync**: --delete para cleanup
- **Cache Headers**: 1 año para assets, no-cache para HTML
- **CloudFront**: Invalidation solo cuando necesario
- **Compression**: Gzip automático

## Cost Management

### CodeBuild Costs

- **Development**: BUILD_GENERAL1_SMALL
- **Production**: BUILD_GENERAL1_LARGE (faster builds)
- **Estimated**: $5-15/mes dependiendo de frequency

### S3 Storage

- **Artifacts**: Lifecycle policy 30 días
- **Web Content**: Standard storage class
- **Logs**: Intelligent Tiering

### Data Transfer

- **CloudFront**: Included en precio
- **S3 to CodeBuild**: Minimal cost
- **Estimated**: <$5/mes

## Compliance & Governance

### Audit Trail

- **CloudTrail**: All API calls logged
- **CodePipeline**: Execution history
- **CodeBuild**: Build logs retained 90 days

### Access Control

- **Pipeline Execution**: Automated only
- **Manual Override**: Requires admin permissions
- **Code Changes**: Pull request required

### Data Retention

- **Build Artifacts**: 30 días
- **Logs**: 90 días (production)
- **Git History**: Permanent en GitHub

## Migration from GitHub Actions

Si estás migrando desde GitHub Actions:

1. **Disable GitHub Actions** workflows
2. **Setup CodePipeline** usando los scripts
3. **Test thoroughly** antes de production
4. **Update documentation** con nuevos procesos

## Next Steps

1. **Configure notifications** (email/Slack)
2. **Setup monitoring dashboards**
3. **Create runbooks** para troubleshooting
4. **Train team** en nuevos processes
5. **Schedule regular reviews** de performance

## Support

Para problemas con CI/CD:

1. Check CloudFormation stacks first
2. Review CodeBuild logs
3. Validate IAM permissions
4. Contact AWS Support si es infrastructure issue
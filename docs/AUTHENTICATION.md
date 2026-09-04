# PMI-DataHelp Authentication System

## Overview

El sistema de autenticación de PMI-DataHelp está diseñado para proporcionar control de acceso granular entre las dos fases del proyecto:

- **Phase 1**: Portal educativo público (acceso libre con autenticación opcional)
- **Phase 2**: Dashboard PMO (acceso restringido solo para personal autorizado)

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   AWS Cognito   │───▶│   Backend API   │
│   React Apps    │    │   User Pool     │    │   Validation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local Storage │    │   JWT Tokens    │    │   Permissions   │
│   User Session  │    │   ID/Access     │    │   Role-based    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Authentication Providers

### 1. AWS Cognito User Pool

**Configuration**:
- Region: us-east-1
- User Pool ID: Configured per environment
- Separate client IDs for Phase 1 and Phase 2

**Features**:
- Email/password authentication
- Password policies and validation
- User registration and confirmation
- Password reset flows
- Multi-factor authentication (planned)

### 2. Google OAuth (Optional)

**Integration**:
- Google Identity Services
- OAuth 2.0 flow
- Automatic user creation
- Profile information sync

## User Roles and Permissions

### Role Hierarchy

```
admin        (Full system access)
├── pmo      (PMO dashboard + limited admin)
├── executive (Read-only dashboard access)
└── user     (Public portal access only)
```

### Permission Matrix

| Resource | admin | pmo | executive | user |
|----------|-------|-----|-----------|------|
| Phase 1 Portal | ✅ | ✅ | ✅ | ✅ |
| Phase 2 Dashboard | ✅ | ✅ | ✅ | ❌ |
| Portfolio Management | ✅ | ✅ | 👁️ | ❌ |
| Project Creation | ✅ | ✅ | ❌ | ❌ |
| Reports Generation | ✅ | ✅ | 👁️ | ❌ |
| System Settings | ✅ | ❌ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ | ❌ |

**Legend**: ✅ Full Access, 👁️ Read Only, ❌ No Access

### Granular Permissions

Each user has specific permissions defined as:

```typescript
interface Permission {
  resource: string;    // 'portfolio', 'projects', 'reports'
  actions: string[];   // ['read', 'write', 'delete', 'admin']
}
```

**Example Permissions**:

```typescript
// PMO User
permissions: [
  { resource: 'phase1', actions: ['read', 'write'] },
  { resource: 'phase2', actions: ['read', 'write'] },
  { resource: 'portfolio', actions: ['read', 'write'] },
  { resource: 'projects', actions: ['read', 'write'] },
  { resource: 'reports', actions: ['read', 'write'] },
]

// Executive User
permissions: [
  { resource: 'phase1', actions: ['read'] },
  { resource: 'phase2', actions: ['read'] },
  { resource: 'portfolio', actions: ['read'] },
  { resource: 'projects', actions: ['read'] },
  { resource: 'reports', actions: ['read'] },
]
```

## Phase Access Control

### Phase 1 (Public Portal)

- **Default Access**: Open to all users (authenticated and anonymous)
- **Enhanced Features**: Available to authenticated users
- **Authentication**: Optional for basic content, required for personalization

### Phase 2 (PMO Dashboard)

- **Access Requirement**: Mandatory authentication
- **Role Requirement**: `admin`, `pmo`, or `executive` roles only
- **Additional Validation**: Backend permission verification
- **Session Management**: Extended sessions for business users

## Implementation Components

### 1. AuthProvider Context

```typescript
// Global authentication state management
<AuthProvider>
  <App />
</AuthProvider>
```

### 2. ProtectedRoute Component

```typescript
// Route-level protection
<ProtectedRoute 
  requireAuth={true}
  phase="2"
  requiredRoles={['admin', 'pmo']}
  requiredPermissions={[{ resource: 'portfolio', action: 'read' }]}
>
  <Portfolio />
</ProtectedRoute>
```

### 3. useAuth Hook

```typescript
// Component-level authentication
const { authState, login, logout, hasPermission, canAccessPhase } = useAuth();
```

### 4. usePermissions Hook

```typescript
// Component-level permission checking
const { can, canEdit, isAdmin, isPMO } = usePermissions();
```

## Security Features

### Token Management

- **JWT Tokens**: Signed by Cognito
- **Automatic Refresh**: Background token refresh
- **Secure Storage**: httpOnly cookies for sensitive tokens
- **Expiration Handling**: Automatic logout on expiration

### Session Security

- **HTTPS Only**: All authentication traffic encrypted
- **CSRF Protection**: Anti-CSRF tokens
- **XSS Protection**: Content Security Policy
- **Session Timeout**: Configurable idle timeout

### Data Protection

- **PII Handling**: Minimal storage, encrypted at rest
- **Audit Logging**: All authentication events logged
- **Failed Attempts**: Brute force protection
- **Account Lockout**: Temporary lockout on repeated failures

## Configuration

### Environment Variables

```bash
# Cognito Configuration
VITE_COGNITO_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_PHASE1_CLIENT_ID=xxxxxxxxxx
VITE_COGNITO_PHASE2_CLIENT_ID=yyyyyyyyyy

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=client-id.googleusercontent.com

# Feature Flags
VITE_ENABLE_GOOGLE_AUTH=true
VITE_ENABLE_MFA=false
VITE_MOCK_AUTH=false  # Development only
```

### Cognito User Pool Settings

```yaml
# Password Policy
MinimumLength: 8
RequireUppercase: true
RequireLowercase: true
RequireNumbers: true
RequireSymbols: false

# Account Recovery
PasswordRecovery: true
EmailVerification: true
PhoneVerification: false

# Security
UnusedAccountValidityDays: 90
TemporaryPasswordValidityDays: 7
```

## Development & Testing

### Mock Authentication

For development, set `VITE_MOCK_AUTH=true`:

```typescript
// Auto-assigns mock users based on email pattern
admin@morris.com     → admin role
pmo@morris.com       → pmo role
executive@morris.com → executive role
user@example.com     → user role
```

### Test Users

Create test users in Cognito for each role:

```bash
# Admin User
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username admin.test@morris.com \
  --temporary-password TempPass123! \
  --user-attributes Name=email,Value=admin.test@morris.com Name=custom:role,Value=admin

# PMO User
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username pmo.test@morris.com \
  --temporary-password TempPass123! \
  --user-attributes Name=email,Value=pmo.test@morris.com Name=custom:role,Value=pmo
```

## Error Handling

### Authentication Errors

| Error Code | Description | User Action |
|------------|-------------|-------------|
| `InvalidCredentials` | Wrong email/password | Re-enter credentials |
| `UserNotFound` | User doesn't exist | Check email or register |
| `UserNotConfirmed` | Email not verified | Check email for confirmation |
| `PasswordExpired` | Temporary password expired | Reset password |
| `TooManyRequests` | Rate limit exceeded | Wait and retry |
| `NetworkError` | Connection issues | Check internet connection |

### Permission Errors

| Error Type | Handling |
|------------|----------|
| `InsufficientRole` | Redirect to appropriate phase |
| `MissingPermission` | Show access denied message |
| `TokenExpired` | Automatic refresh or re-login |
| `InvalidSession` | Force re-authentication |

## Monitoring & Analytics

### Authentication Metrics

- Login success/failure rates
- Token refresh frequency
- Session duration analytics
- Permission denied events
- Popular authentication methods

### Security Monitoring

- Failed login attempts
- Suspicious login patterns
- Token validation failures
- Cross-phase access attempts
- Geographic login analysis

## Migration & Maintenance

### User Data Migration

```typescript
// Migration script for existing users
interface MigrationUser {
  email: string;
  role: UserRole;
  permissions: Permission[];
  migratedFrom: 'legacy' | 'import';
}
```

### Regular Maintenance

- **Audit Logs**: Review monthly
- **Permission Updates**: Quarterly review
- **Token Rotation**: Automatic
- **User Cleanup**: Remove inactive accounts (90 days)
- **Security Patches**: Apply promptly

## Troubleshooting

### Common Issues

1. **"Access Denied" on Phase 2**
   - Check user role assignment
   - Verify Cognito group membership
   - Validate token not expired

2. **Google Auth Not Working**
   - Verify Google Client ID
   - Check domain allowlist
   - Confirm HTTPS setup

3. **Token Refresh Failing**
   - Check refresh token validity
   - Verify Cognito configuration
   - Check network connectivity

### Debug Mode

Enable debug logging:

```bash
VITE_DEBUG_MODE=true
```

This provides detailed authentication flow logs in the browser console.

## Support

For authentication issues:

1. Check browser console for errors
2. Verify environment variables
3. Test with different browsers
4. Contact system administrator for role/permission issues

## Future Enhancements

### Planned Features

- **Multi-Factor Authentication (MFA)**
- **Single Sign-On (SSO)** with corporate systems
- **Social Login** (LinkedIn, Microsoft)
- **Advanced Role Management** UI
- **API Key Authentication** for integrations
- **Audit Dashboard** for administrators

### Security Roadmap

- **Zero Trust Architecture** implementation
- **Device-based Authentication**
- **Behavioral Analytics** for fraud detection
- **Advanced Threat Protection**
- **Compliance Reporting** (SOC2, ISO27001)
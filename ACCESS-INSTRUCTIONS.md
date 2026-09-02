# PMI-DataHelp v2.0 - Access Instructions

> **Complete access guide for the redesigned PMI-DataHelp system**

## 🎯 System Access Overview

PMI-DataHelp v2.0 provides two distinct phases with different access requirements:

### 🌐 Phase 1: Educational Portal (Public)
- **URL**: https://pmi-datahelp.com
- **Access**: Open to all users
- **Authentication**: Optional (enhanced features for logged-in users)
- **Purpose**: Educational content, resources, and PMI-based tools

### 🏢 Phase 2: PMO Dashboard (Restricted)
- **URL**: https://pmo.pmi-datahelp.com  
- **Access**: Restricted to authorized personnel only
- **Authentication**: Required (admin/pmo/executive roles)
- **Purpose**: Executive dashboard for project management oversight

## 🔐 User Accounts & Credentials

### Test Accounts (Change passwords after first login)

#### 👑 **Administrator Account**
```
Email: admin@morris.com
Password: TempPassword123!
Access Level: Full system access
Permissions: 
  ✅ Phase 1: Full access
  ✅ Phase 2: Full access  
  ✅ Settings: User management, system configuration
  ✅ Admin Panel: All administrative functions
```

#### 🏢 **PMO Manager Account**  
```
Email: pmo@morris.com
Password: TempPassword123!
Access Level: PMO operations
Permissions:
  ✅ Phase 1: Full access
  ✅ Phase 2: Full dashboard access
  ✅ Projects: Create, edit, manage projects
  ✅ Reports: Generate and view all reports
  ❌ Settings: Limited admin functions
```

#### 📊 **Executive Account**
```
Email: executive@morris.com  
Password: TempPassword123!
Access Level: Read-only dashboard
Permissions:
  ✅ Phase 1: Full access
  ✅ Phase 2: Read-only dashboard view
  ✅ Reports: View executive reports
  ❌ Projects: No editing capabilities
  ❌ Settings: No admin access
```

#### 👤 **Standard User Account**
```
Email: user@example.com
Password: TempPassword123!
Access Level: Educational portal only
Permissions:
  ✅ Phase 1: Basic access to educational content
  ❌ Phase 2: No dashboard access
  ❌ Reports: No access to PMO reports
  ❌ Settings: No admin access
```

## 🚀 Getting Started

### Step 1: Access Phase 1 (Educational Portal)

1. **Navigate to**: https://pmi-datahelp.com
2. **Browse content** without authentication (basic access)
3. **Optional**: Click "Login" for enhanced features
4. **Use any test account** for full educational portal experience

### Step 2: Access Phase 2 (PMO Dashboard)

1. **Navigate to**: https://pmo.pmi-datahelp.com
2. **Login required**: System will redirect to authentication
3. **Use admin, pmo, or executive account** (user account will be denied)
4. **Explore dashboard**: Access level depends on your role

### Step 3: Test Authentication Features

#### Google OAuth Login (If enabled)
1. Click "Sign in with Google" on login page
2. Use your Google account for authentication
3. System will automatically assign 'user' role initially
4. Contact administrator for role upgrade if needed

#### Password Management
1. **First Login**: System will prompt for password change
2. **Password Reset**: Use "Forgot Password" link
3. **Requirements**: 8+ characters, mixed case, numbers

## 🔒 Security & Access Control

### Phase 2 Access Requirements

**Who can access Phase 2:**
- ✅ Administrators (admin role)
- ✅ PMO Managers (pmo role)  
- ✅ Executives (executive role)
- ❌ Standard Users (user role)

**Access denied scenarios:**
- User with 'user' role attempting Phase 2 access
- Unauthenticated users trying to access dashboard
- Expired or invalid authentication tokens
- Users without proper role assignments

### Permission Matrix

| Feature | Admin | PMO | Executive | User |
|---------|-------|-----|-----------|------|
| **Phase 1 Portal** | ✅ | ✅ | ✅ | ✅ |
| **Phase 2 Dashboard** | ✅ | ✅ | ✅ | ❌ |
| **Create Projects** | ✅ | ✅ | ❌ | ❌ |
| **Edit Projects** | ✅ | ✅ | ❌ | ❌ |
| **View Reports** | ✅ | ✅ | ✅ | ❌ |
| **Generate Reports** | ✅ | ✅ | ❌ | ❌ |
| **User Management** | ✅ | ❌ | ❌ | ❌ |
| **System Settings** | ✅ | ❌ | ❌ | ❌ |

## 🛠️ Administrative Tasks

### Creating New Users

#### Via AWS Cognito Console
1. Navigate to AWS Cognito User Pools
2. Select PMI-DataHelp user pool
3. Click "Create User"
4. Set email, temporary password, and role attribute

#### Via AWS CLI
```bash
# Create admin user
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username new.admin@morris.com \
  --temporary-password TempPass123! \
  --user-attributes Name=email,Value=new.admin@morris.com Name=custom:role,Value=admin

# Create PMO user  
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username new.pmo@morris.com \
  --temporary-password TempPass123! \
  --user-attributes Name=email,Value=new.pmo@morris.com Name=custom:role,Value=pmo
```

### Managing User Roles

#### Role Assignment Rules
- **admin**: Full system access, user management capabilities
- **pmo**: PMO dashboard access, project management functions  
- **executive**: Read-only dashboard access for executives
- **user**: Educational portal access only

#### Updating User Roles
```bash
# Update user role via AWS CLI
aws cognito-idp admin-update-user-attributes \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username user@example.com \
  --user-attributes Name=custom:role,Value=pmo
```

## 🔧 Troubleshooting Access Issues

### Common Login Problems

#### 1. **"Access Denied" Message**
**Problem**: User cannot access Phase 2 dashboard
**Solutions**:
- Verify user has admin/pmo/executive role
- Check if user account is confirmed
- Ensure user is using correct login credentials
- Contact administrator to verify role assignment

#### 2. **Login Page Not Loading**
**Problem**: Authentication pages not accessible
**Solutions**:
- Check internet connection
- Verify URL is correct (https://pmo.pmi-datahelp.com)
- Clear browser cache and cookies
- Try different browser or incognito mode

#### 3. **"Invalid Credentials" Error**
**Problem**: Login fails with correct credentials
**Solutions**:
- Verify email address is exact (case sensitive)
- Check if temporary password needs to be changed
- Try password reset if multiple attempts failed
- Contact administrator if account may be locked

#### 4. **Redirect Loop After Login**
**Problem**: User gets stuck in login redirect
**Solutions**:
- Clear browser cookies for the domain
- Disable browser extensions temporarily
- Check if user has proper role permissions
- Try accessing from different browser

### Getting System Information

#### Check Current System Status
```powershell
# Get comprehensive system information
./scripts/get-access-info.ps1 -Environment prod -ShowAll

# Get basic access URLs and status  
./scripts/get-access-info.ps1 -Environment prod

# Show test credentials (admin only)
./scripts/get-access-info.ps1 -Environment prod -ShowCredentials
```

#### Validate System Health
```powershell
# Run full system validation
./scripts/validate-deployment.ps1 -Environment prod -DomainName "pmi-datahelp.com"

# Quick health check
./scripts/validate-deployment.ps1 -Environment prod -DomainName "pmi-datahelp.com" -SkipPerformanceTests -SkipSecurityTests
```

## 📱 Mobile Access

### Mobile Compatibility

- ✅ **Responsive Design**: Both phases optimized for mobile
- ✅ **Touch Interface**: Touch-friendly navigation and buttons
- ✅ **Progressive Web App**: Can be added to home screen
- ✅ **Offline Capability**: Basic content cached for offline viewing

### Mobile Browser Support

- ✅ **iOS Safari** 12+
- ✅ **Android Chrome** 80+
- ✅ **Samsung Internet** 12+
- ✅ **Firefox Mobile** 68+

## 🔄 Session Management

### Session Duration

- **Standard Users**: 2 hours of inactivity
- **PMO Users**: 4 hours of inactivity  
- **Admin Users**: 8 hours of inactivity
- **Remember Me**: 30 days (optional)

### Session Security

- ✅ **Automatic Logout**: On inactivity timeout
- ✅ **Token Refresh**: Automatic background refresh
- ✅ **Secure Cookies**: HttpOnly, Secure flags
- ✅ **Multi-device**: Each device maintains separate session

## 📞 Support & Contact

### For Technical Issues

1. **Check Documentation**: Review troubleshooting section above
2. **System Validation**: Run validation scripts to identify issues
3. **AWS Console**: Check CloudWatch logs for detailed errors
4. **Contact Administrator**: For account-related issues

### For Access Requests

#### New User Access
- Contact system administrator with:
  - User's full name and email
  - Requested access level (user/executive/pmo/admin)
  - Business justification for access level
  - Expected usage timeline

#### Role Changes
- Current users can request role changes by:
  - Submitting request to administrator
  - Providing business justification
  - Getting manager approval for elevated access

### Emergency Access

#### Lost Administrator Access
- Use AWS Console with proper IAM credentials
- Reset user password via Cognito console
- Create new admin user if necessary
- Update user roles via AWS CLI

#### System Unavailable
- Check AWS service status page
- Validate DNS resolution
- Review CloudFront distribution status
- Contact AWS support if infrastructure issue

## 🎯 Best Practices

### For Users

- ✅ **Change temporary passwords** immediately after first login
- ✅ **Use strong passwords** (8+ chars, mixed case, numbers, symbols)
- ✅ **Enable browser password manager** for secure credential storage
- ✅ **Log out** when finished, especially on shared computers
- ✅ **Report suspicious activity** to administrators immediately

### For Administrators

- ✅ **Regular access reviews** (monthly recommended)
- ✅ **Monitor login activities** via CloudWatch logs
- ✅ **Implement least-privilege** role assignments
- ✅ **Backup user configurations** regularly
- ✅ **Update documentation** as system evolves

## 📊 Usage Analytics

### Available Metrics

- **User Login Statistics**: Login frequency and patterns
- **Feature Usage**: Most accessed features and pages
- **Performance Metrics**: Page load times and user experience
- **Security Events**: Failed logins and suspicious activities

### Accessing Analytics

#### For Administrators
- AWS Cognito Analytics dashboard
- CloudWatch Logs insights
- CloudFront analytics reports
- Custom dashboards (if configured)

#### For PMO Managers
- Built-in usage reports in Phase 2 dashboard
- User engagement metrics
- Content access statistics
- Performance summaries

---

## 🎉 Success! You're Ready to Use PMI-DataHelp v2.0

The system is fully operational and ready for use. Start with Phase 1 to explore educational content, then access Phase 2 with appropriate credentials for executive dashboard functionality.

**Need Help?** Refer to the comprehensive documentation in the `/docs` folder or contact your system administrator.

**System Health**: All components validated and operational ✅
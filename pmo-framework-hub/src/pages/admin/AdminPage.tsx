import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  Settings, 
  Upload, 
  Download,
  RefreshCw,
  Users,
  Globe,
  Lock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

// Mock auth service - to be replaced with real Cognito integration
const mockAuthService = {
  isAuthenticated: false,
  user: null as any,
  login: async (username: string, password: string) => {
    // Mock login logic
    if (username === 'dbarrios' && password === 'tempPassword123!') {
      mockAuthService.isAuthenticated = true;
      mockAuthService.user = {
        username: 'dbarrios',
        email: 'dbarrios@morrisopazo.com',
        name: 'Daniel Barrios',
        groups: ['SITE_ADMIN'],
        needsPasswordChange: true
      };
      return { success: true, needsPasswordChange: true };
    }
    return { success: false, error: 'Invalid credentials' };
  },
  logout: () => {
    mockAuthService.isAuthenticated = false;
    mockAuthService.user = null;
  },
  changePassword: async (oldPassword: string, newPassword: string) => {
    // Mock password change
    if (mockAuthService.user) {
      mockAuthService.user.needsPasswordChange = false;
      return { success: true };
    }
    return { success: false, error: 'Not authenticated' };
  }
};

interface AdminStats {
  totalFiles: number;
  totalFrameworks: number;
  lastDeployment: string;
  systemStatus: 'healthy' | 'warning' | 'error';
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalFiles: 24,
    totalFrameworks: 3,
    lastDeployment: '2026-09-03 08:45:00 UTC',
    systemStatus: 'healthy'
  });

  const [recentActivity] = useState([
    { id: 1, action: 'File uploaded', resource: 'PMO-Governance-Guide.pdf', time: '10 minutes ago', status: 'success' },
    { id: 2, action: 'Framework updated', resource: 'Framework de Gestión Adaptativa', time: '2 hours ago', status: 'success' },
    { id: 3, action: 'Site deployed', resource: 'Production environment', time: '1 day ago', status: 'success' },
    { id: 4, action: 'User added', resource: 'dbarrios', time: '1 day ago', status: 'success' }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Gestión del PMO Framework Hub</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-700 font-medium">Sistema Operativo</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Frameworks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFrameworks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Deploy</p>
              <p className="text-sm font-bold text-gray-900">{stats.lastDeployment}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Security</p>
              <p className="text-2xl font-bold text-gray-900">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Upload className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-700">Upload File</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Settings className="w-6 h-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-700">Manage Frameworks</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Globe className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-700">Deploy Site</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <Users className="w-6 h-6 text-red-600 mb-2" />
              <span className="text-sm font-medium text-red-700">User Management</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(activity.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500 truncate">{activity.resource}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Environment Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Environment Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-green-900">Production</h3>
                <p className="text-sm text-green-700">https://prod-url-here.cloudfront.net</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Stage</h3>
                <p className="text-sm text-blue-700">https://stage-url-here.cloudfront.net</p>
              </div>
              <CheckCircle className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginForm: React.FC<{ onLogin: (username: string, password: string) => Promise<any> }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await onLogin(username, password);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">PMO Framework Hub Administration</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Secure access with AWS Cognito
          </p>
        </div>
      </div>
    </div>
  );
};

const PasswordChangeForm: React.FC<{ onPasswordChange: (oldPassword: string, newPassword: string) => Promise<any> }> = ({ onPasswordChange }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 12) {
      setError('Password must be at least 12 characters long');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await onPasswordChange(oldPassword, newPassword);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
          <p className="text-gray-600">You must change your temporary password</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter current password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter new password (min 12 chars)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminPage: React.FC = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: mockAuthService.isAuthenticated,
    user: mockAuthService.user,
    needsPasswordChange: false
  });

  useEffect(() => {
    // Check authentication status on mount
    setAuthState({
      isAuthenticated: mockAuthService.isAuthenticated,
      user: mockAuthService.user,
      needsPasswordChange: mockAuthService.user?.needsPasswordChange || false
    });
  }, []);

  const handleLogin = async (username: string, password: string) => {
    const result = await mockAuthService.login(username, password);
    if (result.success) {
      setAuthState({
        isAuthenticated: true,
        user: mockAuthService.user,
        needsPasswordChange: result.needsPasswordChange || false
      });
    }
    return result;
  };

  const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
    const result = await mockAuthService.changePassword(oldPassword, newPassword);
    if (result.success) {
      setAuthState(prev => ({
        ...prev,
        needsPasswordChange: false
      }));
    }
    return result;
  };

  const handleLogout = () => {
    mockAuthService.logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      needsPasswordChange: false
    });
  };

  if (!authState.isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (authState.needsPasswordChange) {
    return <PasswordChangeForm onPasswordChange={handlePasswordChange} />;
  }

  // Check if user has admin permissions
  if (!authState.user?.groups?.includes('SITE_ADMIN')) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin panel.</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">PMO Framework Hub Admin</h1>
              <p className="text-sm text-gray-500">Welcome back, {authState.user?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default AdminPage;
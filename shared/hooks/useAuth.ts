import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { AuthService } from '../utils/auth';
import { CognitoService } from '../utils/cognito';
import { User, AuthState } from '../types';

// Auth Context
export const AuthContext = createContext<{
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  loginWithCognito: (idToken: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (roles: string[]) => boolean;
  canAccessPhase: (phase: '1' | '2') => boolean;
} | null>(null);

// Custom hook for authentication
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth hook implementation
export const useAuthImplementation = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = AuthService.getStoredToken();
        const user = AuthService.getStoredUser();

        if (token && user && !AuthService.isTokenExpired(token)) {
          // Validate token with backend
          try {
            const validatedUser = await AuthService.validateToken(token);
            setAuthState({
              user: validatedUser,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            console.error('Token validation failed:', error);
            AuthService.clearAuth();
            setAuthState({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  // Login with email/password
  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { token, user } = await AuthService.login(email, password);
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  }, []);

  // Login with Cognito ID token
  const loginWithCognito = useCallback(async (idToken: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { token, user } = await AuthService.loginWithCognito(idToken);
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  }, []);

  // Login with Google OAuth
  const loginWithGoogle = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { token, user } = await CognitoService.signInWithGoogle();
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
      await CognitoService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const newToken = await AuthService.refreshToken();
      setAuthState(prev => ({
        ...prev,
        token: newToken,
      }));
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      throw error;
    }
  }, [logout]);

  // Check if user has specific permission
  const hasPermission = useCallback((resource: string, action: string): boolean => {
    if (!authState.user?.permissions) return false;
    
    return authState.user.permissions.some(permission => 
      permission.resource === resource && 
      permission.actions.includes(action as any)
    );
  }, [authState.user]);

  // Check if user has any of the specified roles
  const hasRole = useCallback((roles: string[]): boolean => {
    if (!authState.user?.role) return false;
    
    return roles.includes(authState.user.role);
  }, [authState.user]);

  // Check if user can access specific phase
  const canAccessPhase = useCallback((phase: '1' | '2'): boolean => {
    if (!authState.user) return phase === '1'; // Phase 1 is public
    
    // Phase 1 is accessible to everyone
    if (phase === '1') return true;
    
    // Phase 2 requires specific roles
    if (phase === '2') {
      return hasRole(['admin', 'pmo', 'executive']) || 
             hasPermission('phase2', 'read');
    }
    
    return false;
  }, [authState.user, hasRole, hasPermission]);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!authState.token || !authState.isAuthenticated) return;

    const checkTokenExpiration = () => {
      if (AuthService.isTokenExpired(authState.token!)) {
        refreshToken().catch(console.error);
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [authState.token, authState.isAuthenticated, refreshToken]);

  return {
    authState,
    login,
    loginWithCognito,
    loginWithGoogle,
    logout,
    refreshToken,
    hasPermission,
    hasRole,
    canAccessPhase,
  };
};
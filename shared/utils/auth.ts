import { User, Permission, UserRole } from '../types';

export class AuthService {
  private static readonly TOKEN_KEY = 'pmi_auth_token';
  private static readonly USER_KEY = 'pmi_auth_user';
  private static readonly REFRESH_KEY = 'pmi_refresh_token';

  /**
   * Login with username and password (simplified for AWS deployment)
   */
  static async login(username: string, password: string): Promise<{ token: string; user: User }> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simple authentication: admin user = dbarrios
      if (username.toLowerCase() === 'dbarrios') {
        const mockUser = this.createAdminUser();
        const token = this.generateMockToken(mockUser);

        // Store authentication data
        this.storeAuth(token, mockUser);

        return { token, user: mockUser };
      } else {
        // Regular users - simple validation
        const mockUser = this.createRegularUser(username);
        const token = this.generateMockToken(mockUser);

        this.storeAuth(token, mockUser);

        return { token, user: mockUser };
      }
    } catch (error) {
      throw new Error('Error de autenticación');
    }
  }

  /**
   * Create admin user (dbarrios)
   */
  private static createAdminUser(): User {
    return {
      id: 'admin-001',
      email: 'dbarrios@morris.com',
      name: 'Daniel Barrios',
      role: 'admin',
      permissions: [
        { resource: 'help', actions: ['read', 'write', 'delete', 'admin'] },
        { resource: 'pmo', actions: ['read', 'write', 'delete', 'admin'] },
        { resource: 'portfolio', actions: ['read', 'write', 'delete', 'admin'] },
        { resource: 'projects', actions: ['read', 'write', 'delete', 'admin'] },
        { resource: 'reports', actions: ['read', 'write', 'delete', 'admin'] },
        { resource: 'settings', actions: ['read', 'write', 'delete', 'admin'] }
      ],
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Create regular user
   */
  private static createRegularUser(username: string): User {
    return {
      id: Date.now().toString(),
      email: `${username}@morris.com`,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      role: 'user',
      permissions: [
        { resource: 'help', actions: ['read'] }
      ],
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Login with Cognito ID token (future implementation)
   */
  static async loginWithCognito(idToken: string): Promise<{ token: string; user: User }> {
    // For now, just redirect to regular login
    throw new Error('Cognito login not implemented yet');
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      // Clear stored authentication data
      this.clearAuth();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem(this.REFRESH_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Mock refresh - extend expiration
      const user = this.getStoredUser();
      if (user) {
        const newToken = this.generateMockToken(user);
        localStorage.setItem(this.TOKEN_KEY, newToken);
        return newToken;
      }

      throw new Error('No user data available');
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Validate token with backend
   */
  static async validateToken(token: string): Promise<User> {
    try {
      // Simple validation - decode token
      const payload = this.decodeToken(token);
      if (!payload || this.isTokenExpired(token)) {
        throw new Error('Token invalid or expired');
      }

      const user = this.getStoredUser();
      if (!user) {
        throw new Error('User data not found');
      }

      return user;
    } catch (error) {
      console.error('Token validation error:', error);
      throw error;
    }
  }

  /**
   * Generate mock JWT token
   */
  private static generateMockToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8), // 8 hours
    };

    return btoa(JSON.stringify(payload));
  }

  /**
   * Decode JWT token
   */
  private static decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token));
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Store authentication data
   */
  private static storeAuth(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.REFRESH_KEY, 'mock-refresh-token');
  }

  /**
   * Clear authentication data
   */
  static clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }

  /**
   * Get stored token
   */
  static getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored user
   */
  static getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get stored refresh token
   */
  static getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user && !this.isTokenExpired(token));
  }

  /**
   * Get current authenticated user
   */
  static getCurrentUser(): User | null {
    if (this.isAuthenticated()) {
      return this.getStoredUser();
    }
    return null;
  }
}
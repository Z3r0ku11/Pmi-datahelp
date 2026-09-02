import { User } from '../types';

// AWS Cognito configuration from environment variables
const COGNITO_CONFIG = {
  region: import.meta.env.VITE_COGNITO_REGION || 'us-east-1',
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  domain: import.meta.env.VITE_COGNITO_DOMAIN,
};

export class CognitoService {
  private static googleAuth: any = null;

  /**
   * Initialize Google Authentication
   */
  static async initializeGoogleAuth(): Promise<void> {
    if (this.googleAuth) return;

    try {
      // Load Google Identity Services
      await this.loadGoogleScript();
      
      this.googleAuth = (window as any).google?.accounts?.id;
      
      if (!this.googleAuth) {
        throw new Error('Google Identity Services not loaded');
      }

      // Initialize with configuration
      this.googleAuth.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: this.handleGoogleCredentialResponse,
        auto_select: false,
      });
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
      throw error;
    }
  }

  /**
   * Load Google Identity Services script
   */
  private static loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google?.accounts?.id) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google script'));
      document.head.appendChild(script);
    });
  }

  /**
   * Handle Google credential response
   */
  private static handleGoogleCredentialResponse = async (response: any) => {
    try {
      const credential = response.credential;
      const userInfo = this.parseJWT(credential);
      
      // Create user object from Google token
      const user: User = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        avatar: userInfo.picture,
        role: 'user', // Default role, will be updated by backend
        permissions: [],
        createdAt: new Date().toISOString(),
      };

      return { token: credential, user };
    } catch (error) {
      console.error('Google authentication error:', error);
      throw error;
    }
  };

  /**
   * Sign in with Google
   */
  static async signInWithGoogle(): Promise<{ token: string; user: User }> {
    await this.initializeGoogleAuth();

    return new Promise((resolve, reject) => {
      const handleCredential = async (response: any) => {
        try {
          const result = await this.handleGoogleCredentialResponse(response);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      // Temporarily override the callback
      const originalCallback = this.googleAuth.callback;
      this.googleAuth.callback = handleCredential;

      // Trigger Google sign-in
      this.googleAuth.prompt((notification: any) => {
        // Restore original callback
        this.googleAuth.callback = originalCallback;
        
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error('Google sign-in was cancelled or not displayed'));
        }
      });
    });
  }

  /**
   * Sign in with Cognito (email/password)
   */
  static async signInWithCognito(email: string, password: string): Promise<{ token: string; user: User }> {
    // This would integrate with AWS Cognito SDK
    // For now, returning mock data that matches the expected structure
    
    try {
      // In a real implementation, this would use AWS Amplify or Cognito SDK
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: email.includes('pmo') || email.includes('admin') ? 'pmo' : 'user',
        permissions: email.includes('pmo') || email.includes('admin') ? [
          { resource: 'phase1', actions: ['read', 'write'] },
          { resource: 'phase2', actions: ['read', 'write'] },
          { resource: 'portfolio', actions: ['read', 'write'] },
          { resource: 'projects', actions: ['read', 'write'] },
        ] : [
          { resource: 'phase1', actions: ['read'] },
        ],
        createdAt: new Date().toISOString(),
      };

      const mockToken = btoa(JSON.stringify({
        sub: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
      }));

      return { token: mockToken, user: mockUser };
    } catch (error) {
      console.error('Cognito authentication error:', error);
      throw error;
    }
  }

  /**
   * Sign out from Cognito
   */
  static async signOut(): Promise<void> {
    try {
      // In a real implementation, this would call Cognito sign out
      
      // Sign out from Google if initialized
      if (this.googleAuth && (window as any).google?.accounts?.id?.disableAutoSelect) {
        (window as any).google.accounts.id.disableAutoSelect();
      }
      
      console.log('Signed out from Cognito');
    } catch (error) {
      console.error('Cognito sign out error:', error);
      throw error;
    }
  }

  /**
   * Refresh Cognito token
   */
  static async refreshToken(refreshToken: string): Promise<string> {
    try {
      // In a real implementation, this would call Cognito refresh token
      
      // Mock refresh - extend expiration
      const mockToken = btoa(JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
        refreshed: true,
      }));

      return mockToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Get current user from Cognito
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      // In a real implementation, this would get user from Cognito session
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Parse JWT token (for Google tokens)
   */
  private static parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT parsing error:', error);
      throw error;
    }
  }

  /**
   * Validate configuration
   */
  static validateConfiguration(): boolean {
    const required = ['userPoolId', 'clientId'];
    const missing = required.filter(key => !COGNITO_CONFIG[key as keyof typeof COGNITO_CONFIG]);
    
    if (missing.length > 0) {
      console.warn('Missing Cognito configuration:', missing);
      return false;
    }
    
    return true;
  }

  /**
   * Get configuration
   */
  static getConfiguration() {
    return { ...COGNITO_CONFIG };
  }
}
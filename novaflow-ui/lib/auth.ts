// Google OAuth Authentication Service
import { jwtDecode } from 'jwt-decode';

export interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  permissions: Array<{
    page: string;
    pageName: string;
    permission: string;
  }>;
}

class AuthService {
  private readonly GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  private readonly BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Initialize Google Sign-In with proper ordering
  async initializeGoogleSignIn(): Promise<void> {
    // Return existing promise if already initializing
    if (this.initPromise) {
      return this.initPromise;
    }

    // Return immediately if already initialized
    if (this.isInitialized) {
      return Promise.resolve();
    }

    // Create and store the initialization promise
    this.initPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Google Sign-In can only be initialized in browser environment'));
        return;
      }

      // Validate environment variables with fail-fast errors
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId || clientId === 'your-google-client-id.googleusercontent.com') {
        reject(new Error('❌ Google Client ID not configured. Please:\n1. Copy .env.example to .env.local\n2. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID with your actual Google OAuth Client ID'));
        return;
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl || backendUrl === 'http://localhost:8080') {
        console.warn('⚠️ Using default backend URL. Consider setting NEXT_PUBLIC_BACKEND_URL in .env.local');
      }

      // Wait for Google Identity Services to load
      const checkGoogleLoaded = () => {
        if (window.google?.accounts?.id) {
          try {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: this.handleGoogleCallback.bind(this),
              auto_select: false,
              cancel_on_tap_outside: true,
            });
            this.isInitialized = true;
            this.initPromise = null;
            resolve();
          } catch (error) {
            reject(new Error(`Failed to initialize Google Sign-In: ${error}`));
          }
        } else {
          setTimeout(checkGoogleLoaded, 100);
        }
      };
      checkGoogleLoaded();
    });

    return this.initPromise;
  }

  // Handle Google OAuth callback with JWT validation
  private async handleGoogleCallback(response: any) {
    try {
      const credential = response.credential;
      if (!credential) {
        throw new Error('No credential received from Google');
      }

      // Validate JWT format
      if (!this.isValidJWT(credential)) {
        throw new Error('Invalid JWT token format received from Google');
      }

      // Store the Google JWT token with proper cookie flags
      this.setToken(credential);

      // Fetch user profile from backend
      await this.fetchUserProfile();

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  // Validate JWT format
  private isValidJWT(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }
      // Try to decode to ensure it's valid
      jwtDecode(token);
      return true;
    } catch {
      return false;
    }
  }

  // Sign in with Google using One Tap - enforces init → render/prompt order
  async signInWithGoogle(): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('Google Sign-In can only be used in browser environment');
    }

    // Ensure initialization is complete before proceeding
    await this.initializeGoogleSignIn();

    if (!window.google?.accounts?.id) {
      throw new Error('Google Identity Services not loaded after initialization');
    }

    // Trigger Google Sign-In prompt
    window.google.accounts.id.prompt();
  }

  // Explicit Google button render method
  async renderGoogleButton(element: HTMLElement, config?: any): Promise<void> {
    // Ensure initialization is complete before rendering
    await this.initializeGoogleSignIn();

    if (!window.google?.accounts?.id) {
      throw new Error('Google Identity Services not available after initialization');
    }

    const defaultConfig = {
      theme: 'outline',
      size: 'large',
      width: 300,
      text: 'signin_with',
      shape: 'rectangular',
    };

    window.google.accounts.id.renderButton(element, { ...defaultConfig, ...config });
  }

  // Single source backend URL configuration
  private getBackendUrl(): string {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.warn('⚠️ NEXT_PUBLIC_BACKEND_URL not set, using default http://localhost:8080');
      return 'http://localhost:8080';
    }
    return backendUrl;
  }

  // Fetch user profile from backend
  async fetchUserProfile(): Promise<GoogleUser> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const backendUrl = this.getBackendUrl();
    const response = await fetch(`${backendUrl}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`)
    }

    const userProfile = await response.json()
    localStorage.setItem('nf_user', JSON.stringify(userProfile))
    return userProfile
  }

  // Check if user has permission
  async checkPermission(permission: string, page: string): Promise<boolean> {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const backendUrl = this.getBackendUrl();
      const response = await fetch(`${backendUrl}/authorize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permissionName: permission,
          pagePath: page,
          domainId: null, // Can be extended for multi-tenant
        }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.allowed;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  // Get stored token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('nf_token') || this.getCookie('nf_token');
  }

  // Set token with proper cookie flags for dev/prod
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('nf_token', token);
    
    // Set cookie with environment-appropriate flags
    const isHttps = window.location.protocol === 'https:';
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    let cookieFlags = 'path=/; max-age=86400';
    
    if (isHttps) {
      cookieFlags += '; secure; samesite=strict';
    } else if (isLocalhost) {
      cookieFlags += '; samesite=lax';
    } else {
      cookieFlags += '; samesite=strict';
    }
    
    document.cookie = `nf_token=${token}; ${cookieFlags}`;
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('nf_user');
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp ? decoded.exp > currentTime : false;
    } catch (error) {
      return false;
    }
  }

  // Sign out
  signOut(): void {
    if (typeof window === 'undefined') return;
    
    // Clear local storage
    localStorage.removeItem('nf_token');
    localStorage.removeItem('nf_user');
    
    // Clear cookies
    document.cookie = 'nf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Sign out from Google
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    // Redirect to login
    window.location.href = '/login';
  }

  // Helper method to get cookie
  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }
}

// Global Google types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export const authService = AuthService.getInstance();

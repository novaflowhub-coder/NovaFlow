// Google OAuth Authentication Service
import { jwtDecode } from 'jwt-decode'
import { toast } from '@/hooks/use-toast';

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
    console.log('[AUTH DEBUG] initializeGoogleSignIn called, isInitialized:', this.isInitialized);
    
    // Return existing promise if already initializing
    if (this.initPromise) {
      console.log('[AUTH DEBUG] Returning existing init promise');
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
            console.log('[AUTH DEBUG] Initializing Google Sign-In with client ID:', clientId);
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: this.handleGoogleCallback.bind(this),
              auto_select: false,
              cancel_on_tap_outside: true,
            });
            this.isInitialized = true;
            this.initPromise = null;
            console.log('[AUTH DEBUG] Google Sign-In initialized successfully');
            resolve();
          } catch (error) {
            console.error('[AUTH DEBUG] Failed to initialize Google Sign-In:', error);
            reject(new Error(`Failed to initialize Google Sign-In: ${error}`));
          }
        } else {
          console.log('[AUTH DEBUG] Waiting for Google Identity Services to load...');
          setTimeout(checkGoogleLoaded, 100);
        }
      };
      checkGoogleLoaded();
    });

    return this.initPromise;
  }

  // Handle Google OAuth callback with JWT validation
  private async handleGoogleCallback(response: any) {
    console.log('[AUTH DEBUG] Starting Google OAuth callback handler');
    console.log('[AUTH DEBUG] Response received:', { hasCredential: !!response.credential });
    
    try {
      const credential = response.credential;
      if (!credential) {
        console.error('[AUTH DEBUG] No credential received from Google');
        throw new Error('No credential received from Google');
      }
      console.log('[AUTH DEBUG] Received Google credential, validating JWT...');

      // Validate JWT format
      if (!this.isValidJWT(credential)) {
        console.error('[AUTH DEBUG] Invalid JWT token format');
        throw new Error('Invalid JWT token format received from Google');
      }

      // Store the Google JWT token with proper cookie flags
      console.log('[AUTH DEBUG] Storing Google JWT token');
      this.setToken(credential);
      console.log('[AUTH DEBUG] Token stored, current auth state:', this.isAuthenticated());

      try {
        // Fetch user profile from backend
        console.log('[AUTH DEBUG] Fetching user profile from backend...');
        await this.fetchUserProfile();
        console.log('[AUTH DEBUG] User profile fetched successfully, redirecting to /dashboard');
        // Use client-side redirect for reliability
        window.location.href = '/dashboard';
      } catch (error) {
        console.error('[AUTH DEBUG] Error in fetchUserProfile:', error);
        throw error; // Re-throw to be caught by outer try-catch
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.log('[AUTH DEBUG] Error in callback handler:', errorMessage);
      
      if (errorMessage === 'UNAUTHORIZED_USER') {
        console.log('[AUTH DEBUG] Unauthorized user, clearing tokens and redirecting with unauthorized flag');
        this.clearTokensOnly();
        
        // Show access denied message and hold for 3 seconds before redirecting
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You are not authorized to access this system. Please contact your administrator.",
        });
        
        // Delay redirect to allow user to see the message
        setTimeout(() => {
          window.location.href = '/dashboard?unauthorized=true';
        }, 3000);
        return;
      } else {
        console.error('[AUTH DEBUG] Sign-in failed:', errorMessage);
        toast({
          variant: "destructive",
          title: "Sign-In Failed",
          description: "Unable to sign in with Google. Please try again.",
        });
        // Don't throw the error to prevent console error when user sees the toast
        return;
      }
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

    try {
      // Ensure initialization is complete before proceeding
      await this.initializeGoogleSignIn();

      if (!window.google?.accounts?.id) {
        throw new Error('Google Identity Services not loaded after initialization');
      }

      // Trigger Google Sign-In prompt
      window.google.accounts.id.prompt();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Google OAuth is not properly configured. Please contact your administrator.",
      });
      throw error;
    }
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
    console.log('[AUTH DEBUG] fetchUserProfile called');
    const token = this.getToken()
    console.log('[AUTH DEBUG] Current token:', token ? 'exists' : 'null');
    if (!token) {
      console.error('[AUTH DEBUG] No authentication token found in fetchUserProfile');
      throw new Error('No authentication token found')
    }

    const backendUrl = this.getBackendUrl();
    console.log('[AUTH DEBUG] Making request to:', `${backendUrl}/api/me`);
    
    const response = await fetch(`${backendUrl}/api/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('[AUTH DEBUG] Backend response status:', response.status);
    
    if (!response.ok) {
      // Handle 403 Forbidden (user not in database) - backend returns null body
      if (response.status === 403) {
        console.log('[AUTH DEBUG] User not authorized (403) - not in database');
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You are not authorized to access this system. Please contact your administrator.",
        });
        throw new Error('UNAUTHORIZED_USER');
      }
      
      // Handle other authentication/authorization errors with user-friendly messages
      if (response.status === 401) {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "Your session has expired or is invalid. Please sign in again.",
        });
      } else if (response.status === 0 || response.status >= 500) {
        toast({
          variant: "destructive",
          title: "Service Unavailable",
          description: "Unable to connect to the authentication service. Please try again later.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: `Unable to verify your access (${response.status}). Please try again.`,
        });
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
      const response = await fetch(`${backendUrl}/api/authorize`, {
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

  // Set token with environment-aware cookie flags
  private setToken(token: string): void {
    console.log('[AUTH DEBUG] setToken called');
    if (typeof window === 'undefined') return;
    
    // Store in localStorage as primary storage
    localStorage.setItem('nf_token', token);
    console.log('[AUTH DEBUG] Token stored in localStorage');
    
    // Also set as cookie with appropriate flags based on environment
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isHttps = window.location.protocol === 'https:';
    
    let cookieFlags = 'path=/; max-age=86400'; // 24 hours
    
    if (isHttps) {
      cookieFlags += '; secure; samesite=strict';
    } else if (isLocalhost) {
      cookieFlags += '; samesite=lax';
    } else {
      cookieFlags += '; samesite=strict';
    }
    
    document.cookie = `nf_token=${token}; ${cookieFlags}`;
    console.log('[AUTH DEBUG] Token stored in cookie with flags:', cookieFlags);
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
    console.log('[AUTH DEBUG] isAuthenticated check, token exists:', !!token);
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const isValid = decoded.exp ? decoded.exp > currentTime : false;
      console.log('[AUTH DEBUG] Token validation result:', isValid, 'expires:', decoded.exp, 'current:', currentTime);
      return isValid;
    } catch (error) {
      console.error('[AUTH DEBUG] Token validation error:', error);
      return false;
    }
  }

  // Clear tokens without redirecting (for unauthorized users)
  clearTokensOnly(): void {
    console.log('[AUTH DEBUG] Clearing tokens (clearTokensOnly)');
    if (typeof window === 'undefined') return;
    
    // Clear local storage
    localStorage.removeItem('nf_token');
    localStorage.removeItem('nf_user');
    console.log('[AUTH DEBUG] Cleared localStorage tokens');
    
    // Clear cookies
    document.cookie = 'nf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    console.log('[AUTH DEBUG] Cleared cookie tokens');
    
    // Sign out from Google
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
      console.log('[AUTH DEBUG] Disabled Google auto-select');
    }
  }

  // Server-side redirect method
  private async serverRedirect(destination: string, unauthorized: boolean = false): Promise<void> {
    console.log('[AUTH DEBUG] Server redirect to:', destination, 'unauthorized:', unauthorized);
    
    try {
      const response = await fetch('/api/auth/redirect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination, unauthorized }),
      });
      
      if (!response.ok) {
        console.error('[AUTH DEBUG] Server redirect failed, falling back to client redirect');
        // Fallback to client-side redirect
        if (unauthorized && destination === '/dashboard') {
          window.location.href = '/dashboard?unauthorized=true';
        } else {
          window.location.href = destination;
        }
      }
      // If successful, the browser will be redirected by the server response
    } catch (error) {
      console.error('[AUTH DEBUG] Server redirect error, falling back to client redirect:', error);
      // Fallback to client-side redirect
      if (unauthorized && destination === '/dashboard') {
        window.location.href = '/dashboard?unauthorized=true';
      } else {
        window.location.href = destination;
      }
    }
  }

  // Sign out
  signOut(): void {
    console.log('[AUTH DEBUG] Signing out');
    this.clearTokensOnly();
    
    // Redirect to login
    console.log('[AUTH DEBUG] Redirecting to /login');
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

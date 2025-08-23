import { authService } from './auth';

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  full_name?: string;
  department?: string;
  status: string;
  is_active: boolean;
  last_login?: string;
  created_by: string;
  created_date: string;
  updated_by?: string;
  updated_date?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  username?: string;
  full_name?: string;
  department?: string;
  status: string;
  is_active: boolean;
  created_by: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  username?: string;
  full_name?: string;
  department?: string;
  status: string;
  is_active: boolean;
  updated_by: string;
}

class UserApiService {
  private readonly BACKEND_URL: string;

  constructor() {
    this.BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
      } catch (parseError) {
        // If we can't parse the error, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return {} as T;
  }

  // User Management APIs
  async getAllUsers(): Promise<User[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/users`, {
      method: 'GET',
      headers,
    });
    return this.handleResponse<User[]>(response);
  }

  async getUserById(id: string): Promise<User> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/users/${id}`, {
      method: 'GET',
      headers,
    });
    return this.handleResponse<User>(response);
  }

  async getUserByEmail(email: string): Promise<User> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/users/email/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers,
    });
    return this.handleResponse<User>(response);
  }

  async searchUsers(term: string): Promise<User[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/users/search?term=${encodeURIComponent(term)}`, {
      method: 'GET',
      headers,
    });
    return this.handleResponse<User[]>(response);
  }

  async getActiveUsers(): Promise<User[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/users/active`, {
      method: 'GET',
      headers,
    });
    return this.handleResponse<User[]>(response);
  }

  async getUsersByDomain(domainId: string): Promise<User[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/users/domain/${domainId}`, {
      method: 'GET',
      headers,
    });
    return this.handleResponse<User[]>(response);
  }

  async createUser(user: CreateUserRequest): Promise<User> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify(user),
    });
    return this.handleResponse<User>(response);
  }

  async updateUser(id: string, user: UpdateUserRequest): Promise<User> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/users/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(user),
    });
    return this.handleResponse<User>(response);
  }

  async activateUser(id: string, updatedBy: string): Promise<User> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/users/${id}/activate?updatedBy=${encodeURIComponent(updatedBy)}`, {
      method: 'PUT',
      headers,
    });
    return this.handleResponse<User>(response);
  }

  async deactivateUser(id: string, updatedBy: string): Promise<User> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/users/${id}/deactivate?updatedBy=${encodeURIComponent(updatedBy)}`, {
      method: 'PUT',
      headers,
    });
    return this.handleResponse<User>(response);
  }

  async deleteUser(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers,
    });
    return this.handleResponse<void>(response);
  }

  // Permission check for user management
  async checkUserManagementPermissions(): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      
      const permissionChecks = [
        { permissionName: 'view', pagePath: '/user-management' },
        { permissionName: 'View', pagePath: '/user-management' },
        { permissionName: 'edit', pagePath: '/user-management' },
        { permissionName: 'Edit', pagePath: '/user-management' },
      ];
      
      for (const check of permissionChecks) {
        const response = await fetch(`${this.BACKEND_URL}/api/authorize`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            permissionName: check.permissionName,
            pagePath: check.pagePath,
            domainId: null,
          }),
        });
        
        if (response.ok) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

}

export const userApiService = new UserApiService();

import { authService } from './auth';

export interface Role {
  id: string;
  name: string;
  description?: string;
  domain_id: string;
  domain?: any;
  user_count?: number;
  permissions?: any;
  created_by: string;
  created_date: string;
  updated_by?: string;
  updated_date?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  domain_id: string;
  created_by: string;
}

export interface UpdateRoleRequest {
  name: string;
  description?: string;
  domain_id: string;
  updated_by: string;
}

class RolesApiService {
  private readonly BACKEND_URL: string;

  constructor() {
    this.BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async getRoles(search?: string): Promise<Role[]> {
    const url = search ? `${this.BACKEND_URL}/api/roles?search=${encodeURIComponent(search)}` : `${this.BACKEND_URL}/api/roles`;
    const headers = await this.getAuthHeaders();
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied. You may not have the required permissions for role management. Please contact your administrator.');
      }
      throw new Error(`Failed to fetch roles: ${response.statusText}`);
    }

    return response.json();
  }

  async getRoleById(id: string): Promise<Role> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/roles/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied. You may not have the required permissions for role management. Please contact your administrator.');
      }
      throw new Error(`Failed to fetch role: ${response.statusText}`);
    }

    return response.json();
  }

  async createRole(roleData: CreateRoleRequest): Promise<Role> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/roles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied. You may not have the required permissions for role management. Please contact your administrator.');
      }
      const errorText = await response.text();
      throw new Error(errorText || `Failed to create role: ${response.statusText}`);
    }

    return response.json();
  }

  async updateRole(id: string, roleData: UpdateRoleRequest): Promise<Role> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/roles/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied. You may not have the required permissions for role management. Please contact your administrator.');
      }
      const errorText = await response.text();
      throw new Error(errorText || `Failed to update role: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteRole(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/roles/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied. You may not have the required permissions for role management. Please contact your administrator.');
      }
      const errorText = await response.text();
      throw new Error(errorText || `Failed to delete role: ${response.statusText}`);
    }
  }
}

export const rolesApiService = new RolesApiService();

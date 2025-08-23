import { authService } from './auth';

export interface PermissionType {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_date: string;
  last_modified_by?: string;
  last_modified_date?: string;
}

export interface CreatePermissionTypeRequest {
  name: string;
  description?: string;
  created_by: string;
}

export interface UpdatePermissionTypeRequest {
  name: string;
  description?: string;
  last_modified_by: string;
}

class PermissionTypesApiService {
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

  async getPermissionTypes(search?: string): Promise<PermissionType[]> {
    const url = search ? `${this.BACKEND_URL}/api/permission-types?search=${encodeURIComponent(search)}` : `${this.BACKEND_URL}/api/permission-types`;
    const headers = await this.getAuthHeaders();
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch permission types: ${response.statusText}`);
    }

    return response.json();
  }

  async getPermissionTypeById(id: string): Promise<PermissionType> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/permission-types/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch permission type: ${response.statusText}`);
    }

    return response.json();
  }

  async createPermissionType(permissionTypeData: CreatePermissionTypeRequest): Promise<PermissionType> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/permission-types`, {
      method: 'POST',
      headers,
      body: JSON.stringify(permissionTypeData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to create permission type: ${response.statusText}`);
    }

    return response.json();
  }

  async updatePermissionType(id: string, permissionTypeData: UpdatePermissionTypeRequest): Promise<PermissionType> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/permission-types/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(permissionTypeData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to update permission type: ${response.statusText}`);
    }

    return response.json();
  }

  async deletePermissionType(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/permission-types/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to delete permission type: ${response.statusText}`);
    }
  }
}

export const permissionTypesApiService = new PermissionTypesApiService();

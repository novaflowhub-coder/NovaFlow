import { authService } from './auth';

export interface RolePagePermission {
  id?: string;
  pageId: string;
  roleName: string;
  permissionTypeId: string;
  isGranted?: boolean;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export interface GrantPermissionRequest {
  roleName: string;
  pageId: string;
  permissionTypeId: string;
  grantedBy: string;
}

export interface RevokePermissionRequest {
  roleName: string;
  pageId: string;
  permissionTypeId: string;
  revokedBy: string;
}

class RolePagePermissionsApiService {
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

  private getCurrentUser() {
    return authService.getCurrentUser();
  }

  async getAllRolePagePermissions(): Promise<RolePagePermission[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch role-page permissions: ${response.statusText}`);
    }

    return response.json();
  }

  async getRolePagePermissionById(id: string): Promise<RolePagePermission> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch role-page permission: ${response.statusText}`);
    }

    return response.json();
  }

  async getRolePagePermissions(pageId: string): Promise<RolePagePermission[]> {
    const allPermissions = await this.getAllRolePagePermissions();
    // Filter by pageId and only return granted permissions
    return allPermissions.filter(p => p.pageId === pageId && p.isGranted === true);
  }

  async getPermissionsByRoles(roleNames: string[]): Promise<RolePagePermission[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions/by-roles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(roleNames),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch permissions by roles: ${response.statusText}`);
    }

    return response.json();
  }

  async getSpecificPermission(roleName: string, pageId: string, permissionTypeId: string): Promise<RolePagePermission[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions/role/${encodeURIComponent(roleName)}/page/${pageId}/permission/${permissionTypeId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch specific permission: ${response.statusText}`);
    }

    return response.json();
  }

  async createRolePagePermission(permission: RolePagePermission): Promise<RolePagePermission> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(permission),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to create role-page permission: ${response.statusText}`);
    }

    return response.json();
  }

  async updateRolePagePermission(id: string, permission: RolePagePermission): Promise<RolePagePermission> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(permission),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to update role-page permission: ${response.statusText}`);
    }

    return response.json();
  }

  async grantPermission(request: GrantPermissionRequest): Promise<RolePagePermission> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions/grant`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to grant permission: ${response.statusText}`);
    }

    return response.json();
  }

  async revokePermission(request: RevokePermissionRequest): Promise<void> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions/revoke`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to revoke permission: ${response.statusText}`);
    }
  }

  async deleteRolePagePermission(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to delete role-page permission: ${response.statusText}`);
    }
  }

  async saveRolePagePermissions(pageId: string, permissions: RolePagePermission[]): Promise<void> {
    const currentUser = this.getCurrentUser();
    const currentUserEmail = currentUser?.email || 'system';

    // Get existing permissions for this page
    const existingPermissions = await this.getRolePagePermissions(pageId);
    
    // Create sets for comparison
    const newPermissionKeys = new Set(
      permissions.map(p => `${p.roleName}-${p.permissionTypeId}`)
    );
    const existingPermissionKeys = new Set(
      existingPermissions.map(p => `${p.roleName}-${p.permissionTypeId}`)
    );

    // Grant new permissions
    for (const permission of permissions) {
      const key = `${permission.roleName}-${permission.permissionTypeId}`;
      if (!existingPermissionKeys.has(key)) {
        await this.grantPermission({
          roleName: permission.roleName,
          pageId: pageId,
          permissionTypeId: permission.permissionTypeId,
          grantedBy: currentUserEmail
        });
      }
    }

    // Revoke removed permissions
    for (const existingPermission of existingPermissions) {
      const key = `${existingPermission.roleName}-${existingPermission.permissionTypeId}`;
      if (!newPermissionKeys.has(key)) {
        await this.revokePermission({
          roleName: existingPermission.roleName,
          pageId: pageId,
          permissionTypeId: existingPermission.permissionTypeId,
          revokedBy: currentUserEmail
        });
      }
    }
  }
}

export const rolePagePermissionsApiService = new RolePagePermissionsApiService();

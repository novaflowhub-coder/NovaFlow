import { RolePagePermission } from '@/lib/types';
import { authService } from './auth';

// Re-export the type so it can be imported from this module
export type { RolePagePermission };

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
  private BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

  private getCurrentUser() {
    return authService.getCurrentUser();
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

  async getAllRolePagePermissions(search?: string): Promise<RolePagePermission[]> {
    const url = search 
      ? `${this.BACKEND_URL}/api/role-page-permissions?search=${encodeURIComponent(search)}` 
      : `${this.BACKEND_URL}/api/role-page-permissions`;
    
    const headers = await this.getAuthHeaders();
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch role page permissions: ${response.statusText}`);
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
      throw new Error(`Failed to fetch role page permission: ${response.statusText}`);
    }

    return response.json();
  }

  async getPermissionsByRole(roleName: string): Promise<RolePagePermission[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions/role/${encodeURIComponent(roleName)}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch permissions by role: ${response.statusText}`);
    }

    return response.json();
  }

  async getGrantedPermissionsByRole(roleName: string): Promise<RolePagePermission[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions/role/${encodeURIComponent(roleName)}/granted`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch granted permissions by role: ${response.statusText}`);
    }

    return response.json();
  }

  async getPermissionsByPage(pageId: string): Promise<RolePagePermission[]> {
    const headers = await this.getAuthHeaders();
    const url = `${this.BACKEND_URL}/api/role-page-permissions/page/${pageId}`;
    console.log('Calling API:', url);
    console.log('Request headers:', headers);
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);
    console.log('Response URL:', response.url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Details:');
      console.error('- Status:', response.status);
      console.error('- Status Text:', response.statusText);
      console.error('- URL:', response.url);
      console.error('- Error Text:', errorText);
      console.error('- Response Headers:', [...response.headers.entries()]);
      
      throw new Error(errorText || `Failed to fetch permissions by page: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async createRolePagePermission(rolePagePermission: Partial<RolePagePermission>): Promise<RolePagePermission> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(rolePagePermission),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to create role page permission: ${response.statusText}`);
    }

    return response.json();
  }

  async createRolePagePermissionFromIds(
    roleName: string, 
    pageId: string, 
    permissionTypeId: string, 
    isGranted: boolean
  ): Promise<RolePagePermission> {
    const currentUser = this.getCurrentUser();
    const createdBy = currentUser?.email || 'system';

    const params = new URLSearchParams({
      roleName,
      pageId,
      permissionTypeId,
      isGranted: isGranted.toString(),
      createdBy
    });

    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions/create?${params}`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to create role page permission: ${response.statusText}`);
    }

    return response.json();
  }

  async updateRolePagePermission(id: string, rolePagePermission: Partial<RolePagePermission>): Promise<RolePagePermission> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(rolePagePermission),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to update role page permission: ${response.statusText}`);
    }

    return response.json();
  }

  async grantPermission(id: string): Promise<RolePagePermission> {
    const currentUser = this.getCurrentUser();
    const modifiedBy = currentUser?.email || 'system';

    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions/${id}/grant?modifiedBy=${encodeURIComponent(modifiedBy)}`, {
      method: 'PUT',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to grant permission: ${response.statusText}`);
    }

    return response.json();
  }

  async revokePermission(id: string): Promise<RolePagePermission> {
    const currentUser = this.getCurrentUser();
    const modifiedBy = currentUser?.email || 'system';

    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions/${id}/revoke?modifiedBy=${encodeURIComponent(modifiedBy)}`, {
      method: 'PUT',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to revoke permission: ${response.statusText}`);
    }

    return response.json();
  }

  async bulkUpdateRolePermissions(
    roleName: string, 
    pageIds: string[], 
    permissionTypeIds: string[], 
    isGranted: boolean
  ): Promise<void> {
    const currentUser = this.getCurrentUser();
    const modifiedBy = currentUser?.email || 'system';

    const params = new URLSearchParams({
      roleName,
      isGranted: isGranted.toString(),
      modifiedBy
    });

    // Add multiple pageIds and permissionTypeIds
    pageIds.forEach(pageId => params.append('pageIds', pageId));
    permissionTypeIds.forEach(permissionTypeId => params.append('permissionTypeIds', permissionTypeId));

    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/role-page-permissions/bulk-update?${params}`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to bulk update permissions: ${response.statusText}`);
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
      throw new Error(errorText || `Failed to delete role page permission: ${response.statusText}`);
    }
  }

  async saveRolePagePermissions(pageId: string, permissions: RolePagePermission[]): Promise<void> {
    const currentUser = this.getCurrentUser();
    const currentUserEmail = currentUser?.email || 'system';

    console.log('=== SAVE ROLE PAGE PERMISSIONS DEBUG ===');
    console.log('PageId:', pageId);
    console.log('New permissions (checked items):', permissions);

    // Get existing permissions for this page
    const existingPermissions = await this.getPermissionsByPage(pageId);
    console.log('Existing permissions:', existingPermissions);
    
    // Create sets for comparison - these are the permissions that should exist after save
    const desiredPermissionKeys = new Set(
      permissions.map(p => `${p.roleName}-${p.permissionTypeId}`)
    );
    const existingPermissionKeys = new Set(
      existingPermissions.map(p => `${p.roleName}-${p.permissionType?.id}`)
    );

    console.log('Desired permission keys (what should exist):', Array.from(desiredPermissionKeys));
    console.log('Existing permission keys (what currently exists):', Array.from(existingPermissionKeys));

    // Create permissions that are desired but don't exist yet
    for (const permission of permissions) {
      const key = `${permission.roleName}-${permission.permissionTypeId}`;
      if (!existingPermissionKeys.has(key) && permission.permissionTypeId) {
        console.log('Creating new permission:', key);
        await this.createRolePagePermissionFromIds(
          permission.roleName,
          pageId,
          permission.permissionTypeId,
          true
        );
      } else {
        console.log('Permission already exists, keeping:', key);
      }
    }

    // Delete permissions that exist but are not desired (unchecked in UI)
    for (const existingPermission of existingPermissions) {
      const key = `${existingPermission.roleName}-${existingPermission.permissionType?.id}`;
      if (!desiredPermissionKeys.has(key) && existingPermission.id) {
        console.log('Deleting unwanted permission:', key, 'ID:', existingPermission.id);
        await this.deleteRolePagePermission(existingPermission.id);
      } else {
        console.log('Permission is desired, keeping:', key);
      }
    }
    
    console.log('=== SAVE COMPLETE ===');
  }
}

export const rolePagePermissionsApiService = new RolePagePermissionsApiService();

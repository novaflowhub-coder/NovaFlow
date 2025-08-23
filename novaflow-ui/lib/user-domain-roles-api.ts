import { authService } from './auth';

export interface UserDomainRole {
  id: string;
  userId: string;
  roleId: string;
  isActive: boolean;
  assignedBy: string;
  assignedDate: string;
  // Populated fields from joins
  userName?: string;
  userEmail?: string;
  roleName?: string;
  roleDescription?: string;
  domainName?: string;
}

export interface CreateUserDomainRoleRequest {
  userId: string;
  roleId: string;
  assignedBy: string;
}

export interface UpdateUserDomainRoleRequest {
  isActive: boolean;
  assignedBy: string;
}

class UserDomainRolesApiService {
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

  async getAllUserDomainRoles(search?: string): Promise<UserDomainRole[]> {
    const url = search 
      ? `${this.BACKEND_URL}/api/user-domain-roles?search=${encodeURIComponent(search)}` 
      : `${this.BACKEND_URL}/api/user-domain-roles`;
    
    const headers = await this.getAuthHeaders();
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user domain roles: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserDomainRoleById(id: string): Promise<UserDomainRole> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/user-domain-roles/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user domain role: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserDomainRolesByUserId(userId: string): Promise<UserDomainRole[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/user-domain-roles/user/${userId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user domain roles: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserDomainRolesByRoleId(roleId: string): Promise<UserDomainRole[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/user-domain-roles/role/${roleId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user domain roles: ${response.statusText}`);
    }

    return response.json();
  }

  async createUserDomainRole(assignment: CreateUserDomainRoleRequest): Promise<UserDomainRole> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/user-domain-roles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(assignment),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to create user domain role: ${response.statusText}`);
    }

    return response.json();
  }

  async updateUserDomainRole(id: string, assignment: UpdateUserDomainRoleRequest): Promise<UserDomainRole> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/user-domain-roles/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(assignment),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to update user domain role: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteUserDomainRole(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/user-domain-roles/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to delete user domain role: ${response.statusText}`);
    }
  }

  async activateUserDomainRole(id: string): Promise<UserDomainRole> {
    const currentUser = this.getCurrentUser();
    const currentUserEmail = currentUser?.email || 'system';

    return this.updateUserDomainRole(id, {
      isActive: true,
      assignedBy: currentUserEmail
    });
  }

  async deactivateUserDomainRole(id: string): Promise<UserDomainRole> {
    const currentUser = this.getCurrentUser();
    const currentUserEmail = currentUser?.email || 'system';

    return this.updateUserDomainRole(id, {
      isActive: false,
      assignedBy: currentUserEmail
    });
  }

  async bulkAssignRolesToUser(userId: string, roleIds: string[]): Promise<UserDomainRole[]> {
    const currentUser = this.getCurrentUser();
    const currentUserEmail = currentUser?.email || 'system';

    const assignments = roleIds.map(roleId => ({
      userId,
      roleId,
      assignedBy: currentUserEmail
    }));

    const results: UserDomainRole[] = [];
    for (const assignment of assignments) {
      try {
        const result = await this.createUserDomainRole(assignment);
        results.push(result);
      } catch (error) {
        console.error(`Failed to assign role ${assignment.roleId} to user ${userId}:`, error);
        // Continue with other assignments even if one fails
      }
    }

    return results;
  }

  async replaceUserRoleAssignments(userId: string, roleIds: string[]): Promise<void> {
    // Get current assignments for user
    const currentAssignments = await this.getUserDomainRolesByUserId(userId);
    
    // Deactivate all current assignments
    for (const assignment of currentAssignments) {
      if (assignment.isActive) {
        await this.deactivateUserDomainRole(assignment.id);
      }
    }

    // Create new assignments
    if (roleIds.length > 0) {
      await this.bulkAssignRolesToUser(userId, roleIds);
    }
  }
}

export const userDomainRolesApiService = new UserDomainRolesApiService();

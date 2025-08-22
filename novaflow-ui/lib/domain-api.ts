// Domain Management API Service
import { authService } from './auth';

export interface Domain {
  id: string;
  name: string;
  description: string;
  code: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export interface CreateDomainRequest {
  name: string;
  description: string;
  code: string;
  isActive: boolean;
  createdBy: string;
}

export interface UpdateDomainRequest {
  name: string;
  description: string;
  code: string;
  isActive: boolean;
  createdBy: string;
  lastModifiedBy?: string;
}

class DomainApiService {
  private readonly BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  private authService = authService;

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - please log in again');
      }
      if (response.status === 403) {
        throw new Error('Access denied. You may not have the required permissions for domain management. Please contact your administrator to ensure you have the Administrator role assigned.');
      }
      if (response.status === 404) {
        throw new Error('Domain not found');
      }
      if (response.status === 400) {
        const errorText = await response.text();
        throw new Error(`Bad request: ${errorText}`);
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  // Get all domains
  async getAllDomains(): Promise<Domain[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/domains`, {
      method: 'GET',
      headers,
    });
    
    return this.handleResponse<Domain[]>(response);
  }

  // Get domain by ID
  async getDomainById(id: string): Promise<Domain> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/domains/${id}`, {
      method: 'GET',
      headers,
    });
    
    return this.handleResponse<Domain>(response);
  }

  // Get active domains only
  async getActiveDomains(): Promise<Domain[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/domains/active`, {
      method: 'GET',
      headers,
    });
    
    return this.handleResponse<Domain[]>(response);
  }

  // Search domains
  async searchDomains(searchTerm: string): Promise<Domain[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/domains/search?term=${encodeURIComponent(searchTerm)}`, {
      method: 'GET',
      headers,
    });
    
    return this.handleResponse<Domain[]>(response);
  }

  // Get active user count for a domain
  async getActiveUserCount(domainId: string): Promise<number> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/domains/${domainId}/user-count`, {
      method: 'GET',
      headers,
    });
    
    return this.handleResponse<number>(response);
  }

  // Create new domain
  async createDomain(domainData: CreateDomainRequest): Promise<Domain> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/domains`, {
      method: 'POST',
      headers,
      body: JSON.stringify(domainData),
    });
    
    return this.handleResponse<Domain>(response);
  }

  // Update existing domain
  async updateDomain(id: string, domainData: UpdateDomainRequest): Promise<Domain> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/domains/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(domainData),
    });
    
    return this.handleResponse<Domain>(response);
  }

  // Activate domain
  async activateDomain(id: string, modifiedBy: string): Promise<Domain> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/domains/${id}/activate?modifiedBy=${encodeURIComponent(modifiedBy)}`, {
      method: 'PUT',
      headers,
    });
    
    return this.handleResponse<Domain>(response);
  }

  // Deactivate domain
  async deactivateDomain(id: string, modifiedBy: string): Promise<Domain> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/domains/${id}/deactivate?modifiedBy=${encodeURIComponent(modifiedBy)}`, {
      method: 'PUT',
      headers,
    });
    
    return this.handleResponse<Domain>(response);
  }

  // Delete domain
  async deleteDomain(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/domains/${id}`, {
      method: 'DELETE',
      headers,
    });
    
    return this.handleResponse<void>(response);
  }

  // Check if user has domain management permissions
  async checkDomainPermissions(): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      
      // Try different permission combinations based on actual database values
      const permissionChecks = [
        { permissionName: 'edit', pagePath: '/domains' },
        { permissionName: 'Edit', pagePath: '/domains' },
        { permissionName: 'admin', pagePath: '/domains' },
        { permissionName: 'create', pagePath: '/domains' },
        { permissionName: 'Create', pagePath: '/domains' },
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
          const result = await response.json();
          if (result.allowed) {
            console.log(`Permission granted with ${check.permissionName} on ${check.pagePath}`);
            return true;
          }
        }
      }
      
      console.log('All permission checks failed');
      return false;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const domainApiService = new DomainApiService();

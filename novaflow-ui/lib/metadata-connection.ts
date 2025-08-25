// Base URL for metadata backend service
const METADATA_BASE_URL = process.env.NEXT_PUBLIC_METADATA_BACKEND_URL || 'http://localhost:8081';

export interface Connection {
  id: string;
  connection_key: string;
  domain_id: string;
  name: string;
  type_code: string;
  description?: string;
  parameters: string; // JSON string from backend
  status: 'ACTIVE' | 'INACTIVE';
  version_no: number;
  is_current: boolean;
  last_tested_date?: string;
  last_test_status?: 'SUCCESS' | 'FAILURE' | 'PENDING';
  last_test_error?: string;
  created_by: string;
  created_date: string;
  last_modified_by?: string;
  last_modified_date?: string;
}

export interface CreateConnectionRequest {
  domain_id: string;
  name: string;
  type_code: string;
  description?: string;
  parameters: Record<string, any>;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateConnectionRequest {
  connection_key: string;
  domain_id: string;
  name: string;
  type_code: string;
  description?: string;
  parameters: Record<string, any>;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface TestConnectionRequest {
  name: string;
  type_code: string;
  parameters: Record<string, any>;
}

export interface TestConnectionResponse {
  success: boolean;
  message: string;
  error?: string;
  tested_at: string;
}

export interface ConnectionHistory {
  version_no: number;
  name: string;
  type_code: string;
  description?: string;
  parameters: Record<string, any>;
  status: 'ACTIVE' | 'INACTIVE';
  created_by: string;
  created_date: string;
}

class MetadataConnectionService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('nf_token');
    
    const response = await fetch(`${METADATA_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Get current connections (only latest versions)
  async getConnections(domainId?: string): Promise<Connection[]> {
    const params = domainId ? `?domain_id=${domainId}` : '';
    return this.request<Connection[]>(`/api/connections${params}`);
  }

  // Create new connection
  async createConnection(request: CreateConnectionRequest): Promise<Connection> {
    return this.request<Connection>('/api/connections', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Update existing connection (creates new version)
  async updateConnection(id: string, request: UpdateConnectionRequest): Promise<Connection> {
    return this.request<Connection>(`/api/connections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  // Delete connection
  async deleteConnection(id: string): Promise<void> {
    return this.request<void>(`/api/connections/${id}`, {
      method: 'DELETE',
    });
  }

  // Test connection
  async testConnection(request: TestConnectionRequest): Promise<TestConnectionResponse> {
    return this.request<TestConnectionResponse>('/api/connections/test', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Get connection history (all versions)
  async getConnectionHistory(connectionKey: string): Promise<ConnectionHistory[]> {
    return this.request<ConnectionHistory[]>(`/api/connections/${connectionKey}/history`);
  }

  // Toggle connection status
  async toggleConnectionStatus(id: string): Promise<Connection> {
    return this.request<Connection>(`/api/connections/${id}/toggle-status`, {
      method: 'PATCH',
    });
  }
}

export const metadataConnectionService = new MetadataConnectionService();

import { authService } from './auth';

export interface Page {
  id: string;
  name: string;
  path: string;
  description?: string;
  created_by: string;
  created_date: string;
  last_modified_by?: string;
  last_modified_date?: string;
}

export interface CreatePageRequest {
  name: string;
  path: string;
  description?: string;
  created_by: string;
}

export interface UpdatePageRequest {
  name: string;
  path: string;
  description?: string;
  last_modified_by: string;
}

class PagesApiService {
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

  async getPages(search?: string): Promise<Page[]> {
    const url = search ? `${this.BACKEND_URL}/api/pages?search=${encodeURIComponent(search)}` : `${this.BACKEND_URL}/api/pages`;
    const headers = await this.getAuthHeaders();
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pages: ${response.statusText}`);
    }

    return response.json();
  }

  async getPageById(id: string): Promise<Page> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/pages/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    return response.json();
  }

  async createPage(pageData: CreatePageRequest): Promise<Page> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/pages`, {
      method: 'POST',
      headers,
      body: JSON.stringify(pageData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to create page: ${response.statusText}`);
    }

    return response.json();
  }

  async updatePage(id: string, pageData: UpdatePageRequest): Promise<Page> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/pages/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(pageData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to update page: ${response.statusText}`);
    }

    return response.json();
  }

  async deletePage(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.BACKEND_URL}/api/pages/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to delete page: ${response.statusText}`);
    }
  }
}

export const pagesApiService = new PagesApiService();

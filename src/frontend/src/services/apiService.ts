const API_BASE_URL = 'https://localhost:7181/api';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  // Add other contact properties as needed
}

export interface ReportData {
  id: string;
  title: string;
  data: any;
  // Add other report data properties as needed
}

class ApiService {
  private getAccessTokenSilently: () => Promise<string>;

  constructor(getAccessTokenSilently: () => Promise<string>) {
    this.getAccessTokenSilently = getAccessTokenSilently;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    try {
      const token = await this.getAccessTokenSilently();

      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to get access token');
    }
  }

  async getContacts(): Promise<Contact[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/Report/contacts`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token');
        } else if (response.status === 403) {
          throw new Error('Forbidden: Insufficient permissions to access contacts');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async getReportData(): Promise<ReportData[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/Report/data`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token');
        } else if (response.status === 403) {
          throw new Error('Forbidden: Insufficient permissions to access report data');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching report data:', error);
      throw error;
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/Report/contacts`, {
        method: 'HEAD', // Use HEAD to just validate without getting data
        headers,
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
}

// Factory function to create API service with Auth0 token function
export const createApiService = (getAccessTokenSilently: () => Promise<string>) => {
  return new ApiService(getAccessTokenSilently);
}; 
const API_BASE_URL = 'https://localhost:7181/api';

export interface Customer {
  id: string;
  cusId: string | null;
  name: string;
  nameFirst: string;
  nameMiddle: string;
  nameLast: string;
  nameNick: string | null;
  nameSpouse: string | null;
  addr1: string | null;
  addr2: string | null;
  city: string | null;
  county: string | null;
  state: string | null;
  post: string | null;
  country: string | null;
  billCusId: string;
  billAddr1: string | null;
  billAddr2: string | null;
  billCity: string | null;
  billCounty: string | null;
  billState: string | null;
  billPost: string | null;
  billCountry: string | null;
  phoneHome: string | null;
  phoneWork: string | null;
  phoneOther: string | null;
  phoneFax: string | null;
  contact: string | null;
  doNotCallPhoneHome: number;
  doNotCallPhoneWork: number;
  doNotCallPhoneOther: number;
  dateDoNotCall: string;
  emailHome: string | null;
  emailWork: string | null;
  emailOther: string | null;
  typ: string | null;
  trmId: string;
  shpId: string;
  ptTaxId: string;
  svTaxId: string;
  vhTaxId: string;
  empIdSpn: string;
  dateBirth: string;
  dateBirthSpouse: string;
  dsbTypId: string;
  memTypId: string;
  recTypId: string;
  ptSlsTypId: string;
  svSlsTypId: string;
  vhSlsTypId: string;
  flSlsTypId: string;
  priIdOride: string;
  priIdBase: string;
  allowSpecialPri: number;
  purReqd: number;
  purNbr: string | null;
  coreInvoiceReqd: number;
  inactive: number;
  empId: string;
  dateCreate: string;
  dateUpdate: string;
  dateInvoice: string;
  amtInvoice: number;
  datePayment: string;
  amtPayment: number;
  daysPaymentAvg: number;
  cutoffByCrLimit: number;
  cutoffByAged: number;
  cutoffAgedPeriod: number;
  amtCrLimit: number;
  amtCrLimitInvoice: number;
  statementReqd: number;
  dateStatement: string;
  allowFinanceChg: number;
  amtAged0: number;
  amtAged1to30: number;
  amtAged31to60: number;
  amtAged61to90: number;
  amtAgedOver90: number;
  amtBalOpen: number;
  amtBalAccount: number;
  notId: number;
  company: number;
  cusMisc1: string | null;
  cusMisc2: string | null;
  cusMisc3: string | null;
  cusMisc4: string | null;
  cusMisc5: string | null;
  ts: string;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CustomersResponse {
  items: Customer[];
  metadata: PaginationMetadata;
}

export interface ReportData {
  id: string;
  title: string;
  data: any;
  // Add other report data properties as needed
}

export interface EmployeeCallLog {
  id: string;
  direction: string;
  employeeName: string;
  callLength: string;
  toNumber: string;
  fromNumber: string;
  customerName: string;
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

  async getContacts(page: number = 0, limit: number = 50, skip?: number): Promise<CustomersResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(skip !== undefined && { skip: skip.toString() })
      });
      
      const response = await fetch(`${API_BASE_URL}/Customer/customers?${queryParams}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token');
        } else if (response.status === 403) {
          throw new Error('Forbidden: Insufficient permissions to access customers');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async getCustomerById(id: string): Promise<Customer> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/Customer/customer/${id}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token');
        } else if (response.status === 403) {
          throw new Error('Forbidden: Insufficient permissions to access customer details');
        } else if (response.status === 404) {
          throw new Error('Customer not found');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching customer by ID:', error);
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

  async getEmployeeCallLogs(): Promise<EmployeeCallLog[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/Report/calllogs`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token');
        } else if (response.status === 403) {
          throw new Error('Forbidden: Insufficient permissions to access employee call logs');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching employee call logs:', error);
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
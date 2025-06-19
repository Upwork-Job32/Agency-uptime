// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  // Authentication
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  PROFILE: `${API_BASE_URL}/api/auth/profile`,

  // Sites
  SITES: `${API_BASE_URL}/api/sites`,
  SITE_DETAILS: (id: string) => `${API_BASE_URL}/api/sites/${id}`,
  SITE_LOGS: (id: string) => `${API_BASE_URL}/api/sites/${id}/logs`,
  SITE_INCIDENTS: (id: string) => `${API_BASE_URL}/api/sites/${id}/incidents`,

  // Alerts
  ALERTS: `${API_BASE_URL}/api/alerts`,
  ALERT_SETTINGS: `${API_BASE_URL}/api/alerts/settings`,

  // Billing
  BILLING: `${API_BASE_URL}/api/billing/subscription`,
  CHECKOUT: `${API_BASE_URL}/api/billing/create-checkout-session`,

  // Reports
  REPORTS: `${API_BASE_URL}/api/reports`,

  // Status
  STATUS: (domain: string) => `${API_BASE_URL}/api/status/page/${domain}`,

  // Admin
  DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,

  // Health check
  HEALTH: `${API_BASE_URL}/health`,
};

// API Helper functions
export const apiClient = {
  get: async (url: string, token?: string) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    return response.json();
  },

  post: async (url: string, data?: any, token?: string) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return response.json();
  },

  put: async (url: string, data?: any, token?: string) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return response.json();
  },

  delete: async (url: string, token?: string) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    return response.json();
  },
};

export { API_BASE_URL };

export default API_ENDPOINTS;

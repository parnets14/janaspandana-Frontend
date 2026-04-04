// Secure API Client - Hides API calls from console
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Store tokens securely
const TOKEN_KEY = '_sat'; // Secure Access Token
const REFRESH_KEY = '_srt'; // Secure Refresh Token

class SecureApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.interceptors = [];
    
    // Disable console logs in production
    if (import.meta.env.PROD) {
      this.disableConsoleLogs();
    }
  }

  // Disable console logging for API calls
  disableConsoleLogs() {
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      // Silently make the request
      return originalFetch(...args).catch(err => {
        // Don't log errors to console in production
        throw err;
      });
    };
  }

  // Get stored token
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  // Get refresh token
  getRefreshToken() {
    try {
      return localStorage.getItem(REFRESH_KEY);
    } catch {
      return null;
    }
  }

  // Store tokens
  setTokens(accessToken, refreshToken) {
    try {
      if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
      if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    } catch (err) {
      // Silent fail
    }
  }

  // Clear tokens
  clearTokens() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
    } catch {
      // Silent fail
    }
  }

  // Make secure request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle token expiration
      if (response.status === 401) {
        const role = localStorage.getItem('userRole');
        const refreshed = await this.refreshAccessToken(role);
        if (refreshed) {
          return this.request(endpoint, options);
        } else {
          this.clearTokens();
          window.location.href = role === 'admin' ? '/admin-login' : '/';
          throw new Error('Session expired');
        }
      }

      // Handle forbidden — only redirect if not an admin page API call
      if (response.status === 403) {
        const role = localStorage.getItem('userRole');
        // Don't redirect admin — they may just lack permission for a specific resource
        if (role !== 'admin') {
          this.clearTokens();
          window.location.href = '/';
        }
        throw new Error(data.message || 'Access denied');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      // Don't expose error details in production
      if (import.meta.env.PROD) {
        throw new Error('Request failed');
      }
      throw error;
    }
  }

  // Refresh access token
  async refreshAccessToken(role) {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    const endpoint = role === 'admin' ? '/admin/refresh-token' : '/auth/refresh-token';

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.data.accessToken, refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // GET request
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  // POST request
  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // PATCH request
  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }
}

// Create singleton instance
const api = new SecureApiClient();

// Auth API methods
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  // Request OTP for login
  requestOTP: async (phone) => {
    const response = await api.post('/auth/request-otp', { phone });
    return response;
  },

  // Verify OTP and login
  verifyOTP: async (phone, otp) => {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    if (response.success && response.data) {
      api.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      api.clearTokens();
    }
  },

  // Get current user
  getMe: async () => {
    return await api.get('/auth/me');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!api.getToken();
  },

  // Get current token
  getToken: () => {
    return api.getToken();
  }
};

export default api;

// Department API methods
export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getAllAdmin: () => api.get('/departments/all'),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

// Complaint API methods
export const complaintAPI = {
  submit: (data) => api.post('/complaints', data),
  getMy: () => api.get('/complaints/my'),
  getOne: (id) => api.get(`/complaints/${id}`),
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/complaints${q ? '?' + q : ''}`);
  },
  updateStatus: (id, data) => api.patch(`/complaints/${id}/status`, data),
  deleteOne: (id) => api.delete(`/complaints/${id}`),
  reopen: (id, reason) => api.post(`/complaints/${id}/reopen`, { reason }),
  uploadPhotos: async (id, files) => {
    const token = api.getToken();
    const formData = new FormData();
    files.forEach(f => formData.append('photos', f));
    const res = await fetch(`${api.baseURL}/complaints/${id}/photos`, {
      method: 'POST',
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
  }
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Simple token store (still needed so login pages can save tokens for the backend)
const TOKEN_KEY = '_sat';
const REFRESH_KEY = '_srt';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  setTokens(accessToken, refreshToken) {
    if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  }

  clearTokens() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }

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

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

const api = new ApiClient();
export default api;

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  requestOTP: (phone) => api.post('/auth/request-otp', { phone }),
  verifyOTP: async (phone, otp) => {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    if (response.success && response.data) {
      api.clearTokens();
      api.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  },
  logout: () => { api.clearTokens(); },
  getMe: () => api.get('/auth/me'),
  isAuthenticated: () => true, // no gate on refresh
  getToken: () => api.getToken(),
};

// Department API
export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getAllAdmin: () => api.get('/departments/all'),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

// Complaint API
export const complaintAPI = {
  submit: (data) => api.post('/complaints', data),
  getMy: () => {
    // Pass userId from cached profile as fallback
    try {
      const cached = localStorage.getItem('_userProfile')
      const profile = cached ? JSON.parse(cached) : null
      const userId = profile?._id || profile?.id || null
      const query = userId ? `?userId=${userId}` : ''
      return api.get(`/complaints/my${query}`)
    } catch {
      return api.get('/complaints/my')
    }
  },
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
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
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

  setTokens(accessToken, refreshToken) {
    if (accessToken) localStorage.setItem('_at', accessToken);
    if (refreshToken) localStorage.setItem('_rt', refreshToken);
  }

  clearTokens() {
    localStorage.removeItem('_at');
    localStorage.removeItem('_rt');
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
    return response;
  },
  logout: () => { },
  getMe: () => api.get('/auth/me'),
  isAuthenticated: () => true,
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
const getUserId = () => {
  try {
    const profile = localStorage.getItem('_userProfile');
    return profile ? JSON.parse(profile)?._id : null;
  } catch { return null; }
};

export const complaintAPI = {
  submit: (data) => api.post('/complaints', data),
  getMy: () => {
    const userId = getUserId();
    return api.get(`/complaints/my${userId ? '?userId=' + userId : ''}`);
  },
  getOne: (id) => api.get(`/complaints/${id}`),
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/complaints${q ? '?' + q : ''}`);
  },
  updateStatus: (id, data) => api.patch(`/complaints/${id}/status`, data),
  deleteOne: (id) => api.delete(`/complaints/${id}`),
  reopen: (id, reason) => api.post(`/complaints/${id}/reopen`, { reason }),
  uploadPhotos: async (id, files, type = 'citizen') => {
    const formData = new FormData();
    files.forEach(f => formData.append('photos', f));
    const res = await fetch(`${api.baseURL}/complaints/${id}/photos?type=${type}`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },
};

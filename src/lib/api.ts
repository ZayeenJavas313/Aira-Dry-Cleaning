const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('aira_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.message || 'Terjadi kesalahan', res.status, data.errors);
  }
  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body) => request('/auth/change-password', { method: 'PUT', body: JSON.stringify(body) }),

  // Dashboard
  getDashboard: () => request('/dashboard'),

  // Customers
  getCustomers: (search) => request(`/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  createCustomer: (body) => request('/customers', { method: 'POST', body: JSON.stringify(body) }),
  updateCustomer: (id, body) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

  // Services
  getServices: () => request('/services'),
  createService: (body) => request('/services', { method: 'POST', body: JSON.stringify(body) }),
  updateService: (id, body) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteService: (id) => request(`/services/${id}`, { method: 'DELETE' }),

  // Transactions
  getTransactions: (params: Record<string, string | undefined> = {}) => {
    const cleaned = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));
    const qs = new URLSearchParams(cleaned).toString();
    return request(`/transactions${qs ? `?${qs}` : ''}`);
  },
  getTransaction: (id) => request(`/transactions/${id}`),
  createTransaction: (body) => request('/transactions', { method: 'POST', body: JSON.stringify(body) }),
  updateTransaction: (id, body) => request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  updateStatus: (id, status) => request(`/transactions/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  updatePayment: (id, body) => request(`/transactions/${id}/payment`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),

  // Users
  getUsers: () => request('/users'),
  createUser: (body) => request('/users', { method: 'POST', body: JSON.stringify(body) }),
  updateUser: (id, body) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  resetPassword: (id, password) => request(`/users/${id}/reset-password`, { method: 'PUT', body: JSON.stringify({ password }) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => request('/notifications'),
  getUnreadCount: () => request('/notifications/unread-count'),
  markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: () => request('/notifications/read-all', { method: 'PUT' }),

  // Reports
  getReportSummary: (period) => request(`/reports/summary?period=${period}`),
  exportPdf: (period) => `${API_BASE}/reports/export/pdf?period=${period}`,
  exportExcel: (period) => `${API_BASE}/reports/export/excel?period=${period}`,
  getReceipt: (id) => `${API_BASE}/reports/receipt/${id}`,

  async downloadFile(endpoint: string, filename: string) {
    const token = localStorage.getItem('aira_token');
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new ApiError('Gagal mengunduh file', res.status);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};

export { ApiError };

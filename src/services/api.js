import axios from 'axios';

// Use relative URL for development (will be handled by Vite proxy)
// and absolute URL for production
const API_URL = import.meta.env.DEV ? '/api' : 'https://credoxbackend.onrender.com/api';

console.log("Using API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // This helps with cookies/authentication across domains
});

// Auth services
export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('API login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('API register error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }
};

// User services
export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  }
};

// Transaction services
export const transactionService = {
  getUserTransactions: async (userId) => {
    const response = await api.get(`/transactions/user/${userId}`);
    return response.data;
  },
  
  createTransaction: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },
  
  getPendingTransactions: async () => {
    const response = await api.get('/pending-transactions');
    return response.data;
  },
  
  createPendingTransaction: async (transactionData) => {
    const response = await api.post('/pending-transactions', transactionData);
    return response.data;
  },
  
  approveTransaction: async (id) => {
    const response = await api.put(`/pending-transactions/${id}/approve`);
    return response.data;
  },
  
  rejectTransaction: async (id) => {
    const response = await api.put(`/pending-transactions/${id}/reject`);
    return response.data;
  }
};

// KYC services
export const kycService = {
  getPendingKYC: async () => {
    const response = await api.get('/pending-kyc');
    return response.data;
  },
  
  createKYCRequest: async (kycData) => {
    const response = await api.post('/pending-kyc', kycData);
    return response.data;
  },
  
  approveKYC: async (id) => {
    const response = await api.put(`/pending-kyc/${id}/approve`);
    return response.data;
  },
  
  rejectKYC: async (id) => {
    const response = await api.put(`/pending-kyc/${id}/reject`);
    return response.data;
  }
};

export default {
  authService,
  userService,
  transactionService,
  kycService
};
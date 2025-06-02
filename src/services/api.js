import axios from 'axios';

// Always use the deployed backend URL
const API_URL = 'https://credoxbackend.onrender.com/api';

console.log("Using API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
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
// API Service to connect with the Kredix Java Backend
// The base URL is handled by Vite Proxy in vite.config.js (/api -> http://localhost:8080)

const BASE_URL = '/api';

const getAuthHeaders = (customHeaders = {}) => {
  const token = localStorage.getItem('@Kredix:token');
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API GET request failed:', error);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API POST request failed:', error);
      throw error;
    }
  },
  
  // Add put, delete as needed for transaction operations
};

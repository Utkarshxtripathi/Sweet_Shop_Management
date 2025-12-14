/**
 * API Service Layer
 * Centralized Axios configuration and API endpoint definitions
 * Follows Single Responsibility Principle - handles all HTTP communication
 */

import axios from 'axios';
import { getToken, removeToken, isTokenExpired } from '../utils/token';

// Create axios instance with base configuration
const api = axios.create({
  baseURL:"https://sweet-shop-management-backend-ynwu.onrender.com",
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - adds JWT token to all requests
 * Automatically handles token attachment and expiry detection
 */
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    // Check if token is expired before making request.
    // NOTE (AI-generated boilerplate): centralized token expiry check to prevent sending expired tokens.
    if (token && isTokenExpired(token)) {
      removeToken();
      // Notify AuthContext so the UI can react immediately.
      window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'expired' } }));
      return Promise.reject(new Error('Token expired'));
    }

    // Attach token to Authorization header if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handles common error cases
 * Auto-logout on 401 Unauthorized responses
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid or expired - remove it
      removeToken();
      // Dispatch custom event for AuthContext to handle
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================

/**
 * Register a new user
 * @param {object} userData - { name, email, password }
 * @returns {Promise} Axios response with user data and token
 */
export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

/**
 * Login user and receive JWT token
 * @param {object} credentials - { email, password }
 * @returns {Promise} Axios response with user data and token
 */
export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

// ==================== SWEETS API ====================

/**
 * Get all sweets
 * @param {object} params - Optional query parameters (search, category, minPrice, maxPrice)
 * @returns {Promise} Axios response with sweets array
 */
export const getSweets = async (params = {}) => {
  const response = await api.get('/api/sweets', { params });
  return response.data;
};

/**
 * Search sweets by name, category, or price range
 * @param {object} searchParams - { name, category, minPrice, maxPrice }
 * @returns {Promise} Axios response with filtered sweets array
 */
export const searchSweets = async (searchParams) => {
  const response = await api.get('/api/sweets/search', { params: searchParams });
  return response.data;
};

/**
 * Get single sweet by ID
 * @param {string} id - Sweet ID
 * @returns {Promise} Axios response with sweet data
 */
export const getSweetById = async (id) => {
  const response = await api.get(`/api/sweets/${id}`);
  return response.data;
};

/**
 * Create a new sweet (Admin only)
 * @param {object} sweetData - { name, category, price, quantity, description }
 * @returns {Promise} Axios response with created sweet
 */
export const createSweet = async (sweetData) => {
  const response = await api.post('/api/sweets', sweetData);
  return response.data;
};

/**
 * Update existing sweet (Admin only)
 * @param {string} id - Sweet ID
 * @param {object} sweetData - Updated sweet data
 * @returns {Promise} Axios response with updated sweet
 */
export const updateSweet = async (id, sweetData) => {
  const response = await api.put(`/api/sweets/${id}`, sweetData);
  return response.data;
};

/**
 * Delete sweet (Admin only)
 * @param {string} id - Sweet ID
 * @returns {Promise} Axios response
 */
export const deleteSweet = async (id) => {
  const response = await api.delete(`/api/sweets/${id}`);
  return response.data;
};

// ==================== INVENTORY API ====================

/**
 * Purchase a sweet (decreases quantity)
 * @param {string} id - Sweet ID
 * @param {number} quantity - Quantity to purchase
 * @returns {Promise} Axios response with updated sweet
 */
export const purchaseSweet = async (id, quantity = 1) => {
  const response = await api.post(`/api/sweets/${id}/purchase`, { quantity });
  return response.data;
};

/**
 * Restock a sweet (Admin only)
 * @param {string} id - Sweet ID
 * @param {number} quantity - Quantity to add
 * @returns {Promise} Axios response with updated sweet
 */
export const restockSweet = async (id, quantity) => {
  const response = await api.post(`/api/sweets/${id}/restock`, { quantity });
  return response.data;
};

export default api;


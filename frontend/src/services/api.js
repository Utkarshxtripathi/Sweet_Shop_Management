import axios from "axios";
import { getToken, removeToken, isTokenExpired } from "../utils/token";
const api = axios.create({
  baseURL: "https://sweet-shop-management-backend-ynwu.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && isTokenExpired(token)) {
      removeToken();
      window.dispatchEvent(
        new CustomEvent("auth:logout", { detail: { reason: "expired" } })
      );
      return Promise.reject(new Error("Token expired"));
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================

export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/api/auth/login", credentials);
  return response.data;
};

// ==================== SWEETS API ====================

export const getSweets = async (params = {}) => {
  const response = await api.get("/api/sweets", { params });
  return response.data;
};

export const searchSweets = async (searchParams) => {
  const response = await api.get("/api/sweets/search", {
    params: searchParams,
  });
  return response.data;
};

export const getSweetById = async (id) => {
  const response = await api.get(`/api/sweets/${id}`);
  return response.data;
};

export const createSweet = async (sweetData) => {
  const response = await api.post("/api/sweets", sweetData);
  return response.data;
};

export const updateSweet = async (id, sweetData) => {
  const response = await api.put(`/api/sweets/${id}`, sweetData);
  return response.data;
};

export const deleteSweet = async (id) => {
  const response = await api.delete(`/api/sweets/${id}`);
  return response.data;
};

// ==================== INVENTORY API ====================

export const purchaseSweet = async (id, quantity = 1) => {
  const response = await api.post(`/api/sweets/${id}/purchase`, { quantity });
  return response.data;
};

export const restockSweet = async (id, quantity) => {
  const response = await api.post(`/api/sweets/${id}/restock`, { quantity });
  return response.data;
};

export default api;

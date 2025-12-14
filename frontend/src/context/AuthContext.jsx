/**
 * Authentication Context
 * Manages global authentication state using React Context API
 * Handles login, logout, token management, and role-based access
 */

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  decodeToken,
  getToken,
  getUserRole,
  isTokenExpired,
  removeToken,
  setToken,
} from '../utils/token';
import { loginUser as apiLogin, registerUser as apiRegister } from '../services/api';

const AuthContext = createContext(null);

/**
 * AuthProvider component
 * Wraps the application and provides authentication state and methods
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // NOTE (AI-generated boilerplate): keep a single auto-logout timer based on JWT exp.
  const logoutTimerRef = useRef(null);

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  /**
   * Initialize auth state from localStorage on mount
   * Validates token and sets user state if valid
   */
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getToken();

      if (storedToken && !isTokenExpired(storedToken)) {
        const decoded = decodeToken(storedToken);
        setTokenState(storedToken);
        setUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
        });
        setIsAuthenticated(true);
      } else {
        // Token expired or invalid - remove it
        if (storedToken) {
          removeToken();
        }
        setTokenState(null);
        setUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    initializeAuth();

    // Listen for logout events from API interceptors and token-expiry timer
    const handleLogout = () => {
      logout();
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Register a new user
   * @param {object} userData - { name, email, password }
   * @returns {Promise} Resolves with user data on success
   */
  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      const { token: newToken, user: newUser } = response;
      
      // Store token and update state
      setToken(newToken);
      setTokenState(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  /**
   * Login user with email and password
   * @param {object} credentials - { email, password }
   * @returns {Promise} Resolves with user data on success
   */
  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      const { token: newToken, user: newUser } = response;
      
      // Store token and update state
      setToken(newToken);
      setTokenState(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  /**
   * Logout user - clears token and user state
   */
  const logout = () => {
    clearLogoutTimer();
    removeToken();
    setTokenState(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Auto-logout on token expiry
   * Schedules a single timer based on JWT exp.
   */
  useEffect(() => {
    clearLogoutTimer();

    if (!token) return;

    const decoded = decodeToken(token);
    const expMs = decoded?.exp ? decoded.exp * 1000 : 0;

    if (!expMs) {
      // Invalid token shape
      window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'invalid-token' } }));
      return;
    }

    // setTimeout uses a 32-bit signed integer for delay in many environments (~24.8 days).
    // To support long-lived tokens (e.g. 30d), we schedule in chunks.
    const MAX_TIMEOUT_MS = 2147483647;

    const tick = () => {
      const msUntilExpiry = expMs - Date.now();

      if (msUntilExpiry <= 0) {
        window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'expired' } }));
        return;
      }

      logoutTimerRef.current = setTimeout(tick, Math.min(msUntilExpiry, MAX_TIMEOUT_MS));
    };

    tick();

    return clearLogoutTimer;
  }, [token]);

  /**
   * Check if current user is admin
   * @returns {boolean} True if user has admin role
   */
  const isAdmin = () => {
    return user?.role === 'admin' || getUserRole(token) === 'admin';
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access auth context
 * @returns {object} Auth context value
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  decodeToken,
  getToken,
  getUserRole,
  isTokenExpired,
  removeToken,
  setToken,
} from "../utils/token";
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
} from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const logoutTimerRef = useRef(null);

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };
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
    const handleLogout = () => {
      logout();
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);
  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      const { token: newToken, user: newUser } = response;
      setToken(newToken);
      setTokenState(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, user: newUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };
  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      const { token: newToken, user: newUser } = response;
      setToken(newToken);
      setTokenState(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, user: newUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };
  const logout = () => {
    clearLogoutTimer();
    removeToken();
    setTokenState(null);
    setUser(null);
    setIsAuthenticated(false);
  };
  useEffect(() => {
    clearLogoutTimer();
    if (!token) return;
    const decoded = decodeToken(token);
    const expMs = decoded?.exp ? decoded.exp * 1000 : 0;
    if (!expMs) {
      window.dispatchEvent(
        new CustomEvent("auth:logout", { detail: { reason: "invalid-token" } })
      );
      return;
    }
    const MAX_TIMEOUT_MS = 2147483647;
    const tick = () => {
      const msUntilExpiry = expMs - Date.now();
      if (msUntilExpiry <= 0) {
        window.dispatchEvent(
          new CustomEvent("auth:logout", { detail: { reason: "expired" } })
        );
        return;
      }
      logoutTimerRef.current = setTimeout(
        tick,
        Math.min(msUntilExpiry, MAX_TIMEOUT_MS)
      );
    };
    tick();
    return clearLogoutTimer;
  }, [token]);
  const isAdmin = () => {
    return user?.role === "admin" || getUserRole(token) === "admin";
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
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

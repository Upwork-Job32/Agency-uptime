"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  logo_url?: string;
  brand_color?: string;
  custom_domain?: string;
  subscription_status?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  apiCall: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Add token validation function
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  // Add token refresh function
  const refreshUserProfile = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.agency;
      }
      return null;
    } catch (error) {
      console.error("Profile refresh error:", error);
      return null;
    }
  };

  useEffect(() => {
    // Check for stored authentication data on mount
    const checkStoredAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        // Validate the stored token
        const isValidToken = await validateToken(storedToken);

        if (isValidToken) {
          // Token is valid, refresh user profile to get latest data
          const freshUserData = await refreshUserProfile(storedToken);

          if (freshUserData) {
            setToken(storedToken);
            setUser(freshUserData);
            localStorage.setItem("user", JSON.stringify(freshUserData));
          } else {
            // Failed to refresh profile, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } else {
          // Token is invalid/expired, clear storage
          console.log(
            "Stored token is invalid or expired, clearing authentication"
          );
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    checkStoredAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.agency);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.agency));
        return true;
      } else {
        throw new Error(data.error || data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.agency);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.agency));
        return true;
      } else {
        throw new Error(data.error || data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  // Helper function for API calls with automatic logout on auth failure
  const apiCall = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    // Auto-logout on authentication errors
    if (response.status === 401 || response.status === 403) {
      console.log("Authentication failed, logging out...");
      logout();
    }

    return response;
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
    apiCall, // Export the helper function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

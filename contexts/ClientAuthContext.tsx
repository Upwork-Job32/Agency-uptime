"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ClientUser {
  id: number;
  client_name: string;
  client_email: string;
  agency_id: number;
  monthly_price: number;
  payment_status: string;
  is_active: boolean;
  activated_at?: string;
}

interface ClientAuthContextType {
  client: ClientUser | null;
  isAuthenticated: boolean;
  isPaid: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(
  undefined
);

export function ClientAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client, setClient] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!client;
  const isPaid = client?.payment_status === "active" && client?.is_active;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("clientToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE_URL}/api/client-auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setClient(userData.client);
      } else {
        localStorage.removeItem("clientToken");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("clientToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE_URL}/api/client-auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("clientToken", data.token);
        setClient(data.client);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("clientToken");
    setClient(null);
  };

  return (
    <ClientAuthContext.Provider
      value={{
        client,
        isAuthenticated,
        isPaid,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider");
  }
  return context;
}

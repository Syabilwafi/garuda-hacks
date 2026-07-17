"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginClient, loginTherapist, signupClient, signupTherapist, AuthResponse } from "@/api/authApi";

export type UserRole = "CLIENT" | "THERAPIST" | null;

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phoneNumber?: string;
  dateOfBirth?: string;
  specialization?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: "CLIENT" | "THERAPIST") => Promise<void>;
  signup: (data: any, role: "CLIENT" | "THERAPIST") => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = "presspoint_auth_token";
const USER_STORAGE_KEY = "presspoint_user";

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + "=";
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

const setCookie = (name: string, value: string, days: number = 7): void => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
};

const removeCookie = (name: string): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = getCookie(TOKEN_STORAGE_KEY);
    const storedUser = getCookie(USER_STORAGE_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to restore auth from cookies:", err);
        removeCookie(TOKEN_STORAGE_KEY);
        removeCookie(USER_STORAGE_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  const handleAuthSuccess = useCallback((response: AuthResponse) => {
    const userData: User = {
      id: response.user.id,
      email: response.user.email,
      fullName: response.user.fullName,
      role: response.user.role,
      phoneNumber: response.user.phoneNumber,
      dateOfBirth: response.user.dateOfBirth,
      specialization: response.user.specialization,
    };

    setUser(userData);
    setToken(response.token);
    setError(null);

    setCookie(TOKEN_STORAGE_KEY, response.token);
    setCookie(USER_STORAGE_KEY, JSON.stringify(userData));
  }, []);

  const login = useCallback(
    async (email: string, password: string, role: "CLIENT" | "THERAPIST") => {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          role === "CLIENT"
            ? await loginClient({ email, password })
            : await loginTherapist({ email, password });

        handleAuthSuccess(response);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Login gagal";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const signup = useCallback(
    async (data: any, role: "CLIENT" | "THERAPIST") => {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          role === "CLIENT"
            ? await signupClient(data)
            : await signupTherapist(data);

        handleAuthSuccess(response);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Pendaftaran gagal";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    removeCookie(TOKEN_STORAGE_KEY);
    removeCookie(USER_STORAGE_KEY);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth harus digunakan dalam AuthProvider");
  }
  return context;
}

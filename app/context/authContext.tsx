"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiClient } from "@/lib/api/client";
import type { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from "@/lib/api/types";

const STORAGE_TOKEN_KEY = "finance_tracker_token";
const STORAGE_USER_KEY = "finance_tracker_user";

type AuthContextValue = {
  token: string | null;
  user: UserResponse | null;
  isHydrated: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  loginWithGoogle: () => void;
  registerWithGoogle: () => void;
  logout: () => void;
  clearAuthError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function persistSession(auth: AuthResponse) {
  localStorage.setItem(STORAGE_TOKEN_KEY, auth.token);
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(auth.user));
}

function clearPersistedSession() {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
      const storedUser = localStorage.getItem(STORAGE_USER_KEY);
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser) as UserResponse);
      }
    } catch {
      clearPersistedSession();
      setToken(null);
      setUser(null);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const logout = useCallback(() => {
    clearPersistedSession();
    setToken(null);
    setUser(null);
    setAuthError(null);
  }, []);

  const applyAuthResponse = useCallback((auth: AuthResponse) => {
    persistSession(auth);
    setToken(auth.token);
    setUser(auth.user);
    setAuthError(null);
  }, []);

  const login = useCallback(
    async (payload: LoginRequest) => {
      try {
        const auth = await apiClient.login(payload);
        applyAuthResponse(auth);
      } catch (error) {
        const message =
          typeof error === "object" && error && "message" in error
            ? String((error as { message: string }).message)
            : "Unable to login. Please try again.";
        setAuthError(message);
        throw error;
      }
    },
    [applyAuthResponse],
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      try {
        const auth = await apiClient.register(payload);
        applyAuthResponse(auth);
      } catch (error) {
        const message =
          typeof error === "object" && error && "message" in error
            ? String((error as { message: string }).message)
            : "Unable to register. Please try again.";
        setAuthError(message);
        throw error;
      }
    },
    [applyAuthResponse],
  );

  const loginWithGoogle = useCallback(() => {
    setAuthError(null);
    window.location.assign(apiClient.getGoogleAuthUrl("login"));
  }, []);

  const registerWithGoogle = useCallback(() => {
    setAuthError(null);
    window.location.assign(apiClient.getGoogleAuthUrl("register"));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isHydrated,
      isAuthenticated: Boolean(token),
      authError,
      login,
      register,
      loginWithGoogle,
      registerWithGoogle,
      logout,
      clearAuthError,
    }),
    [
      token,
      user,
      isHydrated,
      authError,
      login,
      register,
      loginWithGoogle,
      registerWithGoogle,
      logout,
      clearAuthError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}

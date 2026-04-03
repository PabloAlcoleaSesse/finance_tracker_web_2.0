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
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from "@/lib/api/types";

const STORAGE_TOKEN_KEY = "finance_tracker_token";
const STORAGE_USER_KEY = "finance_tracker_user";

// Google Sign-In global type
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            use_fedcm_for_prompt?: boolean;
            callback: (response: CredentialResponse) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?:
                | "signin_with"
                | "signup_with"
                | "signin"
                | "signup"
                | "continue_with";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: number | string;
            },
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface CredentialResponse {
  credential: string;
  clientId?: string;
  select_by?: string;
}

type AuthContextValue = {
  token: string | null;
  user: UserResponse | null;
  isHydrated: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerWithGoogle: () => Promise<void>;
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

let isGoogleInitialized = false;

function initializeGoogleSignIn(onSuccess: (idToken: string) => void): void {
  if (!window.google) {
    throw new Error("Google Sign-In SDK not loaded");
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      "Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable",
    );
  }

  if (!isGoogleInitialized) {
    window.google.accounts.id.initialize({
      client_id: clientId,
      use_fedcm_for_prompt: false, // Bypasses FedCM requirement for local development
      callback: (response: CredentialResponse) => {
        if (response.credential) {
          onSuccess(response.credential);
        }
      },
    });
    isGoogleInitialized = true;
  }
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

  const handleGoogleAuth = useCallback(async () => {
    setAuthError(null);
    try {
      if (!window.google) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (!window.google) throw new Error("Google SDK failed to load");
      }

      initializeGoogleSignIn(async (idToken: string) => {
        try {
          const auth = await apiClient.googleAuth(idToken);
          applyAuthResponse(auth);
        } catch (error) {
          const message =
            typeof error === "object" && error && "message" in error
              ? String((error as { message: string }).message)
              : "Google Sign-In failed. Please try again.";
          setAuthError(message);
        }
      });

      // Show the Google One Tap UI prompt
      // (This will pop up the standard Google slide-in instead of a redirect)
      window.google.accounts.id.prompt();
    } catch (error) {
      setAuthError("Unable to initialize Google Sign-In.");
    }
  }, [applyAuthResponse]);

  const loginWithGoogle = handleGoogleAuth;
  const registerWithGoogle = handleGoogleAuth;

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

import React, { createContext, useContext, useMemo, useState } from "react";
import { clearToken, getToken, saveToken, type StorageMode } from "./authStorage";

interface AuthState {
  token: string | null;
}

interface AuthContextValue extends AuthState {
  setAuthToken: (token: string, mode: StorageMode) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getToken());

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      setAuthToken: (t, mode) => {
        saveToken(t, mode);
        setToken(t);
      },
      logout: () => {
        clearToken();
        setToken(null);
      },
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

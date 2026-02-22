"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { refreshToken } from "@/services/auth.service";
import { attachAuthInterceptor } from "@/lib/axios";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await refreshToken();
        setAccessToken(data.accessToken);
        attachAuthInterceptor(() => data.accessToken);
      } catch {
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
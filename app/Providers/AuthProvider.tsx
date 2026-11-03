"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError, api } from "@/lib/api";
import { SESSION_COOKIE } from "@/lib/constants";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  /** true until the first /users/me check has finished */
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  /** Re-fetches the profile (also call it after verify-email / profile edits). */
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get<User>("users/me");
      setUser(data);
      return data;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    // Only ask the backend when the proxy has set the (non-secret) session flag.
    if (!document.cookie.split("; ").includes(`${SESSION_COOKIE}=1`)) {
      setLoading(false);
      return;
    }
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      await api.post("auth/login", { email, password }); // proxy stores the token in a cookie
      queryClient.clear(); // never show the previous account's cached data
      const me = await refreshUser();
      if (!me) throw new ApiError(500, "Logged in, but your profile could not be loaded");
      return me;
    },
    [refreshUser, queryClient],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("auth/logout");
    } catch {
      /* the proxy clears the cookies either way when the token is no longer valid */
    }
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(() => ({ user, loading, login, logout, refreshUser }), [user, loading, login, logout, refreshUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

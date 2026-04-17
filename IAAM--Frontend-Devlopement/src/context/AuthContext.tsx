'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  FirstName?: string;
  LastName?: string;
  Phone?: string;
  Biography?: Array<{
    type: string;
    children: Array<{
      type: string;
      text: string;
    }>;
  }>;
  ProfileImage?: {
    id: number;
    name: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: Record<string, unknown>;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
  } | string;
}

interface AuthContextValue {
  user: AuthUser | null;
  jwt: string | null;
  login: (user: AuthUser, jwt: string) => void;
  logout: () => void;
  updateUser: (updated: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  jwt: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);

  /* Restore session from localStorage on mount */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('iaam_user');
      const storedJwt = localStorage.getItem('iaam_jwt');
      if (storedUser && storedJwt) {
        setUser(JSON.parse(storedUser));
        setJwt(storedJwt);
      }
    } catch {
      // ignore malformed data
    }
  }, []);

  const login = useCallback((authUser: AuthUser, authJwt: string) => {
    setUser(authUser);
    setJwt(authJwt);
    try {
      localStorage.setItem('iaam_user', JSON.stringify(authUser));
      localStorage.setItem('iaam_jwt', authJwt);
    } catch {}
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setJwt(null);
    try {
      localStorage.removeItem('iaam_user');
      localStorage.removeItem('iaam_jwt');
    } catch {}
  }, []);

  const updateUser = useCallback((updated: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('iaam_user', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, jwt, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
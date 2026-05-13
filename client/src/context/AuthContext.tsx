// client/src/context/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  admin:    Admin | null;
  status:   AuthStatus;
  login:    (admin: Admin) => void;
  logout:   () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin,  setAdmin]  = useState<Admin | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // On mount: verify existing session cookie with backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setAdmin(data.admin);
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch {
        // Network error — treat as unauthenticated, don't crash
        setStatus('unauthenticated');
      }
    })();
  }, []);

  // Called immediately after successful login (from AdminLoginModal)
  const login = useCallback((adminData: Admin) => {
    setAdmin(adminData);
    setStatus('authenticated');
  }, []);

  // Clears cookie via backend, then resets local state
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Best-effort — clear local state regardless
    }
    setAdmin(null);
    setStatus('unauthenticated');
  }, []);

  return (
    <AuthContext.Provider value={{ admin, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
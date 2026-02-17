import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMe();
      setAuthState(data ?? null);
    } catch {
      setAuthState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const setAuth = useCallback((data) => {
    setAuthState(data ?? null);
  }, []);

  const logout = useCallback(async () => {
    try {
      const { logout: logoutApi } = await import('../api/auth');
      await logoutApi();
    } finally {
      setAuthState(null);
    }
  }, []);

  const value = {
    user: auth?.user ?? null,
    tenantId: auth?.tenantId ?? null,
    tenantCode: auth?.tenantCode ?? null,
    onboardingStep: auth?.onboardingStep ?? 1,
    isTenantActive: auth?.isTenantActive ?? false,
    schoolName: auth?.schoolName ?? null,
    selectedInstitutionTypes: auth?.selectedInstitutionTypes ?? [],
    isAuthenticated: !!auth?.user,
    isLoading: loading,
    setAuth,
    checkAuth,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

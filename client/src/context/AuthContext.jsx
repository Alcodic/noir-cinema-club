import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('noir_token');
    if (!token) {
      setReady(true);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('noir_token'))
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      async login(email, password) {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('noir_token', data.token);
        setUser(data.user);
      },
      async register(name, email, password) {
        const { data } = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('noir_token', data.token);
        setUser(data.user);
      },
      logout() {
        localStorage.removeItem('noir_token');
        setUser(null);
      },
    }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

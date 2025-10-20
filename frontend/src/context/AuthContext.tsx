import { createContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  gender?: 'male' | 'female' | 'other' | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, gender?: 'male' | 'female' | 'other' | null) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);



  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);
      const data = res.data;
      if (data?.user) {
        // accept gender if provided by API; fallback to null
        type UserFromApi = { id: string; name: string; email: string; gender?: 'male' | 'female' | 'other' | null };
        const u = data.user as UserFromApi;
        const userObj = { id: u.id, name: u.name, email: u.email, gender: u.gender ?? null };
        setUser(userObj);
        // persist immediately so other code can read it synchronously
        try { localStorage.setItem('auth_user', JSON.stringify(userObj)); } catch (err) { console.debug('Auth: failed to persist auth_user', err); }
        if (data.token) localStorage.setItem('auth_token', data.token);
        console.debug('Auth: login succeeded, user set', userObj);
      } else {
        // fallback mock
        const userObj = { id: '1', name: 'Demo User', email, gender: null };
        setUser(userObj);
        try { localStorage.setItem('auth_user', JSON.stringify(userObj)); } catch (err) { console.debug('Auth: failed to persist auth_user', err); }
        localStorage.setItem('auth_token', 'mock-token');
        console.debug('Auth: login fallback user set', userObj);
      }
    } catch {
      // fallback behavior
      const userObj = { id: '1', name: 'Demo User', email, gender: null };
      setUser(userObj);
      try { localStorage.setItem('auth_user', JSON.stringify(userObj)); } catch (err) { console.debug('Auth: failed to persist auth_user', err); }
      localStorage.setItem('auth_token', 'mock-token');
      console.debug('Auth: login catch fallback user set', userObj);
    }
  };

  const signup = async (name: string, email: string, password: string, gender?: 'male' | 'female' | 'other' | null) => {
    try {
      const res = await authApi.signup(name, email, password);
      const data = res.data;
      if (data?.user) {
        type UserFromApi = { id: string; name: string; email: string; gender?: 'male' | 'female' | 'other' | null };
        const u = data.user as UserFromApi;
        const userObj = { id: u.id, name: u.name, email: u.email, gender: u.gender ?? gender ?? null };
        setUser(userObj);
        try { localStorage.setItem('auth_user', JSON.stringify(userObj)); } catch (err) { console.debug('Auth: failed to persist auth_user', err); }
        if (data.token) localStorage.setItem('auth_token', data.token);
        console.debug('Auth: signup succeeded, user set', userObj);
      } else {
        const userObj = { id: '1', name, email, gender: gender ?? null };
        setUser(userObj);
        try { localStorage.setItem('auth_user', JSON.stringify(userObj)); } catch (err) { console.debug('Auth: failed to persist auth_user', err); }
        localStorage.setItem('auth_token', 'mock-token');
        console.debug('Auth: signup fallback user set', userObj);
      }
    } catch {
      const userObj = { id: '1', name, email, gender: gender ?? null };
      setUser(userObj);
      try { localStorage.setItem('auth_user', JSON.stringify(userObj)); } catch (err) { console.debug('Auth: failed to persist auth_user', err); }
      localStorage.setItem('auth_token', 'mock-token');
      console.debug('Auth: signup catch fallback user set', userObj);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Note: hook `useAuth` is provided from a separate module `context/useAuth.ts`

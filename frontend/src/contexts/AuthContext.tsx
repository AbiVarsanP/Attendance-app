import React, { createContext, useState, useContext } from 'react';
import { setAuthToken } from '../services/api';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

  // Ensure axios has the token synchronously (avoid race when components mount)
  setAuthToken(token);

  // Also keep axios header updated when token changes
  React.useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = (tok: string, userRole: string) => {
    setToken(tok); setRole(userRole);
    localStorage.setItem('token', tok);
    localStorage.setItem('role', userRole);
    setAuthToken(tok);
  };

  const logout = () => {
    setToken(null); setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthToken(null);
  };

  return <AuthContext.Provider value={{ token, role, login, logout }}>{children}</AuthContext.Provider>
};

export const useAuth = () => useContext(AuthContext);

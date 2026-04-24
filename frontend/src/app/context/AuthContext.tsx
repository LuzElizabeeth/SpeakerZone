import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types/conference.types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('speakerzone_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const saveSession = (nextUser: User, token: string) => {
    setUser(nextUser);
    localStorage.setItem('speakerzone_user', JSON.stringify(nextUser));
    localStorage.setItem('speakerzone_token', token);
  };

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    saveSession(response.user, response.token);
  };

  const register = async (name: string, email: string, password: string, role: UserRole = 'attendee') => {
    const response = await api.register(name, email, password, role);
    saveSession(response.user, response.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('speakerzone_user');
    localStorage.removeItem('speakerzone_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: user !== null }}>
      {children}
    </AuthContext.Provider>
  );
};
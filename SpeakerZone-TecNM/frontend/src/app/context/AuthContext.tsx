import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types/conference.types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Cargar usuario del localStorage si existe
    const savedUser = localStorage.getItem('speakerzone_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string, role: UserRole = 'attendee') => {
    // Simulación de login (en producción sería una llamada a API/Supabase)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Determinar el rol basado en el email para demo
    let userRole: UserRole = role;
    if (email.includes('admin')) {
      userRole = 'admin';
    } else if (email.includes('speaker')) {
      userRole = 'speaker';
    }

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userRole === 'admin' ? 'Admin Demo' : userRole === 'speaker' ? 'Speaker Demo' : 'Usuario Demo',
      email: email,
      role: userRole,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      organization: userRole === 'speaker' ? 'Tech Innovations Lab' : undefined,
      bio: userRole === 'speaker' ? 'Experto en tecnología con más de 10 años de experiencia' : undefined
    };

    setUser(mockUser);
    localStorage.setItem('speakerzone_user', JSON.stringify(mockUser));
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulación de registro
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      role: 'attendee',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    };

    setUser(mockUser);
    localStorage.setItem('speakerzone_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('speakerzone_user');
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
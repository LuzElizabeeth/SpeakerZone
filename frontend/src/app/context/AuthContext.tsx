import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { User, UserRole } from '../types/conference.types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: UserRole
  ) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('speakerzone_user');
        const savedToken = localStorage.getItem('speakerzone_token');

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error al restaurar sesión:', error);

        localStorage.removeItem('speakerzone_user');
        localStorage.removeItem('speakerzone_token');
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const saveSession = (nextUser: User, token: string) => {
    setUser(nextUser);
    localStorage.setItem(
      'speakerzone_user',
      JSON.stringify(nextUser)
    );
    localStorage.setItem('speakerzone_token', token);
  };

  const login = async (
    email: string,
    password: string
  ): Promise<User> => {
    const response = await api.login(email, password);
    saveSession(response.user, response.token);
    return response.user;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = 'attendee'
  ): Promise<User> => {
    const response = await api.register(
      name,
      email,
      password,
      role
    );

    saveSession(response.user, response.token);
    return response.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('speakerzone_user');
    localStorage.removeItem('speakerzone_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

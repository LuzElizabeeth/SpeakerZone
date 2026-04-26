import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { User, UserRole } from '../types/conference.types';
import { api, AUTH_TOKEN_KEY } from '../services/api';

const AUTH_USER_KEY = 'speakerzone_user';

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    rememberSession?: boolean
  ) => Promise<User>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: UserRole,
    rememberSession?: boolean
  ) => Promise<User>;
  logout: () => void;
  refreshSession: () => Promise<User | null>;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

type AuthStorageType = 'local' | 'session';

interface StoredSession {
  user: User;
  token: string;
  storageType: AuthStorageType;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔒 Parse seguro del usuario guardado
const safeParseUser = (value: string | null): User | null => {
  if (!value || value === 'undefined') return null;

  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
};

// 🔍 Detectar sesión guardada en localStorage o sessionStorage
const getStoredSession = (): StoredSession | null => {
  const localToken = localStorage.getItem(AUTH_TOKEN_KEY);
  const localUser = safeParseUser(localStorage.getItem(AUTH_USER_KEY));

  if (localToken && localUser) {
    return {
      token: localToken,
      user: localUser,
      storageType: 'local',
    };
  }

  const sessionToken = sessionStorage.getItem(AUTH_TOKEN_KEY);
  const sessionUser = safeParseUser(sessionStorage.getItem(AUTH_USER_KEY));

  if (sessionToken && sessionUser) {
    return {
      token: sessionToken,
      user: sessionUser,
      storageType: 'session',
    };
  }

  return null;
};

// 🧹 Limpiar sesión de ambos almacenamientos
const clearStoredSession = () => {
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
};

// 💾 Guardar sesión según si se quiere recordar o no
const saveStoredSession = (
  nextUser: User,
  token: string,
  rememberSession: boolean
) => {
  const targetStorage = rememberSession ? localStorage : sessionStorage;
  const secondaryStorage = rememberSession ? sessionStorage : localStorage;

  secondaryStorage.removeItem(AUTH_USER_KEY);
  secondaryStorage.removeItem(AUTH_TOKEN_KEY);

  targetStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
  targetStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// 🚀 Provider principal de autenticación
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialSession = getStoredSession();

  const [user, setUser] = useState<User | null>(initialSession?.user || null);
  const [isInitializing, setIsInitializing] = useState(true);

  const saveSession = useCallback(
    (nextUser: User, token: string, rememberSession = true) => {
      setUser(nextUser);
      saveStoredSession(nextUser, token, rememberSession);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    clearStoredSession();
  }, []);

  const refreshSession = useCallback(async (): Promise<User | null> => {
    const storedSession = getStoredSession();

    if (!storedSession) {
      setUser(null);
      clearStoredSession();
      return null;
    }

    try {
      const currentUser = await api.getCurrentUser();

      saveSession(
        currentUser,
        storedSession.token,
        storedSession.storageType === 'local'
      );

      return currentUser;
    } catch {
      setUser(null);
      clearStoredSession();
      return null;
    }
  }, [saveSession]);

  useEffect(() => {
    let isMounted = true;

    const validateStoredSession = async () => {
      await refreshSession();

      if (isMounted) {
        setIsInitializing(false);
      }
    };

    validateStoredSession();

    return () => {
      isMounted = false;
    };
  }, [refreshSession]);

  const login = async (
    email: string,
    password: string,
    rememberSession = true
  ): Promise<User> => {
    const response = await api.login(email.trim().toLowerCase(), password);

    saveSession(response.user, response.token, rememberSession);

    return response.user;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = 'attendee',
    rememberSession = true
  ): Promise<User> => {
    const response = await api.register(
      name.trim(),
      email.trim().toLowerCase(),
      password,
      role
    );

    saveSession(response.user, response.token, rememberSession);

    return response.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        refreshSession,
        isAuthenticated: user !== null,
        isInitializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
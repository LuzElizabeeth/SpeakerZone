import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  User,
  CalendarCheck,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/conference.types';

interface LoginLocationState {
  from?: string;
}

const getHomePathByRole = (role?: UserRole) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'speaker':
      return '/speaker/dashboard';
    case 'attendee':
      return '/attendee/dashboard';
    default:
      return '/';
  }
};

const canAccessPathByRole = (role: UserRole, path?: string) => {
  if (!path) return false;

  if (path.startsWith('/admin')) return role === 'admin';
  if (path.startsWith('/speaker')) return role === 'speaker';
  if (path.startsWith('/attendee')) return role === 'attendee';

  return true;
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, register, user, isAuthenticated, isInitializing } = useAuth();

  const state = location.state as LoginLocationState | null;
  const fromPath = state?.from;

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (!isInitializing && isAuthenticated && user) {
      const targetPath = canAccessPathByRole(user.role, fromPath)
        ? fromPath
        : getHomePathByRole(user.role);

      navigate(targetPath || getHomePathByRole(user.role), { replace: true });
    }
  }, [fromPath, isAuthenticated, isInitializing, navigate, user]);

  const redirectAfterAuth = (role: UserRole) => {
    const targetPath = canAccessPathByRole(role, fromPath)
      ? fromPath
      : getHomePathByRole(role);

    navigate(targetPath || getHomePathByRole(role), { replace: true });
  };

  const resetFormState = (nextIsLogin: boolean) => {
    setIsLogin(nextIsLogin);
    setShowPassword(false);
    setRememberSession(true);
    setFormData({
      name: '',
      email: '',
      password: '',
    });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setFormData((prev) => ({
      ...prev,
      name: value,
    }));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setFormData((prev) => ({
      ...prev,
      email: value,
    }));
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setFormData((prev) => ({
      ...prev,
      password: value,
    }));
  };

  const validateForm = () => {
    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      toast.error('Correo y contraseña son obligatorios.');
      return false;
    }

    if (!isLogin && formData.name.trim().length < 3) {
      toast.error('El nombre debe tener al menos 3 caracteres.');
      return false;
    }

    if (!isLogin && password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const authenticatedUser = await login(
          formData.email.trim().toLowerCase(),
          formData.password,
          rememberSession
        );

        toast.success(`Bienvenido, ${authenticatedUser.name}.`);
        redirectAfterAuth(authenticatedUser.role);
      } else {
        const registeredUser = await register(
          formData.name.trim(),
          formData.email.trim().toLowerCase(),
          formData.password,
          'attendee',
          rememberSession
        );

        toast.success('Cuenta creada correctamente.');
        redirectAfterAuth(registeredUser.role);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo completar la solicitud.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-10 h-10 border-4 border-blue-light border-t-blue-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Validando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end rounded-lg flex items-center justify-center">
              <LogIn className="w-7 h-7 text-white" />
            </div>

            <span className="text-2xl text-gray-900">SpeakerZone</span>
          </Link>

          <h1 className="text-3xl mb-2 text-gray-900">
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </h1>

          <p className="text-gray-600 mb-6">
            {isLogin
              ? 'Accede con tu correo y contraseña para continuar.'
              : 'Crea una cuenta para reservar conferencias y consultar tus accesos.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm text-gray-700 mb-2"
                >
                  Nombre completo
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all"
                    placeholder="Tu nombre completo"
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-700 mb-2"
              >
                Correo electrónico
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleEmailChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all"
                  placeholder="tu@email.com"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-gray-700 mb-2"
              >
                Contraseña
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  title={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(event) =>
                    setRememberSession(event.target.checked)
                  }
                  className="w-4 h-4 text-blue-accent border-gray-300 rounded focus:ring-blue-accent"
                />

                <span className="text-sm text-gray-600">
                  Mantener sesión en este navegador
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading
                ? isLogin
                  ? 'Iniciando sesión...'
                  : 'Creando cuenta...'
                : isLogin
                  ? 'Iniciar sesión'
                  : 'Crear cuenta'}

              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}

            <button
              type="button"
              onClick={() => resetFormState(!isLogin)}
              className="text-blue-accent hover:text-blue-hover transition-colors"
            >
              {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-gradient-start to-blue-gradient-end p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-md text-white">
          <h2 className="text-4xl mb-6">
            Gestiona tu experiencia en SpeakerZone
          </h2>

          <p className="text-xl text-white/90 mb-8">
            Accede a conferencias, consulta tus reservaciones y conserva tus
            códigos de acceso en un solo lugar.
          </p>

          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 flex items-start gap-4">
              <CalendarCheck className="w-6 h-6 mt-1" />

              <div>
                <h3 className="text-lg">Reserva conferencias</h3>
                <p className="text-white/80 text-sm">
                  Explora las sesiones disponibles y aparta tu lugar de forma
                  sencilla.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 flex items-start gap-4">
              <QrCode className="w-6 h-6 mt-1" />

              <div>
                <h3 className="text-lg">Consulta tu acceso</h3>
                <p className="text-white/80 text-sm">
                  Visualiza el código de acceso asociado a tus reservaciones.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 mt-1" />

              <div>
                <h3 className="text-lg">Sesión segura</h3>
                <p className="text-white/80 text-sm">
                  Tu cuenta se valida mediante credenciales registradas en el
                  sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
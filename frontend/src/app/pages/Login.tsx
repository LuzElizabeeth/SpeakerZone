import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Info,
  Lock,
  LogIn,
  Mail,
  Shield,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/conference.types';

interface LoginLocationState {
  from?: string;
}

interface DemoCredential {
  label: string;
  role: UserRole;
  email: string;
  password: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const demoCredentials: DemoCredential[] = [
  {
    label: 'Administrador',
    role: 'admin',
    email: 'admin@speakerzone.com',
    password: '123456',
    description: 'Gestión de eventos, conferencias, speakers y registros.',
    icon: Shield,
  },
  {
    label: 'Conferencista',
    role: 'speaker',
    email: 'speaker@speakerzone.com',
    password: '123456',
    description: 'Panel de conferencista y consulta de asistentes.',
    icon: Users,
  },
  {
    label: 'Asistente',
    role: 'attendee',
    email: 'asistente@speakerzone.com',
    password: '123456',
    description: 'Reserva de conferencias y consulta de QR.',
    icon: User,
  },
];

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

  /**
   * Las credenciales demo solo se muestran en desarrollo local.
   * En producción/Docker no aparecen en la pantalla de login.
   */
  const showDemoCredentials = import.meta.env.DEV;

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
    setFormData({
      name: '',
      email: '',
      password: '',
    });
  };

  const handleFillDemo = (credential: DemoCredential) => {
    setIsLogin(true);
    setFormData({
      name: '',
      email: credential.email,
      password: credential.password,
    });
    setRememberSession(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const authenticatedUser = await login(
          formData.email,
          formData.password,
          rememberSession
        );

        toast.success(`Bienvenido, ${authenticatedUser.name}.`);
        redirectAfterAuth(authenticatedUser.role);
      } else {
        const registeredUser = await register(
          formData.name,
          formData.email,
          formData.password,
          'attendee',
          rememberSession
        );

        toast.success('Cuenta de asistente creada correctamente.');
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
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta de asistente'}
          </h1>

          <p className="text-gray-600 mb-6">
            {isLogin
              ? 'Accede con tu correo y contraseña. El rol se detecta automáticamente desde la base de datos.'
              : 'El registro público crea únicamente cuentas de asistente.'}
          </p>

          {isLogin && showDemoCredentials && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-accent mt-0.5" />

                <div>
                  <h2 className="text-sm text-gray-900 mb-2">
                    Credenciales demo de desarrollo
                  </h2>

                  <p className="text-xs text-gray-600 mb-3">
                    Estas cuentas solo se muestran en desarrollo local. En
                    producción no aparecen dentro del login.
                  </p>

                  <div className="space-y-2">
                    {demoCredentials.map((credential) => {
                      const Icon = credential.icon;

                      return (
                        <button
                          key={credential.email}
                          type="button"
                          onClick={() => handleFillDemo(credential)}
                          className="w-full text-left bg-white border border-blue-100 rounded-lg p-3 hover:border-blue-accent hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-light flex items-center justify-center">
                              <Icon className="w-5 h-5 text-blue-accent" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm text-gray-900">
                                {credential.label}
                              </p>

                              <p className="text-xs text-gray-500 truncate">
                                {credential.email} / {credential.password}
                              </p>

                              <p className="text-xs text-gray-400 truncate">
                                {credential.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all"
                    placeholder="Juan Pérez"
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
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
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
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all"
                  placeholder="tu@email.com"
                  autoComplete="username"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
                  onChange={(e) => setRememberSession(e.target.checked)}
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

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Accesos externos
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="Inicio con Google no disponible en esta versión"
              className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
            >
              Google
            </button>

            <button
              type="button"
              disabled
              aria-disabled="true"
              title="Inicio con GitHub no disponible en esta versión"
              className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
            >
              GitHub
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-8">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}

            <button
              type="button"
              onClick={() => resetFormState(!isLogin)}
              className="text-blue-accent hover:text-blue-hover transition-colors"
            >
              {isLogin ? 'Crear cuenta de asistente' : 'Iniciar sesión'}
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
            Acceso por roles para SpeakerZone
          </h2>

          <p className="text-xl text-white/90 mb-8">
            Cada usuario accede a un panel distinto según el rol guardado en la
            base de datos.
          </p>

          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 flex items-start gap-4">
              <Shield className="w-6 h-6 mt-1" />

              <div>
                <h3 className="text-lg">Administrador</h3>
                <p className="text-white/80 text-sm">
                  Gestiona eventos, conferencias, speakers y registros.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 flex items-start gap-4">
              <Users className="w-6 h-6 mt-1" />

              <div>
                <h3 className="text-lg">Conferencista</h3>
                <p className="text-white/80 text-sm">
                  Consulta sus conferencias y asistentes relacionados.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 flex items-start gap-4">
              <UserPlus className="w-6 h-6 mt-1" />

              <div>
                <h3 className="text-lg">Asistente</h3>
                <p className="text-white/80 text-sm">
                  Reserva conferencias, consulta su QR y gestiona sus accesos.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-5">
            <h3 className="text-lg mb-2">Regla de seguridad</h3>

            <p className="text-white/80 text-sm">
              El registro público solo permite crear cuentas de asistente. Las
              cuentas de administrador y conferencista deben ser creadas desde
              administración o precargadas en la base de datos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
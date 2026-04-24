import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Users, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { UserRole } from '../types/conference.types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('attendee');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password, selectedRole);
        toast.success('¡Bienvenido de vuelta!');
        
        // Redirigir según el rol
        switch (selectedRole) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'speaker':
            navigate('/speaker/dashboard');
            break;
          default:
            navigate('/attendee/dashboard');
        }
      } else {
        await register(formData.name, formData.email, formData.password);
        toast.success('¡Cuenta creada exitosamente!');
        navigate('/attendee/dashboard');
      }
    } catch (error) {
      toast.error('Error al procesar la solicitud. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl text-gray-900">SpeakerZone</span>
          </Link>

          {/* Title */}
          <h1 className="text-3xl mb-2 text-gray-900">
            {isLogin ? 'Bienvenido de vuelta' : 'Crear una cuenta'}
          </h1>
          <p className="text-gray-600 mb-8">
            {isLogin 
              ? 'Ingresa tus credenciales para continuar' 
              : 'Regístrate para comenzar a explorar conferencias'}
          </p>

          {/* Role Selection (only for login) */}
          {isLogin && (
            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-3">
                Selecciona tu rol
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('attendee')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    selectedRole === 'attendee'
                      ? 'border-blue-accent bg-blue-light'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className={`w-6 h-6 ${selectedRole === 'attendee' ? 'text-blue-accent' : 'text-gray-400'}`} />
                  <span className={`text-sm ${selectedRole === 'attendee' ? 'text-blue-accent' : 'text-gray-600'}`}>
                    Asistente
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('speaker')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    selectedRole === 'speaker'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Users className={`w-6 h-6 ${selectedRole === 'speaker' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${selectedRole === 'speaker' ? 'text-purple-600' : 'text-gray-600'}`}>
                    Speaker
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    selectedRole === 'admin'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Shield className={`w-6 h-6 ${selectedRole === 'admin' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${selectedRole === 'admin' ? 'text-orange-600' : 'text-gray-600'}`}>
                    Admin
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm text-gray-700 mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all"
                    placeholder="Juan Pérez"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all"
                  placeholder="tu@email.com"
                />
              </div>
              {isLogin && (
                <p className="text-xs text-gray-500 mt-2">
                  Usa "admin@..." para Admin, "speaker@..." para Speaker
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Recordar / Olvidé contraseña */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-accent border-gray-300 rounded focus:ring-blue-accent"
                  />
                  <span className="text-sm text-gray-600">Recordarme</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-accent hover:text-blue-hover transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* Botón Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">O continúa con</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Toggle Login/Registro */}
          <p className="text-center text-sm text-gray-600 mt-8">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-accent hover:text-blue-hover transition-colors"
            >
              {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>

      {/* Imagen Inspiracional - Lado Derecho */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-gradient-start to-blue-gradient-end p-12 items-center justify-center relative overflow-hidden">
        {/* Pattern decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-md text-white">
          <h2 className="text-4xl mb-6">
            Únete a la comunidad de innovadores
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Conecta con expertos, aprende de los mejores y lleva tu carrera al siguiente nivel.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-3xl mb-2">500+</p>
              <p className="text-white/80">Conferencias</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-3xl mb-2">50K+</p>
              <p className="text-white/80">Miembros</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-3xl mb-2">200+</p>
              <p className="text-white/80">Expertos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-3xl mb-2">95%</p>
              <p className="text-white/80">Satisfacción</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
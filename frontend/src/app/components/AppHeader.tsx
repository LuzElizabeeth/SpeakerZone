import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  Zap,
  LogOut,
  User,
  ChevronDown,
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  Users,
  Award,
  Info,
  Settings,
  BarChart3,
  QrCode,
  History,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AppHeader: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user?.name) return 'SZ';

    return user.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  };

  const getRoleLabel = () => {
    if (user?.role === 'attendee') return 'Asistente';
    if (user?.role === 'speaker') return 'Conferencista';
    if (user?.role === 'admin') return 'Administrador';
    return 'Usuario';
  };

  const getProfilePath = () => {
    if (user?.role === 'speaker') return '/speaker/profile';
    if (user?.role === 'admin') return '/admin/dashboard';
    return '/attendee/profile';
  };

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { label: 'Conferencias', path: '/dashboard', icon: Calendar },
        { label: 'Conferencistas', path: '/speakers', icon: Users },
        { label: 'Acerca de', path: '/about', icon: Info },
      ];
    }

    switch (user?.role) {
      case 'admin':
        return [
          {
            label: 'Dashboard',
            path: '/admin/dashboard',
            icon: LayoutDashboard,
          },
          { label: 'Usuarios', path: '/admin/users', icon: Users },
          { label: 'Eventos', path: '/admin/events', icon: Calendar },
          { label: 'Conferencias', path: '/admin/conferences', icon: Award },
          { label: 'Conferencistas', path: '/admin/speakers', icon: Users },
          { label: 'Asistentes', path: '/admin/attendees', icon: Users },
          { label: 'Escáner QR', path: '/admin/scanner', icon: QrCode },
          { label: 'Estadísticas', path: '/admin/stats', icon: BarChart3 },
        ];

      case 'speaker':
        return [
          {
            label: 'Mi Panel',
            path: '/speaker/dashboard',
            icon: LayoutDashboard,
          },
          {
            label: 'Mis Conferencias',
            path: '/speaker/conferences',
            icon: Calendar,
          },
          { label: 'Asistentes', path: '/speaker/attendees', icon: Users },
          { label: 'Certificados', path: '/speaker/certificates', icon: Award },
          { label: 'Mi Perfil', path: '/speaker/profile', icon: User },
        ];

      case 'attendee':
      default:
        return [
          {
            label: 'Inicio',
            path: '/attendee/dashboard',
            icon: LayoutDashboard,
          },
          {
            label: 'Programas',
            path: '/attendee/programs',
            icon: MapPin,
          },
          {
            label: 'Mis Reservas',
            path: '/attendee/reservations',
            icon: CalendarCheck,
          },
          { label: 'Mi QR', path: '/attendee/qr', icon: QrCode },
          {
            label: 'Certificados',
            path: '/attendee/certificates',
            icon: Award,
          },
          { label: 'Historial', path: '/attendee/history', icon: History },
        ];
    }
  };

  const navLinks = getNavLinks();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>

            <span className="text-xl text-gray-900 hidden sm:block">
              SpeakerZone
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(link.path)
                      ? 'bg-blue-light text-blue-accent'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-blue-accent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-haspopup="menu"
                  aria-label="Abrir menú de usuario"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-light text-blue-accent flex items-center justify-center text-xs">
                      {getUserInitials()}
                    </div>
                  )}

                  <div className="hidden sm:block text-left">
                    <p className="text-sm text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{getRoleLabel()}</p>
                  </div>

                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showUserMenu && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setShowUserMenu(false)}
                      aria-label="Cerrar menú de usuario"
                    />

                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>

                      <Link
                        to={getProfilePath()}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Mi Perfil
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Configuración
                      </Link>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-2 overflow-x-auto pb-3 pt-2 -mx-4 px-4 scrollbar-hide">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm transition-all ${
                  isActive(link.path)
                    ? 'bg-blue-light text-blue-accent'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
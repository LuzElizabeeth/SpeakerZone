import React from 'react';
import { Link } from 'react-router';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../context/AuthContext';
import { mockEvents } from '../../data/mockData';
import { mockConferences } from '../../data/mockConferences';
import { 
  Calendar,
  QrCode,
  Award,
  TrendingUp,
  ArrowRight,
  Clock,
  MapPin,
  Users,
  CheckCircle
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export const AttendeeDashboard: React.FC = () => {
  const { user } = useAuth();

  // Próximos eventos
  const upcomingEvents = mockEvents.filter(e => e.status === 'próximo').slice(0, 3);
  
  // Próximas conferencias
  const upcomingConferences = mockConferences
    .filter(c => c.status === 'próxima' && new Date(c.date) > new Date())
    .slice(0, 3);

  const stats = {
    registeredEvents: 3,
    upcomingConferences: 5,
    certificatesEarned: 3,
    checkInsCompleted: 3
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
            ¡Bienvenido, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Aquí está tu resumen de actividades y próximos eventos
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl mb-1 text-gray-900">{stats.registeredEvents}</p>
            <p className="text-sm text-gray-600">Eventos Registrados</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl mb-1 text-gray-900">{stats.upcomingConferences}</p>
            <p className="text-sm text-gray-600">Próximas Conferencias</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl mb-1 text-gray-900">{stats.certificatesEarned}</p>
            <p className="text-sm text-gray-600">Certificados</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl mb-1 text-gray-900">{stats.checkInsCompleted}</p>
            <p className="text-sm text-gray-600">Check-ins Realizados</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-2xl mb-6 text-gray-900">Acciones Rápidas</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  to="/attendee/events"
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-gradient-start to-blue-gradient-end rounded-lg text-white hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Explorar</p>
                    <p className="text-lg">Eventos</p>
                  </div>
                </Link>

                <Link
                  to="/attendee/qr"
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Mi Código</p>
                    <p className="text-lg">QR Personal</p>
                  </div>
                </Link>

                <Link
                  to="/attendee/history"
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Ver</p>
                    <p className="text-lg">Historial</p>
                  </div>
                </Link>

                <Link
                  to="/attendee/certificates"
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Descargar</p>
                    <p className="text-lg">Certificados</p>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Upcoming Conferences */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">Próximas Conferencias</h2>
                <Link
                  to="/attendee/events"
                  className="text-sm text-blue-accent hover:text-blue-hover transition-colors flex items-center gap-1"
                >
                  Ver todas <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingConferences.map((conference) => (
                  <div
                    key={conference.id}
                    className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <img
                      src={conference.imageUrl}
                      alt={conference.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm mb-1 text-gray-900 truncate">{conference.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(conference.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{conference.time}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{conference.type}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code Preview */}
            <Card className="p-6 bg-gradient-to-br from-blue-gradient-start to-blue-gradient-end text-white">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-2">Tu Código QR</h3>
                <p className="text-sm opacity-90 mb-4">
                  Úsalo para validar tu asistencia
                </p>
                <Link to="/attendee/qr">
                  <Button variant="secondary" className="w-full">
                    Ver Mi QR
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card className="p-6">
              <h3 className="text-lg mb-4 text-gray-900">Próximos Eventos</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="pb-3 border-b border-gray-100 last:border-0">
                    <h4 className="text-sm text-gray-900 mb-2">{event.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(event.startDate).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/attendee/events">
                <Button variant="outline" className="w-full mt-4">
                  Ver Todos los Eventos
                </Button>
              </Link>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-lg mb-3 text-blue-900">
                💡 Consejo del Día
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Descarga tu código QR antes de asistir a un evento para un check-in más rápido
              </p>
              <Link to="/attendee/qr">
                <Button variant="outline" size="sm" className="w-full">
                  Descargar Mi QR
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendeeDashboard;

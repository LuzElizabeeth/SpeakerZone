import React from 'react';
import { Link } from 'react-router';
import { 
  Calendar, 
  Users, 
  Award, 
  TrendingUp, 
  UserCheck,
  QrCode,
  BarChart3,
  AlertCircle 
} from 'lucide-react';
import { AppHeader } from '../../components/AppHeader';
import { mockConferences } from '../../data/mockConferences';

export const AdminDashboard: React.FC = () => {
  const totalConferences = mockConferences.length;
  const upcomingConferences = mockConferences.filter(c => c.status === 'próxima').length;
  const totalAttendees = mockConferences.reduce((sum, c) => sum + c.registeredCount, 0);
  const totalCapacity = mockConferences.reduce((sum, c) => sum + c.capacity, 0);
  const occupancyRate = ((totalAttendees / totalCapacity) * 100).toFixed(1);

  const stats = [
    {
      label: 'Total Eventos',
      value: totalConferences,
      icon: Calendar,
      color: 'blue',
      change: '+3 este mes',
      trend: 'up'
    },
    {
      label: 'Total Asistentes',
      value: totalAttendees,
      icon: Users,
      color: 'green',
      change: '+25% vs mes pasado',
      trend: 'up'
    },
    {
      label: 'Conferencistas',
      value: 6,
      icon: Award,
      color: 'purple',
      change: '+2 nuevos',
      trend: 'up'
    },
    {
      label: 'Tasa de Ocupación',
      value: `${occupancyRate}%`,
      icon: TrendingUp,
      color: 'orange',
      change: 'Promedio general',
      trend: 'neutral'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-light text-blue-accent',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  const recentActivity = [
    {
      id: '1',
      type: 'registration',
      message: 'Nuevo registro para "Inteligencia Artificial"',
      time: 'Hace 5 minutos',
      icon: UserCheck,
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'conference',
      message: 'Conferencia "Cloud Native" actualizada',
      time: 'Hace 1 hora',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      id: '3',
      type: 'speaker',
      message: 'Nuevo conferencista registrado',
      time: 'Hace 2 horas',
      icon: Award,
      color: 'text-purple-600'
    },
    {
      id: '4',
      type: 'alert',
      message: 'Conferencia "Design Systems" alcanzó 90% de ocupación',
      time: 'Hace 3 horas',
      icon: AlertCircle,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
            Panel de Administración
          </h1>
          <p className="text-lg text-gray-600">
            Vista general de todos los eventos y actividades
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {stat.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600" />}
                </div>
                <p className="text-3xl mb-1 text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl mb-6 text-gray-900">Acciones Rápidas</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  to="/admin/events"
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-accent to-blue-hover rounded-lg text-white hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Gestionar</p>
                    <p className="text-lg">Eventos</p>
                  </div>
                </Link>

                <Link
                  to="/admin/conferences"
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Gestionar</p>
                    <p className="text-lg">Conferencias</p>
                  </div>
                </Link>

                <Link
                  to="/admin/speakers"
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Gestionar</p>
                    <p className="text-lg">Conferencistas</p>
                  </div>
                </Link>

                <Link
                  to="/admin/attendees"
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Gestionar</p>
                    <p className="text-lg">Asistentes</p>
                  </div>
                </Link>

                <Link
                  to="/admin/scanner"
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg text-white hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Escanear</p>
                    <p className="text-lg">Códigos QR</p>
                  </div>
                </Link>

                <Link
                  to="/admin/stats"
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg text-white hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Ver</p>
                    <p className="text-lg">Estadísticas</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Upcoming Conferences */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">Próximas Conferencias</h2>
                <Link
                  to="/admin/conferences"
                  className="text-sm text-blue-accent hover:text-blue-hover transition-colors"
                >
                  Ver todas →
                </Link>
              </div>

              <div className="space-y-4">
                {mockConferences.slice(0, 3).map((conference) => (
                  <div
                    key={conference.id}
                    className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={conference.imageUrl}
                      alt={conference.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm mb-1 text-gray-900 truncate">{conference.title}</h3>
                      <p className="text-xs text-gray-600">
                        {new Date(conference.date).toLocaleDateString('es-ES')} • {conference.registeredCount}/{conference.capacity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Ocupación</p>
                      <p className={`text-sm ${
                        (conference.registeredCount / conference.capacity) * 100 >= 90 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {((conference.registeredCount / conference.capacity) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl mb-6 text-gray-900">Actividad Reciente</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 mb-1">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

import React from 'react';
import { Link } from 'react-router';
import { Calendar, Users, TrendingUp, Award, Clock, MapPin } from 'lucide-react';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../context/AuthContext';
import { mockConferences } from '../../data/mockConferences';

export const SpeakerDashboard: React.FC = () => {
  const { user } = useAuth();

  // Filtrar conferencias del speaker (simulado)
  const myConferences = mockConferences.slice(0, 3);
  const upcomingConferences = myConferences.filter(c => c.status === 'próxima');
  const totalAttendees = myConferences.reduce((sum, c) => sum + c.registeredCount, 0);

  const stats = [
    {
      label: 'Conferencias Totales',
      value: myConferences.length,
      icon: Calendar,
      color: 'blue',
      change: '+2 este mes'
    },
    {
      label: 'Total Asistentes',
      value: totalAttendees,
      icon: Users,
      color: 'green',
      change: '+15% vs mes pasado'
    },
    {
      label: 'Próximas Conferencias',
      value: upcomingConferences.length,
      icon: Clock,
      color: 'purple',
      change: 'En los próximos 30 días'
    },
    {
      label: 'Certificados Emitidos',
      value: 145,
      icon: Award,
      color: 'orange',
      change: '95% tasa de entrega'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-light text-blue-accent',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
            Bienvenido, {user?.name}
          </h1>
          <p className="text-lg text-gray-600">
            Panel de control de tus conferencias y actividades
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
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl mb-1 text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Upcoming Conferences */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-gray-900">Próximas Conferencias</h2>
            <Link
              to="/speaker/conferences"
              className="text-sm text-blue-accent hover:text-blue-hover transition-colors"
            >
              Ver todas →
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingConferences.map((conference) => (
              <div
                key={conference.id}
                className="flex items-start gap-4 p-4 bg-muted rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={conference.imageUrl}
                  alt={conference.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg mb-2 text-gray-900">{conference.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-accent" />
                      <span>{new Date(conference.date).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-accent" />
                      <span>{conference.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-accent" />
                      <span>{conference.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-accent" />
                      <span>{conference.registeredCount} asistentes</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/conference/${conference.id}`}
                  className="px-4 py-2 bg-blue-accent text-white rounded-lg hover:bg-blue-hover transition-colors text-sm"
                >
                  Ver Detalles
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/speaker/conferences"
            className="bg-gradient-to-br from-blue-accent to-blue-hover p-6 rounded-xl text-white hover:shadow-lg transition-all group"
          >
            <Calendar className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl mb-2">Mis Conferencias</h3>
            <p className="text-white/80 text-sm">
              Gestiona todas tus conferencias asignadas
            </p>
          </Link>

          <Link
            to="/speaker/attendees"
            className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white hover:shadow-lg transition-all group"
          >
            <Users className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl mb-2">Ver Asistentes</h3>
            <p className="text-white/80 text-sm">
              Consulta la lista de asistentes registrados
            </p>
          </Link>

          <Link
            to="/speaker/certificates"
            className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white hover:shadow-lg transition-all group"
          >
            <Award className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl mb-2">Certificados</h3>
            <p className="text-white/80 text-sm">
              Descarga tus certificados de participación
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SpeakerDashboard;

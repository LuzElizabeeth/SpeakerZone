import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

import {
  Calendar,
  QrCode,
  Award,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle,
  FileText,
  Loader2,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export const AttendeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(
    null
  );

  const [programActivities, setProgramActivities] = useState<
  Record<string, any[]>
>({});

  const loadPrograms = useCallback(() => {
    return api.getPrograms();
  }, []);

  const loadReservations = useCallback(() => {
    return api.getMyReservations();
  }, []);

  const {
    data: programs = [],
    loading: programsLoading,
  } = useApi(loadPrograms, []);

  const {
    data: reservations = [],
    loading: reservationsLoading,
  } = useApi(loadReservations, []);

  const upcomingPrograms = useMemo(() => {
    return [...programs]
      .sort(
        (a: any, b: any) =>
          new Date(a.startDate).getTime() -
          new Date(b.startDate).getTime()
      )
      .slice(0, 3);
  }, [programs]);

  const upcomingReservations = useMemo(() => {
    return [...reservations]
      .filter((item: any) => item.status !== 'cancelada')
      .sort((a: any, b: any) => {
        const dateA = new Date(
          `${a.conference?.date || ''}T${a.conference?.time || '00:00'}`
        ).getTime();

        const dateB = new Date(
          `${b.conference?.date || ''}T${b.conference?.time || '00:00'}`
        ).getTime();

        return dateA - dateB;
      })
      .slice(0, 4);
  }, [reservations]);

  const stats = useMemo(() => {
    const checkedInCount = reservations.filter(
      (item: any) => item.checkedIn
    ).length;

    return {
      reservations: reservations.length,
      upcomingPrograms: programs.length,
      certificates: checkedInCount,
      checkIns: checkedInCount,
    };
  }, [programs, reservations]);

  const isLoading = programsLoading || reservationsLoading;

  const toggleProgram = async (programId: string) => {
  if (expandedProgramId === programId) {
    setExpandedProgramId(null);
    return;
  }

  if (!programActivities[programId]) {
    try {
      const activities =
        await api.getActivitiesByProgram(programId);

      setProgramActivities((prev) => ({
        ...prev,
        [programId]: activities,
      }));
    } catch (error) {
      console.error(
        'Error cargando actividades del programa:',
        error
      );
    }
  }

  setExpandedProgramId(programId);
};

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl text-gray-900 mb-2">
            ¡Bienvenido, {user?.name?.split(' ')[0]}! 👋
          </h1>

          <p className="text-lg text-gray-600">
            Aquí está tu resumen de actividades, reservas y próximos programas
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <Card className="p-10 text-center mb-8">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-blue-accent" />
            <p className="text-gray-600">
              Cargando información desde PostgreSQL...
            </p>
          </Card>
        )}

        {!isLoading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Mis Reservas"
                value={stats.reservations}
                icon={CalendarCheck}
              />

              <StatCard
                title="Programas Disponibles"
                value={stats.upcomingPrograms}
                icon={FileText}
              />

              <StatCard
                title="Check-ins"
                value={stats.checkIns}
                icon={CheckCircle}
              />

              <StatCard
                title="Certificados"
                value={stats.certificates}
                icon={Award}
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* LEFT */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions */}
                <Card className="p-6">
                  <h2 className="text-2xl text-gray-900 mb-6">
                    Acciones rápidas
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <QuickAction
                      to="/attendee/programs"
                      title="Programas"
                      subtitle="Explorar"
                      icon={Calendar}
                      gradient="from-blue-gradient-start to-blue-gradient-end"
                    />

                    <QuickAction
                      to="/attendee/reservations"
                      title="Mis Reservas"
                      subtitle="Consultar"
                      icon={CalendarCheck}
                      gradient="from-green-500 to-green-600"
                    />

                    <QuickAction
                      to="/attendee/qr"
                      title="Mi QR"
                      subtitle="Código personal"
                      icon={QrCode}
                      gradient="from-purple-500 to-purple-600"
                    />

                    <QuickAction
                      to="/attendee/certificates"
                      title="Certificados"
                      subtitle="Descargar"
                      icon={Award}
                      gradient="from-orange-500 to-orange-600"
                    />
                  </div>
                </Card>

                {/* Próximos Programas Expandibles */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl text-gray-900">
                      Próximos Programas
                    </h2>

                    <Link
                      to="/attendee/programs"
                      className="text-sm text-blue-accent hover:text-blue-hover transition-colors flex items-center gap-1"
                    >
                      Ver todos
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {upcomingPrograms.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No hay programas disponibles por ahora
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingPrograms.map((program: any) => {
                        const isExpanded =
                          expandedProgramId === program.id;

                        return (
                          <div
                            key={program.id}
                            className="border border-gray-200 rounded-xl overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggleProgram(program.id)
                              }
                              className="w-full p-4 bg-white hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <img
                                  src={
                                    program.imageUrl ||
                                    'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
                                  }
                                  alt={program.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />

                                <div className="flex-1 text-left">
                                  <h3 className="text-lg text-gray-900 mb-2">
                                    {program.name}
                                  </h3>

                                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      <span>
                                        {new Date(
                                          program.startDate
                                        ).toLocaleDateString('es-MX')}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      <span>{program.location}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <Badge variant="outline">
                                    {program.totalActivities || 0}{' '}
                                    actividades
                                  </Badge>

                                  {isExpanded ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                  )}
                                </div>
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="bg-gray-50 border-t border-gray-100 p-4">
                                <div className="space-y-3">
                                  {(programActivities[program.id] || []).length > 0 ? (
                                    (programActivities[program.id] || []).map(
                                      (activity: any) => (
                                        <Link
                                          key={activity.id}
                                          to={`/attendee/activities/${activity.id}`}
                                          className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <p className="text-gray-900">
                                                {activity.title}
                                              </p>

                                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                  <Clock className="w-3 h-3" />
                                                  {activity.time}
                                                </span>

                                                <span className="flex items-center gap-1">
                                                  <MapPin className="w-3 h-3" />
                                                  {activity.location}
                                                </span>
                                              </div>
                                            </div>

                                            <ArrowRight className="w-4 h-4 text-gray-400" />
                                          </div>
                                        </Link>
                                      )
                                    )
                                  ) : (
                                    <p className="text-sm text-gray-500">
                                      No hay actividades cargadas aún
                                    </p>
                                  )}
                                </div>

                                <Link
                                  to={`/attendee/programs/${program.id}`}
                                  className="mt-4 inline-flex items-center gap-2 text-sm text-blue-accent hover:text-blue-hover"
                                >
                                  Ver programa completo
                                  <ArrowRight className="w-4 h-4" />
                                </Link>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                {/* QR */}
                <Card className="p-6 bg-gradient-to-br from-blue-gradient-start to-blue-gradient-end text-white">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <QrCode className="w-8 h-8" />
                    </div>

                    <h3 className="text-xl mb-2">
                      Tu Código QR
                    </h3>

                    <p className="text-sm opacity-90 mb-4">
                      Utilízalo para validar tu asistencia
                    </p>

                    <Link to="/attendee/qr">
                      <Button
                        variant="secondary"
                        className="w-full"
                      >
                        Ver Mi QR
                      </Button>
                    </Link>
                  </div>
                </Card>

                {/* Mis próximas reservas */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg text-gray-900">
                      Mis próximas reservas
                    </h3>

                    <Link
                      to="/attendee/reservations"
                      className="text-sm text-blue-accent"
                    >
                      Ver todas
                    </Link>
                  </div>

                  {upcomingReservations.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Aún no tienes reservas próximas.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingReservations.map((reservation: any) => (
                        <div
                          key={reservation.id}
                          className="border-b border-gray-100 pb-4 last:border-0"
                        >
                          <p className="text-sm text-gray-900 mb-2">
                            {reservation.conference?.title}
                          </p>

                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {reservation.conference?.date}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span>
                                {reservation.conference?.time}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              <span>
                                {reservation.conference?.location}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2">
                            <Badge variant="outline">
                              {reservation.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Tip */}
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <h3 className="text-lg text-blue-900 mb-3">
                    Consejo del día
                  </h3>

                  <p className="text-sm text-blue-700 mb-4">
                    Guarda tu código QR antes del evento para
                    agilizar tu check-in y facilitar la generación
                    de certificados.
                  </p>

                  <Link to="/attendee/qr">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Ir a Mi QR
                    </Button>
                  </Link>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
}) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>

    <p className="text-3xl text-gray-900 mb-1">
      {value}
    </p>

    <p className="text-sm text-gray-600">
      {title}
    </p>
  </Card>
);

interface QuickActionProps {
  to: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const QuickAction: React.FC<QuickActionProps> = ({
  to,
  title,
  subtitle,
  icon: Icon,
  gradient,
}) => (
  <Link
    to={to}
    className={`flex items-center gap-4 p-4 rounded-lg text-white hover:shadow-lg transition-all group bg-gradient-to-br ${gradient}`}
  >
    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6" />
    </div>

    <div>
      <p className="text-sm opacity-90">{subtitle}</p>
      <p className="text-lg">{title}</p>
    </div>
  </Link>
);

export default AttendeeDashboard;
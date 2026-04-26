import React, { useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { AppHeader } from '../../components/AppHeader';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Building2,
  Laptop,
  AlertCircle,
  Award,
  ExternalLink,
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export const AttendeeActivityDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const loadActivity = useCallback(() => {
    if (!id) {
      throw new Error('No se recibió el ID de la actividad');
    }

    return api.getActivityById(id);
  }, [id]);

  const {
    data: activity,
    loading,
    error,
  } = useApi(loadActivity, null);

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      conferencia: 'bg-blue-100 text-blue-700',
      taller: 'bg-green-100 text-green-700',
      evento: 'bg-purple-100 text-purple-700',
      actividad_especial: 'bg-yellow-100 text-yellow-700',
    };

    const labels: Record<string, string> = {
      conferencia: 'Conferencia',
      taller: 'Taller',
      evento: 'Evento',
      actividad_especial: 'Actividad especial',
    };

    return (
      <Badge className={styles[type] || 'bg-gray-100 text-gray-700'}>
        {labels[type] || type}
      </Badge>
    );
  };

  const renderRegistrationCTA = () => {
    if (!activity) return null;

    if (!activity.requiresRegistration) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />

          <div>
            <p className="text-sm font-medium text-blue-700">
              Esta actividad no requiere registro previo
            </p>

            <p className="text-sm text-blue-600 mt-1">
              Puedes asistir libremente, pero puedes confirmar tu
              asistencia para que quede registrada en tu historial,
              reservas y certificados.
            </p>
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white"
        onClick={async () => {
  try {
    await api.registerToActivity(activity.id);

    const goToReservations = window.confirm(
      'Asistencia confirmada exitosamente.\n\nTu actividad fue agregada a tus reservas.\n\n¿Deseas ir a ver tus reservas ahora?'
    );

    if (goToReservations) {
      navigate('/attendee/reservations');
    }
  } catch (error) {
    console.error(
      'Error al confirmar asistencia:',
      error
    );

    window.alert(
      'No se pudo confirmar la asistencia. Intenta nuevamente.'
    );
  }
}}
      >
        Confirmar mi asistencia
      </Button>
    </div>
  );
}

    if (activity.registeredCount >= activity.capacity) {
      return (
        <Button disabled className="w-full">
          Cupo lleno
        </Button>
      );
    }

    if (
      activity.registrationType === 'external_link' &&
      activity.externalRegistrationUrl
    ) {
      return (
        <a
          href={activity.externalRegistrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button className="w-full bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white">
            Ir al formulario externo
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </a>
      );
    }

    if (activity.registrationType === 'internal_form') {
      return (
        <Link to={`/attendee/register/${activity.id}`}>
          <Button className="w-full bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white">
            Reservar lugar
          </Button>
        </Link>
      );
    }

    return (
      <Button disabled className="w-full">
        Registro no disponible
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al programa
        </Button>

        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Cargando actividad...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-1" />

            <div>
              <h2 className="text-lg mb-1">
                No se pudo cargar la actividad
              </h2>

              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && activity && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-8">
                <div className="mb-6">
                  {getTypeBadge(activity.activityType)}
                </div>

                <h1 className="text-3xl lg:text-4xl text-gray-900 mb-4">
                  {activity.title}
                </h1>

                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {activity.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                    <Calendar className="w-5 h-5 text-blue-accent" />

                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>

                      <p>
                        {new Date(activity.date).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                    <Clock className="w-5 h-5 text-blue-accent" />

                    <div>
                      <p className="text-sm text-gray-500">Horario</p>

                      <p>
                        {activity.time} - {activity.endTime || '--'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                    <MapPin className="w-5 h-5 text-blue-accent" />

                    <div>
                      <p className="text-sm text-gray-500">Ubicación</p>

                      <p>{activity.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                    <Laptop className="w-5 h-5 text-blue-accent" />

                    <div>
                      <p className="text-sm text-gray-500">Modalidad</p>

                      <p>{activity.modality}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl text-gray-900 mb-2">
                  Programa principal
                </h2>

                <p className="text-gray-600">
                  {activity.program?.name}
                </p>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl text-gray-900 mb-6">
                  Speaker principal
                </h2>

                <div className="space-y-4">
                  <h3 className="text-xl text-gray-900">
                    {activity.speaker?.name}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{activity.speaker?.role}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{activity.speaker?.organization}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {activity.speaker?.bio}
                  </p>
                </div>
              </Card>

              {activity.requirements?.length > 0 && (
                <Card className="p-8">
                  <h2 className="text-2xl text-gray-900 mb-6">
                    Requisitos e información adicional
                  </h2>

                  <div className="space-y-4">
                    {activity.requirements.map(
                      (requirement: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 rounded-lg bg-gray-50"
                        >
                          <AlertCircle className="w-5 h-5 text-blue-accent mt-0.5" />

                          <p className="text-gray-700">
                            {requirement}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </Card>
              )}
            </div>

            <div>
              <Card className="p-6 sticky top-6">
                <h2 className="text-xl text-gray-900 mb-6">
                  Registro e inscripción
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Capacidad total
                    </span>

                    <span className="font-medium">
                      {activity.capacity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Registrados
                    </span>

                    <span className="font-medium">
                      {activity.registeredCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Disponibles
                    </span>

                    <span className="font-medium">
                      {Math.max(
                        0,
                        activity.capacity - activity.registeredCount
                      )}
                    </span>
                  </div>
                </div>

                {activity.certificateAvailable && (
                  <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-blue-600 mt-0.5" />

                      <div>
                        <p className="text-sm font-medium text-blue-700">
                          Genera certificado
                        </p>

                        <p className="text-sm text-blue-600">
                          Requiere asistencia y check-in válido.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {renderRegistrationCTA()}
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AttendeeActivityDetail;


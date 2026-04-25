import React, { useCallback, useState } from 'react';
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
  CheckCircle,
  AlertCircle,
  Award,
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export const AttendeeRegistrationFlow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const handleRegister = async () => {
    if (!activity) return;

    try {
      setSubmitError(null);
      setIsSubmitting(true);

      await api.registerToActivity(activity.id);

      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(
        err?.message ||
          'No se pudo completar la inscripción'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted && activity) {
    return (
      <div className="min-h-screen bg-muted">
        <AppHeader />

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-10 text-center">
            <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-600" />

            <h1 className="text-3xl text-gray-900 mb-4">
              Registro exitoso
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Tu lugar ha sido reservado correctamente para esta actividad.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 text-left mb-8">
              <h2 className="text-lg text-gray-900 mb-4">
                Información importante
              </h2>

              <ul className="space-y-3 text-gray-600">
                <li>
                  • Recibirás confirmación dentro de tu panel de inscripciones
                </li>
                <li>
                  • Tu acceso podrá validarse mediante QR
                </li>
                <li>
                  • Debes presentarte 15 minutos antes del inicio
                </li>

                {activity.certificateAvailable && (
                  <li>
                    • Esta actividad puede generar certificado de asistencia
                  </li>
                )}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/attendee/reservations">
                <Button className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white">
                  Ver mis inscripciones
                </Button>
              </Link>

              <Link to="/attendee/programs">
                <Button variant="outline">
                  Volver a programas
                </Button>
              </Link>
            </div>
          </Card>
        </main>
      </div>
    );
  }

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
          Volver a la actividad
        </Button>

        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Cargando información de la actividad...
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
            <div className="lg:col-span-2">
              <Card className="p-8">
                <div className="mb-8">
                  <h1 className="text-3xl text-gray-900 mb-2">
                    Confirmar inscripción
                  </h1>

                  <p className="text-gray-600">
                    Estás a punto de reservar tu lugar para esta actividad.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-gray-50 border">
                    <h2 className="text-xl text-gray-900 mb-4">
                      {activity.title}
                    </h2>

                    <p className="text-gray-600 mb-6">
                      {activity.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-accent" />
                        <span>
                          {new Date(
                            activity.date
                          ).toLocaleDateString('es-MX')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-accent" />
                        <span>
                          {activity.time} -{' '}
                          {activity.endTime || '--'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-accent" />
                        <span>{activity.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-accent" />
                        <span>
                          {activity.speaker?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {activity.certificateAvailable && (
                    <div className="p-5 rounded-xl bg-blue-50 border border-blue-100">
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-blue-600 mt-0.5" />

                        <div>
                          <p className="font-medium text-blue-700">
                            Esta actividad genera certificado
                          </p>

                          <p className="text-sm text-blue-600">
                            Requiere asistencia confirmada y check-in válido.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                      {submitError}
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={handleRegister}
                    disabled={
                      isSubmitting ||
                      activity.registeredCount >= activity.capacity
                    }
                    className="w-full bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white"
                  >
                    {isSubmitting
                      ? 'Procesando inscripción...'
                      : activity.registeredCount >=
                        activity.capacity
                      ? 'Cupo lleno'
                      : 'Confirmar inscripción'}
                  </Button>
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6 sticky top-6">
                <h2 className="text-xl text-gray-900 mb-6">
                  Estado de disponibilidad
                </h2>

                <div className="space-y-4">
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
                        activity.capacity -
                          activity.registeredCount
                      )}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AttendeeRegistrationFlow;

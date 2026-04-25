import React, { useCallback, useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

import {
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  Award,
  AlertCircle,
  Trash2,
} from 'lucide-react';

import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export const AttendeeReservations: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const loadReservations = useCallback(() => {
    return api.getMyReservations();
  }, [refreshKey]);

  const {
    data: reservations = [],
    loading,
    error,
  } = useApi(loadReservations, []);

  const handleCancelReservation = async (id: string) => {
    try {
      setCancelingId(id);

      await api.cancelReservation(id);

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
    } finally {
      setCancelingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmada: 'bg-green-100 text-green-700',
      pendiente: 'bg-yellow-100 text-yellow-700',
      cancelada: 'bg-red-100 text-red-700',
    };

    const labels: Record<string, string> = {
      confirmada: 'Confirmada',
      pendiente: 'Pendiente',
      cancelada: 'Cancelada',
    };

    return (
      <Badge
        className={
          styles[status] || 'bg-gray-100 text-gray-700'
        }
      >
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CalendarCheck className="w-8 h-8 text-blue-accent" />

            <h1 className="text-3xl lg:text-4xl text-gray-900">
              Mis Inscripciones
            </h1>
          </div>

          <p className="text-lg text-gray-600">
            Consulta tus actividades registradas,
            disponibilidad y acceso a certificados.
          </p>
        </div>

        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Cargando tus inscripciones...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-1" />

            <div>
              <h2 className="text-lg mb-1">
                No se pudieron cargar tus reservas
              </h2>

              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          reservations.length === 0 && (
            <Card className="p-10 text-center">
              <CalendarCheck className="w-16 h-16 mx-auto mb-4 text-gray-400" />

              <h2 className="text-2xl text-gray-900 mb-2">
                Aún no tienes inscripciones
              </h2>

              <p className="text-gray-600">
                Cuando te registres a una actividad,
                aparecerá aquí.
              </p>
            </Card>
          )}

        {!loading &&
          !error &&
          reservations.length > 0 && (
            <div className="space-y-6">
              {reservations.map((reservation: any) => (
                <Card
                  key={reservation.id}
                  className="p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-2xl text-gray-900">
                          {reservation.activity?.title}
                        </h2>

                        {getStatusBadge(
                          reservation.status
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mb-6">
                        Programa:{' '}
                        {reservation.program?.name}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-accent" />

                          <span>
                            {new Date(
                              reservation.activity?.date
                            ).toLocaleDateString(
                              'es-MX'
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-accent" />

                          <span>
                            {reservation.activity?.time}
                            {reservation.activity
                              ?.endTime
                              ? ` - ${reservation.activity.endTime}`
                              : ''}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-accent" />

                          <span>
                            {
                              reservation.activity
                                ?.location
                            }
                          </span>
                        </div>

                        {reservation.activity
                          ?.certificateAvailable && (
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-blue-accent" />

                            <span>
                              Genera certificado
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:w-56">
                      {reservation.status !==
                        'cancelada' && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            handleCancelReservation(
                              reservation.id
                            )
                          }
                          disabled={
                            cancelingId ===
                            reservation.id
                          }
                        >
                          <Trash2 className="w-4 h-4 mr-2" />

                          {cancelingId ===
                          reservation.id
                            ? 'Cancelando...'
                            : 'Cancelar'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
      </main>
    </div>
  );
};

export default AttendeeReservations;


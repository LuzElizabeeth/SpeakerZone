import React, { useCallback } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { QRCodeSVG } from 'qrcode.react';

import {
  QrCode,
  Calendar,
  Clock,
  MapPin,
  Award,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export const AttendeeQRCode: React.FC = () => {
  const loadReservations = useCallback(() => {
    return api.getMyReservations();
  }, []);

  const {
    data: reservations = [],
    loading,
    error,
  } = useApi(loadReservations, []);

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
            <QrCode className="w-8 h-8 text-blue-accent" />

            <h1 className="text-3xl lg:text-4xl text-gray-900">
              Mis Códigos QR
            </h1>
          </div>

          <p className="text-lg text-gray-600">
            Presenta tu código QR al ingresar a cada
            actividad para registrar tu asistencia.
          </p>
        </div>

        <div className="mb-8 p-5 rounded-xl bg-blue-50 border border-blue-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />

            <div>
              <p className="font-medium text-blue-700">
                Importante
              </p>

              <p className="text-sm text-blue-600">
                Cada actividad tiene su propio código QR.
                Debes presentar el correspondiente al
                evento donde asistirás.
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Cargando códigos QR...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-1" />

            <div>
              <h2 className="text-lg mb-1">
                No se pudieron cargar tus códigos QR
              </h2>

              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          reservations.length === 0 && (
            <Card className="p-10 text-center">
              <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-400" />

              <h2 className="text-2xl text-gray-900 mb-2">
                Aún no tienes registros
              </h2>

              <p className="text-gray-600">
                Cuando te inscribas a una actividad,
                aquí aparecerá tu código QR.
              </p>
            </Card>
          )}

        {!loading &&
          !error &&
          reservations.length > 0 && (
            <div className="space-y-8">
              {reservations.map((reservation: any) => (
                <Card
                  key={reservation.id}
                  className="p-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-3 mb-4">
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

                      <div className="space-y-4 text-sm">
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
                              Esta actividad genera
                              certificado
                            </span>
                          </div>
                        )}

                        {reservation.status ===
                          'confirmada' && (
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-4 h-4" />

                            <span>
                              Registro válido para
                              check-in
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="bg-white p-6 rounded-xl shadow-md border">
                        <QRCodeSVG
                          value={
                            reservation.qrCode ||
                            'NO-QR'
                          }
                          size={220}
                          level="H"
                          includeMargin={true}
                        />

                        <div className="mt-4 text-center">
                          <p className="text-xs text-gray-500 mb-2">
                            Código único de acceso
                          </p>

                          <code className="text-xs bg-gray-100 px-3 py-2 rounded-lg break-all">
                            {reservation.qrCode}
                          </code>
                        </div>
                      </div>
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

export default AttendeeQRCode;

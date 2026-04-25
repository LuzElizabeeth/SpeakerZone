import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { AppHeader } from '../../components/AppHeader';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

import {
  Award,
  Calendar,
  Clock,
  MapPin,
  Search,
  FileText,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

export const AttendeeCertificates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const loadReservations = useCallback(() => {
    return api.getMyReservations();
  }, []);

  const {
    data: reservations = [],
    loading,
    error,
  } = useApi(loadReservations, []);

  const certificateActivities = useMemo(() => {
    return reservations.filter(
      (reservation: any) =>
        reservation.activity?.certificateAvailable
    );
  }, [reservations]);

  const filteredCertificates = useMemo(() => {
    return certificateActivities.filter((reservation: any) =>
      reservation.activity?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [certificateActivities, searchQuery]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmada: 'bg-green-100 text-green-700',
      pendiente: 'bg-yellow-100 text-yellow-700',
      cancelada: 'bg-red-100 text-red-700',
    };

    const labels: Record<string, string> = {
      confirmada: 'Disponible',
      pendiente: 'Pendiente',
      cancelada: 'Cancelado',
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
          <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
            Mis Certificados
          </h1>

          <p className="text-lg text-gray-600">
            Consulta las actividades que generan
            constancia y el estado de disponibilidad
            de tus certificados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <p className="text-3xl text-gray-900 mb-1">
              {certificateActivities.length}
            </p>

            <p className="text-sm text-gray-600">
              Actividades con certificado
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>

            <p className="text-3xl text-gray-900 mb-1">
              {
                certificateActivities.filter(
                  (r: any) =>
                    r.status === 'confirmada'
                ).length
              }
            </p>

            <p className="text-sm text-gray-600">
              Disponibles
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>

            <p className="text-3xl text-gray-900 mb-1">
              {new Date().getFullYear()}
            </p>

            <p className="text-sm text-gray-600">
              Año actual
            </p>
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <Input
              type="text"
              placeholder="Buscar actividad con certificado..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="pl-10"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {filteredCertificates.length}{' '}
              certificados encontrados
            </p>
          </div>
        </Card>

        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Cargando certificados...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-1" />

            <div>
              <h2 className="text-lg mb-1">
                No se pudieron cargar tus certificados
              </h2>

              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          filteredCertificates.length > 0 && (
            <div className="space-y-5">
              {filteredCertificates.map(
                (reservation: any) => (
                  <Card
                    key={reservation.id}
                    className="p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h2 className="text-2xl text-gray-900">
                            {
                              reservation.activity
                                ?.title
                            }
                          </h2>

                          {getStatusBadge(
                            reservation.status
                          )}
                        </div>

                        <p className="text-sm text-gray-500 mb-6">
                          Programa:{' '}
                          {
                            reservation.program
                              ?.name
                          }
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-accent" />

                            <span>
                              {new Date(
                                reservation.activity
                                  ?.date
                              ).toLocaleDateString(
                                'es-MX'
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-accent" />

                            <span>
                              {
                                reservation.activity
                                  ?.time
                              }
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
                        </div>
                      </div>

                      <div className="lg:w-56">
                        {reservation.status ===
                        'confirmada' ? (
                          <Button
                            disabled
                            className="w-full bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white"
                          >
                            Próximamente PDF
                          </Button>
                        ) : (
                          <Button
                            disabled
                            variant="outline"
                            className="w-full"
                          >
                            Pendiente de validación
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              )}
            </div>
          )}

        {!loading &&
          !error &&
          filteredCertificates.length === 0 && (
            <Card className="p-12 text-center">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />

              <h3 className="text-xl text-gray-900 mb-2">
                {searchQuery
                  ? 'No se encontraron certificados'
                  : 'Aún no tienes certificados'}
              </h3>

              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? 'Intenta ajustar tu búsqueda'
                  : 'Asiste a actividades con constancia para ver tus certificados aquí'}
              </p>

              {!searchQuery && (
                <Link to="/attendee/programs">
                  <Button className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white">
                    Explorar programas
                  </Button>
                </Link>
              )}
            </Card>
          )}

        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-blue-600" />
            </div>

            <div>
              <h3 className="text-lg text-blue-900 mb-2">
                ¿Cómo obtener certificados?
              </h3>

              <p className="text-sm text-blue-700 mb-3">
                Los certificados se habilitan cuando:
              </p>

              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Te registras correctamente en una
                  actividad
                </li>
                <li>
                  • Realizas check-in con tu código QR
                </li>
                <li>
                  • Se valida tu asistencia oficial
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AttendeeCertificates;

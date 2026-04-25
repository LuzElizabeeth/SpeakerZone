import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppHeader } from '../../components/AppHeader';
import { ConferenceCard } from '../../components/ConferenceCard';
import { SuccessModal } from '../../components/SuccessModal';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { Conference, ConferenceType } from '../../types/conference.types';
import { Search, Filter, AlertCircle, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

export const AttendeeEvents: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ConferenceType | 'todas'>(
    'todas'
  );
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [registeringConferenceId, setRegisteringConferenceId] = useState<
    string | null
  >(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredConferenceTitle, setRegisteredConferenceTitle] = useState('');
  const [registeredQrCode, setRegisteredQrCode] = useState('');

  const loadConferences = useCallback(() => api.getConferences(), []);

  const {
    data: conferences,
    loading,
    error,
    refetch,
  } = useApi<Conference[]>(loadConferences, []);

  const availableConferences = conferences.filter(
    (conference) =>
      conference.status !== 'cancelada' && conference.status !== 'finalizada'
  );

  const filteredConferences = availableConferences.filter((conference) => {
    const normalizedSearch = searchQuery.toLowerCase();

    const matchesSearch =
      conference.title.toLowerCase().includes(normalizedSearch) ||
      conference.description.toLowerCase().includes(normalizedSearch) ||
      conference.location.toLowerCase().includes(normalizedSearch) ||
      conference.speaker.name.toLowerCase().includes(normalizedSearch);

    const matchesType =
      filterType === 'todas' || conference.type === filterType;

    return matchesSearch && matchesType;
  });

  const handleReserveConference = async (conferenceId: string) => {
    setReservationError(null);

    try {
      setRegisteringConferenceId(conferenceId);

      const reservation = await api.reserveConference(conferenceId);

      setRegisteredConferenceTitle(reservation.conference.title);
      setRegisteredQrCode(reservation.qrCode);
      setShowSuccessModal(true);

      await refetch();
    } catch (err) {
      setReservationError(
        err instanceof Error
          ? err.message
          : 'No se pudo completar la reservación.'
      );
    } finally {
      setRegisteringConferenceId(null);
    }
  };

  const handleViewDetails = (conferenceId: string) => {
    navigate(`/conference/${conferenceId}`);
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
            Conferencias Disponibles
          </h1>

          <p className="text-lg text-gray-600">
            Explora las conferencias disponibles y reserva tu plaza como
            asistente.
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

              <Input
                type="text"
                placeholder="Buscar por título, ubicación o conferencista..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />

              <Select
                value={filterType}
                onValueChange={(value) =>
                  setFilterType(value as ConferenceType | 'todas')
                }
              >
                <SelectTrigger
                  className="w-[220px]"
                  aria-label="Filtrar por modalidad"
                >
                  <SelectValue placeholder="Modalidad" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="todas">Todas las modalidades</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="híbrida">Híbrida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {filteredConferences.length}{' '}
              {filteredConferences.length === 1
                ? 'conferencia encontrada'
                : 'conferencias encontradas'}
            </p>
          </div>
        </Card>

        {reservationError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5" />

            <div>
              <h2 className="text-lg mb-1">No se pudo reservar</h2>
              <p>{reservationError}</p>
            </div>
          </div>
        )}

        {registeringConferenceId && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl p-4 mb-6">
            Procesando reservación...
          </div>
        )}

        {loading && (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <h3 className="text-xl mb-2 text-gray-900">
              Cargando conferencias
            </h3>

            <p className="text-gray-600">
              Consultando datos reales desde la API...
            </p>
          </Card>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5" />

            <div>
              <h2 className="text-lg mb-1">
                No se pudieron cargar las conferencias
              </h2>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && filteredConferences.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConferences.map((conference) => (
              <ConferenceCard
                key={conference.id}
                conference={conference}
                onRegister={handleReserveConference}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredConferences.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <h3 className="text-xl mb-2 text-gray-900">
              No se encontraron conferencias
            </h3>

            <p className="text-gray-600">
              Intenta ajustar la búsqueda o cambiar el filtro de modalidad.
            </p>
          </Card>
        )}
      </main>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="¡Reservación confirmada!"
        message={`Tu plaza para "${registeredConferenceTitle}" fue reservada correctamente. Código QR: ${registeredQrCode}`}
      />
    </div>
  );
};

export default AttendeeEvents;
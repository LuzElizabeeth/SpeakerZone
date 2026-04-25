import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { QRCodeSVG } from 'qrcode.react';
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle,
  Clock,
  Copy,
  Loader2,
  MapPin,
  QrCode,
  RefreshCw,
  Ticket,
  Trash2,
  User,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { AppHeader } from '../../components/AppHeader';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { Reservation, RegistrationStatus } from '../../types/conference.types';

const statusLabels: Record<RegistrationStatus, string> = {
  confirmada: 'Confirmada',
  pendiente: 'Pendiente',
  cancelada: 'Cancelada',
};

const statusClasses: Record<RegistrationStatus, string> = {
  confirmada: 'bg-green-100 text-green-700',
  pendiente: 'bg-yellow-100 text-yellow-700',
  cancelada: 'bg-gray-200 text-gray-600',
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatRegisteredAt = (date: string) => {
  return new Date(date).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const AttendeeReservations: React.FC = () => {
  const loadReservations = useCallback(() => api.getMyReservations(), []);

  const {
    data: reservations,
    loading,
    error,
    refetch,
  } = useApi<Reservation[]>(loadReservations, []);

  const [cancelingReservationId, setCancelingReservationId] = useState<
    string | null
  >(null);

  const sortedReservations = useMemo(() => {
    return [...reservations].sort((a, b) => {
      const dateA = new Date(
        `${a.conference.date}T${a.conference.time || '00:00'}`
      ).getTime();

      const dateB = new Date(
        `${b.conference.date}T${b.conference.time || '00:00'}`
      ).getTime();

      return dateA - dateB;
    });
  }, [reservations]);

  const stats = useMemo(() => {
    return {
      total: reservations.length,
      checkedIn: reservations.filter((item) => item.checkedIn).length,
      pendingCheckIn: reservations.filter((item) => !item.checkedIn).length,
    };
  }, [reservations]);

  const handleCopyQr = async (qrCode: string) => {
    try {
      await navigator.clipboard.writeText(qrCode);
      toast.success('Código QR copiado al portapapeles.');
    } catch {
      toast.error('No se pudo copiar el código QR.');
    }
  };

  const handleCancelReservation = async (reservation: Reservation) => {
    const confirmed = window.confirm(
      `¿Cancelar tu reserva para "${reservation.conference.title}"?`
    );

    if (!confirmed) return;

    try {
      setCancelingReservationId(reservation.id);

      await api.cancelReservation(reservation.id);

      toast.success('Reserva cancelada correctamente.');
      await refetch();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'No se pudo cancelar la reserva.'
      );
    } finally {
      setCancelingReservationId(null);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CalendarCheck className="w-8 h-8 text-blue-accent" />

              <h1 className="text-3xl lg:text-4xl text-gray-900">
                Mis Reservas
              </h1>
            </div>

            <p className="text-lg text-gray-600">
              Consulta tus conferencias reservadas, códigos QR y estado de
              asistencia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={refetch}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              Actualizar
            </button>

            <Link
              to="/attendee/events"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Ticket className="w-5 h-5" />
              Reservar conferencia
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Reservas activas"
            value={stats.total}
            icon={Ticket}
          />

          <StatCard
            label="Check-in realizado"
            value={stats.checkedIn}
            icon={CheckCircle}
          />

          <StatCard
            label="Pendientes de check-in"
            value={stats.pendingCheckIn}
            icon={QrCode}
          />
        </div>

        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Loader2 className="w-12 h-12 text-blue-accent animate-spin mx-auto mb-4" />

            <h2 className="text-xl text-gray-900 mb-2">
              Cargando reservas
            </h2>

            <p className="text-gray-600">
              Consultando tus registros desde PostgreSQL...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 mt-0.5" />

            <div>
              <h2 className="text-lg mb-1">
                No se pudieron cargar tus reservas
              </h2>

              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && sortedReservations.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <CalendarCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <h2 className="text-2xl text-gray-900 mb-2">
              Aún no tienes reservas
            </h2>

            <p className="text-gray-600 mb-6">
              Explora las conferencias disponibles y reserva tu plaza para
              generar tu código de acceso.
            </p>

            <Link
              to="/attendee/events"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Ticket className="w-5 h-5" />
              Ver conferencias
            </Link>
          </div>
        )}

        {!loading && !error && sortedReservations.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {sortedReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                isCanceling={cancelingReservationId === reservation.id}
                onCopyQr={handleCopyQr}
                onCancel={handleCancelReservation}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon }) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-3xl text-gray-900">{value}</p>
      </div>

      <div className="w-11 h-11 bg-blue-light rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-blue-accent" />
      </div>
    </div>
  </div>
);

interface ReservationCardProps {
  reservation: Reservation;
  isCanceling: boolean;
  onCopyQr: (qrCode: string) => void;
  onCancel: (reservation: Reservation) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  isCanceling,
  onCopyQr,
  onCancel,
}) => {
  const conference = reservation.conference;

  return (
    <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px]">
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                statusClasses[reservation.status]
              }`}
            >
              {statusLabels[reservation.status]}
            </span>

            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                reservation.checkedIn
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {reservation.checkedIn ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <QrCode className="w-3 h-3" />
              )}

              {reservation.checkedIn ? 'Check-in registrado' : 'QR pendiente'}
            </span>
          </div>

          <h2 className="text-2xl text-gray-900 mb-3">
            {conference.title}
          </h2>

          <p className="text-gray-600 mb-5 line-clamp-2">
            {conference.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <InfoItem
              icon={CalendarCheck}
              label="Fecha"
              value={formatDate(conference.date)}
            />

            <InfoItem
              icon={Clock}
              label="Hora"
              value={`${conference.time}${
                conference.endTime ? ` - ${conference.endTime}` : ''
              }`}
            />

            <InfoItem
              icon={MapPin}
              label="Ubicación"
              value={conference.location}
            />

            <InfoItem
              icon={User}
              label="Conferencista"
              value={conference.speaker.name}
            />
          </div>

          <div className="bg-muted rounded-xl p-4 mb-5">
            <p className="text-xs text-gray-500 mb-1">
              Reservado el
            </p>

            <p className="text-sm text-gray-800">
              {formatRegisteredAt(reservation.registeredAt)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => onCopyQr(reservation.qrCode)}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copiar código
            </button>

            <button
              type="button"
              onClick={() => onCancel(reservation)}
              disabled={isCanceling}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 border border-red-100 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-60"
            >
              {isCanceling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Cancelar reserva
            </button>
          </div>
        </div>

        <div className="bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-100 p-6 flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
            <QRCodeSVG
              value={reservation.qrCode}
              size={150}
              level="M"
              includeMargin
            />
          </div>

          <p className="text-xs text-gray-500 mb-1">
            Código de acceso
          </p>

          <code className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 break-all text-center max-w-full">
            {reservation.qrCode}
          </code>

          {reservation.checkedIn && reservation.checkedInAt && (
            <div className="mt-4 bg-green-50 border border-green-100 text-green-700 rounded-lg p-3 text-sm text-center">
              <CheckCircle className="w-5 h-5 mx-auto mb-1" />
              Check-in: {formatRegisteredAt(reservation.checkedInAt)}
            </div>
          )}

          {!reservation.checkedIn && (
            <div className="mt-4 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg p-3 text-sm text-center">
              <XCircle className="w-5 h-5 mx-auto mb-1" />
              Presenta este QR en el acceso.
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

interface InfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 bg-muted rounded-xl p-3">
    <Icon className="w-5 h-5 text-blue-accent mt-0.5 flex-shrink-0" />

    <div className="min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-900 break-words">{value}</p>
    </div>
  </div>
);

export default AttendeeReservations;

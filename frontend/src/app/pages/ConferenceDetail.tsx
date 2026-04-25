import React, { useCallback, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Share2,
  Heart,
  Zap,
  CheckCircle,
  Globe,
  Video,
  Building,
  AlertCircle,
} from 'lucide-react';
import { SuccessModal } from '../components/SuccessModal';
import { Conference } from '../types/conference.types';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

export const ConferenceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredQrCode, setRegisteredQrCode] = useState('');

  const loadConference = useCallback(
    () =>
      id
        ? api.getConferenceById(id)
        : Promise.reject(new Error('ID inválido')),
    [id]
  );

  const {
    data: conference,
    loading,
    error,
    refetch,
  } = useApi<Conference | null>(loadConference, null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted text-gray-600">
        Cargando conferencia...
      </div>
    );
  }

  if (error || !conference) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="text-3xl mb-4 text-gray-900">
            Conferencia no encontrada
          </h1>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Conferencias
          </Link>
        </div>
      </div>
    );
  }

  const availableSpots = Math.max(
    conference.capacity - conference.registeredCount,
    0
  );

  const isFullyBooked = availableSpots === 0;

  const formattedDate = new Date(conference.date).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleRegister = async () => {
    setReservationError(null);

    if (isFullyBooked) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'attendee') {
      setReservationError(
        'Solo los usuarios con perfil de asistente pueden reservar conferencias.'
      );
      return;
    }

    try {
      setIsRegistering(true);

      const reservation = await api.reserveConference(conference.id);

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
      setIsRegistering(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: conference.title,
        text: conference.description,
        url: window.location.href,
      });
    }
  };

  const getTypeIcon = (type: Conference['type']) => {
    switch (type) {
      case 'presencial':
        return <Building className="w-5 h-5" />;
      case 'virtual':
        return <Video className="w-5 h-5" />;
      case 'híbrida':
        return <Globe className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  const typeLabels: Record<Conference['type'], string> = {
    presencial: 'Presencial',
    virtual: 'Virtual',
    híbrida: 'Híbrida',
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>

                <span className="text-xl text-gray-900">
                  Hub académico
                </span>
              </Link>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>
            </div>

            <Link
              to={isAuthenticated ? `/${user?.role}/dashboard` : '/login'}
              className="px-4 py-2 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all"
            >
              Mi Perfil
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {reservationError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <div>
              <h2 className="text-lg mb-1">No se pudo reservar</h2>
              <p>{reservationError}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <img
                src={conference.imageUrl}
                alt={conference.title}
                className="w-full h-80 object-cover"
              />

              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-light text-blue-accent rounded-full text-sm">
                    {getTypeIcon(conference.type)}
                    {typeLabels[conference.type]}
                  </span>

                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {conference.status}
                  </span>
                </div>

                <h1 className="text-4xl mb-4 text-gray-900">
                  {conference.title}
                </h1>

                <p className="text-lg text-gray-600 mb-6">
                  {conference.description}
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-accent" />

                    <div>
                      <p className="text-xs text-gray-500">Fecha</p>
                      <p className="text-sm text-gray-900 capitalize">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Clock className="w-5 h-5 text-blue-accent" />

                    <div>
                      <p className="text-xs text-gray-500">Hora</p>
                      <p className="text-sm text-gray-900">
                        {conference.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-accent" />

                    <div>
                      <p className="text-xs text-gray-500">Lugar</p>
                      <p className="text-sm text-gray-900">
                        {conference.location}
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl mb-4 text-gray-900">
                  Conferencista
                </h2>

                <div className="flex items-center gap-4 p-6 bg-muted rounded-xl">
                  <img
                    src={conference.speaker.avatarUrl}
                    alt={conference.speaker.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="text-xl text-gray-900">
                      {conference.speaker.name}
                    </h3>

                    <p className="text-blue-accent">
                      {conference.speaker.role}
                    </p>

                    <p className="text-sm text-gray-600">
                      {conference.speaker.organization}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">
                  Reservar Plaza
                </h2>

                <button
                  type="button"
                  onClick={() => setIsFavorite(!isFavorite)}
                  aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Ocupación</span>

                  <span className="text-sm text-gray-900">
                    {conference.registeredCount}/{conference.capacity}
                  </span>
                </div>

                <div className="w-full">
                <progress
                  value={conference.registeredCount}
                  max={conference.capacity}
                  aria-label="Nivel de ocupación de la conferencia"
                  className="w-full h-3 overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-blue-accent [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-blue-accent"
                />
              </div>

                <p className="text-sm text-gray-500 mt-2">
                  {availableSpots} plazas disponibles
                </p>
              </div>

              <button
                type="button"
                onClick={handleRegister}
                disabled={isFullyBooked || isRegistering}
                className="w-full py-4 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {isFullyBooked
                  ? 'Cupo Agotado'
                  : isRegistering
                    ? 'Reservando...'
                    : 'Reservar mi Plaza'}
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="w-full py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Compartir
              </button>

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Confirmación instantánea
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Código QR para acceso
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-accent" />
                  Cupos actualizados desde PostgreSQL
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="¡Reservación confirmada!"
        message={`Tu plaza para "${conference.title}" fue reservada correctamente. Código QR: ${registeredQrCode}`}
      />
    </div>
  );
};

export default ConferenceDetail;

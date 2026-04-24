import React, { useState } from 'react';
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
  Building
} from 'lucide-react';
import { mockConferences, getAvailableSpots } from '../data/mockConferences';
import { SuccessModal } from '../components/SuccessModal';
import { Conference } from '../types/conference.types';

export const ConferenceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const conference = mockConferences.find(c => c.id === id);

  if (!conference) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="text-3xl mb-4 text-gray-900">Conferencia no encontrada</h1>
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

  const availableSpots = getAvailableSpots(conference);
  const isFullyBooked = availableSpots === 0;
  const occupancyPercentage = (conference.registeredCount / conference.capacity) * 100;

  const conferenceDate = new Date(conference.date);
  const formattedDate = conferenceDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleRegister = () => {
    if (!isFullyBooked) {
      setShowSuccessModal(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: conference.title,
        text: conference.description,
        url: window.location.href
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
    }
  };

  const typeLabels: Record<Conference['type'], string> = {
    presencial: 'Presencial',
    virtual: 'Virtual',
    híbrida: 'Híbrida'
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl text-gray-900">SpeakerZone</span>
              </Link>

              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>
            </div>

            <Link
              to="/login"
              className="px-4 py-2 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all"
            >
              Mi Perfil
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen Hero */}
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <img
                src={conference.imageUrl}
                alt={conference.title}
                className="w-full h-full object-cover"
              />
              {isFullyBooked && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg">
                    Cupo Agotado
                  </span>
                </div>
              )}
            </div>

            {/* Título y Acciones */}
            <div className="bg-white rounded-xl p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-accent text-white rounded-full text-sm flex items-center gap-2">
                      {getTypeIcon(conference.type)}
                      {typeLabels[conference.type]}
                    </span>
                    {conference.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-light text-blue-accent rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-3xl lg:text-4xl mb-3 text-gray-900">
                    {conference.title}
                  </h1>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-lg transition-all ${
                      isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Detalles Clave */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-accent" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="text-gray-900">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Clock className="w-6 h-6 text-blue-accent" />
                  <div>
                    <p className="text-sm text-gray-500">Hora</p>
                    <p className="text-gray-900">{conference.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-accent" />
                  <div>
                    <p className="text-sm text-gray-500">Ubicación</p>
                    <p className="text-gray-900">{conference.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Users className="w-6 h-6 text-blue-accent" />
                  <div>
                    <p className="text-sm text-gray-500">Capacidad</p>
                    <p className="text-gray-900">{conference.registeredCount} / {conference.capacity}</p>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <h2 className="text-2xl mb-3 text-gray-900">Descripción</h2>
                <p className="text-gray-600 leading-relaxed">
                  {conference.description}
                </p>
              </div>

              {/* Speaker Info Detallada */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-2xl mb-4 text-gray-900">Conferencista</h2>
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-light to-purple-50 rounded-lg">
                  <img
                    src={conference.speaker.avatarUrl}
                    alt={conference.speaker.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl mb-1 text-gray-900">{conference.speaker.name}</h3>
                    <p className="text-blue-accent mb-2">{conference.speaker.role}</p>
                    <p className="text-sm text-gray-600 mb-2">{conference.speaker.organization}</p>
                    <p className="text-gray-700">{conference.speaker.bio}</p>
                  </div>
                </div>
              </div>

              {/* Qué Aprenderás */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-2xl mb-4 text-gray-900">Qué Aprenderás</h2>
                <div className="space-y-3">
                  {[
                    'Conceptos fundamentales y mejores prácticas del tema',
                    'Casos de uso reales y aplicaciones prácticas',
                    'Estrategias para implementar lo aprendido',
                    'Networking con otros profesionales del sector'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar de Registro */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
              <h3 className="text-2xl mb-4 text-gray-900">Reservar Plaza</h3>

              {/* Precio */}
              <div className="mb-6">
                <p className="text-4xl text-blue-accent mb-1">Gratis</p>
                <p className="text-sm text-gray-500">Entrada gratuita</p>
              </div>

              {/* Barra de ocupación */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Ocupación</span>
                  <span className="text-sm text-gray-900">{occupancyPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      occupancyPercentage >= 90 
                        ? 'bg-red-500' 
                        : occupancyPercentage >= 70 
                        ? 'bg-yellow-500' 
                        : 'bg-blue-accent'
                    }`}
                    style={{ width: `${occupancyPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {availableSpots} {availableSpots === 1 ? 'plaza disponible' : 'plazas disponibles'}
                </p>
              </div>

              {/* Botón de Registro */}
              <button
                onClick={handleRegister}
                disabled={isFullyBooked}
                className={`w-full py-4 rounded-lg text-center transition-all mb-4 ${
                  isFullyBooked
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                {isFullyBooked ? 'Sin Disponibilidad' : 'Reservar Plaza Ahora'}
              </button>

              {/* Beneficios */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <h4 className="text-sm text-gray-500 mb-3">Incluye:</h4>
                {[
                  'Acceso a la conferencia completa',
                  'Material descargable',
                  'Certificado de asistencia',
                  'Acceso al grupo privado'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Éxito */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/dashboard');
        }}
        title="¡Registro Exitoso!"
        message={`Tu plaza para "${conference.title}" ha sido reservada. Recibirás un código QR por correo electrónico.`}
      />
    </div>
  );
};

export default ConferenceDetail;

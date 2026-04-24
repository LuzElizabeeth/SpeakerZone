import React from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Conference } from '../types/conference.types';

/**
 * Props del componente ConferenceCard
 */
interface ConferenceCardProps {
  conference: Conference;
  onRegister?: (conferenceId: string) => void;
  onViewDetails?: (conferenceId: string) => void;
  className?: string;
}

/**
 * Badge para indicar el tipo de conferencia
 */
const ConferenceTypeBadge: React.FC<{ type: Conference['type'] }> = ({ type }) => {
  const typeColors: Record<Conference['type'], string> = {
    presencial: 'bg-blue-accent text-white',
    virtual: 'bg-purple-500 text-white',
    híbrida: 'bg-gradient-to-r from-blue-accent to-purple-500 text-white'
  };

  const typeLabels: Record<Conference['type'], string> = {
    presencial: 'Presencial',
    virtual: 'Virtual',
    híbrida: 'Híbrida'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${typeColors[type]}`}>
      {typeLabels[type]}
    </span>
  );
};

/**
 * Componente principal: ConferenceCard
 * 
 * Tarjeta altamente reutilizable y tipada para mostrar información de conferencias
 * con diseño minimalista y feedback visual claro.
 */
export const ConferenceCard: React.FC<ConferenceCardProps> = ({
  conference,
  onRegister,
  onViewDetails,
  className = ''
}) => {
  const availableSpots = Math.max(conference.capacity - conference.registeredCount, 0);
  const isFullyBooked = availableSpots === 0;
  const occupancyPercentage = (conference.registeredCount / conference.capacity) * 100;

  // Formatear fecha
  const conferenceDate = new Date(conference.date);
  const formattedDate = conferenceDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(conference.id);
    }
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRegister && !isFullyBooked) {
      onRegister(conference.id);
    }
  };

  return (
    <div
      className={`group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 ${className}`}
      onClick={handleCardClick}
    >
      {/* Imagen de la conferencia */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={conference.imageUrl}
          alt={conference.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge tipo de conferencia */}
        <div className="absolute top-4 left-4">
          <ConferenceTypeBadge type={conference.type} />
        </div>

        {/* Indicador de cupo lleno */}
        {isFullyBooked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Cupo Agotado
            </span>
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-6">
        {/* Título */}
        <h3 className="text-xl mb-3 text-gray-900 group-hover:text-blue-accent transition-colors line-clamp-2">
          {conference.title}
        </h3>

        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {conference.description}
        </p>

        {/* Información del Speaker */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <img
            src={conference.speaker.avatarUrl}
            alt={conference.speaker.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm text-gray-900">{conference.speaker.name}</p>
            <p className="text-xs text-gray-500">{conference.speaker.role}</p>
          </div>
        </div>

        {/* Detalles: Fecha, Ubicación, Cupo */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-blue-accent" />
            <span>{formattedDate} • {conference.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-blue-accent" />
            <span className="line-clamp-1">{conference.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-blue-accent" />
            <span>
              {conference.registeredCount} / {conference.capacity} registrados
            </span>
          </div>
        </div>

        {/* Barra de progreso de ocupación */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
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
          <p className="text-xs text-gray-500 mt-1">
            {availableSpots} {availableSpots === 1 ? 'plaza disponible' : 'plazas disponibles'}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {conference.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-light text-blue-accent text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Botón de acción circular con icono */}
        <button
          onClick={handleRegisterClick}
          disabled={isFullyBooked}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
            isFullyBooked
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white hover:shadow-lg hover:scale-[1.02]'
          }`}
        >
          <span>{isFullyBooked ? 'Sin Disponibilidad' : 'Reservar Plaza'}</span>
          {!isFullyBooked && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default ConferenceCard;

import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Filter, Zap, ArrowLeft } from 'lucide-react';
import { ConferenceCard } from '../components/ConferenceCard';
import { SuccessModal } from '../components/SuccessModal';
import { ConferenceType } from '../types/conference.types';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ConferenceType | 'todas'>('todas');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredConferenceTitle, setRegisteredConferenceTitle] = useState('');

  const loadConferences = useCallback(() => api.getConferences(), []);

  const {
    data: conferences,
    loading,
    error,
  } = useApi(loadConferences, []);

  const filteredConferences = conferences.filter((conf) => {
    const matchesSearch =
      conf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conf.speaker.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'todas' || conf.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleRegister = (conferenceId: string) => {
    const conference = conferences.find((item) => item.id === conferenceId);

    if (conference) {
      setRegisteredConferenceTitle(conference.title);
      setShowSuccessModal(true);
    }
  };

  const handleViewDetails = (conferenceId: string) => {
    navigate(`/conference/${conferenceId}`);
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
                  SpeakerZone
                </span>
              </Link>

              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/attendee/reservations"
                className="px-4 py-2 text-blue-accent hover:bg-blue-light rounded-lg transition-colors"
              >
                Mis Reservas
              </Link>

              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all"
              >
                Mi Perfil
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-3 text-gray-900">
            Conferencias Disponibles
          </h1>

          <p className="text-lg text-gray-600">
            Datos cargados desde PostgreSQL mediante la API del backend.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                placeholder="Buscar por título, descripción o conferencista..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />

              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value as ConferenceType | 'todas')
                }
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="todas">Todas las modalidades</option>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="híbrida">Híbrida</option>
              </select>
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
        </div>

        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Cargando conferencias desde la API...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 mb-6">
            No se pudo conectar con el backend: {error}
          </div>
        )}

        {!loading && filteredConferences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConferences.map((conference) => (
              <ConferenceCard
                key={conference.id}
                conference={conference}
                onRegister={handleRegister}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Search className="w-10 h-10 text-gray-400 mx-auto mb-4" />

            <h3 className="text-xl mb-2 text-gray-900">
              No se encontraron conferencias
            </h3>

            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedType('todas');
              }}
              className="px-6 py-3 bg-blue-accent text-white rounded-lg hover:bg-blue-hover transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        ) : null}
      </main>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Módulo de reservas pendiente"
        message={`La conferencia "${registeredConferenceTitle}" todavía no se puede reservar de forma real. En la siguiente fase conectaremos este botón con PostgreSQL mediante registrations.`}
      />
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Filter, Zap, ArrowLeft } from 'lucide-react';
import { ConferenceCard } from '../components/ConferenceCard';
import { SuccessModal } from '../components/SuccessModal';
import { mockConferences } from '../data/mockConferences';
import { ConferenceType } from '../types/conference.types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ConferenceType | 'todas'>('todas');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredConferenceTitle, setRegisteredConferenceTitle] = useState('');

  // Filtrar conferencias
  const filteredConferences = mockConferences.filter(conf => {
    const matchesSearch = conf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conf.speaker.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'todas' || conf.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleRegister = (conferenceId: string) => {
    const conference = mockConferences.find(c => c.id === conferenceId);
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo y Navegación */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl text-gray-900">SpeakerZone</span>
              </Link>

              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-blue-accent hover:bg-blue-light rounded-lg transition-colors">
                Mis Reservas
              </button>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título y Descripción */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-3 text-gray-900">
            Conferencias Disponibles
          </h1>
          <p className="text-lg text-gray-600">
            Descubre y reserva tu plaza en las mejores conferencias de tecnología
          </p>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Barra de búsqueda */}
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

            {/* Filtro por tipo */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ConferenceType | 'todas')}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="todas">Todas las modalidades</option>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="híbrida">Híbrida</option>
              </select>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {filteredConferences.length} {filteredConferences.length === 1 ? 'conferencia encontrada' : 'conferencias encontradas'}
            </p>
          </div>
        </div>

        {/* Grid de Conferencias */}
        {filteredConferences.length > 0 ? (
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
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl mb-2 text-gray-900">
              No se encontraron conferencias
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar tus filtros o términos de búsqueda
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('todas');
              }}
              className="px-6 py-3 bg-blue-accent text-white rounded-lg hover:bg-blue-hover transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </main>

      {/* Modal de Éxito */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="¡Registro Exitoso!"
        message={`Tu plaza para "${registeredConferenceTitle}" ha sido reservada. Recibirás un código QR por correo electrónico.`}
      />
    </div>
  );
};

export default Dashboard;
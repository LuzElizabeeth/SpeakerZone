import React, { useState } from 'react';
import { Link } from 'react-router';
import { Calendar, MapPin, Users, Clock, Filter, Search } from 'lucide-react';
import { AppHeader } from '../../components/AppHeader';
import { mockConferences } from '../../data/mockConferences';
import { ConferenceStatus } from '../../types/conference.types';

export const SpeakerConferences: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConferenceStatus | 'todas'>('todas');

  // Simular que el speaker tiene las primeras 3 conferencias
  const myConferences = mockConferences.slice(0, 3);

  const filteredConferences = myConferences.filter(conference => {
    const matchesSearch = conference.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conference.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'todas' || conference.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ConferenceStatus) => {
    const badges = {
      'próxima': 'bg-blue-100 text-blue-700',
      'en-curso': 'bg-green-100 text-green-700',
      'finalizada': 'bg-gray-100 text-gray-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return badges[status] || badges['próxima'];
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-3 text-gray-900">
            Mis Conferencias
          </h1>
          <p className="text-lg text-gray-600">
            Gestiona tus conferencias asignadas y revisa los detalles
          </p>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conferencias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none"
              />
            </div>

            {/* Filtro por Estado */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ConferenceStatus | 'todas')}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="todas">Todos los estados</option>
                <option value="próxima">Próximas</option>
                <option value="en-curso">En Curso</option>
                <option value="finalizada">Finalizadas</option>
                <option value="cancelada">Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Conferencias */}
        {filteredConferences.length > 0 ? (
          <div className="space-y-6">
            {filteredConferences.map((conference) => (
              <div
                key={conference.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="md:flex">
                  {/* Imagen */}
                  <div className="md:w-80 h-64 md:h-auto">
                    <img
                      src={conference.imageUrl}
                      alt={conference.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(conference.status)}`}>
                            {conference.status.charAt(0).toUpperCase() + conference.status.slice(1)}
                          </span>
                          {conference.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-light text-blue-accent rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-2xl mb-3 text-gray-900">{conference.title}</h2>
                        <p className="text-gray-600 mb-4 line-clamp-2">{conference.description}</p>
                      </div>
                    </div>

                    {/* Detalles */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-light rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fecha</p>
                          <p className="text-gray-900">
                            {new Date(conference.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-light rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Hora</p>
                          <p className="text-gray-900">{conference.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-light rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ubicación</p>
                          <p className="text-gray-900">{conference.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-light rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Asistentes</p>
                          <p className="text-gray-900">
                            {conference.registeredCount} / {conference.capacity}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/conference/${conference.id}`}
                        className="px-6 py-3 bg-blue-accent text-white rounded-lg hover:bg-blue-hover transition-colors"
                      >
                        Ver Detalles
                      </Link>
                      <Link
                        to={`/speaker/attendees?conference=${conference.id}`}
                        className="px-6 py-3 bg-white border-2 border-blue-accent text-blue-accent rounded-lg hover:bg-blue-light transition-colors"
                      >
                        Ver Asistentes ({conference.registeredCount})
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-gray-900">No se encontraron conferencias</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'todas'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No tienes conferencias asignadas aún'}
            </p>
            {(searchQuery || statusFilter !== 'todas') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('todas');
                }}
                className="px-6 py-3 bg-blue-accent text-white rounded-lg hover:bg-blue-hover transition-colors"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SpeakerConferences;

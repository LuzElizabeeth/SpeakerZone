import React, { useEffect, useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { api, EventFromApi } from '../../services/api';
import {
  Calendar,
  Users,
  MapPin,
  Search,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Input } from '../../components/ui/input';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<EventFromApi[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getEvents()
      .then(setEvents)
      .catch((err) => setError(err.message || 'Error al cargar eventos'))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'activo':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'próximo':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'finalizado':
        return <XCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
              Gestión de Eventos
            </h1>
            <p className="text-lg text-gray-600">
              Eventos cargados desde PostgreSQL con base en el programa del Excel.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar eventos por nombre o ubicación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-gray-700">
            Cargando eventos...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl shadow-sm p-8">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl text-gray-900">{event.name}</h3>
                    {getStatusIcon(event.status)}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.startDate).toLocaleDateString('es-MX')} - {new Date(event.endDate).toLocaleDateString('es-MX')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{event.totalAttendees} asistentes registrados</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{event.totalConferences} conferencias</span>
                    </div>
                  </div>

                  <div className="inline-flex px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                    {event.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredEvents.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-gray-900">
              No se encontraron eventos
            </h3>
            <p className="text-gray-600">
              Intenta ajustar tu búsqueda.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminEvents;
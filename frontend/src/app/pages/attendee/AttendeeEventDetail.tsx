import React, { useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { AppHeader } from '../../components/AppHeader';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/button';

export const AttendeeEventDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const loadEvent = useCallback(() => {
    if (!id) {
      throw new Error('No se recibió el ID del evento');
    }

    return api.getEventById(id);
  }, [id]);

  const { data: event, loading, error } = useApi(loadEvent, null);

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/attendee/events')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a eventos
        </Button>

        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Cargando evento...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-1" />
            <div>
              <h2 className="text-lg mb-1">No se pudo cargar el evento</h2>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && event && (
          <section className="bg-white rounded-xl shadow-sm overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-72 object-cover"
            />

            <div className="p-8">
              <div className="mb-6">
                <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm mb-4">
                  {event.status}
                </span>

                <h1 className="text-3xl lg:text-4xl text-gray-900 mb-4">
                  {event.name}
                </h1>

                <p className="text-lg text-gray-600">
                  {event.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-lg bg-gray-50 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-accent" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de inicio</p>
                    <p className="text-gray-900">
                      {new Date(event.startDate).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-accent" />
                  <div>
                    <p className="text-sm text-gray-500">Ubicación</p>
                    <p className="text-gray-900">{event.location}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-accent" />
                  <div>
                    <p className="text-sm text-gray-500">Asistentes</p>
                    <p className="text-gray-900">
                      {event.totalAttendees} registrados
                    </p>
                  </div>
                </div>
              </div>

              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white">
                  Ver conferencias disponibles
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AttendeeEventDetail;
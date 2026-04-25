import React, { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { AppHeader } from '../../components/AppHeader';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  AlertCircle,
  BookOpen,
  Wrench,
  Sparkles,
  Presentation,
  ArrowRight,
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const activityTypes = [
  {
    value: 'all',
    label: 'Todas',
    icon: Presentation,
  },
  {
    value: 'conferencia',
    label: 'Conferencias',
    icon: BookOpen,
  },
  {
    value: 'taller',
    label: 'Talleres',
    icon: Wrench,
  },
  {
    value: 'evento',
    label: 'Eventos',
    icon: Calendar,
  },
  {
    value: 'actividad_especial',
    label: 'Actividades especiales',
    icon: Sparkles,
  },
];

export const AttendeeProgramDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState('all');

  const loadProgram = useCallback(() => {
    if (!id) {
      return Promise.resolve(null);
    }

    return api.getProgramById(id);
  }, [id]);

  const {
    data: program,
    loading,
    error,
  } = useApi(loadProgram, null);

  const loadActivities = useCallback(() => {
    if (!id) {
      return Promise.resolve([]);
    }

    return api.getActivitiesByProgram(id);
  }, [id]);

  const {
    data: activities = [],
  } = useApi(loadActivities, []);

  const filteredActivities =
    selectedType === 'all'
      ? activities
      : activities.filter(
          (activity) =>
            activity.activityType
              ?.toLowerCase()
              .trim() === selectedType
        );

  const getTypeBadge = (type: string) => {
    const normalizedType = type
      ?.toLowerCase()
      .trim();

    const variants: Record<string, string> = {
      conferencia:
        'bg-blue-100 text-blue-700',
      taller:
        'bg-green-100 text-green-700',
      evento:
        'bg-purple-100 text-purple-700',
      actividad_especial:
        'bg-yellow-100 text-yellow-700',
    };

    const labels: Record<string, string> = {
      conferencia: 'Conferencia',
      taller: 'Taller',
      evento: 'Evento',
      actividad_especial:
        'Actividad especial',
    };

    return (
      <Badge
        className={
          variants[normalizedType] ||
          'bg-gray-100 text-gray-700'
        }
      >
        {labels[normalizedType] || type}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            navigate('/attendee/programs')
          }
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a programas
        </Button>

        {loading && (
          <Card className="p-10 text-center text-gray-600">
            Cargando programa académico...
          </Card>
        )}

        {error && (
          <Card className="p-6 border border-red-200 bg-red-50">
            <div className="flex items-start gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 mt-1" />

              <div>
                <h2 className="text-lg mb-1">
                  No se pudo cargar el programa
                </h2>

                <p>{error}</p>
              </div>
            </div>
          </Card>
        )}

        {!loading &&
          !error &&
          !program && (
            <Card className="p-8 text-center">
              <h2 className="text-xl text-gray-900 mb-2">
                Programa no encontrado
              </h2>

              <p className="text-gray-600">
                No fue posible encontrar la
                información solicitada.
              </p>
            </Card>
          )}

        {!loading &&
          !error &&
          program && (
            <>
              <section className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                <img
                  src={program.imageUrl}
                  alt={program.name}
                  className="w-full h-72 object-cover"
                />

                <div className="p-8">
                  <div className="mb-8">
                    <Badge className="mb-4 bg-blue-100 text-blue-700">
                      Programa Académico
                    </Badge>

                    <h1 className="text-3xl lg:text-4xl text-gray-900 mb-4">
                      {program.name}
                    </h1>

                    <p className="text-lg text-gray-600 leading-relaxed">
                      {program.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-lg bg-gray-50 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-accent" />

                      <div>
                        <p className="text-sm text-gray-500">
                          Inicio
                        </p>

                        <p className="text-gray-900">
                          {new Date(
                            program.startDate
                          ).toLocaleDateString(
                            'es-MX'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50 flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-accent" />

                      <div>
                        <p className="text-sm text-gray-500">
                          Ubicación
                        </p>

                        <p className="text-gray-900">
                          {program.location}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50 flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-accent" />

                      <div>
                        <p className="text-sm text-gray-500">
                          Actividades
                        </p>

                        <p className="text-gray-900">
                          {program.totalActivities ||
                            0}{' '}
                          programadas
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link to="/attendee/calendar">
                      <Button variant="outline">
                        Ver calendario
                      </Button>
                    </Link>

                    <Link to="/attendee/reservations">
                      <Button className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white">
                        Mis inscripciones
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-6">
                  <h2 className="text-2xl text-gray-900 mb-2">
                    Actividades del programa
                  </h2>

                  <p className="text-gray-600">
                    Explora conferencias,
                    talleres y actividades
                    especiales
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                  {activityTypes.map((type) => {
                    const Icon = type.icon;
                    const isActive =
                      selectedType ===
                      type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setSelectedType(
                            type.value
                          )
                        }
                        className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredActivities.map(
                    (activity) => (
                      <Card
                        key={activity.id}
                        className="p-6"
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                                 <Card  className="overflow-hidden hover:shadow-lg transition-shadow">
                                <img
                                    src={activity.imageUrl}
                                    alt={activity.title}
                                    className="w-full h-48 object-cover"
                                />
                       
                            </Card>
                            <h3 className="text-xl text-gray-900 mb-2">
                              {
                                activity.title
                              }
                            </h3>

                            {getTypeBadge(
                              activity.activityType
                            )}
                          </div>
                        </div>

                        <div className="space-y-3 mb-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />

                            <span>
                              {
                                activity
                                  .speaker
                                  ?.name
                              }
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />

                            <span>
                              {
                                activity.time
                              }
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />

                            <span>
                              {
                                activity.location
                              }
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />

                            <span>
                              {
                                activity.capacity
                              }{' '}
                              lugares
                              disponibles
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/attendee/activities/${activity.id}`}
                        >
                          <Button className="w-full bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white">
                            Ver detalles e
                            inscribirme

                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </Card>
                    )
                  )}
                </div>
              </section>
            </>
          )}
      </main>
    </div>
  );
};

export default AttendeeProgramDetail;

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router';
import { AppHeader } from '../../components/AppHeader';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

import {
  Calendar,
  MapPin,
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  Clock,
  Layers,
  AlertCircle,
} from 'lucide-react';

import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export const AttendeeProgramList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'todos' | 'próximo' | 'activo' | 'finalizado'
  >('todos');

  const loadPrograms = useCallback(() => {
    return api.getPrograms();
  }, []);

  const {
    data: programs = [],
    loading,
    error,
  } = useApi(loadPrograms, []);

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      program.location
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'todos' ||
      program.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      próximo: {
        icon: Clock,
        color: 'bg-blue-100 text-blue-700',
      },
      activo: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700',
      },
      finalizado: {
        icon: CheckCircle,
        color: 'bg-gray-100 text-gray-700',
      },
    };

    const variant =
      variants[
        status as keyof typeof variants
      ] || variants.próximo;

    const Icon = variant.icon;

    return (
      <Badge className={variant.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() +
          status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return 'Fecha no disponible';
    }

    return parsedDate.toLocaleDateString(
      'es-MX',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    );
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
            Programas Académicos
          </h1>

          <p className="text-lg text-gray-600">
            Explora congresos, semanas temáticas y
            programas universitarios
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <Input
                type="text"
                placeholder="Buscar programas por nombre o ubicación..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />

              <Select
                value={filterStatus}
                onValueChange={(value) =>
                  setFilterStatus(
                    value as typeof filterStatus
                  )
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="todos">
                    Todos
                  </SelectItem>

                  <SelectItem value="próximo">
                    Próximos
                  </SelectItem>

                  <SelectItem value="activo">
                    Activos
                  </SelectItem>

                  <SelectItem value="finalizado">
                    Finalizados
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {filteredPrograms.length} programas
              encontrados
            </p>
          </div>
        </Card>

        {loading && (
          <Card className="p-10 text-center text-gray-600">
            Cargando programas académicos...
          </Card>
        )}

        {error && (
          <Card className="p-6 border border-red-200 bg-red-50">
            <div className="flex items-start gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 mt-1" />

              <div>
                <h2 className="text-lg mb-1">
                  No se pudieron cargar los programas
                </h2>

                <p>{error}</p>
              </div>
            </div>
          </Card>
        )}

        {!loading &&
          !error &&
          filteredPrograms.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => (
                <Card
                  key={program.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={program.imageUrl}
                    alt={program.name}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3 gap-3">
                      <h3 className="text-xl text-gray-900">
                        {program.name}
                      </h3>

                      {getStatusBadge(
                        program.status
                      )}
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {program.description}
                    </p>

                    <div className="space-y-3 mb-5">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />

                        <span>
                          {formatDate(
                            program.startDate
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />

                        <span className="truncate">
                          {program.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Layers className="w-4 h-4" />

                        <span>
                          {program.totalActivities ||
                            0}{' '}
                          actividades programadas
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/attendee/programs/${program.id}`}
                    >
                      <Button className="w-full bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white">
                        Explorar programa

                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

        {!loading &&
          !error &&
          filteredPrograms.length === 0 && (
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />

              <h3 className="text-xl mb-2 text-gray-900">
                No se encontraron programas
              </h3>

              <p className="text-gray-600">
                Intenta ajustar tus filtros de
                búsqueda
              </p>
            </Card>
          )}
      </main>
    </div>
  );
};

export default AttendeeProgramList;

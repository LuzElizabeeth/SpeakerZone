import React, { useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { mockConferences } from '../../data/mockConferences';
import { mockAttendees } from '../../data/mockData';
import { Conference } from '../../types/conference.types';
import { 
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  Award,
  User,
  Filter,
  Search
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export const AttendeeHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState<string>('todos');

  // Obtener conferencias a las que el usuario "asistió" (basado en mock data)
  const userAttendance = mockAttendees
    .filter(a => a.checkedIn) // Solo las que hizo check-in
    .map(a => {
      const conference = mockConferences.find(c => c.id === a.conferenceId);
      return conference ? { ...conference, attendedAt: a.registeredAt, qrCode: a.qrCode } : null;
    })
    .filter((c): c is Conference & { attendedAt: string; qrCode: string } => c !== null);

  const filteredHistory = userAttendance.filter(conf => {
    const matchesSearch = conf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conf.speaker.name.toLowerCase().includes(searchQuery.toLowerCase());
    const conferenceYear = new Date(conf.date).getFullYear().toString();
    const matchesYear = filterYear === 'todos' || conferenceYear === filterYear;
    return matchesSearch && matchesYear;
  });

  // Obtener años únicos
  const years = Array.from(new Set(userAttendance.map(c => new Date(c.date).getFullYear().toString())));

  const stats = {
    totalAttended: userAttendance.length,
    thisYear: userAttendance.filter(c => new Date(c.date).getFullYear() === new Date().getFullYear()).length,
    certificatesEarned: userAttendance.length // Cada conferencia completada da un certificado
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
            Historial de Eventos
          </h1>
          <p className="text-lg text-gray-600">
            Revisa todas las conferencias a las que has asistido
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl mb-1 text-gray-900">{stats.totalAttended}</p>
            <p className="text-sm text-gray-600">Eventos Asistidos</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl mb-1 text-gray-900">{stats.thisYear}</p>
            <p className="text-sm text-gray-600">Este Año</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl mb-1 text-gray-900">{stats.certificatesEarned}</p>
            <p className="text-sm text-gray-600">Certificados</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por título o conferencista..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los años</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {filteredHistory.length} eventos encontrados
            </p>
          </div>
        </Card>

        {/* History List */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map((conference) => (
              <Card key={conference.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-6">
                  <img
                    src={conference.imageUrl}
                    alt={conference.title}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl mb-2 text-gray-900">
                          {conference.title}
                        </h3>

                        <div className="flex items-center gap-2 mb-3">
                          <img
                            src={conference.speaker.avatarUrl}
                            alt={conference.speaker.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-gray-600">
                            {conference.speaker.name} - {conference.speaker.role}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(conference.date).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{conference.time}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate max-w-[200px]">{conference.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completado
                        </Badge>
                        <Badge variant="outline">
                          {conference.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-gray-100">
                      <Button variant="outline" size="sm">
                        <Award className="w-4 h-4 mr-2" />
                        Ver Certificado
                      </Button>
                      <Button variant="outline" size="sm">
                        <User className="w-4 h-4 mr-2" />
                        Sobre el Conferencista
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-gray-900">
              {searchQuery || filterYear !== 'todos' 
                ? 'No se encontraron eventos' 
                : 'Aún no has asistido a ningún evento'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterYear !== 'todos'
                ? 'Intenta ajustar tus filtros de búsqueda' 
                : 'Explora los eventos disponibles y regístrate para comenzar'}
            </p>
            {!searchQuery && filterYear === 'todos' && (
              <Button className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white">
                Explorar Eventos
              </Button>
            )}
          </Card>
        )}

        {/* Timeline Summary */}
        {filteredHistory.length > 0 && (
          <Card className="p-6 mt-8 bg-gradient-to-br from-blue-gradient-start to-blue-gradient-end text-white">
            <h3 className="text-xl mb-4">Tu Trayectoria en Hub académico</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-3xl mb-1">{stats.totalAttended}</p>
                <p className="text-sm opacity-90">Eventos completados</p>
              </div>
              <div>
                <p className="text-3xl mb-1">{stats.certificatesEarned}</p>
                <p className="text-sm opacity-90">Certificados obtenidos</p>
              </div>
              <div>
                <p className="text-3xl mb-1">
                  {Math.round((stats.totalAttended / mockConferences.length) * 100)}%
                </p>
                <p className="text-sm opacity-90">Tasa de participación</p>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AttendeeHistory;

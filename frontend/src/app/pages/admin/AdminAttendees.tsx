import React, { useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { mockAttendees } from '../../data/mockData';
import { mockConferences } from '../../data/mockConferences';
import { Attendee } from '../../types/conference.types';
import { 
  Search,
  Download,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Filter
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

export const AdminAttendees: React.FC = () => {
  const [attendees, setAttendees] = useState<Attendee[]>(mockAttendees);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterConference, setFilterConference] = useState<string>('todas');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'checkedIn' | 'pending'>('todos');

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesConference = filterConference === 'todas' || attendee.conferenceId === filterConference;
    const matchesStatus = filterStatus === 'todos' || 
                         (filterStatus === 'checkedIn' && attendee.checkedIn) ||
                         (filterStatus === 'pending' && !attendee.checkedIn);
    
    return matchesSearch && matchesConference && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Nombre', 'Email', 'Conferencia', 'Fecha de Registro', 'Check-in', 'Código QR'];
    const rows = filteredAttendees.map(attendee => {
      const conference = mockConferences.find(c => c.id === attendee.conferenceId);
      return [
        attendee.name,
        attendee.email,
        conference?.title || 'N/A',
        new Date(attendee.registeredAt).toLocaleDateString('es-ES'),
        attendee.checkedIn ? 'Sí' : 'No',
        attendee.qrCode
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `asistentes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('Lista de asistentes exportada exitosamente');
  };

  const toggleCheckIn = (attendeeId: string) => {
    setAttendees(attendees.map(attendee =>
      attendee.id === attendeeId
        ? { ...attendee, checkedIn: !attendee.checkedIn }
        : attendee
    ));
    
    const attendee = attendees.find(a => a.id === attendeeId);
    if (attendee) {
      toast.success(
        attendee.checkedIn 
          ? 'Check-in revertido' 
          : 'Check-in confirmado'
      );
    }
  };

  const stats = {
    total: attendees.length,
    checkedIn: attendees.filter(a => a.checkedIn).length,
    pending: attendees.filter(a => !a.checkedIn).length
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
              Gestión de Asistentes
            </h1>
            <p className="text-lg text-gray-600">
              Administra todos los asistentes registrados
            </p>
          </div>
          <Button
            onClick={handleExportCSV}
            className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Asistentes</p>
                <p className="text-3xl text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Con Check-in</p>
                <p className="text-3xl text-gray-900">{stats.checkedIn}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pendientes</p>
                <p className="text-3xl text-gray-900">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <Select value={filterConference} onValueChange={setFilterConference}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por conferencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las conferencias</SelectItem>
                  {mockConferences.map((conference) => (
                    <SelectItem key={conference.id} value={conference.id}>
                      {conference.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as 'todos' | 'checkedIn' | 'pending')}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="checkedIn">Con Check-in</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {filteredAttendees.length} asistentes encontrados
            </p>
          </div>
        </div>

        {/* Attendees Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-gray-700">Asistente</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-700">Conferencia</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-700">Fecha de Registro</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-700">Código QR</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-700">Estado</th>
                  <th className="px-6 py-4 text-right text-sm text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAttendees.map((attendee) => {
                  const conference = mockConferences.find(c => c.id === attendee.conferenceId);
                  
                  return (
                    <tr key={attendee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900">{attendee.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Mail className="w-3 h-3" />
                            <span>{attendee.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 max-w-xs truncate">
                          {conference?.title || 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {new Date(attendee.registeredAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {attendee.qrCode}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={attendee.checkedIn ? "default" : "secondary"}
                          className={attendee.checkedIn ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                        >
                          {attendee.checkedIn ? (
                            <>
                              <UserCheck className="w-3 h-3 mr-1" />
                              Check-in
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3 mr-1" />
                              Pendiente
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <Button
                            onClick={() => toggleCheckIn(attendee.id)}
                            variant="outline"
                            size="sm"
                          >
                            {attendee.checkedIn ? 'Revertir' : 'Confirmar'} Check-in
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAttendees.length === 0 && (
            <div className="p-12 text-center">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl mb-2 text-gray-900">
                No se encontraron asistentes
              </h3>
              <p className="text-gray-600">
                Intenta ajustar tus filtros de búsqueda
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAttendees;

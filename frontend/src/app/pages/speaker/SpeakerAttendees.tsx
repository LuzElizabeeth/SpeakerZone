import React, { useState } from 'react';
import { Search, Download, Mail, CheckCircle, XCircle, Filter } from 'lucide-react';
import { AppHeader } from '../../components/AppHeader';
import { Attendee } from '../../types/conference.types';
import { mockConferences } from '../../data/mockConferences';

// Mock data de asistentes
const mockAttendees: Attendee[] = [
  {
    id: '1',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    registeredAt: '2026-03-10T10:30:00',
    qrCode: 'QR-1234-ABCD',
    checkedIn: true,
    conferenceId: 'c1'
  },
  {
    id: '2',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    registeredAt: '2026-03-11T14:20:00',
    qrCode: 'QR-5678-EFGH',
    checkedIn: true,
    conferenceId: 'c1'
  },
  {
    id: '3',
    name: 'Juan Martínez',
    email: 'juan.martinez@email.com',
    registeredAt: '2026-03-12T09:15:00',
    qrCode: 'QR-9012-IJKL',
    checkedIn: false,
    conferenceId: 'c1'
  },
  {
    id: '4',
    name: 'Ana López',
    email: 'ana.lopez@email.com',
    registeredAt: '2026-03-13T16:45:00',
    qrCode: 'QR-3456-MNOP',
    checkedIn: true,
    conferenceId: 'c1'
  },
  {
    id: '5',
    name: 'Pedro Sánchez',
    email: 'pedro.sanchez@email.com',
    registeredAt: '2026-03-14T11:00:00',
    qrCode: 'QR-7890-QRST',
    checkedIn: false,
    conferenceId: 'c1'
  }
];

export const SpeakerAttendees: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [conferenceFilter, setConferenceFilter] = useState('todas');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'confirmados' | 'pendientes'>('todos');

  const myConferences = mockConferences.slice(0, 3);

  const filteredAttendees = mockAttendees.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesConference = conferenceFilter === 'todas' || attendee.conferenceId === conferenceFilter;
    const matchesStatus = statusFilter === 'todos' || 
                         (statusFilter === 'confirmados' && attendee.checkedIn) ||
                         (statusFilter === 'pendientes' && !attendee.checkedIn);
    return matchesSearch && matchesConference && matchesStatus;
  });

  const totalAttendees = mockAttendees.length;
  const checkedIn = mockAttendees.filter(a => a.checkedIn).length;
  const checkInRate = ((checkedIn / totalAttendees) * 100).toFixed(0);

  const handleExportCSV = () => {
    const csv = [
      ['Nombre', 'Email', 'Fecha Registro', 'Código QR', 'Check-in'],
      ...filteredAttendees.map(a => [
        a.name,
        a.email,
        new Date(a.registeredAt).toLocaleString('es-ES'),
        a.qrCode,
        a.checkedIn ? 'Sí' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asistentes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-3 text-gray-900">
            Asistentes Registrados
          </h1>
          <p className="text-lg text-gray-600">
            Gestiona y consulta la lista de asistentes a tus conferencias
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Asistentes</p>
              <div className="w-10 h-10 bg-blue-light rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-accent" />
              </div>
            </div>
            <p className="text-3xl text-gray-900">{totalAttendees}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Check-in Confirmado</p>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl text-gray-900">{checkedIn}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Tasa de Asistencia</p>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl text-gray-900">{checkInRate}%</p>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* Búsqueda */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none"
              />
            </div>

            {/* Filtro por Conferencia */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={conferenceFilter}
                onChange={(e) => setConferenceFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="todas">Todas las conferencias</option>
                {myConferences.map(conf => (
                  <option key={conf.id} value={conf.id}>{conf.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtros de Estado */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                statusFilter === 'todos'
                  ? 'bg-blue-accent text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos ({totalAttendees})
            </button>
            <button
              onClick={() => setStatusFilter('confirmados')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                statusFilter === 'confirmados'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Confirmados ({checkedIn})
            </button>
            <button
              onClick={() => setStatusFilter('pendientes')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                statusFilter === 'pendientes'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pendientes ({totalAttendees - checkedIn})
            </button>

            <div className="ml-auto">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-blue-accent text-white rounded-lg hover:bg-blue-hover transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de Asistentes */}
        {filteredAttendees.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Asistente</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Email</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Fecha Registro</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Código QR</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAttendees.map((attendee) => (
                    <tr key={attendee.id} className="hover:bg-muted transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end rounded-full flex items-center justify-center text-white">
                            {attendee.name.charAt(0)}
                          </div>
                          <p className="text-gray-900">{attendee.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{attendee.email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(attendee.registeredAt).toLocaleString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                          {attendee.qrCode}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        {attendee.checkedIn ? (
                          <span className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm">Confirmado</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 text-orange-600">
                            <XCircle className="w-5 h-5" />
                            <span className="text-sm">Pendiente</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-gray-900">No se encontraron asistentes</h3>
            <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SpeakerAttendees;

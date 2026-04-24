import React, { useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { mockConferences } from '../../data/mockConferences';
import { mockSpeakers } from '../../data/mockData';
import { Conference, ConferenceType, ConferenceStatus } from '../../types/conference.types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  User
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

export const AdminConferences: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>(mockConferences);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ConferenceType | 'todas'>('todas');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingConference, setEditingConference] = useState<Conference | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'presencial' as ConferenceType,
    speakerId: '',
    capacity: '100'
  });

  const filteredConferences = conferences.filter(conf => {
    const matchesSearch = conf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conf.speaker.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'todas' || conf.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateConference = () => {
    const selectedSpeaker = mockSpeakers.find(s => s.id === formData.speakerId);
    if (!selectedSpeaker) {
      toast.error('Selecciona un conferencista');
      return;
    }

    const newConference: Conference = {
      id: `${conferences.length + 1}`,
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date).toISOString(),
      time: formData.time,
      location: formData.location,
      type: formData.type,
      status: 'próxima',
      speaker: selectedSpeaker,
      capacity: parseInt(formData.capacity),
      registeredCount: 0,
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      tags: []
    };

    setConferences([...conferences, newConference]);
    setIsCreateModalOpen(false);
    resetForm();
    toast.success('Conferencia creada exitosamente');
  };

  const handleUpdateConference = () => {
    if (!editingConference) return;

    const selectedSpeaker = mockSpeakers.find(s => s.id === formData.speakerId);
    if (!selectedSpeaker) {
      toast.error('Selecciona un conferencista');
      return;
    }

    const updatedConferences = conferences.map(conf =>
      conf.id === editingConference.id
        ? {
            ...conf,
            title: formData.title,
            description: formData.description,
            date: new Date(formData.date).toISOString(),
            time: formData.time,
            location: formData.location,
            type: formData.type,
            speaker: selectedSpeaker,
            capacity: parseInt(formData.capacity)
          }
        : conf
    );

    setConferences(updatedConferences);
    setEditingConference(null);
    resetForm();
    toast.success('Conferencia actualizada exitosamente');
  };

  const handleDeleteConference = (conferenceId: string) => {
    setConferences(conferences.filter(conf => conf.id !== conferenceId));
    toast.success('Conferencia eliminada exitosamente');
  };

  const openEditModal = (conference: Conference) => {
    setEditingConference(conference);
    setFormData({
      title: conference.title,
      description: conference.description,
      date: conference.date.split('T')[0],
      time: conference.time,
      location: conference.location,
      type: conference.type,
      speakerId: conference.speaker.id,
      capacity: conference.capacity.toString()
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: 'presencial',
      speakerId: '',
      capacity: '100'
    });
  };

  const getTypeColor = (type: ConferenceType) => {
    switch (type) {
      case 'presencial':
        return 'bg-blue-100 text-blue-700';
      case 'virtual':
        return 'bg-green-100 text-green-700';
      case 'híbrida':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
              Gestión de Conferencias
            </h1>
            <p className="text-lg text-gray-600">
              Administra todas las conferencias de la plataforma
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Conferencia
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
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
              <Select value={filterType} onValueChange={(value) => setFilterType(value as ConferenceType | 'todas')}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="híbrida">Híbrida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {filteredConferences.length} conferencias encontradas
            </p>
          </div>
        </div>

        {/* Conferences Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-gray-700">Conferencia</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-700">Conferencista</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-700">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-700">Tipo</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-700">Asistentes</th>
                  <th className="px-6 py-4 text-right text-sm text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredConferences.map((conference) => (
                  <tr key={conference.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={conference.imageUrl}
                          alt={conference.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-gray-900">{conference.title}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">{conference.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={conference.speaker.avatarUrl}
                          alt={conference.speaker.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm text-gray-900">{conference.speaker.name}</p>
                          <p className="text-xs text-gray-600">{conference.speaker.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(conference.date).toLocaleDateString('es-ES')}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{conference.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${getTypeColor(conference.type)}`}>
                        {conference.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {conference.registeredCount}/{conference.capacity}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-blue-gradient-start h-1.5 rounded-full"
                          style={{ width: `${(conference.registeredCount / conference.capacity) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => openEditModal(conference)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteConference(conference.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredConferences.length === 0 && (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl mb-2 text-gray-900">
                No se encontraron conferencias
              </h3>
              <p className="text-gray-600">
                Intenta ajustar tus filtros o crea una nueva conferencia
              </p>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        <Dialog open={isCreateModalOpen || editingConference !== null} onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setEditingConference(null);
            resetForm();
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingConference ? 'Editar Conferencia' : 'Crear Nueva Conferencia'}
              </DialogTitle>
              <DialogDescription>
                {editingConference ? 'Modifica la información de la conferencia' : 'Completa los datos para crear una nueva conferencia'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título de la Conferencia</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Inteligencia Artificial y el Futuro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe la conferencia..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Hora</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Centro de Convenciones Madrid"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Conferencia</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as ConferenceType })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="híbrida">Híbrida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacidad</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="speaker">Conferencista</Label>
                <Select value={formData.speakerId} onValueChange={(value) => setFormData({ ...formData, speakerId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona conferencista" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSpeakers.map((speaker) => (
                      <SelectItem key={speaker.id} value={speaker.id}>
                        {speaker.name} - {speaker.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingConference(null);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={editingConference ? handleUpdateConference : handleCreateConference}
                className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white"
              >
                {editingConference ? 'Actualizar' : 'Crear'} Conferencia
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminConferences;

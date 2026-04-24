import React, { useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { mockEvents, Event } from '../../data/mockData';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  MapPin, 
  Search,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    imageUrl: ''
  });

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateEvent = () => {
    const newEvent: Event = {
      id: `e${events.length + 1}`,
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      status: 'próximo',
      totalAttendees: 0,
      totalConferences: 0
    };

    setEvents([...events, newEvent]);
    setIsCreateModalOpen(false);
    resetForm();
    toast.success('Evento creado exitosamente');
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;

    const updatedEvents = events.map(event =>
      event.id === editingEvent.id
        ? { ...event, ...formData }
        : event
    );

    setEvents(updatedEvents);
    setEditingEvent(null);
    resetForm();
    toast.success('Evento actualizado exitosamente');
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast.success('Evento eliminado exitosamente');
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      startDate: event.startDate.split('T')[0],
      endDate: event.endDate.split('T')[0],
      location: event.location,
      imageUrl: event.imageUrl
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      imageUrl: ''
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'activo':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'próximo':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'finalizado':
        return <XCircle className="w-5 h-5 text-gray-600" />;
      default:
        return null;
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
              Gestión de Eventos
            </h1>
            <p className="text-lg text-gray-600">
              Administra los eventos principales de la plataforma
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Evento
          </Button>
        </div>

        {/* Search */}
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

        {/* Events Grid */}
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
                      {new Date(event.startDate).toLocaleDateString('es-ES')} - {new Date(event.endDate).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{event.totalAttendees} asistentes</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => openEditModal(event)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteEvent(event.id)}
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-gray-900">
              No se encontraron eventos
            </h3>
            <p className="text-gray-600">
              Intenta ajustar tu búsqueda o crea un nuevo evento
            </p>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Dialog open={isCreateModalOpen || editingEvent !== null} onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setEditingEvent(null);
            resetForm();
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
              </DialogTitle>
              <DialogDescription>
                {editingEvent ? 'Modifica la información del evento' : 'Completa los datos para crear un nuevo evento'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Evento</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tech Summit 2026"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe el evento..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de Fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de Imagen (opcional)</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingEvent(null);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white"
              >
                {editingEvent ? 'Actualizar' : 'Crear'} Evento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminEvents;

import React, { useEffect, useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { api, SpeakerPayload } from '../../services/api';
import { Speaker } from '../../types/conference.types';
import { Plus, Edit, Trash2, Search, Building2, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';

export const AdminSpeakers: React.FC = () => {
  const [speakers, setSpeakers] = useState<(Speaker & { totalConferences?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);

  const [formData, setFormData] = useState<SpeakerPayload>({
    name: '',
    role: '',
    bio: '',
    organization: '',
    avatarUrl: ''
  });

  const loadSpeakers = async () => {
    try {
      setLoading(true);
      const data = await api.getSpeakers();
      setSpeakers(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar conferencistas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpeakers();
  }, []);

  const filteredSpeakers = speakers.filter((speaker) =>
    speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    speaker.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    speaker.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSpeaker = async () => {
    try {
      const newSpeaker = await api.createSpeaker(formData);
      setSpeakers([...speakers, newSpeaker]);
      setIsCreateModalOpen(false);
      resetForm();
      toast.success('Conferencista creado exitosamente');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear conferencista');
    }
  };

  const handleUpdateSpeaker = async () => {
    if (!editingSpeaker) return;

    try {
      const updatedSpeaker = await api.updateSpeaker(editingSpeaker.id, formData);

      setSpeakers(
        speakers.map((speaker) =>
          speaker.id === editingSpeaker.id ? updatedSpeaker : speaker
        )
      );

      setEditingSpeaker(null);
      resetForm();
      toast.success('Conferencista actualizado exitosamente');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar conferencista');
    }
  };

  const handleDeleteSpeaker = async (speakerId: string) => {
    const confirmed = window.confirm('¿Seguro que quieres eliminar este conferencista?');
    if (!confirmed) return;

    try {
      await api.deleteSpeaker(speakerId);
      setSpeakers(speakers.filter((speaker) => speaker.id !== speakerId));
      toast.success('Conferencista eliminado exitosamente');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar conferencista');
    }
  };

  const openEditModal = (speaker: Speaker) => {
    setEditingSpeaker(speaker);
    setFormData({
      name: speaker.name,
      role: speaker.role,
      bio: speaker.bio,
      organization: speaker.organization,
      avatarUrl: speaker.avatarUrl
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      organization: '',
      avatarUrl: ''
    });
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
              Gestión de Conferencistas
            </h1>
            <p className="text-lg text-gray-600">
              Administra los conferencistas reales de la Jornada Académica
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Conferencista
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre, organización o rol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600">Cargando conferencistas...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpeakers.map((speaker) => (
                <div
                  key={speaker.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={speaker.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(speaker.name)}
                      alt={speaker.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg mb-1 text-gray-900">{speaker.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                        <Award className="w-4 h-4" />
                        <span>{speaker.role}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{speaker.organization}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {speaker.bio || 'Sin biografía registrada.'}
                  </p>

                  <p className="text-xs text-gray-500 mb-4">
                    Conferencias asignadas: {speaker.totalConferences || 0}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditModal(speaker)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>

                    <Button
                      onClick={() => handleDeleteSpeaker(speaker.id)}
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredSpeakers.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl mb-2 text-gray-900">
                  No se encontraron conferencistas
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar tu búsqueda o crea un nuevo conferencista
                </p>
              </div>
            )}
          </>
        )}

        <Dialog
          open={isCreateModalOpen || editingSpeaker !== null}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateModalOpen(false);
              setEditingSpeaker(null);
              resetForm();
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSpeaker ? 'Editar Conferencista' : 'Crear Nuevo Conferencista'}
              </DialogTitle>
              <DialogDescription>
                {editingSpeaker
                  ? 'Modifica la información del conferencista'
                  : 'Completa los datos para crear un nuevo conferencista'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Miguel Eduardo Romero Ruiz"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Cargo / Rol</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Conferencista Magistral"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organización</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Omega Up"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Conferencista invitado de la Jornada Académica..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl">URL de Avatar opcional</Label>
                <Input
                  id="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingSpeaker(null);
                  resetForm();
                }}
              >
                Cancelar
              </Button>

              <Button
                onClick={editingSpeaker ? handleUpdateSpeaker : handleCreateSpeaker}
                className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white"
              >
                {editingSpeaker ? 'Actualizar' : 'Crear'} Conferencista
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminSpeakers;
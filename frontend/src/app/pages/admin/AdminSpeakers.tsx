import React, { useCallback, useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { Speaker } from '../../types/conference.types';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Building2,
  Award,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { api, SpeakerPayload } from '../../services/api';
import { useApi } from '../../hooks/useApi';

type SpeakerWithStats = Speaker & {
  totalConferences?: number;
};

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e';

const emptyForm: SpeakerPayload = {
  name: '',
  role: '',
  bio: '',
  organization: '',
  avatarUrl: '',
};

export const AdminSpeakers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<SpeakerWithStats | null>(
    null
  );
  const [formData, setFormData] = useState<SpeakerPayload>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingSpeakerId, setDeletingSpeakerId] = useState<string | null>(
    null
  );

  const loadSpeakers = useCallback(() => api.getSpeakers(), []);

  const {
    data: speakers,
    loading,
    error,
    refetch,
  } = useApi<SpeakerWithStats[]>(loadSpeakers, []);

  const filteredSpeakers = speakers.filter((speaker) => {
    const normalizedQuery = searchQuery.toLowerCase();

    return (
      speaker.name.toLowerCase().includes(normalizedQuery) ||
      speaker.organization.toLowerCase().includes(normalizedQuery) ||
      speaker.role.toLowerCase().includes(normalizedQuery)
    );
  });

  const resetForm = () => {
    setFormData(emptyForm);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditingSpeaker(null);
    resetForm();
  };

  const openCreateModal = () => {
    resetForm();
    setEditingSpeaker(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (speaker: SpeakerWithStats) => {
    setEditingSpeaker(speaker);
    setFormData({
      name: speaker.name,
      role: speaker.role,
      bio: speaker.bio || '',
      organization: speaker.organization,
      avatarUrl: speaker.avatarUrl || '',
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('El nombre del conferencista es obligatorio');
      return false;
    }

    if (!formData.role.trim()) {
      toast.error('El cargo o rol es obligatorio');
      return false;
    }

    if (!formData.organization.trim()) {
      toast.error('La organización es obligatoria');
      return false;
    }

    return true;
  };

  const buildPayload = (): SpeakerPayload => ({
    name: formData.name.trim(),
    role: formData.role.trim(),
    bio: formData.bio?.trim() || '',
    organization: formData.organization.trim(),
    avatarUrl: formData.avatarUrl?.trim() || DEFAULT_AVATAR,
  });

  const handleCreateSpeaker = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      await api.createSpeaker(buildPayload());
      await refetch();

      toast.success('Conferencista creado exitosamente');
      closeModal();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al crear conferencista'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSpeaker = async () => {
    if (!editingSpeaker) return;
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      await api.updateSpeaker(editingSpeaker.id, buildPayload());
      await refetch();

      toast.success('Conferencista actualizado exitosamente');
      closeModal();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al actualizar conferencista'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSpeaker = async (speaker: SpeakerWithStats) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar a ${speaker.name}?`
    );

    if (!confirmed) return;

    try {
      setDeletingSpeakerId(speaker.id);

      await api.deleteSpeaker(speaker.id);
      await refetch();

      toast.success('Conferencista eliminado exitosamente');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al eliminar conferencista'
      );
    } finally {
      setDeletingSpeakerId(null);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
              Gestión de Conferencistas
            </h1>

            <p className="text-lg text-gray-600">
              Administra los conferencistas registrados en PostgreSQL.
            </p>
          </div>

          <Button
            type="button"
            onClick={openCreateModal}
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

        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Cargando conferencistas desde la API...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 mt-1" />

              <div className="flex-1">
                <h2 className="text-lg text-red-900 mb-1">
                  No se pudieron cargar los conferencistas
                </h2>

                <p className="text-red-700 mb-4">{error}</p>

                <Button type="button" variant="outline" onClick={refetch}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && filteredSpeakers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpeakers.map((speaker) => (
              <div
                key={speaker.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={speaker.avatarUrl || DEFAULT_AVATAR}
                    alt={speaker.name}
                    className="w-20 h-20 rounded-full object-cover bg-gray-100"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg mb-1 text-gray-900">
                      {speaker.name}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                      <Award className="w-4 h-4" />
                      <span>{speaker.role}</span>
                    </div>

                    <p className="text-xs text-gray-500">
                      {speaker.totalConferences || 0}{' '}
                      {(speaker.totalConferences || 0) === 1
                        ? 'conferencia'
                        : 'conferencias'}
                    </p>
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

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => openEditModal(speaker)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>

                  <Button
                    type="button"
                    onClick={() => handleDeleteSpeaker(speaker)}
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    disabled={deletingSpeakerId === speaker.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredSpeakers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <h3 className="text-xl mb-2 text-gray-900">
              No se encontraron conferencistas
            </h3>

            <p className="text-gray-600">
              Intenta ajustar tu búsqueda o crea un nuevo conferencista.
            </p>
          </div>
        )}

        <Dialog
          open={isCreateModalOpen || editingSpeaker !== null}
          onOpenChange={(open) => {
            if (!open) {
              closeModal();
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSpeaker
                  ? 'Editar Conferencista'
                  : 'Crear Nuevo Conferencista'}
              </DialogTitle>

              <DialogDescription>
                {editingSpeaker
                  ? 'Modifica la información del conferencista.'
                  : 'Completa los datos para crear un nuevo conferencista.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>

                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Dra. Ana Martínez"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Cargo / Rol</Label>

                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  placeholder="Directora de Innovación"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organización</Label>

                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organization: e.target.value,
                    })
                  }
                  placeholder="Tecnológico Nacional de México"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>

                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Especialista con experiencia en..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl">URL de Avatar</Label>

                <Input
                  id="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, avatarUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>

              <Button
                type="button"
                onClick={
                  editingSpeaker ? handleUpdateSpeaker : handleCreateSpeaker
                }
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white"
              >
                {isSaving
                  ? 'Guardando...'
                  : editingSpeaker
                    ? 'Actualizar Conferencista'
                    : 'Crear Conferencista'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminSpeakers;
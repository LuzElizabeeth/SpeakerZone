import React, { useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../context/AuthContext';
import { 
  User,
  Mail,
  Calendar,
  Award,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';

export const AttendeeProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    organization: user?.organization || ''
  });

  const handleSave = () => {
    // Aquí se guardaría en la base de datos
    setIsEditing(false);
    toast.success('Perfil actualizado exitosamente');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      organization: user?.organization || ''
    });
    setIsEditing(false);
  };

  const stats = {
    eventsAttended: 3,
    upcomingEvents: 2,
    certificatesEarned: 3
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
            Mi Perfil
          </h1>
          <p className="text-lg text-gray-600">
            Administra tu información personal
          </p>
        </div>

        {/* Profile Card */}
        <Card className="p-8 mb-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-gradient-start to-blue-gradient-end rounded-full flex items-center justify-center text-white text-3xl">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl mb-1 text-gray-900">{user?.name}</h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <p className="text-sm text-blue-600 mt-2">Asistente</p>
              </div>
            </div>

            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organización (opcional)</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Tu empresa u organización"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografía (opcional)</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Cuéntanos sobre ti..."
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.organization && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Organización</p>
                  <p className="text-gray-900">{formData.organization}</p>
                </div>
              )}

              {formData.bio && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Biografía</p>
                  <p className="text-gray-900">{formData.bio}</p>
                </div>
              )}

              {!formData.organization && !formData.bio && (
                <p className="text-gray-500 italic">
                  No has agregado información adicional a tu perfil
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl mb-1 text-gray-900">{stats.eventsAttended}</p>
            <p className="text-sm text-gray-600">Eventos Asistidos</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl mb-1 text-gray-900">{stats.upcomingEvents}</p>
            <p className="text-sm text-gray-600">Eventos Próximos</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl mb-1 text-gray-900">{stats.certificatesEarned}</p>
            <p className="text-sm text-gray-600">Certificados Obtenidos</p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AttendeeProfile;

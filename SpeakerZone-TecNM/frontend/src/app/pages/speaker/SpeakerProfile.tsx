import React, { useState } from 'react';
import { Mail, MapPin, Building, Edit3, Save, X } from 'lucide-react';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export const SpeakerProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    organization: user?.organization || 'Tech Innovations Lab',
    bio: user?.bio || 'Experto en tecnología con más de 10 años de experiencia',
    location: 'Madrid, España',
    website: 'https://example.com',
    linkedin: 'https://linkedin.com/in/example',
    twitter: 'https://twitter.com/example'
  });

  const handleSave = () => {
    // Simulación de guardado
    toast.success('Perfil actualizado correctamente');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      organization: user?.organization || 'Tech Innovations Lab',
      bio: user?.bio || 'Experto en tecnología con más de 10 años de experiencia',
      location: 'Madrid, España',
      website: 'https://example.com',
      linkedin: 'https://linkedin.com/in/example',
      twitter: 'https://twitter.com/example'
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl mb-3 text-gray-900">
              Mi Perfil
            </h1>
            <p className="text-lg text-gray-600">
              Administra tu información personal y profesional
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-accent text-white rounded-lg hover:bg-blue-hover transition-colors"
            >
              <Edit3 className="w-5 h-5" />
              Editar Perfil
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Guardar
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          {/* Header con Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end"></div>
          
          {/* Avatar y Info Básica */}
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 mb-6">
              <img
                src={user?.avatarUrl}
                alt={user?.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-2xl mb-2 text-gray-900 border-b-2 border-blue-accent focus:outline-none w-full"
                  />
                ) : (
                  <h2 className="text-2xl mb-2 text-gray-900">{formData.name}</h2>
                )}
                <p className="text-blue-accent mb-2">Conferencista</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="border-b border-gray-300 focus:border-blue-accent focus:outline-none"
                      />
                    ) : (
                      <span>{formData.organization}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="border-b border-gray-300 focus:border-blue-accent focus:outline-none"
                      />
                    ) : (
                      <span>{formData.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{formData.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg mb-3 text-gray-900">Biografía</h3>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{formData.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl mb-4 text-gray-900">Información de Contacto</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg ${
                    isEditing ? 'focus:ring-2 focus:ring-blue-accent focus:border-transparent' : 'bg-gray-50'
                  } outline-none`}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Sitio Web</label>
                <input
                  type="url"
                  value={formData.website}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg ${
                    isEditing ? 'focus:ring-2 focus:ring-blue-accent focus:border-transparent' : 'bg-gray-50'
                  } outline-none`}
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl mb-4 text-gray-900">Redes Sociales</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg ${
                    isEditing ? 'focus:ring-2 focus:ring-blue-accent focus:border-transparent' : 'bg-gray-50'
                  } outline-none`}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Twitter</label>
                <input
                  type="url"
                  value={formData.twitter}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg ${
                    isEditing ? 'focus:ring-2 focus:ring-blue-accent focus:border-transparent' : 'bg-gray-50'
                  } outline-none`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h3 className="text-xl mb-4 text-gray-900">Estadísticas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl mb-1 text-blue-accent">12</p>
              <p className="text-sm text-gray-600">Conferencias</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-1 text-blue-accent">450</p>
              <p className="text-sm text-gray-600">Asistentes Totales</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-1 text-blue-accent">4.8</p>
              <p className="text-sm text-gray-600">Rating Promedio</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-1 text-blue-accent">95%</p>
              <p className="text-sm text-gray-600">Tasa de Asistencia</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpeakerProfile;

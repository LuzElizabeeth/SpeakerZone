import React from 'react';
import { AppHeader } from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, User, Mail, Shield } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-blue-accent" />
            <h1 className="text-3xl lg:text-4xl text-gray-900">
              Configuración
            </h1>
          </div>

          <p className="text-lg text-gray-600">
            Consulta la información básica de tu cuenta.
          </p>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl text-gray-900 mb-6">
            Información de cuenta
          </h2>

          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="text-gray-900">{user?.name || 'Sin nombre'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Correo</p>
                <p className="text-gray-900">{user?.email || 'Sin correo'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
              <Shield className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Rol</p>
                <p className="text-gray-900 capitalize">
                  {user?.role === 'admin'
                    ? 'Administrador'
                    : user?.role === 'speaker'
                      ? 'Conferencista'
                      : 'Asistente'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
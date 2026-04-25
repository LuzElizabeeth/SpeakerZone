import React from 'react';
import { AppHeader } from '../../components/AppHeader';
import { CalendarCheck, AlertCircle } from 'lucide-react';

export const AttendeeReservations: React.FC = () => {
  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CalendarCheck className="w-8 h-8 text-blue-accent" />
            <h1 className="text-3xl lg:text-4xl text-gray-900">
              Mis Reservas
            </h1>
          </div>

          <p className="text-lg text-gray-600">
            Aquí se mostrarán las conferencias reservadas por el asistente.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-700 mt-1" />

            <div>
              <h2 className="text-lg text-yellow-900 mb-2">
                Módulo pendiente de conexión
              </h2>

              <p className="text-yellow-800">
                Esta pantalla ya queda preparada para la Fase de Reservas.
                Todavía falta crear las rutas backend de registros, validar cupos,
                generar QR único y consultar las reservas reales desde PostgreSQL.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendeeReservations;
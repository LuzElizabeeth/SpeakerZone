import React from 'react';
import { Download, Award, Calendar, FileText, CheckCircle } from 'lucide-react';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../context/AuthContext';
import { mockConferences } from '../../data/mockConferences';

interface Certificate {
  id: string;
  conferenceTitle: string;
  conferenceDate: string;
  issueDate: string;
  type: 'speaker' | 'participation';
  status: 'available' | 'pending';
}

export const SpeakerCertificates: React.FC = () => {
  const { user } = useAuth();

  const certificates: Certificate[] = mockConferences.slice(0, 3).map((conf, idx) => ({
    id: `cert-${idx + 1}`,
    conferenceTitle: conf.title,
    conferenceDate: conf.date,
    issueDate: new Date().toISOString(),
    type: 'speaker',
    status: conf.status === 'finalizada' ? 'available' : 'pending'
  }));

  const handleDownload = (certificate: Certificate) => {
    // Simulación de descarga
    console.log('Downloading certificate:', certificate.id);
    // En producción, aquí se generaría el PDF
  };

  const availableCertificates = certificates.filter(c => c.status === 'available');
  const pendingCertificates = certificates.filter(c => c.status === 'pending');

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-3 text-gray-900">
            Mis Certificados
          </h1>
          <p className="text-lg text-gray-600">
            Descarga tus certificados de participación como conferencista
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Certificados</p>
              <Award className="w-10 h-10 text-blue-accent" />
            </div>
            <p className="text-3xl text-gray-900">{certificates.length}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Disponibles</p>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-3xl text-gray-900">{availableCertificates.length}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Pendientes</p>
              <FileText className="w-10 h-10 text-orange-600" />
            </div>
            <p className="text-3xl text-gray-900">{pendingCertificates.length}</p>
          </div>
        </div>

        {/* Certificados Disponibles */}
        {availableCertificates.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl mb-4 text-gray-900">Certificados Disponibles</h2>
            <div className="grid gap-6">
              {availableCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="md:flex">
                    {/* Preview Visual */}
                    <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-blue-gradient-start to-blue-gradient-end p-8 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Award className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-sm opacity-90">Certificado de</p>
                        <p className="text-lg">Conferencista</p>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              Disponible
                            </span>
                            <span className="px-3 py-1 bg-blue-light text-blue-accent rounded-full text-sm">
                              Conferencista
                            </span>
                          </div>
                          <h3 className="text-xl mb-2 text-gray-900">{cert.conferenceTitle}</h3>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-blue-accent" />
                          <div>
                            <p className="text-sm text-gray-500">Fecha de la Conferencia</p>
                            <p className="text-gray-900">
                              {new Date(cert.conferenceDate).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-accent" />
                          <div>
                            <p className="text-sm text-gray-500">Fecha de Emisión</p>
                            <p className="text-gray-900">
                              {new Date(cert.issueDate).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDownload(cert)}
                          className="flex items-center gap-2 px-6 py-3 bg-blue-accent text-white rounded-lg hover:bg-blue-hover transition-colors"
                        >
                          <Download className="w-5 h-5" />
                          Descargar PDF
                        </button>
                        <button className="px-6 py-3 bg-white border-2 border-blue-accent text-blue-accent rounded-lg hover:bg-blue-light transition-colors">
                          Vista Previa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificados Pendientes */}
        {pendingCertificates.length > 0 && (
          <div>
            <h2 className="text-2xl mb-4 text-gray-900">Certificados Pendientes</h2>
            <div className="grid gap-4">
              {pendingCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                          Pendiente
                        </span>
                      </div>
                      <h3 className="text-lg mb-1 text-gray-900">{cert.conferenceTitle}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        El certificado estará disponible después de que finalice la conferencia
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Conferencia programada para el{' '}
                          {new Date(cert.conferenceDate).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {certificates.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Award className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-gray-900">No tienes certificados aún</h3>
            <p className="text-gray-600">
              Los certificados estarán disponibles después de completar tus conferencias
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SpeakerCertificates;

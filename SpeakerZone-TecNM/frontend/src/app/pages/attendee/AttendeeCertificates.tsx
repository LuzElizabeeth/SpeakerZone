import React, { useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { mockCertificates, Certificate } from '../../data/mockData';
import { 
  Award,
  Download,
  Calendar,
  Search,
  FileText,
  CheckCircle
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

export const AttendeeCertificates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar certificados del usuario actual (en este caso todos los mock)
  const userCertificates = mockCertificates;

  const filteredCertificates = userCertificates.filter(cert =>
    cert.conferenceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadCertificate = (certificate: Certificate) => {
    // Simular descarga de certificado
    toast.success(`Descargando certificado: ${certificate.conferenceName}`);
    
    // En producción, esto generaría un PDF real
    console.log('Downloading certificate:', certificate);
  };

  const handleDownloadAll = () => {
    toast.success(`Descargando ${filteredCertificates.length} certificados`);
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
            Mis Certificados
          </h1>
          <p className="text-lg text-gray-600">
            Descarga los certificados de las conferencias a las que has asistido
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl mb-1 text-gray-900">{userCertificates.length}</p>
            <p className="text-sm text-gray-600">Total Certificados</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl mb-1 text-gray-900">{userCertificates.length}</p>
            <p className="text-sm text-gray-600">Certificados Disponibles</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl mb-1 text-gray-900">
              {new Date().getFullYear()}
            </p>
            <p className="text-sm text-gray-600">Año Actual</p>
          </Card>
        </div>

        {/* Search and Actions */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar certificados por nombre de conferencia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredCertificates.length > 0 && (
              <Button
                onClick={handleDownloadAll}
                className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white whitespace-nowrap"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Todos
              </Button>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {filteredCertificates.length} certificados encontrados
            </p>
          </div>
        </Card>

        {/* Certificates List */}
        {filteredCertificates.length > 0 ? (
          <div className="space-y-4">
            {filteredCertificates.map((certificate) => (
              <Card key={certificate.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-gradient-start to-blue-gradient-end rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl mb-2 text-gray-900">
                          {certificate.conferenceName}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            <span>{certificate.attendeeName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Emitido el {new Date(certificate.issueDate).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Disponible
                      </Badge>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleDownloadCertificate(certificate)}
                        className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar PDF
                      </Button>
                      
                      <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Vista Previa
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-gray-900">
              {searchQuery ? 'No se encontraron certificados' : 'Aún no tienes certificados'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Intenta ajustar tu búsqueda' 
                : 'Asiste a conferencias y obtén tus certificados automáticamente'}
            </p>
            {!searchQuery && (
              <Button className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white">
                Explorar Eventos
              </Button>
            )}
          </Card>
        )}

        {/* Info Card */}
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg mb-2 text-blue-900">
                ¿Cómo obtener certificados?
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Los certificados se generan automáticamente cuando:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Te registras para una conferencia</li>
                <li>• Realizas el check-in con tu código QR</li>
                <li>• Completas la asistencia a la conferencia</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AttendeeCertificates;

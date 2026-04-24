import React, { useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { mockAttendees } from '../../data/mockData';
import { mockConferences } from '../../data/mockConferences';
import { Attendee } from '../../types/conference.types';
import { 
  QrCode,
  CheckCircle2,
  XCircle,
  Search,
  Camera,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { toast } from 'sonner';

export const AdminScanner: React.FC = () => {
  const [attendees, setAttendees] = useState<Attendee[]>(mockAttendees);
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    attendee: Attendee | null;
    message: string;
  } | null>(null);
  const [recentScans, setRecentScans] = useState<Array<{
    id: string;
    attendee: Attendee;
    timestamp: Date;
    success: boolean;
  }>>([]);

  const handleScanQR = () => {
    if (!qrCodeInput.trim()) {
      toast.error('Ingresa un código QR');
      return;
    }

    const attendee = attendees.find(a => a.qrCode === qrCodeInput.trim());

    if (!attendee) {
      setScanResult({
        success: false,
        attendee: null,
        message: 'Código QR no válido o no encontrado'
      });
      toast.error('Código QR no válido');
      return;
    }

    if (attendee.checkedIn) {
      setScanResult({
        success: false,
        attendee: attendee,
        message: 'Este asistente ya realizó el check-in anteriormente'
      });
      toast.warning('Check-in duplicado');
      
      // Agregar a escaneos recientes aunque sea duplicado
      setRecentScans([
        {
          id: Math.random().toString(),
          attendee,
          timestamp: new Date(),
          success: false
        },
        ...recentScans.slice(0, 9)
      ]);
      
      setQrCodeInput('');
      return;
    }

    // Actualizar el estado de check-in
    setAttendees(attendees.map(a =>
      a.id === attendee.id
        ? { ...a, checkedIn: true }
        : a
    ));

    setScanResult({
      success: true,
      attendee: attendee,
      message: 'Check-in realizado exitosamente'
    });

    // Agregar a escaneos recientes
    setRecentScans([
      {
        id: Math.random().toString(),
        attendee,
        timestamp: new Date(),
        success: true
      },
      ...recentScans.slice(0, 9)
    ]);

    toast.success('Check-in exitoso');
    setQrCodeInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScanQR();
    }
  };

  const stats = {
    total: attendees.length,
    checkedIn: attendees.filter(a => a.checkedIn).length,
    pending: attendees.filter(a => !a.checkedIn).length,
    todayScans: recentScans.filter(s => {
      const today = new Date();
      return s.timestamp.toDateString() === today.toDateString();
    }).length
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
            Escáner de Códigos QR
          </h1>
          <p className="text-lg text-gray-600">
            Valida la asistencia escaneando los códigos QR
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Registrados</p>
                <p className="text-3xl text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Check-in Hoy</p>
                <p className="text-3xl text-gray-900">{stats.todayScans}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Confirmados</p>
                <p className="text-3xl text-gray-900">{stats.checkedIn}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pendientes</p>
                <p className="text-3xl text-gray-900">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <div>
            <Card className="p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-gradient-start to-blue-gradient-end rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl mb-2 text-gray-900">Escanear Código QR</h2>
                <p className="text-gray-600">
                  Ingresa o escanea el código QR del asistente
                </p>
              </div>

              {/* QR Scanner Input */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="QR-A1-TECH2026"
                    value={qrCodeInput}
                    onChange={(e) => setQrCodeInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 text-lg py-6"
                    autoFocus
                  />
                </div>

                <Button
                  onClick={handleScanQR}
                  className="w-full bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white py-6 text-lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Validar Check-in
                </Button>
              </div>

              {/* Scan Result */}
              {scanResult && (
                <Alert className={scanResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  <div className="flex items-start gap-3">
                    {scanResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <AlertTitle className={scanResult.success ? 'text-green-900' : 'text-red-900'}>
                        {scanResult.success ? '¡Check-in Exitoso!' : 'Error en Check-in'}
                      </AlertTitle>
                      <AlertDescription className={scanResult.success ? 'text-green-700' : 'text-red-700'}>
                        {scanResult.message}
                      </AlertDescription>
                      
                      {scanResult.attendee && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-gray-900 mb-1">
                            <strong>{scanResult.attendee.name}</strong>
                          </p>
                          <p className="text-sm text-gray-600">
                            {scanResult.attendee.email}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            Conferencia: {mockConferences.find(c => c.id === scanResult.attendee?.conferenceId)?.title || 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              )}

              {/* Helper Text */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Tip:</strong> Puedes usar un lector de códigos QR conectado al sistema o ingresar manualmente el código.
                </p>
              </div>
            </Card>
          </div>

          {/* Recent Scans */}
          <div>
            <Card className="p-6">
              <h2 className="text-2xl mb-6 text-gray-900">Escaneos Recientes</h2>
              
              {recentScans.length === 0 ? (
                <div className="text-center py-12">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No hay escaneos recientes
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentScans.map((scan) => {
                    const conference = mockConferences.find(c => c.id === scan.attendee.conferenceId);
                    
                    return (
                      <div
                        key={scan.id}
                        className={`p-4 rounded-lg border ${
                          scan.success 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-orange-50 border-orange-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {scan.success ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-orange-600" />
                            )}
                            <p className={`${scan.success ? 'text-green-900' : 'text-orange-900'}`}>
                              {scan.attendee.name}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {scan.timestamp.toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-1">
                          {scan.attendee.email}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                          <Calendar className="w-3 h-3" />
                          <span className="truncate">{conference?.title || 'N/A'}</span>
                        </div>
                        
                        {!scan.success && (
                          <p className="text-xs text-orange-700 mt-2">
                            Check-in duplicado
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminScanner;

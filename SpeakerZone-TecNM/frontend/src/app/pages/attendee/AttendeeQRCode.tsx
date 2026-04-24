import React from 'react';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode,
  Download,
  Share2,
  CheckCircle,
  Info
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { toast } from 'sonner';

export const AttendeeQRCode: React.FC = () => {
  const { user } = useAuth();
  
  // Generar código QR único basado en el ID del usuario
  const qrCodeValue = `SPEAKERZONE-${user?.id?.toUpperCase() || 'DEMO'}-2026`;

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (!canvas) return;

    const svg = canvas.querySelector('svg');
    if (!svg) return;

    // Convertir SVG a imagen
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-code-${user?.name?.replace(/\s+/g, '-') || 'usuario'}.svg`;
    link.click();

    URL.revokeObjectURL(url);
    toast.success('Código QR descargado exitosamente');
  };

  const handleShareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi Código QR - SpeakerZone',
          text: `Código QR para eventos: ${qrCodeValue}`,
        });
        toast.success('Código compartido exitosamente');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Copiar al portapapeles
      navigator.clipboard.writeText(qrCodeValue);
      toast.success('Código copiado al portapapeles');
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
            Mi Código QR
          </h1>
          <p className="text-lg text-gray-600">
            Utiliza este código para validar tu asistencia en los eventos
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Info className="w-5 h-5 text-blue-600" />
          <AlertTitle className="text-blue-900">¿Cómo usar tu código QR?</AlertTitle>
          <AlertDescription className="text-blue-700">
            Presenta este código QR al llegar a cada conferencia para registrar tu asistencia. 
            Puedes descargarlo o guardarlo en tu dispositivo móvil.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* QR Code Card */}
          <Card className="p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-gradient-start to-blue-gradient-end rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl mb-2 text-gray-900">Tu Código Personal</h2>
              <p className="text-gray-600 mb-8">
                {user?.name}
              </p>

              {/* QR Code */}
              <div id="qr-code" className="bg-white p-8 rounded-xl inline-block mb-8 shadow-lg">
                <QRCodeSVG
                  value={qrCodeValue}
                  size={256}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: '',
                    height: 0,
                    width: 0,
                    excavate: false,
                  }}
                />
              </div>

              <div className="text-center mb-6">
                <code className="text-sm bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
                  {qrCodeValue}
                </code>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleDownloadQR}
                  className="flex-1 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar QR
                </Button>
                <Button
                  onClick={handleShareQR}
                  variant="outline"
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          </Card>

          {/* Instructions Card */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl mb-4 text-gray-900">Instrucciones de Uso</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600">
                    1
                  </div>
                  <div>
                    <p className="text-gray-900 mb-1">Guarda tu código</p>
                    <p className="text-sm text-gray-600">
                      Descarga el código QR o toma una captura de pantalla para tenerlo siempre disponible
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600">
                    2
                  </div>
                  <div>
                    <p className="text-gray-900 mb-1">Llega a la conferencia</p>
                    <p className="text-sm text-gray-600">
                      Dirígete al punto de registro en el evento con tu código listo
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600">
                    3
                  </div>
                  <div>
                    <p className="text-gray-900 mb-1">Escanea tu código</p>
                    <p className="text-sm text-gray-600">
                      Presenta tu código QR al personal para registrar tu asistencia
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 mb-1">¡Listo!</p>
                    <p className="text-sm text-gray-600">
                      Tu asistencia quedará registrada y podrás obtener tu certificado
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-gradient-start to-blue-gradient-end text-white">
              <h3 className="text-xl mb-2">Beneficios del Check-in</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Acceso rápido y sin complicaciones</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Certificado de asistencia automático</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Historial completo de eventos asistidos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Proceso 100% digital y ecológico</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendeeQRCode;

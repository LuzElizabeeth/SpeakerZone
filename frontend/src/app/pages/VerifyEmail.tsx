import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { CheckCircle2, Loader2, MailWarning, XCircle } from 'lucide-react';
import { api } from '../services/api';

type VerifyState = 'loading' | 'success' | 'error';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<VerifyState>('loading');
  const [message, setMessage] = useState('Validando enlace de verificación...');

  useEffect(() => {
    // NOTE for team: this page is the web-facing confirmation flow.
    // Email links should point here: https://hubacademico.mx/verify-email?token=...
    const token = searchParams.get('token');

    if (!token) {
      setState('error');
      setMessage('El enlace de verificación no es válido.');
      return;
    }

    const run = async () => {
      try {
        const response = await api.verifyEmailToken(token);
        setState('success');
        setMessage(response.message || 'Correo verificado correctamente.');
      } catch (error) {
        setState('error');
        setMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo verificar el correo.'
        );
      }
    };

    run();
  }, [searchParams]);

  const icon =
    state === 'loading' ? (
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    ) : state === 'success' ? (
      <CheckCircle2 className="w-10 h-10 text-green-600" />
    ) : (
      <XCircle className="w-10 h-10 text-red-600" />
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-7">
        <div className="flex items-center justify-center mb-4">{icon}</div>
        <h1 className="text-2xl text-center text-gray-900 mb-2">
          Verificación de correo
        </h1>
        <p className="text-center text-gray-600 mb-6">{message}</p>

        {state === 'success' ? (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Ir a iniciar sesión
          </button>
        ) : state === 'error' ? (
          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Ir a login
            </Link>
            <div className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
              <MailWarning className="w-4 h-4" />
              Si expiró el enlace, solicita uno nuevo en login.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VerifyEmail;

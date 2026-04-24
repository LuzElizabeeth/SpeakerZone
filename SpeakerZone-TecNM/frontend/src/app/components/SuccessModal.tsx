import React from 'react';
import { X, Smile, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actionText?: string;
}

/**
 * Modal de confirmación con feedback visual (carita feliz + icono de éxito)
 * Implementa animaciones suaves con Motion
 */
export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = '¡Registro Exitoso!',
  message = 'Tu plaza ha sido reservada. Recibirás un código QR por correo electrónico.',
  actionText = 'Entendido'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop con blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Contenido del modal */}
        <div className="p-8 text-center">
          {/* Iconos de éxito con animación */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              {/* Círculo de fondo con gradiente */}
              <div className="w-24 h-24 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end rounded-full flex items-center justify-center">
                <Smile className="w-12 h-12 text-white" strokeWidth={2} />
              </div>
              
              {/* CheckCircle en la esquina */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1"
              >
                <CheckCircle className="w-8 h-8 text-white" fill="currentColor" />
              </motion.div>
            </div>
          </motion.div>

          {/* Título */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl mb-3 text-gray-900"
          >
            {title}
          </motion.h2>

          {/* Mensaje */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-6"
          >
            {message}
          </motion.p>

          {/* Información adicional */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-light p-4 rounded-lg mb-6"
          >
            <p className="text-sm text-blue-accent">
              📧 Revisa tu correo electrónico para acceder a tu código QR de acceso
            </p>
          </motion.div>

          {/* Botón de acción */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={onClose}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            {actionText}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessModal;

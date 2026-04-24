import React from 'react';
import { Link } from 'react-router';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="text-6xl mb-4 text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

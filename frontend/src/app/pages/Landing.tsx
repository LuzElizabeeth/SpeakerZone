import React, { useCallback } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Calendar, Users, Zap, QrCode, BarChart3, CheckCircle, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

export const Landing: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const loadConferences = useCallback(() => api.getConferences(), []);
  const { data: conferences } = useApi(loadConferences, []);
  const nextConference = conferences[0] || null;

  // Calcular días hasta la próxima conferencia
  const daysUntilNext = nextConference 
    ? Math.ceil((new Date(nextConference.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl text-gray-900">SpeakerZone</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-accent transition-colors">
                Conferencias
              </Link>
              <Link to="/speakers" className="text-gray-600 hover:text-blue-accent transition-colors">
                Conferencistas
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-accent transition-colors">
                Acerca de
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="text-blue-accent hover:text-blue-hover transition-colors"
                >
                  Cerrar Sesión
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-blue-accent hover:text-blue-hover transition-colors"
                >
                  Iniciar Sesión
                </Link>
              )}
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                Ver Conferencias
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradiente de fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-light via-white to-purple-50 opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenido del Hero */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-2 bg-blue-accent/10 text-blue-accent rounded-full text-sm mb-6">
                🚀 La plataforma #1 para gestión de conferencias
              </div>
              
              <h1 className="text-4xl lg:text-6xl mb-6 text-gray-900 leading-tight">
                Conectando Ideas,<br />
                <span className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end bg-clip-text text-transparent">
                  Inspirando Innovación
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                SpeakerZone optimiza el registro, control de aforo y reserva de plazas para conferencias, 
                eliminando procesos manuales y mejorando la experiencia de todos los participantes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  Explorar Conferencias
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-blue-accent text-blue-accent rounded-lg hover:bg-blue-light transition-all"
                >
                  Registrarse Gratis
                </Link>
              </div>

              {/* Stats rápidos */}
              <div className="flex gap-8 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-3xl text-blue-accent mb-1">500+</p>
                  <p className="text-sm text-gray-600">Conferencias</p>
                </div>
                <div>
                  <p className="text-3xl text-blue-accent mb-1">50K+</p>
                  <p className="text-sm text-gray-600">Asistentes</p>
                </div>
                <div>
                  <p className="text-3xl text-blue-accent mb-1">200+</p>
                  <p className="text-sm text-gray-600">Conferencistas</p>
                </div>
              </div>
            </motion.div>

            {/* Contador de próxima conferencia */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {nextConference && (
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="flex items-center gap-2 text-blue-accent mb-4">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">Próxima Conferencia</span>
                  </div>

                  <h3 className="text-2xl mb-4 text-gray-900">
                    {nextConference.title}
                  </h3>

                  <img
                    src={nextConference.imageUrl}
                    alt={nextConference.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />

                  <div className="flex items-center gap-3 mb-6">
                    <img
                      src={nextConference.speaker.avatarUrl}
                      alt={nextConference.speaker.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-gray-900">{nextConference.speaker.name}</p>
                      <p className="text-sm text-gray-500">{nextConference.speaker.role}</p>
                    </div>
                  </div>

                  {/* Countdown */}
                  <div className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end rounded-lg p-6 mb-4">
                    <p className="text-white/80 text-sm mb-2">Comienza en</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-5xl text-white">{daysUntilNext}</p>
                      <p className="text-white/80">días</p>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    className="block w-full text-center py-3 bg-blue-accent text-white rounded-lg hover:bg-blue-hover transition-colors"
                  >
                    Reservar Plaza
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Funcionalidades Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar conferencias de forma eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-blue-light rounded-lg flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-blue-accent" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Gestión de Aforo</h3>
              <p className="text-gray-600 mb-4">
                Control automático de cupo con reserva de plazas en tiempo real. Evita sobreregistros y optimiza la capacidad.
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-accent">
                <CheckCircle className="w-4 h-4" />
                <span>Control automático</span>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <QrCode className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Acceso mediante QR</h3>
              <p className="text-gray-600 mb-4">
                Genera códigos QR únicos para cada asistente. Check-in rápido y sin contacto en el día del evento.
              </p>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <CheckCircle className="w-4 h-4" />
                <span>Acceso instantáneo</span>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Panel de Estadísticas</h3>
              <p className="text-gray-600 mb-4">
                Dashboard para conferencistas con métricas en tiempo real: asistencia, engagement y más.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Métricas en tiempo real</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6 text-white">
            ¿Listo para transformar tus conferencias?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Únete a cientos de organizadores que ya confían en SpeakerZone
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-accent rounded-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            Comenzar Ahora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900">SpeakerZone</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2026 SpeakerZone. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
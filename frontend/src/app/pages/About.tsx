import React from 'react';
import { Link } from 'react-router';
import { Zap, Award, Users, Target, Heart, Rocket } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl text-gray-900">Hub académicos</span>
            </Link>

            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-accent transition-colors">
                Conferencias
              </Link>
              <Link to="/speakers" className="text-gray-600 hover:text-blue-accent transition-colors">
                Conferencistas
              </Link>
              <Link to="/about" className="text-blue-accent">
                Acerca de
              </Link>
            </div>

            <Link
              to="/login"
              className="px-4 py-2 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all"
            >
              Comenzar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-light via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl mb-6 text-gray-900">
            Acerca de <span className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end bg-clip-text text-transparent">Hub académico</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos la plataforma líder en gestión de conferencias que está revolucionando la forma en que organizadores, conferencistas y asistentes se conectan e interactúan.
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-accent to-blue-hover rounded-2xl p-8 text-white">
              <Target className="w-12 h-12 mb-4" />
              <h2 className="text-3xl mb-4">Nuestra Misión</h2>
              <p className="text-white/90 text-lg">
                Democratizar el acceso al conocimiento eliminando las barreras logísticas en la organización de conferencias. 
                Queremos que cada organizador pueda enfocarse en el contenido, no en la administración.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
              <Rocket className="w-12 h-12 mb-4" />
              <h2 className="text-3xl mb-4">Nuestra Visión</h2>
              <p className="text-white/90 text-lg">
                Convertirnos en la plataforma global número uno para eventos de conocimiento, 
                conectando a millones de personas con las ideas que transformarán el futuro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 text-center text-gray-900">Nuestros Valores</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-blue-accent" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Excelencia</h3>
              <p className="text-gray-600">
                Nos comprometemos a ofrecer la mejor experiencia posible en cada interacción.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Comunidad</h3>
              <p className="text-gray-600">
                Creemos en el poder de las conexiones humanas y el aprendizaje colaborativo.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Pasión</h3>
              <p className="text-gray-600">
                Nos apasiona facilitar el intercambio de conocimiento y el crecimiento personal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 text-center text-gray-900">Nuestro Impacto</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-5xl mb-2 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end bg-clip-text text-transparent">
                500+
              </p>
              <p className="text-gray-600">Conferencias Organizadas</p>
            </div>

            <div className="text-center">
              <p className="text-5xl mb-2 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end bg-clip-text text-transparent">
                50K+
              </p>
              <p className="text-gray-600">Asistentes Activos</p>
            </div>

            <div className="text-center">
              <p className="text-5xl mb-2 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end bg-clip-text text-transparent">
                200+
              </p>
              <p className="text-gray-600">Conferencistas Expertos</p>
            </div>

            <div className="text-center">
              <p className="text-5xl mb-2 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end bg-clip-text text-transparent">
                95%
              </p>
              <p className="text-gray-600">Tasa de Satisfacción</p>
            </div>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-8 text-center text-gray-900">Nuestra Historia</h2>
          <div className="space-y-6 text-lg text-gray-600">
            <p>
              Hub académico nació en 2024 cuando un grupo de organizadores de eventos se dio cuenta de que 
              la mayoría de las herramientas existentes eran demasiado complejas o demasiado simples.
            </p>
            <p>
              Decidimos crear una plataforma que fuera poderosa pero fácil de usar, que automatizara 
              las tareas tediosas pero que mantuviera el toque humano en lo que realmente importa: 
              las conexiones y el conocimiento compartido.
            </p>
            <p>
              Hoy, miles de organizadores confían en Hub académico para gestionar sus eventos, desde 
              pequeños meetups hasta conferencias internacionales con miles de asistentes.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-6 text-white">
            ¿Listo para unirte a nuestra comunidad?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Comienza a explorar conferencias o organiza la tuya propia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-white text-blue-accent rounded-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              Ver Conferencias
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all"
            >
              Registrarse Gratis
            </Link>
          </div>
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
              <span className="text-gray-900">Hub académico</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2026 Hub académico. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;

import React, { useState } from 'react';
import { Link } from 'react-router';
import { Zap, Search, MapPin, Award, Linkedin, Twitter, Globe } from 'lucide-react';

interface SpeakerProfile {
  id: string;
  name: string;
  role: string;
  organization: string;
  bio: string;
  avatarUrl: string;
  expertise: string[];
  stats: {
    conferences: number;
    attendees: number;
    rating: number;
  };
  social: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  location: string;
}

const mockSpeakers: SpeakerProfile[] = [
  {
    id: 's1',
    name: 'Dr. Ana Martínez',
    role: 'Directora de IA',
    organization: 'Tech Innovations Lab',
    bio: 'Experta en Machine Learning con 15 años de experiencia liderando proyectos de IA en Fortune 500.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    expertise: ['Inteligencia Artificial', 'Machine Learning', 'Deep Learning'],
    stats: { conferences: 45, attendees: 12000, rating: 4.9 },
    social: { linkedin: '#', twitter: '#', website: '#' },
    location: 'Madrid, España'
  },
  {
    id: 's2',
    name: 'Carlos Rodríguez',
    role: 'Cloud Architect',
    organization: 'CloudScale Solutions',
    bio: 'Especialista en arquitecturas cloud-native y DevOps con certificaciones en AWS, Azure y GCP.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    expertise: ['Cloud Computing', 'DevOps', 'Kubernetes'],
    stats: { conferences: 38, attendees: 9500, rating: 4.8 },
    social: { linkedin: '#', twitter: '#' },
    location: 'Barcelona, España'
  },
  {
    id: 's3',
    name: 'Laura Sánchez',
    role: 'Lead Design Engineer',
    organization: 'DesignFirst Studio',
    bio: 'Diseñadora de producto con enfoque en sistemas de diseño escalables y accesibilidad.',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    expertise: ['Design Systems', 'UI/UX', 'Accesibilidad'],
    stats: { conferences: 32, attendees: 7800, rating: 5.0 },
    social: { linkedin: '#', twitter: '#', website: '#' },
    location: 'Valencia, España'
  },
  {
    id: 's4',
    name: 'Miguel Torres',
    role: 'Security Expert',
    organization: 'SecureNet Global',
    bio: 'Ethical hacker y consultor de ciberseguridad especializado en pentesting y respuesta a incidentes.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    expertise: ['Ciberseguridad', 'Pentesting', 'Ethical Hacking'],
    stats: { conferences: 41, attendees: 10500, rating: 4.9 },
    social: { linkedin: '#', twitter: '#' },
    location: 'Sevilla, España'
  },
  {
    id: 's5',
    name: 'Elena Ruiz',
    role: 'Blockchain Developer',
    organization: 'Web3 Ventures',
    bio: 'Pionera en desarrollo de smart contracts y aplicaciones descentralizadas en Ethereum y Solana.',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
    expertise: ['Blockchain', 'Web3', 'Smart Contracts'],
    stats: { conferences: 29, attendees: 8200, rating: 4.7 },
    social: { linkedin: '#', twitter: '#', website: '#' },
    location: 'Bilbao, España'
  },
  {
    id: 's6',
    name: 'Javier Moreno',
    role: 'Engineering Manager',
    organization: 'Global Tech Corp',
    bio: 'Líder de equipos distribuidos con experiencia construyendo culturas de ingeniería de alto rendimiento.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    expertise: ['Liderazgo', 'Management', 'Agilidad'],
    stats: { conferences: 36, attendees: 9100, rating: 4.8 },
    social: { linkedin: '#', twitter: '#' },
    location: 'Málaga, España'
  }
];

export const Speakers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpeakers = mockSpeakers.filter(speaker =>
    speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    speaker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    speaker.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    speaker.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl text-gray-900">SpeakerZone</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-accent transition-colors">
                Conferencias
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-accent transition-colors">
                Acerca de
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all"
              >
                Mi Perfil
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título y Búsqueda */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-3 text-gray-900">
            Nuestros Conferencistas
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Expertos de clase mundial listos para compartir su conocimiento
          </p>

          {/* Barra de búsqueda */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, rol o área de expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all bg-white"
            />
          </div>
        </div>

        {/* Grid de Speakers */}
        {filteredSpeakers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpeakers.map((speaker) => (
              <div
                key={speaker.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100"
              >
                {/* Header con Avatar */}
                <div className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end p-6 text-center">
                  <img
                    src={speaker.avatarUrl}
                    alt={speaker.name}
                    className="w-24 h-24 rounded-full border-4 border-white mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl text-white mb-1">{speaker.name}</h3>
                  <p className="text-white/80 text-sm">{speaker.role}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Organización */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Award className="w-4 h-4 text-blue-accent" />
                    <span>{speaker.organization}</span>
                  </div>

                  {/* Ubicación */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 text-blue-accent" />
                    <span>{speaker.location}</span>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {speaker.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {speaker.expertise.map((exp, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-light text-blue-accent text-xs rounded"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-lg text-blue-accent">{speaker.stats.conferences}</p>
                      <p className="text-xs text-gray-500">Conferencias</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg text-blue-accent">{(speaker.stats.attendees / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-gray-500">Asistentes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg text-blue-accent">{speaker.stats.rating}</p>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100">
                    {speaker.social.linkedin && (
                      <a
                        href={speaker.social.linkedin}
                        className="text-gray-400 hover:text-blue-accent transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {speaker.social.twitter && (
                      <a
                        href={speaker.social.twitter}
                        className="text-gray-400 hover:text-blue-accent transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {speaker.social.website && (
                      <a
                        href={speaker.social.website}
                        className="text-gray-400 hover:text-blue-accent transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl mb-2 text-gray-900">
              No se encontraron conferencistas
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar tu búsqueda
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-blue-accent text-white rounded-lg hover:bg-blue-hover transition-colors"
            >
              Limpiar Búsqueda
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Speakers;

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Zap, Search, Award, Building2, UserRound } from 'lucide-react';
import { api } from '../services/api';
import { Speaker } from '../types/conference.types';

export const Speakers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [speakers, setSpeakers] = useState<(Speaker & { totalConferences?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getSpeakers()
      .then(setSpeakers)
      .catch((err) => setError(err.message || 'Error al cargar conferencistas'))
      .finally(() => setLoading(false));
  }, []);

  const filteredSpeakers = useMemo(() => speakers.filter((speaker) =>
    speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    speaker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    speaker.organization.toLowerCase().includes(searchQuery.toLowerCase())
  ), [speakers, searchQuery]);

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl text-gray-900">SpeakerZone</span>
          </Link>

          <Link to="/login" className="px-4 py-2 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg">
            Mi Perfil
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl lg:text-4xl mb-3 text-gray-900">Nuestros Conferencistas</h1>
        <p className="text-lg text-gray-600 mb-6">Conferencistas cargados desde PostgreSQL.</p>

        <div className="relative max-w-xl mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conferencista..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none bg-white"
          />
        </div>

        {loading && <div className="bg-white rounded-xl p-8">Cargando conferencistas...</div>}
        {error && <div className="bg-red-50 text-red-700 rounded-xl p-6">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpeakers.map((speaker) => (
              <div key={speaker.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end p-6 text-center">
                  {speaker.avatarUrl ? (
                    <img src={speaker.avatarUrl} alt={speaker.name} className="w-24 h-24 rounded-full border-4 border-white mx-auto mb-4 object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white mx-auto mb-4 bg-white/20 flex items-center justify-center">
                      <UserRound className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <h3 className="text-xl text-white mb-1">{speaker.name}</h3>
                  <p className="text-white/80 text-sm">{speaker.role}</p>
                </div>

                <div className="p-6">
                  <p className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Building2 className="w-4 h-4 text-blue-accent" />
                    {speaker.organization || 'Sin organización'}
                  </p>

                  <p className="text-gray-600 text-sm mb-4">
                    {speaker.bio || 'Sin biografía registrada.'}
                  </p>

                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-blue-accent" />
                    {speaker.totalConferences || 0} conferencia(s)
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Speakers;
import { Conference } from '../types/conference.types';

/**
 * Datos reales del archivo PROGRAMA.xlsx.
 */
export const mockConferences: Conference[] = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    title: 'Inauguración de la Jornada ISC',
    description: 'Inicio oficial de la Jornada de Ingeniería en Sistemas Computacionales.',
    date: '2026-04-27T09:00:00',
    time: '09:00',
    location: 'Auditorio',
    type: 'presencial',
    status: 'próxima',
    speaker: { id: '10000000-0000-0000-0000-000000000001', name: 'Comité Organizador', role: 'Responsable del evento', bio: 'Equipo organizador de la Jornada ISC.', avatarUrl: '', organization: 'Instituto Tecnológico de Cancún' },
    capacity: 200,
    registeredCount: 0,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    tags: ['Jornada', 'Inauguración']
  },
  {
    id: '20000000-0000-0000-0000-000000000005',
    title: 'La energía en el Data Center',
    description: 'Conferencia impartida por Roger de TrippLite sobre energía en centros de datos.',
    date: '2026-04-28T10:00:00',
    time: '10:00',
    location: '',
    type: 'presencial',
    status: 'próxima',
    speaker: { id: '10000000-0000-0000-0000-000000000004', name: 'Roger', role: 'Conferencista', bio: 'Conferencista invitado para temas de data center y redes.', avatarUrl: '', organization: 'TrippLite / Cisco' },
    capacity: 200,
    registeredCount: 0,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    tags: ['Data Center', 'Energía', 'Infraestructura']
  },
  {
    id: '20000000-0000-0000-0000-000000000006',
    title: 'Controles de acceso inteligentes, on premise y en la nube',
    description: 'Conferencia de Gaby de Salto Systems sobre controles de acceso inteligentes.',
    date: '2026-04-28T12:00:00',
    time: '12:00',
    location: '',
    type: 'presencial',
    status: 'próxima',
    speaker: { id: '10000000-0000-0000-0000-000000000005', name: 'Gaby', role: 'Conferencista', bio: 'Conferencista invitada de Salto Systems.', avatarUrl: '', organization: 'Salto Systems' },
    capacity: 200,
    registeredCount: 0,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
    tags: ['Seguridad', 'Nube', 'IoT']
  },
  {
    id: '20000000-0000-0000-0000-000000000009',
    title: 'Introducción a las redes',
    description: 'Conferencia de Roger de Cisco en Teams sobre introducción a las redes.',
    date: '2026-04-28T17:00:00',
    time: '17:00',
    location: 'Microsoft Teams',
    type: 'híbrida',
    status: 'próxima',
    speaker: { id: '10000000-0000-0000-0000-000000000004', name: 'Roger', role: 'Conferencista', bio: 'Conferencista invitado para temas de data center y redes.', avatarUrl: '', organization: 'TrippLite / Cisco' },
    capacity: 300,
    registeredCount: 0,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8',
    tags: ['Redes', 'Cisco', 'Telecomunicaciones']
  },
  {
    id: '20000000-0000-0000-0000-000000000011',
    title: 'Taller PON-LAN Network',
    description: 'Taller de fibra óptica por Mistel Comunicaciones. Ponente: Francisco Mis C.',
    date: '2026-04-29T09:00:00',
    time: '09:00',
    location: 'Sala Benito Juárez',
    type: 'presencial',
    status: 'próxima',
    speaker: { id: '10000000-0000-0000-0000-000000000009', name: 'Francisco Mis C.', role: 'Tallerista', bio: 'Tallerista de fibra óptica y PON-LAN Network.', avatarUrl: '', organization: 'Mistel Comunicaciones' },
    capacity: 60,
    registeredCount: 0,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    tags: ['Fibra óptica', 'PON-LAN', 'Redes']
  },
  {
    id: '20000000-0000-0000-0000-000000000012',
    title: 'Porque *NIX',
    description: 'Conferencia impartida por Israel Cupul sobre sistemas *NIX.',
    date: '2026-04-29T12:00:00',
    time: '12:00',
    location: '',
    type: 'presencial',
    status: 'próxima',
    speaker: { id: '10000000-0000-0000-0000-000000000010', name: 'Israel Cupul', role: 'Conferencista', bio: 'Conferencista del tema Porque *NIX.', avatarUrl: '', organization: 'Instituto Tecnológico de Cancún' },
    capacity: 200,
    registeredCount: 0,
    imageUrl: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3',
    tags: ['Unix', 'Linux', 'Sistemas operativos']
  },
  {
    id: '20000000-0000-0000-0000-000000000014',
    title: 'Detrás de la red: diseño, desarrollo e implementación en telecomunicaciones modernas',
    description: 'Conferencia de Ciro de Cisco Teams sobre telecomunicaciones modernas.',
    date: '2026-04-30T10:00:00',
    time: '10:00',
    location: 'Microsoft Teams',
    type: 'híbrida',
    status: 'próxima',
    speaker: { id: '10000000-0000-0000-0000-000000000011', name: 'Ciro', role: 'Conferencista', bio: 'Conferencista sobre telecomunicaciones modernas.', avatarUrl: '', organization: 'Cisco' },
    capacity: 300,
    registeredCount: 0,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8',
    tags: ['Telecomunicaciones', 'Cisco', 'Redes']
  },
  {
    id: '20000000-0000-0000-0000-000000000015',
    title: 'Kubernetes vs Dockers',
    description: 'Conferencia de Luis Tejeda sobre Kubernetes y Docker.',
    date: '2026-04-30T11:00:00',
    time: '11:00',
    location: '',
    type: 'presencial',
    status: 'próxima',
    speaker: { id: '10000000-0000-0000-0000-000000000012', name: 'Luis Tejeda', role: 'Conferencista', bio: 'Conferencista sobre Kubernetes y Docker.', avatarUrl: '', organization: 'Por confirmar' },
    capacity: 200,
    registeredCount: 0,
    imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9',
    tags: ['Kubernetes', 'Docker', 'DevOps']
  }
];

export const getNextConference = (): Conference | null => {
  const now = new Date();
  const upcomingConferences = mockConferences
    .filter(conf => new Date(conf.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return upcomingConferences[0] || mockConferences[0] || null;
};

export const getAvailableSpots = (conference: Conference): number => {
  return Math.max(0, conference.capacity - conference.registeredCount);
};

export const hasAvailableSpots = (conference: Conference): boolean => {
  return getAvailableSpots(conference) > 0;
};

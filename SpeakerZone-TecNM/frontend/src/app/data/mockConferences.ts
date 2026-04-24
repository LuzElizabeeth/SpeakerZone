import { Conference } from '../types/conference.types';

/**
 * Mock Data para SpeakerZone MVP
 * En producción, estos datos vendrían de una API/Base de datos
 */

export const mockConferences: Conference[] = [
  {
    id: '1',
    title: 'Inteligencia Artificial y el Futuro del Desarrollo',
    description: 'Explora cómo la IA está transformando el desarrollo de software y las nuevas oportunidades que esto crea.',
    date: '2026-03-15T00:00:00Z',
    time: '10:00 AM',
    location: 'Centro de Convenciones Madrid',
    type: 'presencial',
    status: 'próxima',
    speaker: {
      id: 's1',
      name: 'Dr. Ana Martínez',
      role: 'Directora de IA',
      bio: 'Experta en Machine Learning con 15 años de experiencia',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      organization: 'Tech Innovations Lab'
    },
    capacity: 150,
    registeredCount: 87,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    tags: ['IA', 'Desarrollo', 'Tecnología']
  },
  {
    id: '2',
    title: 'Arquitecturas Cloud-Native para Startups',
    description: 'Aprende a construir aplicaciones escalables y resilientes en la nube desde el primer día.',
    date: '2026-03-20T00:00:00Z',
    time: '3:00 PM',
    location: 'Online - Zoom',
    type: 'virtual',
    status: 'próxima',
    speaker: {
      id: 's2',
      name: 'Carlos Rodríguez',
      role: 'Cloud Architect',
      bio: 'Especialista en AWS y arquitecturas distribuidas',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      organization: 'CloudScale Solutions'
    },
    capacity: 300,
    registeredCount: 245,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    tags: ['Cloud', 'DevOps', 'Arquitectura']
  },
  {
    id: '3',
    title: 'Design Systems: De la Teoría a la Práctica',
    description: 'Construye sistemas de diseño escalables que mejoren la consistencia y velocidad de desarrollo.',
    date: '2026-03-25T00:00:00Z',
    time: '11:00 AM',
    location: 'Hub de Innovación Barcelona',
    type: 'presencial',
    status: 'próxima',
    speaker: {
      id: 's3',
      name: 'Laura Sánchez',
      role: 'Lead Design Engineer',
      bio: 'Diseñadora de producto con enfoque en sistemas escalables',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      organization: 'DesignFirst Studio'
    },
    capacity: 100,
    registeredCount: 92,
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
    tags: ['Design', 'UI/UX', 'Frontend']
  },
  {
    id: '4',
    title: 'Ciberseguridad en la Era Digital',
    description: 'Protege tus aplicaciones y datos en un mundo cada vez más conectado.',
    date: '2026-03-28T00:00:00Z',
    time: '9:00 AM',
    location: 'Auditorio Tech Valencia',
    type: 'híbrida',
    status: 'próxima',
    speaker: {
      id: 's4',
      name: 'Miguel Torres',
      role: 'Security Expert',
      bio: 'Ethical hacker y consultor de seguridad',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      organization: 'SecureNet Global'
    },
    capacity: 200,
    registeredCount: 156,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
    tags: ['Seguridad', 'Hacking', 'Privacidad']
  },
  {
    id: '5',
    title: 'Blockchain y Web3: El Futuro Descentralizado',
    description: 'Descubre las aplicaciones prácticas de blockchain más allá de las criptomonedas.',
    date: '2026-04-02T00:00:00Z',
    time: '4:00 PM',
    location: 'Online - Microsoft Teams',
    type: 'virtual',
    status: 'próxima',
    speaker: {
      id: 's5',
      name: 'Elena Ruiz',
      role: 'Blockchain Developer',
      bio: 'Pionera en desarrollo de smart contracts',
      avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
      organization: 'Web3 Ventures'
    },
    capacity: 500,
    registeredCount: 412,
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0',
    tags: ['Blockchain', 'Web3', 'Cripto']
  },
  {
    id: '6',
    title: 'Liderazgo Técnico en Equipos Remotos',
    description: 'Estrategias efectivas para liderar equipos de desarrollo distribuidos.',
    date: '2026-04-05T00:00:00Z',
    time: '2:00 PM',
    location: 'Centro Empresarial Sevilla',
    type: 'presencial',
    status: 'próxima',
    speaker: {
      id: 's6',
      name: 'Javier Moreno',
      role: 'Engineering Manager',
      bio: 'Líder de equipos distribuidos en empresas Fortune 500',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      organization: 'Global Tech Corp'
    },
    capacity: 80,
    registeredCount: 73,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
    tags: ['Liderazgo', 'Management', 'Remoto']
  }
];

/**
 * Función helper para obtener la próxima conferencia
 */
export const getNextConference = (): Conference | null => {
  const now = new Date();
  const upcomingConferences = mockConferences
    .filter(conf => new Date(conf.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return upcomingConferences[0] || null;
};

/**
 * Función helper para calcular disponibilidad
 */
export const getAvailableSpots = (conference: Conference): number => {
  return Math.max(0, conference.capacity - conference.registeredCount);
};

/**
 * Función helper para verificar si hay cupo disponible
 */
export const hasAvailableSpots = (conference: Conference): boolean => {
  return getAvailableSpots(conference) > 0;
};

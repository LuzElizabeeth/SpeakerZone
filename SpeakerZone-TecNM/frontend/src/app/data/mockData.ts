import { Attendee, Speaker } from '../types/conference.types';

/**
 * Mock Data extendido para SpeakerZone
 */

// Eventos principales (conjunto de conferencias)
export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl: string;
  status: 'activo' | 'finalizado' | 'próximo';
  totalAttendees: number;
  totalConferences: number;
}

export const mockEvents: Event[] = [
  {
    id: 'e1',
    name: 'Tech Summit 2026',
    description: 'La cumbre tecnológica más importante del año con expertos internacionales',
    startDate: '2026-03-15T00:00:00Z',
    endDate: '2026-03-28T00:00:00Z',
    location: 'Centro de Convenciones Madrid',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    status: 'próximo',
    totalAttendees: 1065,
    totalConferences: 6
  },
  {
    id: 'e2',
    name: 'Innovation Week',
    description: 'Una semana dedicada a la innovación y las nuevas tecnologías',
    startDate: '2026-04-01T00:00:00Z',
    endDate: '2026-04-05T00:00:00Z',
    location: 'Barcelona Tech Hub',
    imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7',
    status: 'próximo',
    totalAttendees: 850,
    totalConferences: 12
  },
  {
    id: 'e3',
    name: 'Digital Transformation Summit',
    description: 'Conferencias sobre transformación digital en empresas',
    startDate: '2026-02-10T00:00:00Z',
    endDate: '2026-02-15T00:00:00Z',
    location: 'Sevilla Convention Center',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
    status: 'finalizado',
    totalAttendees: 620,
    totalConferences: 8
  }
];

// Conferencistas extendidos
export const mockSpeakers: Speaker[] = [
  {
    id: 's1',
    name: 'Dr. Ana Martínez',
    role: 'Directora de IA',
    bio: 'Experta en Machine Learning con 15 años de experiencia en empresas Fortune 500. Doctora en Ciencias de la Computación por MIT.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    organization: 'Tech Innovations Lab'
  },
  {
    id: 's2',
    name: 'Carlos Rodríguez',
    role: 'Cloud Architect',
    bio: 'Especialista en AWS y arquitecturas distribuidas. Certificado en AWS Solutions Architect Professional.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    organization: 'CloudScale Solutions'
  },
  {
    id: 's3',
    name: 'Laura Sánchez',
    role: 'Lead Design Engineer',
    bio: 'Diseñadora de producto con enfoque en sistemas escalables. Anteriormente en Google y Airbnb.',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    organization: 'DesignFirst Studio'
  },
  {
    id: 's4',
    name: 'Miguel Torres',
    role: 'Security Expert',
    bio: 'Ethical hacker y consultor de seguridad con más de 20 años de experiencia.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    organization: 'SecureNet Global'
  },
  {
    id: 's5',
    name: 'Elena Ruiz',
    role: 'Blockchain Developer',
    bio: 'Pionera en desarrollo de smart contracts y aplicaciones descentralizadas.',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
    organization: 'Web3 Ventures'
  },
  {
    id: 's6',
    name: 'Javier Moreno',
    role: 'Engineering Manager',
    bio: 'Líder de equipos distribuidos en empresas Fortune 500. Experto en metodologías ágiles.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    organization: 'Global Tech Corp'
  }
];

// Asistentes
export const mockAttendees: Attendee[] = [
  {
    id: 'a1',
    name: 'María García López',
    email: 'maria.garcia@email.com',
    registeredAt: '2026-02-15T10:30:00Z',
    qrCode: 'QR-A1-TECH2026',
    checkedIn: true,
    conferenceId: '1'
  },
  {
    id: 'a2',
    name: 'Juan Pérez Martín',
    email: 'juan.perez@email.com',
    registeredAt: '2026-02-18T14:20:00Z',
    qrCode: 'QR-A2-TECH2026',
    checkedIn: true,
    conferenceId: '1'
  },
  {
    id: 'a3',
    name: 'Carmen Rodríguez',
    email: 'carmen.rodriguez@email.com',
    registeredAt: '2026-02-20T09:15:00Z',
    qrCode: 'QR-A3-TECH2026',
    checkedIn: false,
    conferenceId: '1'
  },
  {
    id: 'a4',
    name: 'Luis Fernández',
    email: 'luis.fernandez@email.com',
    registeredAt: '2026-02-22T16:45:00Z',
    qrCode: 'QR-A4-CLOUD2026',
    checkedIn: true,
    conferenceId: '2'
  },
  {
    id: 'a5',
    name: 'Ana Jiménez',
    email: 'ana.jimenez@email.com',
    registeredAt: '2026-02-25T11:30:00Z',
    qrCode: 'QR-A5-CLOUD2026',
    checkedIn: false,
    conferenceId: '2'
  },
  {
    id: 'a6',
    name: 'David Sánchez',
    email: 'david.sanchez@email.com',
    registeredAt: '2026-03-01T13:00:00Z',
    qrCode: 'QR-A6-DESIGN2026',
    checkedIn: false,
    conferenceId: '3'
  },
  {
    id: 'a7',
    name: 'Patricia López',
    email: 'patricia.lopez@email.com',
    registeredAt: '2026-03-02T15:30:00Z',
    qrCode: 'QR-A7-DESIGN2026',
    checkedIn: true,
    conferenceId: '3'
  },
  {
    id: 'a8',
    name: 'Roberto Martín',
    email: 'roberto.martin@email.com',
    registeredAt: '2026-03-05T10:00:00Z',
    qrCode: 'QR-A8-SECURITY2026',
    checkedIn: false,
    conferenceId: '4'
  }
];

// Datos de certificados
export interface Certificate {
  id: string;
  attendeeId: string;
  conferenceId: string;
  conferenceName: string;
  attendeeName: string;
  issueDate: string;
  certificateUrl: string;
}

export const mockCertificates: Certificate[] = [
  {
    id: 'cert1',
    attendeeId: 'a1',
    conferenceId: '1',
    conferenceName: 'Inteligencia Artificial y el Futuro del Desarrollo',
    attendeeName: 'María García López',
    issueDate: '2026-03-16T00:00:00Z',
    certificateUrl: '#'
  },
  {
    id: 'cert2',
    attendeeId: 'a2',
    conferenceId: '1',
    conferenceName: 'Inteligencia Artificial y el Futuro del Desarrollo',
    attendeeName: 'Juan Pérez Martín',
    issueDate: '2026-03-16T00:00:00Z',
    certificateUrl: '#'
  },
  {
    id: 'cert3',
    attendeeId: 'a4',
    conferenceId: '2',
    conferenceName: 'Arquitecturas Cloud-Native para Startups',
    attendeeName: 'Luis Fernández',
    issueDate: '2026-03-21T00:00:00Z',
    certificateUrl: '#'
  },
  {
    id: 'cert4',
    attendeeId: 'a7',
    conferenceId: '3',
    conferenceName: 'Design Systems: De la Teoría a la Práctica',
    attendeeName: 'Patricia López',
    issueDate: '2026-03-26T00:00:00Z',
    certificateUrl: '#'
  }
];

// Datos de agenda para eventos
export interface AgendaItem {
  id: string;
  eventId: string;
  conferenceId: string;
  title: string;
  speaker: string;
  startTime: string;
  endTime: string;
  room: string;
  description: string;
}

export const mockAgenda: AgendaItem[] = [
  {
    id: 'ag1',
    eventId: 'e1',
    conferenceId: '1',
    title: 'Inteligencia Artificial y el Futuro del Desarrollo',
    speaker: 'Dr. Ana Martínez',
    startTime: '2026-03-15T10:00:00Z',
    endTime: '2026-03-15T12:00:00Z',
    room: 'Sala Principal A',
    description: 'Explora cómo la IA está transformando el desarrollo de software'
  },
  {
    id: 'ag2',
    eventId: 'e1',
    conferenceId: '2',
    title: 'Arquitecturas Cloud-Native para Startups',
    speaker: 'Carlos Rodríguez',
    startTime: '2026-03-20T15:00:00Z',
    endTime: '2026-03-20T17:00:00Z',
    room: 'Sala Virtual 1',
    description: 'Aprende a construir aplicaciones escalables en la nube'
  },
  {
    id: 'ag3',
    eventId: 'e1',
    conferenceId: '3',
    title: 'Design Systems: De la Teoría a la Práctica',
    speaker: 'Laura Sánchez',
    startTime: '2026-03-25T11:00:00Z',
    endTime: '2026-03-25T13:00:00Z',
    room: 'Sala Principal B',
    description: 'Construye sistemas de diseño escalables'
  }
];

// Estadísticas de asistencia
export interface AttendanceStats {
  date: string;
  registrations: number;
  checkIns: number;
}

export const mockAttendanceStats: AttendanceStats[] = [
  { date: '2026-03-10', registrations: 45, checkIns: 0 },
  { date: '2026-03-11', registrations: 62, checkIns: 0 },
  { date: '2026-03-12', registrations: 78, checkIns: 0 },
  { date: '2026-03-13', registrations: 95, checkIns: 0 },
  { date: '2026-03-14', registrations: 112, checkIns: 0 },
  { date: '2026-03-15', registrations: 87, checkIns: 82 },
  { date: '2026-03-20', registrations: 245, checkIns: 230 }
];

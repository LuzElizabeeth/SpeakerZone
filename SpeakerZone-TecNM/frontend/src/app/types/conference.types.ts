/**
 * Rol del usuario en el sistema
 */
export type UserRole = 'admin' | 'speaker' | 'attendee';

/**
 * Usuario del sistema
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  organization?: string;
  bio?: string;
}

export type ConferenceType = 'presencial' | 'virtual' | 'híbrida';

export type ConferenceStatus = 'próxima' | 'en-curso' | 'finalizada' | 'cancelada';

export interface Conference {
  id: string;
  title: string;
  description: string;
  date: string; // ISO 8601 format
  time: string;
  location: string;
  type: ConferenceType;
  status: ConferenceStatus;
  speaker: Speaker;
  capacity: number;
  registeredCount: number;
  imageUrl: string;
  tags: string[];
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  organization: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  qrCode: string;
  checkedIn: boolean;
  conferenceId: string;
}

export interface Registration {
  id: string;
  attendeeId: string;
  conferenceId: string;
  registeredAt: string;
  status: 'confirmada' | 'pendiente' | 'cancelada';
  qrCode: string;
}

export interface Statistics {
  totalAttendees: number;
  checkedInCount: number;
  checkInRate: number;
  registrationTrend: TrendData[];
  peakAttendanceTime: string;
}

export interface TrendData {
  date: string;
  count: number;
}


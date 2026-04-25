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
  endTime?: string | null;
  location: string;
  type: ConferenceType;
  status: ConferenceStatus;
  speaker: Speaker;
  capacity: number;
  registeredCount: number;
  imageUrl: string;
  tags: string[];
  event?: {
    id: string;
    name: string;
  };
}

export interface Program {
  id: string;
  name: string;
  slug?: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl: string;
  status: string;
  registrationOpen?: boolean;
  featured?: boolean;
  totalActivities?: number;
  totalAttendees?: number;
}

export interface ActivitySpeaker {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  organization: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;

  date: string;
  time: string;
  endTime?: string | null;

  location: string;

  activityType: string;
  modality: string;
  status: string;

  capacity: number;
  registeredCount: number;

  requiresRegistration: boolean;
  registrationType: string;
  externalRegistrationUrl?: string;

  certificateAvailable: boolean;
  requirements: string[];

  imageUrl?: string;
  tags?: string[];

  speaker: ActivitySpeaker;
  program: Program;
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

export type RegistrationStatus = 'confirmada' | 'pendiente' | 'cancelada';

export interface Registration {
  id: string;
  attendeeId: string;
  conferenceId: string;
  registeredAt: string;
  status: RegistrationStatus;
  qrCode: string;
}

export interface Reservation extends Registration {
  checkedIn: boolean;
  checkedInAt: string | null;
  attendee: {
    id: string;
    name: string;
    email: string;
  };
  conference: Conference;
}

export interface CheckInResponse {
  ok: boolean;
  alreadyCheckedIn: boolean;
  message: string;
  checkedInAt: string | null;
  registration: Reservation;
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

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  linkedSpeakerId: string | null;
}

export interface CreateSystemUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateSystemUserPayload {
  name: string;
  email: string;
  role: UserRole;
}

export interface ResetPasswordResponse {
  user: SystemUser;
  temporaryPassword: string;
}
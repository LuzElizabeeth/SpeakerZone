/// <reference types="vite/client" />

import {
  Activity,
  CheckInResponse,
  Conference,
  ConferenceStatus,
  ConferenceType,
  CreateSystemUserPayload,
  Reservation,
  ResetPasswordResponse,
  Speaker,
  SystemUser,
  UpdateSystemUserPayload,
  User,
  UserRole,
  Program,
} from '../types/conference.types';

// 🔥 DETECCIÓN AUTOMÁTICA DE ENTORNO
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:5001/api'
    : 'https://speakerzone-backend.onrender.com/api');

export const AUTH_TOKEN_KEY = 'speakerzone_token';

export const getAuthToken = () =>
  localStorage.getItem(AUTH_TOKEN_KEY) ||
  sessionStorage.getItem(AUTH_TOKEN_KEY);

export interface SpeakerPayload {
  name: string;
  role: string;
  bio?: string;
  organization: string;
  avatarUrl?: string;
}

export interface ConferencePayload {
  eventId?: string;
  speakerId?: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  type?: string;
  capacity?: number;
  imageUrl?: string;
  tags?: string[];
  status?: string;
}

export interface EventFromApi {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: string;
  imageUrl: string;
  totalConferences: number;
  totalAttendees: number;
}

interface AuthResponse {
  message: string;
  token: string | null;
  user: User | null;
  requiresEmailVerification?: boolean;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    console.error('API Error:', errorBody);
    throw new Error(errorBody?.error || `Error ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

const normalizeConferenceType = (modality?: string): ConferenceType => {
  if (modality === 'virtual' || modality === 'híbrida') return modality;
  return 'presencial';
};

const normalizeConferenceStatus = (status?: string): ConferenceStatus => {
  if (
    status === 'en-curso' ||
    status === 'finalizada' ||
    status === 'cancelada'
  ) {
    return status;
  }

  return 'próxima';
};

const activityToConference = (activity: Activity): Conference => ({
  id: activity.id,
  title: activity.title,
  description: activity.description,
  date: activity.date,
  time: activity.time,
  endTime: activity.endTime || null,
  location: activity.location,
  type: normalizeConferenceType(activity.modality),
  status: normalizeConferenceStatus(activity.status),
  speaker: {
    id: activity.speaker?.id || '',
    name: activity.speaker?.name || 'Por confirmar',
    role: activity.speaker?.role || 'Conferencista',
    bio: activity.speaker?.bio || '',
    avatarUrl: activity.speaker?.avatarUrl || '',
    organization: activity.speaker?.organization || '',
  },
  capacity: Number(activity.capacity || 0),
  registeredCount: Number(activity.registeredCount || 0),
  imageUrl:
    activity.imageUrl ||
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  tags: activity.tags || [],
  event: activity.program
    ? {
        id: activity.program.id,
        name: activity.program.name,
      }
    : undefined,
});

const programToEvent = (program: Program): EventFromApi => ({
  id: program.id,
  name: program.name,
  description: program.description,
  startDate: program.startDate,
  endDate: program.endDate,
  location: program.location,
  status: program.status,
  imageUrl: program.imageUrl,
  totalConferences: Number(program.totalActivities || 0),
  totalAttendees: Number(program.totalAttendees || 0),
});

const normalizeReservation = (reservation: Reservation): Reservation => {
  if (reservation.conference || !reservation.activity) {
    return reservation;
  }

  return {
    ...reservation,
    conference: activityToConference(reservation.activity),
  };
};

export const api = {
  getCurrentUser: () => request<User>('/auth/me'),

 login: async (email: string, password: string) => {
  const response = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!response.user || !response.token) {
    throw new Error('Respuesta inválida del servidor al iniciar sesión.');
  }

  return {
    user: response.user,
    token: response.token,
  };
},

  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole = 'attendee'
  ) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  resendVerificationEmail: (email: string) =>
    request<{ message: string; retryAfterSeconds?: number }>(
      '/auth/resend-verification',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    ),

  verifyEmailToken: (token: string) =>
    request<{ message: string }>('/auth/verify-email-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  // PROGRAMS
  getPrograms: () => request<Program[]>('/programs'),

  getProgramById: (id: string) => request<Program>(`/programs/${id}`),
  

  // ACTIVITIES
  getActivitiesByProgram: (programId: string) =>
    request<Activity[]>(`/programs/${programId}/activities`),

  getActivityById: (id: string) => request<Activity>(`/activities/${id}`),

  getCalendarActivities: () => request<Activity[]>('/activities'),

  registerToActivity: (activityId: string) =>
    request<Reservation>('/registrations', {
      method: 'POST',
      body: JSON.stringify({ activityId }),
    }).then(normalizeReservation),

  // TEMPORARY COMPATIBILITY: old conference/event screens now read from activities/programs.
  getConferences: () =>
    request<Activity[]>('/activities').then((activities) =>
      activities.map(activityToConference)
    ),

  getConferenceById: (id: string) =>
    request<Activity>(`/activities/${id}`).then(activityToConference),

  reserveConference: (conferenceId: string) =>
    request<Reservation>('/registrations', {
      method: 'POST',
      body: JSON.stringify({ activityId: conferenceId }),
    }).then(normalizeReservation),

  getEvents: () =>
    request<Program[]>('/programs').then((programs) =>
      programs.map(programToEvent)
    ),

  createConference: async (payload: ConferencePayload) => {
    const programId = payload.eventId || (await api.getPrograms())[0]?.id;

    if (!programId) {
      throw new Error('No hay un programa disponible para crear la actividad.');
    }

    const activity = await request<Activity>('/activities', {
      method: 'POST',
      body: JSON.stringify({
        programId,
        speakerId: payload.speakerId,
        title: payload.title,
        description: payload.description || '',
        date: payload.date,
        time: payload.time,
        endTime: payload.endTime,
        location: payload.location,
        modality: payload.type || 'presencial',
        capacity: payload.capacity || 100,
        imageUrl: payload.imageUrl,
        tags: payload.tags || [],
        status: payload.status,
        activityType: 'conferencia',
        requiresRegistration: true,
        registrationType: 'internal_form',
      }),
    });

    return activityToConference(activity);
  },

  updateConference: (id: string, payload: ConferencePayload) =>
    request<Activity>(`/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        speakerId: payload.speakerId,
        title: payload.title,
        description: payload.description,
        date: payload.date,
        time: payload.time,
        endTime: payload.endTime,
        location: payload.location,
        modality: payload.type,
        capacity: payload.capacity,
        imageUrl: payload.imageUrl,
        tags: payload.tags,
        status: payload.status,
      }),
    }).then(activityToConference),

  deleteConference: (id: string) =>
    request<{ ok: boolean }>(`/activities/${id}`, {
      method: 'DELETE',
    }),

  // SPEAKERS
  getSpeakers: () =>
    request<(Speaker & { totalConferences: number })[]>('/speakers'),

  createSpeaker: (payload: SpeakerPayload) =>
    request<Speaker & { totalConferences: number }>('/speakers', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateSpeaker: (id: string, payload: SpeakerPayload) =>
    request<Speaker & { totalConferences: number }>(`/speakers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteSpeaker: (id: string) =>
    request<{ ok: boolean }>(`/speakers/${id}`, {
      method: 'DELETE',
    }),

  // REGISTRATIONS
  getMyReservations: () =>
    request<Reservation[]>('/registrations/me').then((reservations) =>
      reservations.map(normalizeReservation)
    ),

  cancelReservation: (id: string) =>
    request<{ ok: boolean }>(`/registrations/${id}`, {
      method: 'DELETE',
    }),

  getAllRegistrations: () =>
    request<Reservation[]>('/registrations').then((registrations) =>
      registrations.map(normalizeReservation)
    ),

  getConferenceRegistrations: (activityId: string) =>
    request<Reservation[]>(`/registrations/conference/${activityId}`).then(
      (registrations) => registrations.map(normalizeReservation)
    ),

  checkInByQr: (qrCode: string) =>
    request<CheckInResponse>('/registrations/check-in', {
      method: 'POST',
      body: JSON.stringify({ qrCode }),
    }),

  // USERS
  getUsers: () => request<SystemUser[]>('/users'),

  createUser: (payload: CreateSystemUserPayload) =>
    request<SystemUser>('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateUser: (id: string, payload: UpdateSystemUserPayload) =>
    request<SystemUser>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  updateUserStatus: (id: string, isActive: boolean) =>
    request<SystemUser>(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    }),

  resetUserPassword: (id: string) =>
    request<ResetPasswordResponse>(`/users/${id}/password`, {
      method: 'PATCH',
    }),
};
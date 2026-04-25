/// <reference types="vite/client" />

import {
  CheckInResponse,
  Conference,
  CreateSystemUserPayload,
  Reservation,
  ResetPasswordResponse,
  Speaker,
  SystemUser,
  UpdateSystemUserPayload,
  User,
  UserRole,
  Activity,
  Program,
} from '../types/conference.types';

// 🔥 DETECCIÓN AUTOMÁTICA DE ENTORNO
const isLocal = window.location.hostname === "localhost";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (isLocal ? "http://localhost:5001/api" : "/api");

// 🔐 AUTH TOKEN
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

/**
 * LEGACY
 */
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

/**
 * LEGACY
 */
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
  token: string;
  user: User;
}

// 🔒 REQUEST CENTRAL
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
    console.error("API Error:", errorBody);
    throw new Error(errorBody?.error || `Error ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

// 🚀 API
export const api = {
  getCurrentUser: () => request<User>('/auth/me'),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

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

  /*
  |--------------------------------------------------------------------------
  | PROGRAMS
  |--------------------------------------------------------------------------
  */
  getPrograms: () => request<Program[]>('/programs'),

  getProgramById: (id: string) =>
    request<Program>(`/programs/${id}`),

  /*
  |--------------------------------------------------------------------------
  | ACTIVITIES
  |--------------------------------------------------------------------------
  */
  getActivitiesByProgram: (programId: string) =>
    request<Activity[]>(`/programs/${programId}/activities`),

  getActivityById: (id: string) =>
    request<Activity>(`/activities/${id}`),

  getCalendarActivities: () =>
    request<Activity[]>('/activities'),

  registerToActivity: (activityId: string) =>
    request<Reservation>('/registrations', {
      method: 'POST',
      body: JSON.stringify({ activityId }),
    }),

  /*
  |--------------------------------------------------------------------------
  | SPEAKERS
  |--------------------------------------------------------------------------
  */
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

  /*
  |--------------------------------------------------------------------------
  | REGISTRATIONS
  |--------------------------------------------------------------------------
  */
  getMyReservations: () =>
    request<Reservation[]>('/registrations/me'),

  cancelReservation: (id: string) =>
    request<{ ok: boolean }>(`/registrations/${id}`, {
      method: 'DELETE',
    }),

  getAllRegistrations: () =>
    request<Reservation[]>('/registrations'),

  getConferenceRegistrations: (conferenceId: string) =>
    request<Reservation[]>(`/registrations/conference/${conferenceId}`),

  checkInByQr: (qrCode: string) =>
    request<CheckInResponse>('/registrations/check-in', {
      method: 'POST',
      body: JSON.stringify({ qrCode }),
    }),

  /*
  |--------------------------------------------------------------------------
  | LEGACY (compatibilidad)
  |--------------------------------------------------------------------------
  */
  getEvents: () =>
    request<EventFromApi[]>('/events'),

  getEventById: (id: string) =>
    request<EventFromApi>(`/events/${id}`),

  getConferences: () =>
    request<Conference[]>('/conferences'),

  getConferenceById: (id: string) =>
    request<Conference>(`/conferences/${id}`),

  createConference: (payload: ConferencePayload) =>
    request<Conference>('/conferences', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateConference: (id: string, payload: Partial<ConferencePayload>) =>
    request<Conference>(`/conferences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteConference: (id: string) =>
    request<{ ok: boolean }>(`/conferences/${id}`, {
      method: 'DELETE',
    }),

  reserveConference: (conferenceId: string) =>
    request<Reservation>('/registrations', {
      method: 'POST',
      body: JSON.stringify({ conferenceId }),
    }),

  /*
  |--------------------------------------------------------------------------
  | USERS
  |--------------------------------------------------------------------------
  */
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
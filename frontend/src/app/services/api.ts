import { Conference, Speaker, User, UserRole } from '../types/conference.types';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export interface SpeakerPayload {
  name: string;
  role: string;
  bio?: string;
  organization: string;
  avatarUrl?: string;
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
  token: string;
  user: User;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('speakerzone_token');

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
    throw new Error(errorBody?.error || `Error ${response.status}`);
  }

  return response.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, role: UserRole = 'attendee') =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  getEvents: () => request<EventFromApi[]>('/events'),

  getConferences: () => request<Conference[]>('/conferences'),
  getConferenceById: (id: string) => request<Conference>(`/conferences/${id}`),

  getSpeakers: () => request<(Speaker & { totalConferences: number })[]>('/speakers'),

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
};
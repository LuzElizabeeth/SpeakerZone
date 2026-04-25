import React from 'react';
import { createBrowserRouter } from 'react-router';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Speakers from './pages/Speakers';
import About from './pages/About';
import NotFound from './pages/NotFound';
import ConferenceDetail from './pages/ConferenceDetail';
import Settings from './pages/Settings';

import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types/conference.types';

// Speaker pages
import SpeakerDashboard from './pages/speaker/SpeakerDashboard';
import SpeakerConferences from './pages/speaker/SpeakerConferences';
import SpeakerAttendees from './pages/speaker/SpeakerAttendees';
import SpeakerCertificates from './pages/speaker/SpeakerCertificates';
import SpeakerProfile from './pages/speaker/SpeakerProfile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminConferences from './pages/admin/AdminConferences';
import AdminSpeakers from './pages/admin/AdminSpeakers';
import AdminAttendees from './pages/admin/AdminAttendees';
import AdminScanner from './pages/admin/AdminScanner';
import AdminStats from './pages/admin/AdminStats';

// Attendee pages
import AttendeeProfile from './pages/attendee/AttendeeProfile';
import AttendeeEvents from './pages/attendee/AttendeeEvents';
import AttendeeQRCode from './pages/attendee/AttendeeQRCode';
import AttendeeCertificates from './pages/attendee/AttendeeCertificates';
import AttendeeHistory from './pages/attendee/AttendeeHistory';
import AttendeeDashboard from './pages/attendee/AttendeeDashboard';
import AttendeeReservations from './pages/attendee/AttendeeReservations';
import AttendeeEventDetail from './pages/attendee/AttendeeEventDetail';
import AttendeeProgramList from './pages/attendee/AttendeeProgramList';
import AttendeeProgramDetail from './pages/attendee/AttendeeProgramDetail';
import AttendeeActivityDetail from './pages/attendee/AttendeeActivityDetail';
import AttendeeProgramCalendar from './pages/attendee/AttendeeProgramCalendar';
import AttendeeRegistrationFlow from './pages/attendee/AttendeeRegistrationFlow';

const withAuth = (
  Component: React.ComponentType,
  allowedRoles?: UserRole[]
) => {
  return function ProtectedPage() {
    return React.createElement(
      ProtectedRoute,
      { allowedRoles },
      React.createElement(Component)
    );
  };
};

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
  {
    path: '/conference/:id',
    Component: ConferenceDetail,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/speakers',
    Component: Speakers,
  },
  {
    path: '/about',
    Component: About,
  },
  {
    path: '/settings',
    Component: withAuth(Settings),
  },

  // Speaker routes
  {
    path: '/speaker/dashboard',
    Component: withAuth(SpeakerDashboard, ['speaker']),
  },
  {
    path: '/speaker/conferences',
    Component: withAuth(SpeakerConferences, ['speaker']),
  },
  {
    path: '/speaker/attendees',
    Component: withAuth(SpeakerAttendees, ['speaker']),
  },
  {
    path: '/speaker/certificates',
    Component: withAuth(SpeakerCertificates, ['speaker']),
  },
  {
    path: '/speaker/profile',
    Component: withAuth(SpeakerProfile, ['speaker']),
  },

  // Admin routes
  {
    path: '/admin/dashboard',
    Component: withAuth(AdminDashboard, ['admin']),
  },
  {
    path: '/admin/events',
    Component: withAuth(AdminEvents, ['admin']),
  },
  {
    path: '/admin/conferences',
    Component: withAuth(AdminConferences, ['admin']),
  },
  {
    path: '/admin/speakers',
    Component: withAuth(AdminSpeakers, ['admin']),
  },
  {
    path: '/admin/attendees',
    Component: withAuth(AdminAttendees, ['admin']),
  },
  {
    path: '/admin/scanner',
    Component: withAuth(AdminScanner, ['admin']),
  },
  {
    path: '/admin/stats',
    Component: withAuth(AdminStats, ['admin']),
  },

  // Attendee routes
  {
    path: '/attendee/dashboard',
    Component: withAuth(AttendeeDashboard, ['attendee']),
  },
  {
    path: '/attendee/profile',
    Component: withAuth(AttendeeProfile, ['attendee']),
  },
  {
    path: '/attendee/events',
    Component: withAuth(AttendeeEvents, ['attendee']),
  },
  {
    path: '/attendee/event/:id',
    Component: withAuth(AttendeeEventDetail, ['attendee']),
  },
  {
    path: '/attendee/reservations',
    Component: withAuth(AttendeeReservations, ['attendee']),
  },
  {
    path: '/attendee/qr',
    Component: withAuth(AttendeeQRCode, ['attendee']),
  },
  {
    path: '/attendee/certificates',
    Component: withAuth(AttendeeCertificates, ['attendee']),
  },
  {
    path: '/attendee/history',
    Component: withAuth(AttendeeHistory, ['attendee']),
  },

  {
  path: '/attendee/programs',
  Component: withAuth(AttendeeProgramList, ['attendee']),
},
{
  path: '/attendee/programs/:id',
  Component: withAuth(AttendeeProgramDetail, ['attendee']),
},
{
  path: '/attendee/activities/:id',
  Component: withAuth(AttendeeActivityDetail, ['attendee']),
},
{
  path: '/attendee/calendar',
  Component: withAuth(AttendeeProgramCalendar, ['attendee']),
},
{
  path: '/attendee/register/:id',
  Component: withAuth(AttendeeRegistrationFlow, ['attendee']),
},

  {
    path: '*',
    Component: NotFound,
  },
]);
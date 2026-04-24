import { createBrowserRouter } from 'react-router';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Speakers from './pages/Speakers';
import About from './pages/About';
import NotFound from './pages/NotFound';
import ConferenceDetail from './pages/ConferenceDetail';

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

/**
 * Configuración de rutas usando React Router Data Mode
 */
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
  // Speaker routes
  {
    path: '/speaker/dashboard',
    Component: SpeakerDashboard,
  },
  {
    path: '/speaker/conferences',
    Component: SpeakerConferences,
  },
  {
    path: '/speaker/attendees',
    Component: SpeakerAttendees,
  },
  {
    path: '/speaker/certificates',
    Component: SpeakerCertificates,
  },
  {
    path: '/speaker/profile',
    Component: SpeakerProfile,
  },
  // Admin routes
  {
    path: '/admin/dashboard',
    Component: AdminDashboard,
  },
  {
    path: '/admin/events',
    Component: AdminEvents,
  },
  {
    path: '/admin/conferences',
    Component: AdminConferences,
  },
  {
    path: '/admin/speakers',
    Component: AdminSpeakers,
  },
  {
    path: '/admin/attendees',
    Component: AdminAttendees,
  },
  {
    path: '/admin/scanner',
    Component: AdminScanner,
  },
  {
    path: '/admin/stats',
    Component: AdminStats,
  },
  // Attendee routes
  {
    path: '/attendee/dashboard',
    Component: AttendeeDashboard,
  },
  {
    path: '/attendee/profile',
    Component: AttendeeProfile,
  },
  {
    path: '/attendee/events',
    Component: AttendeeEvents,
  },
  {
    path: '/attendee/qr',
    Component: AttendeeQRCode,
  },
  {
    path: '/attendee/certificates',
    Component: AttendeeCertificates,
  },
  {
    path: '/attendee/history',
    Component: AttendeeHistory,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
import React from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  LogOut,
  ShieldCheck,
  Cpu,
  Presentation,
  Wrench,
  Trophy,
  Store,
  Mail,
  Phone,
  Globe2,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export const Landing: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-white">
      {/* NAVBAR */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-700 shadow-lg shadow-blue-500/30">
              <Cpu className="h-6 w-6 text-white" />
            </div>

            <div className="leading-tight">
              <p className="text-base font-black tracking-wide text-white">
                Hub Académico
              </p>
              <p className="hidden text-xs text-cyan-300 sm:block">
                Jornada Académica 2026
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-white/70 transition-colors hover:text-cyan-300"
            >
              Conferencias
            </Link>

            <Link
              to="/speakers"
              className="text-sm font-medium text-white/70 transition-colors hover:text-cyan-300"
            >
              Conferencistas
            </Link>

            <Link
              to="/about"
              className="text-sm font-medium text-white/70 transition-colors hover:text-cyan-300"
            >
              Acerca de
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:text-cyan-300 sm:flex"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:text-cyan-300 sm:block"
              >
                Iniciar sesión
              </Link>
            )}

            <Link
              to="/dashboard"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-700 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.03] hover:shadow-cyan-500/30"
            >
              Ver eventos
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen pt-16">
        {/* Fondo base */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.25),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(37,99,235,0.25),transparent_30%),linear-gradient(135deg,#020617_0%,#07132f_45%,#020617_100%)]" />

        {/* Patrón de puntos tipo tecnológico */}
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle,rgba(125,211,252,0.8)_1px,transparent_1.5px)] [background-size:24px_24px]" />

        {/* Franja diagonal superior izquierda */}
        <div className="absolute -left-20 top-0 h-[48vh] w-[60vw] -skew-x-12 overflow-hidden bg-gradient-to-br from-slate-300/20 via-cyan-300/10 to-transparent shadow-2xl shadow-black/40" />

        {/* Bloque oscuro diagonal central */}
        <div className="absolute right-[-12rem] top-0 hidden h-full w-[60vw] -skew-x-12 bg-[#061235]/80 lg:block" />

        {/* Flechas decorativas */}
        <div className="absolute left-[-2rem] top-[38%] h-16 w-56 -skew-x-12 bg-gradient-to-r from-cyan-400 to-blue-800 opacity-80" />
        <div className="absolute right-[-1rem] top-[28%] h-16 w-56 -skew-x-12 bg-gradient-to-r from-blue-700 to-cyan-400 opacity-80" />

        {/* Brillos */}
        <div className="absolute bottom-20 left-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-28 h-96 w-96 rounded-full bg-blue-700/20 blur-3xl" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-8">
          {/* LADO IZQUIERDO */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200 backdrop-blur-md">
              <ShieldCheck className="h-4 w-4" />
              Tecnología y Seguridad Informática
            </div>

            <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
              Jornada Académica de Ingeniería en Sistemas
              <span className="mt-3 block bg-gradient-to-r from-cyan-300 via-blue-400 to-white bg-clip-text text-transparent">
                2026
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Participa en ponencias, talleres, competencias y exposición de
              proveedores enfocadas en innovación, tecnología y seguridad informática.
            </p>

            <div className="mb-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-700 px-8 py-4 text-base font-black text-white shadow-2xl shadow-blue-700/30 transition-all hover:scale-[1.03] hover:shadow-cyan-500/30"
              >
                Explorar eventos
                <ArrowRight className="h-5 w-5" />
              </Link>

              {isAuthenticated ? (
                <Link
                  to="/attendee/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-8 py-4 text-base font-black text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  Ir a mi panel
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-8 py-4 text-base font-black text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  Registrarme / Iniciar sesión
                </Link>
              )}
            </div>

            <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
              <InfoPill
                icon={<CalendarDays className="h-8 w-8" />}
                label="Fecha"
                value="27 al 30 de abril de 2026"
              />

              <InfoPill
                icon={<MapPin className="h-8 w-8" />}
                label="Ubicación"
                value="Av. Rodrigo Gómez Km. 3, Centro"
              />
            </div>
          </motion.div>

          {/* LADO DERECHO */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="rounded-[2rem] border border-white/15 bg-[#07122f]/80 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            <div className="mb-6 rounded-[1.5rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/20 via-blue-700/20 to-white/5 p-6">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-cyan-200">
                Hub Académico
              </p>

              <h2 className="text-3xl font-black leading-tight text-white">
                Tecnología y Seguridad Informática
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Consulta la programación, revisa conferencistas y registra tu
                asistencia a las actividades disponibles.
              </p>
            </div>

            <div className="space-y-3">
              <ActivityItem
                to="/dashboard?tipo=ponencias"
                icon={<Presentation className="h-5 w-5" />}
                title="Ponencias"
                text="Charlas académicas con especialistas."
              />

              <ActivityItem
                to="/dashboard?tipo=talleres"
                icon={<Wrench className="h-5 w-5" />}
                title="Talleres"
                text="Actividades prácticas para estudiantes."
              />

              <ActivityItem
                to="/dashboard?tipo=competencias"
                icon={<Trophy className="h-5 w-5" />}
                title="Competencias"
                text="Concursos y retos tecnológicos."
              />

              <ActivityItem
                to="/dashboard?tipo=proveedores"
                icon={<Store className="h-5 w-5" />}
                title="Exposición de proveedores"
                text="Muestras de soluciones y servicios tecnológicos."
              />
            </div>

            <div className="mt-6 grid gap-3 border-t border-white/10 pt-5">
              <ContactLine
                icon={<Phone className="h-4 w-4" />}
                text="(998) 880-74-32"
                href="tel:9988807432"
              />

              <ContactLine
                icon={<Globe2 className="h-4 w-4" />}
                text="https://cancun.tecnm.mx"
                href="https://cancun.tecnm.mx"
              />

              <ContactLine
                icon={<Mail className="h-4 w-4" />}
                text="sistemas@cancun.tecnm.mx"
                href="mailto:sistemas@cancun.tecnm.mx"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN INFERIOR */}
      <section className="relative border-t border-white/10 bg-[#020617] px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle,rgba(56,189,248,0.8)_1px,transparent_1.5px)] [background-size:28px_28px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
              Plataforma del evento
            </p>

            <h2 className="text-3xl font-black text-white sm:text-4xl">
              Gestiona tu participación en la jornada
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-white/65">
              Desde Hub Académico podrás consultar eventos, revisar conferencistas,
              reservar tu asistencia y acceder a la información de las actividades.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <BottomCard
              title="Explora conferencias"
              text="Consulta la programación académica, horarios, cupos y detalles de cada actividad."
              to="/dashboard"
            />

            <BottomCard
              title="Reserva tu lugar"
              text="Inicia sesión para registrarte en los eventos disponibles y asegurar tu participación."
              to="/login"
            />

            <BottomCard
              title="Consulta conferencistas"
              text="Revisa el perfil de los ponentes, sus áreas de experiencia y actividades asignadas."
              to="/speakers"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#01030c] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <p className="font-bold text-white">
              Hub Académico — Jornada Académica de Ingeniería en Sistemas 2026
            </p>
            <p className="text-sm text-white/50">
              Tecnológico Nacional de México — Instituto Tecnológico de Cancún
            </p>
          </div>

          <p className="text-sm text-white/50">
            © 2026 Hub Académico. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

type InfoPillProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const InfoPill: React.FC<InfoPillProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-black/20 backdrop-blur-md">
      <div className="text-cyan-300">{icon}</div>
      <div>
        <p className="text-sm text-white/55">{label}</p>
        <p className="font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

type ActivityItemProps = {
  to: string;
  icon: React.ReactNode;
  title: string;
  text: string;
};

const ActivityItem: React.FC<ActivityItemProps> = ({ to, icon, title, text }) => {
  return (
    <Link
      to={to}
      className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition-all hover:translate-x-1 hover:border-cyan-300/30 hover:bg-white/[0.1]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-700 text-white shadow-lg shadow-blue-700/20">
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="font-black uppercase tracking-wide text-white">
          {title}
        </h3>
        <p className="text-sm text-white/60">{text}</p>
      </div>

      <ChevronRight className="mt-2 h-4 w-4 text-white/30 transition-colors group-hover:text-cyan-300" />
    </Link>
  );
};

type ContactLineProps = {
  icon: React.ReactNode;
  text: string;
  href: string;
};

const ContactLine: React.FC<ContactLineProps> = ({ icon, text, href }) => {
  const isExternal = href.startsWith('http');

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      className="flex items-center gap-3 text-sm text-cyan-200 transition-colors hover:text-white"
    >
      <span className="text-cyan-300">{icon}</span>
      <span>{text}</span>
    </a>
  );
};

type BottomCardProps = {
  title: string;
  text: string;
  to: string;
};

const BottomCard: React.FC<BottomCardProps> = ({ title, text, to }) => {
  return (
    <Link
      to={to}
      className="group rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-xl shadow-black/20 transition-all hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.09]"
    >
      <div className="mb-5 h-1.5 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-700" />
      <h3 className="mb-3 text-xl font-black text-white">{title}</h3>
      <p className="leading-relaxed text-white/65">{text}</p>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-300">
        Ver más
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

export default Landing;
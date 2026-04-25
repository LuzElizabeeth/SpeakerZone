CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS attendances CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS conferences CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS speakers CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(30) NOT NULL CHECK (rol IN ('asistente', 'conferencista', 'administrativo')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES usuarios(id) ON DELETE SET NULL,
  name VARCHAR(140) NOT NULL,
  role VARCHAR(120) NOT NULL DEFAULT 'Conferencista',
  bio TEXT NOT NULL DEFAULT '',
  organization VARCHAR(160) NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(180) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location VARCHAR(180) NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  status VARCHAR(30) NOT NULL CHECK (status IN ('activo', 'finalizado', 'próximo')) DEFAULT 'próximo',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE conferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  speaker_id UUID REFERENCES speakers(id) ON DELETE SET NULL,
  title VARCHAR(220) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  conference_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  location VARCHAR(180) NOT NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN ('presencial', 'virtual', 'híbrida')) DEFAULT 'presencial',
  status VARCHAR(30) NOT NULL CHECK (status IN ('próxima', 'en-curso', 'finalizada', 'cancelada')) DEFAULT 'próxima',
  capacity INT NOT NULL DEFAULT 100 CHECK (capacity >= 0),
  image_url TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendee_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  registered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(30) NOT NULL CHECK (status IN ('confirmada', 'pendiente', 'cancelada')) DEFAULT 'confirmada',
  qr_code TEXT NOT NULL UNIQUE,
  UNIQUE (attendee_id, conference_id)
);

CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
  checked_in BOOLEAN NOT NULL DEFAULT FALSE,
  checked_in_at TIMESTAMP,
  checked_by UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
  speaker_id UUID REFERENCES speakers(id) ON DELETE CASCADE,
  certificate_type VARCHAR(30) NOT NULL CHECK (certificate_type IN ('asistente', 'conferencista')),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  validation_code TEXT NOT NULL UNIQUE,
  certificate_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CHECK (registration_id IS NOT NULL OR speaker_id IS NOT NULL)
);

CREATE INDEX idx_conferences_event_id ON conferences(event_id);
CREATE INDEX idx_conferences_speaker_id ON conferences(speaker_id);
CREATE INDEX idx_conferences_date ON conferences(conference_date, start_time);
CREATE INDEX idx_registrations_attendee_id ON registrations(attendee_id);
CREATE INDEX idx_registrations_conference_id ON registrations(conference_id);

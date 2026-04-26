CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS attendances CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS speakers CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(30) NOT NULL CHECK (rol IN ('asistente', 'conferencista', 'administrativo')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  email_verification_token TEXT,
  email_verification_expires TIMESTAMP,
  email_verification_last_sent_at TIMESTAMP,
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


CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name VARCHAR(180) NOT NULL,

  slug VARCHAR(220) NOT NULL UNIQUE,

  description TEXT NOT NULL DEFAULT '',

  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  location VARCHAR(180) NOT NULL,

  image_url TEXT NOT NULL DEFAULT '',

  status VARCHAR(30) NOT NULL
    CHECK (
      status IN (
        'activo',
        'finalizado',
        'próximo'
      )
    )
    DEFAULT 'próximo',

  registration_open BOOLEAN NOT NULL
    DEFAULT TRUE,

  featured BOOLEAN NOT NULL
    DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  program_id UUID NOT NULL
    REFERENCES programs(id)
    ON DELETE CASCADE,

  speaker_id UUID
    REFERENCES speakers(id)
    ON DELETE SET NULL,

  title VARCHAR(220) NOT NULL,
  description TEXT NOT NULL DEFAULT '',

  activity_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,

  location VARCHAR(180) NOT NULL,

  activity_type VARCHAR(40) NOT NULL
    CHECK (
      activity_type IN (
        'conferencia',
        'Taller',
        'Evento',
        'Evento_especial'
      )
    )
    DEFAULT 'conferencia',

  modality VARCHAR(30) NOT NULL
    CHECK (
      modality IN (
        'presencial',
        'virtual',
        'híbrida'
      )
    )
    DEFAULT 'presencial',

  status VARCHAR(30) NOT NULL
    CHECK (
      status IN (
        'próxima',
        'en-curso',
        'finalizada',
        'cancelada'
      )
    )
    DEFAULT 'próxima',

  capacity INT NOT NULL
    DEFAULT 100
    CHECK (capacity >= 0),

  requires_registration BOOLEAN NOT NULL
    DEFAULT TRUE,

  registration_type VARCHAR(40) NOT NULL
    CHECK (
      registration_type IN (
        'internal_form',
        'external_link',
        'none'
      )
    )
    DEFAULT 'internal_form',

  external_registration_url TEXT NOT NULL
    DEFAULT '',

  certificate_available BOOLEAN NOT NULL
    DEFAULT FALSE,

  requirements TEXT[] NOT NULL
    DEFAULT '{}',

  image_url TEXT NOT NULL DEFAULT '',

  tags TEXT[] NOT NULL DEFAULT '{}',

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendee_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  registered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(30) NOT NULL CHECK (status IN ('confirmada', 'pendiente', 'cancelada')) DEFAULT 'confirmada',
  qr_code TEXT NOT NULL UNIQUE,
  UNIQUE (attendee_id, activity_id)
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

CREATE INDEX idx_activities_program_id ON activities(program_id);
CREATE INDEX idx_activities_speaker_id ON activities(speaker_id);
CREATE INDEX idx_activities_date ON activities(activity_date, start_time);
CREATE INDEX idx_registrations_attendee_id ON registrations(attendee_id);
CREATE INDEX idx_registrations_activity_id ON registrations(activity_id);

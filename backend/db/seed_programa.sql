INSERT INTO usuarios (id, nombre, email, password, rol)
VALUES
<<<<<<< HEAD
(
  '30000000-0000-0000-0000-000000000001',
  'Administrador SpeakerZone',
  'admin@speakerzone.com',
  crypt('123456', gen_salt('bf')),
  'administrativo'
),
(
  '30000000-0000-0000-0000-000000000002',
  'Conferencista Demo',
  'speaker@speakerzone.com',
  crypt('123456', gen_salt('bf')),
  'conferencista'
),
(
  '30000000-0000-0000-0000-000000000003',
  'Asistente Demo',
  'asistente@speakerzone.com',
  crypt('123456', gen_salt('bf')),
  'asistente'
);
=======
('30000000-0000-0000-0000-000000000001','Administrador Hub académico','admin@speakerzone.com', crypt('123456', gen_salt('bf')), 'administrativo'),
('30000000-0000-0000-0000-000000000002','Conferencista Demo','speaker@speakerzone.com', crypt('123456', gen_salt('bf')), 'conferencista'),
('30000000-0000-0000-0000-000000000003','Asistente Demo','asistente@speakerzone.com', crypt('123456', gen_salt('bf')), 'asistente');
>>>>>>> 856e44db71a9868f0b96e35aa2ff95e83b4997f6


INSERT INTO programs (
  id,
  name,
  slug,
  description,
  start_date,
  end_date,
  location,
  image_url,
  status,
  registration_open,
  featured
)
VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'Jornada de Ingeniería en Sistemas Computacionales 2026',
  'jornada-ingenieria-sistemas-2026',
  'Programa oficial de la Jornada de Ingeniería en Sistemas Computacionales del Instituto Tecnológico de Cancún.',
  '2026-04-27',
  '2026-04-30',
  'Instituto Tecnológico de Cancún',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  'próximo',
  true,
  true
);


INSERT INTO speakers (
  id,
  name,
  role,
  bio,
  organization,
  avatar_url
)
VALUES
(
  '10000000-0000-0000-0000-000000000001',
  'Miguel Eduardo Romero Ruiz',
  'Conferencista Magistral',
  'Ponente principal sobre innovación tecnológica e inteligencia artificial.',
  'Omega Up',
  ''
),
(
  '10000000-0000-0000-0000-000000000002',
  'Francisco Mis C.',
  'Tallerista',
  'Especialista en fibra óptica y redes empresariales.',
  'Mistel Comunicaciones',
  ''
),
(
  '10000000-0000-0000-0000-000000000003',
  'Roger Antonio Munguia',
  'Conferencista',
  'Especialista en redes y telecomunicaciones.',
  'Cisco',
  ''
);


INSERT INTO activities (
  id,
  program_id,
  speaker_id,
  title,
  description,
  activity_date,
  start_time,
  end_time,
  location,
  activity_type,
  modality,
  status,
  capacity,
  requires_registration,
  registration_type,
  external_registration_url,
  certificate_available,
  requirements,
  image_url,
  tags
)
VALUES

(
  '20000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'Inauguración de la Jornada ISC',
  'Inicio oficial del programa académico.',
  '2026-04-27',
  '09:00',
  '10:00',
  'Auditorio Principal',
  'Evento',
  'presencial',
  'próxima',
  200,
  false,
  'none',
  '',
  false,
  ARRAY[]::TEXT[],
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  ARRAY['Jornada', 'Inauguración']
),

(
  '20000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  'Taller PON-LAN Network',
  'Taller especializado en fibra óptica y redes.',
  '2026-04-29',
  '09:00',
  '11:00',
  'Sala Benito Juárez',
  'Taller',
  'presencial',
  'próxima',
  60,
  true,
  'internal_form',
  '',
  true,
  ARRAY[
    'Registro previo obligatorio',
    'Llegar 15 minutos antes'
  ],
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
  ARRAY['Fibra óptica', 'Networking']
),

(
  '20000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000003',
  'Introducción a las Redes',
  'Conferencia sobre fundamentos de redes modernas.',
  '2026-04-28',
  '17:00',
  '18:00',
  'Microsoft Teams',
  'conferencia',
  'híbrida',
  'próxima',
  300,
  true,
  'external_link',
  'https://forms.google.com/example',
  true,
  ARRAY[
    'Registro obligatorio',
    'Acceso mediante correo institucional'
  ],
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8',
  ARRAY['Cisco', 'Redes', 'Telecomunicaciones']
);




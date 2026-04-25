INSERT INTO usuarios (id, nombre, email, password, rol)
VALUES
('30000000-0000-0000-0000-000000000001','Administrador SpeakerZone','admin@speakerzone.com', crypt('123456', gen_salt('bf')), 'administrativo'),
('30000000-0000-0000-0000-000000000002','Conferencista Demo','speaker@speakerzone.com', crypt('123456', gen_salt('bf')), 'conferencista'),
('30000000-0000-0000-0000-000000000003','Asistente Demo','asistente@speakerzone.com', crypt('123456', gen_salt('bf')), 'asistente');

INSERT INTO events (id, name, description, start_date, end_date, location, image_url, status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Jornada de Ingeniería en Sistemas Computacionales',
  'Programa oficial de la Jornada de Ingeniería en Sistemas Computacionales del Instituto Tecnológico de Cancún, del 27 al 30 de abril de 2026.',
  '2026-04-27',
  '2026-04-30',
  'Instituto Tecnológico de Cancún',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  'próximo'
);

INSERT INTO speakers (id, name, role, bio, organization, avatar_url)
VALUES
('10000000-0000-0000-0000-000000000001','Comité Organizador','Responsable del evento','Equipo organizador de la Jornada ISC.','Instituto Tecnológico de Cancún',''),
('10000000-0000-0000-0000-000000000002','Cecilio Chi','Responsable de actividad','Participa en la inauguración OMEGA UP y reconocimiento a la academia.','Academia ISC',''),
('10000000-0000-0000-0000-000000000003','Comité de programación','Organizador','Equipo responsable de los concursos de programación.','Instituto Tecnológico de Cancún',''),
('10000000-0000-0000-0000-000000000004','Roger','Conferencista','Conferencista invitado para temas de data center y redes.','TrippLite / Cisco',''),
('10000000-0000-0000-0000-000000000005','Gaby','Conferencista','Conferencista invitada de Salto Systems.','Salto Systems',''),
('10000000-0000-0000-0000-000000000006','Comité Hackatec','Organizador','Equipo responsable de las actividades Hackatec.','Instituto Tecnológico de Cancún',''),
('10000000-0000-0000-0000-000000000007','Freddy','Conferencista','Conferencista invitado para el tema Construye tu éxito.','TrippLite',''),
('10000000-0000-0000-0000-000000000008','Octavio','Responsable Hackatec','Responsable de inicio, cierre y premiación de Hackatec.','Instituto Tecnológico de Cancún',''),
('10000000-0000-0000-0000-000000000009','Francisco Mis C.','Tallerista','Tallerista de fibra óptica y PON-LAN Network.','Mistel Comunicaciones',''),
('10000000-0000-0000-0000-000000000010','Israel Cupul','Conferencista','Conferencista del tema Porque *NIX.','Instituto Tecnológico de Cancún',''),
('10000000-0000-0000-0000-000000000011','Ciro','Conferencista','Conferencista sobre telecomunicaciones modernas.','Cisco',''),
('10000000-0000-0000-0000-000000000012','Luis Tejeda','Conferencista','Conferencista sobre Kubernetes y Docker.','Por confirmar','');

INSERT INTO conferences (id, event_id, speaker_id, title, description, conference_date, start_time, end_time, location, type, status, capacity, image_url, tags)
VALUES
('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Inauguración de la Jornada ISC','Inicio oficial de la Jornada de Ingeniería en Sistemas Computacionales.','2026-04-27','09:00','10:00','Auditorio','presencial','próxima',200,'https://images.unsplash.com/photo-1540575467063-178a50c2df87',ARRAY['Jornada','Inauguración']),
('20000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','OMEGA UP y reconocimiento a la academia','Inauguración OMEGA UP y reconocimiento a la academia. Responsable: Cecilio Chi.','2026-04-27','10:00','11:00','','presencial','próxima',200,'https://images.unsplash.com/photo-1540575467063-178a50c2df87',ARRAY['OmegaUp','Academia']),
('20000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','Concurso de Programación Prepas','Concurso de programación para preparatorias dentro de la Jornada ISC.','2026-04-27','12:00','15:00','','presencial','próxima',120,'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',ARRAY['Programación','Concurso']),
('20000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','Concurso de Programación ITC','Concurso de programación ITC de 09:00 a 13:00.','2026-04-28','09:00','13:00','','presencial','próxima',120,'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',ARRAY['Programación','Concurso']),
('20000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000004','La energía en el Data Center','Conferencia impartida por Roger de TrippLite sobre energía en centros de datos.','2026-04-28','10:00','11:00','','presencial','próxima',200,'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',ARRAY['Data Center','Energía','Infraestructura']),
('20000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000005','Controles de acceso inteligentes, on premise y en la nube','Conferencia de Gaby de Salto Systems sobre controles de acceso inteligentes.','2026-04-28','12:00','13:00','','presencial','próxima',200,'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',ARRAY['Seguridad','Nube','IoT']),
('20000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000006','Hackatec Tucantón - Inicio','Inicio del Hackatec Tucantón dentro de la Jornada ISC.','2026-04-28','14:00','15:00','','presencial','próxima',150,'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',ARRAY['Hackatec','Innovación']),
('20000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000007','Construye tu éxito','Conferencia pendiente de confirmar con Freddy de TrippLite.','2026-04-28','16:00','17:00','','presencial','próxima',200,'https://images.unsplash.com/photo-1552664730-d307ca884978',ARRAY['Éxito profesional','Tecnología']),
('20000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000004','Introducción a las redes','Conferencia de Roger de Cisco en Teams sobre introducción a las redes.','2026-04-28','17:00','18:00','Microsoft Teams / ','híbrida','próxima',300,'https://images.unsplash.com/photo-1544197150-b99a580bb7a8',ARRAY['Redes','Cisco','Telecomunicaciones']),
('20000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000008','Hackatec - Inicio','Inicio de Hackatec. Responsable: Octavio, apoyo Paola, Rocío, Dianela e Israel.','2026-04-29','08:00','09:00','','presencial','próxima',150,'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',ARRAY['Hackatec']),
('20000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000009','Taller PON-LAN Network','Taller de fibra óptica por Mistel Comunicaciones. Ponente: Francisco Mis C.','2026-04-29','09:00','11:00','Sala Benito Juárez','presencial','próxima',60,'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',ARRAY['Fibra óptica','PON-LAN','Redes']),
('20000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000010','Porque *NIX','Conferencia impartida por Israel Cupul sobre sistemas *NIX.','2026-04-29','12:00','13:00','','presencial','próxima',200,'https://images.unsplash.com/photo-1518773553398-650c184e0bb3',ARRAY['Unix','Linux','Sistemas operativos']),
('20000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000006','Hackatec Tucantón - Finaliza','Cierre del Hackatec Tucantón.','2026-04-29','19:00','20:00','','presencial','próxima',150,'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',ARRAY['Hackatec','Cierre']),
('20000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000011','Detrás de la red: diseño, desarrollo e implementación en telecomunicaciones modernas','Conferencia de Ciro de Cisco Teams sobre telecomunicaciones modernas.','2026-04-30','10:00','11:00','Microsoft Teams / ','híbrida','próxima',300,'https://images.unsplash.com/photo-1544197150-b99a580bb7a8',ARRAY['Telecomunicaciones','Cisco','Redes']),
('20000000-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000012','Kubernetes vs Dockers','Conferencia de Luis Tejeda sobre Kubernetes y Docker.','2026-04-30','11:00','12:00','','presencial','próxima',200,'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9',ARRAY['Kubernetes','Docker','DevOps']),
('20000000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000008','Fin y premiación de Hackatec','Cierre y premiación de Hackatec. Responsable: Octavio, apoyo Paola, Rocío, Dianela e Israel.','2026-04-30','13:00','14:00','','presencial','próxima',200,'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',ARRAY['Hackatec','Premiación']);

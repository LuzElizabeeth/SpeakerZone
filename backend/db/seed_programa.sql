INSERT INTO usuarios (id, nombre, email, password, rol)
VALUES
('30000000-0000-0000-0000-000000000001','Administrador Hub académico','admin@speakerzone.com', crypt('123456', gen_salt('bf')), 'administrativo'),
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
('10000000-0000-0000-0000-000000000001','Miguel Eduardo Romero Ruiz','Conferencista Magistral','Ponente de la conferencia magistral "LLM''s vs Real Thinking".','Omega Up',''),
('10000000-0000-0000-0000-000000000002','Francisco Mis C.','Tallerista','Ponente del taller de fibra óptica y PON-LAN Network.','Mistel Comunicaciones',''),
('10000000-0000-0000-0000-000000000003','Freddy Canul Vargas','Conferencista','Senior Sales Manager y gerente regional de ventas y proyectos. Participa con stand y conferencia sobre energía en el Data Center.','Eaton - Tripp Lite',''),
('10000000-0000-0000-0000-000000000004','Gabriela Castillo','Conferencista','Regional Sales Manager. Participa con conferencia sobre controles de acceso inteligentes, on premise y en la nube.','Salto Systems',''),
('10000000-0000-0000-0000-000000000005','Ing. Jorge Marcial','Conferencista','Representante de Dahua. Ponente de IA impulsada en seguridad electrónica.','Dahua',''),
('10000000-0000-0000-0000-000000000006','Roger Antonio Munguia Mairena','Conferencista','Ponente de Cisco para la conferencia Introducción a las Redes.','Cisco',''),
('10000000-0000-0000-0000-000000000007','Israel Cupul','Conferencista','Ponente de la conferencia ¿Por qué *NIX?','IT Cancún',''),
('10000000-0000-0000-0000-000000000008','José Jonathan Tuyub Uc','Conferencista','Ponente de la conferencia Seguridad - Conceptos básicos de pentest.','Por confirmar',''),
('10000000-0000-0000-0000-000000000009','Dr. Pedro Ortiz','Conferencista','Ponente de la conferencia sobre uso de IA generativa como apoyo para proyectos y documentos.','IT Mérida',''),
('10000000-0000-0000-0000-000000000010','Ciro Ramón Juárez Melchor','Conferencista','Ponente de la conferencia Detrás de la red: diseño, desarrollo e implementación en telecomunicaciones modernas.','Cisco / NetDreamTeam',''),
('10000000-0000-0000-0000-000000000011','Ing. Melisa Murua','Conferencista','Ponente de la conferencia sobre evolución de la IA y prevención de ciberataques.','Por confirmar',''),
('10000000-0000-0000-0000-000000000012','Luis Tejeda','Conferencista','Ponente de la conferencia Kubernetes vs Docker.','Por confirmar',''),
('10000000-0000-0000-0000-000000000013','Carlos Zarate','Tallerista','Ponente del taller Fibra Óptica en instalaciones de Telmex.','Telmex',''),
('10000000-0000-0000-0000-000000000014','Alejandro Padilla','Tallerista','Ponente del taller Fibra Óptica en instalaciones de Telmex.','Telmex','');

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

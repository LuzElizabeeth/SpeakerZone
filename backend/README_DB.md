# Base de datos SpeakerZone TecNM

## 1. Crear base de datos

```bash
createdb speakerzone_tecnm
```

O desde PostgreSQL:

```sql
CREATE DATABASE speakerzone_tecnm;
```

## 2. Configurar variables de entorno

Copia `.env.example` a `.env` dentro de `backend`:

```bash
cp .env.example .env
```

Edita `DB_PASS` con tu contraseña real de PostgreSQL.

## 3. Crear tablas

Desde la carpeta `backend`:

```bash
psql -U postgres -d speakerzone_tecnm -f db/schema.sql
```

## 4. Insertar datos reales del Excel PROGRAMA.xlsx

```bash
psql -U postgres -d speakerzone_tecnm -f db/seed_programa.sql
```

## 5. Instalar y correr backend

```bash
npm install
npm run dev
```

Prueba la conexión:

```bash
curl http://localhost:5001/api/db-check
```

Prueba conferencias:

```bash
curl http://localhost:5001/api/conferences
```

## Tablas principales

- `usuarios`: asistentes, conferencistas y administrativos.
- `speakers`: datos públicos de conferencistas.
- `events`: eventos generales, por ejemplo la Jornada ISC.
- `conferences`: conferencias, talleres y actividades del programa.
- `registrations`: registro de asistentes a conferencias, con QR único.
- `attendances`: validación de asistencia por QR.
- `certificates`: certificados de asistentes y conferencistas.

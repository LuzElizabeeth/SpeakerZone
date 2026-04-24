# Conectar frontend con backend - SpeakerZone TecNM

## 1. Levantar PostgreSQL y cargar datos reales del Excel

Desde la carpeta `backend`:

```bash
cd backend
cp .env.example .env
npm install
```

Edita `.env` con tus datos reales de PostgreSQL:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=speakerzone_tecnm
DB_PASS=tu_password
DB_PORT=5432
PORT=5001
FRONTEND_URL=http://localhost:5173
```

Crea la base de datos:

```bash
createdb -U postgres speakerzone_tecnm
```

Carga tablas y datos del programa real:

```bash
npm run db:reset
```

Prueba conexión:

```bash
npm run dev
```

Abre en el navegador:

```txt
http://localhost:5001/api/db-check
http://localhost:5001/api/conferences
http://localhost:5001/api/events
http://localhost:5001/api/speakers
```

## 2. Configurar frontend para apuntar a la API

Desde la carpeta `frontend`:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

El archivo `.env` debe tener:

```env
VITE_API_URL=http://localhost:5001/api
```

## 3. Archivos del frontend que ya quedaron conectados

Se agregó:

```txt
frontend/src/app/services/api.ts
frontend/src/app/hooks/useApi.ts
```

Se conectaron a la API:

```txt
frontend/src/app/pages/Landing.tsx
frontend/src/app/pages/Dashboard.tsx
frontend/src/app/pages/ConferenceDetail.tsx
frontend/src/app/pages/admin/AdminDashboard.tsx
frontend/src/app/pages/admin/AdminConferences.tsx
frontend/src/app/components/ConferenceCard.tsx
frontend/src/app/types/conference.types.ts
```

## 4. Qué ya funciona con datos reales

- Landing muestra la próxima conferencia desde PostgreSQL.
- Dashboard muestra conferencias desde `/api/conferences`.
- Detalle de conferencia usa `/api/conferences/:id`.
- Admin dashboard calcula estadísticas con datos reales.
- Admin conferencias permite listar, crear, editar y eliminar conferencias en PostgreSQL.
- Conferencistas y eventos se toman desde `/api/speakers` y `/api/events`.

## 5. Flujo correcto para correr todo

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Después entra a:

```txt
http://localhost:5173
```

## 6. Si sale error de CORS

Revisa que en `backend/.env` tengas:

```env
FRONTEND_URL=http://localhost:5173
```

Y reinicia backend:

```bash
npm run dev
```

## 7. Si sale error `vite: command not found`

Dentro de `frontend` ejecuta:

```bash
npm install
npm run dev
```

## 8. Si no aparecen conferencias

Primero prueba directamente:

```txt
http://localhost:5001/api/conferences
```

Si ahí no sale información, el problema está en backend o PostgreSQL.
Si ahí sí sale información, el problema está en `VITE_API_URL` o en que no reiniciaste Vite.

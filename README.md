# 🎤 Hub académico

Sistema web para la gestión de conferencias, ponentes y asistentes dentro del Tecnológico Nacional de México.

---

## 🚀 Descripción

**Hub académico** es una plataforma diseñada para administrar eventos académicos, permitiendo:

* 📢 Gestión de conferencias
* 👨‍🏫 Administración de ponentes
* 👥 Registro de asistentes
* 🎟️ Generación de certificados
* 📊 Paneles de administración y usuario

Este sistema está pensado para facilitar la organización de eventos dentro de instituciones educativas.

---

## 🧠 Tecnologías utilizadas

### Frontend

* React / Vite / Next.js 
* TypeScript
* TailwindCSS
* React Router

### Backend

* Node.js
* Express
* PostgreSQL

### Herramientas

* Git & GitHub
* Postman
* VS Code

---

## 📁 Estructura del proyecto

```
SpeakerZone/
│
├── frontend/        # Aplicación cliente
│
├── backend/         # API y lógica de negocio
│
├── docs/         # documentos .md
│
└── README.md
```

---

## ⚙️ Instalación y ejecución

### 🔹 Clonar el repositorio

```bash
git clone https://github.com/LuzElizabeeth/SpeakerZone.git
cd SpeakerZone
```

---

### 🔹 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### 🔹 Backend

```bash
cd backend
npm install
npm run dev
```

---

## 🔐 Variables de entorno

Crear un archivo `.env` en la carpeta `backend` con:

```
DB_USER=tu_usuario
DB_HOST=localhost
DB_NAME=tu_base
DB_PASSWORD=tu_password
DB_PORT=5432
JWT_SECRET=una_clave_segura
PORT=5001

# Correo de verificación (obligatorio para registro)
EMAIL_USER=tu_correo_speakerzone@gmail.com
EMAIL_PASS=tu_app_password_gmail
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:5001
```

Para producción (Render/Vercel/Netlify), configurar además:

```
DATABASE_URL=postgresql://...
FRONTEND_URL=https://tu-frontend.com
BASE_URL=https://tu-backend.com
```

> Nota: `DB_PASS` también es aceptado por compatibilidad, pero el valor recomendado es `DB_PASSWORD`.

---

## ✅ Flujo de verificación de correo

1. El usuario se registra.
2. El backend envía un correo desde la cuenta de SpeakerZone.
3. El usuario abre el enlace de verificación.
4. Solo después de verificar el correo puede iniciar sesión.

---

## 📌 Funcionalidades principales

* ✔️ Login de usuarios (Admin / Ponente)
* ✔️ CRUD de conferencias
* ✔️ CRUD de ponentes
* ✔️ Registro de asistentes
* ✔️ Generación de certificados
* ✔️ Dashboard administrativo
* ✔️ Notificaciones

---

## 🧪 Estado del proyecto

🚧 En desarrollo

---

## 👨‍💻 Autor

* Luz Elizabeth
* Eduardo Ramirez
* Maritza Yam
* Proyecto académico - TecNM

---

## 📄 Licencia

Este proyecto es de uso académico.

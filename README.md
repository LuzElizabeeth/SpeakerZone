#  SpeakerZone TecNM

Sistema web para la gestión de conferencias, ponentes y asistentes dentro del Tecnológico Nacional de México.

---

##  Descripción

**SpeakerZone** es una plataforma diseñada para administrar eventos académicos, permitiendo:

* 📢 Gestión de conferencias
* 👨‍🏫 Administración de ponentes
* 👥 Registro de asistentes
* 🎟️ Generación de certificados
* 📊 Paneles de administración y usuario

Este sistema está pensado para facilitar la organización de eventos dentro de instituciones educativas.

---

##  Tecnologías utilizadas

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

##  Estructura del proyecto

```
SpeakerZone/
│
├── frontend/        # Aplicación cliente
│
├── backend/         # API y lógica de negocio
│
├── docs/         # documentos
│
└── README.md
```

---

##  Instalación y ejecución

### - Clonar el repositorio

```bash
git clone https://github.com/LuzElizabeeth/SpeakerZone.git
cd SpeakerZone
```

---

### - Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### - Backend

```bash
cd backend
npm install
npm run dev
```

---

## - Variables de entorno

Crear un archivo `.env` en la carpeta `backend` con:

```
DB_USER=tu_usuario
DB_HOST=localhost
DB_NAME=tu_base
DB_PASS=tu_password
DB_PORT=5432
```

---

##  Funcionalidades principales

* ✔️ Login de usuarios (Admin / Ponente)
* ✔️ CRUD de conferencias
* ✔️ CRUD de ponentes
* ✔️ Registro de asistentes
* ✔️ Generación de certificados
* ✔️ Dashboard administrativo
* ✔️ Notificaciones

---

##  Estado del proyecto

🚧 En desarrollo

---

##  Autores

* Luz Elizabeth
* Eduardo Ramirez
* Proyecto académico - TecNM

---

##  Licencia

Este proyecto es de uso académico.

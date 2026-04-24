# 🎯 SpeakerZone - Plataforma de Gestión de Conferencias

<div align="center">

![SpeakerZone](https://img.shields.io/badge/SpeakerZone-MVP-2563eb?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

**Conectando Ideas, Inspirando Innovación**

[Demo](#) | [Documentación](./STRUCTURE.md) | [Guía de Roles](./ROLES_GUIDE.md) | [Reportar Bug](#)

</div>

---

## 📖 Descripción

**SpeakerZone** es una plataforma centralizada para la gestión de conferencias que optimiza el registro, control de aforo y reserva de plazas, eliminando procesos manuales y mejorando la experiencia tanto de organizadores como de asistentes.

### ✨ Características Principales

- 🎫 **Gestión de Aforo Automática** - Control inteligente de cupo con reserva en tiempo real
- 👥 **Multi-Rol** - Paneles específicos para Asistentes, Speakers y Administradores
- 📱 **Acceso mediante QR** - Generación de códigos QR para acceso rápido
- 📊 **Panel de Estadísticas** - Dashboard con métricas en tiempo real
- 🔍 **Búsqueda Avanzada** - Filtros por modalidad y búsqueda instantánea
- �� **Diseño Moderno** - Interfaz limpia con paleta azul vibrante
- 📱 **Responsive** - Experiencia perfecta en móvil, tablet y desktop
- 🔐 **Autenticación Multi-Rol** - Sistema de login con roles diferenciados

---

## 🎭 Sistema de Roles

SpeakerZone soporta 3 tipos de usuarios con paneles y funcionalidades específicas:

### 📝 Asistente (Attendee)

- Explorar conferencias disponibles
- Reservar plazas
- Ver detalles de conferencias
- Acceder a directorio de speakers

### 🎤 Conferencista (Speaker)

- Dashboard personal con estadísticas
- Gestión de conferencias asignadas
- Ver lista de asistentes
- Descargar certificados de participación
- Editar perfil profesional

### 👨‍💼 Administrador (Admin)

- Panel de control global
- Gestión de eventos y conferencias
- Administración de speakers
- Gestión de asistentes
- Escáner de códigos QR
- Estadísticas y reportes

**👉 Ver [Guía de Roles](./ROLES_GUIDE.md) para instrucciones detalladas de cada rol**

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/speakerzone.git

# Navegar al directorio
cd speakerzone

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 🧪 Probar Diferentes Roles

1. Ve a `http://localhost:5173/login`
2. Selecciona el rol que quieres probar
3. Usa estos emails de prueba:
   - **Asistente:** `usuario@email.com`
   - **Speaker:** `speaker@email.com`
   - **Admin:** `admin@email.com`
4. Ingresa cualquier contraseña

---

## 🏗️ Stack Tecnológico

| Tecnología       | Versión  | Propósito             |
| ---------------- | -------- | --------------------- |
| **React**        | 18.3.1   | Framework UI          |
| **TypeScript**   | Latest   | Tipado estático       |
| **Tailwind CSS** | 4.0      | Estilos utility-first |
| **React Router** | 7.13.0   | Navegación            |
| **Motion**       | 12.23.24 | Animaciones           |
| **Lucide React** | 0.487.0  | Iconografía           |
| **Sonner**       | 2.0.3    | Notificaciones toast  |
| **Vite**         | 6.3.5    | Build tool            |

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/      # Componentes reutilizables
│   ├── pages/          # Páginas de la aplicación
│   ├── context/        # Context API (Auth)
│   ├── types/          # Definiciones TypeScript
│   ├── data/           # Mock data
│   ├── routes.ts       # Configuración de rutas
│   └── App.tsx         # Componente principal
└── styles/
    ├── theme.css       # Variables CSS y tema
    ├── tailwind.css    # Configuración Tailwind
    └── fonts.css       # Fuentes personalizadas
```

Ver [STRUCTURE.md](./STRUCTURE.md) para documentación completa.

---

## 🎨 Paleta de Colores

La identidad visual se basa en un gradiente azul vibrante:

```css
--deep-blue: #1e3a8a;
--bright-blue: #3b82f6;
--blue-gradient-start: #1e40af;
--blue-gradient-end: #60a5fa;
--blue-accent: #2563eb;
--blue-light: #dbeafe;
```

---

## 📄 Páginas Implementadas

| Ruta              | Descripción                        | Estado      |
| ----------------- | ---------------------------------- | ----------- |
| `/`               | Landing page con hero section      | ✅ Completo |
| `/dashboard`      | Grid de conferencias con filtros   | ✅ Completo |
| `/conference/:id` | Detalles de conferencia individual | ✅ Completo |
| `/login`          | Sistema de login/registro          | ✅ Completo |
| `/speakers`       | Directorio de conferencistas       | ✅ Completo |
| `/about`          | Acerca de la plataforma            | ✅ Completo |

---

## 🔑 Características Detalladas

### 1. Sistema de Conferencias

- **Grid Responsive**: Layout adaptable 1/2/3 columnas
- **Tarjetas Interactivas**: Hover effects y animaciones
- **Control de Aforo**:
  - Barra de progreso con colores semafóricos
  - Bloqueo automático cuando está lleno
  - Contador de plazas disponibles
- **Badges Dinámicos**: Indicadores visuales por tipo (Presencial/Virtual/Híbrida)

### 2. Página de Detalles

- **Información Completa**: Fecha, hora, ubicación, capacidad
- **Speaker Profile**: Bio, organización, experiencia
- **Sidebar de Reserva**:
  - Estado de ocupación en tiempo real
  - Beneficios incluidos
  - Botón de acción prominente
- **Interacciones**: Compartir y agregar a favoritos

### 3. Autenticación

- **Mock Authentication**: Sistema de demo funcional
- **Persistencia**: LocalStorage para mantener sesión
- **UI Bipartita**: Formulario + imagen inspiracional
- **Notificaciones**: Toast feedback con Sonner
- **Context API**: Estado global de usuario

### 4. Búsqueda y Filtros

- **Búsqueda en Tiempo Real**: Sin delay, instantánea
- **Filtros por Tipo**: Presencial, Virtual, Híbrida
- **Multi-criterio**: Busca en título, descripción, speaker
- **Estado Vacío**: UI amigable cuando no hay resultados

---

## 🎯 Componentes Reutilizables

### ConferenceCard

```tsx
<ConferenceCard
  conference={conference}
  onRegister={(id) => handleRegister(id)}
  onViewDetails={(id) => handleViewDetails(id)}
/>
```

**Props:**

- `conference: Conference` - Objeto con datos de la conferencia
- `onRegister?: (id: string) => void` - Callback para reservar
- `onViewDetails?: (id: string) => void` - Callback para ver detalles
- `className?: string` - Clases CSS adicionales

### SuccessModal

```tsx
<SuccessModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="¡Registro Exitoso!"
  message="Tu plaza ha sido reservada"
/>
```

---

## 🧪 Datos de Prueba

La aplicación incluye 6 conferencias de ejemplo:

1. **Inteligencia Artificial y el Futuro del Desarrollo**
2. **Arquitecturas Cloud-Native para Startups**
3. **Design Systems: De la Teoría a la Práctica**
4. **Ciberseguridad en la Era Digital**
5. **Blockchain y Web3: El Futuro Descentralizado**
6. **Liderazgo Técnico en Equipos Remotos**

Cada una con speaker real, fechas, y datos de capacidad.

---

## 🔮 Roadmap

### Fase 1: MVP ✅ (Completado)

- [x] Landing page y navegación
- [x] Dashboard de conferencias
- [x] Sistema de autenticación mock
- [x] Página de detalles
- [x] Directorio de speakers
- [x] Diseño responsive

### Fase 2: Backend (Próximamente)

- [ ] Integración con Supabase
- [ ] Autenticación real
- [ ] Base de datos PostgreSQL
- [ ] Storage para imágenes
- [ ] Generación de códigos QR

### Fase 3: Features Avanzados

- [ ] Panel de admin
- [ ] Dashboard de conferencista
- [ ] Sistema de pagos
- [ ] Notificaciones email
- [ ] Chat en vivo
- [ ] Análisis y reportes

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Preview del build

# Limpieza
npm run clean        # Limpia node_modules y cache
```

---

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor abre un issue con:

- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots (si aplica)
- Entorno (navegador, OS)

---

## 📄 Licencia

Este proyecto es código abierto y está disponible bajo la licencia MIT.

---

## 👥 Equipo

Desarrollado con ❤️ por el equipo de SpeakerZone

---

## 🙏 Agradecimientos

- [Unsplash](https://unsplash.com) - Imágenes de alta calidad
- [Lucide](https://lucide.dev) - Iconos hermosos
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS increíble
- [React Router](https://reactrouter.com) - Navegación robusta

---

<div align="center">

**[⬆ Volver arriba](#-speakerzone---plataforma-de-gestión-de-conferencias)**

Hecho con 💙 usando React + TypeScript + Tailwind CSS

</div>
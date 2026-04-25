# 📋 Hub académico - Estructura del Proyecto

## 📁 Organización de Carpetas

```
/src
├── /app
│   ├── App.tsx                    # Componente principal con RouterProvider y AuthProvider
│   ├── routes.ts                  # Configuración de rutas (React Router)
│   │
│   ├── /components                # Componentes reutilizables
│   │   ├── ConferenceCard.tsx     # Tarjeta de conferencia (altamente tipada)
│   │   └── SuccessModal.tsx       # Modal de confirmación con feedback visual
│   │
│   ├── /pages                     # Páginas principales
│   │   ├── Landing.tsx            # Landing Page con Hero section
│   │   ├── Dashboard.tsx          # Dashboard de conferencias (Grid layout)
│   │   ├── ConferenceDetail.tsx   # Página de detalles de conferencia individual
│   │   ├── Login.tsx              # Sistema de Login/Registro
│   │   ├── Speakers.tsx           # Directorio de conferencistas
│   │   ├── About.tsx              # Página Acerca de
│   │   └── NotFound.tsx           # Página 404
│   │
│   ├── /context                   # Context API para estado global
│   │   └── AuthContext.tsx        # Autenticación y gestión de usuario
│   │
│   ├── /types                     # Definiciones de TypeScript
│   │   └── conference.types.ts    # Interfaces y tipos estrictos
│   │
│   └── /data                      # Mock data y helpers
│       └── mockConferences.ts     # Datos de ejemplo + funciones helper
│
└── /styles
    ├── theme.css                  # Tema con paleta azul vibrante
    ├── tailwind.css              # Configuración de Tailwind
    └── fonts.css                  # Fuentes personalizadas
```

## 🎨 Paleta de Colores (theme.css)

```css
/* Gradiente Azul Vibrante de Hub académico */
--deep-blue: #1e3a8a;
--bright-blue: #3b82f6;
--blue-gradient-start: #1e40af;
--blue-gradient-end: #60a5fa;
--blue-accent: #2563eb;
--blue-light: #dbeafe;
--blue-hover: #1d4ed8;
```

### Uso en Tailwind:

```tsx
// Gradiente de fondo
className="bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end"

// Color de acento
className="text-blue-accent"

// Fondo claro
className="bg-blue-light"
```

## 🧩 Componente ConferenceCard (Reutilizable)

### Props TypeScript Estrictas:

```typescript
interface ConferenceCardProps {
  conference: Conference;
  onRegister?: (conferenceId: string) => void;
  onViewDetails?: (conferenceId: string) => void;
  className?: string;
}
```

### Características:
- ✅ Completamente tipado con TypeScript
- ✅ Diseño responsive con Tailwind CSS
- ✅ Badges dinámicos según tipo de conferencia
- ✅ Barra de progreso de ocupación
- ✅ Sistema de colores semafórico (verde/amarillo/rojo)
- ✅ Indicador visual de cupo agotado
- ✅ Animaciones hover suaves
- ✅ Información del speaker con avatar
- ✅ Tags de categorías

### Ejemplo de uso:

```tsx
<ConferenceCard
  conference={conference}
  onRegister={(id) => handleRegister(id)}
  onViewDetails={(id) => handleViewDetails(id)}
/>
```

## 📄 Páginas Principales

### 1. Landing Page (`/`)
- Hero section con mensaje: "Conectando Ideas, Inspirando Innovación"
- CTAs claros: "Explorar Conferencias" y "Registrarse Gratis"
- Contador de próxima conferencia con countdown
- Sección de features con iconos de Lucide
- Stats rápidos (500+ conferencias, 50K+ asistentes)
- Footer con branding
- Integración con AuthContext para mostrar estado de sesión

### 2. Dashboard (`/dashboard`)
- Grid responsivo de conferencias (1/2/3 columnas)
- Búsqueda en tiempo real
- Filtros por tipo (Presencial/Virtual/Híbrida)
- Contador de resultados
- Estado vacío cuando no hay resultados
- Header sticky con navegación
- Click en tarjeta navega a detalles

### 3. Conference Detail (`/conference/:id`)
- Imagen hero de la conferencia
- Detalles completos (fecha, hora, ubicación, capacidad)
- Información ampliada del conferencista
- Sección "Qué Aprenderás"
- Sidebar con:
  - Precio/Gratis
  - Barra de ocupación
  - Botón de reserva
  - Beneficios incluidos
- Botones de compartir y favoritos
- Indicador de cupo agotado
- Modal de confirmación al reservar

### 4. Login/Registro (`/login`)
- Formulario minimalista a la izquierda
- Imagen inspiracional a la derecha (solo desktop)
- Toggle entre Login y Registro
- Social login (Google/GitHub)
- Validación de campos
- Mostrar/ocultar contraseña
- Integración con AuthContext
- Notificaciones toast con Sonner
- Redirección automática al dashboard

### 5. Speakers (`/speakers`)
- Grid de tarjetas de conferencistas
- Búsqueda por nombre, rol o expertise
- Información detallada:
  - Avatar y nombre
  - Rol y organización
  - Bio y expertise tags
  - Stats (conferencias, asistentes, rating)
  - Enlaces sociales (LinkedIn, Twitter, Website)
- Diseño con gradientes y efectos hover

### 6. About (`/about`)
- Hero section con mensaje de marca
- Misión y Visión en tarjetas destacadas
- Valores corporativos con iconos
- Estadísticas de impacto
- Historia de la empresa
- CTA final para registro

### 7. NotFound (`/*`)
- Página 404 personalizada
- Botón para volver al inicio
- Diseño consistente con la marca

## 🔐 Sistema de Autenticación

### AuthContext (`/src/app/context/AuthContext.tsx`)

```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

**Características:**
- Context API para estado global de autenticación
- Persistencia en localStorage
- Simulación de login/registro (mock)
- Hook personalizado `useAuth()`
- Listo para integrar con Supabase

**Uso:**
```tsx
const { user, isAuthenticated, login, logout } = useAuth();
```

## 🎯 Funcionalidades Implementadas

### ✅ Gestión de Aforo
```typescript
// Funciones helper en mockConferences.ts
getAvailableSpots(conference): number
hasAvailableSpots(conference): boolean
```

- Control automático de cupo
- Visualización de plazas disponibles
- Indicador visual de ocupación (barra de progreso)
- Bloqueo de registro cuando está lleno

### ✅ Navegación entre Páginas
- React Router v7 con Data Mode
- Rutas dinámicas (`/conference/:id`)
- Navegación programática con `useNavigate()`
- Botones "volver" en todas las páginas internas

### ✅ Feedback Visual
- Modal de éxito con icono de carita feliz
- Animaciones con Motion (Framer Motion)
- Transiciones suaves
- Backdrop con blur
- Notificaciones toast con Sonner

### ✅ Búsqueda y Filtros
- Búsqueda en tiempo real en Dashboard y Speakers
- Filtros por tipo de conferencia
- Contador de resultados
- Estado vacío con opción de limpiar filtros

### ✅ Sistema de Tipos TypeScript

```typescript
// Tipos principales
Conference
Speaker
Attendee
Registration
Statistics
User
ConferenceType: 'presencial' | 'virtual' | 'híbrida'
ConferenceStatus: 'próxima' | 'en-curso' | 'finalizada'
```

## 🛠️ Stack Tecnológico

- ⚛️ **React 18.3.1** - Framework UI
- 📘 **TypeScript** - Tipado estático estricto
- 🎨 **Tailwind CSS v4** - Estilos utility-first
- 🎭 **Motion (Framer Motion)** - Animaciones
- 🧭 **React Router 7** - Navegación con Data Mode
- 🎯 **Lucide React** - Iconografía
- 🎪 **Radix UI** - Componentes accesibles (Dialog, etc.)
- 🔔 **Sonner** - Notificaciones toast
- 🗂️ **Context API** - Gestión de estado global

## 🚀 Características Listas para Producción

### ✅ Completadas
- [x] Landing page con hero section
- [x] Dashboard con grid y filtros
- [x] Página de detalles de conferencia
- [x] Sistema de login/registro
- [x] Directorio de conferencistas
- [x] Página Acerca de
- [x] Página 404
- [x] Sistema de autenticación (mock)
- [x] Gestión de aforo automática
- [x] Modal de confirmación
- [x] Búsqueda en tiempo real
- [x] Navegación completa
- [x] Diseño responsive
- [x] Paleta de colores personalizada
- [x] Animaciones y transiciones
- [x] Notificaciones toast
- [x] Persistencia de sesión (localStorage)

### 🔮 Mejoras Futuras con Supabase

1. **Autenticación Real**
   - Email/Password auth
   - OAuth con Google/GitHub
   - Verificación de email
   - Reset de contraseña

2. **Base de Datos**
   - Almacenar conferencias
   - Gestionar reservas
   - Historial de asistencia
   - Favoritos de usuario

3. **Storage**
   - Imágenes de conferencias
   - Avatars de usuarios
   - Certificados en PDF

4. **Realtime**
   - Actualización de aforo en tiempo real
   - Notificaciones push
   - Chat en vivo

5. **Edge Functions**
   - Generación de códigos QR
   - Envío de emails
   - Procesamiento de pagos

## 📝 Comandos para Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🌐 Deploy

La aplicación está lista para ser desplegada en:
- **Vercel** (recomendado para Next.js/React)
- **Netlify**
- **Cloudflare Pages**
- **AWS Amplify**

Configuración automática con:
- SSR/SSG optimizado
- Compresión de assets
- CDN global
- HTTPS automático

## 📚 Documentación de Código

- Todos los componentes tienen comentarios JSDoc
- Tipos TypeScript en archivos `.types.ts`
- Código autodocumentado con nombres descriptivos
- Estructura modular y escalable
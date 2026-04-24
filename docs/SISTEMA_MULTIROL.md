# Sistema Multi-Rol de SpeakerZone

## 📋 Descripción General

SpeakerZone ahora cuenta con un sistema completo de gestión multi-rol con tres tipos de usuarios principales, cada uno con su propio dashboard, navegación y conjunto de funcionalidades adaptadas a sus necesidades.

## 👥 Tipos de Usuarios

### 1. **Administrador** (`admin`)
El usuario encargado de gestionar la plataforma y administrar los eventos.

**Funcionalidades:**
- ✅ Crear y administrar eventos principales
- ✅ Gestionar conferencias (CRUD completo)
- ✅ Registrar y administrar conferencistas
- ✅ Administrar asistentes registrados
- ✅ Validar asistencia mediante escaneo de códigos QR
- ✅ Ver panel de estadísticas avanzadas con gráficas
- ✅ Exportar listas de asistentes en CSV

**Vistas disponibles:**
- `/admin/dashboard` - Panel principal con resumen de actividades
- `/admin/events` - Gestión de eventos (CRUD)
- `/admin/conferences` - Gestión de conferencias (CRUD)
- `/admin/speakers` - Gestión de conferencistas (CRUD)
- `/admin/attendees` - Administración de asistentes con filtros
- `/admin/scanner` - Escáner de QR para validar asistencia
- `/admin/stats` - Panel de estadísticas con gráficas interactivas

### 2. **Conferencista** (`speaker`)
Usuario que imparte conferencias en la plataforma.

**Funcionalidades:**
- ✅ Gestionar sus conferencias asignadas
- ✅ Ver lista de asistentes a sus conferencias
- ✅ Descargar listados de asistentes
- ✅ Generar certificados para asistentes
- ✅ Administrar su perfil profesional

**Vistas disponibles:**
- `/speaker/dashboard` - Panel principal del conferencista
- `/speaker/conferences` - Gestión de sus conferencias
- `/speaker/attendees` - Lista de asistentes
- `/speaker/certificates` - Generación de certificados
- `/speaker/profile` - Perfil profesional

### 3. **Asistente** (`attendee`)
Usuario que participa en los eventos y conferencias.

**Funcionalidades:**
- ✅ Ver y explorar eventos disponibles
- ✅ Registrarse en eventos y conferencias
- ✅ Obtener código QR personal para validación
- ✅ Descargar código QR
- ✅ Ver historial de eventos asistidos
- ✅ Descargar certificados de asistencia
- ✅ Administrar perfil personal

**Vistas disponibles:**
- `/attendee/dashboard` - Panel principal con resumen personalizado
- `/attendee/events` - Explorar eventos disponibles
- `/attendee/qr` - Código QR personal para check-in
- `/attendee/certificates` - Descarga de certificados
- `/attendee/history` - Historial de eventos asistidos
- `/attendee/profile` - Perfil personal

## 🔐 Sistema de Autenticación

### Inicio de Sesión de Prueba

Para probar cada rol, usa los siguientes emails en la página `/login`:

```
Administrador:
- Email: admin@speakerzone.com
- Password: cualquier contraseña

Conferencista:
- Email: speaker@speakerzone.com  
- Password: cualquier contraseña

Asistente:
- Email: usuario@email.com
- Password: cualquier contraseña
```

El sistema detecta automáticamente el rol basándose en el email:
- Si contiene "admin" → Usuario Administrador
- Si contiene "speaker" → Usuario Conferencista
- Cualquier otro → Usuario Asistente

## 🎨 Características Implementadas

### Panel de Administrador
- **Dashboard**: Vista general con KPIs, actividad reciente y accesos rápidos
- **Gestión de Eventos**: CRUD completo con formularios modales
- **Gestión de Conferencias**: Tabla interactiva con filtros y búsqueda
- **Gestión de Conferencistas**: Tarjetas con información detallada
- **Gestión de Asistentes**: Tabla con filtros múltiples y exportación CSV
- **Escáner QR**: Validación en tiempo real con historial de escaneos
- **Estadísticas**: Gráficas interactivas (líneas, barras, pie charts) con Recharts

### Panel de Asistente
- **Dashboard Personalizado**: Acciones rápidas y próximos eventos
- **Explorador de Eventos**: Búsqueda y filtros avanzados
- **Código QR Personal**: Generado con `qrcode.react` con opción de descarga
- **Gestión de Certificados**: Vista de certificados con búsqueda y descarga
- **Historial Completo**: Filtros por año y búsqueda de eventos pasados
- **Perfil Editable**: Información personal con modo de edición

## 📊 Datos Mock

El sistema incluye datos de prueba realistas en:
- `src/app/data/mockData.ts` - Eventos, asistentes, certificados, agenda
- `src/app/data/mockConferences.ts` - Conferencias disponibles

## 🛠️ Tecnologías Utilizadas

- **React Router** (Data Mode) - Navegación entre vistas
- **Tailwind CSS v4** - Estilos
- **Lucide React** - Iconografía
- **Recharts** - Gráficas y estadísticas
- **qrcode.react** - Generación de códigos QR
- **Sonner** - Notificaciones toast
- **Radix UI** - Componentes de interfaz (Dialog, Select, etc.)

## 🎯 Flujo de Usuario

### Para Asistentes:
1. Registro → `/login`
2. Explorar eventos → `/attendee/events`
3. Ver código QR → `/attendee/qr`
4. Asistir a evento (check-in con QR)
5. Ver historial → `/attendee/history`
6. Descargar certificados → `/attendee/certificates`

### Para Administradores:
1. Login → `/login` (con email que contenga "admin")
2. Dashboard → `/admin/dashboard`
3. Crear evento → `/admin/events`
4. Crear conferencias → `/admin/conferences`
5. Registrar conferencistas → `/admin/speakers`
6. Validar asistencia → `/admin/scanner`
7. Ver estadísticas → `/admin/stats`

## 📱 Responsive Design

Todas las vistas están optimizadas para:
- 📱 Móviles (< 768px)
- 💻 Tablets (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🚀 Próximos Pasos (Integración con Supabase)

Cuando estés listo para conectar con base de datos real:

1. **Autenticación Real**: Supabase Auth
2. **Base de Datos**: PostgreSQL en Supabase
3. **Storage**: Almacenamiento de certificados PDF
4. **Real-time**: Actualizaciones en tiempo real de check-ins
5. **Row Level Security**: Permisos por rol

## 📝 Notas de Desarrollo

- El estado actual es 100% frontend con datos mock
- No hay persistencia de datos (localStorage solo para usuario)
- Las funciones CRUD simulan operaciones pero no persisten
- La exportación CSV funciona solo con datos en memoria
- Los certificados son simulados (no se generan PDFs reales)

## 🎨 Paleta de Colores

```css
- Deep Blue (inicio): #2563EB
- Bright Blue (fin): #3B82F6  
- Fondos limpios: #FFFFFF, #F9FAFB
- Acentos: Verde (#10B981), Púrpura (#8B5CF6), Naranja (#F59E0B)
```

## 📦 Estructura de Archivos

```
src/app/
├── pages/
│   ├── admin/          # 7 páginas de administrador
│   ├── speaker/        # 5 páginas de conferencista
│   ├── attendee/       # 6 páginas de asistente
│   └── ...            # Páginas públicas
├── components/
│   ├── AppHeader.tsx   # Header adaptable por rol
│   └── ui/            # Componentes reutilizables
├── context/
│   └── AuthContext.tsx # Gestión de autenticación
├── data/
│   ├── mockData.ts     # Datos extendidos
│   └── mockConferences.ts
└── routes.ts          # Configuración de rutas
```

---

**Versión**: 1.0.0  
**Última actualización**: Marzo 2026  
**Estado**: MVP Frontend Completo ✅

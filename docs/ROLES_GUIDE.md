# 🎭 Guía de Roles - Hub académico

Esta guía te ayudará a probar las diferentes vistas y funcionalidades según el rol de usuario en Hub académico.

## 🚀 Cómo Probar los Diferentes Roles

### 1. 📝 **Asistente** (Attendee)
**Email de prueba:** `asistente@speakerzone.com`
**Password:** 123456

#### Acceso a:
- ✅ Landing page (`/`)
- ✅ Dashboard de conferencias (`/dashboard`)
- ✅ Detalles de conferencias individuales (`/conference/:id`)
- ✅ Directorio de conferencistas (`/speakers`)
- ✅ Página Acerca de (`/about`)
- ✅ Reserva de plazas

#### Navegación:
```
Conferencias → Mis Reservas → Conferencistas → Acerca de
```

---

### 2. 🎤 **Conferencista** (Speaker)
**Email de prueba:** `speaker@speakerzone.com`
**Password:** 123456

#### Acceso a:
- ✅ Panel del conferencista (`/speaker/dashboard`)
- ✅ Mis conferencias asignadas (`/speaker/conferences`)
- ✅ Lista de asistentes (`/speaker/attendees`)
- ✅ Descarga de certificados (`/speaker/certificates`)
- ✅ Perfil del conferencista (`/speaker/profile`)

#### Funcionalidades:
1. **Dashboard** - Vista general con estadísticas:
   - Total de conferencias
   - Total de asistentes
   - Próximas conferencias
   - Certificados emitidos
   
2. **Mis Conferencias** - Gestión de conferencias:
   - Búsqueda y filtros
   - Detalles completos
   - Acceso a lista de asistentes

3. **Asistentes** - Gestión de participantes:
   - Lista completa de asistentes
   - Estado de check-in
   - Exportar CSV
   - Filtros por conferencia y estado

4. **Certificados** - Gestión de certificados:
   - Descarga de certificados disponibles
   - Vista de certificados pendientes
   - Estadísticas

5. **Perfil** - Editar información:
   - Datos personales
   - Biografía
   - Redes sociales
   - Estadísticas del speaker

#### Navegación:
```
Mi Panel → Mis Conferencias → Asistentes → Certificados → Mi Perfil
```

---

### 3. 👨‍💼 **Administrador** (Admin)
**Email de prueba:** `admin@speakerzone.com`
**Password:** 123456

#### Acceso a:
- ✅ Panel de administración (`/admin/dashboard`)
- ✅ Gestión de eventos (`/admin/events`)
- ✅ Gestión de conferencias (`/admin/conferences`)
- ✅ Gestión de conferencistas (`/admin/speakers`)
- ✅ Gestión de asistentes (`/admin/attendees`)
- ✅ Escáner de códigos QR (`/admin/scanner`)
- ✅ Panel de estadísticas (`/admin/stats`)

#### Funcionalidades:
1. **Dashboard** - Vista general administrativa:
   - Estadísticas globales
   - Actividad reciente
   - Próximas conferencias
   - Acciones rápidas

2. **Gestión de Eventos** (próximamente):
   - Crear eventos
   - Editar eventos
   - Eliminar eventos
   - Configuración de eventos

3. **Gestión de Conferencias** (próximamente):
   - CRUD completo de conferencias
   - Asignación de speakers
   - Control de aforo
   - Publicar/despublicar

4. **Gestión de Conferencistas** (próximamente):
   - Registro de nuevos speakers
   - Edición de perfiles
   - Asignación de conferencias
   - Métricas por speaker

5. **Gestión de Asistentes** (próximamente):
   - Lista de todos los asistentes
   - Validación de registros
   - Exportar datos
   - Estadísticas de asistencia

6. **Escáner QR** (próximamente):
   - Validar entrada con cámara
   - Check-in manual
   - Historial de validaciones
   - Estadísticas en tiempo real

7. **Estadísticas** (próximamente):
   - Dashboard de métricas
   - Gráficos de tendencias
   - Reportes personalizados
   - Exportar datos

#### Navegación:
```
Dashboard → Eventos → Conferencias → Conferencistas → Asistentes → Escáner QR → Estadísticas
```

---

## 🎯 Características por Rol

| Característica | Asistente | Speaker | Admin |
|---|:---:|:---:|:---:|
| Ver conferencias | ✅ | ✅ | ✅ |
| Reservar plazas | ✅ | ❌ | ✅ |
| Ver asistentes | ❌ | ✅ | ✅ |
| Descargar certificados | ✅ | ✅ | ✅ |
| Gestionar conferencias | ❌ | ⚠️ Solo las asignadas | ✅ |
| Crear eventos | ❌ | ❌ | ✅ |
| Validar QR | ❌ | ❌ | ✅ |
| Ver estadísticas | ❌ | ⚠️ Solo propias | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ |

---

## 🧪 Instrucciones de Prueba

### Paso 1: Ir a la página de login
```
http://localhost:5173/login
```

### Paso 2: Seleccionar el rol
En la página de login, verás 3 botones para seleccionar rol:
- **Asistente** (azul) - Usuario estándar
- **Speaker** (morado) - Conferencista
- **Admin** (naranja) - Administrador

### Paso 3: Ingresar credenciales
- **Email:** Usa el formato según el rol deseado
  - `asistente@speakerzone.com` → Asistente
  - `speaker@speakerzone.com` → Speaker
  - `admin@speakerzone.com` → Admin
- **Password:** 123456

### Paso 4: Explorar el panel
Después del login, serás redirigido automáticamente al panel correspondiente:
- Asistente → `/dashboard`
- Speaker → `/speaker/dashboard`
- Admin → `/admin/dashboard`

---

## 🎨 Diferencias Visuales

### Header de Navegación
El header se adapta automáticamente según el rol:

**Asistente:**
```
Conferencias | Mis Reservas | Conferencistas | Acerca de
```

**Speaker:**
```
Mi Panel | Mis Conferencias | Asistentes | Certificados | Mi Perfil
```

**Admin:**
```
Dashboard | Eventos | Conferencias | Conferencistas | Asistentes | Escáner QR | Estadísticas
```

### Menú de Usuario
Al hacer clic en el avatar (esquina superior derecha):
- Ver perfil
- Configuración
- Cerrar sesión

---

## 🔧 Funcionalidades Implementadas

### ✅ Completadas

#### Panel del Speaker:
- [x] Dashboard con estadísticas
- [x] Lista de conferencias asignadas
- [x] Gestión de asistentes con exportación CSV
- [x] Sistema de certificados (disponibles/pendientes)
- [x] Perfil editable del speaker

#### Panel del Admin:
- [x] Dashboard administrativo
- [x] Vista general de estadísticas
- [x] Actividad reciente
- [x] Accesos rápidos a todas las secciones

#### Sistema General:
- [x] Header universal adaptable por rol
- [x] Autenticación multi-rol
- [x] Navegación protegida por rol
- [x] Redirección automática según rol

### 🚧 En Desarrollo (Próximamente)

#### Panel del Admin:
- [ ] CRUD completo de eventos
- [ ] CRUD completo de conferencias
- [ ] Gestión de speakers
- [ ] Gestión de asistentes
- [ ] Escáner de códigos QR con cámara
- [ ] Dashboard de estadísticas con gráficos
- [ ] Generación de certificados PDF
- [ ] Sistema de notificaciones

---

## 📱 Responsive

Todas las vistas están optimizadas para:
- 📱 **Mobile** (< 768px)
- 📱 **Tablet** (768px - 1024px)
- 💻 **Desktop** (> 1024px)

En mobile, el header muestra una barra de navegación scrollable horizontal.

---

## 🎓 Tips de Uso

1. **Cambiar de Rol:**
   - Cierra sesión desde el menú de usuario
   - Vuelve a `/login`
   - Selecciona otro rol

2. **Navegación Rápida:**
   - Usa el header para moverte entre secciones
   - Cada sección tiene breadcrumbs si es necesario

3. **Demo vs Producción:**
   - Los datos actuales son mock (simulados)
   - En producción se conectarían a Supabase
   - Las funcionalidades están listas para integración

4. **Acceso Directo:**
   - Puedes ir directamente a cualquier URL
   - Si no estás autenticado, serás redirigido al login
   - El sistema recuerda tu sesión en localStorage

---

## 🚀 Próximos Pasos

Para completar la plataforma, se implementarán:

1. **Backend con Supabase:**
   - Autenticación real
   - Base de datos PostgreSQL
   - Storage para imágenes
   - Funciones serverless

2. **Generador de QR:**
   - Códigos únicos por registro
   - Descarga de QR en PDF
   - Envío automático por email

3. **Escáner en Tiempo Real:**
   - Usar cámara del dispositivo
   - Validación instantánea
   - Historial de check-ins

4. **Analytics Avanzado:**
   - Gráficos con Recharts
   - Métricas en tiempo real
   - Exportación de reportes

---

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:
- Revisa que estés usando el email correcto según el rol
- Verifica que estés en la ruta correcta
- Limpia el localStorage si ves comportamientos extraños

---

<div align="center">

**¡Disfruta explorando Hub académico!** 🎉

</div>

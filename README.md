# Plataforma de Eventos e Inscripciones

API REST para la gestión de eventos e inscripciones/tickets, desarrollada como proyecto final del curso Backend II de Coderhouse. Permite administrar usuarios, eventos y (próximamente) inscripciones/tickets, con autenticación por JWT y roles diferenciados (admin, organizador y usuario).

Este repositorio refleja el estado del proyecto hasta Pre-entrega 6: arquitectura en capas (router → controller → service → repository → DAO → modelo), autenticación con Passport + JWT en cookie httpOnly, autorización por rol y por propiedad del recurso, y la entidad Event con su CRUD y reglas de negocio completas. La entidad Ticket (módulo de inscripciones) está planificada para la Pre-entrega 7.

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Passport (`passport-local`, `passport-jwt`)
- jsonwebtoken (JWT)
- bcrypt (hash de contraseñas)
- cookie-parser
- dotenv
- Nodemon (entorno de desarrollo)

## Instalación

```bash
git clone <url-del-repositorio>
cd PlataformaDeEventos
npm install
```

## Configuración de variables de entorno

Copiar el archivo `.env.example` como `.env` y completar los valores:

```bash
cp .env.example .env
```

Variables necesarias:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto en el que corre el servidor |
| `NODE_ENV` | Entorno de ejecución (`development` / `production`) |
| `MONGO_URL` | Cadena de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token (ej: `1h`) |
| `DNS_SERVERS` | DNS alternativos para resolver el SRV de Atlas (ej: en redes/Windows con problemas de DNS) |

## Cómo ejecutar

Modo desarrollo (con reinicio automático):

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

El servidor levanta por defecto en el puerto indicado en `PORT`, o en `8080` si no está definido.

## Estructura de carpetas

```
PlataformaDeEventos/
├── src/
│   ├── app.js              # Configura Express (middlewares y rutas), no levanta el servidor
│   ├── server.js           # Levanta el servidor y conecta la base de datos
│   ├── config/              # Configuración (conexión a MongoDB, estrategias de Passport)
│   ├── routes/              # Definición de endpoints y middlewares aplicados
│   ├── controllers/         # Reciben la petición HTTP y dan forma a la respuesta
│   ├── services/            # Lógica de negocio y validaciones (fecha, capacidad, precio, estados)
│   ├── repositories/        # Capa intermedia entre services y DAO
│   ├── dao/                 # Acceso directo a los modelos de Mongoose
│   ├── models/              # Schemas de Mongoose (User, Event, Category, Ticket)
│   ├── middlewares/          # Autenticación (JWT), autorización (roles, propiedad del evento)
│   └── utils/                 # Funciones reutilizables (hash de contraseñas, firma de JWT)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Modelo de roles y matriz de permisos

El campo `role` del modelo `User` acepta tres valores: `user` (default), `organizer` y `admin`. Un usuario nunca puede autoasignarse un rol distinto de `user` desde el registro público — solo un `admin` puede crear usuarios con otro rol, a través de `POST /api/users`.

| Acción | user | organizer | admin |
|---|---|---|---|
| Registrarse / iniciar sesión / ver mi perfil (`/current`) / cerrar sesión | ✅ | ✅ | ✅ |
| Ver listado de eventos y ver un evento puntual | ✅ (público, no requiere login) | ✅ | ✅ |
| Crear un evento | ❌ | ✅ | ✅ |
| Editar un evento | ❌ | ✅ solo si es el organizador del evento | ✅ cualquier evento |
| Cambiar el estado de un evento (`/status`) | ❌ | ✅ solo si es el organizador del evento | ✅ cualquier evento |
| Listar o crear usuarios (`/api/users`) | ❌ | ❌ | ✅ |
| Ver / crear inscripciones (`/api/tickets`) | ✅ (requiere login; lógica de negocio pendiente — Pre-entrega 7) | ✅ (idem) | ✅ (idem) |

## Autenticación y autorización

La autenticación usa Passport con JWT: al hacer login, el servidor firma un token con los datos mínimos del usuario (`id`, `email`, `role`) y lo guarda en una cookie `httpOnly` llamada `currentUser`. Las rutas protegidas leen ese token de la cookie (no del header `Authorization`) a través de la estrategia `current` de Passport.

Se distinguen dos tipos de error según el motivo del rechazo:

- **401 No autenticado**: no hay cookie, el token es inválido o expiró. Lo aplica `authMiddleware`.
- **403 Sin permisos**: el usuario está autenticado pero su rol no alcanza (`authorizeRoles`) o no es el dueño del recurso que intenta modificar (`authorizeEventOwner`).

Las rutas de eventos que modifican datos (`PUT /:id`, `PATCH /:id/status`) encadenan tres verificaciones en orden: `authMiddleware` (¿está logueado?) → `authorizeRoles('organizer', 'admin')` (¿su rol puede hacer esto en general?) → `authorizeEventOwner` (¿es el dueño de este evento en particular, o es admin?).

## Rutas disponibles

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/health` | Público | Verifica que el servidor esté activo |
| POST | `/api/sessions/register` | Público | Registra un usuario nuevo (rol `user` fijo) |
| POST | `/api/sessions/login` | Público | Inicia sesión y devuelve el JWT en una cookie |
| GET | `/api/sessions/current` | Autenticado | Devuelve los datos del usuario logueado |
| POST | `/api/sessions/logout` | Público | Limpia la cookie de sesión |
| GET | `/api/users` | Admin | Lista todos los usuarios |
| POST | `/api/users` | Admin | Crea un usuario, con el rol que indique el admin |
| GET | `/api/events` | Público | Lista eventos con filtros (`category`, `status`, `location`, `dateFrom`, `dateTo`, `search`) y paginación (`page`, `limit`, `sort`) |
| GET | `/api/events/:id` | Público | Devuelve un evento puntual |
| POST | `/api/events` | Organizer / Admin | Crea un evento |
| PUT | `/api/events/:id` | Organizer (dueño) / Admin | Edita un evento (no permite cambiar `status` ni modificar un evento `cancelled`/`finished`) |
| PATCH | `/api/events/:id/status` | Organizer (dueño) / Admin | Cambia el estado de un evento (no permite tocar uno ya `cancelled`/`finished`) |
| GET | `/api/tickets` | Autenticado | Placeholder — lógica real pendiente (Pre-entrega 7) |
| POST | `/api/tickets` | Autenticado | Placeholder — lógica real pendiente (Pre-entrega 7) |

## Cómo probar los distintos accesos (Postman / Thunder Client)

1. **Registrar un usuario común**: `POST /api/sessions/register` con `first_name`, `last_name`, `email`, `password`. Queda con rol `user`.
2. **Crear el primer admin**: como nadie puede autoasignarse `admin` y `POST /api/users` ya requiere ser admin, el primer admin se crea a mano en MongoDB Atlas, cambiando el campo `role` de un usuario registrado a `"admin"`.
3. **Loguear cada usuario**: `POST /api/sessions/login` con `email`/`password`. La cookie `currentUser` queda guardada en el cliente (Postman la maneja solo si tenés las cookies habilitadas para ese dominio).
4. **Probar sin cookie**: llamar a cualquier ruta protegida (por ejemplo `GET /api/users`) sin loguearse → debe devolver `401`.
5. **Probar con rol insuficiente**: logueado como `user`, intentar `POST /api/events` → debe devolver `403`.
6. **Crear un organizador**: con el usuario admin logueado, `POST /api/users` con `role: "organizer"`.
7. **Probar propiedad del evento**: con el organizador logueado, crear un evento (`POST /api/events`) y luego intentar editarlo con otro organizador logueado → debe devolver `403`. El mismo organizador que lo creó, o un admin, sí puede editarlo.
8. **Probar reglas de negocio**: intentar crear/editar un evento con `capacity` o `price` negativos, o con `date` en el pasado → debe devolver `400` con el mensaje correspondiente. Cambiar el estado de un evento a `cancelled` y después intentar editarlo o volver a cambiarle el estado → debe devolver `400`.

## Estado del proyecto

Completado: arquitectura en capas, autenticación JWT + Passport, roles y permisos, CRUD de eventos con reglas de negocio (fechas, capacidad, precio, estados), protección de rutas sensibles.

Pendiente: lógica real de inscripciones/tickets (Módulo 7), DTOs y repository pattern más formal (Módulo 8), entrega final capstone (Módulo 9).

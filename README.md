# Plataforma de Eventos e Inscripciones

API REST para la gestión de eventos e inscripciones/tickets, desarrollada como proyecto final del curso Backend II de Coderhouse. Permite administrar usuarios, eventos e inscripciones/tickets, con autenticación por JWT y roles diferenciados (admin, organizador y usuario).

Este repositorio refleja el estado del proyecto hasta Pre-entrega 7: arquitectura en capas (router → controller → service → repository → DAO → modelo), autenticación con Passport + JWT en cookie httpOnly, autorización por rol y por propiedad del recurso, la entidad Event con su CRUD y reglas de negocio completas, y la entidad Ticket con el flujo completo de inscripción y cancelación, incluyendo envío de email de confirmación.

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Passport (`passport-local`, `passport-jwt`)
- jsonwebtoken (JWT)
- bcrypt (hash de contraseñas)
- cookie-parser
- Nodemailer (envío de emails de confirmación)
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
| `MAIL_HOST` | Host del servidor SMTP usado para enviar los emails de confirmación |
| `MAIL_PORT` | Puerto del servidor SMTP |
| `MAIL_USER` | Usuario/cuenta de autenticación SMTP |
| `MAIL_PASS` | Contraseña o clave de aplicación de la cuenta de email |
| `MAIL_FROM` | Dirección que aparece como remitente en los emails enviados |

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
│   ├── config/              # Configuración (conexión a MongoDB, estrategias de Passport, transporte de mail)
│   ├── routes/              # Definición de endpoints y middlewares aplicados
│   ├── controllers/         # Reciben la petición HTTP y dan forma a la respuesta
│   ├── services/            # Lógica de negocio y validaciones (fecha, capacidad, precio, estados, cupo, duplicados)
│   ├── repositories/        # Capa intermedia entre services y DAO
│   ├── dao/                 # Acceso directo a los modelos de Mongoose
│   ├── models/              # Schemas de Mongoose (User, Event, Category, Ticket)
│   ├── middlewares/          # Autenticación (JWT), autorización (roles, propiedad del evento)
│   └── utils/                 # Funciones reutilizables (hash de contraseñas, firma de JWT, generación de código de reserva)
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
| Inscribirse a un evento / ver mis inscripciones | ✅ | ✅ | ✅ |
| Cancelar una inscripción propia | ✅ | ✅ | ✅ |
| Cancelar una inscripción ajena | ❌ | ❌ | ✅ |
| Ver los inscriptos de un evento | ❌ | ✅ solo si es el organizador del evento | ✅ cualquier evento |

## Autenticación y autorización

La autenticación usa Passport con JWT: al hacer login, el servidor firma un token con los datos mínimos del usuario (`id`, `email`, `role`) y lo guarda en una cookie `httpOnly` llamada `currentUser`. Las rutas protegidas leen ese token de la cookie (no del header `Authorization`) a través de la estrategia `current` de Passport.

Se distinguen dos tipos de error según el motivo del rechazo:

- **401 No autenticado**: no hay cookie, el token es inválido o expiró. Lo aplica `authMiddleware`.
- **403 Sin permisos**: el usuario está autenticado pero su rol no alcanza (`authorizeRoles`) o no es el dueño del recurso que intenta modificar (`authorizeEventOwner`), o no es el dueño de la inscripción que intenta cancelar (validado dentro de `cancelTicketService`).

Las rutas de eventos que modifican datos (`PUT /:id`, `PATCH /:id/status`) encadenan tres verificaciones en orden: `authMiddleware` (¿está logueado?) → `authorizeRoles('organizer', 'admin')` (¿su rol puede hacer esto en general?) → `authorizeEventOwner()` (¿es el dueño de este evento en particular, o es admin?).

El middleware `authorizeEventOwner` es una fábrica que acepta el nombre del parámetro de ruta a usar (por defecto `'id'`). En `GET /api/events/:eid/tickets` se invoca como `authorizeEventOwner('eid')`, para leer el id del evento desde ese parámetro.

## Inscripciones (Tickets)

Un usuario autenticado, sin importar su rol, puede inscribirse a un evento publicado. Cada inscripción genera un `Ticket` con un código de reserva único (`reservationCode`) y dispara un email de confirmación (no bloqueante: si el envío falla, la inscripción igual se concreta).

**Estados de un ticket**: `confirmed` (default al crearse), `cancelled` (tras cancelación).

**Reglas de negocio al crear una inscripción** (`POST /api/events/:eid/tickets`), validadas en este orden:

1. El evento debe existir → si no, `404`.
2. El evento debe estar `published` → si no, `400`.
3. La fecha del evento no puede haber pasado → si no, `400`.
4. La cantidad (`quantity`) debe ser un número válido mayor a 0 → si no, `400`.
5. El usuario no puede tener ya una inscripción activa (no cancelada) para ese mismo evento → si no, `409`.
6. Debe haber cupo suficiente: `capacity` del evento menos la suma de `quantity` de todas las inscripciones activas, comparado contra lo pedido → si no alcanza, `400`.

**Reglas de negocio al cancelar una inscripción** (`PATCH /api/tickets/:tid/cancel`):

1. El ticket debe existir → si no, `404`.
2. Solo puede cancelarlo el dueño de la inscripción o un admin → si no, `403`.
3. No puede estar ya cancelado → si no, `400`.
4. El evento asociado no puede estar `finished` → si no, `400`.

Al cancelar, el cupo que ocupaba esa inscripción queda liberado automáticamente para otras personas, porque el cálculo de cupo disponible solo cuenta inscripciones activas (`status !== 'cancelled'`).

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
| POST | `/api/events/:eid/tickets` | Autenticado | Inscribe al usuario logueado al evento `:eid` |
| GET | `/api/events/:eid/tickets` | Organizer (dueño del evento) / Admin | Lista las inscripciones del evento `:eid` |
| GET | `/api/tickets/my-tickets` | Autenticado | Lista las inscripciones del usuario logueado |
| PATCH | `/api/tickets/:tid/cancel` | Dueño de la inscripción / Admin | Cancela la inscripción `:tid` |

## Cómo probar los distintos accesos (Postman / Thunder Client)

1. **Registrar un usuario común**: `POST /api/sessions/register` con `first_name`, `last_name`, `email`, `password`. Queda con rol `user`.
2. **Crear el primer admin**: como nadie puede autoasignarse `admin` y `POST /api/users` ya requiere ser admin, el primer admin se crea a mano en MongoDB Atlas, cambiando el campo `role` de un usuario registrado a `"admin"`.
3. **Loguear cada usuario**: `POST /api/sessions/login` con `email`/`password`. La cookie `currentUser` queda guardada en el cliente (Postman la maneja solo si tenés las cookies habilitadas para ese dominio).
4. **Probar sin cookie**: llamar a cualquier ruta protegida (por ejemplo `GET /api/users`) sin loguearse → debe devolver `401`.
5. **Probar con rol insuficiente**: logueado como `user`, intentar `POST /api/events` → debe devolver `403`.
6. **Crear un organizador**: con el usuario admin logueado, `POST /api/users` con `role: "organizer"`.
7. **Probar propiedad del evento**: con el organizador logueado, crear un evento (`POST /api/events`) y luego intentar editarlo con otro organizador logueado → debe devolver `403`. El mismo organizador que lo creó, o un admin, sí puede editarlo.
8. **Probar reglas de negocio de eventos**: intentar crear/editar un evento con `capacity` o `price` negativos, o con `date` en el pasado → debe devolver `400` con el mensaje correspondiente. Cambiar el estado de un evento a `cancelled` y después intentar editarlo o volver a cambiarle el estado → debe devolver `400`.
9. **Probar una inscripción exitosa**: publicar un evento (`status: published`) y hacer `POST /api/events/:eid/tickets` con un usuario logueado → `201`, se crea el ticket y se envía el email de confirmación.
10. **Probar inscripción duplicada**: repetir el `POST` anterior con el mismo usuario y el mismo evento, sin cancelar el primer ticket → debe devolver `409`.
11. **Probar cupo agotado**: usar un evento con `capacity` chica, inscribir usuarios hasta completarla, y probar que el siguiente intento devuelva `400`.
12. **Probar cancelación propia**: `PATCH /api/tickets/:tid/cancel` con el dueño del ticket → `200`, el ticket pasa a `cancelled` y el cupo se libera (se puede volver a inscribir alguien).
13. **Probar cancelación ajena**: intentar cancelar el ticket de otro usuario sin ser admin → debe devolver `403`.
14. **Probar visualización de inscriptos**: `GET /api/events/:eid/tickets` con el organizador dueño del evento o un admin → `200`; con un usuario normal, o con un organizador de otro evento → `403`.

## Estado del proyecto

Completado: arquitectura en capas, autenticación JWT + Passport, roles y permisos, CRUD de eventos con reglas de negocio (fechas, capacidad, precio, estados), protección de rutas sensibles, módulo completo de inscripciones/tickets (creación, cancelación, control de cupo, envío de email de confirmación).

Pendiente: DTOs y repository pattern más formal (Módulo 8), entrega final capstone (Módulo 9).

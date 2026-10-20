# Plataforma de Eventos e Inscripciones

API REST para la gestión de eventos e inscripciones/tickets, desarrollada como proyecto final del curso Backend II de Coderhouse. Permite administrar usuarios, eventos, categorías e inscripciones, con roles diferenciados (admin, organizador y usuario).

Este repositorio corresponde a la Pre-entrega 5: roles y autorización. Se incorpora el middleware `authorizeRoles`, que restringe rutas según el rol del usuario autenticado, y se implementa la gestión de usuarios (listar y crear) restringida exclusivamente al rol `admin`, construida sobre la base de las entregas anteriores.

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- dotenv
- bcrypt
- jsonwebtoken
- Passport.js (passport, passport-local, passport-jwt)
- cookie-parser
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
| `JWT_SECRET` | Clave secreta para firmar y verificar los tokens JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token (ej. `1h`) |

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
│   ├── app.js                # Configura Express (middlewares y rutas)
│   ├── server.js             # Levanta el servidor y conecta la base de datos
│   ├── config/                # Configuración (conexión a MongoDB)
│   ├── routes/                # Definición de endpoints
│   ├── controllers/           # Reciben la petición y arman la respuesta HTTP
│   ├── services/              # Lógica de negocio (validaciones, reglas, orquestación)
│   ├── repositories/          # Abstracción de acceso a datos, independiente de Mongoose
│   ├── dao/                   # Acceso directo a la base de datos (Mongoose)
│   ├── models/                 # Schemas de Mongoose (User, Event, ...)
│   ├── middlewares/            # Middlewares (auth.middleware.js: protección de rutas con JWT)
│   └── utils/                   # Funciones reutilizables (hash.js: bcrypt, jwt.js: firma/verificación de JWT)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

El flujo de sesión (registro, login, current, logout) sigue la arquitectura completa: `sessions.router.js` → `sessions.controller.js` → `sessions.service.js` → `users.repository.js` → `users.dao.js` → modelo `User`, con `utils/jwt.js` y `utils/hash.js` como utilidades compartidas y `middlewares/auth.middleware.js` protegiendo la ruta `/current`. El resto de los recursos (eventos, tickets) todavía son placeholders a desarrollar en próximas entregas.

## Rutas disponibles

| Método | Ruta | Descripción | Protegida |
|---|---|---|---|
| GET | `/api/health` | Verifica que el servidor esté activo | No |
| POST | `/api/sessions/register` | Registra un nuevo usuario | No |
| POST | `/api/sessions/login` | Inicia sesión y setea la cookie de autenticación | No |
| GET | `/api/sessions/current` | Devuelve los datos del usuario autenticado | Sí |
| POST | `/api/sessions/logout` | Cierra la sesión (elimina la cookie) | Sí |
| GET | `/api/events` | Lista de eventos (por ahora devuelve un arreglo vacío) | No |
| POST | `/api/events` | Crea un evento (placeholder, sin lógica de base de datos aún) | No |
| GET | `/api/users` | Lista todos los usuarios | Sí (admin) |
| POST | `/api/users` | Crea un usuario con un rol específico | Sí (admin) |
| GET | `/api/tickets` | Placeholder de tickets | No |
| POST | `/api/tickets` | Placeholder de tickets | No |

## Registro de usuarios — `POST /api/sessions/register`

Crea un usuario nuevo. Valida los datos recibidos, normaliza el email, evita duplicados y guarda la contraseña hasheada con bcrypt — nunca en texto plano.

**Campos esperados (body JSON):**

| Campo | Tipo | Obligatorio | Validación |
|---|---|---|---|
| `first_name` | string | Sí | No vacío |
| `last_name` | string | Sí | No vacío |
| `email` | string | Sí | Formato de email válido |
| `password` | string | Sí | Mínimo 8 caracteres |

El `role` no se recibe del cliente: siempre se asigna `user` en el servidor, sin importar qué envíe el body.

**Request de ejemplo:**

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com",
  "password": "Secreta123"
}
```

**Respuesta exitosa (`201`)** — el email queda normalizado (minúsculas, sin espacios) y la contraseña nunca se devuelve:

```json
{
  "status": "success",
  "message": "Usuario registrado",
  "payload": {
    "id": "665f2a...",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

**Respuestas de error:**

| Código | Causa | Mensaje |
|---|---|---|
| `400` | Falta algún campo obligatorio | `Todos los campos son obligatorios` |
| `400` | Email con formato inválido | `El email no es válido` |
| `400` | Contraseña de menos de 8 caracteres | `La contraseña debe tener al menos 8 caracteres` |
| `409` | Ya existe un usuario con ese email | `Ya existe un usuario registrado con ese email` |

## Login — `POST /api/sessions/login`

Valida credenciales y, si son correctas, genera un JWT y lo guarda en una cookie HTTP Only llamada `currentUser`. El token nunca se devuelve en el body de la respuesta.

**Campos esperados (body JSON):**

| Campo | Tipo | Obligatorio |
|---|---|---|
| `email` | string | Sí |
| `password` | string | Sí |

**Request de ejemplo:**

```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

**Respuesta exitosa (`200`)** — además del body, la respuesta incluye la cookie `currentUser`:

```json
{
  "status": "success",
  "message": "Login correcto"
}
```

Configuración de la cookie: `httpOnly: true` (no accesible desde JavaScript del navegador), `sameSite: 'lax'`, `maxAge: 3600000` (1 hora), `secure: true` solo cuando `NODE_ENV=production`.

El JWT se firma con `JWT_SECRET` y expira según `JWT_EXPIRES_IN`. Su payload contiene únicamente `{ id, email, role }` — nunca la contraseña.

**Respuesta de error (`401`)** — mismo mensaje genérico tanto si el email no existe como si la contraseña es incorrecta, para no revelar cuál de los dos datos falló:

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

## Usuario actual — `GET /api/sessions/current`

Ruta protegida. Devuelve los datos del usuario autenticado a partir de la cookie `currentUser`, sin necesidad de volver a enviar email y contraseña.

Pasa por la estrategia `'current'` de Passport (`passport-jwt`), que extrae el token de la cookie `currentUser` mediante un extractor personalizado, verifica su firma y vigencia con `JWT_SECRET`, busca al usuario en la base con el `id` del payload, y lo deja disponible en `req.user`.

**Respuesta exitosa (`200`)** — con la cookie válida:

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

**Respuesta de error (`401`)** — sin cookie, o con un token inválido, manipulado o expirado:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

## Logout — `POST /api/sessions/logout`

Elimina la cookie `currentUser`, cerrando la sesión.

**Respuesta (`200`):**

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

Después del logout, una nueva petición a `GET /api/sessions/current` responde `401`.

## Estrategias de Passport y preparación para providers externos

Las tres estrategias de autenticación (`register`, `login`, `current`) están centralizadas en `src/config/passport.config.js`, separadas de `app.js` (que solo llama a `passport.initialize()`). Cada estrategia encapsula su propia lógica de validación:

- `register` (passport-local): valida los campos, normaliza el email, verifica unicidad, hashea la contraseña con bcrypt y asigna el rol `user` por defecto.
- `login` (passport-local): valida credenciales contra la base de datos. El JWT se genera y la cookie se setea en el controller, no en la estrategia.
- `current` (passport-jwt): extrae y verifica el JWT desde la cookie, y recupera al usuario desde la base de datos.

Esta estructura deja el proyecto preparado para agregar nuevas estrategias (por ejemplo `passport-google-oauth20` o `passport-github2`) sumando un nuevo `passport.use(...)` en `passport.config.js`, sin necesidad de modificar `app.js` ni las rutas existentes.

## Roles y autorización

El proyecto maneja tres roles: `admin`, `organizer` y `user`. El rol se guarda en el payload del JWT y se valida en cada request mediante `middlewares/authorize.middleware.js`:

- `authorizeRoles(...rolesPermitidos)`: middleware de orden superior que recibe la lista de roles permitidos para una ruta. Se usa siempre después de `authMiddleware` (que ya dejó `req.user` disponible). Si no hay usuario autenticado, responde `401`; si el rol de `req.user` no está en la lista permitida, responde `403`.

Las rutas `GET /api/users` y `POST /api/users` están protegidas con `authMiddleware, authorizeRoles('admin')`, por lo que solo un usuario con rol `admin` puede listar o crear usuarios.

## Gestión de usuarios (solo admin)

### Listar usuarios — `GET /api/users`

Devuelve todos los usuarios de la base de datos. Requiere estar autenticado (cookie `currentUser`) y tener rol `admin`.

**Respuesta exitosa (`200`):**

```json
{
  "status": "success",
  "payload": [
    {
      "_id": "665f2a...",
      "first_name": "Ana",
      "last_name": "Pérez",
      "email": "ana@mail.com",
      "role": "user"
    }
  ]
}
```

La contraseña nunca viaja en la respuesta: el campo `password` del modelo `User` está definido con `select: false`, así que queda excluida por defecto en cualquier consulta que no la pida explícitamente.

### Crear usuario — `POST /api/users`

Permite a un admin crear un usuario con un rol específico (`user`, `organizer` o `admin`), a diferencia del registro público (`/api/sessions/register`), que siempre asigna `user`.

**Campos esperados (body JSON):**

| Campo | Tipo | Obligatorio |
|---|---|---|
| `first_name` | string | Sí |
| `last_name` | string | Sí |
| `email` | string | Sí |
| `password` | string | Sí |
| `role` | string | Sí (`user`, `organizer` o `admin`) |

**Request de ejemplo:**

```json
{
  "first_name": "Carlos",
  "last_name": "Mendez",
  "email": "carlos@mail.com",
  "password": "12345678",
  "role": "organizer"
}
```

La contraseña se hashea con bcrypt (`createHash`) antes de guardarse, igual que en el registro público.

**Respuesta exitosa (`201`):**

```json
{
  "status": "success",
  "payload": {
    "_id": "665f2a...",
    "first_name": "Carlos",
    "last_name": "Mendez",
    "email": "carlos@mail.com",
    "role": "organizer"
  }
}
```

**Respuestas de error:**

| Código | Causa | Mensaje |
|---|---|---|
| `400` | Falta algún campo obligatorio | `Todos los campos son obligatorios` |
| `401` | No autenticado (sin cookie o token inválido) | `No autenticado` |
| `403` | Autenticado pero sin rol `admin` | `No tenés permisos para realizar esta acción` |
| `409` | Ya existe un usuario con ese email | `El correo electrónico ya está en uso` |

## Cómo probarlo

Con el servidor corriendo (`npm run dev`), usar Postman o Insomnia (con las cookies habilitadas, ya que el login depende de ellas) para probar, en orden:

1. `POST /api/sessions/register` — registro exitoso.
2. `POST /api/sessions/login` — con esas credenciales; confirmar que la cookie `currentUser` aparece en la respuesta.
3. `GET /api/sessions/current` — con la cookie, debe devolver `200` y los datos del usuario.
4. `POST /api/sessions/logout` — debe devolver `200`.
5. `GET /api/sessions/current` — repetido después del logout, debe devolver `401`.
6. `POST /api/sessions/login` con un email inexistente — debe devolver `401` con el mensaje genérico.
7. `POST /api/sessions/login` con la contraseña incorrecta — debe devolver `401` con el mismo mensaje genérico.
8. `GET /api/sessions/current` sin cookie (por ejemplo en una pestaña donde no se haya hecho login) — debe devolver `401`.

Para confirmar que la contraseña se guarda de forma segura, revisar el usuario creado en MongoDB Atlas: el campo `password` debe verse como un hash de bcrypt (`$2b$10$...`), nunca como el texto original.

Para probar la gestión de usuarios y los roles, con un usuario `admin` ya creado en la base (el registro público no permite asignar `admin`, así que el primero se crea registrándose normalmente y cambiando su `role` a mano en MongoDB Atlas):

9. `POST /api/sessions/login` con ese usuario `admin` — confirmar que la cookie se setea.
10. `GET /api/users` con la cookie de admin — debe devolver `200` y la lista de usuarios, sin el campo `password` en ninguno.
11. `GET /api/users` sin cookie — debe devolver `401`.
12. `GET /api/users` con la cookie de un usuario con rol `user` o `organizer` — debe devolver `403`.
13. `POST /api/users` con la cookie de admin y los 5 campos — debe devolver `201` con el usuario creado.
14. `POST /api/users` con la cookie de admin, repitiendo un email ya existente — debe devolver `409`.
15. `POST /api/users` con la cookie de admin, omitiendo algún campo — debe devolver `400`.
16. `POST /api/users` con la cookie de un usuario que no es admin — debe devolver `403`.

## Evidencia

**Login — cookie en la respuesta:**
![Login con cookie](./capturas/login-cookie.png)

**Current — 200 con cookie válida:**
![Current 200](./capturas/current-200.png)

**Current — 401 sin cookie:**
![Current 401](./capturas/current-401.png)

En esta etapa, las rutas de usuarios (`/api/users`) ya tienen lógica completa y están protegidas por rol. Las rutas de eventos y tickets siguen siendo placeholders sin lógica de negocio ni conexión funcional con los modelos — eso se incorporará en las próximas entregas, junto con la gestión de cupos y notificaciones.

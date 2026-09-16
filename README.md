# Plataforma de Eventos e Inscripciones

API REST para la gestión de eventos e inscripciones/tickets, desarrollada como proyecto final del curso Backend II de Coderhouse. Permite administrar usuarios, eventos, categorías e inscripciones, con roles diferenciados (admin, organizador y usuario).

Este repositorio corresponde a la Pre-entrega 2: registro seguro de usuarios, construida sobre la base arquitectónica de la Pre-entrega 1. Implementa el primer flujo real de usuarios (`POST /api/sessions/register`), con validación de datos, normalización de email, hash de contraseñas con bcrypt y persistencia en MongoDB, siguiendo una arquitectura en capas completa (ruta → controller → service → repository → DAO → modelo).

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- dotenv
- bcrypt
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
| `JWT_SECRET` | Clave secreta para la futura firma de tokens JWT |

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
│   ├── middlewares/            # Middlewares (validaciones, autenticación futura)
│   └── utils/                   # Funciones reutilizables (hash de contraseñas con bcrypt)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

El flujo de registro de usuarios ya sigue la arquitectura completa: `sessions.router.js` → `sessions.controller.js` → `sessions.service.js` → `users.repository.js` → `users.dao.js` → modelo `User`. El resto de los recursos (eventos, tickets, usuarios) todavía son placeholders a desarrollar en próximas entregas.

## Rutas disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verifica que el servidor esté activo |
| POST | `/api/sessions/register` | Registra un nuevo usuario (ver detalle abajo) |
| GET | `/api/events` | Lista de eventos (por ahora devuelve un arreglo vacío) |
| POST | `/api/events` | Crea un evento (placeholder, sin lógica de base de datos aún) |
| GET | `/api/users` | Placeholder de usuarios |
| POST | `/api/users` | Placeholder de usuarios |
| GET | `/api/tickets` | Placeholder de tickets |
| POST | `/api/tickets` | Placeholder de tickets |

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

### Cómo probarlo

Con el servidor corriendo (`npm run dev`), enviar un `POST` a `http://localhost:<PORT>/api/sessions/register` con Postman o Insomnia, usando alguno de los bodies de ejemplo de arriba. Casos recomendados para probar: registro exitoso, campos faltantes, email inválido, contraseña corta, y un registro repetido con el mismo email (para verificar el `409`).

Para confirmar que la contraseña se guarda de forma segura, revisar el usuario creado en MongoDB Atlas: el campo `password` debe verse como un hash de bcrypt (`$2b$10$...`), nunca como el texto original.

En esta etapa las demás rutas (eventos, tickets, usuarios) siguen siendo placeholders sin lógica de negocio ni conexión funcional con los modelos — eso se incorporará en las próximas entregas junto con autenticación (login, JWT, Passport, cookies, ruta `current`), roles y permisos, gestión de cupos, y notificaciones.

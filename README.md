# Plataforma de Eventos e Inscripciones

API REST para la gestión de eventos e inscripciones/tickets, desarrollada como proyecto final del curso Backend II de Coderhouse. Permite administrar usuarios, eventos, categorías e inscripciones, con roles diferenciados (admin, organizador y usuario).

Este repositorio corresponde a la Pre-entrega 1: base arquitectónica del proyecto, organizada por capas y lista para escalar en las próximas entregas (autenticación, roles, gestión completa de eventos e inscripciones).

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
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
│   ├── app.js              # Configura Express (middlewares y rutas)
│   ├── server.js           # Levanta el servidor y conecta la base de datos
│   ├── config/              # Configuración (conexión a MongoDB)
│   ├── routes/              # Definición de endpoints
│   ├── controllers/         # Reciben la petición y devuelven la respuesta
│   ├── services/            # Lógica de negocio (a desarrollar en próximas entregas)
│   ├── repositories/        # Abstracción de acceso a datos (a desarrollar)
│   ├── dao/                 # Acceso directo a la base de datos (a desarrollar)
│   ├── models/               # Schemas de Mongoose (User, Event, ...)
│   ├── middlewares/          # Middlewares (validaciones, autenticación futura)
│   └── utils/                 # Funciones reutilizables
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Rutas disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verifica que el servidor esté activo |
| GET | `/api/events` | Lista de eventos (por ahora devuelve un arreglo vacío) |
| POST | `/api/events` | Crea un evento (placeholder, sin lógica de base de datos aún) |
| GET | `/api/sessions` | Estructura inicial para autenticación (sin lógica de auth aún) |
| GET | `/api/users` | Placeholder de usuarios |
| POST | `/api/users` | Placeholder de usuarios |
| GET | `/api/tickets` | Placeholder de tickets |
| POST | `/api/tickets` | Placeholder de tickets |

En esta etapa las rutas no implementan lógica de negocio real ni conexión funcional con los modelos — eso se incorporará en las próximas entregas junto con autenticación (JWT, Passport, cookies), roles y permisos, gestión de cupos, y notificaciones.

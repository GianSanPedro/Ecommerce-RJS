# ECommerce (React + Node)

Aplicacion de comercio electronico con frontend en React y backend en Node/Express. Incluye catalogo con CRUD, carrito con integracion de pagos de Mercado Pago, autenticacion por JWT, chat en tiempo real con Socket.IO, subida de imagenes via FTP y persistencia de mensajes de contacto.

## Stack tecnologico

### Backend
- Node.js 16+, Express 4, CORS y JSON.
- Mongoose + MongoDB (opcional), DAOs alternativos en memoria y archivo.
- Autenticacion JWT (`access-token` en headers), middleware `guarda` con 401 en errores.
- Passwords con hash `bcryptjs` (registro/login); si detecta password en texto plano al loguear, lo rehashea y persiste.
- Multer para subir archivos y `basic-ftp` para enviarlos a un servidor remoto.
- Mercado Pago SDK (`mercadopago`) para crear preferencias de pago.
- Socket.IO para chat en tiempo real.
- Joi para validar productos y dotenv para variables de entorno.

### Frontend
- React 18 con `react-scripts`, enrutado con `react-router-dom` (HashRouter).
- Redux Toolkit para estado global de autenticacion/usuario.
- Axios para consumir la API REST y `socket.io-client` para WebSocket.
- `@mercadopago/sdk-react` para el widget de pagos (Wallet).
- Bootstrap/React-Bootstrap, SASS y componentes propios para UI.

## Arquitectura general
- Proyecto dividido en carpetas `BackEnd` y `FrontEnd`.
- Comunicacion cliente-API por REST (JSON) y WebSocket para chat.
- Flujo de datos: Cliente -> React (HashRouter) -> axios/socket.io -> API Express `/api/*` -> Servicios -> DAOs -> MongoDB/archivo/memoria -> respuesta JSON -> UI.
- Capas backend: rutas -> controladores -> servicios -> DAOs/modelos -> base de datos.
- Capas frontend: componentes/paginas, servicios (axios/sockets), estado Redux, routing en `App.js`.

## Estructura de carpetas
- `BackEnd/`: API Express, WebSocket y estaticos.
  - `server.js`: servidor HTTP + Socket.IO y montaje de rutas.
  - `config.js`: lectura de `.env` (puerto, BD, JWT, FTP, Mercado Pago).
  - `router/`: endpoints REST (`productos`, `pedidos`, `usuarios`, `upload`, `contacto`) y middleware `guarda`.
  - `controlador/`: logica de cada recurso y chat.
  - `servicio/`: validaciones, pagos, FTP, contactos y reglas de negocio.
  - `model/`: conexion Mongo (`DBMongo.js`) y DAOs de productos, pedidos, usuarios, mensajes y contactos (con modo FILE para productos, mensajes y contactos).
  - `public/`: se sirve como estatico; puede contener el build del frontend.
  - `uploads/`: destino temporal de archivos recibidos por multer.
  - `productos.json`: semilla para modo FILE de productos.
- `FrontEnd/`: SPA en React.
  - `src/componentes/`: vistas (Inicio, Alta, Carrito, Contacto, Nosotros, Chat), modales y Navbar.
  - `src/servicios/`: clientes REST/WebSocket (`productos`, `carrito`, `usuarios`, `upload`, `contacto`).
  - `src/state/`: Redux store, acciones y reducer de autenticacion.
  - `src/App.js`, `src/index.js`, `src/index.css`: bootstrap de la app.
  - `public/`, `build/`: assets y build de produccion.

## Endpoints del BackEnd

| Metodo | Ruta | Proteccion | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/productos/:id?` | JWT | Lista todos los productos o uno por `id`. |
| POST | `/api/productos` | JWT | Crea producto `{nombre, precio, stock, marca, categoria, detalles, descripcion?, foto, envio}` (valida Joi). |
| PUT | `/api/productos/:id` | JWT | Actualiza producto. |
| DELETE | `/api/productos/:id` | JWT | Elimina producto. |
| GET | `/api/pedidos` | JWT | Obtiene todos los pedidos. |
| POST | `/api/pedidos` | JWT | Guarda pedido `{usuario, compra, fyh, carrito}`. |
| POST | `/api/pedidos/mp/create_preference` | JWT | Crea preferencia de pago (Mercado Pago). |
| GET | `/api/pedidos/mp/feedback` | Publica | Callback MP: si `status=approved` persiste el pedido y redirige a `urlBack`. |
| POST | `/api/upload` | JWT + multipart | Recibe archivo `archivo`, lo sube por FTP y responde `{urlFotoFTP}`. |
| POST | `/api/usuarios/login` | Publica | Login `{email, password}` -> `{status, usuario, token}`. |
| POST | `/api/usuarios/loginVisitante` | Publica | Devuelve token de invitado. |
| POST | `/api/usuarios/register` | Publica | Alta usuario `{nombre, email, password, admin?}`. |
| POST | `/api/usuarios/token` | Publica | Valida token `{token}`. |
| POST | `/api/contacto` | Publica | Guarda mensaje de contacto `{nombre, email, comentario}`. |
| GET | `/api/contacto` | JWT | Lista mensajes de contacto (pensado para admin). |
| WebSocket | `/` | Publica | Evento `nuevo-mensaje` guarda y retransmite; `mensajes` envia historial. |

Persistencia seleccionable con `MODO_PERSISTENCIA`:
- MEM (default): arrays en memoria.
- FILE: solo productos usan `productos.json`.
- MONGODB: requiere `STRCNX` y `BASE`, usa modelos Mongoose.

## Modos de persistencia y configuración recomendada
- Default para demo/reclutadores: `MODO_PERSISTENCIA=MEM` (sin requisitos extra).
- Para probar escritura en disco: `MODO_PERSISTENCIA=FILE` guarda productos en `productos.json` y genera `mensajes.json`/`contactos.json`.
- Para uso real: `MODO_PERSISTENCIA=MONGODB` con `STRCNX` y `BASE` definidos (configura `.env` sin credenciales en el repo).

Archivos ejemplo:
- `BackEnd/.env.example`: variables del backend (sin secretos).
- `FrontEnd/.env.example`: variables del frontend (sin secretos).

## FrontEnd
- Rutas (`HashRouter`): `/inicio`, `/alta` (solo admin), `/carrito`, `/contacto`, `/nosotros`, `/chat` (login requerido).
- Estado: Redux guarda `login` y `usuarioLogueado`; token en `localStorage`. Carrito en `localStorage` con `useStateLocalStorage`.
- Consumo de API: axios en servicios (`productos`, `carrito`, `usuarios`, `upload`, `contacto`) usando `REACT_APP_PORT_SRV_DEV` en desarrollo y header `access-token` si hay token.
- Pagos: Wallet MP crea preferencia; en feedback `/mp/feedback` se guarda pedido en `/api/pedidos` si `status=approved` y se limpia el carrito.
- Chat: Socket.IO cliente; admins ven todos los mensajes, usuarios ven los propios y los de admins.
- Subida de imagenes: `ObtenerFoto` envia `FormData` a `/api/upload` y toma la URL devuelta.
- Contacto: formulario llama a `/api/contacto` y persiste nombre/email/comentario.

## Configuracion y variables de entorno
- Backend (`BackEnd/.env`):
  - `PORT`: puerto de Express (8080 por defecto).
  - `MODO_PERSISTENCIA`: `MEM` | `FILE` | `MONGODB`.
  - `STRCNX`: cadena de conexion Mongo (ej. `mongodb://127.0.0.1/`).
  - `BASE`: nombre de la base.
  - `LLAVE`: secreto JWT.
  - `MP_AccessToken`: token privado de Mercado Pago.
  - `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_DST`: destino FTP para subir imagenes.
- Frontend (`FrontEnd/.env`):
  - `REACT_APP_PORT_SRV_DEV`: puerto del backend en desarrollo.
  - `REACT_APP_MP_PublicKey`: clave publica de MP (usar TEST en dev).

## Notas de autenticacion
- Passwords se almacenan con hash `bcryptjs`. Si habia texto plano, al loguear con la clave correcta se rehashea y persiste.
- Middleware `guarda` responde 401 si falta o es invalido el token.

## Usuarios de prueba (modo MEM)
- Admin: `admin@test.com` / `admin123` (admin: true)
- Cliente 1: `cliente1@test.com` / `cliente123`
- Cliente 2: `cliente2@test.com` / `cliente123`

## Instalacion y ejecucion en desarrollo
```bash
git clone <url-del-repo>
cd Ecommerce

# Backend
cd BackEnd
npm install
# configurar .env con las variables anteriores
npm run dev      # o npm start

# Frontend (en otra terminal)
cd ../FrontEnd
npm install
# configurar REACT_APP_PORT_SRV_DEV=8080 (u otro puerto del backend)
npm start
```
- Backend expone la API en `http://localhost:<PORT>` (por defecto 8080).
- Frontend corre en `http://localhost:3000` usando HashRouter.

## Build y despliegue
- Generar build del frontend: `cd FrontEnd && npm run build`.
- Copiar build al backend: `npm run build-copy` (copia `FrontEnd/build` a `BackEnd/public`).
- En produccion: arrancar backend (`npm start`) sirviendo `/api/*` y estaticos desde `BackEnd/public`, o apuntar axios al dominio del backend.

## Tests
- No se encontraron tests automatizados; scripts `npm test` son placeholders.

## Futuras mejoras
- Validar inputs de usuario/registro con Joi y politicas de contrasena.
- Proteccion de rutas en frontend (guards admin/login) y manejo de expiracion/refresh de tokens.
- Centralizar manejo de URLs de API y manejo de errores en UI.
- Persistir carrito en backend/BD para usuarios logueados y auditar pagos.

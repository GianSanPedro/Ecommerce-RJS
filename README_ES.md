# ECommerce React + Node

[Versión en inglés](README.md)

Aplicación fullstack de comercio electrónico con backend en Node/Express y frontend en React. Incluye catálogo con CRUD, carrito con pagos vía Mercado Pago, chat en tiempo real y gestión de contactos. Diseño modular para persistir en memoria, archivos JSON o MongoDB.

## 🚀 Resumen rápido
- **Backend**: Express, JWT (header `access-token`), Socket.IO, Joi, Mongoose opcional, upload con Multer (valida imágenes hasta 5MB) hacia FTP o carpeta `media`, integración Mercado Pago.
- **Frontend**: React 18 (CRA), HashRouter, Redux Toolkit, Axios (envía `access-token`), `@mercadopago/sdk-react`, Socket.IO client.
- **Seguridad**: Middleware JWT `guarda`; `soloAdmin` para proteger productos, contactos y upload; validaciones Joi (productos, contactos, pedidos, credenciales).
- **Pagos**: Preferencias de Mercado Pago; el carrito/pedido pendiente se persiste al crear la preferencia y se consolida en el feedback.

## 🧱 Arquitectura general
- Separación en `BackEnd` (API + websockets + estáticos) y `FrontEnd` (SPA).
- Flujo de datos: Cliente → React/Redux (HashRouter) → API REST (`/api/...` con `guarda` JWT) → Servicios/DAO (Joi, MercadoPago, Multer/FTP) → Persistencia (MEM/FILE/MongoDB) → Respuesta JSON/WebSocket → UI.
- Capas:
  - Router/Controlador: traduce HTTP/Socket a servicios.
  - Servicio: negocio (validaciones, pagos, guardado de pedidos y carrito pendiente, upload, JWT).
  - DAO/Model: factories para MEM/FILE/MongoDB.
  - Frontend: rutas públicas/protegidas, carrito, login/registro, alta de productos, chat, contactos.
- Seguridad: `guarda` valida token; `soloAdmin` exige `admin=true`; errores coherentes 400/401/403.

## 🗂️ Estructura de carpetas
```
Ecommerce/
- BackEnd/
  - server.js (Express + Socket.IO + rutas)
  - config.js (.env y variables)
  - router/ (productos, pedidos, usuarios, contacto, upload, guarda JWT, websockets)
  - controlador/ (adapta req/res a servicios)
  - servicio/ (productos, pedidos/MP, usuarios, contactos, mensajes, upload, validaciones)
  - model/ (DBMongo.js y DAO MEM/FILE/MONGODB + esquemas mongoose)
  - public/ (estáticos; puede alojar el build del frontend)
  - media/ (almacen local de uploads) y uploads/ (temporal)
  - *.json (datos para modo FILE)
- FrontEnd/
  - src/componentes/ (INICIO, ALTA, CARRITO, CONTACTO, CHAT, NAVBAR, modales, hooks)
  - src/servicios/ (axios/socket: productos, carrito, usuarios, upload, contacto, token)
  - src/state/ (Redux Toolkit store, reducers, actions)
  - App.js, index.js, index.css
- README.md
```

## 🔌 Endpoints principales
| Método | Ruta | Descripción | Protección |
| --- | --- | --- | --- |
| GET | `/api/productos/:id?` | Lista productos o uno. | JWT + admin |
| POST | `/api/productos/` | Crea producto (Joi). | JWT + admin |
| PUT | `/api/productos/:id` | Actualiza producto. | JWT + admin |
| DELETE | `/api/productos/:id` | Borra producto. | JWT + admin |
| GET | `/api/pedidos/` | Lista pedidos. | JWT |
| POST | `/api/pedidos/` | Guarda pedido/carrito (Joi). | JWT |
| POST | `/api/pedidos/mp/create_preference` | Crea preferenceId MP y persiste carrito pendiente. | JWT |
| GET | `/api/pedidos/mp/feedback` | Redirige con payment_id/status/merchant_order_id. | Público |
| POST | `/api/upload/` | Sube archivo (Multer) → FTP o `media`. | JWT + admin |
| POST | `/api/usuarios/login` | Login (Joi). | Público |
| POST | `/api/usuarios/loginVisitante` | Token visitante. | Público |
| POST | `/api/usuarios/register` | Registro (Joi). | Público |
| POST | `/api/usuarios/token` | Valida token JWT. | Público |
| POST | `/api/contacto/` | Envía contacto. | Público |
| GET | `/api/contacto/` | Lista contactos. | JWT + admin |
| DELETE | `/api/contacto/:id` | Borra contacto. | JWT + admin |
| WebSocket | `/` | Chat: `mensajes`, `nuevo-mensaje`. | Público |

## 🔐 Autenticación y roles
- Header `access-token` con JWT firmado con `LLAVE`.
- Middleware `guarda` valida el token; `soloAdmin` exige `admin=true`.
- Rutas admin: CRUD de productos, upload, GET/DELETE de contactos.
- Login/registro validados con Joi; respuestas 400/401/403 según el caso.

## 🖥️ Frontend
- Vistas: Inicio (catálogo + carrito), Alta (CRUD admin con upload drag&drop), Carrito (edición, Wallet MP, persiste pedido pendiente), Contacto (form público, vista admin para eliminar), Chat (mensajes de autor/admin), Nosotros.
- Estado/Auth: Redux Toolkit (`login`, `usuarioLogueado`), token en localStorage, carrito en localStorage (hook `useStateLocalStorage`).
- Navegación: HashRouter para servir tras Express estático.
- Consumo API: Axios con `access-token` en headers; base URL depende de `NODE_ENV` y `REACT_APP_PORT_SRV_DEV`.
- Pagos: `@mercadopago/sdk-react` (Wallet); preference se genera en backend.
- Tiempo real: `socket.io-client` al mismo host de la API.

## 👥 Roles y comportamiento en la UI
- **Visitante** (token invitado): puede navegar, buscar productos, agregar al carrito y enviar contacto. No puede pagar (Wallet exige login) ni chatear (el chat se muestra solo con login). No es admin.
- **Cliente registrado** (login con email/password): puede hacer todo lo anterior y además pagar con Mercado Pago (Wallet), usar el chat y validar su token. No tiene permisos de administración.
- **Administrador** (`admin=true` en token): puede todo lo del cliente, más CRUD completo de productos (vista Alta), subir imágenes, listar y borrar contactos. El carrito no muestra el botón de compra para admin por diseño de la UI.

## ⚙️ Configuración de entornos
### Backend (`BackEnd/.env`)
- `PORT`: puerto (default 8080).
- `MODO_PERSISTENCIA`: `MEM` (demo), `FILE` (JSON locales), `MONGODB` (requiere `STRCNX` y `BASE`).
- `STRCNX`, `BASE`: conexión/base Mongo (solo en `MONGODB`).
- `LLAVE`: secreto JWT (requerido).
- `MP_AccessToken`: token privado MP (obligatorio si usas pagos).
- `CDN_BASE_URL`: base pública para imágenes (ej. `https://midominio.com/uploads`). Si no hay FTP, se sirve `http://localhost:<PORT>/media/<archivo>`.
- `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_DST`: si se completan, se sube a FTP; si se dejan vacíos, las imágenes quedan en `media/` local.

Guías rápidas:
- **Demo sin BD/FTP**: `MODO_PERSISTENCIA=MEM`, `LLAVE` cualquiera, `FTP_*` vacíos, `MP_AccessToken` de prueba (o vacío si no pruebas pagos). Imágenes desde `/media`.
- **Archivo plano**: `MODO_PERSISTENCIA=FILE`, usa los JSON locales.
- **MongoDB**: `MODO_PERSISTENCIA=MONGODB`, completa `STRCNX` y `BASE`.
- **FTP/CDN**: completa `FTP_*` y opcional `CDN_BASE_URL`; si no, se usa la carpeta `media`.
- **Pagos**: define `MP_AccessToken` (backend) y `REACT_APP_MP_PublicKey` (frontend) con credenciales TEST en desarrollo.

### Frontend (`FrontEnd/.env` o `.env.development`)
- `REACT_APP_PORT_SRV_DEV`: puerto del backend (ej. 8080).
- `REACT_APP_MP_PublicKey`: public key de MP (usar TEST en dev).

## ▶️ Instalación y ejecución
```bash
git clone <url-del-repo> Ecommerce
cd Ecommerce

# Backend
cd BackEnd
cp .env.example .env   # ajusta variables
npm install
npm run dev            # o npm start

# Frontend (otra terminal)
cd ../FrontEnd
cp .env.example .env   # ajusta REACT_APP_PORT_SRV_DEV / REACT_APP_MP_PublicKey
npm install
npm start
```
Backend en `http://localhost:<PORT>` (8080 por defecto). Frontend en `http://localhost:3000` (HashRouter).

## 📦 Build y despliegue
- Build frontend: `cd FrontEnd && npm run build`
- Copiar build al backend: `npm run build-copy` (copia a `BackEnd/public` en Windows).
- Producción: levantar backend (`npm start`) sirviendo `/api/*` y estáticos desde `BackEnd/public`, o servir el build por separado apuntando Axios al dominio del backend.

## ✅ Tests
- Backend: no hay tests automatizados (script placeholder).
- Frontend: tooling CRA (`react-scripts test`) disponible, sin suites específicas.

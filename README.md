# ECommerce React + Node

Aplicación fullstack para comercio electrónico con backend en Node/Express y frontend en React. Incluye gestión de productos, carrito con pagos vía Mercado Pago, chat en tiempo real con Socket.IO, subida de imágenes por FTP y manejo de consultas de contacto.

## Stack tecnológico

### Backend
- Node.js (>=16.20), Express, CORS, Socket.IO.
- Autenticación con JWT (`access-token`), contraseñas con `bcryptjs`.
- Validaciones con Joi (productos y contactos) y carga de variables con dotenv.
- Persistencia seleccionable (`MODO_PERSISTENCIA`): memoria, archivos JSON o MongoDB via Mongoose.
- Integraciones: Mercado Pago (`mercadopago`) para preferencias de pago; `multer` + `basic-ftp` para subir imágenes a un servidor FTP.

### Frontend
- React 18 (Create React App) con React Router DOM v6 (HashRouter).
- Redux Toolkit para estado global de login/usuario; localStorage para token y carrito.
- UI con Bootstrap / React-Bootstrap y SASS; soporte drag & drop de imágenes.
- Consumo de API con Axios y WebSocket con `socket.io-client`.
- Pagos con `@mercadopago/sdk-react` (Wallet).

## Arquitectura general
- Separación en `BackEnd` (API + websockets + estáticos) y `FrontEnd` (SPA).
- Flujo de datos (texto): Cliente → Frontend (React/Redux, HashRouter) → API REST (`/api/...` en Express con middleware `guarda` JWT) → Servicios/DAO (validaciones Joi, MercadoPago, Multer/FTP) → MongoDB/JSON/Memoria → Respuesta JSON/WebSocket → UI.
- Responsabilidades:
  - Router/Controlador: traducen HTTP/Socket a llamadas de servicio y responden.
  - Servicio: lógica de negocio (validaciones, preferencias de pago, guardado de pedidos, subida de archivos, JWT).
  - DAO/Model: acceso a datos con factories para cambiar memoria/archivo/MongoDB sin tocar la lógica.
  - Frontend: rutas públicas y protegidas, gestión de carrito, login/registro, panel de alta de productos, chat y vista de contactos.

## Estructura de carpetas (resumen)

```
Ecommerce/
- BackEnd/
  - server.js (Express + Socket.IO + montaje de rutas)
  - config.js (.env y variables de conexión)
  - router/ (productos, pedidos, usuarios, contacto, upload, guarda JWT, websockets de mensajes)
  - controlador/ (adapta req/res hacia servicios)
  - servicio/ (negocio: productos, pedidos/MP, usuarios, contactos, mensajes, upload, validaciones)
  - model/
    - DBMongo.js (conexión Mongoose)
    - DAO/ (factories y persistencias MEM/FILE/MONGODB + esquemas mongoose)
  - public/ (estáticos; puede alojar el build del frontend)
  - uploads/ (almacenamiento temporal antes de subir a FTP)
  - *.json (datos cuando se usa modo FILE)
- FrontEnd/
  - src/
    - componentes/ (INICIO, ALTA, CARRITO, CONTACTO, CHAT, NAVBAR, modales, hooks)
    - servicios/ (axios/socket, token, carrito, productos, usuarios, upload, contacto)
    - state/ (store Redux Toolkit, reducers y actions)
    - App.js (rutas y layout) e index.js (HashRouter + Provider)
  - public/ (assets CRA)
  - package.json (scripts CRA, build-copy a BackEnd/public)
- README.md
```

## Endpoints del BackEnd

| Método | Ruta | Descripción | Body/params |
| ------ | ---- | ----------- | ----------- |
| GET | `/api/productos/:id?` | Lista productos o uno por id. Protegido con JWT. | `id` opcional en path. |
| POST | `/api/productos/` | Crea producto (valida Joi). Protegido. | JSON: `nombre, precio, stock, marca, categoria, detalles, descripcion?, foto, envio`. |
| PUT | `/api/productos/:id` | Actualiza producto. Protegido. | JSON parcial con campos del producto. |
| DELETE | `/api/productos/:id` | Borra producto. Protegido. | Path `id`. |
| GET | `/api/pedidos/` | Lista pedidos. Protegido. | - |
| POST | `/api/pedidos/` | Guarda pedido (carrito + usuario + compra + fecha). Protegido. | JSON `{ carrito, usuario, compra, fyh }`. |
| POST | `/api/pedidos/mp/create_preference` | Genera `preferenceId` de Mercado Pago a partir del carrito. Protegido. | `{ urlBack, carrito, usuario, prefItems }`. |
| GET | `/api/pedidos/mp/feedback` | Callback de Mercado Pago: redirige al frontend con `payment_id/status/merchant_order_id`. Público. | Query params. |
| POST | `/api/upload/` | Sube archivo (campo `archivo`), lo envía a FTP y devuelve URL pública. Protegido. | `multipart/form-data`. |
| POST | `/api/usuarios/login` | Login: devuelve token y datos de usuario. | `{ email, password }`. |
| POST | `/api/usuarios/loginVisitante` | Login visitante: token temporal sin credenciales. | - |
| POST | `/api/usuarios/register` | Registro básico. | `{ nombre, email, password, admin? }`. |
| POST | `/api/usuarios/token` | Valida token JWT. | `{ token }`. |
| POST | `/api/contacto/` | Envía solicitud de contacto. Público. | `{ nombre, email, comentario }`. |
| GET | `/api/contacto/` | Lista contactos recibidos. Protegido. | - |
| DELETE | `/api/contacto/:id` | Elimina contacto por id. Protegido. | Path `id`. |
| WebSocket | `/` | Canal de chat con Socket.IO. Eventos: `mensajes` (lista), `nuevo-mensaje` (server rebroacast). | JSON `{ autor, texto, admin, fyh }`. |

Autenticación: se envía `access-token` en headers (JWT firmado con `LLAVE`). Persistencia: `MODO_PERSISTENCIA` controla si se usa memoria, archivos JSON o MongoDB (esquemas en `model/DAO/models`).

## FrontEnd
- **Vistas**:
  - Inicio: listado de productos con búsqueda y agregado al carrito (no para admin).
  - Alta: panel de administración CRUD de productos; permite subir imagen vía drag&drop (Multer + FTP).
  - Carrito: edición de cantidades, borrado, preferencia de pago Mercado Pago (Wallet) y guardado de pedido si el pago fue aprobado.
  - Contacto: formulario público; vista de administración para listar/eliminar consultas.
  - Chat: sala global en tiempo real (Socket.IO), filtra mensajes por autor/admin.
  - Nosotros: contenido estático de presentación.
- **Estado y auth**: Redux Toolkit mantiene `login` y `usuarioLogueado`; tokens en localStorage (helpers en `servicios/token`). El carrito se persiste en localStorage mediante el hook `useStateLocalStorage`.
- **Navegación**: HashRouter (`/#/...`) para facilitar despliegue detrás de Express estático.
- **Consumo de API**: servicios en `src/servicios` con Axios; base URL depende de `NODE_ENV` y `REACT_APP_PORT_SRV_DEV`. `setHeader()` agrega `access-token`.
- **Pagos**: `@mercadopago/sdk-react` inicializa con `REACT_APP_MP_PublicKey`; se llama al endpoint `/api/pedidos/mp/create_preference` antes de abrir el Wallet.
- **Tiempo real**: `socket.io-client` se conecta al mismo host que la API; suscripción al canal `mensajes`.

## Configuración y variables de entorno

### Backend (`BackEnd/.env`)
- `PORT`: puerto del servidor (por defecto 8080).
- `MODO_PERSISTENCIA`: `MEM` | `FILE` | `MONGODB`.
- `STRCNX`: cadena de conexión Mongo (`mongodb://...`).
- `BASE`: nombre de la base de datos.
- `LLAVE`: clave para firmar/validar JWT.
- `MP_AccessToken`: access token privado de Mercado Pago (servidor).
- `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_DST`: credenciales y carpeta destino para subir archivos.

### Frontend (`FrontEnd/.env` o `.env.development`)
- `REACT_APP_PORT_SRV_DEV`: puerto donde corre el backend en desarrollo (ej.: 8080).
- `REACT_APP_MP_PublicKey`: public key de Mercado Pago para el Wallet.

## Instalación y ejecución en desarrollo

1) Clonar el repositorio:
```bash
git clone <url-del-repo> Ecommerce
cd Ecommerce
```

2) Backend:
```bash
cd BackEnd
cp .env.example .env   # ajusta variables
npm install
npm run dev            # nodemon
# o: npm start          # node server.js
```
El backend queda por defecto en `http://localhost:8080`.

3) Frontend (en otra terminal):
```bash
cd FrontEnd
cp .env.example .env   # crea y completa REACT_APP_PORT_SRV_DEV / REACT_APP_MP_PublicKey si no existe
npm install
npm start              # CRA en http://localhost:3000
```
4) Verifica que `REACT_APP_PORT_SRV_DEV` apunte al puerto del backend y que ambos servidores estén corriendo.

## Build y despliegue
- Generar build de producción del frontend:
```bash
cd FrontEnd
npm run build
```
- Para servir el build con Express, usa:
```bash
npm run build-copy   # copia /build a BackEnd/public mediante xcopy (Windows)
```
Luego inicia el backend (`npm start`) y servirá los estáticos desde `BackEnd/public` junto con la API.
- En despliegues separados, puedes servir el build con un CDN/servidor web y apuntar las variables de entorno del frontend al dominio del backend.

## Tests
- Backend: no hay tests automatizados; el script `npm test` es un placeholder.
- Frontend: incluye tooling de CRA (`react-scripts test`) pero no hay suites específicas creadas.

## Futuras mejoras / roadmap
- Endurecer la autorización por rol en backend (p. ej. limitar CRUD de productos y contactos sólo a admin).
- Completar validaciones Joi para pedidos/usuarios y manejar mejor los códigos de error.
- Persistir el carrito del lado servidor y manejar webhooks de Mercado Pago para confirmar pagos de forma asíncrona.
- Mejorar la carga de archivos (validar tipo/tamaño, manejar fallos de FTP) y permitir CDN configurable.
- Ajustar el script `eject` del frontend (actualmente mal codificado) o removerlo si no se usa.

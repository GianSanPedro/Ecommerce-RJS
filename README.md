# ECommerce React + Node

[Versión en español](README_ES.md)

Fullstack e-commerce app with a Node/Express backend and a React frontend. Includes a CRUD catalog, cart with Mercado Pago payments, real-time chat, contact management, and flexible persistence (memory, JSON files, or MongoDB). Uploads support FTP or local `media` fallback, and the cart lives in `localStorage` until checkout or manual clear.

## Quick summary
- **Backend**: Express, JWT (`access-token` header), Socket.IO, Joi, optional Mongoose, uploads with Multer (images up to 5MB) to FTP or local `media`, Mercado Pago integration.
- **Frontend**: React 18 (CRA), HashRouter, Redux Toolkit, Axios (sends `access-token`), `@mercadopago/sdk-react`, Socket.IO client.
- **Security**: JWT middleware `guarda`; `soloAdmin` protects products, contacts, and uploads; Joi validations (products, contacts, orders, credentials).
- **Payments**: Mercado Pago preferences; pending cart/order is persisted on preference creation and consolidated on feedback.
- **Uploads**: If FTP fails or is not configured, files fall back to local `media/` and return a usable URL; upload endpoint creates `media` if missing.
- **Cart persistence**: Stored in `localStorage` (survives logout) until checkout, manual clear, or explicit removal.

## Architecture
- Split into `BackEnd` (API + websockets + static) and `FrontEnd` (SPA).
- Data flow: Client → React/Redux (HashRouter) → REST API (`/api/...` with `guarda` JWT) → Services/DAO (Joi, MercadoPago, Multer/FTP) → Persistence (MEM/FILE/MongoDB) → JSON/WebSocket response → UI.
- Layers: routers/controllers translate HTTP/Socket to services; services handle business logic (validations, payments, saving orders and pending cart, upload, JWT); DAO/Model factories pick MEM/FILE/MONGODB; frontend manages routes, state, cart, auth, chat, contacts.
- Security: `guarda` validates token; `soloAdmin` requires `admin=true`; consistent 400/401/403 responses.

## Folder structure
```
Ecommerce/
- BackEnd/
  - server.js (Express + Socket.IO + routes)
  - config.js (.env and variables)
  - router/ (productos, pedidos, usuarios, contacto, upload, JWT guard, websockets)
  - controlador/ (adapts req/res to services)
  - servicio/ (productos, pedidos/MP, usuarios, contactos, mensajes, upload, validations)
  - model/ (DBMongo.js and DAO MEM/FILE/MONGODB + mongoose schemas)
  - public/ (static; can host the frontend build)
  - media/ (local upload storage) and uploads/ (temp)
  - *.json (data for FILE mode)
- FrontEnd/
  - src/componentes/ (INICIO, ALTA, CARRITO, CONTACTO, CHAT, NAVBAR, modals, hooks)
  - src/servicios/ (axios/socket: products, cart, users, upload, contact, token)
  - src/state/ (Redux Toolkit store, reducers, actions)
  - App.js, index.js, index.css
- README.md / README_ES.md
```

## Main endpoints
| Method | Path | Description | Protection |
| --- | --- | --- | --- |
| GET | `/api/productos/:id?` | List products or one. | Public |
| POST | `/api/productos/` | Create product (Joi). | JWT + admin |
| PUT | `/api/productos/:id` | Update product. | JWT + admin |
| DELETE | `/api/productos/:id` | Delete product. | JWT + admin |
| GET | `/api/pedidos/` | List orders. | JWT |
| POST | `/api/pedidos/` | Save order/cart (Joi). | JWT |
| POST | `/api/pedidos/mp/create_preference` | Create MP preferenceId and persist pending cart. | JWT |
| GET | `/api/pedidos/mp/feedback` | Redirect with payment_id/status/merchant_order_id. | Public |
| POST | `/api/upload/` | Upload file (Multer) → FTP or `media`. | JWT + admin |
| POST | `/api/usuarios/login` | Login (Joi). | Public |
| POST | `/api/usuarios/loginVisitante` | Guest token. | Public |
| POST | `/api/usuarios/register` | Register (Joi). | Public |
| POST | `/api/usuarios/token` | Validate JWT token. | Public |
| POST | `/api/contacto/` | Send contact message. | Public |
| GET | `/api/contacto/` | List contacts. | JWT + admin |
| DELETE | `/api/contacto/:id` | Delete contact. | JWT + admin |
| WebSocket | `/` | Chat: `mensajes`, `nuevo-mensaje`. | Public |

## Authentication and roles
- Header `access-token` with JWT signed by `LLAVE`.
- Middleware `guarda` validates token; `soloAdmin` requires `admin=true`.
- Admin routes: product CRUD, upload, GET/DELETE contacts.
- Login/register validated with Joi; 400/401/403 responses as appropriate.

## Frontend
- Views: Home (catalog + cart), Alta (admin CRUD with drag&drop upload), Cart (edit, Wallet MP, persists pending order), Contact (public form, admin view to delete), Chat (author/admin messages), About.
- State/Auth: Redux Toolkit (`login`, `usuarioLogueado`), token in localStorage, cart in localStorage (`useStateLocalStorage` hook, survives logout until cleared or checkout).
- Navigation: HashRouter to serve behind Express static.
- API consumption: Axios with `access-token` header; base URL depends on `NODE_ENV` and `REACT_APP_PORT_SRV_DEV`.
- Payments: `@mercadopago/sdk-react` (Wallet); preference generated in backend.
- Real time: `socket.io-client` to the same host as the API.

## Roles and UI behavior
- **Visitor** (guest token): browse, search products, add to cart, send contact. Cannot pay (Wallet requires login) or chat (chat shows only when logged). Not admin.
- **Registered customer** (email/password login): all the above plus pay with Mercado Pago (Wallet), use chat, validate token. No admin permissions.
- **Administrator** (`admin=true` in token): everything a customer can do, plus full product CRUD (Alta view), upload images, list/delete contacts. The cart hides the purchase button for admin by design.

## Environment configuration
### Backend (`BackEnd/.env`)
- `PORT`: server port (default 8080).
- `MODO_PERSISTENCIA`: `MEM` (demo), `FILE` (local JSON), `MONGODB` (requires `STRCNX` and `BASE`).
- `STRCNX`, `BASE`: Mongo connection/base (only in `MONGODB`).
- `LLAVE`: JWT secret (required).
- `MP_AccessToken`: Mercado Pago private token (required if using payments).
- `CDN_BASE_URL`: public base for images (e.g., `https://yourdomain.com/uploads`). If no FTP, served from `http://localhost:<PORT>/media/<file>`.
- `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_DST`: fill to upload to FTP; if empty, images stay in local `media/`.

Quick guides:
- **Local demo without DB/FTP**: `MODO_PERSISTENCIA=MEM`, any `LLAVE`, `FTP_*` empty, `MP_AccessToken` test (or empty if not testing payments). Images from `/media`.
- **Flat file**: `MODO_PERSISTENCIA=FILE`, uses local JSON.
- **MongoDB**: `MODO_PERSISTENCIA=MONGODB`, set `STRCNX` and `BASE`.
- **FTP/CDN**: set `FTP_*` and optional `CDN_BASE_URL`; otherwise uses `media`.
- **Payments**: set `MP_AccessToken` (backend) and `REACT_APP_MP_PublicKey` (frontend) with TEST creds in dev.

### Frontend (`FrontEnd/.env` or `.env.development`)
- `REACT_APP_PORT_SRV_DEV`: backend port (e.g., 8080).
- `REACT_APP_MP_PublicKey`: MP public key (use TEST in dev).

## Installation and run
```bash
git clone <repo-url> Ecommerce
cd Ecommerce

# Backend
cd BackEnd
cp .env.example .env   # set your variables
npm install
npm run dev            # or npm start

# Frontend (another terminal)
cd ../FrontEnd
cp .env.example .env   # set REACT_APP_PORT_SRV_DEV / REACT_APP_MP_PublicKey
npm install
npm start
```
Backend at `http://localhost:<PORT>` (8080 default). Frontend at `http://localhost:3000` (HashRouter).

## Build and deploy
- Frontend build: `cd FrontEnd && npm run build`
- Copy build to backend: `npm run build-copy` (copies to `BackEnd/public` on Windows).
- Production: run backend (`npm start`) serving `/api/*` and static from `BackEnd/public`, or serve the build separately pointing Axios to the backend domain.

## Tests
- **Backend API**: Jest + Supertest in `BackEnd/tests/api.test.js`. Expects the API running (default `http://localhost:8080`; override with `TEST_BASE_URL`). Run from `BackEnd` with `npm test` (or `npx jest`).
- **Frontend components**: CRA tests in `FrontEnd/src/__tests__` (e.g., Navbar, Inicio). Run from `FrontEnd` with `npm test -- --watch=false`. Warnings from store logs may appear but tests pass.

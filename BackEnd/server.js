import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

import config from './config.js'

import RouterProductos from './router/productos.js'
import RouterPedidos from './router/pedidos.js'
import RouterUsuarios from './router/usuarios.js'
import RouterMensajes from './router/mensajes.js'

import RouterUpload from './router/upload.js'

import CnxMongoDB from './model/DBMongo.js'

import cors from 'cors'
import { guarda } from './router/guarda.js'

const app = express()
const http = createServer(app)
const io = new Server(http, {
    cors: { origin:"*" }
})

// Habilito CORS: peticiones al servidor desde orígenes cruzados
app.use(cors())         

app.use(express.static('public'))

app.use(express.json())


// ------------- Atención de comunicación WebSockets -------------

/* io.on('connection', socket => {
    console.log('Cliente conectado!')
}) */

io.on('connection', new RouterMensajes(io).config())

// -------------- Rutas / endpoints API RESTFUL ------------------

// rutas protegidas
app.use('/api/productos', guarda, new RouterProductos().config())
app.use('/api/pedidos', new RouterPedidos(guarda).config())
app.use('/api/upload', guarda, new RouterUpload().config())

// Rutas de libre acceso
app.use('/api/usuarios', new RouterUsuarios().config())

// Listen del Servidor
if(config.MODO_PERSISTENCIA == 'MONGODB') {
    await CnxMongoDB.conectar()
}

const PORT = config.PORT
const server = http.listen(PORT, () => console.log(`Servidor ApiRestful ECommerce escuchando en http://localhost:${PORT}`))
server.on('error', error => console.log(`Error en servidor: ${error.message}`))



import Controlador from '../controlador/mensajes.js'

class Router {
    constructor(io) {
        this.controlador = new Controlador()
        this.io = io
    }

    config() {
        return async socket => {
            console.log('Cliente conectado!')

            socket.emit('mensajes', await this.controlador.obtenerMensajes())

            socket.on('nuevo-mensaje', async mensaje => {
                console.log(mensaje)

                await this.controlador.guardarMensaje(mensaje)

                this.io.sockets.emit('mensajes', await this.controlador.obtenerMensajes())
            })
        }
    }
}

export default Router

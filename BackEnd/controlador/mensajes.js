import Servicio from '../servicio/mensajes.js'

class Controlador {

    constructor() {
        this.servicio = new Servicio()
    }

    obtenerMensajes = async () => {
        try {
            const mensajes = await this.servicio.obtenerMensajes()
            return mensajes
        }
        catch(error) {
            return {errMsg: error.message}
        }
    }

    guardarMensaje = async mensaje => {
        try {
            if(!Object.keys(mensaje).length) throw new Error('ERROR: No puedo incorporar un pedido vacío')
            const mensajeGuardado = await this.servicio.guardarMensaje(mensaje)
            return mensajeGuardado
        }
        catch(error) {
            return {errMsg: error.message}
        }
    }
}

export default Controlador
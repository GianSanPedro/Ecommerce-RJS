import ModelFactory from '../model/DAO/mensajes/mensajesFactory.js'
import config from '../config.js'

class Servicio {

    constructor() {
        this.model = ModelFactory.get(config.MODO_PERSISTENCIA)
    }

    obtenerMensajes = async _ => {
        const mensajes = await this.model.obtenerMensajes()
        return mensajes
    }

    guardarMensaje = async mensaje => {
        const mensajeGuardado = await this.model.guardarMensaje(mensaje)
        return mensajeGuardado
    }
}

export default Servicio
class ModelMem {

    constructor() {
        this.mensajes = []
    }

    obtenerMensajes = async () => this.mensajes
    
    guardarMensaje = async mensaje => {
        mensaje.id = String(+(this.mensajes[this.mensajes.length - 1]?.id || 0) + 1)

        this.mensajes.push(mensaje)
        return mensaje
    }
}

export default ModelMem
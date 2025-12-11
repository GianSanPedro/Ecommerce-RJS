import CnxMongoDB from "../../DBMongo.js"
import { MensajeModel } from "../models/mensaje.js"

class ModelMongoDB {

    obtenerMensajes = async () => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')
        const mensajes = await MensajeModel.find({})
        return mensajes
    }
    
    guardarMensaje = async mensaje => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')

        const mensajeModel = new MensajeModel(mensaje)
        const mensajeGuardado = await mensajeModel.save()
        return mensajeGuardado
    }
}

export default ModelMongoDB
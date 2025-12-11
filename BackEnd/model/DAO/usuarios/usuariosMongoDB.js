import CnxMongoDB from "../../DBMongo.js"
import { UsuarioModel } from "../models/usuario.js"

class ModelMongoDB {

    obtenerUsuarios = async () => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')
        const usuarios = await UsuarioModel.find({})
        return usuarios
    }
    
    guardarUsuario = async usuario => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')

        const usuarioModel = new UsuarioModel(usuario)
        const usuarioGuardado = await usuarioModel.save()
        return usuarioGuardado
    }
}

export default ModelMongoDB
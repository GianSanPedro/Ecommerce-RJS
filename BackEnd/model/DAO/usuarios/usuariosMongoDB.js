import CnxMongoDB from "../../DBMongo.js"
import { UsuarioModel } from "../models/usuario.js"

class ModelMongoDB {

    obtenerUsuarios = async () => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexion a MongoDB')
        const usuarios = await UsuarioModel.find({})
        return usuarios
    }
    
    guardarUsuario = async usuario => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexion a MongoDB')

        const usuarioModel = new UsuarioModel(usuario)
        const usuarioGuardado = await usuarioModel.save()
        return usuarioGuardado
    }

    actualizarPassword = async (email, passwordHash) => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexion a MongoDB')
        await UsuarioModel.updateOne({ email }, { $set: { password: passwordHash } })
    }
}

export default ModelMongoDB
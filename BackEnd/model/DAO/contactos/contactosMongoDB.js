import CnxMongoDB from "../../DBMongo.js"
import { ContactoModel } from "../models/contacto.js"

class ModelMongoDB {

    obtenerContactos = async () => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexion a MongoDB')
        const contactos = await ContactoModel.find({})
        return contactos
    }
    
    guardarContacto = async contacto => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexion a MongoDB')

        const contactoModel = new ContactoModel(contacto)
        const contactoGuardado = await contactoModel.save()
        return contactoGuardado
    }

    borrarContacto = async id => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexion a MongoDB')
        const contacto = await ContactoModel.findOne({_id: id})
        if(contacto) {
            await ContactoModel.deleteOne({_id: id})
        }
        return contacto || {}
    }

    actualizarPassword = async () => {}
}

export default ModelMongoDB

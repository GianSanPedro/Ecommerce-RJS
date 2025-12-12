import ModelFactory from '../model/DAO/contactos/contactosFactory.js'
import config from '../config.js'
import Joi from 'joi'

const contactoSchema = Joi.object({
    nombre: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    comentario: Joi.string().min(5).max(1000).required(),
    fyh: Joi.string().optional()
})

class Servicio {

    constructor() {
        this.model = ModelFactory.get(config.MODO_PERSISTENCIA)
    }

    obtenerContactos = async _ => {
        const contactos = await this.model.obtenerContactos()
        return contactos
    }

    borrarContacto = async id => {
        const borrado = await this.model.borrarContacto(id)
        return borrado
    }

    guardarContacto = async contacto => {
        const { error } = contactoSchema.validate(contacto)
        if(error) throw new Error(`Error de formato: ${error.details[0].message}`)

        const contactoAGuardar = { ...contacto, fyh: contacto.fyh || new Date().toLocaleString() }
        const contactoGuardado = await this.model.guardarContacto(contactoAGuardar)
        return contactoGuardado
    }
}

export default Servicio

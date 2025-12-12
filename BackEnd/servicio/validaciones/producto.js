import Joi from 'joi'

// IMPORTANTE npm install joi    https://joi.dev/api/?v=17.13.0

const baseSchema = {
    nombre: Joi.string().min(2).max(50),
    precio: Joi.number(),
    stock: Joi.number(),
    marca: Joi.string(),
    categoria: Joi.string(),
    detalles: Joi.string(),
    descripcion: Joi.string().max(500).allow(''),
    foto: Joi.string(),
    envio: Joi.boolean(),
    id: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
    _id: Joi.alternatives().try(Joi.string(), Joi.number()).optional()
}

// Alta: campos obligatorios (excepto id/_id)
const productoSchema = Joi.object(baseSchema).fork(
    ['nombre','precio','stock','marca','categoria','detalles','descripcion','foto','envio'],
    s => s.required()
)

// Update: parcial, sin requeridos
const productoSchemaParcial = Joi.object(baseSchema)

const validar = producto => {
    const { error } = productoSchema.validate(producto, { allowUnknown: true })
    return error
}

export const validarParcial = producto => {
    const { error } = productoSchemaParcial.validate(producto, { allowUnknown: true })
    return error
}

export default validar

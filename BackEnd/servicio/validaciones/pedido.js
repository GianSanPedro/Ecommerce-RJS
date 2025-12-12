import Joi from 'joi'

// Validación de pedidos: usuario, compra (ids de pago), fecha y carrito
export const pedidoSchema = Joi.object({
    usuario: Joi.object({
        nombre: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        admin: Joi.boolean().required()
    }).required(),
    compra: Joi.alternatives().try(
        Joi.object({
            payment_id: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
            status: Joi.string().min(2).max(30).required(),
            merchant_order_id: Joi.alternatives().try(Joi.string(), Joi.number()).required()
        }),
        Joi.object({
            status: Joi.string().valid('pending').required(),
            preference_id: Joi.string().required(),
            back_url: Joi.string().uri().optional()
        })
    ).required(),
    fyh: Joi.string().required(),
    carrito: Joi.array().items(
        Joi.object({
            id: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.object()).required(),
            nombre: Joi.string().min(2).required(),
            precio: Joi.number().positive().required(),
            stock: Joi.number().min(0).required(),
            marca: Joi.string().required(),
            categoria: Joi.string().required(),
            detalles: Joi.string().required(),
            descripcion: Joi.string().allow('', null),
            foto: Joi.string().required(),
            envio: Joi.boolean().required(),
            cantidad: Joi.number().integer().min(1).required()
        })
    ).min(1).required()
})

export default function validarPedido(pedido) {
    const { error, value } = pedidoSchema.validate(pedido, { abortEarly: true })
    return { error, value }
}

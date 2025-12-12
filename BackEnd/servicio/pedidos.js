import ModelFactory from '../model/DAO/pedidos/pedidosFactory.js'
import config from '../config.js'

import { preference } from './pago.js'
import validarPedido from './validaciones/pedido.js'

class Servicio {

    constructor() {
        this.model = ModelFactory.get(config.MODO_PERSISTENCIA)
        this.urlBack = ''
        this.carrito = []
        this.usuario = ''
    }

    obtenerPedidos = async _ => {
        return await this.model.obtenerPedidos()
    }

    guardarPedido = async pedido => {
        const { error } = validarPedido(pedido)
        if(error) throw new Error(`Error de formato en pedido: ${error.details[0].message}`)
        const pedidoGuardado = await this.model.guardarPedido(pedido)
        return pedidoGuardado
    }

    createPreference = async datos => {
        try {
            this.urlBack = datos.urlBack
            this.carrito = datos.carrito
            this.usuario = datos.usuario
            console.log('back_urls enviados a MP:', datos.prefItems?.body?.back_urls)
            const preferences = await preference.create(datos.prefItems)
            // Persisto carrito pendiente en servidor
            try {
                const carritoPendiente = {
                    carrito: this.carrito,
                    usuario: this.usuario,
                    compra: { status: 'pending', preference_id: preferences.id, back_url: this.urlBack },
                    fyh: new Date().toLocaleString()
                }
                await this.guardarPedido(carritoPendiente)
            }
            catch(errPendiente) {
                console.error('No se pudo persistir carrito pendiente:', errPendiente.message)
            }
            return preferences.id
        }
        catch(error) {
            console.log(`Error al crear preferences: ${error.message}`)
            return null
        }
    }

    feedback = async result => {
        const { payment_id, status, merchant_order_id } = result
        
        if(status == 'approved') {
            const pedido = {compra: result, carrito: this.carrito, usuario: this.usuario, fyh: new Date().toLocaleString()}
            await this.guardarPedido(pedido)
        }
        return `${this.urlBack}?payment_id=${payment_id}&status=${status}&merchant_order_id=${merchant_order_id}`
    }
}

export default Servicio

import ModelFactory from '../model/DAO/productos/productosFactory.js'
import config from '../config.js'

import validar from './validaciones/producto.js'


class Servicio {

    constructor() {
        this.model = ModelFactory.get(config.MODO_PERSISTENCIA)
    }

    obtenerProductos = async id => {
        if(id) return await this.model.obtenerProducto(id)
        else return await this.model.obtenerProductos()
    }

    guardarProducto = async producto => {
        const error = validar(producto)
        if(error) throw new Error(`Error de formato en campos del producto: ${error.details[0].message}`)
        const productoGuardado = await this.model.guardarProducto(producto)
        return productoGuardado
    }

    actualizarProducto = async (id, producto) => {
        const productoActualizado = await this.model.actualizarProducto(id,producto)
        return productoActualizado
    }

    borrarProducto = async id => {
        const productoEliminado = await this.model.borrarProducto(id)
        return productoEliminado
    }
}

export default Servicio
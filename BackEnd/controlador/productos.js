import Servicio from '../servicio/productos.js'

class Controlador {

    constructor() {
        this.servicio = new Servicio()
    }

    obtenerProductos = async (req, res) => {
        try {
            const { id } = req.params
            const productos = await this.servicio.obtenerProductos(id)
            res.json(productos)
        }
        catch(error) {
            res.status(500).json({errMsg: error.message})
        }
    }

    guardarProducto = async (req, res) => {
        try {
            const producto = req.body
            if(!Object.keys(producto).length) throw new Error('ERROR: No puedo incorporar un producto vacío')
            const productoGuardado = await this.servicio.guardarProducto(producto)
            res.json(productoGuardado)
        }
        catch(error) {
            res.status(500).json({errMsg: error.message})
        }
    }

    actualizarProducto = async (req, res) => {
        try {
            const { id } = req.params
            const producto = req.body
            const productoActualizado = await this.servicio.actualizarProducto(id, producto)
            res.json(productoActualizado)
        }
        catch(error) {
            res.status(500).json({errMsg: error.message})
        }
    }

    borrarProducto = async (req, res) => {
        try {
            const { id } = req.params
            const productoEliminado = await this.servicio.borrarProducto(id)
            res.json(productoEliminado)
        }
        catch(error) {
            res.status(500).json({errMsg: error.message})
        }
    }
}

export default Controlador
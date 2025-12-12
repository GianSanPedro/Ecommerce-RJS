import express from 'express'

import Controlador from '../controlador/productos.js'

class Router {
    constructor(guarda, soloAdmin) {
        this.router = express.Router()
        this.controlador = new Controlador()
        this.guarda = guarda
        this.soloAdmin = soloAdmin
    }

    config() {
        // Público: listado/detalle
        this.router.get('/:id?', this.controlador.obtenerProductos )
        // Admin: CRUD
        this.router.post('/', this.guarda, this.soloAdmin, this.controlador.guardarProducto )
        this.router.put('/:id', this.guarda, this.soloAdmin, this.controlador.actualizarProducto )
        this.router.delete('/:id', this.guarda, this.soloAdmin, this.controlador.borrarProducto )

        return this.router
    }
}

export default Router

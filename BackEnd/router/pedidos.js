import express from 'express'

import Controlador from '../controlador/pedidos.js'

class Router {
    constructor(guarda) {
        this.router = express.Router()
        this.controlador = new Controlador()
        this.guarda = guarda
    }

    config() {
        this.router.get('/', this.guarda, this.controlador.obtenerPedidos )
        this.router.post('/', this.guarda, this.controlador.guardarPedido )
        this.router.post('/mp/create_preference', this.guarda, this.controlador.createPreference )
        this.router.get('/mp/feedback', this.controlador.feedback)

        return this.router
    }
}

export default Router

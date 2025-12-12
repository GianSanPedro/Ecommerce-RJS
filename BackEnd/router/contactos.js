import express from 'express'
import Controlador from '../controlador/contactos.js'

class Router {
    constructor(guarda) {
        this.router = express.Router()
        this.controlador = new Controlador()
        this.guarda = guarda
    }

    config() {
        // Publico: enviar contacto
        this.router.post('/', this.controlador.guardarContacto )
        // Protegido: listar contactos
        this.router.get('/', this.guarda, this.controlador.obtenerContactos )
        // Protegido: borrar contacto
        this.router.delete('/:id', this.guarda, this.controlador.borrarContacto )
        return this.router
    }
}

export default Router

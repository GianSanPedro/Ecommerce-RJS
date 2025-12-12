import express from 'express'
import Controlador from '../controlador/contactos.js'

class Router {
    constructor(guarda, soloAdmin) {
        this.router = express.Router()
        this.controlador = new Controlador()
        this.guarda = guarda
        this.soloAdmin = soloAdmin
    }

    config() {
        // Publico: enviar contacto
        this.router.post('/', this.controlador.guardarContacto )
        // Protegido admin: listar contactos
        this.router.get('/', this.guarda, this.soloAdmin, this.controlador.obtenerContactos )
        // Protegido admin: borrar contacto
        this.router.delete('/:id', this.guarda, this.soloAdmin, this.controlador.borrarContacto )
        return this.router
    }
}

export default Router

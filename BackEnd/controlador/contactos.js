import Servicio from '../servicio/contactos.js'

class Controlador {

    constructor() {
        this.servicio = new Servicio()
    }

    obtenerContactos = async (req, res) => {
        try {
            const contactos = await this.servicio.obtenerContactos()
            res.json(contactos)
        }
        catch(error) {
            res.status(500).json({errMsg: error.message})
        }
    }

    borrarContacto = async (req, res) => {
        try {
            const { id } = req.params
            const contactoEliminado = await this.servicio.borrarContacto(id)
            res.json(contactoEliminado)
        }
        catch(error) {
            res.status(500).json({errMsg: error.message})
        }
    }

    guardarContacto = async (req, res) => {
        try {
            const contacto = req.body
            const contactoGuardado = await this.servicio.guardarContacto(contacto)
            res.json(contactoGuardado)
        }
        catch(error) {
            res.status(400).json({errMsg: error.message})
        }
    }
}

export default Controlador

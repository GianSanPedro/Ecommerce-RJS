import Servicio from '../servicio/usuarios.js'
import jwt from 'jsonwebtoken';

class Controlador {

    constructor() {
        this.servicio = new Servicio()
    }

    loginUsuario = async (req, res) => {
        try {
            const credenciales = req.body
            const usuarioLogueado = await this.servicio.loginUsuario(credenciales)
            res.json(usuarioLogueado)
        }
        catch(error) {
            res.status(500).json({errMsg: error.message})
        }
    }

    loginVisitante = async (req, res) => {
        try {
            const VisitanteLogueado = await this.servicio.loginVisitante()
            res.json(VisitanteLogueado)
            console.log(VisitanteLogueado)
        }
        catch(error) {
            res.status(500).json({errMsg: error.message})
        }
    }

    registerUsuario = async (req, res) => {
        try {
            const credenciales = req.body
            //console.log(credenciales)
            if(!Object.keys(credenciales).length) throw new Error('ERROR: No puedo incorporar un pedido vacío')
            const usuarioRegistrado = await this.servicio.registerUsuario(credenciales)
            res.json(usuarioRegistrado)
        }
        catch(error) {
            res.status(500).json({errMsg: error.message})
        }
    }

    validarToken = async (req, res) => {
        try {
            const datos = req.body
            const rta = await this.servicio.validarToken(datos)
            res.json(rta)
        }
        catch(error) {
            res.status(500).json({errMsg: error.message})
        }
    }

    
    tokenVisitante = async (req, res) => {
        try {
            const datos = req.body
            const rta = await this.servicio.validarToken(datos)
            res.json(rta)
        }
        catch(error) {
            res.status(500).json({errMsg: error.message})
        }
    }

}

export default Controlador
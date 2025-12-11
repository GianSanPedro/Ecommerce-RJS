import Servicio from '../servicio/pedidos.js'

class Controlador {

    constructor() {
        this.servicio = new Servicio()
    }

    obtenerPedidos = async (req, res) => {
        try {
            const pedidos = await this.servicio.obtenerPedidos()
            res.json(pedidos)
        }
        catch(error) {
            res.status(500).json({errMsg: error.message})
        }
    }

    guardarPedido = async (req, res) => {
        try {
            const pedido = req.body
            if(!Object.keys(pedido).length) throw new Error('ERROR: No puedo incorporar un pedido vacío')
            const pedidoGuardado = await this.servicio.guardarPedido(pedido)
            res.json(pedidoGuardado)
        }
        catch(error) {
            res.status(500).json({errMsg: error.message})
        }
    }

    createPreference = async (req,res) => {
        try {
            const datos = req.body
            if(!Object.keys(datos).length) throw new Error('ERROR: datos está vacío')
            const preferenceId = await this.servicio.createPreference(datos)
            res.json(preferenceId)
        }
        catch(error) {
            res.status(500).json({errMsg: error.message})
        }
    }
    
    feedback = async (req,res) => {
        const result = req.query
        //console.log(result)
        const urlRta = await this.servicio.feedback(result)
        res.redirect(urlRta)
    }
}

export default Controlador
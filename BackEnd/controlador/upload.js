import Servicio from '../servicio/upload.js'

class Controlador {

    constructor() {
        this.servicio = new Servicio()
    }

    recibirArchivo = async (req, res) => {
        try {
            const file = req.file
            if(!file) return res.status(400).json({errMsg: 'Archivo requerido o tipo/tamano no permitido'})
            const urlFotoFTP = await this.servicio.guardarArchivoFTP(file)
            res.json({urlFotoFTP})
        }
        catch(error) {
            res.status(502).json({errMsg: error.message})
        }
    }
}

export default Controlador

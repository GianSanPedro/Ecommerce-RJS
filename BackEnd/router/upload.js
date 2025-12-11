import express from 'express'
import Controlador from '../controlador/upload.js'
import multer from 'multer'

//IMPORTANTE npm install multer    https://www.npmjs.com/package/multer

const storage = multer.diskStorage({
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
    destination: function(req, file, cb) {
        cb(null, './uploads')
    }
})

const upload = multer({ storage: storage })

class Router {
    constructor() {
        this.router = express.Router()
        this.controlador = new Controlador()
    }

    config() {
        this.router.post('/', upload.single('archivo'), this.controlador.recibirArchivo )

        return this.router
    }
}

export default Router

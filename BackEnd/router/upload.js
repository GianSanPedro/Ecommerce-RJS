import express from 'express'
import Controlador from '../controlador/upload.js'
import multer from 'multer'

//IMPORTANTE npm install multer    https://www.npmjs.com/package/multer

const FILE_SIZE_LIMIT = 5 * 1024 * 1024   // 5MB
const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const storage = multer.diskStorage({
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
    destination: function(req, file, cb) {
        cb(null, './media')
    }
})

const upload = multer({ 
    storage: storage,
    limits: { fileSize: FILE_SIZE_LIMIT },
    fileFilter: function(req, file, cb) {
        if(allowedMime.includes(file.mimetype)) return cb(null, true)
        cb(new Error('Tipo de archivo no permitido'))
    }
})

class Router {
    constructor() {
        this.router = express.Router()
        this.controlador = new Controlador()
    }

    config() {
        const singleUpload = upload.single('archivo')

        this.router.post('/', (req,res,next) => {
            singleUpload(req,res, err => {
                if(err) return res.status(400).json({errMsg: err.message})
                next()
            })
        }, this.controlador.recibirArchivo )

        return this.router
    }
}

export default Router

import jwt from 'jsonwebtoken'
import config from '../config.js'

export const guarda = (req, res, next) => {
    const token = req.headers['access-token']

    if(token) {
        jwt.verify(token, config.LLAVE, (error, decoded) => {
            if(error) {
                res.json({ error: true, mensaje: 'Token no válida'})
            }
            else {
                req.decoded = decoded
                next()
            }
        })
    }
    else {
        res.json({ error: true, mensaje: 'Token no provista'})
    }
}
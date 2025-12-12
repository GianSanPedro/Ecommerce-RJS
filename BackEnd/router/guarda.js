import jwt from 'jsonwebtoken'
import config from '../config.js'

export const guarda = (req, res, next) => {
    const token = req.headers['access-token']

    if(token) {
        jwt.verify(token, config.LLAVE, (error, decoded) => {
            if(error) {
                return res.status(401).json({ error: true, mensaje: 'Token no valida'})
            }
            req.decoded = decoded
            next()
        })
    }
    else {
        return res.status(401).json({ error: true, mensaje: 'Token no provista'})
    }
}
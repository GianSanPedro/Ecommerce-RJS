import ModelFactory from '../model/DAO/usuarios/usuariosFactory.js'
import config from '../config.js'
import jwt from 'jsonwebtoken'

// https://www.npmjs.com/package/jsonwebtoken
// npm i jsonwebtoken
// https://jwt.io/
// https://www.jstoolset.com/jwt

class Servicio {

    constructor() {
        this.model = ModelFactory.get(config.MODO_PERSISTENCIA)
    }

    loginUsuario = async credenciales => {
        //console.log(credenciales)
        const usuarios = await this.model.obtenerUsuarios()
        //console.log(usuarios)
        const usuarioLogueadoOK = usuarios.filter(u => u.email === credenciales.email && u.password === credenciales.password)
        //console.log(usuarioLogueadoOK)

        if(usuarioLogueadoOK.length === 1) {
            const { nombre, email, admin } = usuarioLogueadoOK[0]
            const usuario = { nombre, email, admin } 

            const payload = {
                usuario
            }
            const token = jwt.sign(payload, config.LLAVE, { expiresIn: 1200 } )
            //console.log(token)

            return { status: 'loginOk', usuario, token }
        }
        else {
            return { status: 'loginError' }
        }
    }

    loginVisitante = async () => {
        const usuario = {
            nombre: "Visitante",
            email: "Visitante@Visitante",
            admin: false
        };
            
        const payload = {
            usuario
        }
        const token = jwt.sign(payload, config.LLAVE, { expiresIn: 12000 } )
        console.log('VISITANTE TOKEN', token)

        return { status: 'loginOk', usuario, token }
    }

    registerUsuario = async credenciales => {
        //console.log(credenciales)
        const usuarioRegistrado = await this.model.guardarUsuario(credenciales)
        return usuarioRegistrado
    }

    validarToken = async datos => {
        const { token } = datos
        let rta = {}

        if(token) {
            jwt.verify(token, config.LLAVE, (error, decoded) => {
                if(error) {
                    rta = { error: true, mensaje: 'Token no válida'}
                }
                else {
                    rta = { decoded }
                }
            })
        }
        else {
            rta = { error: true, mensaje: 'Token no provista'}
        }        
        return rta
    }

}

export default Servicio
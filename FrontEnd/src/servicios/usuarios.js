import axios from "axios"

const url = process.env.NODE_ENV === 'production'
            ? '/api/usuarios/'                                                         // en producción
            : `http://localhost:${process.env.REACT_APP_PORT_SRV_DEV}/api/usuarios/`   // en desarrollo


export const login = async credenciales => (await axios.post(url+'login', credenciales)).data
export const loginVisitante = async credenciales => (await axios.post(url+'loginVisitante')).data
export const register = async credenciales => (await axios.post(url+'register', credenciales)).data
export const validarToken = async token => (await axios.post(url+'token', { token })).data

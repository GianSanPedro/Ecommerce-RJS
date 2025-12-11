import axios from "axios"
import { setHeader } from "./token"

//console.log('process.env.REACT_APP_PORT_SRV_DEV:', process.env.REACT_APP_PORT_SRV_DEV)
console.warn('process.env.NODE_ENV:', process.env.NODE_ENV)

const url = process.env.NODE_ENV === 'production'
            ? '/api/productos/'                                                         // en producción
            : `http://localhost:${process.env.REACT_APP_PORT_SRV_DEV}/api/productos/`   // en desarrollo


export const proxyProducto = producto => {
    const handler = {
        get: function(target, prop, receiver) {
            if(prop === 'id') prop = '_id'

            return target[prop]
        }
    }

    return new Proxy(producto, handler)
}

const eliminarPropiedad = (obj, prop) => {
    const objClon = {...obj}
    delete objClon[prop]
    return objClon
}

export const getAll = async _ => {
    try {
        return (await axios.get(url, setHeader())).data.map(p => proxyProducto(p))
    }
    catch(error) {
        console.error('Error en getAll productos:', error.message )
        return []
    }
}

export const guardar = async prod => {
    console.log('Datos enviados al servidor:', prod);
    try {
        return proxyProducto((await axios.post(url, prod, setHeader())).data)
    }
    catch(error) {
        console.error('Error en guardar producto:', error.message )
        return {}
    }
}
    
    
export const actualizar = async (id, prod) => {
    try {
        return proxyProducto((await axios.put(url+id, eliminarPropiedad(prod, '_id'), setHeader())).data)
    }
    catch(error) {
        console.error('Error en actualizar producto:', error.message )
        return {}
    }
}

export const eliminar = async id => {
    try {
        return proxyProducto((await axios.delete(url+id, setHeader())).data)
    }
    catch(error) {
        console.error('Error en eliminar producto:', error.message )
        return {}
    }
}

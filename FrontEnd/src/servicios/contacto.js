import axios from "axios"
import { setHeader } from "./token"

const url = process.env.NODE_ENV === 'production'
            ? '/api/contacto/'                                                         // en produccion
            : `http://localhost:${process.env.REACT_APP_PORT_SRV_DEV || 8080}/api/contacto/`   // en desarrollo

export const enviar = async datos => {
    try {
        const { data } = await axios.post(url, datos)
        return data
    }
    catch(error) {
        console.error('Error al enviar contacto:', error.message)
        throw error
    }
}

export const getAll = async () => {
    try {
        const { data } = await axios.get(url, setHeader())
        return data
    }
    catch(error) {
        console.error('Error al obtener contactos:', error.message)
        return []
    }
}

export const eliminar = async id => {
    try {
        const { data } = await axios.delete(url + id, setHeader())
        return data
    }
    catch(error) {
        console.error('Error al eliminar contacto:', error.message)
        return null
    }
}

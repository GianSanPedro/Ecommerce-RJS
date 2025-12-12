import axios from "axios"
import { setHeader } from "./token"

const url = process.env.NODE_ENV === 'production'
            ? '/api/pedidos/'                                                         // en produccion
            : `http://localhost:${process.env.REACT_APP_PORT_SRV_DEV || 8080}/api/pedidos/`   // en desarrollo (fallback 8080)

export async function getPreferenceId(carrito, usuario) {
    const urlBack = window.location.origin + '/#/carrito'

    const prefItems = {
        body: {
            items: carrito.map(p => ({
                id: p._id,
                title: p.nombre,
                currency_id: "ARS",
                picture_url: p.foto,
                description: p.detalles,
                category_id: p.categoria,
                quantity: parseInt(p.cantidad),
                unit_price: +p.precio
            })),
            back_urls: {
                // usamos la ruta del frontend para evitar bloqueos de MP con localhost:8080
                success: urlBack,
                failure: urlBack,
                pending: urlBack
            }
        }
    }

    const datos = {urlBack, carrito, usuario, prefItems}
    console.log(datos)

    const {data:preferenceId} = await axios.post(url + 'mp/create_preference', datos, setHeader())
    return preferenceId
}

export async function guardarPedido(carrito, usuario, compra) {
    try {
        const pedido = { carrito, usuario, compra, fyh: new Date().toLocaleString() }
        const { data } = await axios.post(url, pedido, setHeader())
        return data
    }
    catch(error) {
        console.error('Error al guardar pedido:', error.message)
        return null
    }
}
import axios from "axios"
import { setHeader } from "./token"

const url = process.env.NODE_ENV === 'production'
            ? '/api/pedidos/'                                                         // en producción
            : `http://localhost:${process.env.REACT_APP_PORT_SRV_DEV}/api/pedidos/`   // en desarrollo


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
                success: url + 'mp/feedback',
                failure: url + 'mp/feedback',
                pending: url + 'mp/feedback'
            },
            auto_return: "approved",
        }
    }

    const datos = {urlBack, carrito, usuario, prefItems}
    console.log(datos)

    const {data:preferenceId} = await axios.post(url + 'mp/create_preference', datos, setHeader())
    return preferenceId
}

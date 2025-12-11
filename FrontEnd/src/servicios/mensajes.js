import { io } from 'socket.io-client'

const url = process.env.NODE_ENV === 'production'
            ? '/'                                                         // en producción
            : `http://localhost:${process.env.REACT_APP_PORT_SRV_DEV}/`   // en desarrollo


let socket

export const conectar = () => {
    socket = io(url)
    console.log('Conectando a WebSocket ... OK', socket)
}

export const enviarMensaje = (canal, mensaje) => {
    if(socket) socket.emit(canal, mensaje)
}

export const suscribirAlCanal = (canal, cb) => {
    if(!socket) {
        console.error('socket no inicializado')
        return null
    }
    socket.on(canal, cb)
}

export const desconectar = () => {
    if(socket) {
        console.log('Desconectando de WebSocket ... OK')
        socket.disconnect()
    }
}

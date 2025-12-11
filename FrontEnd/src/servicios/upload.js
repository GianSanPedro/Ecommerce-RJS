import { getToken } from "./token"

const url = process.env.NODE_ENV === 'production'
            ? '/api/upload/'                                                         // en producción
            : `http://localhost:${process.env.REACT_APP_PORT_SRV_DEV}/api/upload/`   // en desarrollo


export function enviarFormDataAjax(data, progress, urlfoto) {
    let porcentaje = 0

    const xhr = new XMLHttpRequest()
    xhr.open('post', url)

    xhr.addEventListener('load', () => {
        if(xhr.status === 200) {
            const rta = JSON.parse(xhr.response)
            console.log(rta)
            
            const url = rta.urlFotoFTP
            if(typeof urlfoto === 'function') urlfoto(url)
        }
    })
    
    xhr.upload.addEventListener('progress', e => {
        if(e.lengthComputable) {
            porcentaje = parseInt((e.loaded * 100) / e.total )
            if(typeof progress === 'function') progress(porcentaje)
        }
    })

    xhr.setRequestHeader('access-token', getToken())
    xhr.send(data)
}
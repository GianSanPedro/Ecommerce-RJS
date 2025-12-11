import { LOGIN, USUARIO_LOGUEADO } from "./types"

export const accionSetLogin = estado => {
    console.warn('ACTION -> accionSetLogin', estado)

    return {
        type: LOGIN,
        estado
    }
}

export const accionSetUsuarioLogueado = usuario => {
    console.warn('ACTION -> accionSetUsuarioLogueado', usuario)

    return {
        type: USUARIO_LOGUEADO,
        usuario
    }
}
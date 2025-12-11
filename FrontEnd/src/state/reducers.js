import { LOGIN, USUARIO_LOGUEADO } from "./types"

export const loginReducer = (state, action) => {
    console.warn('REDUCER -> loginReducer', state, action)

    switch(action.type) {
        case LOGIN:
            //state.login = action.estado     // NO!!!!!!!! (porque modifico un argumento de entrada: no cumpliría con función pura)
            //return state
            return { ...state, login: action.estado }   // SPREAD OPERATOR + Object Merge

        case USUARIO_LOGUEADO:
            //state.usuarioLogueado = action.usuario     // NO!!!!!!!! (porque modifico un argumento de entrada: no cumpliría con función pura)
            //return state
            return { ...state, usuarioLogueado: action.usuario }   // SPREAD OPERATOR + Object Merge

        default:
            return state
    }
}
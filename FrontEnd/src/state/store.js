import { configureStore } from "@reduxjs/toolkit"
import { loginReducer } from "./reducers"

// --------------------- Redux -------------------------
// doc: https://es.redux.js.org/
// instalación: npm i redux react-redux @reduxjs/toolkit
// -----------------------------------------------------

export const store = configureStore({
    reducer: loginReducer,         // reducer
    preloadedState: {              // state (estado global)
        login: false,
        usuarioLogueado: {}
    },
    //middleware: () => [],          // para conectar funciones al patrón redux que permitan ejecutar código asincrónico
    
    //Redux Dev Tools: https://chromewebstore.google.com/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=es
    devTools: true
})
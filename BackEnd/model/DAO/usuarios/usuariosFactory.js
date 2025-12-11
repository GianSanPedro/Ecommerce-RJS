import ModelMem from "./usuariosMem.js";
import ModelMongoDB from "./usuariosMongoDB.js";

class ModelFactory {
    static get(tipo) {
        switch(tipo) {
            case 'MEM':
                console.log('**** Usuarios Persistiendo en Memoria ****')
                return new ModelMem()

            case 'MONGODB':
                console.log('**** Usuarios Persistiendo en Database MongoDB ****')
                return new ModelMongoDB()

            default:
                console.log('**** Usuarios Persistiendo en Memoria (default) ****')
                return new ModelMem()
        }
    }
}

export default ModelFactory
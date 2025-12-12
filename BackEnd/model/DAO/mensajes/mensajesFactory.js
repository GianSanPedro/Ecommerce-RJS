import ModelMem from "./mensajesMem.js";
import ModelMongoDB from "./mensajesMongoDB.js";
import ModelFile from "./mensajesFile.js";

class ModelFactory {
    static get(tipo) {
        switch(tipo) {
            case 'MEM':
                console.log('**** Mensajes Persistiendo en Memoria ****')
                return new ModelMem()

            case 'FILE':
                console.log('**** Mensajes Persistiendo en FileSystem ****')
                return new ModelFile()

            case 'MONGODB':
                console.log('**** Mensajes Persistiendo en Database MongoDB ****')
                return new ModelMongoDB()

            default:
                console.log('**** Mensajes Persistiendo en Memoria (default) ****')
                return new ModelMem()
        }
    }
}

export default ModelFactory

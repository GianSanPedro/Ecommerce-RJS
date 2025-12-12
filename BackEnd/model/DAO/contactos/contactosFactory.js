import ModelMem from "./contactosMem.js";
import ModelMongoDB from "./contactosMongoDB.js";
import ModelFile from "./contactosFile.js";

class ModelFactory {
    static get(tipo) {
        switch(tipo) {
            case 'MEM':
                console.log('**** Contactos Persistiendo en Memoria ****')
                return new ModelMem()

            case 'FILE':
                console.log('**** Contactos Persistiendo en FileSystem ****')
                return new ModelFile()

            case 'MONGODB':
                console.log('**** Contactos Persistiendo en Database MongoDB ****')
                return new ModelMongoDB()

            default:
                console.log('**** Contactos Persistiendo en Memoria (default) ****')
                return new ModelMem()
        }
    }
}

export default ModelFactory

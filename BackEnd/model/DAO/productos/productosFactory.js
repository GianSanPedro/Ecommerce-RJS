import ModelFile from "./productosFile.js";
import ModelMem from "./productosMem.js";
import ModelMongoDB from "./productosMongoDB.js";

class ModelFactory {
    static get(tipo) {
        switch(tipo) {
            case 'MEM':
                console.log('**** Productos Persistiendo en Memoria ****')
                return new ModelMem()

            case 'FILE':
                console.log('**** Productos Persistiendo en FileSystem ****')
                return new ModelFile()

            case 'MONGODB':
                console.log('**** Productos Persistiendo en Database MongoDB ****')
                return new ModelMongoDB()

            default:
                console.log('**** Productos Persistiendo en Memoria (default) ****')
                return new ModelMem()
        }
    }
}

export default ModelFactory
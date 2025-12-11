//https://www.npmjs.com/package/mongoose
//https://mongoosejs.com/
// IMPORTANTE npm install mongoose

import mongoose from 'mongoose'
import config from '../config.js'

class CnxMongoDB {
    static connectionOK = false

    static conectar = async _ => {
        try {
            console.log('-> Conectando a la base de datos (mongoose)...')
            await mongoose.connect(config.STRCNX + config.BASE)
            console.log('[OK] base de datos conectada!')

            CnxMongoDB.connectionOK = true
        }
        catch(error) {
            console.log(`[ERROR] Error en conexión de base de datos: ${error.message}`)
        }
    }
}

export default CnxMongoDB


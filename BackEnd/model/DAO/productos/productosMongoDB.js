import CnxMongoDB from "../../DBMongo.js"
import { ProductoModel } from "../models/producto.js"

class ModelMongoDB {

    obtenerProductos = async () => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')
        const productos = await ProductoModel.find({})
        return productos
    }
    
    obtenerProducto = async id => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')
        const producto = await ProductoModel.findOne({_id: id})
        return producto
    }

    guardarProducto = async producto => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')

        const productoModel = new ProductoModel(producto)
        const productoGuardado = await productoModel.save()
        return productoGuardado
    }

    actualizarProducto = async (id, producto) => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')

        await ProductoModel.updateOne(
            {_id: id }, 
            { $set: producto }
        )
        const productoActualizado = await this.obtenerProducto(id)
        return productoActualizado
    }

    borrarProducto = async id => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')

        const productoBorrado = await this.obtenerProducto(id)
        await ProductoModel.deleteOne({_id: id})
        return productoBorrado
    }
}

export default ModelMongoDB
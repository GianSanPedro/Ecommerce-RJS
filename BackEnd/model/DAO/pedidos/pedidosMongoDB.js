import CnxMongoDB from "../../DBMongo.js"
import { PedidoModel } from "../models/pedido.js"

class ModelMongoDB {

    obtenerPedidos = async () => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')
        const pedidos = await PedidoModel.find({})
        return pedidos
    }
    
    guardarPedido = async pedido => {
        if(!CnxMongoDB.connectionOK) throw new Error('[ERROR] DAO sin conexión a MongoDB')

        const pedidoModel = new PedidoModel(pedido)
        const pedidoGuardado = await pedidoModel.save()
        return pedidoGuardado
    }
}

export default ModelMongoDB
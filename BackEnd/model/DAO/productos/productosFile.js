import fs from 'fs'

class ModelFile {

    constructor() {
        this.nombreArchivo = 'productos.json'
    }

    leerArchivo = async nombre => {
        let productos = []
        try {
            productos = JSON.parse(await fs.promises.readFile(nombre, 'utf-8'))
        }
        catch {}

        return productos
    }

    escribirArchivo = async (nombre, productos) => {
        await fs.promises.writeFile(nombre, JSON.stringify(productos, null, '\t'))
    }

    obtenerProductos = async () => {
        const productos = await this.leerArchivo(this.nombreArchivo)
        return productos
    }

    obtenerProducto = async id => {
        const productos = await this.leerArchivo(this.nombreArchivo)    
        const producto = productos.find(producto => producto.id === id)
        return producto || {}    
    }

    guardarProducto = async producto => {
        const productos = await this.leerArchivo(this.nombreArchivo)

        producto.id = String(+(productos[productos.length-1]?.id || 0) + 1)
        productos.push(producto)

        await this.escribirArchivo(this.nombreArchivo, productos)

        return producto
    }

    actualizarProducto = async (id,producto) => {
        const productos = await this.leerArchivo(this.nombreArchivo)

        producto.id = id

        const index = productos.findIndex(p => p.id === id)
        const productoAnt = productos[index]
        const productoNuevo = {...productoAnt, ...producto}

        productos.splice(index, 1, productoNuevo)

        await this.escribirArchivo(this.nombreArchivo, productos)

        return productoNuevo
    }

    borrarProducto = async id => {
        const productos = await this.leerArchivo(this.nombreArchivo)

        let productoEliminado = {}

        const index = productos.findIndex(p => p.id === id)

        if(index != -1) {
            productoEliminado = productos.splice(index, 1)[0]
            await this.escribirArchivo(this.nombreArchivo, productos)
        }
        return productoEliminado
    }
}

export default ModelFile
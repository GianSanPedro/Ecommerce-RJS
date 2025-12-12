import fs from 'fs'

class ModelFile {

    constructor() {
        this.nombreArchivo = 'mensajes.json'
    }

    leerArchivo = async nombre => {
        let mensajes = []
        try {
            mensajes = JSON.parse(await fs.promises.readFile(nombre, 'utf-8'))
        }
        catch {}
        return mensajes
    }

    escribirArchivo = async (nombre, mensajes) => {
        await fs.promises.writeFile(nombre, JSON.stringify(mensajes, null, '\t'))
    }

    obtenerMensajes = async () => {
        const mensajes = await this.leerArchivo(this.nombreArchivo)
        return mensajes
    }
    
    guardarMensaje = async mensaje => {
        const mensajes = await this.leerArchivo(this.nombreArchivo)
        mensaje.id = String(+(mensajes[mensajes.length - 1]?.id || 0) + 1)
        mensajes.push(mensaje)
        await this.escribirArchivo(this.nombreArchivo, mensajes)
        return mensaje
    }
}

export default ModelFile

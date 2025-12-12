import fs from 'fs'

class ModelFile {

    constructor() {
        this.nombreArchivo = 'contactos.json'
    }

    leerArchivo = async nombre => {
        let contactos = []
        try {
            contactos = JSON.parse(await fs.promises.readFile(nombre, 'utf-8'))
        }
        catch {}
        return contactos
    }

    escribirArchivo = async (nombre, contactos) => {
        await fs.promises.writeFile(nombre, JSON.stringify(contactos, null, '\t'))
    }

    obtenerContactos = async () => {
        const contactos = await this.leerArchivo(this.nombreArchivo)
        return contactos
    }
    
    guardarContacto = async contacto => {
        const contactos = await this.leerArchivo(this.nombreArchivo)
        contacto.id = String(+(contactos[contactos.length - 1]?.id || 0) + 1)
        contactos.push(contacto)
        await this.escribirArchivo(this.nombreArchivo, contactos)
        return contacto
    }

    borrarContacto = async id => {
        const contactos = await this.leerArchivo(this.nombreArchivo)
        const idx = contactos.findIndex(c => c.id === id)
        let eliminado = {}
        if(idx !== -1) {
            eliminado = contactos.splice(idx,1)[0]
            await this.escribirArchivo(this.nombreArchivo, contactos)
        }
        return eliminado
    }
}

export default ModelFile

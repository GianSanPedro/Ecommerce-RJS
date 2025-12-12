class ModelMem {

    constructor() {
        this.contactos = []
    }

    obtenerContactos = async () => this.contactos
    
    guardarContacto = async contacto => {
        contacto.id = String(+(this.contactos[this.contactos.length - 1]?.id || 0) + 1)

        this.contactos.push(contacto)
        return contacto
    }

    borrarContacto = async id => {
        const idx = this.contactos.findIndex(c => c.id === id)
        let eliminado = {}
        if(idx !== -1) {
            eliminado = this.contactos.splice(idx,1)[0]
        }
        return eliminado
    }
}

export default ModelMem

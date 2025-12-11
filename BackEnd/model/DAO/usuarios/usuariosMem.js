class ModelMem {

    constructor() {
        this.usuarios = []
    }

    obtenerUsuarios = async () => this.usuarios
    
    guardarUsuario = async usuario => {
        usuario.id = String(+(this.usuarios[this.usuarios.length - 1]?.id || 0) + 1)

        this.usuarios.push(usuario)
        return usuario
    }
}

export default ModelMem
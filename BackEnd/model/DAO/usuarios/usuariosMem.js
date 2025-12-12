import bcrypt from "bcryptjs"

class ModelMem {

    constructor() {
        // Usuarios de prueba con passwords hasheadas (solo entorno MEM)
        this.usuarios = [
            { id: '1', nombre: 'Admin',    email: 'admin@test.com',   password: bcrypt.hashSync('admin123', 10),  admin: true  },
            { id: '2', nombre: 'Cliente1', email: 'cliente1@test.com', password: bcrypt.hashSync('cliente123', 10), admin: false },
            { id: '3', nombre: 'Cliente2', email: 'cliente2@test.com', password: bcrypt.hashSync('cliente123', 10), admin: false },
        ]
    }

    obtenerUsuarios = async () => this.usuarios
    
    guardarUsuario = async usuario => {
        usuario.id = String(+(this.usuarios[this.usuarios.length - 1]?.id || 0) + 1)

        this.usuarios.push(usuario)
        return usuario
    }

    actualizarPassword = async (email, passwordHash) => {
        const idx = this.usuarios.findIndex(u => u.email === email)
        if(idx !== -1) {
            this.usuarios[idx].password = passwordHash
        }
    }
}

export default ModelMem
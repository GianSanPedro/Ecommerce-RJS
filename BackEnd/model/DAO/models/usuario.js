import mongoose from "mongoose";

const usuarioSchema = mongoose.Schema({
    nombre: String,
    email: String,
    password: String,
    admin: Boolean
}, { versionKey: false })

export const UsuarioModel = mongoose.model('usuarios', usuarioSchema)
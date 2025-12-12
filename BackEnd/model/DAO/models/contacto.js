import mongoose from "mongoose";

const contactoSchema = mongoose.Schema({
    nombre: String,
    email: String,
    comentario: String,
    fyh: String
}, { versionKey: false })

export const ContactoModel = mongoose.model('contactos', contactoSchema)

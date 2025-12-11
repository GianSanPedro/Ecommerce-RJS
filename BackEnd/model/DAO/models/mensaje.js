import mongoose from "mongoose";

const mensajeSchema = mongoose.Schema({
    autor: String,
    texto: String,
    admin: Boolean,
    fyh: String
}, { versionKey: false })

export const MensajeModel = mongoose.model('mensajes', mensajeSchema)
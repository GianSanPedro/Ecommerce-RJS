import Joi from 'joi'

const baseEmail = Joi.string().email().required()
const basePassword = Joi.string().min(6).max(100).required()

export const loginSchema = Joi.object({
    email: baseEmail,
    password: basePassword
})

export const registerSchema = Joi.object({
    nombre: Joi.string().min(2).max(50).required(),
    email: baseEmail,
    password: basePassword,
    admin: Joi.boolean().optional()
})

export const validarLogin = credenciales => loginSchema.validate(credenciales, { abortEarly: true })
export const validarRegister = credenciales => registerSchema.validate(credenciales, { abortEarly: true })

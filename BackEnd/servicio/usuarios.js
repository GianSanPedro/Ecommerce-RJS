import ModelFactory from "../model/DAO/usuarios/usuariosFactory.js"
import config from "../config.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { validarLogin, validarRegister } from "./validaciones/usuario.js"

class Servicio {
  constructor() {
    this.model = ModelFactory.get(config.MODO_PERSISTENCIA);
  }

  loginUsuario = async (credenciales) => {
    const { error } = validarLogin(credenciales || {})
    if(error) return { status: "loginError", mensaje: error.details[0].message }

    const email = (credenciales.email || "").toLowerCase().trim();
    const password = (credenciales.password || "").trim();

    if (!email || !password) return { status: "loginError", mensaje: "Credenciales incompletas" };

    const usuarios = await this.model.obtenerUsuarios();
    const usuarioDB = usuarios.find((u) => (u.email || "").toLowerCase() === email);
    if (!usuarioDB) {
      console.warn('Login fallido: usuario no encontrado', email)
      return { status: "loginError", mensaje: "Usuario no encontrado" };
    }

    const storedPassword = usuarioDB.password || "";
    let passwordOk = await bcrypt.compare(password, storedPassword);

    if (!passwordOk && storedPassword && storedPassword === password) {
      const passwordHash = await bcrypt.hash(password, 10);
      if (typeof this.model.actualizarPassword === "function") {
        await this.model.actualizarPassword(usuarioDB.email, passwordHash);
      }
      usuarioDB.password = passwordHash;
      passwordOk = true;
    }

    if (!passwordOk) {
      console.warn('Login fallido: password incorrecta', email)
      return { status: "loginError", mensaje: "Password incorrecta" };
    }

    const { nombre, email: emailDB, admin } = usuarioDB;
    const usuario = { nombre, email: emailDB, admin: !!admin };

    const payload = { usuario };
    const token = jwt.sign(payload, config.LLAVE, { expiresIn: 1200 });

    return { status: "loginOk", usuario, token };
  };

  loginVisitante = async () => {
    const usuario = {
      nombre: "Visitante",
      email: "Visitante@Visitante",
      admin: false,
    };

    const payload = { usuario };
    const token = jwt.sign(payload, config.LLAVE, { expiresIn: 12000 });
    console.log("VISITANTE TOKEN", token);

    return { status: "loginOk", usuario, token };
  };

  registerUsuario = async (credenciales) => {
    const { error } = validarRegister(credenciales || {})
    if(error) return { status: "registerError", mensaje: error.details[0].message }

    const email = (credenciales.email || "").toLowerCase().trim();
    const password = (credenciales.password || "").trim();
    const nombre = (credenciales.nombre || "").trim();
    const admin = !!credenciales.admin;

    if (!email || !password || !nombre)
      return { status: "registerError", mensaje: "Faltan datos obligatorios" };

    const passwordHash = await bcrypt.hash(password, 10);
    const usuarioRegistrado = await this.model.guardarUsuario({
      nombre,
      email,
      password: passwordHash,
      admin,
    });
    return { status: "registerOk", nombre, email, admin, id: usuarioRegistrado.id || usuarioRegistrado._id };
  };

  validarToken = async (datos) => {
    const { token } = datos;
    let rta = {};

    if (token) {
      jwt.verify(token, config.LLAVE, (error, decoded) => {
        if (error) {
          rta = { error: true, mensaje: "Token no valida" };
        } else {
          rta = { decoded };
        }
      });
    } else {
      rta = { error: true, mensaje: "Token no provista" };
    }
    return rta;
  };
}

export default Servicio;

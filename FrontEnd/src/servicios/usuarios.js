import axios from "axios"

const url = process.env.NODE_ENV === "production"
  ? "/api/usuarios/" // en producción
  : `http://localhost:${process.env.REACT_APP_PORT_SRV_DEV}/api/usuarios/`; // en desarrollo

const handleError = (error, type = "login") => {
  const errMsg =
    error?.response?.data?.mensaje ||
    error?.response?.data?.errMsg ||
    error.message ||
    "Error";
  const status = type === "register" ? "registerError" : "loginError";
  return { status, mensaje: errMsg };
};

export const login = async (credenciales) => {
  try {
    return (await axios.post(url + "login", credenciales)).data;
  } catch (error) {
    console.error("Login error:", error.message);
    return handleError(error, "login");
  }
};

export const loginVisitante = async () => {
  try {
    return (await axios.post(url + "loginVisitante")).data;
  } catch (error) {
    console.error("Login visitante error:", error.message);
    return handleError(error, "login");
  }
};

export const register = async (credenciales) => {
  try {
    return (await axios.post(url + "register", credenciales)).data;
  } catch (error) {
    console.error("Register error:", error.message);
    return handleError(error, "register");
  }
};

export const validarToken = async (token) =>
  (await axios.post(url + "token", { token })).data;

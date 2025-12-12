import { getToken } from "./token"

const devPort = process.env.REACT_APP_PORT_SRV_DEV || 8080
const url = process.env.NODE_ENV === "production"
  ? "/api/upload/" // en producción
  : `http://localhost:${devPort}/api/upload/` // en desarrollo

export function enviarFormDataAjax(data, progress, urlfoto) {
  let porcentaje = 0

  const xhr = new XMLHttpRequest()
  xhr.open("post", url)

  xhr.addEventListener("load", () => {
    try {
      if (xhr.status === 200) {
        const rta = JSON.parse(xhr.response || "{}")
        console.log("Upload OK:", rta)
        const urlSubida = rta.urlFotoFTP || ""
        if (typeof urlfoto === "function") urlfoto(urlSubida)
      } else {
        console.error("Upload fallo. status:", xhr.status, "resp:", xhr.response)
        if (typeof urlfoto === "function") urlfoto("")
      }
    } catch (error) {
      console.error("Upload parse error:", error.message)
      if (typeof urlfoto === "function") urlfoto("")
    }
  })

  xhr.addEventListener("error", () => {
    console.error("Upload error de red")
    if (typeof urlfoto === "function") urlfoto("")
  })

  xhr.upload.addEventListener("progress", (e) => {
    if (e.lengthComputable) {
      porcentaje = parseInt((e.loaded * 100) / e.total)
      if (typeof progress === "function") progress(porcentaje)
    }
  })

  xhr.setRequestHeader("access-token", getToken())
  xhr.send(data)
}

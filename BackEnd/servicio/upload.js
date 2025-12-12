import config from '../config.js'
import { Client } from "basic-ftp"
import fs from 'fs'

class Servicio {
    guardarArchivoFTP = async file => {
        if(!file) throw new Error('No se recibio archivo para subir')
        const urlFotoFTP = await this.subirArchivoFTP(file)
        return urlFotoFTP
    }

    subirArchivoFTP = async file => {
        const client = new Client()
        client.ftp.verbose = false
        const src = file.path            
        const dst = `${config.FTP_DST}/${file.filename}`

        // Si no hay credenciales de FTP configuradas, servir desde el filesystem local (/media)
        if(!config.FTP_HOST || !config.FTP_USER || !config.FTP_PASS) {
            const base = (config.CDN_BASE_URL || `http://localhost:${config.PORT}/media`).replace(/\/$/,'')
            return `${base}/${file.filename}`
        }

        try {
            await client.access({
                host: config.FTP_HOST,
                user: config.FTP_USER,
                password: config.FTP_PASS,
                secure: false
            })
            console.log('***** FTP Connection OK! *****')

            console.log('Subiendo archivo por FTP...')

            //progreso de la subida de la foto al servidor de archivos por FTP
            const bytesTotal = file.size
            client.trackProgress( info => {
                let porcentaje = parseInt((info.bytes * 100) / bytesTotal)
                console.log(porcentaje + '%')
            })
            //subo la foto por FTP
            await client.uploadFrom(src, dst)
            
            //foto subida!
            console.log(' -> Upload OK!')
            client.trackProgress()

            //borro la foto temporal del servidor
            await fs.promises.unlink(src)

            client.close()
            const base = (config.CDN_BASE_URL || 'https://danielsanchez.com.ar/uploads').replace(/\/$/,'')
            return `${base}/${config.FTP_DST}/${file.filename}`
        }
        catch (err) {
            console.log('Error de Connection FTP:', err.message)
            client.close()
            try {
                if(src) await fs.promises.unlink(src)
            } catch {}
            throw new Error('No se pudo subir el archivo por FTP')
        }
    }
}

export default Servicio

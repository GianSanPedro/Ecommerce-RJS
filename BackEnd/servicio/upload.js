import config from '../config.js'
import { Client } from "basic-ftp"
import fs from 'fs'

class Servicio {
    guardarArchivoFTP = async file => {
        const urlFotoFTP = await this.subirArchivoFTP(file)
        return urlFotoFTP
    }

    subirArchivoFTP = async file => {
        //console.log(file)
        const client = new Client()
        client.ftp.verbose = false

        try {
            await client.access({
                host: config.FTP_HOST,
                user: config.FTP_USER,
                password: config.FTP_PASS,
                secure: false
            })
            console.log('***** FTP Connection OK! *****')

            const src = file.path            
            const dst = `${config.FTP_DST}/${file.filename}`            
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
            //return `http://localhost:${config.PORT}/uploads/${file.filename}`
            //return `https://${config.FTP_USER}.000webhostapp.com/uploads/${file.filename}`
            return `https://danielsanchez.com.ar/uploads/${config.FTP_DST}/${file.filename}`
        }
        catch (err) {
            console.log('Error de Connection FTP:', err.message)

            client.close()
            return ''
        }
    }
}

export default Servicio
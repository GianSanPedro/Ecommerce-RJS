import { useState } from 'react'
import * as servicioUpload from '../../servicios/upload'

import './ObtenerFoto.css'


export function ObtenerFoto(props) {
    const { escribirCampoUrlFoto } = props
   
    const [urlfoto, setUrlFoto] = useState('')
    const [valorInput, setValorInput] = useState('')
    const [porcentaje, setPorcentaje] = useState(0)
    const [spinner, setSpinner] = useState(false)

    const dragEnter = e => {
        //console.log('dragEnter')
        e.preventDefault()
    }

    const dragLeave = e => {
        //console.log('dragLeave')
        e.preventDefault()
    }

    const dragOver = e => {
        //console.log('dragOver')
        e.preventDefault()
    }

    const drop = e => {
        //console.log('drop')
        e.preventDefault()

        const archivo = e.dataTransfer.files[0]
        //console.log(archivo)
        enviarFoto(archivo)
    }    

    const enviarFoto = archivo => {
        if(archivo.type.includes('image')) {
            //console.log(archivo)

            const data = new FormData()
            data.append('archivo', archivo)
            servicioUpload.enviarFormDataAjax(data, porcentaje => {
                setPorcentaje(porcentaje) 
                if(porcentaje === 100) setSpinner(true)
            }, url => {
                setUrlFoto(url)
                escribirCampoUrlFoto(url)
                setSpinner(false)

                setTimeout(() => {
                    setUrlFoto('')
                    setPorcentaje(0)
                },8000)
            })
        }
        else {
            console.error('El archivo no es una imágen!')
        }
    }

    function change(e) {
        const archivo = e.target.files[0]
        //console.log(archivo)
        enviarFoto(archivo)

        setValorInput('')
    }

    return (
        <div className="ObtenerFoto">
            <input id="archivo" type="file" value={valorInput} onChange={change}/>
            <div 
                id="drop"
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDragOver={dragOver}
                onDrop={drop}
            >
                {/* https://cssloaders.github.io/ */}
                <span style={{opacity: spinner?100:0}} className="loader"></span>
                { porcentaje > 0 && <><progress min="0" max="100" value={porcentaje}></progress> <span className="info">{porcentaje}%</span></> }
                <img src={urlfoto} alt="" />
                <label htmlFor='archivo'>D&D or Click</label>
            </div>
        </div>
    )
}
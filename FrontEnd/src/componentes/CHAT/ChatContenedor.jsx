import { React, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import * as servicioMensajesWebsocket from '../../servicios/mensajes'
import './ChatContenedor.css'; 

const ChatContenedor = () => {

  const [texto, setTexto] = useState('')
  const [mensajes, setMensajes] = useState([])
  const usuario = useSelector(state => state.usuarioLogueado)
  const { nombre, admin } = usuario
  const refTexto = useRef()

  useEffect(() => {
    servicioMensajesWebsocket.conectar()
    servicioMensajesWebsocket.suscribirAlCanal('mensajes', mensajes => {
      setMensajes(mensajes)
    })

    return () => {
        servicioMensajesWebsocket.desconectar()
    }
  },[])

  const onSubmit = e => {
    e.preventDefault()
    const mensaje = { autor: nombre, texto, admin, fyh: new Date().toLocaleString('es-ES', { hour12: false }) }
    servicioMensajesWebsocket.enviarMensaje('nuevo-mensaje', mensaje)
    setMensajes([...mensajes, mensaje])
    refTexto.current.focus()
    setTexto('')
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '90vh' }}>
      <div className="chat-container">

        <div className="chat-header">
          <h1>Sala Global</h1>
        </div>
        
        <div className="chat-body">
            {
              mensajes.filter(mensaje => mensaje.autor === nombre || mensaje.admin || admin).map((mensaje, index) => (
                <div className="chat-messages" key={index}>
                  <div className={mensaje.autor === nombre ? "message-personal" : "message"}>
                    <b className="message-header">
                        {mensaje.autor !== nombre ? `${mensaje.autor}` : '  '}
                    </b>

                    <div className="message-content">
                      <i>{mensaje.texto}</i>
                    </div>

                    <b className="message-footer">
                      {new Date(mensaje.fyh).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'})}
                      {'  '} 
                      {new Date(mensaje.fyh).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit', hour12: false})}
                    </b>
                  </div>
                </div>
                )
              )
            }
        </div>

        <div className="chat-footer">
          <form className='form-message' onSubmit={onSubmit}>
            <textarea 
              type="text" 
              className='chat-textArea' 
              placeholder='Escribe un mensaje...' 
              value={texto} 
              ref={refTexto} 
              onChange={e => setTexto(e.target.value)} 
            />
            <input type="submit" className='send-button' value="Enviar" />
          </form>
        </div>

      </div>
    </div>
  );
};

export default ChatContenedor;
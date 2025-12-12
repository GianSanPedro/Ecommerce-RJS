import React, { useEffect, useState } from 'react';
import './Index.css';
import * as servicioContacto from '../../servicios/contacto'
import { useSelector } from 'react-redux'

export function Index() {

    const [form, setForm] = useState({ nombre: '', email: '', comentario: '' })
    const [enviando, setEnviando] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [ok, setOk] = useState(null)   // true=exito, false=error
    const [contactos, setContactos] = useState([])

    const usuario = useSelector(state => state.usuarioLogueado)
    const esAdmin = !!usuario?.admin

    useEffect(() => {
        console.log('Componente Index Contacto (montado)');

        const botonCarrito = document.getElementById('boton-carrito');
        if (botonCarrito) {
            botonCarrito.disabled = false;
        }

        // Codigo para deshabilitar el envio de formularios si hay campos vacios
        const forms = document.querySelectorAll('.needs-validation');
        Array.from(forms).forEach((form) => {
            form.addEventListener('submit', (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });

        return () => {
            console.log('Componente Index Contacto (desmontado)');
        };
    }, []);

    useEffect(() => {
        if(esAdmin) {
            (async () => {
                const data = await servicioContacto.getAll()
                setContactos(data)
            })()
        }
    }, [esAdmin])

    const onChange = e => {
        const { id, value } = e.target
        setForm({ ...form, [id]: value })
    }

    const onSubmit = async e => {
        e.preventDefault()
        if(!form.nombre || !form.email || !form.comentario) return
        if(form.comentario.trim().length < 5) {
            setOk(false)
            setMensaje('El mensaje debe tener al menos 5 caracteres.')
            return
        }
        try {
            setEnviando(true)
            setMensaje('')
            setOk(null)
            await servicioContacto.enviar(form)
            setMensaje('Mensaje enviado con exito.')
            setOk(true)
            setForm({ nombre: '', email: '', comentario: '' })
        } catch (error) {
            setMensaje('No se pudo enviar el mensaje. Intentalo nuevamente.')
            setOk(false)
        } finally {
            setEnviando(false)
        }
    }

    const borrarContacto = async id => {
        const eliminado = await servicioContacto.eliminar(id)
        if(eliminado) {
            setContactos(contactos.filter(c => (c.id || c._id) !== (eliminado.id || eliminado._id)))
        }
    }

    const renderFormulario = () => (
        <form className="contacto-form colum needs-validation" noValidate onSubmit={onSubmit}>
            {/* Campo de ingreso de nombre del solicitante */}
            <div className="input-group">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input 
                    className="entrada" 
                    id="nombre" 
                    type="text" 
                    name="nombre" 
                    value={form.nombre}
                    onChange={onChange}
                    required 
                />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback">
                    Por favor, ingrese su nombre.
                </div>
            </div>

            {/* Campo de ingreso de correo electronico */}
            <div className="input-group">
                <label htmlFor="email" className="form-label">Correo electronico</label>
                <input 
                    className="entrada" 
                    id="email" 
                    type="email" 
                    name="email" 
                    value={form.email}
                    onChange={onChange}
                    required 
                />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback">
                    Por favor, ingrese un correo electronico valido.
                </div>
            </div>

            {/* Campo de ingreso de detalles del motivo de contacto */}
            <div className="input-group">
                <label htmlFor="comentario" className="form-label">Motivos de contacto</label>
                <textarea
                    id="comentario"
                    name="comentario"
                    rows="8"
                    cols="50"
                    value={form.comentario}
                    onChange={onChange}
                    required 
                ></textarea>
                <div className="valid-feedback"></div>
                <div className="invalid-feedback">Por favor, ingrese el motivo de contacto.</div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar'}</button>
            {mensaje && (
                <p style={{marginTop:'10px', color: ok ? 'green' : 'crimson'}}>
                    {mensaje}
                </p>
            )}
        </form>
    )

    const renderContactosAdmin = () => (
        <div className="contacto-admin">
        <div className="contacto-lista admin-box">
            <h2>Solicitudes de contacto</h2>
            <div className="contacto-scroll">
                {contactos.length === 0 && <p>No hay solicitudes de contacto.</p>}
                {contactos.map((c) => (
                    <div key={c.id || c._id} className="contacto-card">
                        <p><b>Nombre:</b> {c.nombre}</p>
                        <p><b>Email:</b> {c.email}</p>
                        <p><b>Fecha:</b> {c.fyh}</p>
                        <p><b>Comentario:</b> {c.comentario}</p>
                        <button className="btn-eliminar" onClick={() => borrarContacto(c.id || c._id)}>Eliminar</button>
                    </div>
                ))}
            </div>
        </div>
        </div>
    )

    return (
        <section className="contacto">
            <div>
                <h1>Contacto</h1>
            </div>

            {esAdmin ? renderContactosAdmin() : renderFormulario()}
        </section>
    );
}

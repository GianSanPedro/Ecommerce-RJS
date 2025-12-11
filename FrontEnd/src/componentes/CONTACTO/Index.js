import React, { useEffect } from 'react';
import './Index.css';

export function Index() {

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

    return (
        <section className="contacto">
            <div>
                <h1>Contacto</h1>
            </div>

            <form className="contacto-form colum needs-validation" noValidate>
                {/* Campo de ingreso de nombre del solicitante */}
                <div className="input-group">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input 
                        className="entrada" 
                        id="nombre" 
                        type="text" 
                        name="nombre" 
                        required 
                    />
                    <div className="valid-feedback"></div>
                    <div className="invalid-feedback">
                        Por favor, ingrese su nombre.
                    </div>
                </div>

                {/* Campo de ingreso de correo electrónico */}
                <div className="input-group">
                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                    <input 
                        className="entrada" 
                        id="email" 
                        type="email" 
                        name="email" 
                        required 
                    />
                    <div className="valid-feedback"></div>
                    <div className="invalid-feedback">
                        Por favor, ingrese un correo electrónico válido.
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
                    required 
                ></textarea>
                <div className="valid-feedback"></div>
                <div className="invalid-feedback">Por favor, ingrese el motivo de contacto.</div>
            </div>

                <button className="btn btn-primary" type="submit">Enviar</button>
            </form>
        </section>
    );
}
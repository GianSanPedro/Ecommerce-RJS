import React from 'react';
import { ObtenerFoto } from "./ObtenerFoto"

export function Ingreso(props) {
    const {
        nombre,
        precio,
        stock,
        marca,
        categoria,
        detalles,
        descripcion,
        foto,
        envio,
    } = props.producto;

    const { onChange, onSubmit, valido, editarID, escribirCampoUrlFoto } = props;

    return (
        <form className="alta-form needs-validation" noValidate onSubmit={onSubmit}>
            {/* Campo de ingreso de nombre de producto */}
            <div className="input-group">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input
                    type="text"
                    className="entrada form-control"
                    id="nombre"
                    name="nombre"
                    value={nombre}
                    onChange={onChange}
                    required
                />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback">Por favor, ingrese un nombre.</div>
            </div>

            {/* Campo de ingreso de precio de producto */}
            <div className="input-group">
                <label htmlFor="precio" className="form-label">Precio</label>
                <input
                    type="number"
                    className="entrada form-control"
                    id="precio"
                    name="precio"
                    step="0.01"
                    value={precio}
                    onChange={onChange}
                    required
                />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback">Por favor, ingrese un precio válido.</div>
            </div>

            {/* Campo de ingreso de stock de producto */}
            <div className="input-group">
                <label htmlFor="stock" className="form-label">Stock</label>
                <input
                    type="number"
                    className="entrada form-control"
                    id="stock"
                    name="stock"
                    value={stock}
                    onChange={onChange}
                    required
                />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback">Por favor, ingrese una cantidad de stock.</div>
            </div>

            {/* Campo de ingreso de marca de producto */}
            <div className="input-group">
                <label htmlFor="marca" className="form-label">Marca</label>
                <input
                    type="text"
                    className="entrada form-control"
                    id="marca"
                    name="marca"
                    value={marca}
                    onChange={onChange}
                    required
                />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback">Por favor, ingrese una marca.</div>
            </div>

            {/* Campo de ingreso de categoria de producto */}
            <div className="input-group">
                <label htmlFor="categoria" className="form-label">Categoría</label>
                <input
                    type="text"
                    className="entrada form-control"
                    id="categoria"
                    name="categoria"
                    value={categoria}
                    onChange={onChange}
                    required
                />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback">Por favor, ingrese una categoría.</div>
            </div>

            {/* Campo de ingreso de detalles de producto */}
            <div className="input-group">
                <label htmlFor="detalles" className="form-label">Detalles</label>
                <input
                    type="text"
                    className="entrada form-control"
                    id="detalles"
                    name="detalles"
                    value={detalles}
                    onChange={onChange}
                    required
                />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback">Por favor, ingrese detalles.</div>
            </div>

            {/* Campo de ingreso de descripción de producto */}
            <div className="input-group">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    rows="8"
                    cols="50"
                    value={descripcion}
                    onChange={onChange}
                ></textarea>
                <div className="valid-feedback"></div>
                <div className="invalid-feedback"></div>
            </div>

            {/* Campo de ingreso de la foto del producto */}
            <div className="input-group">
                <label htmlFor="foto" className="form-label">Foto</label>
                <input
                    type="text"
                    className="entrada form-control"
                    id="foto"
                    name="foto"
                    value={foto}
                    onChange={onChange}
                    required
                />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback">Por favor, ingrese una URL de foto.</div>

                {/* Zona de obtención de la foto del producto */}            
                <ObtenerFoto escribirCampoUrlFoto={escribirCampoUrlFoto} />
            </div>

            {/* Campo de condición envío */}
            <div className="input-group form-check">
                <label htmlFor="envio" className="form-check-label">Envío disponible</label>
                <input
                    type="checkbox"
                    className="entrada form-check-input"
                    id="envio"
                    name="envio"
                    checked={envio}
                    onChange={onChange}
                />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback"></div>
            </div>

            <button disabled={!valido} type="submit" >
                {editarID ? 'Actualizar' : 'Agregar'}
            </button>
        </form>
    );
}

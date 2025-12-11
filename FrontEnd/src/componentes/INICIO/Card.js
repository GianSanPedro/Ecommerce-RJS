import React, { useState } from 'react';

export const Card = props => {
    const { producto, agregarCarritoID } = props
    const [showAlert, setShowAlert] = useState(false);

    const handleButtonClick = (id) => {
        agregarCarritoID(id);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 1500);
    };

    return (
        <section>
            <h3 style={{ color: 'rgb(73, 31, 84)' }}>{producto.nombre}</h3>
            <div>
                <img src={producto.foto + '?' + (1 || Math.random())} alt="" />
            </div>
            <p><b>Precio: </b>${producto.precio}</p>
            <p><b>Stock: </b>{producto.stock}</p>
            <p><b>Marca: </b>{producto.marca}</p>
            <p><b>Categoría: </b>{producto.categoria}</p>
            <p><b>Detalles: </b>{producto.detalles}</p>
            {producto.descripcion !== " " && ( <p><b>Descripcion: </b>{producto.descripcion}</p> )}

            <br />
            <div id="product-card-footer">
                <p><b style={{ color: 'rgb(73, 31, 84)' }}>Envío: </b>{producto.envio? 'Si' : 'No'}</p>
                <button id={"btnComprar-"+producto.id} onClick={
                    () => handleButtonClick(producto.id)
                }>Agregar al carrito</button>
            </div>

            <div id="Alert-Carrito" className={`alert ${showAlert ? 'show' : 'hide'}`}>
                ¡Producto agregado al carrito!
            </div>
        </section>
    )
} 
export function Tabla(props) {
    // Object destructuring
    const { carrito, decrementarItem, incrementarItem, cambiarCantItem, borrarItem } = props;

    // Manejar cambios en la cantidad editada
    const handleChangeCantidad = (e, id) => {
        const nuevaCantidad = parseInt(e.target.value);
        if (!isNaN(nuevaCantidad) && nuevaCantidad !== 0) {
            cambiarCantItem(id, nuevaCantidad);
        }
    };

    // Calcular la cantidad total de productos y el costo total
    const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    const costoTotal = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);

    return (
        <div className="section-List">
            {carrito.map((producto, index) => (
                <div className="card-carrito" key={producto.id}>
                    <div className="card-carrito-foto">
                        <img src={`${producto.foto}?${1 || Math.random()}`} alt={`foto de ${producto.nombre}`} />
                    </div>
                    <div className="card-carrito-datos">
                        <p >{producto.nombre}</p>
                        <p >Marca: {producto.marca}</p>
                        <p >Precio: ${producto.precio}</p>
                        <p >Subtotal: ${producto.precio * producto.cantidad}</p>
                    </div>
                    <div className="card-carrito-botones">
                        <div>
                            <div>
                                <button
                                   id={`btnDecrementar-${producto.id}`}
                                   onClick={() => decrementarItem(producto.id)}
                                > - </button>
                                <input
                                    type="number"
                                    className="dato"
                                    value={producto.cantidad}
                                    onChange={(e) => handleChangeCantidad(e, producto.id)}
                                />
                                <button
                                   id={`btnIncrementar-${producto.id}`}
                                   onClick={() => incrementarItem(producto.id)}
                                > + </button>
                            </div>

                            <button
                                id={`btnBorrar-${producto.id}`}
                                onClick={() => borrarItem(producto.id)}
                            > Borrar </button>
                        </div>
                    </div>
                </div>
            ))}

            <div>
                <p>Total de productos: {cantidadTotal}</p>
                <p>Costo Total: ${costoTotal.toFixed(2)}</p>
            </div>
        </div>
    );
}

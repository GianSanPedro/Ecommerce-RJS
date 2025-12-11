export function Tabla(props) {
    const { productos, editar, borrar, editarID } = props    

    return (
        <>
        { productos.length === 0
            ? <h2 className="msg-error">No se encontraron productos para mostrar</h2>
            : <table>
                <thead>
                    <tr>
                        {/*<th>#</th>*/}
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Marca</th>
                        <th>Categoria</th>
                        <th>Detalles</th>
                        <th>Descripcion</th>
                        <th>Foto</th>
                        <th>Envío</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        productos.map((producto,index) => 
                            <tr key={index}>
                                {/*<td className="centrar">{producto.id}</td>*/}
                                <td>{producto.nombre}</td>
                                <td className="centrar">{producto.precio}</td>
                                <td className="centrar">{producto.stock}</td>
                                <td>{producto.marca}</td>
                                <td>{producto.categoria}</td>
                                <td>{producto.detalles}</td>
                                <td>{producto.descripcion}</td>
                                <td>
                                    <img 
                                        width="150" 
                                        src={producto.foto + '?' + (1 || Math.random())} 
                                        alt={"foto de " + producto.nombre} 
                                    />
                                </td>
                                <td className="centrar">{producto.envio? 'Si' : 'No'}</td>
                                <td>
                                    <button id={"btnBorrar-"+producto.id} onClick={
                                        () => borrar(producto.id)
                                    }>Borrar</button>

                                    <button id={(editarID && editarID === producto.id? "btnCancelar-" : "btnEditar-")+producto.id} onClick={
                                        () => editar(producto.id)
                                    }>{editarID && editarID === producto.id? 'Cancelar':'Editar'}</button>
                                </td>                            
                            </tr>
                        )
                    }
                </tbody>
            </table>
        }
        </>
    )
}
import 'bootstrap/dist/css/bootstrap.min.css';
import './Index.css';
import './ModalBorrar.css'
import { useEffect, useState } from 'react';
import { Ingreso } from './Ingreso';
import { Tabla } from './Tabla';
import * as servicioProductos from '../../servicios/productos';
import { Button, Modal } from 'react-bootstrap'

export function Index() {
    const [producto, setProducto] = useState({
        nombre: '',
        precio: '',
        stock: '',
        marca: '',
        categoria: '',
        detalles: '',
        descripcion: '',
        foto: '',
        envio: false,
    });
    const [productos, setProductos] = useState([]);
    const [editarID, setEditarID] = useState(null);
    const [show, setShow] = useState(false);
    const [borrarID, setBorrarID] = useState(null)
    const cerrarBorrar = () => {
        setBorrarID(null)
        setShow(false)
    }
    const mostrarBorrar = id => {
        setBorrarID(id)
        setShow(true)
    }

    useEffect(() => {
        // Codigo para deshabilitar el envio de formularios si hay campos invalidos
        const forms = document.querySelectorAll('.needs-validation');
        Array.from(forms).forEach((form) => {
            form.addEventListener(
                'submit',
                (event) => {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                },
                false
            );
        });
    }, []);

    useEffect(() => {
        console.log('Componente Index Alta (montado)');

        async function pedir() {
            const productos = await servicioProductos.getAll();
            setProductos(productos);
        }
        pedir();

        const botonCarrito = document.getElementById('boton-carrito');
        if (botonCarrito) {
            botonCarrito.disabled = false;
        }

        return () => {
            console.log('Componente Index Alta (desmontado)');
        };
    }, []);

    function formularioValido() {
        for (let campo in producto) {
            if (campo !== 'envio' && campo !== 'descripcion') {
                if (!producto[campo]) return false;
            }
        }
        return true;
    }

    function editar(id) {
        console.log('editar: ' + id);

        if (!editarID || editarID !== id) {
            setEditarID(id);
            setProducto(productos.find((p) => p.id === id));
        } else {
            setEditarID(null);
            borrarFormulario();
        }
    }

    function borrar(id) {
        mostrarBorrar(id)
    }

    async function goBorrar() {
        const id = borrarID
        console.log('borrar: ' + id)
        const productoBorrado = await servicioProductos.eliminar(id)

        const productosClon = [...productos]
        const index = productosClon.findIndex(p => p.id === productoBorrado.id)
        productosClon.splice(index, 1)
        setProductos(productosClon)
        cerrarBorrar()
    }

    function onChange(e) {
        const { id, type, value, checked } = e.target;
        const productoClon = { ...producto };
        productoClon[id] = type === 'checkbox' ? checked : value;
        setProducto(productoClon);
    }

    async function onSubmit(e) {
        e.preventDefault();
        const productosClon = [...productos];

        if (!editarID) {
            // Guardar el producto en el recurso remoto
            const productoGuardado = await servicioProductos.guardar(producto);

            // Guardar el producto en el recurso local
            productosClon.push(productoGuardado);
        } else {
            const id = editarID;

            // Actualizar el producto en el recurso remoto
            const productoActualizado = await servicioProductos.actualizar(id, producto);

            // Actualizar el producto en el recurso local
            const index = productosClon.findIndex((p) => p.id === productoActualizado.id);
            productosClon.splice(index, 1, productoActualizado);
            setEditarID(null);
        }

        setProductos(productosClon);
        borrarFormulario();
    }

    function borrarFormulario() {
        setProducto({
            nombre: '',
            precio: '',
            stock: '',
            marca: '',
            categoria: '',
            detalles: '',
            descripcion: '',
            foto: '',
            envio: false,
        });
    }

    function escribirCampoUrlFoto(url) {
        const productoClon = { ...producto }
        productoClon.foto = url
        setProducto(productoClon)
    }

    return (
        <section className="alta">

        <Modal id='ModalBorrar' show={show} onHide={cerrarBorrar} centered>
            <Modal.Header id='ModalBorrar-header' closeButton>
                <Modal.Title><h3>Borrar Producto</h3></Modal.Title>
            </Modal.Header>

            <Modal.Body id='ModalBorrar-body'>
                <p>¿Está seguro de borrar el producto de nombre "{productos.find(p => p.id === borrarID)?.nombre}"?</p>
                <div className="ButtonContainer d-flex justify-content-end">
                    <Button 
                        type="button"
                        id="boton-Cancelar" 
                        className="btn me-2 flex-grow-1"
                        onClick={cerrarBorrar}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="button"
                        id="boton-Borrar" 
                        className="btn flex-grow-1"
                        onClick={goBorrar}
                    >
                        Aceptar
                    </Button>
                </div>
            </Modal.Body>
        </Modal>





            <div id="section-diviser"></div>
            <div>
                <h1>Alta de productos</h1>
            </div>

            <Ingreso
                producto={producto}
                onChange={onChange}
                onSubmit={onSubmit}
                valido={formularioValido}
                editarID={editarID}
                escribirCampoUrlFoto={escribirCampoUrlFoto}
            />

            <hr />
            <h2>Lista de productos disponibles</h2>
            <div className="tabla-container">
                <div className="tabla-responsive">
                    <Tabla
                        productos={productos}
                        borrar={borrar}
                        editar={editar}
                        editarID={editarID}
                    />
                </div>
            </div>
        </section>
    );
}


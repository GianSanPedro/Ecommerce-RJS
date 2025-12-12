import React, { useEffect, useState } from 'react'
import './Index.css'
import { Card } from './Card'
import * as servicioProductos from '../../servicios/productos'
import { useStateLocalStorage } from '../Hooks/useStateLocalStorage'

export function Index(props) {
    const { filtro, esAdmin } = props

    const [productos, setProductos] = useState([])
    const [carrito, setCarrito] = useStateLocalStorage('carrito',[])

    useEffect(() => {
        console.log('Componente Index Inicio (montado)')

        async function pedir() {
            const productos = await servicioProductos.getAll()
            setProductos(productos)
        }
        pedir();

        const botonCarrito = document.getElementById('boton-carrito');
        if (botonCarrito) {
            botonCarrito.disabled = false;
        }

        return () => {
            console.log('Componente Index Inicio (desmontado)')
        }
    },[])

    useEffect(() => {
        console.log('estado carrito')
        console.log(carrito)
    },[carrito])

    function agregarCarritoID(id) {
        if(esAdmin) return  // admin no agrega al carrito

        const producto = productos.find(p => p.id === id)

        const carritoClon = [...carrito]

        const prodExistente = carritoClon.find(p => p.id === id)
        if(!prodExistente) {
            producto.cantidad = 1
            carritoClon.push(producto)
        }
        else {
            if(prodExistente.cantidad < prodExistente.stock) {
                prodExistente.cantidad++
                const index = carritoClon.findIndex(p => p.id === id)
                carritoClon.splice(index,1,prodExistente)
            }
        }
        setCarrito(carritoClon)
    }

    function getProductosFiltrados(campo) {
        return productos.filter(producto => producto[campo].toLowerCase().includes(filtro.toLowerCase()))
    }

    return (
        <section className="inicio">
            <div id="section-diviser"></div>
            <div className="section-cards">
                <div className="section-cards-header">
                    <h1>Listado de productos</h1>
                </div>
                <div className="section-cards-container">
                    { getProductosFiltrados('nombre').length === 0
                        ? <h2 className="msg-error">No se encontraron productos para mostrar</h2>
                        :
                        <>
                        {
                            getProductosFiltrados('nombre').map((producto, index) => 
                                <Card 
                                    key={index}
                                    producto={producto}
                                    agregarCarritoID={agregarCarritoID}
                                    esAdmin={esAdmin}
                                />
                            )
                        }
                        </>
                    }
                </div>
            </div>
        </section>
    )
}

import './Index.css'
import { Tabla } from './Tabla'
import { useStateLocalStorage } from '../Hooks/useStateLocalStorage'
import * as servicioCarrito from '../../servicios/carrito'

import './pago'
import { Wallet } from '@mercadopago/sdk-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

export function Index() {
    const [carrito, setCarrito] = useStateLocalStorage('carrito', [])
    const [pagar, setPagar] = useState(false)
    const [compraStatus, setCompraStatus] = useState({payment_id:'null', status:'null', merchant_order_id:'null'})
    const navigate = useNavigate()
    const login = useSelector(state => state.login)
    const usuario = useSelector(state => state.usuarioLogueado)
    const delay = ms => new Promise(r => setTimeout(r, ms))
    

    const recibirDatosPago = async () => {
        const hashParameters = new URL(window.location.href.replace(/#\//g,''))
        console.log(hashParameters)

        const compra = {}
        compra.payment_id = hashParameters.searchParams.get('payment_id') || 'null'
        compra.status = hashParameters.searchParams.get('status') || 'null'
        compra.merchant_order_id = hashParameters.searchParams.get('merchant_order_id') || 'null'
        console.log(compra)

        if (compra.status !== 'null') {
            if (compra.status !== compraStatus.status) {
                setCompraStatus(compra)
                if (compra.status === 'approved') {
                    // persiste el pedido en backend antes de limpiar el carrito
                    try {
                        await servicioCarrito.guardarPedido(carrito, usuario, compra)
                    } catch (error) {
                        console.error('No se pudo guardar el pedido en backend:', error)
                    }
                    setCarrito([])
                    await delay(2000)
                    navigate('/')
                }
            }
        }
    }
    const recibirDatosPagoCb = useCallback(recibirDatosPago, [recibirDatosPago])

    useEffect(() => {recibirDatosPagoCb()}, [recibirDatosPagoCb])
    useEffect(() => {setPagar(false)}, [carrito])
    useEffect(() => {
        console.log('Componente Index Carrito (montado)')

        const botonCarrito = document.getElementById('boton-carrito');
        if (botonCarrito) {
            botonCarrito.disabled = true;
        }

        return () => {
            console.log('Componente Index Carrito (desmontado)')
        }
    }, []); 


    function decrementarItem(id) {
        //console.log('decrementarItem', id)
        const carritoClon = [...carrito]
        const producto = carritoClon.find(p => p.id === id)
        if (producto.cantidad > 1) {
            producto.cantidad--
            setCarrito(carritoClon)
        }
    }
    function incrementarItem(id) {
        //console.log('incrementarItem',id)
        const carritoClon = [...carrito]
        const producto = carritoClon.find(p => p.id === id)
        if (producto.cantidad < producto.stock) {
            producto.cantidad++
            setCarrito(carritoClon)
        }
    }
    function borrarItem(id) {
        //console.log('borrarItem',id)
        if (window.confirm(`¿Está seguro de borrar el producto del carrito id ${id}?`)) {
            const carritoClon = [...carrito]
            const index = carritoClon.findIndex(p => p.id === id)
            carritoClon.splice(index, 1)
            setCarrito(carritoClon)
        }
    }
    function borrarCarrito() {
        if (window.confirm(`¿Está seguro de borrar el carrito?`)) {
            setCarrito([])
        }
    }
    
    function cambiarCantItem(id, cantidad) {
        const carritoClon = [...carrito]
        const producto = carritoClon.find(p => p.id === id)
        if(cantidad <= producto.stock) {
            producto.cantidad = cantidad;
            setCarrito(carritoClon)
        }
    }

    // ----------------- CONTROL DEL BOTÓN DE PAGO (Wallet) --------------------
    const customization = {
        //https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/checkout-customization/user-interface/change-button-texts
        texts: {
            action: 'pay',
            valueProp: 'security_details',
        },
        //https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/checkout-customization/user-interface/change-button-appearance
        visual: {
            buttonBackground: 'black',
            borderRadius: '10px',
        },
    }

    const onReady = () => {
        console.log('onReady')
    }
    const onError = () => {
        console.error('onError')
    }
    const onSubmit = () => {
        console.log('onSubmit')

        //return Promise.resolve('73927731-541f9360-da7e-4a99-a80b-7121247fbc0c')
        return new Promise((resolve, reject) => {
            //resolve('73927731-541f9360-da7e-4a99-a80b-7121247fbc0c')
            servicioCarrito.getPreferenceId(carrito, usuario)
                .then(preferenceId => resolve(preferenceId))
                .catch(error => reject(error)) // -> .catch(reject)
        })
    }


    return (
        <section className="carrito">
            <div id="section-diviser"></div>
            <div>
                <h1>Carrito de Compras</h1>
            </div>
            <br /><br />
    
            {compraStatus.status !== 'null' && 
            (
                <div
                    style={{
                        backgroundColor: compraStatus.status === 'approved' ? 'lightgreen' : 'lightpink',
                        width: '50%',
                        margin: '0 auto',
                        padding: '10px',
                        borderRadius: '20px',
                    }}
                >
                    <h2>Estado de compra</h2>
                    <hr />
                    <ul>
                        <li><h4>payment_id: {compraStatus.payment_id}</h4></li>
                        <li><h4>status: {compraStatus.status}</h4></li>
                        <li><h4>merchant_order_id: {compraStatus.merchant_order_id}</h4></li>
                    </ul>
                </div>
            )}
            <br />
    
            {carrito.length === 0 ? 
            (
                <h2 className="msg-error">No se encontraron pedidos para mostrar</h2>
            ) 
            : 
            (
                <>
                    <Tabla
                        carrito={carrito}
                        decrementarItem={decrementarItem}
                        incrementarItem={incrementarItem}
                        cambiarCantItem={cambiarCantItem}
                        borrarItem={borrarItem}
                    />
                    <div className="carrito-botones">
                        <button className="carrito-borrar" onClick={borrarCarrito}>Borrar pedido</button>
                        {!pagar ? 
                        (
                            <button className="carrito-pedir" onClick={() => setPagar(true)}>Pagar</button>
                        ) 
                        : 
                        (
                            login ? 
                            (
                                <div id="wallet_container">
                                    <Wallet
                                        customization={customization}
                                        onReady={onReady}
                                        onError={onError}
                                        onSubmit={onSubmit}
                                    />
                                </div>
                            ) 
                            : 
                            (
                                <div className="msg-error">
                                    <h3>Debes iniciar sesión para continuar con el pago</h3>
                                </div>
                            )
                        )
                        }
                    </div>
                </>
            )}
        </section>
    );
    
}

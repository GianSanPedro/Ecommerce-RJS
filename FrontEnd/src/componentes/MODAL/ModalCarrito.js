import { ListaCarrito } from '../MODAL/ListaCarrito'
import React, { useEffect, useState } from 'react';

import { Modal, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './ModalCarrito.css'

const ModalCarrito = ({ show, handleClose }) => {

  const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem('carrito')) || []);

  function decrementarItem(id) {
        const carritoClon = [...carrito]
        const producto = carritoClon.find(p => p.id === id)
        if(producto.cantidad > 1) {
            producto.cantidad--
            setCarrito(carritoClon)
            localStorage.setItem('carrito', JSON.stringify(carritoClon));
        }
  }
    
  function incrementarItem(id) {
        const carritoClon = [...carrito]
        const producto = carritoClon.find(p => p.id === id)
        if(producto.cantidad < producto.stock) {
            producto.cantidad++
            setCarrito(carritoClon)
            localStorage.setItem('carrito', JSON.stringify(carritoClon));
        }
  }

  function cambiarCantItem(id, cantidad) {
    const carritoClon = [...carrito]
    const producto = carritoClon.find(p => p.id === id)
    if(cantidad <= producto.stock) {
        producto.cantidad = cantidad;
        setCarrito(carritoClon)
        localStorage.setItem('carrito', JSON.stringify(carritoClon));
    }
}

  function borrarItem(id) {
        if (window.confirm(`¿Está seguro de borrar el producto del carrito id ${id}?`)) {
            const carritoClon = [...carrito]
            const index = carritoClon.findIndex(p => p.id === id)
            carritoClon.splice(index, 1)
            setCarrito(carritoClon)
            localStorage.setItem('carrito', JSON.stringify(carritoClon));
        }
  }

  // Monitorea cambios en 'show'
  useEffect(() => { setCarrito(JSON.parse(localStorage.getItem('carrito')) || []); }, [show]);

  return (
    <>
      <Modal show={show} onHide={handleClose} className="modal fade modal-dialog-scrollable" id="ModalCarrito" tabIndex="-1" aria-labelledby="ModalCarrito-label" aria-hidden="true">
        <Modal.Header closeButton>
          <Modal.Title id="ModalCarrito-titulo">Carrito</Modal.Title>
        </Modal.Header>

        <Modal.Body id="ModalCarrito-body">
          { carrito.length === 0
              ? <h2 className="msg-error">No se encontraron pedidos para mostrar</h2>
              : 
              <>
                <ListaCarrito 
                    carrito={carrito}
                    decrementarItem={decrementarItem}
                    incrementarItem={incrementarItem}
                    cambiarCantItem={cambiarCantItem}
                    borrarItem={borrarItem}
                />
              </>
          }
        </Modal.Body>

        <Modal.Footer>
          <Button id="ModalCarrito-btn-Revisar" onClick={handleClose} centered>
            <NavLink to="/carrito" style={{ textDecoration: 'none', color: 'inherit' }}>
              Revisar
            </NavLink>
          </Button>
          <Button id="ModalCarrito-btn-Cerrar" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalCarrito;

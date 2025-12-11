import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { accionSetLogin, accionSetUsuarioLogueado } from './state/actions';
import { clearToken, getToken, setToken } from './servicios/token';
import * as servicioUsuarios from './servicios/usuarios'

import ModalCarrito from './componentes/MODAL/ModalCarrito';
import ModalLogin from './componentes/MODAL/ModalLogin';
import { Navbar } from './componentes/Navbar';
//import { Chat } from './componentes/Chat';


import { Index as Busqueda } from './componentes/BUSQUEDA/Index';
import { Index as Inicio } from './componentes/INICIO/Index';
import { Index as Alta } from './componentes/ALTA/Index';
import { Index as Carrito } from './componentes/CARRITO/Index';
import { Index as Contacto } from './componentes/CONTACTO/Index';
import { Index as Nosotros } from './componentes/NOSOTROS/Index';
import { Index as Chat } from './componentes/CHAT/Index';


function App() {
  const [filtro, setFiltro] = useState('');
  const [visitante, setVisitante] = useState(true);

  const login = useSelector(state => state.login)
  const usuario = useSelector(state => state.usuarioLogueado)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Estados independientes para cada modal
  const [showCarrito, setShowCarrito] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Funciones de manejo para el modal de carrito
  const handleCloseCarrito = () => setShowCarrito(false);
  const handleShowCarrito = () => setShowCarrito(true);

  // Funciones de manejo para el modal de login
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  useEffect(() => {
    console.log('--- App Montado ---')

    async function validar() {
      const token = getToken()
      console.log("Token desde localStorage:", token)

      if (token) {
        const rta = await servicioUsuarios.validarToken(token)
        console.log("Respuesta de validación de token:", rta)
  
        if('error' in rta) {
          console.error(rta.mensaje)
          clearToken()
        } 
        else {
          const { usuario } = rta.decoded
          console.log("Usuario decodificado:", usuario)
          if (visitante !== true){
          dispatch(accionSetUsuarioLogueado(usuario))
          dispatch(accionSetLogin(true))
          }
        }
      } 
      else {
        const rta = await servicioUsuarios.loginVisitante();
        const { statusV, visitante, token } = rta;
        console.log('VISITANTE', statusV, visitante, token);
        setToken(token);
        setVisitante(true); 
        navigate('/inicio');
      }
    }
    validar()

  },[dispatch, navigate, visitante])

  function logout() {
    dispatch(accionSetUsuarioLogueado({}));
    dispatch(accionSetLogin(false));
    clearToken();
    setVisitante(true); 
    navigate('/');
  }

  function setFiltroBusqueda(valor) {
    console.log('filtro App:', valor);
    setFiltro(valor);
  }

  return (
    <div className="App">
        <header>
          <video autoPlay muted loop id="Video-background">
            <source src="/VIDEO/FondoNav.mp4" type="video/mp4" />
            Tu navegador no soporta la etiqueta de video.
          </video>
          <div>
            <div> 
              <div id="container-logo" className="responsive-hidden">
                <div id="Logo" ></div>
              </div>
              <div>
                <Busqueda setFiltroBusqueda={setFiltroBusqueda} />
              </div>
              <div id="container-carrito">
                <button id="boton-carrito" onClick={handleShowCarrito}>
                    <img src="/ICON/Cart_bask_shop_icon.png" alt="Icono carrito de compras" />
                </button>
                {(!login || usuario.nombre === 'Visitante')
                  ? (
                    <button id="boton-login" onClick={handleShowLogin}>
                      <img src="/ICON/Account_circle_icon.png" alt="Icono usuario" />
                    </button>
                  )
                  : (
                    <button id="boton-logout" onClick={logout}>
                      <img src="/ICON/Account_circle_active_icon.png" alt="Icono usuario" />
                      <span className="logout-text">Logout</span>
                      <i>{usuario.nombre}</i> 
                    </button>
                  )
                }
                
              </div>
            </div>
          </div>
          <Navbar admin={usuario.admin} login={login}/>
          <ModalCarrito show={showCarrito} handleClose={handleCloseCarrito}/>
          <ModalLogin show={showLogin} handleClose={handleCloseLogin} login={login} setVisitante={setVisitante}/>
        </header>

        <main>
          <Routes>
            <Route index element={<Inicio filtro={filtro} />} />
            <Route path="inicio" element={<Inicio filtro={filtro} />} />
            <Route path="alta" element={<Alta />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="nosotros" element={<Nosotros />} />
            <Route path='chat' element={<Chat />} />
            <Route path="*" element={<Inicio filtro={filtro} />} />
          </Routes>
        </main>

      <footer>
        <h3>&copy; Copyright 2024</h3>
      </footer>
    </div>
  );
  
}
export default App;
import { NavLink } from "react-router-dom";

export const Navbar = ({ admin, login }) => {
    return (
      <nav>
        <ul>
          <li> <NavLink to="/inicio">Inicio</NavLink> </li>
          {admin && <li> <NavLink to="/alta">Alta</NavLink> </li>}
          {!admin && <li> <NavLink to="/carrito">Carrito</NavLink> </li>}
          <li> <NavLink to="/contacto">Contacto</NavLink> </li>
          <li> <NavLink to="/nosotros">Nosotros</NavLink> </li>
          {login && <li> <NavLink to="/chat">Chat</NavLink> </li>}
        </ul>
      </nav>
    );
  };
  

import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import { accionSetLogin, accionSetUsuarioLogueado } from "../state/actions";
import { useDispatch } from "react-redux";
import * as servicioUsuarios from '../servicios/usuarios';
import { useNavigate } from "react-router";
import { clearToken, setToken } from "../servicios/token";

export const Login = ({ onSubmitSuccess, setVisitante }) => {
    const formIni = { email: '', password: '', nombre: '', admin: false };
    const [credenciales, setCredenciales] = useState(formIni);
    const [modoRegistro, setModoRegistro] = useState(false);
    const [formClass, setFormClass] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { email, password, nombre } = credenciales;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async e => {
        e.preventDefault();

        // Solo ejecuta el codigo si el formulario es valido
        if (formClass === 'was-validated') {
            if (!e.target.checkValidity()) {
                e.stopPropagation();
                return;
            }
        }

        console.log(credenciales);

        if (!modoRegistro) {
            const rta = await servicioUsuarios.login(credenciales);
            const { status, usuario, token } = rta;
            console.log(status, usuario, token);

            if (status === 'loginOk') {
                dispatch(accionSetUsuarioLogueado(usuario));
                dispatch(accionSetLogin(true));
                setToken(token);
                setVisitante(false);

                if (usuario.admin) navigate('/alta');
                else navigate('/inicio');

                // Cerrar el modal
                if (onSubmitSuccess) onSubmitSuccess();
                setErrorMessage(''); 
            } else {
                dispatch(accionSetUsuarioLogueado({}));
                dispatch(accionSetLogin(false));
                setErrorMessage('Usuario o contraseña incorrectos');
                clearToken();
                navigate('/');
            }
        } else {
            const usuarioLogueado = await servicioUsuarios.register(credenciales);
            console.log(usuarioLogueado);
            dispatch(accionSetLogin(false));
            setModoRegistro(false);
            clearToken();

            // Cerrar el modal
            if (onSubmitSuccess) onSubmitSuccess();
            setErrorMessage('');
        }

        setCredenciales(formIni);
    };

    useEffect(() => {
        // Se deshabilita el envío de formularios si hay campos invalidos
        const form = document.querySelector('.login-form');
        if (form) {
            form.addEventListener('submit', (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                    setFormClass('was-validated');
                } else {
                    setFormClass('');
                }
            }, false);
        }

        return () => {
            if (form) {
                form.removeEventListener('submit', () => {});
            }
        };
    }, []);

    return (
        <div className="Login">
            <form className={`login-form ${formClass}`} noValidate onSubmit={onSubmit}>
                {modoRegistro && (
                    <>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            className="entrada form-control"
                            id="input-nombre"
                            name="nombre"
                            value={nombre}
                            onChange={e => setCredenciales({ ...credenciales, nombre: e.target.value })}
                            required
                        />
                        <div className="invalid-feedback">Por favor, ingrese un nombre.</div>
                    </>
                )}

                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    className="entrada form-control"
                    id="input-email"
                    name="email"
                    value={email}
                    onChange={e => setCredenciales({ ...credenciales, email: e.target.value })}
                    required
                />
                <div className="invalid-feedback">Por favor, ingrese un email válido.</div>

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    className="entrada form-control"
                    id="input-password"
                    name="password"
                    value={password}
                    onChange={e => setCredenciales({ ...credenciales, password: e.target.value })}
                    required={!modoRegistro}
                />
                <div className="invalid-feedback">Por favor, ingrese una contraseña.</div>


                {errorMessage && 
                    (
                        <div className="alert alert-danger mt-3">
                        {errorMessage}
                        </div>
                    )
                }

                <button 
                    type="submit" 
                    id="boton-Register-Login" 
                    className="btn btn-primary">
                    {modoRegistro ? 'Register' : 'Login'}
                </button>

                <button
                    type="button"
                    id="boton-Secundario" 
                    className="btn btn-secondary mt-2"
                    onClick={() => setModoRegistro(!modoRegistro)}
                >
                    {modoRegistro ? 'Ir a Login' : 'Ir a Register'}
                </button>
            </form>
        </div>
    );
};

import { Modal } from 'react-bootstrap';
import { Login } from '../Login';
import './ModalLogin.css'

const ModalLogin = ({ show, handleClose, login, setVisitante}) => {

  return (
    <>
      <Modal id='ModalLogin' show={show} onHide={handleClose} centered>
        <Modal.Header id='ModalLogin-header' closeButton>
          {!login
            ? (
              <Modal.Title id="ModalLogin-titulo" className="w-100 text-center">Ingreso</Modal.Title>
            )
            : (
              <Modal.Title id="ModalLogin-titulo" className="w-100 text-center">Registro</Modal.Title>
            )
          }
        </Modal.Header>

        <Modal.Body id="ModalLogin-body">
          <Login onSubmitSuccess={handleClose} setVisitante={setVisitante}/>
        </Modal.Body>
    </Modal>
    </>
  );
}

export default ModalLogin;

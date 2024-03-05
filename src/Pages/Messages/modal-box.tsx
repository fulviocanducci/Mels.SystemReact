import { Modal } from "react-bootstrap";
import { IMessageAcademy, IMessageApp } from "../../@types";

interface IModalBox {
  message?: IMessageApp | IMessageAcademy | null | undefined;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ModalBox({ message, show, setShow }: IModalBox) {
  if (message === null) {
    return <></>;
  }
  return (
    <Modal show={show} fullscreen={true} onHide={() => setShow(false)} className="text-success">
      <Modal.Header closeButton className="text-success">
        <Modal.Title>{message?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-success">{message?.message}</Modal.Body>
    </Modal>
  );
}

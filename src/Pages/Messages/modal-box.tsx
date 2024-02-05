import { Modal } from "react-bootstrap";
import { IMessageApp } from "../../@types";

interface IModalBox {
  message?: IMessageApp | null | undefined;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ModalBox({ message, show, setShow }: IModalBox) {
  if (message === null) {
    return <></>;
  }
  return (
    <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{message?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message?.message}</Modal.Body>
    </Modal>
  );
}

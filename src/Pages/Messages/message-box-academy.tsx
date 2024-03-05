import { Alert, Button } from "react-bootstrap";
import { formats } from "../../utils";
import Block from "../../components/Block";
import * as Icon from "react-bootstrap-icons";
import { useState } from "react";
import { ModalBox } from "./modal-box";
import { IMessageAcademy } from "../../@types";

interface IMessageBoxAcademy {
  message: IMessageAcademy;
}

export function MessageBoxAcademy({ message }: IMessageBoxAcademy) {
  const [show, setShow] = useState<boolean>(false);
  const handleSetShow = () => {
    setShow(true);
  };
  return (
    <>
      <ModalBox show={show} setShow={setShow} message={message} />
      <Alert variant="success">
        <Alert.Heading className="mb-2">{message.title}</Alert.Heading>
        <div className="d-flex justify-content-between text-success">
          <small>
            <Icon.Calendar2Day /> {formats.date(message.sendAt)}
          </small>
          <small>
            {message.readAt != null ? (
              <>
                <Icon.Calendar3 />
                {" " + formats.date(message.readAt)}
              </>
            ) : (
              <>
                <Icon.Calendar2XFill /> {"Não lida ..."}
              </>
            )}
          </small>
        </div>
        <hr className="mb-2 mt-0" />
        <Block>
          <Button size="sm" variant="success" onClick={handleSetShow}>
            <Icon.Folder2Open /> Visualizar
          </Button>
        </Block>
      </Alert>
    </>
  );
}

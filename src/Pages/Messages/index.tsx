import { Tab, Tabs } from "react-bootstrap";
import Title from "../../components/Title";
import { useClient } from "../../@hooks";
import { useEffect, useState } from "react";
import { request } from "../../@requests";
import { isErrorToRedirect } from "../../utils/error";
import { IMessageAcademy, IMessageApp } from "../../@types";
import { MessageBox } from "./message-box";

export default function Messages() {
  const { client } = useClient();
  const [messageApp, setMessageApp] = useState<IMessageApp[] | null>(null);
  const [messageAcademy, setMessageAcademy] = useState<IMessageAcademy[] | null>(null);
  const setMessageReadAt = (message: IMessageApp) => {
    const messageAppNews: IMessageApp[] | null | undefined = messageApp?.map((item) => {
      if (item.id === message.id) {
        return message;
      }
      return item;
    });
    if (messageAppNews) {
      setMessageApp(messageAppNews);
    }
  };
  useEffect(() => {
    if (client != null && client.cpf && client.academyId) {
      request.messagesAppReceive(client.cpf, client.academyId).then((result) => {
        if (result.status === 200) {
          setMessageApp(result.data);
        }
      }, isErrorToRedirect);
    }
  }, [client]);
  return (
    <div>
      <Title description={"Mensagens"}></Title>
      <Tabs fill defaultActiveKey="receive" id="tab-messages" className="mb-3">
        <Tab eventKey="receive" title="Recebidas">
          {messageApp &&
            messageApp.length > 0 &&
            messageApp.map((item, index) => (
              <MessageBox message={item} key={index} setMessageReadAt={setMessageReadAt} />
            ))}
        </Tab>
        <Tab eventKey="sent" title="Enviadas">
          <div>envi</div>
        </Tab>
      </Tabs>
    </div>
  );
}

import { Button, Form, Tab, Tabs } from "react-bootstrap";
import Title from "../../components/Title";
import { useClient } from "../../@hooks";
import { useEffect, useState } from "react";
import { request } from "../../@requests";
import { isErrorToRedirect } from "../../utils/error";
import { IMessageAcademy, IMessageApp, IMessageSentBase } from "../../@types";
import { MessageBoxApp } from "./message-box-app";
import { MessageBoxAcademy } from "./message-box-academy";
import * as Icon from "react-bootstrap-icons";
import Block from "../../components/Block";
import ButtonLoading from "../../components/ButtonLoading";
import * as formik from "formik";
import * as yup from "yup";
import { formats } from "../../utils";
import Toast from "../../components/Toast";

export default function Messages() {
  const { Formik } = formik;
  const { client } = useClient();
  const [showToast, setShowToast] = useState<boolean>(false);
  const [stateUpdate, setStateUpdate] = useState<boolean>(false);
  const [selectKey, setSelectKey] = useState<string | null>("create");
  const [messageApp, setMessageApp] = useState<IMessageApp[] | null>(null);
  const [messageAcademy, setMessageAcademy] = useState<IMessageAcademy[] | null>(null);
  const schema = yup.object().shape({
    title: yup.string().required(),
    message: yup.string().required(),
  });
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

  function getMessagesAppReceive(cpf: string, academyId: number) {
    request
      .messagesAppReceive(cpf, academyId)
      .then((result) => {
        if (result.status === 200) {
          setMessageApp(result.data);
        }
      }, isErrorToRedirect)
      .finally(() => {
        setStateUpdate(false);
      });
  }

  function handleMessageAppUpdate() {
    setStateUpdate(true);
    setMessageApp(() => null);
    if (client != null && client.cpf && client.academyId) {
      getMessagesAppReceive(client.cpf, client.academyId);
    }
  }

  function getMessagesAcademySent(cpf: string, academyId: number) {
    request
      .messagesAcademySent(cpf, academyId)
      .then((result) => {
        if (result.status === 200) {
          console.log(result.data);
          setMessageAcademy(result.data);
        }
      }, isErrorToRedirect)
      .finally(() => {
        setStateUpdate(false);
      });
  }

  function handleMessageAcademyUpdate() {
    setStateUpdate(true);
    setMessageAcademy(() => null);
    if (selectKey === "sent" && messageAcademy === null && client != null && client.cpf && client.academyId) {
      getMessagesAcademySent(client.cpf, client.academyId);
    }
  }

  function formikOnSubmit(values: IMessageSentBase, actions: formik.FormikHelpers<IMessageSentBase>) {
    if (values && client) {
      setStateUpdate(true);
      setShowToast(true);
      const model: IMessageAcademy = {
        id: 0,
        academyId: client.academyId,
        cpf: client.cpf,
        title: values.title,
        message: values.message,
        sendAt: formats.nowDateTime(),
        readAt: null,
      };
      request
        .messagesAcademyCreate(model)
        .then((result) => {
          if (result.status === 201 && messageAcademy != null) {
            setMessageAcademy([result.data, ...messageAcademy]);
          }
        }, isErrorToRedirect)
        .finally(() => {
          actions.resetForm();
          setStateUpdate(false);
          setShowToast(false);
        });
    }
  }

  useEffect(() => {
    if (selectKey === "sent" && messageAcademy === null && client != null && client.cpf && client.academyId) {
      getMessagesAcademySent(client.cpf, client.academyId);
    }
    if (selectKey === "receive" && messageApp === null && client != null && client.cpf && client.academyId) {
      if (client != null && client.cpf && client.academyId) {
        getMessagesAppReceive(client.cpf, client.academyId);
      }
    }
  }, [selectKey, client, messageAcademy, messageApp]);

  return (
    <div>
      <Title description={"Mensagens"}></Title>
      <Tabs fill defaultActiveKey="create" id="tab-messages" className="mb-3" onSelect={(s) => setSelectKey(s)}>
        <Tab eventKey="create" title="Mensagem">
          <Formik
            validateOnChange={true}
            validationSchema={schema}
            onSubmit={formikOnSubmit}
            initialValues={{ title: "", message: "" }}
          >
            {({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => (
              <>
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-2" controlId="exampleForm.title">
                    <Form.Label className="mb-0">Titulo:</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      isValid={touched.title && !errors.title}
                      isInvalid={!!errors.title}
                      placeholder="Titulo da mensagem"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="exampleForm.title">
                    <Form.Label className="mb-0">Titulo:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      value={values.message}
                      onChange={handleChange}
                      isValid={touched.message && !errors.message}
                      isInvalid={!!errors.message}
                      placeholder="Mensagem"
                    />
                  </Form.Group>
                  <Block>
                    <Button
                      disabled={Array.isArray(errors) || Object.values(errors).toString() !== ""}
                      variant="success"
                      type="submit"
                      size="sm"
                      className="mt-2 mb-2"
                    >
                      {stateUpdate ? (
                        <>
                          <ButtonLoading /> Enviando ...
                        </>
                      ) : (
                        <>
                          <Icon.Pencil /> Enviar
                        </>
                      )}
                    </Button>
                  </Block>
                </Form>
              </>
            )}
          </Formik>
        </Tab>
        <Tab eventKey="receive" title="Recebidas">
          <div className="mb-2">
            <Block>
              <Button variant="success" size="sm" onClick={handleMessageAppUpdate}>
                {stateUpdate ? (
                  <>
                    <ButtonLoading /> Atualizando ...
                  </>
                ) : (
                  <>
                    <Icon.ArrowClockwise /> Atualizar
                  </>
                )}
              </Button>
            </Block>
          </div>
          {messageApp &&
            messageApp.length > 0 &&
            messageApp.map((item, index) => <MessageBoxApp message={item} key={index} setMessageReadAt={setMessageReadAt} />)}
        </Tab>
        <Tab eventKey="sent" title="Enviadas">
          <div className="mb-2">
            <Block>
              <Button variant="success" size="sm" onClick={handleMessageAcademyUpdate}>
                {stateUpdate ? (
                  <>
                    <ButtonLoading /> Atualizando ...
                  </>
                ) : (
                  <>
                    <Icon.ArrowClockwise /> Atualizar
                  </>
                )}
              </Button>
            </Block>
          </div>
          {messageAcademy &&
            messageAcademy.length > 0 &&
            messageAcademy.map((item, index) => <MessageBoxAcademy message={item} key={index} />)}
        </Tab>
      </Tabs>
      <Toast message="Mensagem enviada com êxito." type="success" show={showToast} change={setShowToast} />
    </div>
  );
}

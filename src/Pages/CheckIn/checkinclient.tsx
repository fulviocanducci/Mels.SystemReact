import { useEffect, useMemo, useState } from "react";
import Loading from "../../components/Loading";
import { ICheckIn, ICheckInClient } from "../../@types";
import { useNavigate, useParams } from "react-router-dom";
import { request } from "../../@requests";
import { isErrorToRedirect } from "../../utils/error";
import Title from "../../components/Title";
import { Badge, Button, ListGroup } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import Block from "../../components/Block";
import AlertMessageDefault from "../../components/AlertMessageDefault";
import { useClient } from "../../@hooks";
import Toast from "../../components/Toast";
import ButtonLoading from "../../components/ButtonLoading";
import ButtonGoBack from "../../components/ButtonGoBack";
import { formats } from "../../utils";
function messageSaveSuccess(): { message: string; type: "success" | "error" } {
  return { message: "CheckIn realizado com successo", type: "success" };
}
function messageCancelSuccess(): { message: string; type: "success" | "error" } {
  return { message: "CheckIn cancelado com successo", type: "success" };
}
function messageSaveError(): { message: string; type: "success" | "error" } {
  return { message: "Já existe o seu cadastro", type: "error" };
}
export default function CheckInClient() {
  const navigate = useNavigate();
  const [stateForm, setStateForm] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [showMessageData, setMessageData] = useState<{ message: string; type: "success" | "error" }>(() => messageSaveSuccess());
  const { client } = useClient();
  const { id } = useParams();
  const [items, setItems] = useState<ICheckInClient[] | null>(null);
  const [checkIn, setCheckIn] = useState<ICheckIn | null>(null);

  const itemsOpen = useMemo(() => {
    if (items) {
      return items?.filter((x) => x.cpf === "");
    }
    return [];
  }, [items]);
  const itemsClose = useMemo(() => {
    if (items) {
      return items?.filter((x) => x.cpf && x.cpf !== "" && x.cpf.length > 0);
    }
    return [];
  }, [items]);
  const itemExist = useMemo(() => {
    if (items && client) {
      return items?.filter((x) => client && x.cpf && x.cpf === client?.cpf).length === 1;
    }
    return false;
  }, [items]);
  function loadCheckInClientGet() {
    request.checkInClientGet(id).then((result) => {
      if (result.status === 200) {
        setItems(result.data);
      }
    }, isErrorToRedirect);
  }
  function loadCheckInGetByIdGet() {
    request.checkInGetById(id).then((result) => {
      if (result.status === 200) {
        setCheckIn(result.data);
      }
    }, isErrorToRedirect);
  }

  function getCheckInClient() {
    if (id) {
      loadCheckInClientGet();
      loadCheckInGetByIdGet();
    }
  }

  function cancelCheckInClient(id: number) {
    request.checkinclientCancel(id).then((result) => {
      if (result.status === 200) {
        loadCheckInClientGet();
        setMessageData(() => messageCancelSuccess());
        setShow(() => true);
      }
    }, isErrorToRedirect);
  }

  function handleAdd(model: ICheckInClient) {
    var newModel: ICheckInClient = {
      ...model,
      cpf: client?.cpf,
      dateConfirmationAt: null,
      timeConfirmationAt: null,
      dateSchedulingAt: checkIn?.dateAt,
      timeSchedulingAt: checkIn?.timeAt,
    };
    setStateForm(() => true);
    request
      .checkInClientPut(newModel)
      .then((result) => {
        if (result.status === 200) {
          if (result.data.status) {
            loadCheckInClientGet();
            setMessageData(() => messageSaveSuccess());
            setShow(() => true);
          } else {
            setMessageData(() => messageSaveError());
            setShow(() => true);
          }
        }
      }, isErrorToRedirect)
      .finally(() => {
        setStateForm(() => false);
      });
  }

  function handleGoBack() {
    navigate("/checkin");
  }

  useEffect(() => {
    if (id) {
      getCheckInClient();
    }
  }, [id]);

  if (items === null) {
    return <Loading />;
  }

  return (
    <div>
      <Title description="CheckIn Disponibilidade">
        <ButtonGoBack onClick={handleGoBack} className="me-1" />
      </Title>
      <div>
        {checkIn && (
          <>
            <div className="d-flex justify-content-between text-success">
              <div className="text-success">
                <h5>{checkIn.nameClass}</h5>
              </div>
              <div>
                <Badge bg="success">
                  {formats.date(checkIn.dateAt)} {checkIn.timeAt}
                </Badge>
              </div>
            </div>
            <hr className="mt-0" />
          </>
        )}
      </div>
      {itemsClose && itemsClose.length === 0 && (
        <div>
          <AlertMessageDefault title={"Alunos"} body={"Nenhum aluno realizou checkin."} />
        </div>
      )}
      {itemsClose && itemsClose.length > 0 && <div className="text-success mt-2 mb-1">Alunos:</div>}
      <div>
        {itemsClose && (
          <ListGroup>
            {itemsClose.map((data, index) => (
              <ListGroup.Item key={index} variant="success">
                <div className="d-flex justify-content-between">
                  <div>
                    <div>{data.name}</div>
                  </div>
                  {client &&
                    client.cpf === data.cpf &&
                    formats.calculeLessOneHour(
                      formats.replaceString(data.dateSchedulingAt, "T00:00:00", "") + " " + data.timeSchedulingAt
                    ) > 1 && (
                      <div>
                        <Button type="button" variant="danger" size="sm" onClick={() => cancelCheckInClient(data.id)}>
                          <Icon.Trash></Icon.Trash>
                        </Button>
                      </div>
                    )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
      {itemExist && (
        <div className="text-success mt-2 mb-1">
          <div>Vagas restantes: {itemsOpen.length}</div>
          <div>
            <small>
              <b>Observação:</b> você já está cadastrado nessa aula.
            </small>
          </div>
        </div>
      )}
      {!itemExist && (
        <div>
          <div className="text-success mt-2 mb-1">Vagas restantes: {itemsOpen.length}</div>
          {itemsOpen && (
            <ListGroup>
              {itemsOpen.map((data, index) => (
                <Block key={index} className={"mb-3"}>
                  <Button variant="success" size="sm" type="button" onClick={() => handleAdd(data)} disabled={itemExist}>
                    {stateForm ? (
                      <>
                        <ButtonLoading /> Adicionando ...
                      </>
                    ) : (
                      <>
                        <Icon.PlusCircle /> Adicionar
                      </>
                    )}
                  </Button>
                </Block>
              ))}
            </ListGroup>
          )}
        </div>
      )}
      <Toast message={showMessageData.message} type={showMessageData.type} show={show} change={setShow} />
    </div>
  );
}

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
import ReactHtmlParser from "@orrisroot/react-html-parser";

function messageSaveSuccess(): { message: string; type: "success" | "error" } {
  return { message: "CheckIn realizado com successo", type: "success" };
}
function messageCancelSuccess(): { message: string; type: "success" | "error" } {
  return { message: "CheckIn cancelado com successo", type: "success" };
}
function messageNotCancel(): { message: string; type: "success" | "error" } {
  return { message: "CheckIn não pode ser cancelado", type: "error" };
}
function messageSaveError(): { message: string; type: "success" | "error" } {
  return { message: "Já existe o seu cadastro ou vaga preenchida", type: "error" };
}
export default function CheckInClient() {
  const navigate = useNavigate();
  const [stateForm, setStateForm] = useState<boolean[] | null | undefined>(null);
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

  const itemsOpenFirst = useMemo(() => {
    if (items && items.length > 0) {
      return items[0];
    }
    return null;
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
        const count = result.data.length;
        if (count && count > 0) {
          let items = [];
          for (let i = 0; i < count; i++) {
            const item = false;
            items.push(item);
          }
          setStateForm(items);
        }
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
  const isCancelCheck = (data: ICheckInClient) => {
    return (
      formats.calculeLessOneHour(formats.replaceString(data.dateSchedulingAt, "T00:00:00", "") + " " + data.timeSchedulingAt) > 1
    );
  };

  function cancelCheckInClient(data: ICheckInClient) {
    if (isCancelCheck(data)) {
      request.checkinclientCancel(data.id).then((result) => {
        if (result.status === 200) {
          loadCheckInClientGet();
          setMessageData(() => messageCancelSuccess());
          setShow(() => true);
        }
      }, isErrorToRedirect);
    } else {
      setMessageData(() => messageNotCancel());
      setShow(() => true);
    }
  }

  function stateFormButton(index: number, state: boolean) {
    const data = stateForm?.map((item, i) => {
      if (i === index) return state;
      return item;
    });
    setStateForm(data);
  }

  function handleAdd(model: ICheckInClient, index: number) {
    var newModel: ICheckInClient = {
      ...model,
      cpf: client?.cpf,
      dateConfirmationAt: null,
      timeConfirmationAt: null,
      dateSchedulingAt: checkIn?.dateAt,
      timeSchedulingAt: checkIn?.timeAt,
    };
    stateFormButton(index, true);
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
        stateFormButton(index, false);
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
      <Title description="Check-in Disponibilidade">
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
                    <div>
                      <div>{data.name}</div>
                      {/* <hr className="mb-1 mt-0" />
                      <div>
                        <small>
                          <b>Dia:</b> {formats.date(data.dateSchedulingAt)} {data.timeSchedulingAt}
                        </small>
                      </div> */}
                    </div>
                  </div>
                  {client && client.cpf === data.cpf && isCancelCheck(data) && (
                    <div>
                      <Button type="button" variant="danger" size="sm" onClick={() => cancelCheckInClient(data)}>
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
              <b>Observação:</b> Sua presença está confirmada.
            </small>
          </div>
        </div>
      )}
      {!itemExist && (
        <div>
          <div className="text-success mt-2 mb-1">Vagas restantes: {itemsOpen.length}</div>
          {itemsOpenFirst && (
            <ListGroup>
              <Block key={0} className={"mb-3"}>
                <Button
                  variant="success"
                  size="sm"
                  type="button"
                  onClick={() => handleAdd(itemsOpenFirst, 0)}
                  disabled={itemExist}
                >
                  {stateForm && stateForm[0] ? (
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
            </ListGroup>
          )}
        </div>
      )}
      {checkIn && (
        <div className="mt-2">
          <div className="text-success">
            <h5>Recomendações</h5>
          </div>
          <hr className="mt-0 mb-1" />
          <div>
            <ul className="list-group text-success">
              {ReactHtmlParser(checkIn?.note.replaceAll("*", "<li class='list-group-item list-group-item-success'>"))}
            </ul>
          </div>
        </div>
      )}
      <Toast message={showMessageData.message} type={showMessageData.type} show={show} change={setShow} />
    </div>
  );
}

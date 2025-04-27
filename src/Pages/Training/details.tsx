import { useCallback, useEffect, useState } from "react";
import {
  TrainingFinishedRecord,
  TrainingItemsWithGroupRecord,
  TrainingRecord,
} from "../../@types";
import Loading from "../../components/Loading";
import { request } from "../../@requests";
import { setClientLocalStorage, useClient, useCpf } from "../../@hooks";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../components/Title";
import { Button, Form } from "react-bootstrap";
import Block from "../../components/Block";
import * as Icon from "react-bootstrap-icons";
import ButtonLoading from "../../components/ButtonLoading";
import LoadingStatus from "../../components/LoadingStatus";
import { formats, numbers } from "../../utils";
import { isErrorToRedirect } from "../../utils/error";
import VideoPlayer from "../../components/VideoPlayer";
import ButtonGoBack from "../../components/ButtonGoBack";
import Toast from "../../components/Toast";
function messageSaveSuccess(): { message: string; type: "success" | "error" } {
  return {
    message: "Treino terminado com sucesso",
    type: "success",
  };
}
export default function TrainingDetails() {
  const [showMessageData, setMessageData] = useState<{
    message: string;
    type: "success" | "error";
  }>(() => messageSaveSuccess());
  const { cpf } = useCpf();
  const { setClient } = useClient();
  const [show, setShow] = useState<boolean>(false);
  const [url, setUrl] = useState<string | null | undefined>(null);
  const [details, setDetails] = useState<TrainingRecord[] | null>(null);
  const [detailsGroup, setDetailsGroup] = useState<
    TrainingItemsWithGroupRecord[] | null
  >(null);
  const [stateForm, setStateForm] = useState<boolean>(false);
  const [stateIndexLoading, setStateIndexLoading] = useState<
    number | string | any
  >(-1);

  const { dayType } = useParams();
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  const toogleShow = () => setShow(() => !show);
  const statusBtn = useCallback(() => {
    if (details != null) {
      return details?.filter((c) => c.execute === false).length > 0;
    }
    return false;
  }, [details]);
  const handleConclude = () => {
    setStateForm(true);
    const value = numbers.onlyNumbers(cpf);
    const model: TrainingFinishedRecord = {
      cpf: value,
      dayType: dayType,
      lastTimeAt: formats.nowDateTime(),
    };
    request.trainingUpdateFinishRecord(model).then((result) => {
      if (result.status === 200) {
        request.exercicesReset(value, dayType).then((result) => {
          if (result.status === 200) {
            request
              .trainingUpdateClientCountActualGetClientRecord(value)
              .then((result) => {
                if (result.status === 200) {
                  setClient(result.data);
                  setClientLocalStorage(result.data);
                  setMessageData(() => messageSaveSuccess());
                  setShowMessage(() => true);
                  window.setTimeout(() => {
                    navigate(`/training`);
                  }, 1500);
                }
              }, isErrorToRedirect)
              .finally(() => setStateForm(false));
          }
        }, isErrorToRedirect);
      }
    }, isErrorToRedirect);
  };
  const handleChecked = (
    e: React.ChangeEvent<HTMLInputElement>,
    model: TrainingRecord,
    index: number | string
  ) => {
    const checked = e.target.checked;
    if (details !== null) {
      var modelChange = { ...model, execute: checked };
      setStateIndexLoading(index);
      request
        .trainingUpdateRecord(modelChange)
        .then((result) => {
          if (result.status === 200) {
            let detailsNew = details.map((item) => {
              if (item.id == model.id) {
                return { ...item, execute: checked };
              }
              return item;
            });
            setDetails(detailsNew);
          }
        }, isErrorToRedirect)
        .finally(() => {
          setStateIndexLoading(-1);
        });
    }
  };
  const handleShowVideo = (e: any, url: string) => {
    setUrl(() => url);
    toogleShow();
  };
  const handleGoBack = () => {
    navigate("/training");
  };
  useEffect(() => {
    if (cpf && dayType) {
      request.trainingByCpfAndDayTypeRecord(cpf, dayType).then((result) => {
        if (result.status === 200) {
          setDetails(result.data);
        }
      }, isErrorToRedirect);
    }
  }, [cpf, dayType]);
  useEffect(() => {
    if (details) {
      const items: TrainingItemsWithGroupRecord[] = [];
      if (details.length > 0) {
        for (const detail of details) {
          const item = items.find((x) => x.group === detail.group);
          if (!item) {
            items.push({ group: detail.group, items: [{ ...detail }] });
          } else {
            item.items.push({ ...detail });
          }
        }
      }
      setDetailsGroup(items);
    }
  }, [details]);

  function isDetailsGroupCount() {
    return (detailsGroup?.length ?? 0) > 1;
  }

  function detailsGroupComponent(item: TrainingRecord, index: number | string) {
    return (
      <div className="d-flex justify-content-between" key={index}>
        <div className="flex-grow-1" key={`key-${item.name}-${index}`}>
          <div className="p-1 mt-1">
            <Form.Check
              type="checkbox"
              id={`id-${item.name}-${index}`}
              label={item.name}
              onChange={(e) => handleChecked(e, item, index)}
              checked={item.execute}
              style={{ fontSize: "9pt", fontStyle: "bold" }}
            />
          </div>
        </div>
        <div>
          <div className="p-1">
            {item.execute && stateIndexLoading !== index && (
              <Icon.Check2Circle className="text-success" />
            )}
            {!item.execute && stateIndexLoading !== index && (
              <Icon.XLg className="text-secondary" />
            )}
            {stateIndexLoading === index && <LoadingStatus />}
          </div>
        </div>
        <div>
          <div className="p-1">
            {item.linkOfVideo && (
              <Button
                onClick={(e) => handleShowVideo(e, item.linkOfVideo)}
                variant="success"
                size="sm"
              >
                <Icon.Youtube />
              </Button>
            )}
            {!item.linkOfVideo && (
              <Button variant="light" size="sm" disabled={true}>
                <Icon.XCircle />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  function descriptionSerie(c: number) {
    return (
      <div
        className="text-secondary fw-medium fst-italic"
        style={{ fontSize: "8pt" }}
      >
        {c === 1 && "Série simples"}
        {c === 2 && "Bi-set"}
        {c === 3 && "Tri-set"}
        {c >= 4 && "Giant-set"}
      </div>
    );
  }

  if (details === null) {
    return <Loading />;
  }

  return (
    <>
      <div className="mb-5">
        <Title description={`Treino ${dayType}`}>
          <ButtonGoBack onClick={handleGoBack} className="me-2" />
        </Title>
        {!isDetailsGroupCount() &&
          details &&
          details.length > 0 &&
          details.map((item, index) => (
            <div className="alert alert-success mb-1 mt-0" key={index}>
              <>
                {descriptionSerie(1)}
                {detailsGroupComponent(item, index)}
              </>
            </div>
          ))}
        {isDetailsGroupCount() &&
          detailsGroup &&
          detailsGroup.length > 0 &&
          detailsGroup.map((item, index) => {
            return (
              <div className="alert alert-success mb-1 mt-0" key={index}>
                <>
                  {descriptionSerie(item.items.length)}
                  {item.items.map((element, indexElement) => {
                    return detailsGroupComponent(
                      element,
                      index + "" + indexElement
                    );
                  })}
                </>
              </div>
            );
          })}
        <div className="mt-2 mb-2">
          <Block>
            <Button
              variant="success"
              size="sm"
              disabled={statusBtn()}
              onClick={handleConclude}
            >
              {stateForm ? (
                <>
                  <ButtonLoading /> Concluindo ...
                </>
              ) : (
                <>
                  <Icon.CheckAll /> Concluir
                </>
              )}
            </Button>
          </Block>
        </div>
      </div>
      <VideoPlayer show={show} setShow={setShow} url={url} />
      <Toast
        message={showMessageData.message}
        type={showMessageData.type}
        show={showMessage}
        change={setShowMessage}
      />
    </>
  );
}

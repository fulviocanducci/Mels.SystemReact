import { useCallback, useEffect, useState } from "react";
import { TrainingFinishedRecord, TrainingRecord } from "../../@types";
import Loading from "../../components/Loading";
import { request } from "../../@requests";
import { useClient, useCpf } from "../../@hooks";
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

export default function TrainingDetails() {
  const { cpf } = useCpf();
  const { setClient } = useClient();
  const [show, setShow] = useState<boolean>(false);
  const [url, setUrl] = useState<string | null | undefined>(null);
  const [details, setDetails] = useState<TrainingRecord[] | null>(null);
  const [stateForm, setStateForm] = useState<boolean>(false);
  const [stateIndexLoading, setStateIndexLoading] = useState(-1);

  const { dayType } = useParams();
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
                  navigate(`/training`);
                }
              }, isErrorToRedirect)
              .finally(() => setStateForm(false));
          }
        }, isErrorToRedirect);
      }
    }, isErrorToRedirect);
  };
  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>, model: TrainingRecord, index: number) => {
    const checked = e.target.checked;
    if (details !== null) {
      var modelChange = { ...model, execute: checked };
      setStateIndexLoading(index);
      request
        .trainingUpdateRecord(modelChange)
        .then((result) => {
          if (result.status === 200) {
            let detailsNew = details.map((item) => {
              if (item.cpf === model.cpf && item.dayType === model.dayType && item.name === model.name) {
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
  if (details === null) {
    return <Loading />;
  }
  return (
    <>
      <div className="mb-5">
        <Title description={`Treino ${dayType}`}>
          <ButtonGoBack onClick={handleGoBack} className="me-2" />
        </Title>
        {details &&
          details.length > 0 &&
          details.map((item, index) => (
            <div className="d-flex justify-content-between border-bottom border-success" key={index}>
              <div className="p-2 mb-1 flex-grow-1" key={`key-${item.name}-${index}`}>
                <Form.Check
                  type="checkbox"
                  id={`id-${item.name}-${index}`}
                  label={item.name}
                  onChange={(e) => handleChecked(e, item, index)}
                  checked={item.execute}
                />
              </div>
              <div className="p-2 mb-1">
                <div>
                  {item.execute && stateIndexLoading !== index && <Icon.Check2Circle className="text-success" />}
                  {!item.execute && stateIndexLoading !== index && <Icon.XLg className="text-secondary" />}
                  {stateIndexLoading === index && <LoadingStatus />}
                </div>
              </div>
              <div className="p-2 mb-1">
                {item.linkOfVideo && (
                  <Button onClick={(e) => handleShowVideo(e, item.linkOfVideo)} variant="success" size="sm">
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
          ))}
        <div className="mt-2 mb-2">
          <Block>
            <Button variant="success" size="sm" disabled={statusBtn()} onClick={handleConclude}>
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
    </>
  );
}

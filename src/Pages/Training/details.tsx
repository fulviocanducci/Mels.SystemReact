import { useCallback, useEffect, useState } from "react";
import { TrainingRecord } from "../../@types";
import Loading from "../../components/Loading";
import { request } from "../../@requests";
import { useCpf } from "../../@hooks";
import { useParams } from "react-router-dom";
import Title from "../../components/Title";
import { Button, Form } from "react-bootstrap";
import Block from "../../components/Block";
import * as Icon from "react-bootstrap-icons";
import ButtonLoading from "../../components/ButtonLoading";
import LoadingStatus from "../../components/LoadingStatus";

export default function TrainingDetails() {
  const { cpf } = useCpf();
  const [details, setDetails] = useState<TrainingRecord[] | null>(null);
  const [stateForm, setStateForm] = useState<boolean>(false);
  const [stateIndexLoading, setStateIndexLoading] = useState(-1);
  const { dayType } = useParams();
  const statusBtn = useCallback(() => {
    if (details != null) {
      return details?.filter((c) => c.execute === false).length > 0;
    }
    return false;
  }, [details]);
  const handleChecked = (
    e: React.ChangeEvent<HTMLInputElement>,
    model: TrainingRecord,
    index: number
  ) => {
    const checked = e.target.checked;
    if (details !== null) {
      var modelChange = { ...model, execute: checked };
      setStateIndexLoading(index);
      request
        .trainingUpdateRecord(modelChange)
        .then(
          (result) => {
            if (result.status === 200) {
              let detailsNew = details.map((item) => {
                if (
                  item.cpf === model.cpf &&
                  item.dayType === model.dayType &&
                  item.name === model.name
                ) {
                  return { ...item, execute: checked };
                }
                return item;
              });
              setDetails(detailsNew);
            }
          },
          (error) => console.log(error)
        )
        .finally(() => {
          setStateIndexLoading(-1);
        });
    }
  };
  useEffect(() => {
    if (cpf && dayType) {
      request.trainingByCpfAndDayTypeRecord(cpf, dayType).then((result) => {
        if (result.status === 200) {
          setDetails(result.data);
        }
      });
    }
  }, [cpf, dayType]);
  if (details === null) {
    return <Loading />;
  }
  return (
    <div>
      <Title description={`Treino ${dayType}`} />
      {details &&
        details.length > 0 &&
        details.map((item, index) => (
          <div className="d-flex justify-content-between border-bottom border-success">
            <div className="p-3 mb-1" key={`key-${item.name}-${index}`}>
              <Form.Check
                type={"checkbox"}
                id={`id-${item.name}-${index}`}
                label={item.name}
                onChange={(e) => handleChecked(e, item, index)}
                checked={item.execute}
              />
            </div>
            <div className="p-3 mb-1">
              <div>
                {item.execute && stateIndexLoading !== index && (
                  <Icon.Check2Circle className="text-success" />
                )}
                {!item.execute && stateIndexLoading !== index && (
                  <Icon.XLg className="text-secondary" />
                )}
                {stateIndexLoading === index && <LoadingStatus />}
              </div>
            </div>
          </div>
        ))}
      <div className="mt-2">
        <Block>
          <Button variant="success" size="sm" disabled={statusBtn()}>
            {stateForm ? (
              <>
                <ButtonLoading /> Concluindo ...
              </>
            ) : (
              <>
                <Icon.CheckLg /> Concluir
              </>
            )}
          </Button>
        </Block>
      </div>
    </div>
  );
}

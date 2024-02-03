import React, { useEffect } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/Title";
import { TrainingGroupRecord } from "../../@types";
import { request } from "../../@requests";
import { useCpf } from "../../@hooks";
import { Alert, Button } from "react-bootstrap";
import { formats } from "../../utils";
import * as Icon from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Block from "../../components/Block";
import { isErrorToRedirect } from "../../utils/error";

export default function Training() {
  const { cpf } = useCpf();
  const [training, setTraining] = React.useState<TrainingGroupRecord[] | null>(
    null
  );
  const navigate = useNavigate();
  const handleTrainingDetails = (dayType: string) => {
    navigate(`/training-details/${dayType}/all`);
  };
  useEffect(() => {
    if (cpf) {
      request.trainingGroupRecord(cpf).then((result) => {
        if (result.status === 200) {
          setTraining(result.data);
        }
      }, isErrorToRedirect);
    }
  }, [cpf]);
  if (training === null) {
    return <Loading />;
  }
  return (
    <div>
      <Title description="Treinos" />
      {training &&
        training.length > 0 &&
        training.map((item, index) => {
          return (
            <Alert key={index} variant="success">
              <div className="d-flex justify-content-between border p-0 mt-2 rounded">
                <div>
                  <h5 className="mb-0 text-success">Treino {item.dayType}</h5>
                  <small className="mt-0 text-success">
                    Último:{" "}
                    {item.lastTimeAt
                      ? formats.date(item.lastTimeAt)
                      : "Iniciante..."}
                  </small>
                </div>
                <div>
                  <Block>
                    <Button
                      variant={"success"}
                      size={"sm"}
                      className="mt-2"
                      onClick={() => handleTrainingDetails(item.dayType)}
                    >
                      <Icon.BoxArrowInRight /> Começar
                    </Button>
                  </Block>
                </div>
              </div>
            </Alert>
          );
        })}
    </div>
  );
}

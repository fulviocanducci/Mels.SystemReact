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
import { isErrorToRedirect } from "../../utils/error";
import AlertMessageDefault from "../../components/AlertMessageDefault";

export default function Training() {
  const { cpf } = useCpf();
  const [training, setTraining] = React.useState<TrainingGroupRecord[] | null>(null);
  const [trainingLast, setTrainingLast] = React.useState<TrainingGroupRecord | null>(null);
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

  useEffect(() => {
    let last: TrainingGroupRecord | null = null;
    if (training !== null && training.length > 0) {
      last = training[0];
      for (let i = 1; i < training.length; i++) {
        if (formats.compareDateEn(last.lastTimeAt, training[i].lastTimeAt)) {
          last = training[i];
        }
      }
      setTrainingLast(last);
    }
  }, [training]);

  if (training === null) {
    return <Loading />;
  }

  return (
    <div>
      <Title description="Treinos" />
      {trainingLast && (
        <div className="text-success">
          <TopLastTimeAt trainingLast={trainingLast} />
        </div>
      )}
      {training && training.length === 0 && (
        <div>
          <AlertMessageDefault title={"Aviso"} body={"Não existe treino configurado"} />
        </div>
      )}
      {training &&
        training.length > 0 &&
        training.map((item, index) => {
          return (
            <Alert key={index} variant="success">
              <Alert.Heading className="mb-0 text-success">Treino {item.dayType}</Alert.Heading>
              <p className="mt-0 mb-0">
                <small className="text-success">
                  <LastTimeAt dateAt={item.lastTimeAt} />
                </small>
              </p>
              <hr className="mt-0 mb-2" />
              <div className="d-grid gap-2 mt-0">
                <Button variant={"success"} size={"sm"} className="mt-1" onClick={() => handleTrainingDetails(item.dayType)}>
                  <Icon.BoxArrowInRight /> Começar
                </Button>
              </div>
            </Alert>
          );
        })}
    </div>
  );
}

const dateInitialTraining = "01/01/2024";

function LastTimeAt({ dateAt }: { dateAt: string }) {
  if (dateAt) {
    const convertLastTimeAt = formats.date(dateAt);
    if (convertLastTimeAt === dateInitialTraining) {
      return <>Não iniciou esse treino ...</>;
    }
    return <>Último: {convertLastTimeAt}</>;
  }
  return <></>;
}

function TopLastTimeAt({ trainingLast }: { trainingLast: TrainingGroupRecord }) {
  if (trainingLast && trainingLast.lastTimeAt) {
    const convertLastTimeAt = formats.date(trainingLast.lastTimeAt);
    if (convertLastTimeAt === dateInitialTraining) {
      return <>Aluno iniciante ...</>;
    }
    return (
      <>
        Último treino: <b>{trainingLast.dayType}</b>, data: {formats.date(trainingLast.lastTimeAt)}
      </>
    );
  }
  return <></>;
}

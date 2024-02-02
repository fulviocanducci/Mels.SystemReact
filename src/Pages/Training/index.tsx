import React, { useEffect } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/Title";
import { TrainingGroupRecord } from "../../@types";
import { request } from "../../@requests";
import { useCpf } from "../../@hooks";
import { Button } from "react-bootstrap";
import { formats } from "../../utils";
import * as Icon from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

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
      });
    }
  });
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
            <div
              key={index}
              className="d-flex justify-content-between border border-success bg-light p-2 mt-2 rounded"
            >
              <div>
                <h4 className="mb-0 text-success">Treino {item.dayType}</h4>
                <small
                  className="mt-0"
                  style={{ fontSize: "12px", color: "#828282" }}
                >
                  Última vez:{" "}
                  {item.lastTimeAt
                    ? formats.date(item.lastTimeAt)
                    : "Iniciante..."}
                </small>
              </div>
              <div>
                <Button
                  variant={"success"}
                  size={"sm"}
                  className="mt-2"
                  onClick={() => handleTrainingDetails(item.dayType)}
                >
                  <Icon.BoxArrowInRight /> Começar
                </Button>
              </div>
            </div>
          );
        })}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useCpf } from "../../@hooks";
import { request } from "../../@requests";
import { useNavigate, useParams } from "react-router-dom";
import { IMovementReceiptYearRecord } from "../../@types";
import Loading from "../../components/Loading";
import Title from "../../components/Title";
import { Alert, Button } from "react-bootstrap";
import { formats } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPix } from "@fortawesome/free-brands-svg-icons/faPix";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons/faCreditCard";
import * as Icon from "react-bootstrap-icons";
import { isErrorToRedirect } from "../../utils/error";
import ButtonGoBack from "../../components/ButtonGoBack";

export default function Payments() {
  const { cpf } = useCpf();
  const { year } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<IMovementReceiptYearRecord[] | null>(null);
  useEffect(() => {
    if (cpf && year) {
      request.paymentsByYear(cpf, +year).then((result) => {
        if (result.status === 200) {
          setItems(result.data);
        }
      }, isErrorToRedirect);
    }
  }, [cpf, year]);

  function handleGoBack() {
    navigate("/payments");
  }

  if (items === null) {
    return <Loading />;
  }

  return (
    <div>
      <Title description={`Pagamentos: ${year}`}>
        <ButtonGoBack onClick={handleGoBack} className="me-1" />
      </Title>
      <div className="row">
        {items &&
          items.length > 0 &&
          items.map((data, index) => {
            return (
              <div className="col-md-6" key={index}>
                <Alert key={index} variant={"success"}>
                  <div className="mt-0 mb-0 d-flex justify-content-between text-success">
                    <div>{data.activityPaid}</div>
                    <div>
                      <b>{formats.money(data.valuePaid)}</b>
                    </div>
                  </div>
                  <div className="mt-0 mb-0 d-flex justify-content-between">
                    <div>
                      <small className="text-success">
                        {data.formOfPayment === "PIX" ? (
                          <FontAwesomeIcon icon={faPix} />
                        ) : (
                          <FontAwesomeIcon icon={faCreditCard} />
                        )}{" "}
                        {data.formOfPayment}
                      </small>
                    </div>
                    <div>
                      <small className="text-success">
                        {formats.date(data.dateAt)}
                      </small>
                    </div>
                  </div>
                </Alert>
              </div>
            );
          })}
        <div className="col-md-12 mb-3">
          <div className="d-grid gap-2 mt-0">
            <Button variant="success" size="sm" onClick={handleGoBack}>
              <Icon.Backspace /> Voltar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

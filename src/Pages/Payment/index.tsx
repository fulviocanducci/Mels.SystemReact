import { useEffect, useState } from "react";
import { request } from "../../@requests";
import { IMovementReceiptGroupYearRecord } from "../../@types";
import { Alert, Button } from "react-bootstrap";
import { useCpf } from "../../@hooks";
import * as Icon from "react-bootstrap-icons";
import Title from "../../components/Title";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import { isErrorToRedirect } from "../../utils/error";
import AlertMessageDefault from "../../components/AlertMessageDefault";

export default function Payment() {
  const { cpf } = useCpf();
  const navigate = useNavigate();
  const [items, setItems] = useState<IMovementReceiptGroupYearRecord[] | null>(null);
  useEffect(() => {
    if (cpf) {
      request.paymentsGroupByYear(cpf).then((result) => {
        if (result.status === 200) {
          setItems(result.data);
        }
      }, isErrorToRedirect);
    }
  }, [cpf]);

  function handleView(year: number) {
    navigate(`/payments/by/${year}/all`);
  }

  if (items === null) {
    return <Loading />;
  }

  return (
    <div>
      <Title description="Pagamentos" />
      <div className="row">
        {items && items.length === 0 && (
          <div>
            <AlertMessageDefault title={"Sem pagamentos."} body={"Não foi encontrado nenhum pagamento"} />
          </div>
        )}
        {items &&
          items.length > 0 &&
          items.map((data, index) => {
            return (
              <div className="col-md-6" key={index}>
                <Alert key={index} variant={"success"}>
                  <Alert.Heading className="mb-0 text-success">{data.year}</Alert.Heading>
                  <p className="mt-0 mb-0">
                    <small className="text-success">Quantidade de pagamentos: {data.count}</small>
                  </p>
                  <hr className="mt-0 mb-2" />
                  <div className="d-grid gap-2 mt-0">
                    <Button variant="success" size="sm" onClick={() => handleView(data.year)}>
                      <Icon.Folder2Open /> Visualizar
                    </Button>
                  </div>
                </Alert>
              </div>
            );
          })}
      </div>
    </div>
  );
}

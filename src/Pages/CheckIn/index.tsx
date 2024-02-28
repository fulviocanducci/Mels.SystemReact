import { useNavigate } from "react-router-dom";
import { useClient, useCpf } from "../../@hooks";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { ICheckIn } from "../../@types";
import Title from "../../components/Title";
import { Alert, Button } from "react-bootstrap";
import AlertMessageDefault from "../../components/AlertMessageDefault";
import * as Icon from "react-bootstrap-icons";
import { request } from "../../@requests";
import { isErrorToRedirect } from "../../utils/error";
import { formats } from "../../utils";

export default function CheckIn() {
  const { client } = useClient();
  const navigate = useNavigate();
  const [items, setItems] = useState<ICheckIn[] | null>(null);
  function getCheckIn() {
    console.log(client);
    if (client && client.academyId) {
      request.checkInGet(client.academyId).then((result) => {
        if (result.status === 200) {
          setItems(result.data);
        }
      }, isErrorToRedirect);
    }
  }

  function handleView(id: number) {
    navigate(`/checkin/client/${id}`);
  }

  useEffect(() => {
    getCheckIn();
  }, [client]);

  if (items === null) {
    return <Loading />;
  }
  return (
    <div>
      <Title description="CheckIn" />
      <div className="row">
        {items && items.length === 0 && (
          <div>
            <AlertMessageDefault title={"Sem CheckIn"} body={"Não foi encontrado nenhum checkin"} />
          </div>
        )}
        {items &&
          items.length > 0 &&
          items.map((data, index) => {
            return (
              <div className="col-md-6" key={index}>
                <Alert key={index} variant={"success"}>
                  <Alert.Heading className="mb-0 text-success">{data.nameClass}</Alert.Heading>
                  <p className="mt-0 mb-0">
                    <small className="text-success">
                      <b>Data:</b> {formats.date(data.dateAt)} {data.timeAt}
                    </small>
                  </p>
                  <hr className="mt-0 mb-2" />
                  <div className="d-grid gap-2 mt-0">
                    <Button variant="success" size="sm" onClick={() => handleView(data.id)}>
                      <Icon.Folder2Open /> Disponibilidade
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

import { useNavigate } from "react-router-dom";
import Title from "../../components/Title";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";

export default function SatisfactionDetails() {
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setStatus(true);
    }, 250);
  }, []);

  if (status === false) {
    return <Loading />;
  }

  return (
    <div>
      <Title description="Pesquisa" />
      <div className="alert alert-success d-flex align-items-center mb-2" role="alert">
        <div>
          <Icon.Check2Circle className="me-2"></Icon.Check2Circle>
        </div>
        <div> Pesquisa enviada com sucesso!</div>
      </div>
      <div>
        <Button variant="success" type="submit" size="sm" className="mt-0 mb-0 w-100" onClick={() => navigate("/satisfaction")}>
          <Icon.Backspace /> Voltar
        </Button>
      </div>
    </div>
  );
}

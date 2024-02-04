import Title from "../../components/Title";
import { useClient } from "../../@hooks";
import logo from "../../images/logo-l.png";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
export default function Home() {
  const { client } = useClient();
  const navigate = useNavigate();
  return (
    <div className="fs-6 text-success">
      <Title description="Home" />
      <div>BEM VINDO, {client?.name}</div>
      <div className="text-center mb-2">
        <img
          src={logo}
          alt=""
          className="img-fluid rounded-circle mx-auto d-block shadow"
        />
      </div>
      <div style={{ textAlign: "justify" }} className="mb-1 mt-2">
        Aqui você acompanha os seus{" "}
        <Button
          variant="link"
          className="m-0 p-0"
          onClick={() => navigate("/training")}
        >
          treinos
        </Button>
        ,{" "}
        <Button
          variant="link"
          className="m-0 p-0"
          onClick={() => navigate("/payments")}
        >
          pagamentos
        </Button>{" "}
        e poderá receber e enviar mensagens para a sua academia. Caso os dados
        da sua academia ainda não estejam aparecendo, converse com o seu
        treinador para te cadastrar no Aplicativo.
      </div>
      <div style={{ textAlign: "center" }} className="mb-1">
        Bons treinos !!!.
      </div>
    </div>
  );
}

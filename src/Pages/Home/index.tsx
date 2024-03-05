import Title from "../../components/Title";
import { useClient } from "../../@hooks";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useEffect } from "react";
import { request } from "../../@requests";
import { isErrorToRedirect, isFirstNameOrEmpty } from "../../utils/error";
import Block from "../../components/Block";
import * as Icon from "react-bootstrap-icons";
import ImageFallback from "../../components/ImageFallback";
export default function Home() {
  const { client } = useClient();
  const navigate = useNavigate();
  useEffect(() => {
    request.pingRequest().then(
      (result) => {},
      (error) => isErrorToRedirect(error)
    );
  }, []);
  return (
    <div className="fs-6 text-success">
      <Title description="Home" />
      <div className="text-center">
        Bem vindo, <b>{isFirstNameOrEmpty(client?.name)}</b>
      </div>
      <div className="text-center mb-2">
        <ImageFallback />
      </div>
      <div style={{ textAlign: "justify" }} className="mb-1 mt-2">
        <div className="text-center">Acompanhe</div>
        <Block className="mt-1">
          <Button variant="success" onClick={() => navigate("/assessments")}>
            <Icon.PersonExclamation /> Avaliações
          </Button>
        </Block>
        <Block className="mt-1">
          <Button variant="success" onClick={() => navigate("/updateregistration")}>
            <Icon.PencilFill /> Cadastro
          </Button>
        </Block>
        <Block className="mt-1">
          <Button variant="success" onClick={() => navigate("/checkin")}>
            <Icon.CheckCircle /> Check-in
          </Button>
        </Block>
        <Block className="mt-1">
          <Button variant="success" onClick={() => navigate("/training")}>
            <Icon.PersonBoundingBox /> Treinos
          </Button>
        </Block>
        <Block className="mt-1">
          <Button variant="success" onClick={() => navigate("/payments")}>
            <Icon.Coin /> Pagamentos
          </Button>
        </Block>
        <Block className="mt-1">
          <Button variant="success" onClick={() => navigate("/messages")}>
            <Icon.BodyText /> Mensagens
          </Button>
        </Block>
        <Block className="mt-1">
          <Button variant="success" onClick={() => navigate("/training")}>
            <Icon.PersonBoundingBox /> Treinos
          </Button>
        </Block>
        <Block className="mt-1">
          <Button variant="success" onClick={() => navigate("/logout")}>
            <Icon.DoorClosedFill /> Sair
          </Button>
        </Block>
      </div>
    </div>
  );
}

import { Button } from "react-bootstrap";
import { useLogout } from "../../@hooks";
import { useNavigate } from "react-router-dom";
import Title from "../../components/Title";
import Block from "../../components/Block";
import * as Icon from "react-bootstrap-icons";

export default function Logout() {
  const logout = useLogout();
  const navigate = useNavigate();
  const logoutWithRedirect = () => {
    logout();
    navigate("/", { replace: true });
  };
  return (
    <div>
      <Title description="Sair do Sistema?" />
      <Block>
        <Button variant={"success"} onClick={logoutWithRedirect} size="sm">
          <Icon.DoorClosed /> Sair
        </Button>
      </Block>
    </div>
  );
}

import { Button } from "react-bootstrap";
import { useLogout } from "../../@hooks";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const logout = useLogout();
  const navigate = useNavigate();
  const logoutWithRedirect = () => {
    logout();
    navigate("/", {replace: true});
  };
  return (
    <div>
      <Button variant={"danger"} onClick={logoutWithRedirect}>
        Sair
      </Button>
    </div>
  );
}

import { Button } from "react-bootstrap";
import { useLogout } from "../../@hooks";
import { redirectTo } from "../../utils";

export default function Logout() {
  const logout = useLogout();
  const logoutWithRedirect = () => {
    logout();
    redirectTo.host();
  };
  return (
    <div>
      <Button variant={"danger"} onClick={logoutWithRedirect}>
        Sair
      </Button>
    </div>
  );
}

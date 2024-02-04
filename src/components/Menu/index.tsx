import { BrowserRouter } from "react-router-dom";
import { Top } from "./top";
import { RoutesMenu } from "./routes-menu";
import { useLoggedIn, useMargin } from "../../@hooks";

function Menu() {
  const { isLoggedIn } = useLoggedIn();
  const { margin } = useMargin();
  return (
    <BrowserRouter>
      {isLoggedIn() && <Top />}
      <RoutesMenu marginTop={margin} />
    </BrowserRouter>
  );
}
export default Menu;

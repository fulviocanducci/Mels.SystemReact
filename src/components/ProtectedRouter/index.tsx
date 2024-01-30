import { LS_NAME_TOKEN } from "../../@const";
import { IProtectedRouter } from "../../@types";
import { redirectTo } from "../../utils";

const ProtectedRouter = ({ children, redirectPath = "/login" }: IProtectedRouter) => {
  const json = window.localStorage.getItem(LS_NAME_TOKEN);
  if (json && json.length > 0) {
    return children;
  }
  redirectTo.host();
  return <></>
};

export default ProtectedRouter;

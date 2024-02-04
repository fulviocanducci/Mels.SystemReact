import { Navigate } from "react-router-dom";
import { LS_NAME_TOKEN } from "../../@const";
import { IProtectedRouter } from "../../@types";

const ProtectedRouter = ({
  children,
  redirectPath = "/login",
}: IProtectedRouter) => {
  const json = window.localStorage.getItem(LS_NAME_TOKEN);
  if (json && json.length > 0) {
    return children;
  }
  return <Navigate to={redirectPath} replace />;
};

export default ProtectedRouter;

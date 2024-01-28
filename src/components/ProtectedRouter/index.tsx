import { Navigate } from "react-router-dom";

interface IProtectedRouter {
  children: JSX.Element;
  redirectPath?: string;
}

const LS_NAME_TOKEN = "@token";

const ProtectedRouter = ({ children, redirectPath = "/login" }: IProtectedRouter) => {
  const json = window.localStorage.getItem(LS_NAME_TOKEN);
  if (json) {
    const value = JSON.parse(json);
    if (value && value.token && value.token.length > 0) {
      return children;
    }
  }
  return <Navigate to={redirectPath} replace />;
};

export default ProtectedRouter;

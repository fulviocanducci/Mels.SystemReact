import { LoginContext } from "./base";
import { ClientRecord, ILoginProvider } from "../@types";
import React from "react";
import {
  LS_NAME_CLIENT,
  LS_NAME_CPF,
  LS_NAME_EXPIRATION,
  LS_NAME_TOKEN,
} from "../@const";

function LoginProvider({ children }: ILoginProvider) {
  const [token, setToken] = React.useState<string | null | undefined>(() => {
    return localStorage.getItem(LS_NAME_TOKEN);
  });
  const [cpf, setCpf] = React.useState<string | null | undefined>(() => {
    return localStorage.getItem(LS_NAME_CPF);
  });
  const [expiration, setExpiration] = React.useState<
    Date | string | null | undefined
  >(() => {
    return localStorage.getItem(LS_NAME_EXPIRATION);
  });
  const [client, setClient] = React.useState<ClientRecord | null | undefined>(
    () => {
      if (localStorage.getItem(LS_NAME_CLIENT) !== null) {
        return JSON.parse(localStorage.getItem(LS_NAME_CLIENT) ?? "");
      }
      return null;
    }
  );
  return (
    <LoginContext.Provider
      value={{
        client,
        setClient,
        token,
        setToken,
        cpf,
        setCpf,
        expiration,
        setExpiration,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;

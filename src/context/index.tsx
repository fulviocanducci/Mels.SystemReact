import { useState } from "react";
import { LoginContext } from "./base";
import { ClientRecord, ILoginProvider } from "../@types";

function LoginProvider({ children }: ILoginProvider) {
  const [token, setToken] = useState<string | null | undefined>(null);
  const [cpf, setCpf] = useState<string | null | undefined>(null);
  const [client, setClient] = useState<ClientRecord | null | undefined>(null);
  const [expiration, setExpiration] = useState<Date | null | undefined | string>(null);
  return <LoginContext.Provider value={{ token, setToken, cpf, setCpf, client, setClient, expiration, setExpiration }}>{children}</LoginContext.Provider>;
}

export default LoginProvider;

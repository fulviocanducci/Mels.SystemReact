import React, { useState } from "react";
import { LoginContext } from "./base";

interface ILoginProvider {
  children: React.ReactNode;
}

function LoginProvider({ children }: ILoginProvider) {
  const [token, setToken] = useState<string | null | undefined>();
  const [cpf, setCpf] = useState<string | null | undefined>();
  return <LoginContext.Provider value={{ token, setToken, cpf, setCpf }}>{children}</LoginContext.Provider>;
}

export default LoginProvider;

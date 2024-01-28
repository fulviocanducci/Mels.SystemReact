import React, { createContext } from "react";

interface ILoginContext {
  token?: string | null | undefined;
  cpf?: string | null | undefined;
  setToken: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setCpf: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}
export const LoginContext = createContext({} as ILoginContext);

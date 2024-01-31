import { useContext } from "react";
import { LoginContext } from "../context/base";
import { ClientRecord } from "../@types";
import {
  LS_NAME_CLIENT,
  LS_NAME_CPF,
  LS_NAME_EXPIRATION,
  LS_NAME_TOKEN,
} from "../@const";

export const useGetToken = (): string | null | undefined => {
  const context = useContext(LoginContext);
  const { token } = context;
  return token;
};

export const useSetToken = () => {
  const context = useContext(LoginContext);
  const { setToken } = context;
  const setTokenStorage = (token: string | null | undefined) => {
    localStorage.setItem(LS_NAME_TOKEN, "" + token);
    setToken(token);
  };
  return { setToken, setTokenStorage };
};

export const useGetCpf = (): string | null | undefined => {
  const context = useContext(LoginContext);
  const { cpf } = context;
  return cpf;
};

export const useSetCpf = () => {
  const context = useContext(LoginContext);
  const { setCpf } = context;
  const setCpfStorage = (cpf: string | null | undefined) => {
    localStorage.setItem(LS_NAME_CPF, "" + cpf);
    setCpf(cpf);
  };
  return { setCpf, setCpfStorage };
};

export const useGetClient = (): ClientRecord | null | undefined => {
  const context = useContext(LoginContext);
  const { client } = context;
  return client;
};

export const useSetClient = () => {
  const context = useContext(LoginContext);
  const { setClient } = context;
  const setClientStorage = (clientRecord: ClientRecord) => {
    localStorage.setItem(LS_NAME_CLIENT, JSON.stringify(clientRecord));
    setClient(clientRecord);
  };
  return { setClient, setClientStorage };
};

export const useGetExpiration = (): Date | null | undefined | string => {
  const context = useContext(LoginContext);
  const { expiration } = context;
  return expiration;
};

export const useSetExpiration = () => {
  const context = useContext(LoginContext);
  const { setExpiration } = context;
  const setExpirationStorage = (
    expiration: Date | null | undefined | string
  ) => {
    localStorage.setItem(LS_NAME_EXPIRATION, "" + expiration);
    setExpiration(expiration);
  };
  return { setExpiration, setExpirationStorage };
};

const removeLocalStorage = () => {
  localStorage.removeItem(LS_NAME_TOKEN);
  localStorage.removeItem(LS_NAME_CPF);
  localStorage.removeItem(LS_NAME_CLIENT);
  localStorage.removeItem(LS_NAME_EXPIRATION);
};

export const useLogout = () => {
  const context = useContext(LoginContext);
  const { setCpf, setToken, setClient, setExpiration } = context;
  const logout = () => {
    removeLocalStorage();
    setCpf(null);
    setToken(null);
    setClient(null);
    setExpiration(null);
  };
  return logout;
};
export function useLoginStatusState() {
  const context = useContext(LoginContext);
  const isStatus = () => {
    if (
      !(context.client && context.token && context.cpf && context.expiration)
    ) {
      removeLocalStorage();
    }
    return context.client && context.token && context.cpf && context.expiration;
  };
  return isStatus;
}
export function useLoginStatusStorage() {
  const context = useContext(LoginContext);
  const isStatus = (): boolean => {
    const token = localStorage.getItem(LS_NAME_TOKEN);
    const cpf = localStorage.getItem(LS_NAME_CPF);
    const client = localStorage.getItem(LS_NAME_CLIENT);
    const expiration = localStorage.getItem(LS_NAME_EXPIRATION);
    const status =
      token !== null && cpf !== null && client !== null && expiration !== null;
    if (status) {
      const { setCpf, setToken, setClient, setExpiration } = context;
      setCpf(cpf);
      setToken(token);
      setClient(JSON.parse(client));
      setExpiration(expiration);
    }
    return status;
  };
  return isStatus;
}

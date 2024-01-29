import { useContext } from "react";
import { LoginContext } from "../context/base";
import { ClientRecord } from "../@types";
import { LS_NAME_CLIENT, LS_NAME_CPF, LS_NAME_EXPIRATION, LS_NAME_TOKEN } from "../@const";

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
  const setClientStorage = (clientRecord: ClientRecord | null | undefined) => {
    localStorage.setItem(LS_NAME_CLIENT, JSON.stringify(clientRecord));
    setClient(clientRecord);
  };
  return { setClient, setClientStorage };
};

export const useGetExpiration = (): Date | null | undefined => {
  const context = useContext(LoginContext);
  const { expiration } = context;
  return expiration;
};

export const useSetExpiration = () => {
  const context = useContext(LoginContext);
  const { setExpiration } = context;
  const setExpirationStorage = (expiration: Date | null | undefined) => {
    localStorage.setItem(LS_NAME_EXPIRATION, "" + expiration);
    setExpiration(expiration);
  };
  return { setExpiration, setExpirationStorage };
};

export const useLogout = () => {
  const context = useContext(LoginContext);
  const { setCpf, setToken, setClient } = context;
  const logout = () => {
    localStorage.removeItem(LS_NAME_TOKEN);
    localStorage.removeItem(LS_NAME_CPF);
    localStorage.removeItem(LS_NAME_CLIENT);
    setCpf(null);
    setToken(null);
    setClient(null);
  };
  return logout;
};

export function useLoginStatus() {
  const isStatus = (): boolean => {
    const token = localStorage.getItem(LS_NAME_TOKEN);
    const cpf = localStorage.getItem(LS_NAME_CPF);
    const client = localStorage.getItem(LS_NAME_CLIENT);
    return token !== null && cpf !== null && client !== null;
  };
  return isStatus;
}

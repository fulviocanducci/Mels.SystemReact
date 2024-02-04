import { useContext } from "react";
import { LoginContext } from "../context/base";
import {
  LS_NAME_CLIENT,
  LS_NAME_CPF,
  LS_NAME_EXPIRATION,
  LS_NAME_LOGIN_CPF,
  LS_NAME_TOKEN,
  LS_NAME_MARGIN,
} from "../@const";
import { ClientRecord } from "../@types";

export const useLoggedIn = () => {
  const { token, cpf, client, expiration } = useContext(LoginContext);
  const isLoggedIn = (): boolean => {
    return (
      token !== null && cpf !== null && client !== null && expiration != null
    );
  };
  return { isLoggedIn };
};

export const useMargin = () => {
  const { margin, setMargin } = useContext(LoginContext);
  return { margin, setMargin };
};

export const useToken = () => {
  const { token, setToken } = useContext(LoginContext);
  return { token, setToken };
};

export const useCpf = () => {
  const { cpf, setCpf } = useContext(LoginContext);
  return { cpf, setCpf };
};

export const useClient = () => {
  const { client, setClient } = useContext(LoginContext);
  return { client, setClient };
};

export const useExpiration = () => {
  const { expiration, setExpiration } = useContext(LoginContext);
  return { expiration, setExpiration };
};

export const removeLocalStorage = () => {
  localStorage.removeItem(LS_NAME_TOKEN);
  localStorage.removeItem(LS_NAME_CPF);
  localStorage.removeItem(LS_NAME_CLIENT);
  localStorage.removeItem(LS_NAME_EXPIRATION);
  localStorage.removeItem(LS_NAME_MARGIN);
};

export const useLoginLocalStorage = () => {
  const setLoginStorage = (cpf: string) =>
    localStorage.setItem(LS_NAME_LOGIN_CPF, cpf);
  const getLoginStorage = (): string | null =>
    localStorage.getItem(LS_NAME_LOGIN_CPF);
  return { setLoginStorage, getLoginStorage };
};

export const setClientLocalStorage = (client: ClientRecord) => {
  localStorage.setItem(LS_NAME_CLIENT, JSON.stringify(client));
};

export const setLocalStorage = (
  cpf: string,
  token: string,
  expiration: Date | string,
  client: ClientRecord,
  margin: string
) => {
  setClientLocalStorage(client);
  localStorage.setItem(LS_NAME_TOKEN, token);
  localStorage.setItem(LS_NAME_CPF, cpf);
  localStorage.setItem(LS_NAME_EXPIRATION, "" + expiration);
  localStorage.setItem(LS_NAME_MARGIN, "" + margin);
};

export const useLogout = () => {
  const { setCpf, setExpiration, setToken, setClient, setMargin } =
    useContext(LoginContext);
  const logout = () => {
    removeLocalStorage();
    setCpf(null);
    setExpiration(null);
    setToken(null);
    setClient(null);
    setMargin("0");
  };
  return logout;
};

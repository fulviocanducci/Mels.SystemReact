import { useContext } from "react";
import { LoginContext } from "../context/base";
import {
  LS_NAME_CLIENT,
  LS_NAME_CPF,
  LS_NAME_EXPIRATION,
  LS_NAME_TOKEN,
} from "../@const";
import { ClientRecord } from "../@types";

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

const removeLocalStorage = () => {
  localStorage.removeItem(LS_NAME_TOKEN);
  localStorage.removeItem(LS_NAME_CPF);
  localStorage.removeItem(LS_NAME_CLIENT);
  localStorage.removeItem(LS_NAME_EXPIRATION);
};

export const setClientLocalStorage = (client: ClientRecord) => {
  localStorage.setItem(LS_NAME_CLIENT, JSON.stringify(client));
};

export const setLocalStorage = (
  cpf: string,
  token: string,
  expiration: Date | string,
  client: ClientRecord
) => {
  setClientLocalStorage(client);
  localStorage.setItem(LS_NAME_TOKEN, token);
  localStorage.setItem(LS_NAME_CPF, cpf);
  localStorage.setItem(LS_NAME_EXPIRATION, "" + expiration);
};

export const useLogout = () => {
  const logout = () => {
    removeLocalStorage();
  };
  return logout;
};

export function useLoginStatus() {
  const { token, cpf, client, expiration } = useContext(LoginContext);
  const isStatus = (): boolean => {
    if (token && cpf && client && expiration) {
      return true;
    }
    return false;
  };
  return { isStatus };
}

import { LoginRecord } from "../@types";
import { api } from "./base";
import { numbers } from "../utils";

const authentication = (cpf: string) => {
  const value = numbers.onlyNumbers(cpf);
  return api.post<LoginRecord>("/api/authentication", { cpf: value });
};

const request = {
  authentication,
};

export { request };

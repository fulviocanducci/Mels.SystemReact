import {
  ILoginRecord,
  IMovementReceiptGroupYearRecord,
  IMovementReceiptYearRecord,
} from "../@types";
import { api } from "./base";
import { numbers } from "../utils";

const authentication = (cpf: string) => {
  const value = numbers.onlyNumbers(cpf);
  return api.post<ILoginRecord>("/api/authentication", { cpf: value });
};

const paymentsGroupByYear = (cpf: string) => {
  const value = numbers.onlyNumbers(cpf);
  return api.get<IMovementReceiptGroupYearRecord[]>(
    `/api/movementreceipt/${value}/group/by/year`
  );
};

const paymentsByYear = (cpf: string, year: number) => {
  const value = numbers.onlyNumbers(cpf);
  return api.get<IMovementReceiptYearRecord[]>(
    `/api/movementreceipt/${value}/by/${year}/all`
  );
};

const request = {
  authentication,
  paymentsGroupByYear,
  paymentsByYear,
};

export { request };

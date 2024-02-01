import {
  ClientRecord,
  ILoginRecord,
  IMovementReceiptGroupYearRecord,
  IMovementReceiptYearRecord,
  ISelect2,
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

const clientUpdate = (clientRecord: ClientRecord) => {
  return api.post<ClientRecord>("/api/client", clientRecord);
};

const citySelect2 = async (name: string) => {
  const result = await api.get<ISelect2[]>("/api/city/select2", {
    params: { name },
  });
  if (result.status === 200) {
    return result.data;
  }
  return [];
};

const request = {
  authentication,
  paymentsGroupByYear,
  paymentsByYear,
  clientUpdate,
  citySelect2,
};

export { request };

import {
  ClientRecord,
  IAssessment,
  ICheckInClient,
  ILoginRecord,
  IMessageAcademy,
  IMessageApp,
  IMovementReceiptGroupYearRecord,
  IMovementReceiptYearRecord,
  ISelect2,
  TrainingFinishedRecord,
  TrainingGroupRecord,
  TrainingRecord,
} from "../@types";
import { api } from "./base";
import { numbers } from "../utils";

const pingRequest = () => {
  return api.get<string>("/api/ping");
};

const authentication = (cpf: string) => {
  const value = numbers.onlyNumbers(cpf);
  return api.post<ILoginRecord>("/api/authentication", { cpf: value });
};

const paymentsGroupByYear = (cpf: string) => {
  const value = numbers.onlyNumbers(cpf);
  return api.get<IMovementReceiptGroupYearRecord[]>(`/api/movementreceipt/${value}/group/by/year`);
};

const paymentsByYear = (cpf: string, year: number) => {
  const value = numbers.onlyNumbers(cpf);
  return api.get<IMovementReceiptYearRecord[]>(`/api/movementreceipt/${value}/by/${year}/all`);
};

const clientUpdate = (clientRecord: ClientRecord) => {
  return api.post<ClientRecord>("/api/client", clientRecord);
};

const citySelect2 = async (name: string) => {
  const result = await api.get<ISelect2[]>("/api/city/select2", {
    params: { name },
  });
  if (result.status === 200) {
    console.log(result);
    return result.data;
  }
  return [];
};

const trainingGroupRecord = (cpf: string) => {
  const value = numbers.onlyNumbers(cpf);
  return api.get<TrainingGroupRecord[]>(`/api/exercices/${value}`);
};

const trainingByCpfAndDayTypeRecord = (cpf: string, dayType: string) => {
  const value = numbers.onlyNumbers(cpf);
  return api.get<TrainingRecord[]>(`/api/exercices/${value}/type/${dayType}`);
};

const trainingUpdateRecord = (model: TrainingRecord) => {
  return api.post("/api/exercices", model);
};

const trainingUpdateFinishRecord = (model: TrainingFinishedRecord) => {
  return api.post("/api/training", model);
};

const trainingUpdateClientCountActualGetClientRecord = (cpf?: string) => {
  return api.get(`/api/client/count/actual/more/one/${cpf}`);
};

const exercicesReset = (cpf: string, dayType: string | undefined) => {
  return api.post(`/api/exercices/reset/${cpf}/type/${dayType}`);
};

const messagesAppReceive = (cpf: string, academyId: number) => {
  const value = numbers.onlyNumbers(cpf);
  return api.get<IMessageApp[]>(`api/messageapp/received/${value}/${academyId}/messages`);
}; ///api/messageapp/received/{cpf}/{academyId}/messages

const messagesAppByIdReceive = (id: number) => {
  return api.get<IMessageApp>(`api/messageapp/${id}`);
}; ///api/messageapp/{id}

const messagesAcademySent = (cpf: string, academyId: number) => {
  const value = numbers.onlyNumbers(cpf);
  return api.get<IMessageAcademy[]>(`api/messageacademy/sent/${value}/${academyId}/messages`);
}; ///api/messageacademy/sent/{cpf}/{academyId}/messages

const messagesAcademyCreate = (value: IMessageAcademy) => {
  return api.post<IMessageAcademy>("/api/messageacademy", value);
}; // /api/messageacademy

const messagesAcademyByIdSent = (id: number) => {
  return api.get<IMessageAcademy>(`api/messageacademy/${id}`);
}; ///api/messageacademy/{id}

const assessmentGetAll = (cpf: string) => {
  const value = numbers.onlyNumbers(cpf);
  return api.get<Array<IAssessment>>(`api/assessment/${value}`);
};

const clientPhotoSend = (form: FormData) => {
  return api.postForm("/api/client/photo", form);
};

const checkInGet = (id: number | string | undefined | null, cpf: string | undefined | null) => {
  return api.get(`/api/checkin/actualdatetimeat/${id}/${cpf}`);
};

const checkInClientGet = (id: number | string | undefined | null) => {
  return api.get(`/api/checkinclient/classroom/${id}`);
};

const checkInClientPut = (model: ICheckInClient) => {
  return api.put(`/api/checkinclient/${model.id}`, model);
};
const checkInGetById = (id: number | string | undefined | null) => {
  return api.get(`/api/checkin/${id}`);
};

const checkinclientCancel = (id: number | string | undefined | null) => {
  return api.put(`/api/checkinclient/renew/${id}`);
};

const request = {
  authentication,
  paymentsGroupByYear,
  paymentsByYear,
  clientUpdate,
  citySelect2,
  trainingGroupRecord,
  trainingByCpfAndDayTypeRecord,
  trainingUpdateRecord,
  trainingUpdateFinishRecord,
  exercicesReset,
  pingRequest,
  messagesAppReceive,
  messagesAppByIdReceive,
  messagesAcademySent,
  messagesAcademyCreate,
  messagesAcademyByIdSent,
  assessmentGetAll,
  clientPhotoSend,
  checkInGet,
  checkInClientGet,
  checkInClientPut,
  checkInGetById,
  checkinclientCancel,
  trainingUpdateClientCountActualGetClientRecord,
};

export { request };

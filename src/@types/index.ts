export interface IMessageSentBase {
  title: string;
  message: string;
}
export interface IMessageApp {
  allowReply: boolean;
  id: number;
  academyId: number;
  cpf: string;
  title: string;
  message: string;
  sendAt: string;
  readAt: string;
}
export interface IMessageAcademy {
  id: number;
  academyId: number;
  cpf: string;
  title: string;
  message: string;
  sendAt: string;
  readAt?: string | null;
}
export interface IVideoPlayer {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  url: string | null | undefined;
}
export interface TrainingGroupRecord {
  count: number;
  dayType: string;
  lastTimeAt: string;
}

export interface TrainingRecord {
  cpf: string;
  name: string;
  dayType: string;
  linkOfVideo: string;
  execute: boolean;
}

export interface TrainingFinishedRecord {
  cpf?: string | null | undefined;
  dayType?: string;
  lastTimeAt?: string;
}

export interface ISelect2 {
  label: string;
  value: number | undefined;
}
export interface IFormControlCpf {
  name: string;
  value: string;
  isValid?: boolean | undefined;
  isInvalid?: boolean | undefined;
  placeholder?: string | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export interface IFormControlDate {
  name: string;
  value: string;
  isValid?: boolean | undefined;
  isInvalid?: boolean | undefined;
  placeholder?: string | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export interface IFormControlPhone {
  name: string;
  value: string;
  isValid?: boolean | undefined;
  isInvalid?: boolean | undefined;
  placeholder?: string | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export interface IRedirectPath {
  redirectPath: string | null | undefined;
}

export interface IProtectedRouter {
  children: JSX.Element;
  redirectPath?: string;
}

export interface IFormValues {
  cpf: string;
}

export interface IToast {
  message: string;
  type: "success" | "error";
  show: boolean;
  change: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ILoginRecord {
  token: string;
  expiration: Date;
  clientRecord: ClientRecord;
}

export interface IAssessment {
  id: number;
  cpf: string;
  dateAssessment: string;
  fileName: string;
}

export interface IMovementReceiptGroupYearRecord {
  year: number;
  count: number;
}

export interface ClientRecord {
  cpf: string;
  name: string;
  sex: number;
  dateBirthday: string;
  email: string;
  address: string;
  cityId: number;
  cityRecord: CityRecord;
  phoneOne: string;
  phoneTwo: string;
  academyId: number;
  academyDocument: string;
  addressNumber: string;
  district: string;
}

export interface CityRecord {
  id: number;
  name: string;
  uf: string;
}
export interface IRouteMenu {
  marginTop: string | null | undefined;
}
export interface ILoginContext {
  token?: string | null;
  cpf?: string | null;
  client?: ClientRecord | null;
  expiration?: Date | null | string;
  margin?: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setCpf: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setClient: React.Dispatch<React.SetStateAction<ClientRecord | null | undefined>>;
  setExpiration: React.Dispatch<React.SetStateAction<Date | null | string | undefined>>;
  setMargin: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

export interface ILoginProvider {
  children: React.ReactNode;
}

export interface IBlock {
  children: React.ReactNode;
  className?: string | undefined | null;
}

export interface IButtonGoBack {
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string | undefined;
}
export interface ITitle {
  description: string | null | undefined;
  children?: React.ReactNode | null | undefined;
}

export interface IMovementReceiptYearRecord {
  cpf: string;
  dateAt: string;
  valuePaid: number;
  formOfPayment: string;
  activityPaid: string;
}

export interface ICheckIn {
  id: number;
  count: number;
  countAccept: number;
  dateAt: string;
  timeAt: string;
  nameClass: string;
  academyId: number;
  classroomId: number;
  able: boolean;
  note: string;
  classId: number;
  cpf: string;
}

export interface ICheckInClient {
  id: number;
  cpf?: string | null | undefined;
  classroomId: number;
  confirmation: boolean;
  dateConfirmationAt?: string | null | undefined;
  timeConfirmationAt?: string | null | undefined;
  dateSchedulingAt?: string | null | undefined;
  timeSchedulingAt?: string | null | undefined;
  name?: string | null | undefined;
}

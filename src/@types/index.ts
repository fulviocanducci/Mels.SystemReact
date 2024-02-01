export interface IFormControlCpf {
  name: string;
  value: string;
  isValid?: boolean | undefined;
  isInvalid?: boolean | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export interface IFormControlDate {
  name: string;
  value: string;
  isValid?: boolean | undefined;
  isInvalid?: boolean | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export interface IFormControlPhone {
  name: string;
  value: string;
  isValid?: boolean | undefined;
  isInvalid?: boolean | undefined;
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
  show: boolean;
  change: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ILoginRecord {
  token: string;
  expiration: Date;
  clientRecord: ClientRecord;
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
}

export interface CityRecord {
  id: number;
  name: string;
  uf: string;
}

export interface ILoginContext {
  token?: string | null | undefined;
  cpf?: string | null | undefined;
  client?: ClientRecord | null | undefined;
  expiration?: Date | null | string;
  setToken: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setCpf: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setClient: React.Dispatch<
    React.SetStateAction<ClientRecord | null | undefined>
  >;
  setExpiration: React.Dispatch<
    React.SetStateAction<Date | null | undefined | string>
  >;
}

export interface ILoginProvider {
  children: React.ReactNode;
}

export interface IBlock {
  children: React.ReactNode;
}

export interface ITitle {
  description: string | null | undefined;
}

export interface IMovementReceiptYearRecord {
  cpf: string;
  dateAt: string;
  valuePaid: number;
  formOfPayment: string;
  activityPaid: string;
}

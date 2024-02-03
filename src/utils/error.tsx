import { AxiosError } from "axios";
import { redirectTo } from ".";
import { removeLocalStorage } from "../@hooks";

export function isErrorToRedirect(error: AxiosError) {
  if (error.request?.status === 401) {
    removeLocalStorage();
    redirectTo.host();
  }
}

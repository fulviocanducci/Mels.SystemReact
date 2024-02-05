import { AxiosError } from "axios";
import { redirectTo } from ".";
import { removeLocalStorage } from "../@hooks";

export function isErrorToRedirect(error: AxiosError) {
  if (error.request?.status === 401) {
    removeLocalStorage();
    redirectTo.host();
  }
}

export function isFirstNameOrEmpty(name: string | undefined | null) {
  if (name) {
    const names = name.split(" ");
    if (names.length > 0) {
      return names[0];
    }
  }
  return "";
}

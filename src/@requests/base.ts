import axios from "axios";
import { LS_NAME_TOKEN } from "../@const";
import { redirectTo } from "../utils";

// export const api = axios.create({
//   baseURL: "https://api.melfitness.com.br",
// });

export const api = axios.create({
  baseURL: "https://localhost:44324",
});

api.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem(LS_NAME_TOKEN);
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest?.__isRetryRequest) {
      redirectTo.host();
    }
    return Promise.reject(error);
  }
);

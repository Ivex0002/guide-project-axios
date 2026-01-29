import axios, { type AxiosInstance } from "axios";

type AxiosType = "default" | "auth" | "external";

const BASE_URL = "https://auth.example.com/";
const EXTERNAL_URL = "https://external.api.com/";

export const createAxiosInstance = (type: AxiosType): AxiosInstance => {
  switch (type) {
    // withCredentials: true으로 인증 정보 자동 첨부 활성화
    case "auth":
      return axios.create({
        baseURL: BASE_URL,
        timeout: 10000,
        withCredentials: true,
      });

    case "external":
      return axios.create({
        baseURL: EXTERNAL_URL,
        timeout: 5000,
      });

    default:
      return axios.create({
        baseURL: BASE_URL,
        timeout: 30000,
      });
  }
};

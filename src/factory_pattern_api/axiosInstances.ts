import { createAxiosInstance } from "./createAxiosInstance";

export const defaultAPI = createAxiosInstance("default");
export const authAPI = createAxiosInstance("auth");
export const externalAPI = createAxiosInstance("external");

// auth 전용 인터셉터
// token이 있다면 헤더에 자동으로 삽입
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

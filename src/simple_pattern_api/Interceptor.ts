import { axiosInstance } from "./instance";

// 요청 인터셉터
// 토큰 자동 삽입 구조
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
// 401 코드(권한이 유효하지 않음) 받을시 토큰 만료처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
    }
    return Promise.reject(error);
  },
);

import axios from "axios";

const BASE_URL = "https://api.example.com/";
const TIMEOUT = 30000;

export const axiosInstance = axios.create({
  // API 서버의 공통 URL
  // 운영중인 서버가 가지고 있는 도메인에 따라 다름
  baseURL: BASE_URL,

  // 요청이 완료되기까지 기다리는 최대 시간(ms)
  // 타임아웃 시 ECONNABORTED 에러 발생
  timeout: TIMEOUT,

  // 인증 옵션
  // true: 쿠키, 인증 헤더, TLS 인증서 등을 자동으로 포함
  // false: 포함하지 않음
  withCredentials: false,

  // 서버에게 “JSON 형식으로 요청 본문을 보낸다”라고 알림
  headers: {
    "Content-Type": "application/json",
  },
});

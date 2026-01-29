import axios, { type AxiosInstance } from "axios";
import type { TokenStorage } from "./tokenManager";

type AxiosType = "default" | "auth" | "external";

/**
 * 클래스 문법을 통해 모두 같은 토큰 스토리지를 참조하도록 보장
 */
export class AxiosInstanceFactory {
  private readonly tokenStorage: TokenStorage;

  constructor(tokenStorage: TokenStorage) {
    this.tokenStorage = tokenStorage;
  }

  /**
   * 외부에서 사용할 생성 함수
   * 직접적인 생성과 인터셉터 구성은 다른 함수에 위임
   */
  create(type: AxiosType, baseURL: string): AxiosInstance {
    const instance = this.createAxios(type, baseURL);

    if (type === "auth") {
      this.attachAuthInterceptor(instance);
    }

    return instance;
  }

  /**
   * 인스턴스에 인터셉터를 구성하는 역할
   */
  private attachAuthInterceptor(instance: AxiosInstance) {
    instance.interceptors.request.use((req) => {
      const token = this.tokenStorage.getAccessToken();
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
      return req;
    });
  }

  /**
   * create() 함수에서 사용할 내부 함수
   * 분기처리와 실제 생성을 담당
   */
  private createAxios(type: AxiosType, baseURL: string): AxiosInstance {
    switch (type) {
      case "auth":
        return axios.create({
          baseURL,
          timeout: 10000,
          withCredentials: true,
        });

      case "external":
        return axios.create({
          baseURL,
          timeout: 5000,
        });

      default:
        return axios.create({
          baseURL,
          timeout: 30000,
        });
    }
  }
}

import type { AxiosError } from "axios";
import { HttpClient } from "./httpClient";
import type { TokenStorage } from "./tokenManager";

export class ApiClientFactory {
  private tokenStorage: TokenStorage;

  constructor(tokenStorage: TokenStorage) {
    this.tokenStorage = tokenStorage;
  }

  // HTTP 클라이언트 생성
  public createHttpClient(
    baseURL: string,
    onError?: (error: AxiosError) => void,
  ): HttpClient {
    return new HttpClient({
      baseURL,
      tokenStorage: this.tokenStorage,
      onError,
    });
  }

  // web socket 등의 클라이언트 추가 가능
  // 클래스 문법을 쓰는 이유: 여러개의 클라이언트 인스턴스가 동일한 토큰 스토리지를 참조하도록 보장
}

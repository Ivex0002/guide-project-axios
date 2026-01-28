import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type Method,
} from "axios";
import type { TokenStorage } from "./tokenManager";

import { LOGIN_PAGE_URL } from "./api";
import { refreshAccessToken } from "./refreshAccessToken";

type AxiosErrorHandler = (error: AxiosError) => void | Promise<never>;

/**
 * 리프레시 무한 루프 방지용
 *
 * [예상 요류 시나리오]
 *
 * - 요청 → 401
 *
 * - refresh 시도
 *
 * - refresh 실패 또는 refresh 후에도 401
 *
 * - 다시 인터셉터 진입
 *
 * => _retry 태그로 해당 무한루프 방지
 */
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  tokenStorage: TokenStorage;
  onError?: (error: AxiosError) => void;
}

const NO_AUTH_URLS_SET = new Set<string>([
  // 인증을 회피할 url 목록
]);

/**
 * 토큰 삽입과 요청만 처리
 * 에러는 핸들러로 위임
 */
export class HttpClient {
  private client: AxiosInstance;
  private tokenStorage: TokenStorage;
  private onError?: AxiosErrorHandler;

  private refreshPromise: Promise<string | null> | null = null;

  constructor(config: HttpClientConfig) {
    this.tokenStorage = config.tokenStorage;
    this.onError = config.onError;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 요청 인터셉터 - 토큰 자동 삽입
    this.client.interceptors.request.use(
      (config) => {
        // console.log({ config })

        // NO_AUTH_URLS_SET에 포함된 url요청은 인증회피
        const url = config.url || "";
        const isNoAuth = NO_AUTH_URLS_SET.has(url);
        if (isNoAuth) return config;

        const token = this.tokenStorage.getAccessToken();

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // 응답 인터셉터 - 에러 처리
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig;
        const status = error.response?.status;

        // 401 코드 → 토큰 만료로 간주
        if (status === 401 && !originalRequest?._retry) {
          originalRequest._retry = true;

          try {
            // refresh 요청 (refresh용 axios 인스턴스 따로 사용 > 무한루프 방지)
            if (!this.refreshPromise) {
              this.refreshPromise = refreshAccessToken();
            }
            const newToken = await this.refreshPromise;
            if (!newToken) throw new Error("Refresh token returned null");

            this.tokenStorage.setAccessToken(newToken);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            // 리프래쉬 에러가 있다면 에러 핸들러로 던지기
            if (this.onError) await this.onError(refreshError as AxiosError);
            this.tokenStorage.clearTokens();
            // 로그인 페이지로 이동
            window.location.href = LOGIN_PAGE_URL;
            return Promise.reject(refreshError);
          } finally {
            this.refreshPromise = null;
          }
        }

        if (this.onError) await this.onError(error);
        return Promise.reject(error);
      },
    );
  }

  /**
   * 통합 요청 핸들러
   */
  public async request<Req = void, Res = unknown>(
    url: string,
    method: Method,
    data?: Req,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<Res>> {
    try {
      const requestConfig: AxiosRequestConfig = {
        url,
        method,
        data,
        ...config,
      };

      // console.log(requestConfig)

      const res = await this.client.request<Res>(requestConfig);
      return res;
    } catch (error) {
      if (this.onError) {
        await this.onError(error as AxiosError);
      }
      throw error;
    }
  }
}

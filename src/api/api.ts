import { ApiClientFactory } from "./apiClient";
import { TokenManager } from "./tokenManager";
import { throwHttpError } from "./throwHttpError";

// 공통된 요청 url
export const BASE_URL = "base-url/";
export const LOGIN_PAGE_URL = `${BASE_URL}login`;

export const tokenManager = new TokenManager();
export const apiFactory = new ApiClientFactory(tokenManager);

export const httpClient = apiFactory.createHttpClient(BASE_URL, throwHttpError);

// 요청 방식 예시
// httpClient.request("some/endpoint", "GET");

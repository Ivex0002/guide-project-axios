import { AxiosInstanceFactory } from "./AxiosInstanceFactory";
import { TokenManager } from "./tokenManager";

const BASE_URL = "https://oz.example.com/";
const EXTERNAL_URL = "https://external.api.com/";

// 토큰 매니저 생성
const tokenManager = new TokenManager();

// 인스턴스들을 생성하는 클래스(팩토리 패턴)
// 해당 클래스로 생성되는 인스턴스들은 모두 동일한 토큰을 참조하도록 보장
const apiFactory = new AxiosInstanceFactory(tokenManager);

// 팩토리를 통해 생성된 인스턴스들
export const defaultAPI = apiFactory.create("default", BASE_URL);
export const authAPI = apiFactory.create("auth", BASE_URL);
export const externalAPI = apiFactory.create("external", EXTERNAL_URL);

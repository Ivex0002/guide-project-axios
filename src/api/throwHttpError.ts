import { AxiosError } from "axios";

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public detail?: string;

  constructor(status: number, message: string, code?: string, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

/**
 * 백엔드 공통 에러 응답 타입 (백엔트 코드에 따라 변경 필요)
 */
interface BaseResponse {
  message: string;
  error: {
    code?: string;
    detail?: string;
  } | null;
}

/**
 * 응답 상태 코드에 따라 에러 메시지를 배출해주는 메서드
 * 모든 에러를 throw 처리 하므로 반드시 try-catch 내부에서 사용해야됨
 */
export const throwHttpError = (error: AxiosError): never => {
  const status = error.response?.status || 0;
  const data = error.response?.data;
  const errorResponse = isErrorResponse(data) ? data : null;

  // 서버에서 보낸 에러 메시지 우선 사용
  const message = errorResponse?.message || getDefaultErrorMessage(status);
  const code = errorResponse?.error?.code;
  const detail = errorResponse?.error?.detail;

  throw new ApiError(status, message, code, detail);
};

/**
 * 서버에서 보낸 에러 타입인가 확인
 */
const isErrorResponse = (data: unknown): data is BaseResponse => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const response = data as BaseResponse;

  // error 객체가 있고, code 또는 detail이 존재하면 에러 응답
  return (
    response.error !== null &&
    response.error !== undefined &&
    (typeof response.error.code === "string" ||
      typeof response.error.detail === "string")
  );
};

/**
 * HTTP 상태 코드별 기본 에러 메시지
 */
const getDefaultErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return "잘못된 요청입니다.";
    case 401:
      return "인증이 필요합니다.";
    case 403:
      return "접근 권한이 없습니다.";
    case 404:
      return "요청한 리소스를 찾을 수 없습니다.";
    case 409:
      return "리소스 충돌이 발생했습니다.";
    case 422:
      return "입력값을 확인해주세요.";
    case 429:
      return "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.";
    case 500:
      return "서버 오류가 발생했습니다.";
    case 502:
      return "게이트웨이 오류가 발생했습니다.";
    case 503:
      return "서비스를 일시적으로 사용할 수 없습니다.";
    case 504:
      return "게이트웨이 시간 초과가 발생했습니다.";
    default:
      if (status >= 500) return "서버 오류가 발생했습니다.";

      if (status >= 400) return "요청 처리 중 오류가 발생했습니다.";

      return "알 수 없는 오류가 발생했습니다.";
  }
};

import { storeAccessToken } from "../store/storeAccessToken";

export interface TokenStorage {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  clearTokens(): void;
}

/**
 * 토큰 관리 전략:
 *
 * 1. Access Token (단기)
 *    - 메모리에만 저장
 *    - XSS로 탈취되어도 1시간 후 만료(명세서 기준)
 *    - 탭 닫으면 즉시 삭제
 *
 * 2. Refresh Token (장기)
 *    - httpOnly 쿠키 (서버 관리)
 *    - JavaScript로 접근 불가
 *    - XSS로 탈취 불가능
 *
 * 3. 추가 방어:
 *    - CSP 설정
 *    - 입력값 sanitization
 *    - React 자동 이스케이핑 활용
 */
export class TokenManager implements TokenStorage {
  /**
   * Access token을 메모리에 저장
   *
   * localStorage 대비 장점:
   * - 탭 종료 시 자동 삭제 (노출 시간 최소화)
   * - 물리적 디스크 접근 방지
   *
   * 한계:
   * - XSS 공격 실행 시 탈취 가능
   * - 완전한 방어를 위해 CSP, httpOnly 쿠키 병행 필요
   */
  private accessToken: string | null = null;

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
    storeAccessToken.getState().setAccessToken(token);
  }

  clearTokens(): void {
    this.accessToken = null;
    storeAccessToken.getState().clearAccessToken();
  }
}

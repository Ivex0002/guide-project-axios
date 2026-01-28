import axios from "axios";
import { BASE_URL } from "./api";

type RefreshAccessToken = {
  detail: string;
  data: {
    access: string;
  };
};

/**
 * 리프레쉬 메서드
 * @returns {} {"access": "string"}
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshClient = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    const { data } = await refreshClient.post<RefreshAccessToken>(
      // 리프레쉬 요청 url(백엔트 코드에 따라 변경 필요)
      "/v1/auth/refresh",
      {},
    );
    // console.log(data)
    if (data.data.access) {
      return data.data.access;
    }

    return null;
  } catch {
    return null;
  }
};

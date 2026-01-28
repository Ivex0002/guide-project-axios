import { useState } from "react";
import { httpClient } from "./api/api";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

type HttpMethodOption = (typeof HTTP_METHODS)[number];

export function App() {
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<HttpMethodOption>("GET");

  const handleReq = () => {
    httpClient.request(url, method);
  };
  return (
    <>
      <textarea
        onChange={(e) => setUrl(e.target.value)}
        placeholder="요청 주소를 입력해주세요"
      ></textarea>
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value as HttpMethodOption)}
      >
        {HTTP_METHODS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <button onClick={handleReq}>req</button>
    </>
  );
}

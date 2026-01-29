import type { AxiosInstance } from "axios";
import { useState } from "react";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

type HttpMethodOption = (typeof HTTP_METHODS)[number];

export function RequestUI({
  name,
  instance,
}: {
  name: string;
  instance: AxiosInstance;
}) {
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<HttpMethodOption>("GET");

  const handleReq = () => {
    instance.request({ url: url, method: method });
  };

  return (
    <div className="request-ui-wrapper">
      <span>{name}</span>
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
    </div>
  );
}

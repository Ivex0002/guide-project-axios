import "./app.css";
import { RequestUI } from "./RequestUI";

// 단일 생성된 인스턴스
import { axiosInstance } from "./simple_pattern_api/instance";

// 팩토리 패턴으로 생성된 인스턴스들
import { defaultAPI } from "./factory_pattern_api/axiosInstances";
import { authAPI } from "./factory_pattern_api/axiosInstances";
import { externalAPI } from "./factory_pattern_api/axiosInstances";

const apiInstances = [
  { name: "axiosInstance", instance: axiosInstance },
  { name: "defaultAPI", instance: defaultAPI },
  { name: "authAPI", instance: authAPI },
  { name: "externalAPI", instance: externalAPI },
];

export function App() {
  return (
    <>
      {apiInstances.map(({ name, instance }) => (
        <RequestUI key={name} name={name} instance={instance} />
      ))}
    </>
  );
}

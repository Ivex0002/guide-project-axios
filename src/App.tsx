import "./app.css";
import { RequestUI } from "./RequestUI";

// 단일 생성된 인스턴스
import { simpleInstance } from "./simple_pattern_api/instance";

// 팩토리 패턴으로 생성된 인스턴스들
import {
  authAPI,
  defaultAPI,
  externalAPI,
} from "./factory_pattern_api/axiosInstances";

const apiInstances = [
  { name: "simple", instance: simpleInstance },
  { name: "default", instance: defaultAPI },
  { name: "auth", instance: authAPI },
  { name: "external", instance: externalAPI },
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

import { simpleInstance } from "../instance";

export interface User {
  id: number;
  name: string;
}

export const getUser = async (): Promise<User> => {
  const { data } = await simpleInstance.get<User>("/user");
  return data;
};

// hooks/useUser.ts
import { useEffect, useState } from "react";
import { getUser, type User } from "./getUser";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  return user;
};

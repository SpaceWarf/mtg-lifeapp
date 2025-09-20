import { User } from "firebase/auth";
import { createContext } from "react";

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => Promise.resolve(undefined),
  logout: () => Promise.resolve(undefined),
});

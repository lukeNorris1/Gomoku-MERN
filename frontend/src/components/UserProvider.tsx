import { User, Credential } from "../types";
import { UserContext } from "../context";
import { useLocalStorage } from "../hooks";
import dotenv from "dotenv";
import { post, setToken } from "../utils/http";
import { API_HOST } from "../constants";

type UserProviderProps = {
  children: React.ReactNode;
};

dotenv.config();

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useLocalStorage<User | undefined>("user", undefined);
  if (user) {
    setToken(user.token);
  }

  const login = async (username: string, password: string) => {
    try {
      const user = await post<Credential, User>(
        `http://localhost:5000/api/auth/login`,
        {
          username,
          password,
        }
      );
      setUser(user);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "Unable to login at this moment, please try again";
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const user = await post<Credential, User>(
        `http://localhost:5000/api/auth/register`,
        {
          username,
          password,
        }
      );
      setUser(user);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "Unable to login at this moment, please try again";
    }
  };

  const logout = () => {
    setUser(undefined);
    setToken("");
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

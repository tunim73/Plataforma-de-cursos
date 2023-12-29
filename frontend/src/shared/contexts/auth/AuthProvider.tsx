import { useEffect, useState } from "react";
import { User } from "types/User";
import { authApi } from "services";
import { AuthContext } from ".";
import { isApiException } from "types";

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    profile();
  }, []);

  const profile = async () => {
    const data = await authApi.profile();

    if (!data) {
      setUser(null);
      return;
    }
    setUser(data);
  };

  const signin = async (email: string, password: string, type: string) => {
    const data = await authApi.signin(email, password, type);

    if (!data) return false;

    if (isApiException(data)) return data.message;

    setUser(data.user);
    localStorage.setItem("authToken", data.token);
    return true;
  };

  const signout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout, profile }}>
      {children}
    </AuthContext.Provider>
  );
};

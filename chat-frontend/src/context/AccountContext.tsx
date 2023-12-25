import { ReactElement, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AccountContext = createContext({ loggedIn: null });

export interface IUser {
  username?: string;
  loggedIn: boolean | null;
}

const UserContext = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<IUser>({ loggedIn: null });
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:4000/auth/login", {
      credentials: "include",
    })
      .catch(() => {
        setUser({ loggedIn: false });
        return;
      })
      .then((response) => {
        if (!response || !response.ok || response.status >= 400) {
          setUser({ loggedIn: false });
          return;
        }
        return response.json();
      })
      .then((data) => {
        if (!data) {
          setUser({ loggedIn: false });
          return;
        }
        setUser({ ...data });
        navigate("/home");
      });
  }, []);
  return (
    <AccountContext.Provider value={{ user, setUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;

import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

interface UserType {
  userId: string;
  username: string;
}

const defaultUser: UserType = {
  userId: "",
  username: "",
};

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextType {
  user: UserType;
  setUser: Dispatch<SetStateAction<UserType>>;
}

const defaultContextValue: UserContextType = {
  user: defaultUser,
  setUser: () => {},
};

const UserContext = createContext<UserContextType>(defaultContextValue);

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserType>(defaultUser);

  useEffect(() => {
    if (!user.userId) {
      fetch("http://localhost:8000/profile", {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch profile");
          return res.json();
        })
        .then((data) => {
          console.log("Fetched user data:", data);
          setUser(data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUser({ userId: "", username: "" });
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;

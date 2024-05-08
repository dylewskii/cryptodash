import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { fetchPortfolioList } from "@/lib/portfolioUtils";

// ------------------------------- TYPES -------------------------------
// shape of user data
interface UserType {
  userId: string;
  username: string;
  isAuthenticated: boolean;
}

// default user object (used before user authentication is confirmed)
const defaultUser: UserType = {
  userId: "",
  username: "",
  isAuthenticated: false,
};

// shape of each portfolio item
interface PortfolioType {
  name: string;
  amount: number;
}

// default empty array for portfolio items
const defaultPortfolio: PortfolioType[] = [];

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextType {
  user: UserType;
  setUser: Dispatch<SetStateAction<UserType>>;
  portfolioList: PortfolioType[];
  setPortfolioList: Dispatch<SetStateAction<PortfolioType[]>>;
}

const defaultContextValue: UserContextType = {
  user: defaultUser,
  setUser: () => {},
  portfolioList: defaultPortfolio,
  setPortfolioList: () => {},
};

const UserContext = createContext<UserContextType>(defaultContextValue);

// ---------------------------- UserProvider ----------------------------
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserType>(defaultUser);
  const [portfolioList, setPortfolioList] =
    useState<PortfolioType[]>(defaultPortfolio);

  // fetch user's portfolio when userId becomes available
  useEffect(() => {
    if (user.userId) {
      // fetch string array of every coin held by user in DB
      fetchPortfolioList()
        .then((portfolioArrayFromDB) => {
          setPortfolioList(portfolioArrayFromDB);
        })
        .catch((error) => console.error("Error fetching portfolio", error));
    }
  }, [user.userId]);

  return (
    <UserContext.Provider
      value={{ user, setUser, portfolioList, setPortfolioList }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;

import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { fetchPortfolioCoinData, fetchPortfolio } from "@/lib/portfolioUtils";

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

// detailed information about each coin
interface DetailedCoin {
  name: string;
  amount: string;
  totalValue: number;
  info: {
    symbol: string;
    image: string;
    currentPrice: number;
    marketCap: number;
    ath: number;
    webSlug: string;
  };
}

// Overall portfolio structure
interface Portfolio {
  list: string[];
  detailed: DetailedCoin[];
}

// Default value for the portfolio
const defaultPortfolio: Portfolio = {
  list: [],
  detailed: [],
};

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextType {
  user: UserType;
  setUser: Dispatch<SetStateAction<UserType>>;
  portfolio: Portfolio;
  setPortfolio: Dispatch<SetStateAction<Portfolio>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const defaultContextValue: UserContextType = {
  user: defaultUser,
  setUser: () => {},
  portfolio: defaultPortfolio,
  setPortfolio: () => {},
  loading: false,
  setLoading: () => {},
};

const UserContext = createContext<UserContextType>(defaultContextValue);

// ---------------------------- UserProvider ----------------------------
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserType>(defaultUser);
  const [portfolio, setPortfolio] = useState<Portfolio>(defaultPortfolio);
  const [loading, setLoading] = useState<boolean>(false);

  // fetch user's portfolio when userId becomes available
  useEffect(() => {
    if (user.userId) {
      setLoading(true);

      fetchPortfolio()
        .then((portfolioObjects) => {
          // extract coin names into a string array
          const portfolioCoinNameList = portfolioObjects.map(
            (coin) => coin.name
          );

          // fetch detailed data for each coin (price, ath, marketCap etc)
          fetchPortfolioCoinData(portfolioCoinNameList)
            .then((detailedCoinsArray) => {
              // combine amount data w/ detailed coin data
              const combinedDetailedCoins = detailedCoinsArray.map((coin) => {
                // find the corresponding coin object from the user's portfolio based on the coin name
                const foundCoin = portfolioObjects.find(
                  (item) => item.name.toLowerCase() === coin.name.toLowerCase()
                );

                const amount = foundCoin ? foundCoin.amount : 0;
                const currentPrice = coin.currentPrice || 0;
                const totalValue = amount * currentPrice;

                // return a new object for each coin combining the detailed API data with the amount from the user's portfolio
                return {
                  name: coin.name,
                  amount: foundCoin ? foundCoin.amount.toString() : "0",
                  totalValue,
                  info: {
                    symbol: coin.symbol,
                    image: coin.image,
                    currentPrice: coin.currentPrice,
                    marketCap: coin.marketCap,
                    ath: coin.ath,
                    webSlug: coin.webSlug,
                  },
                };
              });

              setPortfolio((prevPortfolio) => ({
                ...prevPortfolio,
                detailed: combinedDetailedCoins,
              }));

              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching detailed coin data:", error);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.error("Error fetching portfolio", error);
          setLoading(false);
        });
    }
  }, [user.userId]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        portfolio,
        setPortfolio,
        loading,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;

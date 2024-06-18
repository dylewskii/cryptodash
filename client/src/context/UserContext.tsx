import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import { fetchPortfolioCoinData, fetchPortfolio } from "@/lib/portfolioUtils";
import fetchProfilePicUrl from "@/lib/fetchProfilePicUrl";
import socket from "../socket/socket";
// ------------------------------- TYPES -------------------------------
// shape of user data
interface UserType {
  userId: string;
  username: string;
  email: string;
  isAuthenticated: boolean;
}

// default user object (used before user authentication is confirmed)
const defaultUser: UserType = {
  userId: "",
  username: "",
  email: "",
  isAuthenticated: false,
};

// shape of image data
interface imageData {
  thumb: string;
  sm: string;
  lg: string;
}

// detailed information about each coin
export interface DetailedCoin {
  id: string;
  name: string;
  amount: string;
  totalValue: number;
  info: {
    symbol: string;
    image: imageData;
    currentPrice: number;
    marketCap: number;
    ath: number;
    webSlug: string;
  };
}

// overall portfolio structure
interface Portfolio {
  list: string[];
  detailed: DetailedCoin[];
}

// default value for the portfolio
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
  profilePicUrl: string;
  setProfilePicUrl: Dispatch<SetStateAction<string>>;
}

const defaultContextValue: UserContextType = {
  user: defaultUser,
  setUser: () => {},
  portfolio: defaultPortfolio,
  setPortfolio: () => {},
  loading: false,
  setLoading: () => {},
  profilePicUrl: "",
  setProfilePicUrl: () => {},
};

const UserContext = createContext<UserContextType>(defaultContextValue);

// ---------------------------- UserProvider ----------------------------
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserType>(defaultUser);
  const [portfolio, setPortfolio] = useState<Portfolio>(defaultPortfolio);
  const [loading, setLoading] = useState<boolean>(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");

  const fetchAndSetProfilePicUrl = useCallback(async () => {
    if (!user.isAuthenticated) {
      return 0;
    }

    try {
      const url = await fetchProfilePicUrl();
      if (url) {
        setProfilePicUrl(url);
      }
    } catch (error) {
      console.error("Error fetching profile picture URL", error);
    }
  }, [user.isAuthenticated]);

  const fetchAndSetPortfolioData = useCallback(async () => {
    if (!user.userId) {
      return;
    }

    setLoading(true);

    try {
      // fetch array of coin objects from user's portfolio
      const portfolioObjects = await fetchPortfolio();

      // extract coin names into a string array
      const portfolioCoinNameList = portfolioObjects.map((coin) => coin.id);

      // fetch detailed data for each coin (price, ath, marketCap etc)
      const detailedCoinsArray = await fetchPortfolioCoinData(
        portfolioCoinNameList
      );

      // combine amount data w/ detailed coin data
      const combinedDetailedCoins = detailedCoinsArray.map((coin) => {
        // find the corresponding coin object from the user's portfolio based on the coin name
        const foundCoin = portfolioObjects.find(
          (item) => item.id.toLowerCase() === coin.id.toLowerCase()
        );

        const amount = foundCoin ? foundCoin.amount : 0;
        const currentPrice = coin.currentPrice || 0;
        const totalValue = amount * currentPrice;

        // return a new object for each coin combining the detailed API data with the amount from the user's portfolio
        return {
          id: coin.id,
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
    } catch (error) {
      console.error("Error fetching portfolio", error);
      setLoading(false);
    }
  }, [user.userId]);

  useEffect(() => {
    const fetchAndSetUserData = async () => {
      await fetchAndSetPortfolioData();
      await fetchAndSetProfilePicUrl();
    };

    fetchAndSetUserData();

    socket.on("portfolioUpdated", ({ userId, portfolio }) => {
      if (user.userId === userId) {
        fetchAndSetPortfolioData();
        console.log("Portfolio updated:", portfolio);
      }
    });

    return () => {
      socket.off("portfolioUpdated");
    };
  }, [user.userId, fetchAndSetProfilePicUrl, fetchAndSetPortfolioData]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        portfolio,
        setPortfolio,
        loading,
        setLoading,
        profilePicUrl,
        setProfilePicUrl,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;

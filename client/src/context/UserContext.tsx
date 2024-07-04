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
interface UserType {
  userId: string;
  username: string;
  email: string;
  isAuthenticated: boolean;
}

const defaultUser: UserType = {
  userId: "",
  username: "",
  email: "",
  isAuthenticated: false,
};

interface ImageData {
  thumb: string;
  sm: string;
  lg: string;
}

interface Links {
  homepage: string[];
  whitepaper: string;
  blockchain_site: string[];
  official_forum_url: string[];
  chat_url: string[];
  announcement_url: string[];
  twitter_screen_name: string;
  facebook_username: string;
  bitcointalk_thread_identifier: null | string;
  telegram_channel_identifier: string;
  subreddit_url: string;
  repos_url: {
    github: string[];
    bitbucket: string[];
  };
}

// detailed information about each coin
export interface DetailedCoin {
  id: string;
  name: string;
  amount: string;
  totalValue: number;
  info: {
    symbol: string;
    image: ImageData;
    currentPrice: number;
    marketCap: number;
    ath: number;
    webSlug: string;
    description: string;
    links: Links;
    genesis_date: string;
    market_cap_rank: number;
    fully_diluted_valuation: string;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    total_supply: number;
    max_supply: number;
    circulating_supply: number;
    sparkline: number[];
  };
}

// portfolio structure
interface Portfolio {
  list: string[];
  detailed: DetailedCoin[];
}

// default values for the portfolio
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
            description: coin.description,
            links: coin.links,
            genesis_date: coin.genesis_date,
            market_cap_rank: coin.market_cap_rank,
            fully_diluted_valuation: coin.fully_diluted_valuation,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            price_change_percentage_7d: coin.price_change_percentage_7d,
            total_supply: coin.total_supply,
            max_supply: coin.max_supply,
            circulating_supply: coin.circulating_supply,
            sparkline: coin.sparkline,
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

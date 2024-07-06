import { createContext, useState, useCallback, useContext } from "react";
import UserContext from "./UserContext";

// ------------------------------- TYPES -------------------------------
interface Sparkline {
  price: number[];
}

export interface CryptoCoin {
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  circulating_supply: number;
  current_price: number;
  fully_diluted_valuation: number;
  high_24h: number;
  id: string;
  image: string;
  last_updated: string;
  low_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  market_cap_rank: number;
  max_supply: number;
  name: string;
  price_change_24h: number;
  price_change_percentage_24h: number;
  roi: null;
  symbol: string;
  total_supply: number;
  total_volume: number;
  sparkline_in_7d: Sparkline;
}

// shape of the context object provided by DataContext
interface DataContextType {
  cryptoList: CryptoCoin[];
  loading: boolean;
  fetchAllCoins: (page: number, accessToken: string) => void;
}

// default values for DataContext when it's first created
const defaultContextValue: DataContextType = {
  cryptoList: [],
  loading: true,
  fetchAllCoins: () => {},
};

const DataContext = createContext<DataContextType>(defaultContextValue);

interface DataProviderProps {
  children: React.ReactNode;
}

// ----------------------------- DataProvider -----------------------------
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user } = useContext(UserContext);
  const [cryptoList, setCryptoList] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAllCoins = useCallback(
    async (page: number, accessToken: string) => {
      const url = `http://localhost:8000/data/all-coins-with-market-data?page=${page}`;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      if (!user.isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const response = await fetch(url, options);
      const { data } = await response.json();

      const coins = data.map((coin: CryptoCoin) => ({
        ...coin,
        sparkline_in_7d: coin.sparkline_in_7d.price,
      }));

      // add new coins to the existing list or reset list if it's the first page
      if (page === 1) {
        setCryptoList(coins);
      } else {
        setCryptoList((prev) => [...prev, ...coins]);
      }

      setLoading(false);
    },
    [user.isAuthenticated]
  );

  return (
    <DataContext.Provider value={{ cryptoList, loading, fetchAllCoins }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;

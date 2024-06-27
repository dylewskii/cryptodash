import { createContext, useState, useEffect, useCallback } from "react";

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
  fetchCoins: (page: number) => void;
}

// default values for DataContext when it's first created
const defaultContextValue: DataContextType = {
  cryptoList: [],
  loading: true,
  fetchCoins: () => {},
};

const DataContext = createContext<DataContextType>(defaultContextValue);

interface DataProviderProps {
  children: React.ReactNode;
}

// ----------------------------- DataProvider -----------------------------
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [cryptoList, setCryptoList] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCoins = useCallback(async (page: number) => {
    setLoading(true);
    // const cache = localStorage.getItem("allCryptoCoinsCache");

    // if (cache) {
    //   console.log("using cached data");
    // const { data, timestamp } = JSON.parse(cache);
    // const hoursElapsed = (Date.now() - timestamp) / 1000 / 3600;
    // if (hoursElapsed < 24) {
    //   setCryptoList(data);
    //   setLoading(false);
    //   return;
    // }
    // }

    const response = await fetch(
      `http://localhost:8000/data/all-coins-with-market-data?page=${page}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const { data } = await response.json();

    const coins = data.map((coin: CryptoCoin) => {
      return {
        ath: coin.ath,
        ath_change_percentage: coin.ath_change_percentage,
        ath_date: coin.ath_date,
        atl: coin.atl,
        atl_change_percentage: coin.atl_change_percentage,
        atl_date: coin.atl_date,
        circulating_supply: coin.circulating_supply,
        current_price: coin.current_price,
        fully_diluted_valuation: coin.fully_diluted_valuation,
        high_24h: coin.high_24h,
        id: coin.id,
        image: coin.image,
        last_updated: coin.last_updated,
        low_24h: coin.low_24h,
        market_cap: coin.market_cap,
        market_cap_change_24h: coin.market_cap_change_24h,
        market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
        market_cap_rank: coin.market_cap_rank,
        max_supply: coin.max_supply,
        name: coin.name,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        roi: coin.roi,
        symbol: coin.symbol,
        total_supply: coin.total_supply,
        total_volume: coin.total_volume,
        sparkline_in_7d: coin.sparkline_in_7d.price,
      };
    });

    // add new coins to the existing list or reset list if it's the first page
    if (page === 1) {
      setCryptoList(coins);
    } else {
      setCryptoList((prev) => [...prev, ...coins]);
    }

    // localStorage.setItem(
    //   "allCryptoCoinsCache",
    //   JSON.stringify({ data, timestamp: Date.now() })
    // );

    setLoading(false);
  }, []);

  // on mount - load crypto names from the 1st page & cache if necessary
  useEffect(() => {
    fetchCoins(1);
  }, [fetchCoins]);

  return (
    <DataContext.Provider value={{ cryptoList, loading, fetchCoins }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;

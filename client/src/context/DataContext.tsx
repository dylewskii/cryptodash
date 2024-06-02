import { createContext, useState, useEffect } from "react";

// ------------------------------- TYPES -------------------------------
interface Coin {
  name: string;
}

// define structure for caching the price of crypto w/ a timestamp
interface PriceCacheEntry {
  value: number;
  timestamp: number;
}

// maps each coin's name to its PriceCacheEntry
interface PriceCache {
  [key: string]: PriceCacheEntry;
}

// shape of the context object provided by DataContext
interface DataContextType {
  cryptoList: string[];
  loading: boolean;
  getCryptoDollarValue: (coinName: string) => Promise<number>;
}

// default values for DataContext when it's first created
const defaultContextValue: DataContextType = {
  cryptoList: [],
  loading: true,
  getCryptoDollarValue: async () => 0,
};

const DataContext = createContext<DataContextType>(defaultContextValue);

interface DataProviderProps {
  children: React.ReactNode;
}

// ----------------------------- DataProvider -----------------------------
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [cryptoList, setCryptoList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [priceCache, setPriceCache] = useState<PriceCache>({});

  /** -----------------------------------------------------------------------------------------------
   * Fetches the current USD value of a specific cryptocurrency. If the price has been fetched
   * within the last hour and is cached, the cached value is used. If the
   * price is not cached or the cache is older than one hour, it fetches the price again.
   *
   * @param coinName string name of the crypto coin to fetch dollar value for.
   * @returns A promise that resolves to the dollar value of the cryptocurrency.
   */
  const getCryptoDollarValue = async (coinName: string): Promise<number> => {
    const currentTime = new Date().getTime();
    const cacheEntry = priceCache[coinName];
    const hourInMilliseconds = 3_600_000;

    // check if there's valid cached data to use.
    if (cacheEntry && currentTime - cacheEntry.timestamp < hourInMilliseconds) {
      return cacheEntry.value;
    }

    // fetch new data if the cache is outdated or not available
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinName.toLowerCase()}`
      );
      const data = await res.json();
      const dollarValue = data.market_data.current_price.usd;

      // update cache w/ new data
      setPriceCache((prev) => ({
        ...prev,
        [coinName]: { value: dollarValue, timestamp: currentTime },
      }));

      return dollarValue;
    } catch (error) {
      console.error("Failed to fetch crypto dollar value:", error);
      return 0;
    }
  };

  // load crypto names on mount and cache them if necessary
  useEffect(() => {
    const fetchData = async () => {
      const cache = localStorage.getItem("allCryptoCoinsCache");

      if (cache) {
        const { data, timestamp } = JSON.parse(cache);
        const hoursElapsed = (Date.now() - timestamp) / 1000 / 3600;
        if (hoursElapsed < 24) {
          setCryptoList(data);
          setLoading(false);
          return;
        }
      }
      const response = await fetch("http://localhost:8000/data/all-coins", {
        method: "GET",
        credentials: "include",
      });
      const { data } = await response.json();
      const coinNames = data.map((coin: Coin) => coin.name);
      localStorage.setItem(
        "allCryptoCoinsCache",
        JSON.stringify({ data: coinNames, timestamp: Date.now() })
      );
      setCryptoList(coinNames);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ cryptoList, loading, getCryptoDollarValue }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;

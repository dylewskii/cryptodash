import { createContext, useState, useEffect } from "react";

interface Coin {
  name: string;
}

interface PriceCacheEntry {
  value: number;
  timestamp: number;
}

interface PriceCache {
  [key: string]: PriceCacheEntry;
}

interface DataContextType {
  cryptoList: string[];
  loading: boolean;
  getCryptoDollarValue: (coinName: string) => Promise<number>;
}

const defaultContextValue: DataContextType = {
  cryptoList: [],
  loading: true,
  getCryptoDollarValue: async () => 0,
};

const DataContext = createContext<DataContextType>(defaultContextValue);

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [cryptoList, setCryptoList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [priceCache, setPriceCache] = useState<PriceCache>({});

  // fetch crypto $ value, use cached value if fresher than 1hr
  const getCryptoDollarValue = async (coinName: string): Promise<number> => {
    const currentTime = new Date().getTime();
    const cacheEntry = priceCache[coinName];
    const hourInMilliseconds = 3_600_000;

    if (cacheEntry && currentTime - cacheEntry.timestamp < hourInMilliseconds) {
      console.log("Using cached data for", coinName);
      return cacheEntry.value;
    }

    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinName.toLowerCase()}`
      );
      const data = await res.json();
      const dollarValue = data.market_data.current_price.usd;

      setPriceCache((prev) => ({
        ...prev,
        [coinName]: { value: dollarValue, timestamp: currentTime },
      }));

      console.log("Fetched new data for", coinName);
      return dollarValue;
    } catch (error) {
      console.error("Failed to fetch crypto dollar value:", error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const cache = localStorage.getItem("cryptoData");
      if (cache) {
        const { data, timestamp } = JSON.parse(cache);
        const hoursElapsed = (Date.now() - timestamp) / 1000 / 3600;
        if (hoursElapsed < 24) {
          setCryptoList(data);
          setLoading(false);
          return;
        }
      }
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1`
      );
      const data = await response.json();
      const coinNames = data.map((coin: Coin) => coin.name);
      localStorage.setItem(
        "cryptoData",
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

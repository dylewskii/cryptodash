import { createContext, useState, useEffect } from "react";

// ------------------------------- TYPES -------------------------------
interface CoinApiResponse {
  id: string;
  symbol: string;
  name: string;
  platforms: {
    [key: string]: string;
  };
}

interface Coin {
  id: string;
  name: string;
  symbol: string;
}

// shape of the context object provided by DataContext
interface DataContextType {
  cryptoList: Coin[];
  loading: boolean;
}

// default values for DataContext when it's first created
const defaultContextValue: DataContextType = {
  cryptoList: [],
  loading: true,
};

const DataContext = createContext<DataContextType>(defaultContextValue);

interface DataProviderProps {
  children: React.ReactNode;
}

// ----------------------------- DataProvider -----------------------------
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [cryptoList, setCryptoList] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

      const coins = data.map((coin: CoinApiResponse) => {
        return {
          name: coin.name,
          id: coin.id,
          symbol: coin.symbol,
        };
      });
      localStorage.setItem(
        "allCryptoCoinsCache",
        JSON.stringify({ data, timestamp: Date.now() })
      );
      setCryptoList(coins);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ cryptoList, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;

import { createContext, useState, useEffect } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [cryptoList, setCryptoList] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const coinNames = data.map((coin) => coin.name);
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
    <DataContext.Provider value={{ cryptoList, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;

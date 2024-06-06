import { useState } from "react";

// structure for caching the price of crypto w/ a timestamp
interface PriceCacheEntry {
  value: number;
  timestamp: number;
}

// maps each coin's name to its PriceCacheEntry
interface PriceCache {
  [key: string]: PriceCacheEntry;
}

export default function useCryptoDollarValue() {
  const [priceCache, setPriceCache] = useState<PriceCache>({});
  /** -----------------------------------------------------------------------------------------------
   * Fetches the current USD value of a specific cryptocurrency. If the price has been fetched
   * within the last hour and is cached, the cached value is used. If the
   * price is not cached or the cache is older than one hour, it fetches the price again.
   *
   * @param coinId string name of the crypto coin to fetch dollar value for.
   * @returns A promise that resolves to the dollar value of the cryptocurrency.
   */
  const getCryptoDollarValue = async (coinId: string): Promise<number> => {
    const currentTime = new Date().getTime();
    const cacheEntry = priceCache[coinId];
    const hourInMilliseconds = 3_600_000;

    // check if there's valid cached data to use.
    if (cacheEntry && currentTime - cacheEntry.timestamp < hourInMilliseconds) {
      return cacheEntry.value;
    }

    // fetch new data if the cache is outdated or not available
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}`
      );
      const data = await res.json();
      const dollarValue = await data.market_data.current_price.usd;

      // update cache w/ new data
      setPriceCache((prev) => ({
        ...prev,
        [coinId]: { value: dollarValue, timestamp: currentTime },
      }));

      return dollarValue;
    } catch (error) {
      console.error("Failed to fetch crypto dollar value:", error);
      return 0;
    }
  };

  return { getCryptoDollarValue };
}

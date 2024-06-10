import { useState } from "react";

// structure for caching the prices of crypto w/ a timestamp
interface PriceCacheEntry {
  value: { [key: string]: number };
  timestamp: number;
}

// maps each coin's name to its PriceCacheEntry
interface PriceCache {
  [key: string]: PriceCacheEntry;
}

export default function useCryptoFiatValues() {
  const [priceCache, setPriceCache] = useState<PriceCache>({});
  /** -----------------------------------------------------------------------------------------------
   * Fetches the current fiat values of the specified crypto coin.
   *
   * If the price has been fetched within the last hour and is cached, the cached value is used.
   * If the price is not cached or the cache is older than one hour, it fetches the price again.
   *
   * @param coinId string name of the crypto coin to fetch value for.
   * @param currency string name of the desired fiat currency to fetch the value of. Default = "usd"
   * @returns A promise that resolves to an object containing the fiat values, in a range of currencies, of the specified crypto coin.
   */
  const getCryptoFiatValues = async (
    coinId: string
  ): Promise<{ [key: string]: number }> => {
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
      const currentPriceData = await data.market_data.current_price;

      // update cache w/ new data
      setPriceCache((prev) => ({
        ...prev,
        [coinId]: { value: currentPriceData, timestamp: currentTime },
      }));

      return currentPriceData;
    } catch (error) {
      console.error("Failed to fetch crypto dollar value:", error);
      return {};
    }
  };

  return { getCryptoFiatValues };
}

import { useState, useEffect } from "react";
// stores
import { useCoinStore } from "@/stores/useCoinStore";
import { useUserStore } from "@/stores/useUserStore";
// utils
import { useDebounce } from "use-debounce";
import { API_BASE_URL } from "@/config";

export interface AddedCoin {
  id: string;
  name: string;
  api_symbol?: string;
  symbol?: string;
  market_cap_rank?: string | number;
  thumb?: string;
  large?: string;
}

export const useCoinSearch = (searchTerm: string) => {
  const [searchResults, setSearchResults] = useState<AddedCoin[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const accessToken = useUserStore((state) => state.accessToken);
  const cryptoList = useCoinStore((state) => state.cryptoList);

  // initally sets the list to the first 100 coins
  useEffect(() => {
    if (cryptoList.length > 0 && !debouncedSearchTerm) {
      const initialCoins = cryptoList.slice(0, 100).map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        market_cap_rank: coin.market_cap_rank,
        thumb: coin.image,
      }));
      setSearchResults(initialCoins);
    }
  }, [cryptoList, debouncedSearchTerm]);

  useEffect(() => {
    const runSearch = async () => {
      if (!accessToken) {
        return;
      }

      // if search empty, revert to initial 100 coins
      if (!debouncedSearchTerm) {
        const initialCoins = cryptoList.slice(0, 100).map((coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          market_cap_rank: coin.market_cap_rank,
          thumb: coin.image,
        }));
        setSearchResults(initialCoins);
        return;
      }

      const url = `${API_BASE_URL}/data/search?searchTerm=${debouncedSearchTerm}`;
      const options: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      try {
        if (debouncedSearchTerm) {
          setIsSearchLoading(true);
          const response = await fetch(url, options);

          if (!response.ok) {
            throw new Error(`Http error: ${response.status}`);
          }

          const data = await response.json();

          setSearchResults(data.data.coins);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        throw new Error(`Failed to debounce search term ${err}`);
      } finally {
        setIsSearchLoading(false);
      }
    };

    runSearch();
  }, [debouncedSearchTerm, accessToken, cryptoList]);

  return { searchResults, isSearchLoading };
};

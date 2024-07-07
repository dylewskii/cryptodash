import { create } from "zustand";
import { MarketDataCoin } from "@/types";
import { useUserStore } from "./useUserStore";

interface CoinStore {
  cryptoList: MarketDataCoin[];
  setCryptoList: (cryptoList: MarketDataCoin[]) => void;
  fetchAllCoinsPending: boolean;
  setFetchAllCoinsPending: (fetchAllCoinsPending: boolean) => void;
  fetchAllCoins: (page: number) => Promise<void>;
}

export const useCoinStore = create<CoinStore>((set) => ({
  cryptoList: [],
  setCryptoList: (cryptoList) => set({ cryptoList }),
  fetchAllCoinsPending: false,
  setFetchAllCoinsPending: (fetchAllCoinsPending) =>
    set({ fetchAllCoinsPending }),

  fetchAllCoins: async (page: number) => {
    const { user, accessToken } = useUserStore.getState();
    if (!user.isAuthenticated) {
      set({ fetchAllCoinsPending: false });
      return;
    }

    set({ fetchAllCoinsPending: true });

    try {
      const url = `http://localhost:8000/data/all-coins-with-market-data?page=${page}`;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, options);
      const { data } = await response.json();

      const coins = data.map((coin: MarketDataCoin) => ({
        ...coin,
        sparkline_in_7d: coin.sparkline_in_7d.price,
      }));

      set((state) => ({
        cryptoList: page === 1 ? coins : [...state.cryptoList, ...coins],
      }));
    } catch (error) {
      console.error("Error fetching coins:", error);
      // error state ?
    } finally {
      set({ fetchAllCoinsPending: false });
    }
  },
}));

import { create } from "zustand";
import { MarketDataCoin } from "@/types";
import { useUserStore } from "./useUserStore";
import { API_BASE_URL } from "@/config";

interface CoinStore {
  cryptoList: MarketDataCoin[];
  setCryptoList: (cryptoList: MarketDataCoin[]) => void;
  // --------------------------------------------------------- //
  fetchCoinsByPage: (page: number) => Promise<void>;
  fetchCoinsByPagePending: boolean;
  setFetchCoinsByPagePending: (fetchCoinsByPagePending: boolean) => void;
}

export const useCoinStore = create<CoinStore>((set) => ({
  cryptoList: [],
  setCryptoList: (cryptoList) => set({ cryptoList }),
  // --------------------------------------------------------- //
  fetchCoinsByPage: async (page: number) => {
    const { user, accessToken } = useUserStore.getState();
    if (!user.isAuthenticated) {
      set({ fetchCoinsByPagePending: false });
      return;
    }

    set({ fetchCoinsByPagePending: true });

    try {
      const url = `${API_BASE_URL}/data/all-coins-with-market-data?page=${page}`;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        set({ fetchCoinsByPagePending: false });
        throw new Error(`Http error: ${response.status}`);
      }

      const { data } = await response.json();

      const coinsFromPage = data;

      set((state) => ({
        cryptoList:
          page === 1 ? coinsFromPage : [...state.cryptoList, ...coinsFromPage],
      }));
    } catch (error) {
      console.error("Error fetching coins:", error);
      // error state ?
    } finally {
      set({ fetchCoinsByPagePending: false });
    }
  },
  // --------------------------------------------------------- //
  fetchCoinsByPagePending: false,
  setFetchCoinsByPagePending: (fetchCoinsByPagePending) =>
    set({ fetchCoinsByPagePending }),
}));

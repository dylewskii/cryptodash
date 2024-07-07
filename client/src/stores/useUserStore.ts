import { create } from "zustand";
import {
  UserType,
  PortfolioType,
  defaultUser,
  defaultPortfolio,
} from "@/types";
import { fetchAndCombinePortfolioData } from "@/lib";

interface UserStore {
  accessToken: string;
  setAccessToken: (value: string) => void;

  user: UserType;
  setUser: (user: UserType) => void;

  portfolio: PortfolioType;
  setPortfolio: (portfolio: PortfolioType) => void;

  profilePicUrl: string;
  setProfilePicUrl: (profilePicUrl: string) => void;

  portfolioLoading: boolean;
  setPortfolioLoading: (portfolioLoading: boolean) => void;

  fetchAndSetPortfolioData: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  // --------------------------------------------------------- //
  accessToken: "",
  setAccessToken: (value) => set({ accessToken: value }),
  // --------------------------------------------------------- //
  user: defaultUser,
  setUser: (user) => set({ user }),
  // --------------------------------------------------------- //
  portfolio: defaultPortfolio,
  setPortfolio: (portfolio) => set({ portfolio }),
  // --------------------------------------------------------- //
  profilePicUrl: "",
  setProfilePicUrl: (profilePicUrl) => set({ profilePicUrl }),
  // --------------------------------------------------------- //
  portfolioLoading: false,
  setPortfolioLoading: (portfolioLoading) => set({ portfolioLoading }),
  // --------------------------------------------------------- //
  fetchAndSetPortfolioData: async () => {
    const { user, accessToken, setPortfolioLoading, setPortfolio } = get();
    if (!user.userId) return;

    setPortfolioLoading(true);
    try {
      const portfolioData = await fetchAndCombinePortfolioData(
        user.userId,
        accessToken
      );
      setPortfolio(portfolioData);
    } catch (error) {
      console.error("Error fetching portfolio", error);
      // set an error state here ?
    } finally {
      setPortfolioLoading(false);
    }
  },
  // --------------------------------------------------------- //
}));

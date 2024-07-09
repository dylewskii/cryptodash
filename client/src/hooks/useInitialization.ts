import { useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { checkAuth, fetchAndSetProfilePicUrl } from "@/lib";
import socket from "@/socket/socket";
import { useCoinStore } from "@/stores/useCoinStore";

export const useInitialization = () => {
  const {
    accessToken,
    setAccessToken,
    user,
    setUser,
    fetchAndSetPortfolioData,
    setProfilePicUrl,
  } = useUserStore();
  const { fetchCoinsByPage } = useCoinStore();

  useEffect(() => {
    const initializeData = async () => {
      await checkAuth(accessToken, setAccessToken, setUser);
      if (user.isAuthenticated) {
        await fetchAndSetPortfolioData();
        await fetchAndSetProfilePicUrl(setProfilePicUrl);
        await fetchCoinsByPage(1);
      }
    };

    initializeData();

    socket.on("portfolioUpdated", ({ userId, portfolio }) => {
      if (user.userId === userId) {
        fetchAndSetPortfolioData();
        console.log("Portfolio updated:", portfolio);
      }
    });

    return () => {
      socket.off("portfolioUpdated");
    };
  }, [
    user.isAuthenticated,
    user.userId,
    fetchAndSetPortfolioData,
    accessToken,
    setAccessToken,
    setUser,
    setProfilePicUrl,
    fetchCoinsByPage,
  ]);
};

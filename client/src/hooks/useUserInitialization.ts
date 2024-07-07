import { useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { checkAuth, fetchAndSetProfilePicUrl } from "@/lib";
import socket from "@/socket/socket";

export const useUserInitialization = () => {
  const {
    accessToken,
    setAccessToken,
    user,
    setUser,
    fetchAndSetPortfolioData,
    setProfilePicUrl,
  } = useUserStore();

  useEffect(() => {
    const initializeUserData = async () => {
      await checkAuth(accessToken, setAccessToken, setUser);
      if (user.isAuthenticated) {
        await fetchAndSetPortfolioData();
        await fetchAndSetProfilePicUrl(setProfilePicUrl);
      }
    };

    initializeUserData();

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
  ]);
};

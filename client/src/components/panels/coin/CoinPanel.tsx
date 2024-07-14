// react
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
// ui
import CoinPriceCard from "./CoinPriceCard";
import ConverterCard from "./ConverterCard";
import HoldingsCard from "./HoldingsCard";
import TokenInfoCard from "./TokenInfoCard";
import { Skeleton } from "@/components/ui/skeleton";
// store
import { useUserStore } from "@/stores/useUserStore";
// utils
import { adaptToPortfolioCoinType, fetchPortfolioCoinData } from "@/lib";
// types
import { CoinDB, DetailedCoin } from "@/types";
import socket from "@/socket/socket";
import CoinDescriptionCard from "./CoinDescriptionCard";

interface PortfolioUpdateEvent {
  userId: string;
  portfolio: CoinDB[];
}

export default function CoinPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [coinData, setCoinData] = useState<DetailedCoin | null>(null);
  const user = useUserStore((state) => state.user);
  const portfolio = useUserStore((state) => state.portfolio);
  const accessToken = useUserStore((state) => state.accessToken);
  const location = useLocation();
  const locationPath = location.pathname.split("/");
  const coinId = locationPath[locationPath.length - 1];

  useEffect(() => {
    const initializeCoinData = async () => {
      // check if coin is within portfolio
      // if it is - use location.state.coin to set coinData
      // if not - run fetchCoinData() and set result to coinData

      setIsLoading(true);
      try {
        const coinInPortfolio = portfolio.detailed.find(
          ({ id }) => id === coinId
        );

        if (coinInPortfolio) {
          setCoinData(coinInPortfolio);
          return;
        }

        const fetchedData = await fetchPortfolioCoinData([coinId], accessToken);

        if (!fetchedData || fetchedData.length === 0) {
          throw new Error(`Failed to fetch coin data for ${coinId}`);
        }

        const fetchedCoin = fetchedData[0];

        setCoinData(adaptToPortfolioCoinType(fetchedCoin));
        return;
      } catch (err) {
        console.error(`Error fetching coin data for ${coinId}: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCoinData();
  }, [portfolio.detailed, accessToken, coinId]);

  useEffect(() => {
    const handlePortfolioUpdate = ({
      userId,
      portfolio,
    }: PortfolioUpdateEvent) => {
      if (user.userId === userId && coinData) {
        const updatedCoin = portfolio.find((coin) => coin.id === coinData.id);
        if (updatedCoin) {
          setCoinData((prevCoin) => {
            if (!prevCoin) return null;
            return {
              ...prevCoin,
              amount: updatedCoin.amount.toString(),
              totalValue: updatedCoin.amount * prevCoin.info.currentPrice,
            };
          });
        }
      }
    };

    socket.on("portfolioUpdated", handlePortfolioUpdate);

    return () => {
      socket.off("portfolioUpdated", handlePortfolioUpdate);
    };
  }, [user.userId, coinData]);

  if (isLoading || !coinData) {
    return (
      <section className="grid gap-4 mb-6 grid-cols-1 lg:grid-cols-2">
        <div className="row-start-1 gap-4">
          <Skeleton className="w-full h-[150px] rounded-xl dark:bg-zinc-400 mb-4" />
          <Skeleton className="row-start-2 lg:row-start-2 mt-4 w-full h-[150px] rounded-xl dark:bg-zinc-400" />
        </div>
        <Skeleton className="row-start-4 md:col-start-1 lg:row-start-3 w-full h-[300px] rounded-xl dark:bg-zinc-400" />
        <Skeleton className="row-start-3 lg:row-span-3 w-full h-[200px] rounded-xl dark:bg-zinc-400" />
      </section>
    );
  }

  return (
    <section className="grid gap-y-3 gap-x-3 mb-6 md:grid-cols-2 ">
      <CoinPriceCard
        coin={coinData}
        className="w-full h-fit md:col-start-1 md:row-start-1 md:col-span-2"
      />

      <HoldingsCard
        coin={coinData}
        className="w-full md:col-start-1 md:row-start-2"
      />

      <ConverterCard
        coin={coinData}
        className="w-full md:col-start-2 md:row-start-2"
      />

      <TokenInfoCard
        coin={coinData}
        className="w-full md:col-start-1 md:row-start-3 md:col-span-2"
      />

      {coinData.info.description && (
        <CoinDescriptionCard
          description={coinData.info.description}
          className="w-full md:col-start-1 md:row-start-4 md:col-span-3"
        />
      )}
    </section>
  );
}

// react
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
// ui
import TokenInfoCard from "./TokenInfoCard";
import HoldingsCard from "./HoldingsCard";
import ConverterCard from "./ConverterCard";
import CoinPriceCard from "./CoinPriceCard";
// store
import { useUserStore } from "@/stores/useUserStore";
// socket
import socket from "@/socket/socket";
/// types
import { CoinDB } from "@/types";
import { DetailedCoin } from "@/types";

interface PortfolioUpdateEvent {
  userId: string;
  portfolio: CoinDB[];
}

export default function CoinPanel() {
  const location = useLocation();
  const initialCoinData = location.state.coin as DetailedCoin;
  const [coinData, setCoinData] = useState<DetailedCoin>(initialCoinData);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const handlePortfolioUpdate = ({
      userId,
      portfolio,
    }: PortfolioUpdateEvent) => {
      if (user.userId === userId) {
        // find the updated coin data in the new portfolio
        const updatedCoin = portfolio.find((coin) => coin.id === coinData.id);
        if (updatedCoin) {
          setCoinData((prevCoin) => ({
            ...prevCoin,
            amount: updatedCoin.amount.toString(), // keeps same type (string)
            totalValue: updatedCoin.amount * prevCoin.info.currentPrice,
          }));
        }
      }
    };

    socket.on("portfolioUpdated", handlePortfolioUpdate);

    return () => {
      socket.off("portfolioUpdated", handlePortfolioUpdate);
    };
  }, [user.userId, coinData.id]);

  return (
    <section className="grid gap-4 mb-6 grid-cols-1 lg:grid-cols-2">
      <div className="row-start-1">
        <CoinPriceCard coin={coinData} className="w-full" />

        <HoldingsCard
          coin={coinData}
          className="w-full row-start-2 mt-6 lg:row-start-2 mt-4"
        />
      </div>

      <ConverterCard
        coin={coinData}
        className="w-full row-start-4 md:col-start-1 lg:row-start-3"
      />
      <TokenInfoCard
        coin={coinData}
        className="w-full row-start-3 lg:row-span-3"
      />
    </section>
  );
}

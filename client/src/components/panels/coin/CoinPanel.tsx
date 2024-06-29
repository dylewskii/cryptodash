import { useLocation } from "react-router-dom";
import { useState } from "react";
import CoinInfoCard from "./CoinInfoCard";
import CoinHoldingsCard from "./CoinHoldingsCard";
import ConverterCard from "./ConverterCard";
import { DetailedCoin } from "@/context/UserContext";

export default function CoinPanel() {
  const location = useLocation();
  const initialCoinData = location.state.coin as DetailedCoin;
  const [coinData, setCoinData] = useState<DetailedCoin>(initialCoinData);

  const updateCoinData = (updatedCoin: DetailedCoin) => {
    setCoinData(updatedCoin);
  };

  return (
    <section className="grid gap-4 grid-cols-1 mb-6 md:grid-cols-2">
      <CoinHoldingsCard
        coin={coinData}
        updateCoinData={updateCoinData}
        className="w-full row-start-1"
      />
      <ConverterCard
        coin={coinData}
        className="w-full row-start-3 md:col-start-1 md:row-start-2"
      />
      <CoinInfoCard
        coin={coinData}
        className="w-full row-start-2 md:col-start-2 md:row-span-2"
      />
    </section>
  );
}

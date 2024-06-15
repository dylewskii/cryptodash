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
    <section className="lg:flex lg:flex-col gap-3">
      <div className="lg:flex lg:gap-2">
        <CoinHoldingsCard coin={coinData} updateCoinData={updateCoinData} />
        <CoinInfoCard coin={coinData} />
      </div>
      <ConverterCard coin={coinData} />
    </section>
  );
}

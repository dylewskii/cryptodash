import { useLocation } from "react-router-dom";
import { useState } from "react";
import TokenInfoCard from "./TokenInfoCard";
import HoldingsCard from "./HoldingsCard";
import ConverterCard from "./ConverterCard";
import { DetailedCoin } from "@/context/UserContext";
import CoinPriceCard from "./CoinPriceCard";

export default function CoinPanel() {
  const location = useLocation();
  const initialCoinData = location.state.coin as DetailedCoin;
  const [coinData, setCoinData] = useState<DetailedCoin>(initialCoinData);

  const updateCoinData = (updatedCoin: DetailedCoin) => {
    setCoinData(updatedCoin);
  };

  return (
    <section className="grid gap-4 mb-6 grid-cols-1 lg:grid-cols-2">
      <div className="row-start-1">
        <CoinPriceCard coin={coinData} className="w-full" />

        <HoldingsCard
          coin={coinData}
          updateCoinData={updateCoinData}
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

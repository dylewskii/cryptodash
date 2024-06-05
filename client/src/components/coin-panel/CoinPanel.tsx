import { useLocation } from "react-router-dom";
import CoinInfoCard from "./CoinInfoCard";
import CoinHoldingsCard from "./CoinHoldingsCard";
import ConverterCard from "./ConverterCard";

export default function CoinPanel() {
  const location = useLocation();
  const coinData = location.state.coin;

  return (
    <div className="flex flex-col justify-between md:flex-row gap-3">
      <CoinHoldingsCard coin={coinData} />
      <CoinInfoCard coin={coinData} />
      <ConverterCard coinId={coinData.id} coinName={coinData.name} />
    </div>
  );
}

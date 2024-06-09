import { useLocation } from "react-router-dom";
import CoinInfoCard from "./CoinInfoCard";
import CoinHoldingsCard from "./CoinHoldingsCard";
import ConverterCard from "./ConverterCard";

export default function CoinPanel() {
  const location = useLocation();
  const coinData = location.state.coin;

  return (
    <section className="lg:flex lg:flex-col gap-3">
      <div className="lg:flex lg:gap-2">
        <CoinHoldingsCard coin={coinData} />
        <CoinInfoCard coin={coinData} />
      </div>
      <ConverterCard coin={coinData} />
    </section>
  );
}

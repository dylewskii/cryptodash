import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { formatCurrency } from "@/lib";
import { DetailedCoin } from "@/types";

interface TokenInfoCardProps {
  coin: DetailedCoin;
  className?: string;
}

export default function TokenInfoCard({ coin, className }: TokenInfoCardProps) {
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>Token Info</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="border-b-2 border-black">{coin.info.description}</p>

        <div className="grid grid-cols-2 gap-y-4 pt-4">
          <p className="font-semibold text-left">All-Time High:</p>
          <p className="font-normal text-right">
            {coin.info.ath ? formatCurrency(coin.info.ath, "USD", 8) : "N/A"}
          </p>

          <p className="font-semibold text-left">Market Cap Rank:</p>
          <p className="font-normal text-right">
            {coin.info.market_cap_rank ? coin.info.market_cap_rank : "N/A"}
          </p>

          <p className="font-semibold text-left">Market Cap:</p>
          <p className="font-normal text-right">
            {coin.info.marketCap ? formatCurrency(coin.info.marketCap) : "N/A"}
          </p>

          <p className="font-semibold text-left">Fully Diluted Value:</p>
          <p className="font-normal text-right">
            {coin.info.fully_diluted_valuation
              ? formatCurrency(Number(coin.info.fully_diluted_valuation))
              : "N/A"}
          </p>

          <p className="font-semibold text-left">Total Supply:</p>
          <p className="font-normal text-right">
            {coin.info.total_supply
              ? coin.info.total_supply.toLocaleString("en-US")
              : "N/A"}
          </p>

          <p className="font-semibold text-left">Max Supply:</p>
          <p className="font-normal text-right">
            {coin.info.max_supply
              ? coin.info.max_supply.toLocaleString("en-US")
              : "N/A"}
          </p>

          <p className="font-semibold text-left">Circulating Supply:</p>
          <p className="font-normal text-right">
            {coin.info.circulating_supply
              ? coin.info.circulating_supply.toLocaleString("en-US")
              : "N/A"}
          </p>

          <p className="font-semibold text-left">Genesis Date:</p>
          <p className="font-normal text-right">
            {coin.info.genesis_date ? coin.info.genesis_date : "N/A"}
          </p>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { formatCurrency } from "@/lib";
import { DetailedCoin } from "@/types";

interface TokenInfoCardProps {
  coin: DetailedCoin | null;
  className?: string;
}

export default function TokenInfoCard({ coin, className }: TokenInfoCardProps) {
  if (!coin || !coin.info) {
    return (
      <Card className="flex flex-col items-center justify-center mb-4 w-full h-[300px] rounded-xl dark:bg-zinc-700">
        <CardTitle className="flex items-center gap-2">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 4V2M15 20V22M4 9H2M20 15H22M4.91421 4.91421L3.5 3.5M19.0858 19.0858L20.5 20.5M12 17.6569L9.87868 19.7782C8.31658 21.3403 5.78392 21.3403 4.22183 19.7782C2.65973 18.2161 2.65973 15.6834 4.22183 14.1213L6.34315 12M17.6569 12L19.7782 9.87868C21.3403 8.31658 21.3403 5.78392 19.7782 4.22183C18.2161 2.65973 15.6834 2.65973 14.1213 4.22183L12 6.34315"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Uh oh, we encountered an error.
        </CardTitle>
        <CardDescription className="max-w-[40%] text-center">
          Please try refreshing the site, or if the error persists, get in touch
          with us.
        </CardDescription>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>Token Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`grid grid-cols-2 gap-y-4 ${
            !coin.info.description ? "" : "pb-6"
          }`}
        >
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
    </Card>
  );
}

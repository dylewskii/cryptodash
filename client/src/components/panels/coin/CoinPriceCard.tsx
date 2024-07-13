import { formatCurrency } from "@/lib";
import { Card, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { DetailedCoin } from "@/types";

interface CoinPriceCardProps {
  coin: DetailedCoin | null;
  className?: string;
}

export default function CoinPriceCard({ coin, className }: CoinPriceCardProps) {
  if (!coin || !coin.info) {
    return (
      <Card className="flex flex-col items-center justify-center  mb-4 w-full h-[150px] rounded-xl dark:bg-zinc-700">
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

  const isLowPrice = coin.info.currentPrice < 0.1;

  return (
    <Card className={`${className} flex-col justify-center`}>
      <CardHeader className="p-10">
        <CardTitle className="flex gap-2 justify-center">
          <img
            src={coin.info.image.lg}
            alt="Cryptocurrency Icon"
            className="h-20 md:h-28"
          />
          <div>
            <span className="text-xl md:text-3xl ">
              {coin.name} &#40;{coin.info.symbol.toUpperCase()}&#41;
            </span>
            <span
              className={`flex justify-center ${
                isLowPrice ? "text-4xl" : "text-5xl"
              }`}
            >
              {isLowPrice
                ? formatCurrency(coin.info.currentPrice, "USD", 6)
                : formatCurrency(coin.info.currentPrice, "USD", 2)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

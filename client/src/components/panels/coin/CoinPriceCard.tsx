import formatCurrency from "@/lib/formatCurrency";
import { Card, CardHeader, CardTitle } from "../../ui/card";
import { DetailedCoin } from "@/context/UserContext";

interface CoinPriceCardProps {
  coin: DetailedCoin;
  className?: string;
}

export default function CoinPriceCard({ coin, className }: CoinPriceCardProps) {
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

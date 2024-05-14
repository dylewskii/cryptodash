import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import formatCurrency from "@/lib/formatCurrency";

export default function CoinPanel() {
  const location = useLocation();
  const coinData = location.state.coin;

  return (
    <div className="flex flex-col justify-between md:flex-row gap-3">
      <Card className="w-full md:w-[350px] flex justify-center flex-col">
        <CardHeader>
          <CardTitle className="flex gap-2">
            <img
              src={coinData.info.image}
              alt="Cryptocurrency Icon"
              className="h-20 md:h-28"
            />
            <div>
              <p className="text-2xl">
                {coinData.name} &#40;{coinData.info.symbol.toUpperCase()}&#41;
              </p>
              <p className="flex justify-center text-4xl">
                {formatCurrency(coinData.info.currentPrice)}
              </p>
            </div>
            <CardDescription></CardDescription>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Current Holdings: {coinData.amount}</p>
          <p>Total Value: {formatCurrency(coinData.totalValue)}</p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Edit Position</Button>
        </CardFooter>
      </Card>
      <Card className="w-full md:w-[350px]">
        <CardHeader>
          <CardTitle>Token Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Market Cap: {formatCurrency(coinData.info.marketCap)}</p>
          <p>All-Time High: {formatCurrency(coinData.info.ath)}</p>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <div className="flex"></div>
    </div>
  );
}

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
    <div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex gap-2">
            <img
              src={coinData.info.image}
              alt="Cryptocurrency Icon"
              className="h-16 md:h-24"
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
      <div className="flex"></div>
    </div>
  );
}

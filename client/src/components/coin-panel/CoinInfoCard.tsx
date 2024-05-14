import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import formatCurrency from "@/lib/formatCurrency";
import { DetailedCoin } from "@/context/UserContext";

interface CoinInfoCardProps {
  coin: DetailedCoin;
}

export default function CoinInfoCard({ coin }: CoinInfoCardProps) {
  return (
    <Card className="w-full md:w-[350px]">
      <CardHeader>
        <CardTitle>Token Info</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Market Cap: {formatCurrency(coin.info.marketCap)}</p>
        <p>All-Time High: {formatCurrency(coin.info.ath)}</p>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

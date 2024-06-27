// react
import { useContext } from "react";
import UserContext from "@/context/UserContext";
// ui
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "../../ui/skeleton";
// utils
import formatCurrency from "@/lib/formatCurrency";
import SparkLineChart from "@/charts/SparkLineChart";

export default function FavoriteCoins() {
  const { portfolio, loading } = useContext(UserContext);

  return (
    <div className="custom-grid-1 my-4">
      {loading ? (
        <>
          <Card>
            <Skeleton className="h-[100px] w-[320px] rounded-xl" />
          </Card>
          <Card>
            <Skeleton className="h-[100px] w-[320px] rounded-xl" />
          </Card>
        </>
      ) : (
        portfolio.detailed.map((portfolioCoin, i) => {
          if (
            !portfolioCoin ||
            !portfolioCoin.info ||
            portfolioCoin.info.currentPrice === undefined
          ) {
            return (
              <Card key={`${portfolioCoin.name}${i}`}>
                <Skeleton className="h-[100px] w-full rounded-xl" />
              </Card>
            );
          }

          const coinPrice = portfolioCoin.info.currentPrice;
          let underTwoDecimals = false;
          if (coinPrice < 0.01) {
            underTwoDecimals = true;
          }

          return (
            <Card key={`${portfolioCoin.name}${i}`}>
              <CardHeader>
                <CardTitle className="z-50">{portfolioCoin.name}</CardTitle>
                <CardDescription className="z-50">
                  {portfolioCoin.info.symbol.toUpperCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-0 px-6">
                <p className="text-black text-3xl z-50">
                  {underTwoDecimals
                    ? formatCurrency(coinPrice, "USD", 6)
                    : formatCurrency(coinPrice, "USD", 2)}
                </p>
              </CardContent>
              <CardFooter className="flex justify-center p-0 overflow-hidden">
                <SparkLineChart
                  prices={portfolioCoin.info.sparkline}
                  width="270px"
                  height="100px"
                  className="bottom-0 z-0 pointer-events-none"
                />
              </CardFooter>
            </Card>
          );
        })
      )}
    </div>
  );
}

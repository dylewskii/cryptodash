// components / ui
import SparkLineChart from "@/charts/SparkLineChart";
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
import { formatCurrency, roundToTwoDecimalPlaces } from "@/lib";
// store
import { useUserStore } from "@/stores/useUserStore";

export default function FavoriteCoins() {
  const portfolio = useUserStore((state) => state.portfolio);
  const portfolioLoading = useUserStore((state) => state.portfolioLoading);

  return (
    <div className="custom-grid-1 my-4">
      {portfolioLoading ? (
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
              <CardContent className="flex justify-between items-center py-0 px-6">
                <p className="flex text-black text-3xl z-50">
                  {underTwoDecimals
                    ? formatCurrency(coinPrice, "USD", 6)
                    : formatCurrency(coinPrice, "USD", 2)}
                </p>
                <span
                  className={
                    portfolioCoin.info.price_change_percentage_7d < 0
                      ? "flex justify-between text-red-600"
                      : "flex justify-between text-green-600"
                  }
                >
                  {roundToTwoDecimalPlaces(
                    portfolioCoin.info.price_change_percentage_7d
                  ) + "%"}
                </span>
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

// react
import { useContext } from "react";
import UserContext from "@/context/UserContext";
// ui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "../../ui/skeleton";
// utils
import formatCurrency from "@/lib/formatCurrency";

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
        portfolio.detailed.map((coinObject, i) => {
          if (
            !coinObject ||
            !coinObject.info ||
            coinObject.info.currentPrice === undefined
          ) {
            return (
              <Card key={`${coinObject.name}${i}`}>
                <Skeleton className="h-[100px] w-full rounded-xl" />
              </Card>
            );
          }

          const coinPrice = coinObject.info.currentPrice;
          let underTwoDecimals = false;
          if (coinPrice < 0.01) {
            underTwoDecimals = true;
          }

          return (
            <Card key={`${coinObject.name}${i}`}>
              <CardHeader>
                <CardTitle>{coinObject.name}</CardTitle>
                <CardDescription>
                  {coinObject.info.symbol.toUpperCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl">
                  {underTwoDecimals
                    ? formatCurrency(coinPrice, "USD", 6)
                    : formatCurrency(coinPrice, "USD", 2)}
                </p>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

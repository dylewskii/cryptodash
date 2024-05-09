import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserContext from "@/context/UserContext";
import formatCurrency from "@/lib/formatCurrency";
import { useContext } from "react";
import { Skeleton } from "../ui/skeleton";

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
          <Card>
            <Skeleton className="h-[100px] w-[320px] rounded-xl" />
          </Card>
          <Card>
            <Skeleton className="h-[100px] w-[320px] rounded-xl" />
          </Card>
        </>
      ) : (
        portfolio.detailed.map((coinObject) => {
          return (
            <Card>
              <CardHeader>
                <CardTitle>{coinObject.name}</CardTitle>
                <CardDescription>
                  {coinObject.info.symbol.toUpperCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl">
                  {formatCurrency(coinObject.info.currentPrice)}
                </p>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

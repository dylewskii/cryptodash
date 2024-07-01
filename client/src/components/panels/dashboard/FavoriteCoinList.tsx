// react
import { useContext } from "react";
import UserContext from "@/context/UserContext";
// ui
import { Skeleton } from "../../ui/skeleton";
import { Card } from "@/components/ui/card";
import FavoriteCoinCard from "./FavoriteCoinCard";

export default function FavoriteCoinsList() {
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
        portfolio.detailed.map((coin, i) => {
          return (
            <FavoriteCoinCard key={`${coin.id}${i}`} portfolioCoin={coin} />
          );
        })
      )}
    </div>
  );
}

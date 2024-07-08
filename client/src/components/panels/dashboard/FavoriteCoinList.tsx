// ui
import { Skeleton } from "../../ui/skeleton";
import { Card } from "@/components/ui/card";
import FavoriteCoinCard from "./FavoriteCoinCard";
// store
import { useUserStore } from "@/stores/useUserStore";

export default function FavoriteCoinsList() {
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
        portfolio.detailed.map((coin, i) => {
          return (
            <FavoriteCoinCard key={`${coin.id}${i}`} portfolioCoin={coin} />
          );
        })
      )}
    </div>
  );
}

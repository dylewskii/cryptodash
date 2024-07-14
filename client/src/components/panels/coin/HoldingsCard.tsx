// store
import { useUserStore } from "@/stores/useUserStore";
// ui
import {
  Card,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "../../ui/card";
import EditHoldingDialog from "@/components/ui/EditHoldingDialog";
import DeleteHoldingDialog from "@/components/ui/DeleteHoldingDialog";
import AddHoldingDialog from "@/components/ui/AddHoldingDialog";
// utils
import { formatCurrency } from "@/lib";
// types
import { DetailedCoin } from "@/types";

interface HoldingsCardProps {
  coin: DetailedCoin | null;
  className?: string;
}

export default function HoldingsCard({ coin, className }: HoldingsCardProps) {
  const portfolio = useUserStore((state) => state.portfolio);
  const coinInPortfolio = portfolio.detailed.find(({ id }) => id === coin?.id);

  if (!coin || !coin.info) {
    return (
      <Card className="flex flex-col items-center justify-center mb-4 w-full h-[150px] rounded-xl dark:bg-zinc-700">
        <CardTitle className="flex items-center gap-2">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 4V2M15 20V22M4 9H2M20 15H22M4.91421 4.91421L3.5 3.5M19.0858 19.0858L20.5 20.5M12 17.6569L9.87868 19.7782C8.31658 21.3403 5.78392 21.3403 4.22183 19.7782C2.65973 18.2161 2.65973 15.6834 4.22183 14.1213L6.34315 12M17.6569 12L19.7782 9.87868C21.3403 8.31658 21.3403 5.78392 19.7782 4.22183C18.2161 2.65973 15.6834 2.65973 14.1213 4.22183L12 6.34315"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Uh oh, we encountered an error.
        </CardTitle>
        <CardDescription className="max-w-[40%] text-center">
          Please try refreshing the site, or if the error persists, get in touch
          with us.
        </CardDescription>
      </Card>
    );
  }

  const isLongBalance = coin.amount.length > 9;

  return (
    <Card className={`${className} flex flex-col justify-between pt-6 pb-6`}>
      <CardContent className="flex flex-col p-0 pt-10 pb-4 px-10">
        <CardDescription className="text-lg">Total Balance</CardDescription>
        <CardTitle className="flex pb-4">
          <span
            className={`${
              isLongBalance ? "text-2xl" : "text-4xl"
            } pr-2 md:text-4xl lg:text-5xl`}
          >
            {coin.amount}
          </span>
          <span
            className={`${
              isLongBalance ? "text-2xl" : "text-4xl"
            } md:text-4xl lg:text-5xl`}
          >
            {coin.info.symbol.toUpperCase()}
          </span>
        </CardTitle>

        <div className="flex flex-col">
          <p className="text-zinc-500 text-xl font-semibold pr-2 md:text-3xl lg:text-2xl">
            USD
          </p>
          <p className="text-lg font-semibold md:text-2xl lg:text-3xl">
            {formatCurrency(coin.totalValue)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {coinInPortfolio ? (
          <div className="flex gap-2">
            <DeleteHoldingDialog coin={coin} />
            <EditHoldingDialog coin={coin} />
          </div>
        ) : (
          <AddHoldingDialog coin={coin} />
        )}
      </CardFooter>
    </Card>
  );
}

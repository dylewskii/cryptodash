// context
import { useContext } from "react";
import UserContext from "@/context/UserContext";
// ui
import { Skeleton } from "../../ui/skeleton";
// utils
import formatCurrency from "@/lib/formatCurrency";

interface TotalBalanceProps {
  className?: string;
}

export default function TotalBalance({ className }: TotalBalanceProps) {
  const { portfolio, loading } = useContext(UserContext);
  const totalValueArray = portfolio.detailed.map(
    (coinObject) => coinObject.totalValue
  );

  const totalUsdPortfolioValue = totalValueArray.reduce(
    (acc, curr) => acc + curr,
    0
  );

  return (
    <div className={`flex flex-col ${className}`}>
      Total Balance
      {loading ? (
        <Skeleton className="h-[50px] w-[210px]" />
      ) : (
        <div className="flex gap-3">
          <p className="text-5xl">{formatCurrency(totalUsdPortfolioValue)}</p>
          <p className="flex items-center text-green-500">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 15L12 9L6 15"
                stroke="rgb(34 197 94)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            10%
          </p>
        </div>
      )}
    </div>
  );
}

// ui
import { useUserStore } from "@/stores/useUserStore";
import { Skeleton } from "../../ui/skeleton";
import { BlurredSkeleton } from "@/components/ui/blurred-skeleton";
// utils
import { formatCurrency } from "@/lib";
import { useEffect, useState } from "react";

interface TotalBalanceProps {
  className?: string;
}

export default function TotalBalance({ className }: TotalBalanceProps) {
  const portfolio = useUserStore((state) => state.portfolio);
  const portfolioLoading = useUserStore((state) => state.portfolioLoading);
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(false);

  const totalValueArray = portfolio.detailed.map(
    (coinObject) => coinObject.totalValue
  );

  const totalUsdPortfolioValue = totalValueArray.reduce(
    (acc, curr) => acc + curr,
    0
  );

  const handleHideBalance = () => {
    const newBalanceHidden = !isBalanceHidden;
    setIsBalanceHidden(newBalanceHidden);

    try {
      localStorage.setItem(
        "cryptodashe-isBalanceHidden",
        JSON.stringify(newBalanceHidden)
      );
    } catch (error) {
      console.error("Error saving balance preference:", error);
    }
  };

  // on mount, load the balance preference
  useEffect(() => {
    const loadBalancePreference = () => {
      try {
        const preference = localStorage.getItem("cryptodashe-isBalanceHidden");

        if (preference === null || preference === undefined) {
          setIsBalanceHidden(false);
          localStorage.setItem(
            "cryptodashe-isBalanceHidden",
            JSON.stringify(false)
          );
          return;
        }

        if (typeof preference === "string") {
          const balanceHiddenPreference = JSON.parse(preference);
          // double negation to convert to boolean equivalent
          setIsBalanceHidden(!!balanceHiddenPreference);
        } else {
          console.warn(
            "Unexpected total balance preference type:",
            typeof preference
          );
          setIsBalanceHidden(false);
        }
      } catch (err) {
        console.error("Error loading total balance preference:", err);
        setIsBalanceHidden(false);
      }
    };

    loadBalancePreference();
  }, []);

  return (
    <div className={`flex flex-col ${className}`}>
      <p className="tracking-wider">Total Balance</p>
      {portfolioLoading ? (
        <Skeleton className="h-[50px] w-[210px] pt-2 dark:bg-zinc-400" />
      ) : (
        <div className="flex gap-3">
          {isBalanceHidden ? (
            <BlurredSkeleton className="w-[50%] h-12 mt-2 bg-[#262626]" />
          ) : (
            <p className="text-5xl mt-2">
              {formatCurrency(totalUsdPortfolioValue)}
            </p>
          )}

          <p className="flex items-center">
            {isBalanceHidden ? (
              <svg
                onClick={handleHideBalance}
                className="w-6 h-6 mt-2"
                role="button"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.42012 12.7132C2.28394 12.4975 2.21584 12.3897 2.17772 12.2234C2.14909 12.0985 2.14909 11.9015 2.17772 11.7766C2.21584 11.6103 2.28394 11.5025 2.42012 11.2868C3.54553 9.50484 6.8954 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7766C21.8517 11.9015 21.8517 12.0985 21.8231 12.2234C21.785 12.3897 21.7169 12.4975 21.5807 12.7132C20.4553 14.4952 17.1054 19 12.0004 19C6.8954 19 3.54553 14.4952 2.42012 12.7132Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.0004 15C13.6573 15 15.0004 13.6569 15.0004 12C15.0004 10.3431 13.6573 9 12.0004 9C10.3435 9 9.0004 10.3431 9.0004 12C9.0004 13.6569 10.3435 15 12.0004 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                onClick={handleHideBalance}
                className="w-6 h-6 mt-2"
                role="button"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.7429 5.09232C11.1494 5.03223 11.5686 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7767C21.8518 11.9016 21.8517 12.0987 21.8231 12.2236C21.7849 12.3899 21.7164 12.4985 21.5792 12.7156C21.2793 13.1901 20.8222 13.8571 20.2165 14.5805M6.72432 6.71504C4.56225 8.1817 3.09445 10.2194 2.42111 11.2853C2.28428 11.5019 2.21587 11.6102 2.17774 11.7765C2.1491 11.9014 2.14909 12.0984 2.17771 12.2234C2.21583 12.3897 2.28393 12.4975 2.42013 12.7132C3.54554 14.4952 6.89541 19 12.0004 19C14.0588 19 15.8319 18.2676 17.2888 17.2766M3.00042 3L21.0004 21M9.8791 9.87868C9.3362 10.4216 9.00042 11.1716 9.00042 12C9.00042 13.6569 10.3436 15 12.0004 15C12.8288 15 13.5788 14.6642 14.1217 14.1213"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

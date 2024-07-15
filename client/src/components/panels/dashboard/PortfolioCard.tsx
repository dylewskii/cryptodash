// react
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDialog } from "@/hooks/useDialog";
// ui
import SelectorDropdown from "../../ui/SelectorDropdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "../../ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
// utils
import { formatCurrency, capitalizeFirstLetter } from "@/lib";
// types
import { DetailedCoin } from "@/types";
import { AddedCoin } from "@/hooks/useCoinSearch";
// stores
import { useUserStore } from "@/stores/useUserStore";
import { API_BASE_URL } from "@/config";

interface PortfolioEntryLineProps {
  coin: DetailedCoin;
}

export default function PortfolioCard() {
  const accessToken = useUserStore((state) => state.accessToken);
  const portfolio = useUserStore((state) => state.portfolio);
  const portfolioLoading = useUserStore((state) => state.portfolioLoading);
  const [addedCoin, setAddedCoin] = useState<AddedCoin | null>(null);
  const [addedAmount, setAddedAmount] = useState<string>("");
  const {
    dialogOpen,
    setDialogErrorMsg,
    dialogErrorMsg,
    pendingRequests,
    handleDialogToggle,
    handleRequest,
  } = useDialog();

  const addCoin = async () => {
    // check if coin name & amount have been added
    if (!addedCoin || !addedAmount) {
      setDialogErrorMsg("Please enter a valid coin name and amount.");
      return;
    }

    if (Number(addedAmount) < 0) {
      setDialogErrorMsg("Please enter a positive holding amount.");
      return;
    }

    await handleRequest(
      `${API_BASE_URL}/portfolio/add`,
      "POST",
      { id: addedCoin.id, amount: addedAmount },
      `${capitalizeFirstLetter(addedCoin.name)} has been added successfully`,
      "Failed to add coin",
      accessToken,
      "addCoin"
    );

    setAddedCoin(null);
    setAddedAmount("");
  };

  return (
    <ScrollArea className="rounded-md border dark:bg-[#272727]">
      <div className="p-4">
        {portfolioLoading ? (
          <Skeleton className="h-[150px] w-full rounded-xl mb-2 dark:bg-zinc-400" />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-2xl font-medium leading-none">Portfolio</h4>
              <Dialog open={dialogOpen} onOpenChange={handleDialogToggle}>
                <DialogTrigger>
                  <svg
                    className="w-8 h-8"
                    role="button"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add a Coin</DialogTitle>
                    <DialogDescription>
                      Enter the coin name and amount to add it to your
                      portfolio. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="coinName" className="text-left">
                        Coin
                      </label>
                      <SelectorDropdown
                        className="col-span-3"
                        label="Select a coin"
                        value={addedCoin ? addedCoin.id : ""}
                        onChange={(coin) => setAddedCoin(coin)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="coinAmount" className="text-left">
                        Amount
                      </label>
                      <Input
                        id="coinAmount"
                        type="number"
                        placeholder="Enter an amount"
                        value={addedAmount}
                        onChange={(e) => setAddedAmount(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="text-red-600">{dialogErrorMsg}</div>
                  <DialogFooter>
                    <Button type="submit" onClick={addCoin}>
                      {pendingRequests["addCoin"] ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <p>Adding Coin...</p>
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {portfolio.detailed.map((coin, i) => {
              if (!coin || !coin.name || !coin.info) {
                return (
                  <Skeleton
                    key={`${coin.id}${i}`}
                    className="h-[50px] w-full rounded-xl mb-2 dark:bg-zinc-400"
                  />
                );
              }

              return (
                <Link
                  to={`/app/coin/${coin.id.toLowerCase()}`}
                  state={{ coin }}
                  key={coin.id}
                >
                  <PortfolioEntryLine coin={coin} />
                </Link>
              );
            })}
          </>
        )}
      </div>
    </ScrollArea>
  );
}

function PortfolioEntryLine({ coin }: PortfolioEntryLineProps) {
  if (!coin || !coin.info || !coin.info.image) {
    return (
      <Skeleton className="h-[50px] w-full rounded-xl mt-6 dark:bg-zinc-400" />
    );
  }

  return (
    <>
      <div className="grid grid-cols-[50px_3fr] py-4 px-4 transition ease-in-out duration-400 hover:bg-[#121212] hover:text-white rounded-xl motion-reduce:transition-non">
        <span className="grid place-items-center grid-col-1 max-w-6">
          <img src={coin.info.image.sm} alt={coin?.name} />
        </span>
        <div className="grid-col-2 flex justify-between">
          <div className="flex flex-col">
            <p>{coin.name}</p>
            <p className="text-zinc-500">{formatCurrency(coin.totalValue)}</p>
          </div>
          <div className="flex items-center">
            <p className="text-sm">
              {coin.amount} <span>{coin.info.symbol.toUpperCase()}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

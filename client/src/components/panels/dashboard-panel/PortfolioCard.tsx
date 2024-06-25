// ------------------------------ IMPORTS ------------------------------
// react
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
// context
import DataContext from "@/context/DataContext";
import UserContext from "@/context/UserContext";
// ui
import SelectorDropdown from "../../ui/SelectorDropdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
import { useDialog } from "@/hooks/useDialog";
import formatCurrency from "@/lib/formatCurrency";
import capitalizeFirstLetter from "@/lib/capitalizeFirstLetter";
// types
import { DetailedCoin } from "@/context/UserContext";

interface PortfolioEntryLineProps {
  coin: DetailedCoin;
}

export default function PortfolioCard() {
  const { portfolio, loading } = useContext(UserContext);
  const { cryptoList } = useContext(DataContext);
  const [addedCoin, setAddedCoin] = useState<string>("");
  const [addedAmount, setAddedAmount] = useState<string>("");
  const {
    dialogOpen,
    setDialogErrorMsg,
    dialogErrorMsg,
    dialogReqPending,
    handleDialogToggle,
    handleRequest,
  } = useDialog();

  const addCoin = async () => {
    // check if coin name & amount have been added
    if (!addedCoin || !addedAmount) {
      setDialogErrorMsg("Please enter a valid coin name and amount");
      return;
    }

    // check if coin name is found within the CG crypto list
    const selectedCoin = cryptoList.find((coin) => coin.name === addedCoin);
    if (!selectedCoin) {
      setDialogErrorMsg("Selected coin is invalid");
      return;
    }

    await handleRequest(
      "http://localhost:8000/portfolio/add",
      "POST",
      { id: selectedCoin.id, amount: addedAmount },
      `${capitalizeFirstLetter(addedCoin)} has been added successfully`,
      "Failed to add coin"
    );

    setAddedCoin("");
    setAddedAmount("");
  };

  return (
    <ScrollArea className="rounded-md border">
      <div className="p-4">
        {loading ? (
          <Skeleton className="h-[150px] w-full rounded-xl mb-2" />
        ) : (
          <>
            <div className="flex justify-between mb-6">
              <h4 className="text-lg font-medium leading-none">Portfolio</h4>
              <Dialog open={dialogOpen} onOpenChange={handleDialogToggle}>
                <DialogTrigger>
                  <svg
                    className="w-6 h-6"
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
                <DialogContent className="sm:max-w-[425px]">
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
                        label="Select a coin"
                        items={cryptoList}
                        value={addedCoin}
                        onChange={setAddedCoin}
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
                      {dialogReqPending ? (
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
                    className="h-[50px] w-full rounded-xl mb-2"
                  />
                );
              }

              return (
                <Link
                  to={`/app/coin/${coin.name.toLowerCase()}`}
                  state={{ coin }}
                  key={coin.name}
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
    return <Skeleton className="h-[50px] w-full rounded-xl mt-6" />;
  }

  return (
    <div className="grid grid-cols-[50px_3fr] gap-2">
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
          {/* <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
        </div>
      </div>
      <Separator className="my-2 col-span-2" />
    </div>
  );
}

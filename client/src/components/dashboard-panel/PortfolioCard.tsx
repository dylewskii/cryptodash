// ------------------------------ IMPORTS ------------------------------
// ui
import SelectorDropdown from "../ui/SelectorDropdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
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
import { useToast } from "../ui/use-toast";
// react
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
// utils
import { sendAddCoinPostReq } from "@/lib/portfolioUtils";
import UserContext from "@/context/UserContext";
import formatCurrency from "@/lib/formatCurrency";
// types
import { DetailedCoin } from "@/context/UserContext";
// context
import DataContext from "@/context/DataContext";

interface PortfolioEntryLineProps {
  coin: DetailedCoin;
}

export default function PortfolioCard() {
  const { portfolio, loading } = useContext(UserContext);
  const { cryptoList } = useContext(DataContext);
  const [addedCoin, setAddedCoin] = useState<string>("");
  const [addedAmount, setAddedAmount] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { toast } = useToast();

  const addCoin = async () => {
    // check if coin name & amount have been added
    if (!addedCoin || !addedAmount) {
      setErrorMessage("Please enter a valid coin name and amount");
      return;
    }

    const selectedCoin = cryptoList.find((coin) => coin.name === addedCoin);

    if (!selectedCoin) {
      setErrorMessage("Selected coin is invalid");
      return;
    }

    sendAddCoinPostReq({
      id: selectedCoin.id,
      amount: addedAmount,
    })
      .then((res) => {
        if (res.success) {
          toast({
            title: `${addedCoin} has been added succesfully`,
            description: `Amount: ${res.coinData.amount}`,
          });
          setDialogOpen(false);
          setAddedCoin("");
          setAddedAmount("");
        } else {
          setErrorMessage("Failed to add coin");
        }
      })
      .catch((err) => {
        console.error(`Error while adding coin: ${err}`);
        setErrorMessage("Error adding coin");
      });
  };

  return (
    <ScrollArea className="rounded-md border">
      <div className="p-4">
        {loading ? (
          <Skeleton className="h-[150px] w-full rounded-xl" />
        ) : (
          <>
            <div className="flex justify-between mb-6">
              <h4 className="text-lg font-medium leading-none">Portfolio</h4>
              <Dialog
                open={dialogOpen}
                onOpenChange={() => {
                  setDialogOpen(!dialogOpen);
                  setErrorMessage("");
                }}
              >
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
                  <div className="text-red-600">{errorMessage}</div>
                  <DialogFooter>
                    <Button type="submit" onClick={addCoin}>
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {portfolio.detailed.map((coin) => (
              <Link
                to={`/app/coin/${coin.name.toLowerCase()}`}
                state={{ coin }}
                key={coin.name}
              >
                <PortfolioEntryLine coin={coin} />
              </Link>
            ))}
          </>
        )}
      </div>
    </ScrollArea>
  );
}

function PortfolioEntryLine({ coin }: PortfolioEntryLineProps) {
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
        </div>
      </div>
      <Separator className="my-2 col-span-2" />
    </div>
  );
}

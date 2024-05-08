// ------------------------------ IMPORTS ------------------------------
// ui
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

// react
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
// utils
import {
  fetchPortfolioCoinData,
  fetchPortfolioList,
  sendAddCoinPostReq,
} from "@/lib/portfolioUtils";
// import UserContext from "@/context/UserContext";

// ------------------------------- TYPES -------------------------------
// shape of each detailed portfolio coin
interface DetailedCoin {
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  ath: number;
}

export default function PortfolioCard() {
  // const { portfolioList } = useContext(UserContext);
  // array of objects containing info on each coin
  const [detailedPortfolio, setDetailedPortfolio] = useState<DetailedCoin[]>(
    []
  );
  // add coin name & amount
  const [addedCoin, setAddedCoin] = useState<string>("");
  const [addedAmount, setAddedAmount] = useState<string>("");
  // misc
  const [error, setError] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    //   setPortfolioCoins(["bitcoin", "ethereum", "solana", "binancecoin"]);
    setLoading(true);

    // fetch string array of every coin held by user in DB
    fetchPortfolioList()
      .then((portfolioArrayFromDB) => {
        return fetchPortfolioCoinData(portfolioArrayFromDB); // fetch detailed data for each coin
      })
      .then((detailedCoins) => {
        setDetailedPortfolio(detailedCoins);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  const addCoin = async () => {
    // check if coin name & amount have been added
    if (!addedCoin || !addedAmount) {
      setError("Please enter a valid coin name and amount");
      return;
    }

    sendAddCoinPostReq({
      name: addedCoin,
      amount: addedAmount,
    })
      .then((res) => {
        if (res.success) {
          toast({
            title: `${res.coinData.name} has been added`,
            description: `Amount: ${res.coinData.amount}`,
          });
          setDialogOpen(false);
          setAddedCoin("");
          setAddedAmount("");
        } else {
          setError("Failed to add coin");
        }
      })
      .catch((err) => {
        console.error(`Error while adding coin: ${err}`);
        setError("Error adding coin");
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
                  setError("");
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
                      <Input
                        id="coinName"
                        type="text"
                        placeholder="Enter a coin name"
                        value={addedCoin}
                        onChange={(e) => setAddedCoin(e.target.value)}
                        className="col-span-3"
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
                  <div className="text-red-600">{error}</div>
                  <DialogFooter>
                    <Button type="submit" onClick={addCoin}>
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {detailedPortfolio.map((coin, i) => (
              <div key={i} className="grid grid-cols-[50px_3fr] gap-2">
                <span className="grid place-items-center grid-col-1 max-w-6">
                  <img src={coin?.image} alt={coin?.name} />
                </span>
                <div className="grid-col-2 flex justify-between">
                  <div className="flex flex-col">
                    <p>{coin.name}</p>
                    <p className="text-zinc-500">
                      <span>$</span>
                      {coin.currentPrice}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm">
                      1.72 <span>{coin.symbol.toUpperCase()}</span>
                    </p>
                  </div>
                </div>
                <Separator className="my-2 col-span-2" />
              </div>
            ))}
          </>
        )}
      </div>
    </ScrollArea>
  );
}

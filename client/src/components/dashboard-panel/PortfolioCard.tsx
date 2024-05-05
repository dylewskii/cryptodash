// ui
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
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

// types
interface Coin {
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
}

interface CoinData {
  name: string;
  amount: string;
}

export default function PortfolioCard() {
  const [portfolio, setPortfolio] = useState<Coin[]>([]);
  const [addedCoin, setAddedCoin] = useState<string>("");
  const [addedAmount, setAddedAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const portfolioCoins = ["bitcoin", "ethereum", "solana", "dogecoin"];

    fetchPortfolioCoinData(portfolioCoins);
  }, []);

  const fetchPortfolioCoinData = async (coins: string[]) => {
    const requests = coins.map((coin) => {
      const url = `https://api.coingecko.com/api/v3/coins/${coin}`;
      return fetch(url)
        .then((res) => res.json())
        .then((data) => {
          return {
            name: data.name,
            symbol: data.symbol,
            image: data.image.small,
            currentPrice: data.market_data.current_price.usd,
          };
        })
        .catch((error) => {
          console.error("Error fetching portfolio data:", error);
          return null;
        });
    });

    Promise.all(requests)
      .then((results) => {
        const filteredResults = results.filter(
          (result) => result !== null
        ) as Coin[]; // filter out any nulls & assert type Coin[]
        setPortfolio(filteredResults);
      })
      .catch((error) => console.error("Error with Promise.all:", error));
  };

  const sendAddCoinPostReq = async (coinData: CoinData): Promise<void> => {
    const url = `http://localhost:8000/coins/add`;
    console.log(coinData);

    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coinData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error. status: ${res.status}`);
      }

      const jsonData = await res.json();

      if (!jsonData.success) {
        setError("Coin could not be added. Please try again.");
        return;
      }

      console.log("coin added");
      // -- IMPLEMENT TOAST FEEDBACK HERE --
      setDialogOpen(false);
    } catch (error) {
      console.error(`Failed to add coin`, error);
    }
  };

  const addCoin = async () => {
    // check if coin name & amount have been added
    if (!addedCoin || !addedAmount) {
      setError("Please enter a valid coin name and amount");
      return;
    }

    sendAddCoinPostReq({
      name: addedCoin,
      amount: addedAmount,
    });
  };

  // const addCoinToPortfolio = async () => {
  //   if (!addedCoin) return;

  //   const url = `https://api.coingecko.com/api/v3/coins/${addedCoin.toLowerCase()}`;
  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     const newCoin = {
  //       name: data.name,
  //       symbol: data.symbol,
  //       image: data.image.thumb,
  //       currentPrice: data.market_data.current_price.usd,
  //     };
  //     setPortfolio((prevState) => [...prevState, newCoin]);
  //     setDialogOpen(false);
  //     console.log(`${newCoin.name} has been added`);
  //   } catch (error) {
  //     console.error("Error fetching data for new coin:", error);
  //   }
  // };

  return (
    <ScrollArea className="rounded-md border">
      <div className="p-4">
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
                  Enter the coin name and amount to add it to your portfolio.
                  Click save when you're done.
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

        {portfolio.map((coin, i) => (
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
      </div>
    </ScrollArea>
  );
}

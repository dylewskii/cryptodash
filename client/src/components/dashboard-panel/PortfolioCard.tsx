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
import { useEffect, useState } from "react";

interface Coin {
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
}

export default function PortfolioCard() {
  const portfolioCoins = ["bitcoin", "ethereum", "solana", "dogecoin"];
  const [portfolio, setPortfolio] = useState<Coin[]>([]);
  const [addedCoin, setAddedCoin] = useState<string>("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
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
        console.log(results);
      })
      .catch((error) => console.error("Error with Promise.all:", error));
  };

  const addCoinToPortfolio = async () => {
    if (!addedCoin) return;

    const url = `https://api.coingecko.com/api/v3/coins/${addedCoin.toLowerCase()}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const newCoin = {
        name: data.name,
        symbol: data.symbol,
        image: data.image.thumb,
        currentPrice: data.market_data.current_price.usd,
      };
      setPortfolio((prevState) => [...prevState, newCoin]);
      setDialogOpen(false);
      console.log(`${newCoin.name} has been added`);
    } catch (error) {
      console.error("Error fetching data for new coin:", error);
    }
  };

  return (
    <ScrollArea className="rounded-md border">
      <div className="p-4">
        <div className="flex justify-between mb-6">
          <h4 className="text-lg font-medium leading-none">Portfolio</h4>
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
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
                  Add coins to your portfolio. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="coinName" className="text-right">
                    Coin
                  </label>
                  <Input
                    id="coinName"
                    placeholder="Bitcoin"
                    value={addedCoin}
                    onChange={(e) => setAddedCoin(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="coinAmount" className="text-right">
                    Amount
                  </label>
                  <Input
                    id="coinAmount"
                    defaultValue="1"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={addCoinToPortfolio}>
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
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

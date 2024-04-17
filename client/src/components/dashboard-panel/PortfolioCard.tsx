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

export default function PortfolioCard() {
  const portfolioCoins: string[] = [
    "Bitcoin",
    "Ethereum",
    "Solana",
    "Dogecoin",
  ];

  return (
    <ScrollArea className="rounded-md border">
      <div className="p-4">
        <div className="flex justify-between mb-6">
          <h4 className="text-lg font-medium leading-none">Portfolio</h4>
          <Dialog>
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
                    defaultValue="Bitcoin"
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
                <Button type="submit">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {portfolioCoins.map((coin, i) => (
          <div key={i} className="grid grid-cols-[50px_3fr] gap-2">
            <span className="grid place-items-center grid-col-1 max-w-6">
              <img src="./" />
            </span>
            <div className="grid-col-2 flex justify-between">
              <div className="flex flex-col">
                <p>{coin}</p>
                <p className="text-zinc-500">$550</p>
              </div>
              <div className="flex items-center">
                <p className="text-sm">
                  1.72 <span>BTC</span>
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

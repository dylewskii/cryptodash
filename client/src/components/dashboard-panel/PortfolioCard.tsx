import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
        <h4 className="mb-4 text-lg font-medium leading-none">Portfolio</h4>
        {portfolioCoins.map((coin, i) => (
          <>
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
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  );
}

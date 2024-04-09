import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const cryptoList = [
  {
    value: "Bitcoin",
    ticker: "BTC",
  },
  {
    value: "Ethereum",
    ticker: "ETH",
  },
  {
    value: "Solana",
    ticker: "SOL",
  },
  {
    value: "Dogecoin",
    ticker: "DOGE",
  },
  {
    value: "Avalanche",
    ticker: "AVAX",
  },
  {
    value: "Binance Smart Chain",
    ticker: "BSC",
  },
  {
    value: "ChainLink",
    ticker: "LINK",
  },
  {
    value: "Fantom",
    ticker: "FTM",
  },
  {
    value: "Polygon",
    ticker: "MATIC",
  },
  {
    value: "Near",
    ticker: "NEAR",
  },
  {
    value: "Aptos",
    ticker: "APT",
  },
  {
    value: "Sei",
    ticker: "SEI",
  },
];

export default function CoinSelection() {
  return (
    <section className="flex flex-col bg-indigo-900 mx-auto mt-10 pt-2 pb-3 px-3 w-96 rounded-2xl md:mt-0 text-white">
      <Header />
      <Searchbar />
      <QuickAccess />
      <CoinList />
    </section>
  );
}

const Header = () => {
  return (
    <div className="flex justify-between items-center py-2 mb-2">
      <a className="cursor-pointer">
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>

      <div className="mx-auto">
        <p className="text-xl">Select a token</p>
      </div>
    </div>
  );
};

const Searchbar = () => {
  return (
    <div className="flex items-center">
      <svg
        className="w-6 h-6 mr-1"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <Input
        className="bg-transparent w-4/6 flex-1"
        placeholder="Search by name or paste address"
      />
    </div>
  );
};

const QuickAccess = () => {
  return (
    <div>
      <ul className="flex gap-4 mx-auto my-4">
        <li>
          <a>
            <Badge
              variant="outline"
              className="rounded-md text-white p-2 hover:bg-slate-800"
            >
              SOL
            </Badge>
          </a>
        </li>
        <li>
          <a>
            <Badge
              variant="outline"
              className="rounded-md text-white p-2 hover:bg-slate-800"
            >
              ETH
            </Badge>
          </a>
        </li>
        <li>
          <a>
            <Badge
              variant="outline"
              className="rounded-md text-white p-2 hover:bg-slate-800"
            >
              WETH
            </Badge>
          </a>
        </li>
        <li>
          <a>
            <Badge
              variant="outline"
              className="rounded-md text-white p-2 hover:bg-slate-800"
            >
              USDC
            </Badge>
          </a>
        </li>
        <li>
          <a>
            <Badge
              variant="outline"
              className="rounded-md text-white p-2 hover:bg-slate-800"
            >
              USDT
            </Badge>
          </a>
        </li>
        <li>
          <a>
            <Badge
              variant="outline"
              className="rounded-md text-white p-2 hover:bg-slate-800"
            >
              DAI
            </Badge>
          </a>
        </li>
      </ul>
      <Separator className="mt-6" />
    </div>
  );
};

const CoinList = () => {
  return (
    <div className="p-2">
      <ScrollArea className="h-72 w-48 rounded-md w-full">
        {cryptoList.map((coin, i) => (
          <ul className="flex my-2 justify-between items-center">
            <li className="flex gap-4 justify-center items-center">
              <img src="./" />
              <div className="flex flex-col">
                <p key={i} className="text-sm">
                  {coin.value}
                </p>
                <p>{coin.ticker}</p>
              </div>
            </li>

            <span>0</span>
          </ul>
        ))}
      </ScrollArea>
    </div>
  );
};

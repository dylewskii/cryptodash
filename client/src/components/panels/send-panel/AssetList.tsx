// ui
import { ScrollArea } from "../../ui/scroll-area";

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

export default function AssetList() {
  return (
    <div className="p-2">
      <ScrollArea className="h-72 w-48 rounded-md w-full">
        {cryptoList.map((coin, i) => (
          <ul
            key={i}
            className="flex my-2 justify-between items-center no-scrollbar  "
          >
            <li className="flex gap-4 justify-center items-center py-4">
              <img src="./" />
              <div className="flex flex-col">
                <p key={i} className="text-sm">
                  {coin.value}
                </p>
                <p>{coin.ticker}</p>
              </div>
            </li>

            <span className="text-2xl">0</span>
          </ul>
        ))}
      </ScrollArea>
    </div>
  );
}

// ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../../ui/skeleton";
// utils
import { formatCurrency, roundToTwoDecimalPlaces } from "@/lib";
import { useNavigate } from "react-router-dom";
import { AddedCoin } from "@/hooks/useCoinSearch";

export interface CoinObject {
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  circulating_supply: number;
  current_price: number;
  fully_diluted_valuation: number;
  high_24h: number;
  id: string;
  image: string;
  last_updated: string;
  low_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  market_cap_rank: number;
  max_supply: number;
  name: string;
  price_change_24h: number;
  price_change_percentage_24h: number;
  roi: null;
  symbol: string;
  total_supply: number;
  total_volume: number;
}

interface CryptoListTableProps {
  cryptoList: (CoinObject | AddedCoin)[];
  loading: boolean;
}

export default function CryptoListTable({
  cryptoList,
  loading,
}: CryptoListTableProps) {
  const navigate = useNavigate();
  const handleRowClick = (coinId: string) => {
    navigate(`/app/coin/${coinId}`);
  };

  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[25px]">Rank</TableHead>
          <TableHead className="w-[25px]">Icon</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>% (24h)</TableHead>
          <TableHead className="text-right">Market Cap</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cryptoList.map((coin, i) => {
          const isCoinObject = "current_price" in coin;
          return (
            <TableRow
              key={`${coin.name}${i}`}
              className="cursor-pointer"
              onClick={() => handleRowClick(coin.id)}
            >
              <TableCell>
                <div className="font-medium flex items-center">
                  {isCoinObject
                    ? coin.market_cap_rank
                    : coin.market_cap_rank || "N/A"}
                </div>
              </TableCell>
              <TableCell>
                <img
                  src={isCoinObject ? coin.image : coin.thumb}
                  alt={`${coin.name} logo`}
                />
              </TableCell>
              <TableCell>{coin.name}</TableCell>
              <TableCell>
                {isCoinObject ? formatCurrency(coin.current_price) : "N/A"}
              </TableCell>
              <TableCell
                className={
                  isCoinObject && coin.price_change_percentage_24h < 0
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                <div className="flex justify-end items-center">
                  {isCoinObject
                    ? `${roundToTwoDecimalPlaces(
                        coin.price_change_percentage_24h
                      )}%`
                    : "N/A"}
                  {isCoinObject &&
                    (coin.price_change_percentage_24h < 0 ? (
                      <svg
                        className="w-4 h-4 mt-[2px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 mt-[2px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 15L12 9L6 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {isCoinObject
                  ? formatCurrency(coin.market_cap, "USD", 2, 0)
                  : "N/A"}
              </TableCell>
            </TableRow>
          );
        })}
        {loading &&
          Array.from({ length: 8 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell colSpan={6} className="text-center">
                <Skeleton className="w-full h-12" />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

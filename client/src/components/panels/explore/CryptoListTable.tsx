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
  cryptoList: CoinObject[];
  loading: boolean;
}

export default function CryptoListTable({
  cryptoList,
  loading,
}: CryptoListTableProps) {
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
        {cryptoList.map((coinObject: CoinObject, i) => (
          <TableRow key={`${coinObject.name}${i}`}>
            <TableCell>
              <div className="font-medium flex items-center">
                {coinObject.market_cap_rank}
              </div>
            </TableCell>
            <TableCell>
              <img src={coinObject.image} alt="" />
            </TableCell>
            <TableCell>{coinObject.name}</TableCell>
            <TableCell>{formatCurrency(coinObject.current_price)}</TableCell>
            <TableCell
              className={
                coinObject.price_change_percentage_24h < 0
                  ? "text-red-600"
                  : "text-green-600"
              }
            >
              <div className="flex justify-end items-center">
                {roundToTwoDecimalPlaces(
                  coinObject.price_change_percentage_24h
                ) + "%"}
                {coinObject.price_change_percentage_24h < 0 ? (
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
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(coinObject.market_cap, "USD", 2, 0)}
            </TableCell>
          </TableRow>
        ))}
        {loading && (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              <Skeleton className="w-full h-10" />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

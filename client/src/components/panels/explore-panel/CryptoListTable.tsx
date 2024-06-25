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
import formatCurrency from "@/lib/formatCurrency";

export interface CoinObject {
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  circulating_supply: number;
  current_price: 60907;
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
    <>
      {loading ? (
        <Skeleton className="h-[300px] w-full md:h-[600px] rounded-xl mt-4" />
      ) : (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25px]">Rank</TableHead>
              <TableHead className="w-[25px]">Icon</TableHead>

              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptoList.map((coinObject: CoinObject, i) => {
              return (
                <TableRow key={`${coinObject.name}${i}`}>
                  <TableCell className="font-medium flex items-center">
                    {coinObject.market_cap_rank}
                  </TableCell>
                  <TableCell>
                    <img src={coinObject.image} alt=""></img>
                  </TableCell>
                  <TableCell>{coinObject.name}</TableCell>
                  <TableCell>
                    {formatCurrency(coinObject.current_price)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(coinObject.market_cap)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );
}

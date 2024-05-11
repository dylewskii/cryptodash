import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import formatCurrency from "@/lib/formatCurrency";

interface CoinObject {
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

export default function CryptoListTable() {
  const [cryptoList, setCryptoList] = useState<CoinObject[]>([]);

  useEffect(() => {
    const fetchCryptoCoinsList = async () => {
      const url = `http://localhost:8000/data/coins-list-with-data`;
      try {
        const response = await fetch(url, {
          credentials: "include",
        });
        const data = await response.json();
        setCryptoList(data.data);
      } catch (err) {
        console.error("Failed to fetch coins list from API:", err);
      }
    };
    fetchCryptoCoinsList();
  }, []);

  return (
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
        {cryptoList.map((coinObject) => {
          return (
            <TableRow>
              <TableCell className="font-medium flex items-center">
                {coinObject.market_cap_rank}
              </TableCell>
              <TableCell>
                <img src={coinObject.image} alt=""></img>
              </TableCell>
              <TableCell>{coinObject.name}</TableCell>
              <TableCell>{formatCurrency(coinObject.current_price)}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(coinObject.market_cap)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

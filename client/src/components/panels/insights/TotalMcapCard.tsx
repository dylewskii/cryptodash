// react
import { useCallback, useEffect, useState } from "react";
// store
import { useUserStore } from "@/stores/useUserStore";
// ui
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// utils
import { formatCurrency } from "@/lib";
import { API_BASE_URL } from "@/config";

interface TotalMcapCardProps {
  className?: string;
}

export default function TotalMcapCard({ className = "" }: TotalMcapCardProps) {
  const [totalMcap, setTotalMcap] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const accessToken = useUserStore((state) => state.accessToken);

  const fetchMcapData = useCallback(async () => {
    const cacheKey = "totalMcapData";
    const cachedData = localStorage.getItem(cacheKey);
    const now = new Date();

    // use cached data if it's within 24hrs
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const expiryTime = 24 * 60 * 60 * 1000; // 24hrs in millisecs
      const lastUpdatedDate = new Date(timestamp);

      setLastUpdated(lastUpdatedDate.toLocaleString());

      if (now.getTime() - timestamp < expiryTime) {
        const untruncatedTotalMcap = data.usd;
        const truncatedTotalMcap = Math.trunc(Number(untruncatedTotalMcap));

        setTotalMcap(formatCurrency(truncatedTotalMcap, "usd", 2, 0));
        return;
      }
    }

    const url = `${API_BASE_URL}/data/total-market-cap`;
    const options: RequestInit = {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    // fetch new data if older than 24hrs
    const res = await fetch(url, options);
    const jsonData = await res.json();

    if (jsonData.success) {
      const currentTimestamp = now.getTime();
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ data: jsonData.data, timestamp: currentTimestamp })
      );

      const untruncatedTotalMcap = jsonData.data.usd;
      const truncatedTotalMcap = Math.trunc(Number(untruncatedTotalMcap));

      setTotalMcap(formatCurrency(truncatedTotalMcap));
      setLastUpdated(new Date(currentTimestamp).toLocaleString());
    } else {
      console.error("Failed to fetch total mcap data");
    }
  }, [accessToken]);

  useEffect(() => {
    fetchMcapData();
  }, [fetchMcapData]);

  return (
    <div className={`${className}`}>
      <Card>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            Total Crypto Market Cap
          </CardTitle>
          <div className="absolute top-0 right-0 pr-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="flex max-w-64">
                    The total market capitalization of crypto is the real-time
                    calculation of all coins and tokens listed by crypto price
                    tracking websites. It is calculated by multiplying the
                    current price of a cryptocurrency by its circulating supply
                    <br />
                    <br />
                    &#40;Market Cap = Current Price x Circulating Supply&#41;
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="flex justify-end text-2xl font-bold text-orange-500 sm:font-bold sm:text-4xl md:text-5xl md:font-extrabold lg:md:text-6xl">
          {totalMcap === "" ? <p>Loading...</p> : <p>{totalMcap}</p>}
        </CardContent>
        <CardFooter className="flex justify-end text-xs text-zinc-400">
          Last updated: {lastUpdated}
        </CardFooter>
      </Card>
    </div>
  );
}

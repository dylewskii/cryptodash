import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import formatCurrency from "@/lib/formatCurrency";

interface TotalMcapCardProps {
  className?: string;
}

export default function TotalMcapCard({ className = "" }: TotalMcapCardProps) {
  const [totalMcap, setTotalMcap] = useState("");
  const url = "http://localhost:8000/data/total-market-cap";

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = "totalMcapData";
      const cachedData = localStorage.getItem(cacheKey);
      const now = new Date();

      // use cached data if it's within 24hrs
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const expiryTime = 24 * 60 * 60 * 1000; // 24hrs in millisecs
        if (now.getTime() - timestamp < expiryTime) {
          setTotalMcap(formatCurrency(data.usd));
          return;
        }
      }

      // fetch new data if older than 24hrs
      const res = await fetch(url, { credentials: "include" });
      const jsonData = await res.json();

      if (jsonData.success) {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data: jsonData.data, timestamp: now.getTime() })
        );
        setTotalMcap(formatCurrency(jsonData.data.usd));
      } else {
        console.error("Failed to fetch total mcap data");
      }
    };

    fetchData();
  }, []);

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
        <CardContent>
          {totalMcap === "" ? <p>Loading...</p> : <p>{totalMcap}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

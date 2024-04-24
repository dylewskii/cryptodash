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
  className?: string; // optional
}

export default function TotalMcapCard({ className = "" }: TotalMcapCardProps) {
  const [totalMcap, setTotalMcap] = useState("");

  // useEffect(() => {
  //   const url = `https://api.coingecko.com/api/v3/global`;

  //   const fetchData = async () => {
  //     const res = await fetch(url);
  //     const data = await res.json();
  //     const total = data.data.total_market_cap.usd;

  //     setTotalMcap(formatCurrency(url));
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = () => {
      const url2 = 100000000000000;
      setTotalMcap(formatCurrency(url2));
    };
    fetchData();
  }, []);

  return (
    <div className={`${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Total Crypto Market Cap
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalMcap === "" ? <p>Loading...</p> : <p>{totalMcap}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

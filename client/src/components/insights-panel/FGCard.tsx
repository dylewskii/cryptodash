import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FGCardProps {
  className?: string;
}

// FG = Fear & Greed Index Score
export default function FGCard({ className = "" }: FGCardProps) {
  return (
    <div className={`${className}`}>
      <Card className="relative">
        <div className="absolute top-0 right-0 p-2">
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
                <p className="max-w-64">
                  The Fear and Greed Index measures emotions and sentiments from
                  various sources, converting them into a simple numerical index
                  for Bitcoin and other major cryptocurrencies.
                  <br />
                  <br />
                  This index, ranging from 0 &#40;Extreme Fear&#41; to 100
                  &#40;Extreme Greed&#41;, helps investors understand market
                  sentiment, potentially indicating buying opportunities during
                  extreme fear or warning of potential downturns during extreme
                  greed.
                  <br />
                  <br />
                  Find out more at{" "}
                  <a
                    href="https://alternative.me/crypto/fear-and-greed-index/"
                    className="text-orange-600"
                  >
                    Alternative.me
                  </a>
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <img
          src="https://alternative.me/crypto/fear-and-greed-index.png"
          alt="Latest Crypto Fear & Greed Index"
        />
      </Card>
    </div>
  );
}

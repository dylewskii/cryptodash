import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FGCardProps {
  className?: string; // The question mark denotes that the prop is optional
}

// Fear / Greed Index Score
export default function FGCard({ className = "" }: FGCardProps) {
  return (
    <div className={`${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Fear & Greed Index
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
                    The index measures whether stocks are fairly priced by
                    determining how emotions influence how much investors are
                    willing to pay for assets. The index assumes that fear
                    drives stocks lower while greed boosts asset values.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>SCORE</p>
        </CardContent>
      </Card>
    </div>
  );
}

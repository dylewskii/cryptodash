import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TotalMcapCardProps {
  className?: string; // The question mark denotes that the prop is optional
}

// Total Cryptocurrency Market Cap
export default function TotalMcapCard({ className = "" }: TotalMcapCardProps) {
  return (
    <div className={`${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Total Crypto Market Cap
            <a>
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
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>TOTAL MCAP</p>
        </CardContent>
      </Card>
    </div>
  );
}

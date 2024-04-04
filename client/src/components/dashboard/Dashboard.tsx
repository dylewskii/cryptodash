import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  return (
    <section>
      <div className="flex flex-col mx-2 my-4">
        Total Balance
        <div className="flex gap-3">
          <p className="text-5xl">
            <span>$</span>100,000
          </p>
          <p className="flex items-center text-green-500">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 15L12 9L6 15"
                stroke="rgb(34 197 94)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            10%
          </p>
        </div>
      </div>
      <div className="custom-grid-1 mx-1 my-2 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Bitcoin</CardTitle>
            <CardDescription>BTC</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">
              <span>$</span>80,000
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ethereum</CardTitle>
            <CardDescription>ETH</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">
              <span>$</span>5000
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solana</CardTitle>
            <CardDescription>SOL</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">
              <span>$</span>300
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dogecoin</CardTitle>
            <CardDescription>DOGE</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">
              <span>$</span>1
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

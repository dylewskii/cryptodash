import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TopCoins() {
  return (
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
  );
}

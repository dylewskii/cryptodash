import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import formatCurrency from "@/lib/formatCurrency";
import { useState } from "react";
import { DetailedCoin } from "@/context/UserContext";

interface CoinHoldingsCardProps {
  coin: DetailedCoin;
}

export default function CoinHoldingsCard({ coin }: CoinHoldingsCardProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleEditPosition = () => {};

  return (
    <Card className="w-full md:w-[350px] flex justify-center flex-col">
      <CardHeader>
        <CardTitle className="flex gap-2">
          <img
            src={coin.info.image}
            alt="Cryptocurrency Icon"
            className="h-20 md:h-28"
          />
          <div>
            <p className="text-2xl">
              {coin.name} &#40;{coin.info.symbol.toUpperCase()}&#41;
            </p>
            <p className="flex justify-center text-4xl">
              {formatCurrency(coin.info.currentPrice)}
            </p>
          </div>
          <CardDescription></CardDescription>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Current Holdings: {coin.amount}</p>
        <p>Total Value: {formatCurrency(coin.totalValue)}</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Dialog
          open={dialogOpen}
          onOpenChange={() => {
            setDialogOpen(!dialogOpen);
            setErrorMessage("");
          }}
        >
          <DialogTrigger>
            <Button onClick={handleEditPosition}>Edit Position</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{coin.name}</DialogTitle>
              <DialogDescription>
                Edit your position below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="text-red-600">{errorMessage}</div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

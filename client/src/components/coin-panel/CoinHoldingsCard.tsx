// react
import { useState } from "react";
// ui
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
// utils
import formatCurrency from "@/lib/formatCurrency";
// interfaces
import { DetailedCoin } from "@/context/UserContext";
import { useToast } from "../ui/use-toast";

interface CoinHoldingsCardProps {
  coin: DetailedCoin;
}

export default function CoinHoldingsCard({ coin }: CoinHoldingsCardProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [editedHolding, setEditedHolding] = useState<string>("");
  const { toast } = useToast();

  const editHolding = async () => {
    const coinToEdit = coin.id;
    const url = `http://localhost:8000/coins/edit`;

    try {
      const res = await fetch(url, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coinId: coinToEdit,
          editedAmount: editedHolding,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMessage("Failed to edit holding amount");
      }

      toast({
        title: `Your ${coinToEdit} position has been edited to: ${editedHolding}`,
      });
      setDialogOpen(false);
      setEditedHolding("");
    } catch (err) {
      console.error("Failed to send edit request to API", err);
    }
  };

  const deleteHolding = async () => {
    const coinToDelete = coin.id;
    const url = `http://localhost:8000/coins/delete`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coinId: coinToDelete }),
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMessage("Failed to delete coin");
      }

      toast({
        title: `${coinToDelete} has been deleted`,
      });
      setDialogOpen(false);
      setEditedHolding("");
    } catch (err) {
      console.error("Failed to send delete request to API", err);
    }
  };

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
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Edit Position
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{coin.name}</DialogTitle>
              <DialogDescription>
                Edit your position below. Click save when you're done.
              </DialogDescription>
              <div className="pt-4">
                <Label htmlFor="currentHolding">Current Holding</Label>
                <Input
                  id="currentHolding"
                  disabled={true}
                  value={coin.amount}
                  className="mt-2"
                />
              </div>
              <div className="pt-4">
                <Label htmlFor="newHolding">New Holding</Label>
                <Input
                  type="number"
                  id="newHolding"
                  min="0"
                  className="mt-2"
                  value={editedHolding}
                  onChange={(e) => setEditedHolding(e.target.value)}
                />
              </div>
            </DialogHeader>
            <div className="text-red-600">{errorMessage}</div>
            <DialogFooter className="sm:flex sm:justify-between">
              <Button
                variant="destructive"
                type="submit"
                className="justify-start"
                onClick={deleteHolding}
              >
                Delete Holding
              </Button>
              <Button type="submit" onClick={editHolding}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

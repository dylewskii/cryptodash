// react
import { useState } from "react";
// store
import { useUserStore } from "@/stores/useUserStore";
// ui
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Loader2 } from "lucide-react";
// utils
import { capitalizeFirstLetter } from "@/lib";
import { useToast } from "@/components/ui/use-toast";
import { useDialog } from "@/hooks/useDialog";
// types
import { DetailedCoin } from "@/types";
import { API_BASE_URL } from "@/config";

interface AddHoldingDialogProps {
  coin: DetailedCoin;
}

export default function AddHoldingDialog({ coin }: AddHoldingDialogProps) {
  const {
    dialogOpen,
    dialogErrorMsg,
    pendingRequests,
    handleDialogToggle,
    handleRequest,
  } = useDialog();
  const accessToken = useUserStore((state) => state.accessToken);
  const [holdingAmount, setHoldingAmount] = useState<string>("");
  const { toast } = useToast();

  const addHolding = async () => {
    if (
      !holdingAmount ||
      isNaN(Number(holdingAmount)) ||
      Number(holdingAmount) <= 0
    ) {
      toast({
        title: "Invalid amount. Please enter a positive number.",
        duration: 3000,
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await handleRequest(
        `${API_BASE_URL}/portfolio/add`,
        "POST",
        {
          id: coin.id,
          amount: holdingAmount,
        },
        `Added ${holdingAmount} ${capitalizeFirstLetter(
          coin.name
        )} to portfolio.`,
        "Failed to add holding.",
        accessToken,
        "addHolding"
      );

      if (!response) {
        throw new Error("Failed to add holding");
      }
    } catch (err) {
      console.error("Error adding holding:", err);
      toast({
        title: "Failed to add holding. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogToggle}>
      <DialogTrigger className="min-w-[100px] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        <svg
          className="h-4 w-4 mr-1"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Add to Portfolio
      </DialogTrigger>

      <DialogContent className="max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="pb-4">{coin.name}</DialogTitle>
          <DialogDescription className="pb-4">
            Enter the amount you would like to add to your portfolio. Click 'Add
            to Portfolio' when you're done.
          </DialogDescription>
          <div className="pt-4">
            <Label htmlFor="holdingAmount">Amount:</Label>
            <Input
              type="number"
              id="holdingAmount"
              min="0"
              step="any"
              className="mt-2"
              value={holdingAmount}
              onChange={(e) => setHoldingAmount(e.target.value)}
            />
          </div>
        </DialogHeader>
        <div className="text-red-600">{dialogErrorMsg}</div>
        <DialogFooter className="flex flex-row justify-end">
          <Button
            disabled={pendingRequests["addHolding"]}
            type="submit"
            onClick={addHolding}
            className="max-w-[50%]"
          >
            {pendingRequests["addHolding"] ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <p>Adding...</p>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>Add to Portfolio</p>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

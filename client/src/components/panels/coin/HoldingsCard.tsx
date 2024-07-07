// react
import { useContext, useState } from "react";
import { useDialog } from "@/hooks/useDialog";
// ui
import {
  Card,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "../../ui/card";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Loader2 } from "lucide-react";
// utils
import { formatCurrency, capitalizeFirstLetter } from "@/lib";
// types /interface
import UserContext, { DetailedCoin } from "@/context/UserContext";

interface HoldingsCardProps {
  coin: DetailedCoin;
  updateCoinData: (updatedCoin: DetailedCoin) => void;
  className?: string;
}

export default function HoldingsCard({
  coin,
  updateCoinData,
  className,
}: HoldingsCardProps) {
  const {
    dialogOpen,
    dialogErrorMsg,
    dialogReqPending,
    handleDialogToggle,
    handleRequest,
  } = useDialog();
  const { accessToken } = useContext(UserContext);
  const [editedHolding, setEditedHolding] = useState<string>("");
  const isLargeBalance = coin.amount.length > 9;

  const editHolding = async () => {
    const coinToEdit = coin.id;
    handleRequest(
      `http://localhost:8000/portfolio/edit`,
      "PATCH",
      {
        coinId: coinToEdit,
        editedAmount: editedHolding,
      },
      `Edited ${capitalizeFirstLetter(coin.name)} position: ${editedHolding}`,
      "Failed to edit holding amount",
      accessToken
    );
    const newTotalValue =
      Number(editedHolding) * Number(coin.info.currentPrice);

    const updatedCoin = {
      ...coin,
      amount: editedHolding,
      totalValue: newTotalValue,
    };
    updateCoinData(updatedCoin);
  };

  const deleteHolding = async () => {
    const coinToDelete = coin.id;
    handleRequest(
      `http://localhost:8000/portfolio/delete`,
      "DELETE",
      { coinId: coinToDelete },
      `${coinToDelete} has been deleted`,
      "An error occurred while deleting the coin.",
      accessToken
    );
  };

  return (
    <Card className={`${className} flex-col justify-center`}>
      <CardContent className="flex flex-col p-0 pt-10 pb-4 px-10">
        <CardDescription className="text-lg">Total Balance</CardDescription>
        <CardTitle className="flex pb-4">
          <span
            className={`${
              isLargeBalance ? "text-2xl" : "text-3xl"
            } pr-2 md:text-5xl lg:text-4xl`}
          >
            {coin.amount}
          </span>
          <span
            className={`${
              isLargeBalance ? "text-2xl" : "text-3xl"
            } md:text-5xl lg:text-4xl`}
          >
            {coin.info.symbol.toUpperCase()}
          </span>
        </CardTitle>

        <div className="flex">
          <p className="text-zinc-500 text-xl font-semibold pr-2 md:text-3xl lg:text-2xl">
            USD
          </p>
          <p className="text-lg font-semibold md:text-3xl lg:text-2xl">
            {formatCurrency(coin.totalValue)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={handleDialogToggle}>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <svg
              className="h-4 w-4 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 3.99998H6.8C5.11984 3.99998 4.27976 3.99998 3.63803 4.32696C3.07354 4.61458 2.6146 5.07353 2.32698 5.63801C2 6.27975 2 7.11983 2 8.79998V17.2C2 18.8801 2 19.7202 2.32698 20.362C2.6146 20.9264 3.07354 21.3854 3.63803 21.673C4.27976 22 5.11984 22 6.8 22H15.2C16.8802 22 17.7202 22 18.362 21.673C18.9265 21.3854 19.3854 20.9264 19.673 20.362C20 19.7202 20 18.8801 20 17.2V13M7.99997 16H9.67452C10.1637 16 10.4083 16 10.6385 15.9447C10.8425 15.8957 11.0376 15.8149 11.2166 15.7053C11.4184 15.5816 11.5914 15.4086 11.9373 15.0627L21.5 5.49998C22.3284 4.67156 22.3284 3.32841 21.5 2.49998C20.6716 1.67156 19.3284 1.67155 18.5 2.49998L8.93723 12.0627C8.59133 12.4086 8.41838 12.5816 8.29469 12.7834C8.18504 12.9624 8.10423 13.1574 8.05523 13.3615C7.99997 13.5917 7.99997 13.8363 7.99997 14.3255V16Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Edit
          </DialogTrigger>

          <DialogContent className="max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{coin.name}</DialogTitle>
              <DialogDescription>
                Edit your position below. Click save when you're done.
              </DialogDescription>
              <div className="pt-4">
                <Label htmlFor="currentHolding">Current Holding:</Label>
                <Input
                  id="currentHolding"
                  disabled={true}
                  value={coin.amount}
                  className="mt-2"
                />
              </div>
              <div className="pt-4">
                <Label htmlFor="newHolding">New Holding &#40;Total&#41;:</Label>
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
            <div className="text-red-600">{dialogErrorMsg}</div>
            <DialogFooter className="flex flex-row justify-between sm:justify-between">
              <Button
                variant="destructive"
                type="submit"
                onClick={deleteHolding}
                className="max-w-[50%]"
              >
                {dialogReqPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <p>Deleting...</p>
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
                        d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p> Delete Holding</p>
                  </>
                )}
              </Button>
              <Button
                type="submit"
                onClick={editHolding}
                className="max-w-[50%]"
              >
                {dialogReqPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <p>Editing...</p>
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
                        d="M7 3V6.4C7 6.96005 7 7.24008 7.10899 7.45399C7.20487 7.64215 7.35785 7.79513 7.54601 7.89101C7.75992 8 8.03995 8 8.6 8H15.4C15.9601 8 16.2401 8 16.454 7.89101C16.6422 7.79513 16.7951 7.64215 16.891 7.45399C17 7.24008 17 6.96005 17 6.4V4M17 21V14.6C17 14.0399 17 13.7599 16.891 13.546C16.7951 13.3578 16.6422 13.2049 16.454 13.109C16.2401 13 15.9601 13 15.4 13H8.6C8.03995 13 7.75992 13 7.54601 13.109C7.35785 13.2049 7.20487 13.3578 7.10899 13.546C7 13.7599 7 14.0399 7 14.6V21M21 9.32548V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H14.6745C15.1637 3 15.4083 3 15.6385 3.05526C15.8425 3.10425 16.0376 3.18506 16.2166 3.29472C16.4184 3.4184 16.5914 3.59135 16.9373 3.93726L20.0627 7.06274C20.4086 7.40865 20.5816 7.5816 20.7053 7.78343C20.8149 7.96237 20.8957 8.15746 20.9447 8.36154C21 8.59171 21 8.8363 21 9.32548Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p>Save Changes</p>{" "}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

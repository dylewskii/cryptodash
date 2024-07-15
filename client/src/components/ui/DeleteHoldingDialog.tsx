// react
import { useNavigate } from "react-router-dom";
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
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
// utils
import { capitalizeFirstLetter } from "@/lib";
import { useDialog } from "@/hooks/useDialog";
// types
import { DetailedCoin } from "@/types";
import { API_BASE_URL } from "@/config";

interface DeleteHoldingDialogProps {
  coin: DetailedCoin;
}

export default function DeleteHoldingDialog({
  coin,
}: DeleteHoldingDialogProps) {
  const {
    dialogOpen,
    dialogErrorMsg,
    pendingRequests,
    handleDialogToggle,
    handleRequest,
  } = useDialog();
  const accessToken = useUserStore((state) => state.accessToken);
  const { toast } = useToast();
  const navigate = useNavigate();

  const deleteHolding = async () => {
    try {
      const coinToDelete = coin.id;
      const response = await handleRequest(
        `${API_BASE_URL}/portfolio/delete`,
        "DELETE",
        { coinId: coinToDelete },
        `${capitalizeFirstLetter(coinToDelete)} holding has been deleted.`,
        `Failed to delete ${coin.name}.`,
        accessToken,
        "deleteHolding"
      );

      if (!response) {
        throw new Error("Failed to delete holding.");
      }

      navigate("/app/home");
    } catch (err) {
      console.error("Error deleting holding:", err);
      toast({
        title: "Failed to delete holding. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogToggle}>
      <DialogTrigger className="min-w-[100px] text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-red-500 hover:bg-red-700">
        <svg
          className="h-4 w-4 mr-1"
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
        Delete
      </DialogTrigger>

      <DialogContent className="max-w-[525px] p-10">
        <DialogHeader>
          <DialogTitle className="pb-4">Delete {coin.name} Holding</DialogTitle>
          <DialogDescription className="pb-4">
            Are you sure you want to delete your holding of {coin.name}? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="text-red-600">{dialogErrorMsg}</div>
        <DialogFooter className="flex flex-row justify-center">
          <Button
            disabled={pendingRequests["deleteHolding"]}
            variant="destructive"
            type="submit"
            onClick={deleteHolding}
            className="max-w-[50%]"
          >
            {pendingRequests["deleteHolding"] ? (
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
                <p>Delete Holding</p>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

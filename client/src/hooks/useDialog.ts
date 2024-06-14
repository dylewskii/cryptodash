import { useState } from "react";
import { useToast } from "../components/ui/use-toast";

export function useDialog(initialState: boolean = false) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(initialState);
  const [dialogErrorMsg, setDialogErrorMsg] = useState<string>("");
  const [dialogReqPending, setDialogReqPending] = useState(false);
  const { toast } = useToast();

  const handleDialogToggle = () => {
    setDialogOpen(!dialogOpen);
    setDialogErrorMsg("");
  };

  const handleRequest = async (
    url: string,
    method: string,
    body: object,
    successMessage: string,
    errorMessage: string
  ) => {
    const options: RequestInit = {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    setDialogReqPending(true);
    try {
      const res = await fetch(url, options);
      const data = await res.json();

      if (!data.success) {
        setDialogErrorMsg(errorMessage);
        return;
      }

      toast({
        title: successMessage,
        duration: 3000,
      });
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setDialogErrorMsg("An error occurred while processing your request.");
    } finally {
      setDialogReqPending(false);
    }
  };

  return {
    dialogOpen,
    dialogErrorMsg,
    setDialogErrorMsg,
    dialogReqPending,
    handleDialogToggle,
    handleRequest,
  };
}

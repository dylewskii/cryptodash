import { useState } from "react";
import { useToast } from "../components/ui/use-toast";

export function useDialog(initialState: boolean = false) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(initialState);
  const [dialogErrorMsg, setDialogErrorMsg] = useState<string>("");
  const [pendingRequests, setPendingRequests] = useState<
    Record<string, boolean>
  >({});
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
    errorMessage: string,
    accessToken: string,
    requestId: string
  ) => {
    const options: RequestInit = {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    };

    setPendingRequests((prev) => ({ ...prev, [requestId]: true }));
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        setDialogErrorMsg(errorMessage);
        return false;
      }

      const data = await response.json();

      if (!data.success) {
        setDialogErrorMsg(errorMessage);
        return false;
      }

      toast({
        title: successMessage,
        duration: 3000,
      });
      setDialogOpen(false);
      return true;
    } catch (err) {
      console.error(err);
      setDialogErrorMsg("An error occurred while processing your request.");
      return false;
    } finally {
      setPendingRequests((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  return {
    dialogOpen,
    dialogErrorMsg,
    setDialogErrorMsg,
    pendingRequests,
    handleDialogToggle,
    handleRequest,
  };
}

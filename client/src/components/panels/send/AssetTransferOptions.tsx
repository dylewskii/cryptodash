// ui
import { Button } from "@/components/ui/button";

export default function AssetTransferOptions() {
  return (
    <div className="flex justify-center gap-4">
      <Button className="bg-orange-950 text-white px-10 py-6 w-44 rounded-xl hover:bg-orange-900">
        Send
      </Button>
      <Button className="bg-orange-500 text-white px-10 py-6 w-44 rounded-xl hover:bg-orange-300">
        Receive
      </Button>
    </div>
  );
}

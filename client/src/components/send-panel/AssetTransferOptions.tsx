import { Button } from "@/components/ui/button";

export default function AssetTransferOptions() {
  return (
    <div className="flex justify-center gap-4">
      <Button className="bg-white text-black px-10 w-34 rounded-xl">
        Send
      </Button>
      <Button className="bg-zinc-400 text-white px-10 w-34 rounded-xl">
        Receive
      </Button>
    </div>
  );
}

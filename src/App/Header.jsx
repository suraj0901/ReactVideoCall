import { Input } from "@/components/ui/input";
import { Copy, Phone } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";

export function Header({ id, startCall }) {
  const [remoteId, setRemoteId] = useState();

  const handleCall = async () => {
    await startCall(remoteId);
    setRemoteId("");
  };

  const handleCopy = () => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(id);
    toast.success(`Copied to clipboard ${id}`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-baseline">
      <div className="flex gap-2 items-center">
        <h1>
          <span className="font-semibold uppercase">Your Peer Id</span> : {id}
        </h1>
        <Button disabled={!id} onClick={handleCopy} variant="ghost">
          <Copy />
        </Button>
      </div>
      <section className="flex gap-2">
        <Input
          value={remoteId}
          onChange={({ target }) => setRemoteId(target.value)}
          placeholder="Enter Called Id"
          className="w-[348px]"
        />
        <Button
          disabled={!remoteId}
          onClick={handleCall}
          variant="secondary"
          className="rounded-lg text-lg"
        >
          <Phone />
        </Button>
      </section>
    </div>
  );
}

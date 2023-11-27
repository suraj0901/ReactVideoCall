import {
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react";
import { Button } from "../components/ui/button";

/**
 * @param {Object} param0
 * @param {boolean} param0.isActive
 * @param {Stream} param0.localStream
 * @param {boolean} param0.chatOpen
 * @param {() => void} param0.handleDecline
 * @param {() => void} param0.toggleChat
 */
export function ControllButtons({
  isActive,
  localStream,
  handleDecline,
  chatOpen,
  toggleChat,
}) {
  return (
    <div className="flex gap-4 mx-auto w-min">
      <Button
        disabled={!isActive}
        onClick={handleDecline}
        variant="destructive"
        className="rounded-full py-8"
      >
        <PhoneOff size={30} />
      </Button>
      <Button
        disabled={!isActive}
        onClick={localStream.toggleMic}
        variant={localStream.mic ? "secondary" : ""}
        className="rounded-full py-8"
      >
        {localStream.mic ? <Mic size={30} /> : <MicOff size={30} />}
      </Button>
      <Button
        disabled={!isActive}
        onClick={localStream.toggleCamera}
        variant={localStream.camera ? "secondary" : ""}
        className="rounded-full py-8"
      >
        {localStream.camera ? <Video size={30} /> : <VideoOff size={30} />}
      </Button>

      <Button
        disabled={!isActive}
        onClick={toggleChat}
        variant={!chatOpen ? "secondary" : ""}
        className="rounded-full py-8"
      >
        <MessageSquare size={30} />
      </Button>
    </div>
  );
}

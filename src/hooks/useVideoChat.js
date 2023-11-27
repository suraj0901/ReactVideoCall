import PeerJsWrapper from "@/lib/Wrapper";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

/**@typedef {("idle"|"connected"|"incoming"|"calling")} CallState */

const useVideoChat = (constraint) => {
  /**@type {[PeerJsWrapper, (state:PeerJsWrapper) => void]} */
  const [peer, setPeer] = useState({});
  /**@type {[{CallState}, (state:CallState) => void]} */
  const [callState, setCallState] = useState();
  const [id, setId] = useState();

  const localRef = useRef();
  const remoteRef = useRef();

  useEffect(() => {
    const peer = new PeerJsWrapper({
      constraint,
      localElement: localRef.current,
      remoteElement: remoteRef.current,
      onError(err) {
        toast.error(err);
      },
      onOpen(id) {
        setId(id);
      },
      onCallSateChange(state) {
        setCallState(state);
      },
    });

    setPeer(peer);
    return () => {
      peer.destroy();
    };
  }, []);

  return { peer, callState, id, localRef, remoteRef };
};
export default useVideoChat;

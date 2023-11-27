import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useStream } from "./useStream";

export const usePeer = ({ constraint }) => {
  /**@type {[Peer, (peer:Peer) => void]} */
  const [peer, setPeer] = useState();
  const [id, setId] = useState();
  const localStream = useStream();
  const remoteStream = useStream();
  const currentConnection = useRef();
  const [messageList, setMessageList] = useState([]);

  /**@type {[import("@/lib/Wrapper").CallState, (state:import("@/lib/Wrapper").CallState) => void]}  */
  const [callState, setCallState] = useState("idle");

  const endCall = () => {
    localStream.stopStream();
    remoteStream.stopStream();
    /**@type {import("peerjs").MediaConnection} */
    const connection = currentConnection.current;
    if (connection) {
      connection.close();
      currentConnection.current = null;
    }

    setCallState("idle");
  };

  const handleDeclinedCall = (peerId) => {
    /**@type {import("peerjs").MediaConnection} */
    const connection = currentConnection.current;
    if (!connection || connection.open || connection.peer !== peerId) return;
    toast(`Call Declined by ${peerId}`);
    endCall();
  };

  const handleDecline = () => {
    /**@type {import("peerjs").MediaConnection} */
    const connection = currentConnection.current;
    if (!connection) return;
    if (connection.open) {
      endCall();
    } else {
      const dataConnection = peer.connect(connection.peer);
      dataConnection.on("open", () => {
        dataConnection.send(JSON.stringify({ type: "Decline" }));
        dataConnection.close();
        endCall();
      });
    }
  };

  const handleError = (error) => {
    console.error(error);
    toast.error(error.toString());
    endCall();
  };

  /**@param {string} callerId */
  const startCall = async (callerId) => {
    if (
      callState !== "idle" ||
      !callerId?.trim() ||
      !peer ||
      !localStream.getVideoElement() ||
      !remoteStream.getVideoElement()
    )
      return;
    setCallState("calling");
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraint)
      setCallState("connected");
      localStream.startStream(stream);
      const connection = peer.call(callerId, stream);
      const dataChannel = connection.peerConnection.createDataChannel("chat")
      handleChatMessage(dataChannel)
      connection.on("stream", remoteStream.startStream);
      connection.on("close", () => {
        endCall();
        toast.success("Call ended");
      });
      connection.on("error", handleError);
      currentConnection.current = connection;
    } catch (error) {
      handleError(error);
    }
  };

  /**@param {import("peerjs").MediaConnection} connection */
  const handleChatMessage = (dataChannel) => {
    dataChannel.addEventListener("message", (e) => {
      toast(e.data);
      setMessageList(prev => [...prev, { text: e.data, self: false }])
    });
  };

  const sendMessage = (message) => {
    /**@type {import("peerjs").MediaConnection} */
    const connection = currentConnection.current;
    if (!connection || !message) return;
    connection.dataChannel.send(message);
    setMessageList((prev) => [...prev, { text: message, self: true }]);
  };

  const answerCall = async () => {
    /**@type {import("peerjs").MediaConnection} */
    const connection = currentConnection.current;
    if (!connection) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraint)
      setCallState("connected");
      localStream.startStream(stream);
      connection.answer(stream);
      connection.peerConnection.addEventListener("datachannel", ({ channel }) => {
        handleChatMessage(channel);
      })
      connection.on("stream", remoteStream.startStream);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const peer = new Peer();
    setPeer(peer);
    peer.on("connection", (connection) => {
      connection.on("open", () => {
        console.log(`${connection.peer} connected`);
      });
      connection.on("data", (data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.type === "Decline") {
          handleDeclinedCall(connection.peer);
        }
      });
    });
    peer.on("open", setId);
    peer.on("error", (error) => {
      let message = error.message;
      console.log({ error });
      if (error.type === "disconnected") {
        message = "Disconnected from Server";
      } else if (error.type === "browser-incompatible") {
        message = "Your Bowser do not support webRTC. Sorry!!";
      } else if (error.type === "server-error") {
        message = "Please Connect to internet";
      }
      handleError(message);
    });
    peer.on("call", async (call) => {
      currentConnection.current = call;
      call.on("close", () => {
        endCall();
        toast.success("Call ended");
      });
      call.on("error", handleError);
      setCallState("incoming");
    });
    return () => {
      peer?.destroy();
    };
  }, []);

  return {
    id,
    callerId: currentConnection?.current?.peer ?? "",
    startCall,
    answerCall,
    handleDecline,
    sendMessage,
    messageList,
    localStream,
    remoteStream,
    callState,
  };
};

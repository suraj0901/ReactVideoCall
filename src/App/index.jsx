import { usePeer } from "@/hooks/usePeer";
import useToggle from "@/hooks/useToggle";
import { Toaster } from "react-hot-toast";
import ChatCard from "./ChatCard";
import { ControllButtons } from "./ControllButtons";
import { Header } from "./Header";
import IncommingCallDialog from "./IncommingCallDialog";

const CONSTRAINT = {
  video: true,
  audio: true,
};

function App() {
  const [chatOpen, toggleChat] = useToggle(false);

  const {
    id,
    callerId,
    callState,
    localStream,
    remoteStream,
    messageList,
    answerCall,
    startCall,
    handleDecline,
    sendMessage,
  } = usePeer({
    constraint: CONSTRAINT,
  });

  const isActive = callState !== "idle";
  const incomingCall = callState === "incoming";

  return (
    <div className="bg-background text-foreground min-w-screen min-h-screen flex">
      <div
        className={`flex px-4 xl:px-0 flex-col py-4 gap-4 w-full mx-auto transition-all duration-300 ease-in-out ${
          !chatOpen ? "max-w-screen-xl" : "max-w-screen-2xl"
        }`}
      >
        <Header {...{ id, startCall }} />
        <div
          className={`flex-1 flex overflow-hidden ${
            chatOpen ? "gap-2" : "gap-0"
          }`}
        >
          <div className={`w-full relative`}>
            <video
              ref={remoteStream.ref}
              className="absolute rounded-xl w-full h-full inset-0 shadow-2xl dark:bg-slate-900"
            />
            <video
              muted
              autoPlay
              ref={localStream.ref}
              className="absolute rounded-xl h-1/6 bottom-0 right-0 z-10 shadow-2xl dark:bg-slate-800"
            />
          </div>
          <ChatCard
            chatOpen={chatOpen}
            messageList={messageList}
            sendMessage={sendMessage}
          />
        </div>
        <div className="mb-4">
          <ControllButtons
            {...{ isActive, localStream, handleDecline, chatOpen, toggleChat }}
          />
        </div>
      </div>
      {/*  */}
      <IncommingCallDialog
        {...{ answerCall, callerId, handleDecline, open: incomingCall }}
      />
      <Toaster
        toastOptions={{
          style: {
            background: "hsl(222.2 84% 9%)",
            color: "hsl(210 40% 98%)",
          },
          iconTheme: {
            primary: "hsl(210 40% 98%)",
            secondary: "hsl(217.2 32.6% 17.5%)",
          },
        }}
      />
    </div>
  );
}

export default App;

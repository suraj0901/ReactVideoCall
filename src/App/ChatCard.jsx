import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";

const ChatCard = ({ messageList, chatOpen, sendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <Card
      className={`${
        chatOpen
          ? "translate-x-0 w-[512px] opacity-100"
          : "translate-x-full w-0 opacity-0"
      } relative flex flex-col transition-all h-[790px] ease-in-out duration-300`}
    >
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 overflow-y-scroll flex-1">
        {messageList.map((message) => (
          <div
            className={`flex ${message.self ? "justify-end" : "justify-start"}`}
          >
            <p
              className={`${
                message.self ? "rounded-br-none" : "rounded-bl-none"
              } rounded-lg shadow-xl bg-slate-900 w-fit max-w-[90%] text-justify px-4 py-1 flex items-start gap-4`}
            >
              {message.text}
            </p>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <form
          className="flex items-start gap-1 w-full"
          onSubmit={handleSendMessage}
        >
          <Input
            onChange={({ target }) => setMessage(target.value)}
            value={message}
          />
          <Button type="submit" variant="secondary" size="sm">
            <Send />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
export default ChatCard;

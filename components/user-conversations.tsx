"use client";
import { FormEvent, useState } from "react";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "./ai-elements/prompt-input";
import { useChat } from "@ai-sdk/react";
import type { ChatMessage } from "@/app/api/chat/route";
import { Response } from "@/components/ai-elements/response";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { toast } from "sonner";
import { Message, MessageAvatar, MessageContent } from "./ai-elements/message";
import { DefaultChatTransport } from "ai";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "./ui/card";
import WeatherCard from "./weather-card";
import StockCard from "./stock-card";
type Props = {
  userAvatarSrc: string;
};

export default function UserConversations({ userAvatarSrc }: Props) {
  const formOnSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input) {
      sendMessage({ text: input });
      setInput("");
    }
  };
  const [input, setInput] = useState<string>("");
  const { messages, sendMessage, status } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 max-h-full overflow-y-auto ">
        <Conversation className="relative w-full" style={{ height: "750px" }}>
          <ConversationContent>
            {messages.map((message, i) => (
              <Message from={message.role} key={`${message.id}+${i}`}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        );
                      case "tool-getWeather":
                        switch (part.state) {
                          case "input-streaming":
                            return (
                              <Response key={`${message.id}-getWeather-${i}`}>
                                ⛅Receiving weather request...
                              </Response>
                            );
                          case "output-available":
                            return <WeatherCard output={part.output} />;
                          default:
                            return null;
                        }

                      case "tool-getStockPrice":
                        switch (part.state) {
                          case "input-streaming":
                            return (
                              <Response key={`${message.id}-getWeather-${i}`}>
                                💹 Receiving stock market request...
                              </Response>
                            );
                          case "output-available":
                            return <StockCard output={part.output} />;
                          default:
                            return null;
                        }
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
                <MessageAvatar
                  src={
                    message.role === "user"
                      ? userAvatarSrc
                      : "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
                  }
                />
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      {/* Prompt Input  */}
      <PromptInput
        onSubmit={formOnSubmitHandler}
        className="mt-4 relative shrink-0"
      >
        <PromptInputTextarea
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
          placeholder="Ask a question..."
        />
        <PromptInputToolbar>
          <PromptInputSubmit
            className="absolute right-1 bottom-1"
            disabled={status !== "ready" || !input}
            status={status}
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}

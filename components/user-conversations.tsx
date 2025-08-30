"use client";
import type { ChatMessage } from "@/app/api/chat/route";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Response } from "@/components/ai-elements/response";
import { saveMessage } from "@/lib/db-utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FormEvent, useState } from "react";
import { Message, MessageAvatar, MessageContent } from "./ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "./ai-elements/prompt-input";
import StockCard from "./stock-card";
import WeatherCard from "./weather-card";

type Props = {
  userAvatarSrc: string;
};

export default function UserConversations({ userAvatarSrc }: Props) {
  const [input, setInput] = useState<string>("");
  const { messages, sendMessage, status } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const formOnSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input) {
      sendMessage({ text: input });
      setInput("");
      saveMessage({ content: input, role: "user" });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 min-h-0">
        <Conversation className="h-full">
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
                            return (
                              <WeatherCard
                                output={part.output}
                                key={`${message.id}-getWeather-${i}`}
                              />
                            );
                          default:
                            return null;
                        }

                      case "tool-getStockPrice":
                        switch (part.state) {
                          case "input-streaming":
                            return (
                              <Response key={`${message.id}-getStock-${i}`}>
                                💹 Receiving stock market request...
                              </Response>
                            );
                          case "output-available":
                            return (
                              <StockCard
                                output={part.output}
                                key={`${message.id}-getStock-${i}`}
                              />
                            );
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
      {/* Prompt Input */}
      <div className="flex-shrink-0 p-4 bg-background border-t">
        {" "}
        <PromptInput
          onSubmit={formOnSubmitHandler}
          className="relative w-full max-w-6xl mx-auto"
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
    </div>
  );
}

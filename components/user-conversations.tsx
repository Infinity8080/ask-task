"use client";
import { FormEvent, useState } from "react";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "./ai-elements/prompt-input";
import { useChat } from "@ai-sdk/react";
import { Message, MessageContent } from "./ai-elements/message";
import { Response } from "@/components/ai-elements/response";

export default function UserConversations() {
  const formOnSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };
  const [input, setInput] = useState<string>("");
  const { messages, sendMessage } = useChat();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        {messages.map((message) => (
          <Message from={message.role} key={message.id}>
            <MessageContent>
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <Response key={`${message.id}-${i}`}>
                        {part.text}
                      </Response>
                    );
                  default:
                    return null;
                }
              })}
            </MessageContent>
          </Message>
        ))}
      </div>
      <PromptInput onSubmit={formOnSubmitHandler} className="mt-4 relative">
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
            disabled={false}
            status={"ready"}
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}

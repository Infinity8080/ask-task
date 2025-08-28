import { openai } from "@ai-sdk/openai";
import { groq } from "@ai-sdk/groq";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  console.log(messages);

  const result = streamText({
    model: groq("openai/gpt-oss-20b"),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}


import { groq } from "@ai-sdk/groq";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  InferUITools,
  UIDataTypes,
  stepCountIs,

} from "ai";
import { z } from "zod";
import axios from "axios";
import { saveMessage } from "@/lib/db-utils";
import { getMessagesByUserId } from "@/lib/db-utils";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { messagesSelect } from "@/db/schema";

export type SimpleMessage = {
  role: "user" | "assistant";
  content: string;
};

const tools = {
  getWeather: tool({
    description: "ONLY call this tool when user explicitly asks for weather information and provides a specific city name. Examples: 'What's the weather in London?', 'How's the weather in Tokyo today?'. DO NOT call for greetings, casual conversation, or vague requests.",
    inputSchema: z.object({
      city: z.string().describe("The specific city name mentioned by the user for weather lookup"),
    }),
    execute: async ({ city }) => {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=no`
      );
      const data = response.data;
      const weatherData = {
        location: {
          name: response.data.location.name,
          country: response.data.location.county,
        },
        current: {
          temp_c: data.current.temp_c,
          condition: {
            text: data.current.condition.text,
            code: data.current.condition.code,
          },
        },
      };
      return weatherData;
    },
  }),
  getStockPrice: tool({
    description:
      "Get a structured price card containing real-time stock market data for the requested symbol.DO NOT call for greetings, casual conversation, or vague requests.",
    inputSchema: z.object({
      symbol: z
        .string()
        .describe("Symbol you want to get the stock market data for"),
    }),
    execute: async ({ symbol }) => {
      const response = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINHUBB_API_KEY}`
      );
      const data = response.data;
      const stockData = {
        symbol,
        currentPrice: data.c,
        priceChange: data.d,
        percentChange: data.dp,
        openPrice: data.o,
        highPrice: data.h,
        lowPrice: data.l,
        previousClose: data.pc,
      };
      return stockData;
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  function simplifyMessages(fullMessages: messagesSelect[]): SimpleMessage[] {
    return fullMessages.map(({ role, content }:messagesSelect) => ({
      role:role as SimpleMessage["role"],
      content,
    }));
  }
  const prevMessage = await getMessagesByUserId(session?.user.id as string);
  const prevMessages = simplifyMessages(prevMessage);
  
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();
    
   

    const result = streamText({
      model: groq("openai/gpt-oss-20b"),
      messages: [...prevMessages, ...convertToModelMessages(messages)],
      tools,
      stopWhen: stepCountIs(2),
      onFinish: async (message) => {
        await saveMessage({
          content: message.text,
          role: "assistant",
        });
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log("Error in chat completion:", error);
    return new Response("Failed to process chat request", { status: 500 });
  }
}

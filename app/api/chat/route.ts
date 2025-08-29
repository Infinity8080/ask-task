import { openai } from "@ai-sdk/openai";
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
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";

const tools = {
  getWeather: tool({
    description: "Get the weather for a location",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for"),
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
      "Get a structured price card containing real-time stock market data for the requested symbol.",
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
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();
    console.log(messages);

    const result = streamText({
      model: groq("openai/gpt-oss-20b"),
      messages: convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log("Error streaming chat completion:", error);
    return new Response("Failed to stream chat response ", { status: 500 });
  }
}

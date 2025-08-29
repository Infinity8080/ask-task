import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StockPriceProps } from "@/types/tool-types";

const StockCard = (completeStockData: StockPriceProps) => {
  const stockData = completeStockData.output;
  const isPositive = stockData.priceChange >= 0;

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-2xl">
          ${stockData.currentPrice.toFixed(2)}
        </CardTitle>
        <CardDescription>{stockData.symbol}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`text-lg font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}${stockData.priceChange.toFixed(2)} (
          {isPositive ? "+" : ""}
          {stockData.percentChange.toFixed(2)}%)
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div>
            <span className="text-gray-600">Open:</span>
            <span className="ml-2">${stockData.openPrice.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-600">Previous:</span>
            <span className="ml-2">${stockData.previousClose.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-600">High:</span>
            <span className="ml-2">${stockData.highPrice.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-600">Low:</span>
            <span className="ml-2">${stockData.lowPrice.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard;

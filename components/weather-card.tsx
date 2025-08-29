import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  output: {
    location: {
      name: any;
      country: any;
    };
    current: {
      temp_c: any;
      condition: {
        text: any;
        code: any;
      };
    };
  };
};
const WeatherCard = (part: Props) => {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-2xl">
          {part.output.current.temp_c}°C
        </CardTitle>
        <CardDescription>
          {part.output.location.name}, {part.output.location.country}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">
          {part.output.current.condition.text}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Feels like a{" "}
          {part.output.current.temp_c > 25
            ? "warm"
            : part.output.current.temp_c < 10
            ? "cold"
            : "pleasant"}{" "}
          day
        </p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Current weather conditions • Updated now
        </p>
      </CardFooter>
    </Card>
  );
};

export default WeatherCard;

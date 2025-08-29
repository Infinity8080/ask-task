export type WeatherCardProps = {
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

export type StockPriceProps = {
  output: {
    currentPrice: any;
    priceChange: any;
    percentChange: any;
    openPrice: any;
    highPrice: any;
    lowPrice: any;
    previousClose: any;
    symbol: any;
  };
};

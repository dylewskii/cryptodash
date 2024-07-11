import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DetailedCoin, PortfolioType } from "@/types";
import { useUserStore } from "@/stores/useUserStore";
import { genRandomHexColor } from "@/lib";

const generateChartData = (portfolio: PortfolioType) => {
  if (portfolio.list.length <= 0) {
    return [
      {
        holding: "N/A",
        value: 1,
        fill: "var(--color-chrome)",
      },
    ];
  }

  const chartData = portfolio.detailed.map((coin: DetailedCoin) => ({
    holding: coin.name,
    value: Math.trunc(coin.totalValue),
    fill: genRandomHexColor(),
  }));

  return chartData;
};

const generateChartConfig = (portfolio: PortfolioType): ChartConfig => {
  const config: ChartConfig = {
    coins: { label: "Coins" },
  };

  portfolio.detailed.forEach((coin: DetailedCoin) => {
    config[coin.name.toLowerCase()] = {
      label: coin.name,
      color: genRandomHexColor(),
    };
  });

  return config;
};

export function CustomPieChart() {
  const portfolio = useUserStore((state) => state.portfolio);
  const currentDate = new Date().toDateString();
  const chartData = generateChartData(portfolio);
  const chartConfig = generateChartConfig(portfolio);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Holding Breakdown</CardTitle>
        <CardDescription>Measured in US dollars &#40;$&#41;</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground md:min-w-[350px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {`${chartConfig[payload.holding.toLowerCase()]?.label}`}
                  </text>
                );
              }}
              labelLine={false}
              nameKey="holding"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground pt-5">
          Showing total portfolio breakdown as of, {currentDate}.
        </div>
      </CardFooter>
    </Card>
  );
}

// react
import { useState, useEffect } from "react";
// ui
import { LegendProps, Pie, PieChart } from "recharts";
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
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// store
import { useUserStore } from "@/stores/useUserStore";
// utils
import { genRandomHexColor } from "@/lib";
// types
import { DetailedCoin, PortfolioType } from "@/types";

// custom legend (only shown on small screens)
const CustomChartLegendContent: React.FC<LegendProps> = ({ payload }) => {
  if (!payload) return null;

  return (
    <div className="flex items-center gap-3 pt-3 sm:justify-center">
      {payload.map((item) => (
        <div key={item.value} className="flex items-center gap-1.5">
          <div
            className="h-2 w-2 shrink-0 rounded-[2px]"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

// uses the first 7 colors defined in globabls.css,
// then generates random hex for each subsequent color
const getChartColor = (index: number): string => {
  if (index < 7) {
    return `hsl(var(--chart-${index + 1}))`;
  }
  return genRandomHexColor();
};

// generates chart data using the user's portfolio
const generateChartData = (portfolio: PortfolioType) => {
  if (portfolio.list.length <= 0) {
    return [
      {
        holding: "N/A",
        value: 1,
        fill: getChartColor(0),
      },
    ];
  }

  const chartData = portfolio.detailed.map(
    (coin: DetailedCoin, index: number) => ({
      holding: coin.name,
      value: Math.trunc(coin.totalValue),
      fill: getChartColor(index),
    })
  );

  return chartData;
};

// generates chart config using the user's portfolio
const generateChartConfig = (portfolio: PortfolioType): ChartConfig => {
  const config: ChartConfig = {
    coins: { label: "Coins" },
  };

  portfolio.detailed.forEach((coin: DetailedCoin, index: number) => {
    config[coin.name.toLowerCase()] = {
      label: coin.name,
      color: getChartColor(index),
    };
  });

  return config;
};

export function CustomPieChart() {
  const portfolio = useUserStore((state) => state.portfolio);
  const currentDate = new Date().toDateString();
  const chartData = generateChartData(portfolio);
  const chartConfig = generateChartConfig(portfolio);
  const [isLargeDisplay, setIsLargeDisplay] = useState(
    window.innerWidth >= 768
  );

  // keeps track of screen size to determine if chart legend should show
  useEffect(() => {
    const handleResize = () => {
      setIsLargeDisplay(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card className="flex flex-col overflow-auto">
      <CardHeader className="items-center pb-0">
        <CardTitle>Holding Breakdown</CardTitle>
        <CardDescription>Measured in US dollars &#40;$&#41;</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground min-w-[300px] md:min-w-[450px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              className=""
              data={chartData}
              dataKey="value"
              label={
                isLargeDisplay
                  ? ({ payload, ...props }) => {
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
                          {`${
                            chartConfig[payload.holding.toLowerCase()]?.label
                          }`}
                        </text>
                      );
                    }
                  : false
              }
              labelLine={isLargeDisplay}
              nameKey="holding"
            />
            {!isLargeDisplay && (
              <ChartLegend
                payload={chartData.map((entry, index) => ({
                  value:
                    chartConfig[entry.holding.toLowerCase()]?.label ||
                    entry.holding,
                  type: "square",
                  id: index.toString(),
                  color: entry.fill,
                }))}
                content={<CustomChartLegendContent />}
              />
            )}
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground pt-5 text-center">
          Showing total portfolio breakdown as of, {currentDate}.
        </div>
      </CardFooter>
    </Card>
  );
}

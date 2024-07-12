import { useContext, useEffect, useRef } from "react";
import {
  createChart,
  LineData,
  Time,
  DeepPartial,
  ChartOptions,
  ColorType,
} from "lightweight-charts";
import { ThemeProviderContext } from "../context/ThemeContext";

interface SparkLineChartProps {
  prices: number[];
  className?: string;
  width?: string;
  height?: string;
}

const SparkLineChart = ({
  prices,
  className,
  width = "600px",
  height = "400px",
}: SparkLineChartProps) => {
  const { theme } = useContext(ThemeProviderContext);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  // generate the data points with timestamps
  const data: LineData[] = prices.map((price, index) => {
    const nowInSeconds = Math.floor(Date.now() / 1000);

    // CG sparkline prices are provided for the past 7d (i.e 168 hours)
    // subtract index from 168 (total nr of hrs in 7d) to get the relative position in the past
    // multiply by 3600 (the nr of secs in an hr) to get the offset in secs
    // subtract the offset from the current time to get the exact timestamp
    const time = (nowInSeconds - (168 - index) * 3600) as Time;

    return { value: price, time };
  });

  useEffect(() => {
    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        textColor: theme === "dark" ? "white" : "black",
        background: {
          type: ColorType.Solid,
          color: theme === "dark" ? "#272727" : "#ffffff",
        },
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
      timeScale: {
        visible: false,
      },
      rightPriceScale: {
        visible: false,
      },
      leftPriceScale: {
        visible: false,
      },
      crosshair: { mode: 0 }, // disable crosshair
    };

    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, chartOptions);
      const lineSeries = chart.addLineSeries({
        color: "#F28F3B",
        priceLineVisible: false, // disables the current price line
      });

      lineSeries.setData(data);
      chart.timeScale().fitContent();

      return () => {
        chart.remove();
      };
    }
  }, [data, theme]); // include theme as a dependency to re-render on theme change

  return (
    <div
      className={className}
      ref={chartContainerRef}
      style={{
        width: width,
        height: height,
      }}
    />
  );
};

export default SparkLineChart;

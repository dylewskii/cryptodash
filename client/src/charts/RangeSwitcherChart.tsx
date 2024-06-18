import { useContext, useEffect, useMemo, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  DeepPartial,
  ChartOptions,
} from "lightweight-charts";
import { ThemeProviderContext } from "../context/ThemeContext";

interface RangeSwitcherChartProps {
  dayData: LineData[];
  weekData: LineData[];
  monthData: LineData[];
  yearData: LineData[];
}

const intervalColors: Record<string, string> = {
  "1D": "#F28F3B",
  "1W": "#F28F3B",
  "1M": "#F28F3B",
  "1Y": "#F28F3B",
};

// const chartOptions: DeepPartial<ChartOptions> = {
//   layout: {
//     textColor: "black",
//     background: { color: "white" },
//   },
//   height: 200,
// };

const RangeSwitcherChart: React.FC<RangeSwitcherChartProps> = ({
  dayData,
  weekData,
  monthData,
  yearData,
}) => {
  const { theme } = useContext(ThemeProviderContext);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const seriesesData = useMemo(
    () =>
      new Map<string, LineData[]>([
        ["1D", dayData],
        ["1W", weekData],
        ["1M", monthData],
        ["1Y", yearData],
      ]),
    [dayData, weekData, monthData, yearData]
  );

  const chartOptions: DeepPartial<ChartOptions> = useMemo(() => {
    return {
      layout: {
        textColor: theme === "dark" ? "white" : "black",
        background: { color: theme === "dark" ? "#00000" : "#ffffff" },
      },
      height: 200,
    };
  }, [theme]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;

    const lineSeries = chart.addLineSeries({ color: intervalColors["1D"] });
    lineSeriesRef.current = lineSeries;

    function setChartInterval(interval: string) {
      const data = seriesesData.get(interval);
      if (data) {
        lineSeries.setData(data);
        lineSeries.applyOptions({
          color: intervalColors[interval],
        });
        chart.timeScale().fitContent();
      }
    }

    setChartInterval("1D"); // initial set

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        chart.resize(width, height);
      }
    });

    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [seriesesData, chartOptions]);

  const handleIntervalChange = (interval: string) => {
    if (lineSeriesRef.current && chartRef.current) {
      const lineSeries = lineSeriesRef.current;
      const chart = chartRef.current;
      const data = seriesesData.get(interval);
      if (data) {
        lineSeries.setData(data);
        lineSeries.applyOptions({
          color: intervalColors[interval],
        });
        chart.timeScale().fitContent();
      }
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between pb-6">
        <p className="text-2xl font-semibold">Performance</p>
        <div className="flex flex-row gap-2 mt-2">
          {["1D", "1W", "1M", "1Y"].map((interval) => (
            <button
              key={interval}
              onClick={() => handleIntervalChange(interval)}
              className="px-4 py-2 font-sans text-lg font-medium leading-6 tracking-tight text-gray-800 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 active:bg-gray-400 md:px-6 md:py-2"
            >
              {interval}
            </button>
          ))}
        </div>
      </div>

      <div ref={chartContainerRef} className="w-full h-full relative" />
    </div>
  );
};

export default RangeSwitcherChart;

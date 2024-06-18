import { useEffect, useMemo, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  DeepPartial,
  ChartOptions,
} from "lightweight-charts";

interface RangeSwitcherChartProps {
  dayData: LineData[];
  weekData: LineData[];
  monthData: LineData[];
  yearData: LineData[];
}

const intervalColors: Record<string, string> = {
  "1D": "#2962FF",
  "1W": "rgb(225, 87, 90)",
  "1M": "rgb(242, 142, 44)",
  "1Y": "rgb(164, 89, 209)",
};

const chartOptions: DeepPartial<ChartOptions> = {
  layout: {
    textColor: "black",
    background: { color: "white" },
  },
  height: 200,
};

const RangeSwitcherChart: React.FC<RangeSwitcherChartProps> = ({
  dayData,
  weekData,
  monthData,
  yearData,
}) => {
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

    const handleResize = () => {
      chart.applyOptions({ height: 200 });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [seriesesData]);

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
    <div>
      <div ref={chartContainerRef} className="h-52 relative" />
      <div className="flex flex-row gap-2 mt-2">
        {["1D", "1W", "1M", "1Y"].map((interval) => (
          <button
            key={interval}
            onClick={() => handleIntervalChange(interval)}
            className="font-sans text-lg font-medium leading-6 tracking-tight px-6 py-2 text-gray-800 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 active:bg-gray-400"
          >
            {interval}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RangeSwitcherChart;

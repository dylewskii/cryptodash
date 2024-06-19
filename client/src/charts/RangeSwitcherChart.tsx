import { useContext, useEffect, useMemo, useRef, useState } from "react";
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

const RangeSwitcherChart: React.FC<RangeSwitcherChartProps> = ({
  dayData,
  weekData,
  monthData,
  yearData,
}) => {
  const { theme } = useContext(ThemeProviderContext);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const [selectedInterval, setSelectedInterval] = useState("1D");

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
        background: { color: theme === "dark" ? "#000000" : "#ffffff" },
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
        borderVisible: false,
      },
      priceScale: {
        borderVisible: false,
      },
      height: 200,
    };
  }, [theme]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;

    const areaSeries = chart.addAreaSeries({
      topColor: intervalColors["1D"],
      bottomColor: intervalColors["1D"] + "00", // transparent
      lineColor: intervalColors["1D"],
    });
    areaSeriesRef.current = areaSeries;

    function setChartInterval(interval: string) {
      const data = seriesesData.get(interval);
      if (data) {
        areaSeries.setData(data);
        areaSeries.applyOptions({
          topColor: intervalColors[interval],
          bottomColor: intervalColors[interval] + "00", // transparent
          lineColor: intervalColors[interval],
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
    setSelectedInterval(interval);
    if (areaSeriesRef.current && chartRef.current) {
      const areaSeries = areaSeriesRef.current;
      const chart = chartRef.current;
      const data = seriesesData.get(interval);
      if (data) {
        areaSeries.setData(data);
        areaSeries.applyOptions({
          topColor: intervalColors[interval],
          bottomColor: intervalColors[interval] + "00", // transparent
          lineColor: intervalColors[interval],
        });
        chart.timeScale().fitContent();
      }
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col pb-6 w-fit md:w-full md:flex-row md:items-center md:justify-between">
        <p className="text-2xl font-semibold">Performance</p>
        <div className="flex flex-row p-[1.85px] gap-1 mt-2 border-2 border-activeGray rounded-lg">
          {["1D", "1W", "1M", "1Y"].map((interval) => (
            <button
              key={interval}
              onClick={() => handleIntervalChange(interval)}
              className={`px-[10px] py-[3px] font-medium leading-6 tracking-tight rounded-lg cursor-pointer hover:bg-activeGray hover:text-white active:bg-gray-700 md:px-4 md:py-1 ${
                selectedInterval === interval ? "bg-activeGray text-white" : ""
              }`}
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

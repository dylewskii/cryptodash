import { ThemeProviderContext } from "@/context/ThemeContext";
import {
  createChart,
  ColorType,
  ISeriesApi,
  Time,
  AreaData,
} from "lightweight-charts";
import React, { useContext, useEffect, useRef } from "react";

interface ChartProps {
  data: { timestamp: string; value: number }[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

function BasicChart(props: ChartProps): React.ReactElement {
  const { theme } = useContext(ThemeProviderContext);
  const {
    data,
    colors: {
      backgroundColor = "white",
      lineColor = "#F28F3B",
      textColor = "black",
      areaTopColor = "#F28F3B",
      areaBottomColor = "rgb(242,205,62)",
    } = {},
  } = props;

  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: theme === "dark" ? "#272727" : "#ffffff",
        },
        textColor: theme === "dark" ? "white" : "black",
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });
    chart.timeScale().fitContent();

    const newSeries: ISeriesApi<"Area"> = chart.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });

    const mappedData: AreaData<Time>[] = data.map((item) => ({
      time: (new Date(item.timestamp).getTime() / 1000) as Time, // convert to UNIX timestamp in secs
      value: item.value,
    }));

    newSeries.setData(mappedData);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
    theme,
  ]);

  return <div ref={chartContainerRef} />;
}

export default BasicChart;

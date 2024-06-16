import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ChartComponent from "../../lib/ChartComponent";

const initialData = [
  { time: "2024-12-22", value: 1000.51 },
  { time: "2024-12-23", value: 2000.11 },
  { time: "2024-12-24", value: 3000.31 },
  { time: "2024-12-25", value: 10000.11 },
  { time: "2024-12-26", value: 23000.21 },
  { time: "2024-12-27", value: 45920.0 },
  { time: "2024-12-28", value: 69000.11 },
  { time: "2024-12-29", value: 74000.19 },
  { time: "2024-12-30", value: 81000.31 },
  { time: "2024-12-31", value: 57000.77 },
];

export default function PortfolioPerformance() {
  return (
    <>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartComponent data={initialData} />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
}

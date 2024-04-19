import { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Selector from "../ui/Selector";
import DataContext from "@/context/DataContext";

const fiatList = [
  "Pound Sterling (GBP)",
  "Dollars (USD)",
  "Euro (EUR)",
  "Swiss Franc (CHF)",
  "Yuan (CN)",
];

export default function ConverterCard({ className = "" }) {
  const { cryptoList, loading } = useContext(DataContext);
  const [cryptoValue, setCryptoValue] = useState("");
  const [fiatValue, setFiatValue] = useState("");
  const [cryptoInput, setCryptoInput] = useState("");
  const [currencyInput, setCurrencyInput] = useState("");

  const cryptoCalculation = (e) => {
    setCryptoInput(e.target.value);
  };

  const currencyCalculation = (e) => {
    setCurrencyInput(e.target.value);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={`flex flex-col items-center min-w-min ${className}`}>
      <Card className="w-full">
        <CardHeader className="p-4">
          <CardTitle className="text-lg">Converter</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex flex-col justify-center">
          <Selector
            label="Select a coin"
            items={cryptoList}
            value={cryptoValue}
            onChange={setCryptoValue}
          />

          <Input
            className="my-4 text-center text-orange-600"
            type="number"
            value={cryptoInput}
            onChange={(e) => cryptoCalculation(e)}
            placeholder="Crypto Amount"
          />
          {/* --- Conversion SVG --- */}
          <div className="my-4 flex justify-center">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 4v16m0 0l-4-4m4 4l4-4M7 20V4m0 0L3 8m4-4l4 4" />
            </svg>
          </div>
          {/* --- Conversion SVG --- */}
          <Input
            className="my-4 text-center text-orange-600"
            type="number"
            value={currencyInput}
            onChange={(e) => currencyCalculation(e)}
            placeholder="Fiat Amount"
          />
          <Selector
            label="Select a currency"
            items={fiatList}
            value={fiatValue}
            onChange={setFiatValue}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Selector from "../ui/Selector";

const fiatList = [
  "Pound Sterling (GBP)",
  "Dollars (USD)",
  "Euro (EUR)",
  "Swiss Franc (CHF)",
  "Yuan (CN)",
];

export default function ConverterCard({ className = "" }) {
  const [cryptoValue, setCryptoValue] = useState("");
  const [fiatValue, setFiatValue] = useState("");
  const [cryptoInput, setCryptoInput] = useState("");
  const [currencyInput, setCurrencyInput] = useState("");

  const [cryptoList, setCryptoList] = useState([]);

  const cryptoCalculation = (e) => {
    setCryptoInput(e.target.value);
  };

  const currencyCalculation = (e) => {
    setCurrencyInput(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const cache = localStorage.getItem("cryptoData");
      if (cache) {
        const { data, timestamp } = JSON.parse(cache);
        const hoursElapsed = (Date.now() - timestamp) / 1000 / 3600;
        if (hoursElapsed < 24) {
          setCryptoList(data);
          return;
        }
      }
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=500&page=1`
      );
      const data = await response.json();
      const coinNames = data.map((coin) => coin.name);
      localStorage.setItem(
        "cryptoData",
        JSON.stringify({ data: coinNames, timestamp: Date.now() })
      );
      setCryptoList(coinNames);
    };
  }, []);

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
          {/* Conversion Arrow Icon */}
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

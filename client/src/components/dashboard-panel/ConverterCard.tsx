import { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Selector from "../ui/Selector";
import DataContext from "@/context/DataContext";

interface PriceCacheEntry {
  value: number;
  timestamp: number;
}

interface PriceCache {
  [key: string]: PriceCacheEntry;
}

const fiatList = [
  "Pound Sterling (GBP)",
  "Dollars (USD)",
  "Euro (EUR)",
  "Swiss Franc (CHF)",
  "Yuan (CN)",
];

export default function ConverterCard({ className = "" }) {
  const { cryptoList, loading } = useContext(DataContext);
  const [priceCache, setPriceCache] = useState<PriceCache>({});

  const [cryptoValue, setCryptoValue] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");

  const [fiatAmount, setFiatAmount] = useState("");
  const [fiatValue, setFiatValue] = useState("");

  // fetch specified crypto $ value, use cached value if present and fresh
  const getCryptoDollarValue = async (coinName: string): Promise<number> => {
    const currentTime = new Date().getTime();
    const cacheEntry = priceCache[coinName];

    // check if data exists and is < 1hr old
    if (cacheEntry && currentTime - cacheEntry.timestamp < 3600000) {
      console.log("Using cached data for", coinName);
      return cacheEntry.value;
    }

    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinName.toLowerCase()}`
      );
      const data = await res.json();
      const dollarValue = data.market_data.current_price.usd;

      setPriceCache({
        ...priceCache,
        [coinName]: {
          value: dollarValue,
          timestamp: currentTime,
        },
      });

      console.log("Fetched new data for", coinName);
      return dollarValue;
    } catch (error) {
      console.error("Failed to fetch crypto dollar value:", error);
      return 0;
    }
  };

  const cryptoToFiatCalculation = async (e) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setCryptoAmount("");
      setFiatAmount("");
      return;
    }

    setCryptoAmount(inputValue);

    const cryptoAmountInt = parseInt(inputValue, 10);
    const cryptoCurrentPrice = await getCryptoDollarValue(cryptoValue);
    const total = cryptoAmountInt * cryptoCurrentPrice;
    setFiatAmount(`${total}`);
  };

  const fiatToCryptoCalculation = (e) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setCryptoAmount("");
      setFiatAmount("");
      return;
    }

    setFiatAmount(inputValue);

    console.log(e.target.value);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={`flex flex-col items-center min-w-min ${className}`}>
      <Card className="w-full">
        <CardHeader className="p-4">
          <CardTitle className="text-lg">Converter</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex flex-col justify-center">
          {/* CRYPTO SELECTOR */}
          <Selector
            label="Select a coin"
            items={cryptoList}
            value={cryptoValue}
            onChange={(newCryptoValue) => setCryptoValue(newCryptoValue)}
          />

          {/* CRYPTO VALUE */}
          <Input
            className="my-4 text-center text-orange-600"
            type="number"
            value={cryptoAmount}
            onChange={cryptoToFiatCalculation}
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
          {/* --- conversion svg --- */}
          {/* FIAT VALUE */}
          <Input
            className="my-4 text-center text-orange-600"
            type="number"
            value={fiatAmount}
            onChange={(e) => fiatToCryptoCalculation(e)}
            placeholder="Fiat Amount"
          />
          {/* FIAT SELECTOR */}
          <Selector
            label="Select a currency"
            items={fiatList}
            value={fiatValue}
            onChange={(newFiatValue) => setFiatValue(newFiatValue)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

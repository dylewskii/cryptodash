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
  const { cryptoList, loading, getCryptoDollarValue } = useContext(DataContext);

  const [cryptoSelection, setCryptoSelection] = useState("Bitcoin");
  const [cryptoAmount, setCryptoAmount] = useState("");

  const [fiatAmount, setFiatAmount] = useState("");
  const [fiatSelection, setFiatSelection] = useState("Dollars (USD)");

  const cryptoToFiatCalculation = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = e.target.value;

    if (!inputValue) {
      setCryptoAmount("");
      setFiatAmount("");
      return;
    }

    try {
      setCryptoAmount(inputValue);

      const cryptoAmountInt = Number(inputValue);
      const cryptoCurrentPrice = await getCryptoDollarValue(cryptoSelection);
      const total = cryptoAmountInt * cryptoCurrentPrice;
      setFiatAmount(total.toString());
    } catch (err) {
      console.error("error during crypto > fiat conversion", err);
    }
  };

  const fiatToCryptoCalculation = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setCryptoAmount("");
      setFiatAmount("");
      return;
    }

    setFiatAmount(inputValue);

    // check if user has selected a crypto coin to convert to
    if (!cryptoSelection) {
      return;
    }

    // clear the cryptoAmount field before setting a new value
    setCryptoAmount("");

    try {
      const fiatAmountInt = Number(inputValue);

      // obtain cryptoSelection dollar value
      const cryptoCurrentPrice = await getCryptoDollarValue(cryptoSelection);

      // if fiatSelection is not dollar -> convert cryptoSelection dollar value into fiatSelection value
      if (fiatSelection !== "Dollars (USD)") {
        // TODO: GET DOLLAR/fiatSelection RATE THEN CONVERT
        console.log("converting dollar value into other currency");
      }

      const total = Number(fiatAmountInt) / Number(cryptoCurrentPrice);
      setCryptoAmount(total.toString());
    } catch (err) {
      console.error("error during fiat > crypto conversion", err);
    }
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
            value={cryptoSelection}
            onChange={(newCryptoValue) => setCryptoSelection(newCryptoValue)}
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
            value={fiatSelection}
            onChange={(newFiatValue) => setFiatSelection(newFiatValue)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

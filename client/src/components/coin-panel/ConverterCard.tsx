import { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SelectorDropdown from "../ui/SelectorDropdown";
import DataContext from "@/context/DataContext";
import useCryptoDollarValue from "@/hooks/useCryptoDollarValue";

interface ConverterCardProps {
  coinId: string;
  coinName: string;
  className?: string;
}

const fiatList = [
  { id: "GBP", name: "Pound Sterling (GBP)", symbol: "GBP" },
  { id: "USD", name: "Dollars (USD)", symbol: "USD" },
  { id: "EUR", name: "Euro (EUR)", symbol: "EUR" },
  { id: "CHF", name: "Swiss Franc (CHF)", symbol: "CHF" },
  { id: "CN", name: "Yuan (CN)", symbol: "CN" },
];

export default function ConverterCard({
  coinId,
  coinName,
  className = "",
}: ConverterCardProps) {
  const { loading } = useContext(DataContext);
  const { getCryptoDollarValue } = useCryptoDollarValue();

  // const [cryptoSelection, setCryptoSelection] = useState<string>("");
  const [cryptoAmount, setCryptoAmount] = useState<string>("");

  const [fiatAmount, setFiatAmount] = useState<string>("");
  const [fiatSelection, setFiatSelection] = useState<string>("Dollars (USD)");

  /** -----------------------------------------------------------------------------------------------
   * Sets the fiatAmount input state to the value of the entered crypto amount.
   *
   * This function first checks if an input is empty and clears relevant states. It then calculates
   * the equivalent fiat amount based on the current market price of the selected crypto coin.
   *
   * @param e the event object.
   * @returns {void} does NOT return a value but updates the state for fiatAmount based on the crypto input and selected crypto.
   */
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
      const cryptoCurrentPrice = await getCryptoDollarValue(coinId);
      const total = cryptoAmountInt * cryptoCurrentPrice;

      setFiatAmount("");
      setFiatAmount(total.toString());
    } catch (err) {
      console.error("error during crypto > fiat conversion", err);
      setFiatAmount("");
    }
  };

  /** -----------------------------------------------------------------------------------------------
   * Sets the cryptoAmount input state to the value of the entered fiat amount.
   *
   * This function first checks if an input is empty and clears relevant states. It then calculates
   * the equivalent cryptocurrency amount based on the current market price of the selected crypto coin.
   *
   * @param e the event object.
   * @returns {void} does NOT return a value but updates the state for cryptoAmount based on the fiat input and selected crypto coin.
   */
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

    try {
      const fiatAmountInt = Number(inputValue);

      // obtain cryptoSelection dollar value
      const cryptoCurrentPrice = await getCryptoDollarValue(coinId);

      // if fiatSelection is not dollar -> convert cryptoSelection dollar value into fiatSelection value
      if (fiatSelection !== "Dollars (USD)") {
        // TODO: GET DOLLAR/fiatSelection RATE THEN CONVERT
        console.log("converting dollar value into other currency");
      }

      const total = Number(fiatAmountInt) / Number(cryptoCurrentPrice);

      setCryptoAmount("");
      setCryptoAmount(total.toString());
    } catch (err) {
      console.error("error during fiat > crypto conversion", err);
      setCryptoAmount("");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={`flex flex-col items-center min-w-min ${className}`}>
      <Card className="w-full">
        <CardHeader className="p-4">
          <CardTitle className="text-2xl">Converter</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex flex-col justify-center">
          <Input
            disabled={true}
            className="text-center text-orange-600"
            type="text"
            value={coinName}
            placeholder={coinName}
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
          <SelectorDropdown
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

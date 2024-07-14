// react
import { useState } from "react";
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FiatSelectorDropdown from "@/components/ui/FiatSelectorDropdown";
import useCryptoFiatValues from "@/hooks/useCryptoFiatValues";
// types
import { DetailedCoin } from "@/types";

interface ConverterCardProps {
  coin: DetailedCoin | null;
  className?: string;
}

const fiatList = [
  { id: "gbp", name: "Pound Sterling (GBP)", symbol: "GBP" },
  { id: "usd", name: "Dollars (USD)", symbol: "USD" },
  { id: "eur", name: "Euro (EUR)", symbol: "EUR" },
  { id: "chf", name: "Swiss Franc (CHF)", symbol: "CHF" },
  { id: "cny", name: "Chinese Yuan (CN)", symbol: "CNY" },
  { id: "aed", name: "UAE Dirham (AED)", symbol: "AED" },
  { id: "aud", name: "Australian Dollar (AUD)", symbol: "AUD" },
  { id: "jpy", name: "Japanese Yen (JPY)", symbol: "JPY" },
  { id: "cad", name: "Canadian Dollar (CAD)", symbol: "CAD" },
  { id: "pln", name: "Polish Zloty (PLN)", symbol: "PLN" },
  { id: "rub", name: "Russian Ruble (RUB)", symbol: "RUB" },
  { id: "sek", name: "Swedish Krona (SEK)", symbol: "SEK" },
  { id: "try", name: "Turkish Lira (TRY)", symbol: "TRY" },
  { id: "ars", name: "Argentine Peso (ARS)", symbol: "ARS" },
  { id: "mxn", name: "Mexican Peso (MXN)", symbol: "MXN" },
  { id: "clp", name: "Chilean Peso (CLP)", symbol: "CLP" },
  { id: "thb", name: "Thai Baht (THB)", symbol: "THB" },
  { id: "sgd", name: "Singapore Dollar (SGD)", symbol: "SGD" },
  { id: "inr", name: "Indian Rupee (INR)", symbol: "INR" },
];

export default function ConverterCard({
  coin,
  className = "",
}: ConverterCardProps) {
  const { getCryptoFiatValues } = useCryptoFiatValues();

  const [cryptoAmount, setCryptoAmount] = useState<string>("");
  const [fiatAmount, setFiatAmount] = useState<string>("");
  const [fiatSelection, setFiatSelection] = useState<string>("Dollars (USD)");

  if (!coin || !coin.info) {
    return (
      <Card className="flex flex-col items-center justify-center mb-4 w-full h-[150px] rounded-xl dark:bg-zinc-700">
        <CardTitle className="flex items-center gap-2">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 4V2M15 20V22M4 9H2M20 15H22M4.91421 4.91421L3.5 3.5M19.0858 19.0858L20.5 20.5M12 17.6569L9.87868 19.7782C8.31658 21.3403 5.78392 21.3403 4.22183 19.7782C2.65973 18.2161 2.65973 15.6834 4.22183 14.1213L6.34315 12M17.6569 12L19.7782 9.87868C21.3403 8.31658 21.3403 5.78392 19.7782 4.22183C18.2161 2.65973 15.6834 2.65973 14.1213 4.22183L12 6.34315"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Uh oh, we encountered an error.
        </CardTitle>
        <CardDescription className="max-w-[40%] text-center">
          Please try refreshing the site, or if the error persists, get in touch
          with us.
        </CardDescription>
      </Card>
    );
  }

  /**
   * Grabs the fiatId and the current price of the crypto coin in the selected fiat currency.
   *
   * @param fiatSelection the selected fiat currency as a string.
   * @returns {Promise<{ fiatId: string, cryptoCurrentPrice: number }>} An object containing the fiat ID and the current price of the cryptocurrency.
   */
  const getFiatIdAndPrice = async (
    fiatSelection: string
  ): Promise<{ fiatId: string; cryptoCurrentPrice: number }> => {
    // grab id of the selected fiat currency
    const fiatObject = fiatList.find(({ name }) => name === fiatSelection);
    const fiatId = fiatObject?.id || "usd";
    // grab crypto coin's current price using the currently selected fiat
    const currentPriceData = await getCryptoFiatValues(coin.id);
    const cryptoCurrentPrice = currentPriceData[fiatId];

    // catch undefined value
    if (!cryptoCurrentPrice) {
      console.error(`No price data for fiat currency: ${fiatId}`);
      return { fiatId, cryptoCurrentPrice: 0 };
    }

    return { fiatId, cryptoCurrentPrice };
  };

  /** -----------------------------------------------------------------------------------------------
   * Sets the fiatAmount input state to the value of the entered crypto amount.
   *
   * This function fetches the current price of the crypto coin in the selected fiat currency,
   * calculates the equivalent fiat amount based on the entered crypto amount, and updates the fiatAmount state.
   *
   * @param inputValue the input value as a string.
   * @param selectedFiat the selected fiat currency as a string. Default = current fiat selection state.
   * @returns {void} does NOT return a value but updates the state for fiatAmount based on the crypto input and selected crypto.
   */
  const cryptoToFiatCalculation = async (
    inputValue: string,
    selectedFiat: string = fiatSelection
  ): Promise<void> => {
    try {
      const { cryptoCurrentPrice } = await getFiatIdAndPrice(selectedFiat);

      setCryptoAmount(inputValue);
      const cryptoAmountInt = Number(inputValue);
      const total = cryptoAmountInt * cryptoCurrentPrice;
      setFiatAmount(total.toString());
    } catch (err) {
      console.error("error during crypto > fiat conversion", err);
      setFiatAmount("");
    }
  };

  /** -----------------------------------------------------------------------------------------------
   * Sets the cryptoAmount input state to the value of the entered fiat amount.
   *
   * This function fetches the current price of the cryptocurrency in the selected fiat currency,
   * calculates the equivalent crypto amount based on the entered fiat amount, and updates the cryptoAmount state.
   *
   * @param inputValue the input value as a string.
   * @param selectedFiat the selected fiat currency as a string. Default = current fiat selection state.
   * @returns {void} does NOT return a value but updates the state for cryptoAmount based on the fiat input and selected crypto coin.
   */
  const fiatToCryptoCalculation = async (
    inputValue: string,
    selectedFiat: string = fiatSelection
  ): Promise<void> => {
    try {
      const { cryptoCurrentPrice } = await getFiatIdAndPrice(selectedFiat);

      setFiatAmount(inputValue);
      const fiatAmountInt = Number(inputValue);
      const total = fiatAmountInt / cryptoCurrentPrice;
      setCryptoAmount(total.toString());
    } catch (err) {
      console.error("error during fiat > crypto conversion", err);
      setCryptoAmount("");
    }
  };

  /**
   * Handles the change of the selected fiat currency.
   *
   * This function updates the fiatSelection state, fetches the current price of the selected cryptocurrency in the new fiat currency,
   * and updates the fiatAmount state based on the current cryptoAmount.
   *
   * @param selectedFiat the selected fiat currency as a string.
   * @returns {void} does NOT return a value but updates the state for fiatAmount based on the current cryptoAmount and selected fiat currency.
   */
  const handleFiatSelectionChange = async (
    selectedFiat: string
  ): Promise<void> => {
    try {
      setFiatSelection(selectedFiat);

      if (cryptoAmount) {
        await cryptoToFiatCalculation(cryptoAmount, selectedFiat);
      }
    } catch (err) {
      console.error(
        "error during crypto > fiat conversion when fiat toggled",
        err
      );
      setFiatAmount("");
    }
  };

  return (
    <div className={`flex flex-col items-center min-w-min ${className}`}>
      <Card className="w-full">
        <CardHeader className="p-4">
          <CardTitle className="text-2xl mx-auto">Converter</CardTitle>
        </CardHeader>
        <CardContent className="px-12 pt-0 flex flex-col justify-center">
          <Input
            id="crytoCoin"
            name="cryptoCoin"
            disabled={true}
            className="text-center bg-zinc-200 font-medium disabled:text-black disabled:opacity-100"
            type="text"
            value={coin.name}
            placeholder={coin.name}
          />
          {/* CRYPTO AMOUNT */}
          <Input
            className="my-4 text-center"
            id="cryptoAmount"
            name="cryptoAmount"
            type="number"
            value={cryptoAmount}
            onChange={(e) => {
              const inputValue = e.target.value;

              if (!inputValue) {
                setCryptoAmount("");
                setFiatAmount("");
                return;
              }

              cryptoToFiatCalculation(inputValue);
            }}
            placeholder="Crypto Amount"
            autoComplete="off"
          />

          {/* --- SVG --- */}
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
          {/* --- SVG --- */}

          {/* FIAT AMOUNT */}
          <Input
            name="fiatAmount"
            id="fiatAmount"
            className="my-4 text-center"
            type="number"
            value={fiatAmount}
            onChange={(e) => {
              const inputValue = e.target.value;

              if (!inputValue) {
                setCryptoAmount("");
                setFiatAmount("");
                return;
              }

              fiatToCryptoCalculation(inputValue);
            }}
            placeholder="Fiat Amount"
            autoComplete="off"
          />
          {/* FIAT SELECTOR */}
          <FiatSelectorDropdown
            label="Select a currency"
            items={fiatList}
            value={fiatSelection}
            onChange={(selectedFiat) => {
              handleFiatSelectionChange(selectedFiat);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

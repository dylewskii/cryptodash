// react
import { useState } from "react";
// components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FiatSelectorDropdown from "@/components/ui/FiatSelectorDropdown";
import useCryptoFiatValues from "@/hooks/useCryptoFiatValues";
// types
import { DetailedCoin } from "@/types";

interface ConverterCardProps {
  coin: DetailedCoin;
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
          <CardTitle className="text-2xl">Converter</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex flex-col justify-center">
          <Input
            disabled={true}
            className="text-center bg-zinc-200 font-medium disabled:text-black disabled:opacity-100"
            type="text"
            value={coin.name}
            placeholder={coin.name}
          />
          {/* CRYPTO AMOUNT */}
          <Input
            className="my-4 text-center text-orange-600"
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
            className="my-4 text-center text-orange-600"
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

import { useState } from "react";
import CoinSelection from "./CoinSelection";
import SwapSelection from "./SwapSelection";
import "./swapPanel.css";

export default function SwapPanel() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [coinSelectionActive, setCoinSelectionActive] =
    useState<boolean>(false);

  return <>{coinSelectionActive ? <CoinSelection /> : <SwapSelection />}</>;
}

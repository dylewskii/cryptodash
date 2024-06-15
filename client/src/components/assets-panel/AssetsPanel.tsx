import PortfolioCard from "../dashboard-panel/PortfolioCard";
import TotalBalance from "../dashboard-panel/TotalBalance";
import HoldingBreakdown from "./HoldingBreakdown";

export default function AssetsPanel() {
  return (
    <>
      <section>
        <TotalBalance />
        <PortfolioCard />
        <HoldingBreakdown />
      </section>
    </>
  );
}

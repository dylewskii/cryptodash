import PortfolioCard from "../dashboard-panel/PortfolioCard";
import TotalBalance from "../dashboard-panel/TotalBalance";
import HoldingBreakdown from "./HoldingBreakdown";
import PortfolioPerformance from "./PortfolioPerformance";

export default function AssetsPanel() {
  return (
    <>
      <section>
        <TotalBalance />
        <PortfolioPerformance />
        <PortfolioCard />
        <HoldingBreakdown />
      </section>
    </>
  );
}

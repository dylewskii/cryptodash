import PortfolioCard from "../dashboard-panel/PortfolioCard";
import TotalBalance from "../dashboard-panel/TotalBalance";
import HoldingBreakdown from "./HoldingBreakdown";
import PortfolioPerformance from "./PortfolioPerformance";

export default function AssetsPanel() {
  return (
    <>
      <section className="flex flex-col gap-4">
        <TotalBalance className="my-4" />
        <PortfolioPerformance />
        <PortfolioCard />
        <HoldingBreakdown />
      </section>
    </>
  );
}

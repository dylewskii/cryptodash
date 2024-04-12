import PortfolioCard from "../dashboard-panel/PortfolioCard";
import TotalBalance from "../dashboard-panel/TotalBalance";

export default function AssetsPanel() {
  return (
    <>
      <section>
        <TotalBalance />
        <PortfolioCard />
      </section>
    </>
  );
}

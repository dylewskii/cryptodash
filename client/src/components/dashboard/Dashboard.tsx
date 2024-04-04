import PortfolioCard from "../portfolio-card/PortfolioCard";
import TopCoins from "./TopCoins";
import TotalBalance from "./TotalBalance";

export default function Dashboard() {
  return (
    <>
      <section className="content-one grid-column-1">
        <TotalBalance />
        <TopCoins />
      </section>
      <section className="content-two grid-column-2 flex flex-col">
        <PortfolioCard />
      </section>
    </>
  );
}

import ConverterCard from "./ConverterCard";
import PortfolioCard from "./PortfolioCard";
import FavoriteCoins from "./FavoriteCoins";
import TotalBalance from "./TotalBalance";
import FGCard from "./FGCard";
import TotalMcapCard from "./TotalMcapCard";
import "./dashboard.css";

export default function Dashboard() {
  return (
    <div className="mt-4 md:grid md:grid-cols-5 md:grid-rows-[auto_auto_auto] md:px-0 md:pr-8 max-w-screen-2xl">
      <section className="col-span-3 row-start-1">
        <TotalBalance />
        <PortfolioCard />
      </section>

      <section className="col-span-5 row-start-2">
        <FavoriteCoins />
      </section>

      <section className="col-start-4 col-span-2 row-start-1 md:mt-24 md:pl-4">
        <ConverterCard />
      </section>

      <section className="col-span-5 row-start-3 mt-4 flex gap-4 justify-between md:justify-start">
        <FGCard />
        <TotalMcapCard />
      </section>
    </div>
  );
}

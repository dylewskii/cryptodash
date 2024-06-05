import PortfolioCard from "./PortfolioCard";
import FavoriteCoins from "./FavoriteCoins";
import TotalBalance from "./TotalBalance";
import "./dashboard.css";

export default function Dashboard() {
  return (
    <div className="mt-4 md:grid md:grid-cols-5 md:grid-rows-[auto_auto_auto] md:px-0 md:pr-8 max-w-screen-2xl">
      <section className="col-span-5 row-start-1">
        <TotalBalance />
        <PortfolioCard />
      </section>

      <section className="col-span-5 row-start-2">
        <FavoriteCoins />
      </section>
    </div>
  );
}

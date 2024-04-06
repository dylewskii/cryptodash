import ConverterCard from "./ConverterCard";
import PortfolioCard from "./PortfolioCard";
import FavoriteCoins from "./FavoriteCoins";
import TotalBalance from "./TotalBalance";

export default function Dashboard() {
  return (
    <>
      <section className="col-span-3">
        <TotalBalance />
        <PortfolioCard />
        <FavoriteCoins />
      </section>
      <section className="grid-col-4 col-span-2">
        <ConverterCard />
      </section>
    </>
  );
}

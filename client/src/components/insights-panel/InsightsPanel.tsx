import TotalMcapCard from "./TotalMcapCard";
import FGCard from "./FGCard";

export default function InsightsPanel() {
  return (
    <section className="flex flex-col gap-4 my-4">
      <div className="col-span-5 row-start-1">
        <TotalMcapCard />
      </div>
      <div className="col-span-5 row-start-1">
        <FGCard />
      </div>
    </section>
  );
}
